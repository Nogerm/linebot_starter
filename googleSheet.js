const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
const keywordTabName = "keyword";

exports.init = async function () {
  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
}

//-------------
// Functions
//-------------
exports.getKeyword = function () {
  return new Promise(async function (resolve, reject) {
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    // read rows
    const rows = await sheet.getRows(); // can pass in { limit, offset }
    console.log(rows);
  });
}
