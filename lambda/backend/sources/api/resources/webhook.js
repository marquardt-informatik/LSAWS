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
  "SessionCreated",
  "SessionUpdated",
  "SessionDeleted"
];

const SESSION_CREATED = process.env.SESSION_CREATED
const SESSION_UPDATED = process.env.SESSION_CREATED
const SESSION_DELETED = process.env.SESSION_CREATED

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
  if (eventName === SESSION_CREATED) {
    eventName = 'LicenseCreated'
  } else if (eventName === SESSION_UPDATED) {
    eventName = 'LicenseUpdated'
  } else if (eventName === SESSION_DELETED) {
    eventName = 'LicenseDeleted'
  }

  await sns.publish(`Backend${eventName}`, data);

  return {
    statusCode: 200,
    body: JSON.stringify("Successfully received"),
  };
};