const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
const keywordTabName = "keyword";

exports.init = async function () {
  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  });
}

//-------------
// Functions
//-------------
exports.getKeywordResponse = function (keyword) {
  return new Promise(async function (resolve, reject) {
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    // read rows
    const sheet = doc.sheetsByTitle[keywordTabName];
    const rows = await sheet.getRows(); // can pass in { limit, offset }
    console.log(rows);

    const index = rows.findIndex(row => {
      return (row.keyword == keyword && row.enable == 'V');
    });
    const isFound = index == -1 ? false : true;
    if(isFound) {
      let resMsg = {}
      if (rows[index].resType === "文字") {
        resMsg = {
          isText: true,
          text: rows[index].resContent
        }
      } else if (rows[index].resType === "貼圖") {
        const stkr = rows[index].resContent.split(',')
        resMsg = {
          isText: false,
          pkgId: stkr[0],
          stkrId: stkr[1]
        }
      }
      const result = {
        "isFound": isFound,
        "resMsg": resMsg
      }
      resolve(result);
    } else {
      const result = {
        "isFound": isFound,
        "resMsg": {}
      }
      resolve(result);
    }
  });
}
