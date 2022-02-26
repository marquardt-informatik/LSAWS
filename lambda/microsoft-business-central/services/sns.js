const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });

const TOPIC_ARN = process.env.SNS_TOPIC_ARN;

async function publish(eventName, body) {
  console.log("SNS event", eventName, JSON.stringify(body));

  return new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish({
      Message: JSON.stringify({
        eventId: uuidv4(),
        eventName,
        body,
      }),
      MessageAttributes: {
        EventName: {
          DataType: "String",
          StringValue: eventName,
        },
      },
      TopicArn: TOPIC_ARN,
    })
    .promise();
}

module.exports = {
  publish,
};
