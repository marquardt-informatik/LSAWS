const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  await microsoft.deleteProduct(body.Id);

  await sns.publish("MicrosoftBusinessCentralProductDeleted", { Id: body.Id });
};
