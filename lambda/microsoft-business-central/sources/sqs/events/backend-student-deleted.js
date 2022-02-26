const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  await microsoft.deleteStudent(body.Id);

  await sns.publish("MicrosoftBusinessCentralStudentDeleted", { Id: body.Id });
};
