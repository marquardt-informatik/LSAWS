const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  const license = await microsoft.createLicense({
    licenseId: body["id"],
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

  await sns.publish("MicrosoftBusinessCentralLicenseCreated", license);
};
