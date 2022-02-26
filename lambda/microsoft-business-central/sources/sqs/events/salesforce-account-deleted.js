const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  await microsoft.deleteContact(body.Id);

  await sns.publish("MicrosoftBusinessCentralContactDeleted", { Id: body.Id });
};
