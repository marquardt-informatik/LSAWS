const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  await microsoft.deleteLicense(body.Id);

  await sns.publish("MicrosoftBusinessCentralLicenseDeleted", { Id: body.Id });
};
