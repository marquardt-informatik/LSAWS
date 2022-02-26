function parseEvent(event) {
  const { ChangeEventHeader } = event.detail;
  const { recordIds } = ChangeEventHeader;
  const [id] = recordIds;

  return {
    id,
    eventName: getEventName(event),
  };
}

function getEventName(event) {
  const { ChangeEventHeader } = event.detail;
  const { entityName, changeType } = ChangeEventHeader;

  if (changeType === "CREATE") {
    return `Salesforce${entityName}Created`;
  }

  if (changeType === "UPDATE") {
    return `Salesforce${entityName}Updated`;
  }

  if (changeType === "DELETE") {
    return `Salesforce${entityName}Deleted`;
  }
}

function getEventSource(event) {
  if (isSQSEvent(event)) {
    return "sqs";
  }

  if (isSalesforceEvent(event)) {
    return "salesforce";
  }

  if (isApiGatewayEvent(event)) {
    return "api";
  }

  return "unknown";
}

function isSQSEvent(event) {
  const { Records } = event;

  return (
    Array.isArray(Records) &&
    Records.length > 0 &&
    Records[0].eventSource === "aws:sqs"
  );
}

function isSalesforceEvent(event) {
  const { source } = event;

  return (
    typeof source === "string" &&
    source.startsWith("aws.partner/appflow/salesforce.com")
  );
}

function isApiGatewayEvent(event) {
  const { requestContext } = event;

  return typeof requestContext === "object" && requestContext.apiId;
}

module.exports = {
  parseEvent,
  getEventSource,
};
