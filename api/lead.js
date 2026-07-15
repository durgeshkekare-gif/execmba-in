const { google } = require("googleapis");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body || {};

    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var not set");

    const keyJson = JSON.parse(raw);
    const auth = new google.auth.GoogleAuth({
      credentials: keyJson,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets   = google.sheets({ version: "v4", auth });
    const sheetId  = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) throw new Error("GOOGLE_SHEET_ID env var not set");

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const firstName = data.firstName || data.fname  || "";
    const lastName  = data.lastName  || data.lname  || "";
    const fullName  = (firstName + " " + lastName).trim();

    // Accept boolean true OR string "on" OR "true" for consent fields
    const boolField = (v) => (v === true || v === "on" || v === "true") ? "Yes" : "No";

    const row = [
      now,
      firstName,
      lastName,
      fullName,
      data.mobile       || data.phone        || "",
      data.email        || "",
      data.experience   || "",
      data.budget       || "",
      data.program      || data.university   || data.specialisation || "",
      data.role         || data.designation  || "",
      data.sourceDomain || "",
      data.sourcePage   || "",
      data.sourceEvent  || "",
      data.utmSource    || "",
      data.utmMedium    || "",
      data.utmCampaign  || "",
      "New",
      data.message      || "",
      boolField(data.consentContact),
      boolField(data.consentPrivacy  || data.consentData),
      boolField(data.consentMarketing),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Lead Capture!A:U",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Lead API error:", err.message, err.stack);
    return res.status(500).json({ error: "Failed", detail: err.message });
  }
};
