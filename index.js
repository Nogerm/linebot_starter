'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const message = require('./message');
const googleSheet = require('./googleSheet');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

// init google sheet
googleSheet.init();

//---------------
// event handler
//---------------
function handleEvent(event) {
  console.log("Event : " + JSON.stringify(event));

  switch (event.type) {
    case 'join':
    case 'follow':
      if (event.source.type == "group") {
        console.log("[join] groupid : " + event.source.groupId);
        console.log("[join] userid : " + event.source.userId);
        process.env.GROUP_ID = event.source.groupId;
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: '謝謝加入，很高興認識大家~'
        });
      }
      break;
    case 'memberJoined':
      const groupId = event.source.groupId;
      const userId = event.joined.members[0].userId;
      client.getGroupMemberProfile(groupId, userId)
        .then(function (profile) {
          console.log("[memberJoined getUserProfile name]" + profile.displayName);

          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: "讓我們一起歡迎" + profile.displayName + "加入!!!"
          });
        })
        .catch(function (error) {
          console.log("[memberJoined getUserProfile name]" + error);
        });
      break;
    case 'message':
      switch (event.message.type) {
        case 'text':
          //auto reply
          googleSheet.getKeyword()
          .then((response) => {
            console.log(response);

            if (result.data.found) {
              console.log("keyword found")

              let msgToSend = {}
              if (result.data.type === "文字") {
                msgToSend = {
                  isText: true,
                  text: result.data.msg
                }
              } else if (result.data.type === "貼圖") {
                const stkr = result.data.msg.split(',')
                msgToSend = {
                  isText: false,
                  pkgId: stkr[0],
                  stkrId: stkr[1]
                }
              }

              messageFactory.replyMsgs([msgToSend], event.replyToken, "");
              return true;
            } else {
              console.log("keyword not found")
            }
          })
      }
      break;
    default:
      break;
  }
}

// Message event example

// {
//   "type": "message",
//   "replyToken": "8bacc0234a5147eaa80f493fc4a74aeb",
//   "source": {
//     "userId": "U911be356817fdf027cdda8352cea59cb",
//     "type": "user"
//   },
//   "timestamp": 1540801124273,
//   "message": {
//     "type": "text",
//     "id": "8785838735289",
//     "text": "1"
//   }
// }

//{
//  "type": "message",
//  "replyToken": "6603176c7a1442908bd4b4ee6815d3e7",
//  "source": {
//    "groupId": "C779658f5ee9d3375736f89bd6c364440",
//    "userId": "U911be356817fdf027cdda8352cea59cb",
//    "type": "group"
//  },
//  "timestamp": 1540801146468,
//  "message": {
//    "type": "text",
//    "id": "8785840232605",
//    "text": "test"
//  }
//}