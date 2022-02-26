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
  getEventSource,
};
