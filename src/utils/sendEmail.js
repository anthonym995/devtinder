const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, sub, body) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<p>${body}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Simple text mail",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: sub,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const run = async (sub, body) => {
  const sendEmailCommand = createSendEmailCommand("manthonysuresh@gmail.com", "m.antony030@gmail.com", sub, body);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };
