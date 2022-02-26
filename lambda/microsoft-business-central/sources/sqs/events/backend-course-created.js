const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  const course = await microsoft.createCourse({
    courseId: body["id"],
    publicName: body["publicName"],
    opportunityProductId: body['opportunityProductId'],
    courseLength: body["courseLength"],
    sessionLength: body["sessionLength"],
    status: body["status"],
  });

  await sns.publish("MicrosoftBusinessCentralCourseCreated", course);
};
