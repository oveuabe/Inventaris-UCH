import { google } from "googleapis";

export default async function handler(req, res) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GS_CLIENT_EMAIL,
      private_key: process.env.GS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1imNqraQgFRueRxGh2j4gDzOmeUoUlJvxUjqHNBSJZyg";
  const range = "Scanner!A2:D";

  if (req.method === "GET") {
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return res.status(200).json(response.data.values || []);
  }

  if (req.method === "POST") {
    const { rowIndex, kondisi } = req.body;
    const updateRange = `Scanner!D${rowIndex + 2}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "RAW",
      requestBody: { values: [[kondisi]] }
    });
    return res.status(200).json({ status: "updated" });
  }

  return res.status(405).end();
}
