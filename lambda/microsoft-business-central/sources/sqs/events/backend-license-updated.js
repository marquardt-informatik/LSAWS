const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  let license = await microsoft.getLicense(body.Id);
  if (!license) {
    throw new Error(`License ${body.Id} not found`);
  }

  license = await microsoft.updateLicense(license, {
    dateOfService: body["date"],
    accountItemId: body["accountItemId"],
    opportunityProductId: body["opportunityProductId"],
    courseId: body["courseId"],
    studentId: body["studentId"],
    quantity: body["quantity"],
    sessionLength: body["sessionLength"],
    attendeeStatus: body["attendeeStatus"],
    sessionStatus: body["sessionStatus"],
    cancelationReason: body["cancelationReason"]
  });

  await sns.publish("MicrosoftBusinessCentralLicenseUpdated", license);
};
