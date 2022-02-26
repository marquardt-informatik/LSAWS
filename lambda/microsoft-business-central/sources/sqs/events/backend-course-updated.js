const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;

  let course = await microsoft.getCourse(body.Id);
  if (!course) {
    throw new Error(`Course ${body.Id} not found`);
  }

  course = await microsoft.updateCourse(course, {
    publicName: body["publicName"],
    opportunityProductId: body['opportunityProductId'],
    courseLength: body["courseLength"],
    sessionLength: body["sessionLength"],
    status: body["status"],
  });

  await sns.publish("MicrosoftBusinessCentralCourseUpdated", course);
};
