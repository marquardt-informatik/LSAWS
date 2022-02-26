module.exports = async function (event) {
  event.Records.forEach((record) => {
    const { body } = record;
    const { Message, MessageId } = JSON.parse(body);

    console.log(MessageId, Message);
  });

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};
