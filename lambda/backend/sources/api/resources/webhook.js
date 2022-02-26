const sns = require("../../../services/sns");

const EVENT_NAME_WHITELIST = [
  "CourseCreated",
  "CourseUpdated",
  "CourseDeleted",
  "LicenseCreated",
  "LicenseUpdated",
  "LicenseDeleted",
  "PoolEntryCreated",
  "PoolEntryUpdated",
  "PoolEntryDeleted",
  "StudentCreated",
  "StudentUpdated",
  "StudentDeleted",
];

module.exports = async function (body) {
  const { eventName, data } = body;
  if (!eventName || !data) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        'Request body should be json and have "eventName" and "data"'
      ),
    };
  }

  if (!EVENT_NAME_WHITELIST.includes(eventName)) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        eventName: "Event name is wrong",
      }),
    };
  }

  // @todo data validation.

  await sns.publish(`Backend${eventName}`, data);

  return {
    statusCode: 200,
    body: JSON.stringify("Successfully received"),
  };
};
