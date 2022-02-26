const events = require("./events");

module.exports = async function (event) {
  const promises = event.Records.map((record) => {
    const { body } = record;
    const { Message } = JSON.parse(body);

    const recordEvent = JSON.parse(Message);

    return events[recordEvent.eventName](recordEvent);
  });

  await Promise.all(promises);

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};
