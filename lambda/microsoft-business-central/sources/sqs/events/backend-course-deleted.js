const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  await microsoft.deleteCourse(body.Id);

  await sns.publish("MicrosoftBusinessCentralCourseDeleted", { Id: body.Id });
};
