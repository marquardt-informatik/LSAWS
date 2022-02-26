resource "aws_sns_topic" "default" {
  name            = "${module.integrated-billing_label.id}-default-topic"
  delivery_policy = file("./policies/sns_delivery_policy.json")

  tags = module.integrated-billing_label.tags
}

resource "aws_sns_topic_subscription" "salesforce" {
  topic_arn = aws_sns_topic.default.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.salesforce.arn

  filter_policy = jsonencode({
    "eventName" : [
      "some-example"
    ]
  })
}

resource "aws_sns_topic_subscription" "microsoft_business_central" {
  topic_arn = aws_sns_topic.default.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.microsoft_business_central.arn

  filter_policy = jsonencode({
    "EventName" : [
      "BackendCourseCreated",
      "BackendCourseUpdated",
      "BackendCourseDeleted",
      "BackendLicenseCreated",
      "BackendLicenseUpdated",
      "BackendLicenseDeleted",
      "BackendStudentCreated",
      "BackendStudentUpdated",
      "BackendStudentDeleted",
      "SalesforceAccountCreated",
      "SalesforceAccountUpdated",
      "SalesforceAccountDeleted",
      "SalesforceOpportunityCreated",
      "SalesforceOpportunityUpdated",
      "SalesforceOpportunityDeleted",
      "SalesforceProduct2Created",
      "SalesforceProduct2Updated",
      "SalesforceProduct2Deleted",
    ]
  })
}

resource "aws_sns_topic_subscription" "backend" {
  topic_arn = aws_sns_topic.default.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.backend.arn

  filter_policy = jsonencode({
    "EventName" : [
      "some-example"
    ]
  })
}
