const events = require("./events");

module.exports = async function (event) {
  console.log("Salesforce Event", JSON.stringify(event));

  const eventType = event["detail-type"];

  await events[eventType](event);
};
