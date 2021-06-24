const {google} = require('googleapis');
const sheetId = process.env.GOOGLE_SHEET_ID
const keywordTabName = "keyword";

//-------------
// Functions
//-------------
exports.getKeyword = function () {
  return new Promise(async function (resolve, reject) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${keywordTabName}!A2:D3`,
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        rows.map((row) => {
          console.log(`${row[0]}, ${row[1]}`);
        });
      } else {
        console.log('No data found.');
      }
    });
  });
}
