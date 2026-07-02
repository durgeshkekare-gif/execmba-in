const { google } = require("googleapis");

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;

    // Parse service account key from env
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env variable not set");

    const keyJson = JSON.parse(raw);

    const auth = new google.auth.GoogleAuth({
      credentials: keyJson,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) throw new Error("GOOGLE_SHEET_ID env variable not set");

    // Timestamp in IST
    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const firstName = data.firstName || data.fname  || "";
    const lastName  = data.lastName  || data.lname  || "";
    const fullName  = (firstName + " " + lastName).trim();

    const row = [
      now,                                                            // A Timestamp
      firstName,                                                      // B First Name
      lastName,                                                       // C Last Name
      fullName,                                                       // D Full Name
      data.mobile      || data.phone       || "",                     // E Mobile
      data.email       || "",                                         // F Email
      data.experience  || "",                                         // G Work Experience
      data.budget      || "",                                         // H Budget Range
      data.program     || data.university  || data.specialisation || "",// I Program Interest
      data.role        || data.designation || "",                     // J Current Role
      data.sourceDomain  || "",                                       // K Source Domain
      data.sourcePage    || "",                                       // L Source Page
      data.utmSource     || "",                                       // M UTM Source
      data.utmMedium     || "",                                       // N UTM Medium
      data.utmCampaign   || "",                                       // O UTM Campaign
      "New",                                                          // P Status
      data.message       || "",                                       // Q  Notes
      data.consentContact  === "on" ? "Yes" : "No",                   // R  Consent: Contact
      data.consentData     === "on" ? "Yes" : "No",                   // S  Consent: Privacy Policy
      data.consentMarketing === "on" ? "Yes" : "No",                  // T  Consent: Marketing
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Lead Capture!A:Q",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Lead capture error:", err.message);
    return res.status(500).json({ error: "Failed", detail: err.message });
  }
};
