const sns = require("../../../services/sns");
const salesforce = require("../../../services/salesforce");
const { parseEvent } = require("../../../utils");

module.exports = async function (event) {
  const { eventName, id } = parseEvent(event);

  let body = { Id: id };

  // Enrich data if the record is not deleted.
  if (!eventName.endsWith("Deleted")) {
    body = await salesforce.getOpportunity(id);
  }

  await sns.publish(eventName, body);
};
