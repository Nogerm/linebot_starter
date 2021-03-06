'use strict';

const line = require('@line/bot-sdk');
// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

//-------------
// Functions
//-------------
const sendMsgs = function (msgsInput, username) {
  return new Promise(function (resolve, reject) {
    let msgsToSend = [];
    for (const msg of msgsInput) {
      if (msg.isText) {
        //is text
        let output_string = msg.text.replace(/\[USER\]/gi, username);;
        console.log("Text message : " + output_string);
        msgsToSend.push(getTextMsg(output_string));
      } else {
        //is sticker
        console.log("Sticker message : package : " + msg.pkgId + ", id : " + msg.stkrId);
        msgsToSend.push(getStickerMsg(msg.pkgId, msg.stkrId));
      }
    }

    client.pushMessage(process.env.GROUP_ID, msgsToSend)
      .then(() => {
        //result
        console.log("[sendMsgs] Push Success !");
        resolve();
      })
      .catch((err) => {
        // error handling
        console.log("[sendMsgs] Error : " + err);
        reject("Send message error");
      });
  });
}

const replyMsgs = function (msgsInput, reply_token, username) {
  return new Promise(function (resolve, reject) {
    let msgsToSend = [];
    for (const msg of msgsInput) {
      if (msg.isText) {
        //is text
        let output_string = msg.text.replace(/\[USER\]/gi, username);;
        console.log("Text message : " + output_string);
        msgsToSend.push(getTextMsg(output_string));
      } else {
        //is sticker
        console.log("Sticker message : package : " + msg.pkgId + ", id : " + msg.stkrId);
        msgsToSend.push(getStickerMsg(msg.pkgId, msg.stkrId));
      }
    }

    client.replyMessage(reply_token, msgsToSend)
      .then(() => {
        //result
        console.log("[replyMsgs] Reply success !");
        resolve();
      })
      .catch((err) => {
        // error handling
        console.log("[replyMsgs] Reply error : " + err);
        reject(err);
      });
  });
}

//-------------
// Export Functions
//-------------
exports.sendMsgs = sendMsgs;
exports.replyMsgs = replyMsgs;

//-------------
// Messages Object
//-------------
function getTextMsg(text) {
  return {
    type: 'text',
    text: text
  };
}

function getStickerMsg(pkgId, stkId) {
  return {
    type: 'sticker',
    packageId: Number(pkgId),
    stickerId: Number(stkId)
  };
}

function getConfirmMsg() {
  return {
    type: "template",
    altText: "????????????????????????????????????????????????",
    template: {
      type: "confirm",
      text: "????????????",
      actions: [{
        type: "message",
        label: "???????????????",
        text: "1"
      },
      {
        type: "message",
        label: "???????????????",
        text: "2"
      }
      ]
    }
  }
}

function getButtonsMsg() {
  return {
    type: "template",
    altText: "????????????????????????????????????????????????",
    template: {
      type: "buttons",
      text: "????????????",
      actions: [{
        type: "message",
        label: "???????????????",
        text: "1"
      },
      {
        type: "message",
        label: "???????????????",
        text: "2"
      },
      {
        type: "message",
        label: "???????????????",
        text: "3"
      },
      {
        type: "message",
        label: "???????????????",
        text: "4"
      }
      ]
    }
  }
}