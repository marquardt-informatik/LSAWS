resource "aws_cloudwatch_event_bus" "salesforce" {
  name = var.eventbridge_partner_name
  event_source_name = var.eventbridge_partner_name

  tags = module.integrated-billing_label.tags
}

resource "aws_cloudwatch_event_rule" "salesforce_lambda" {
  name        = "${module.integrated-billing_label.id}-salesforce-lambda"

  event_bus_name = aws_cloudwatch_event_bus.salesforce.name
  event_pattern = <<EOF
{
  "source": ["${var.eventbridge_partner_name}"]
}
EOF

  tags = module.integrated-billing_label.tags
}

resource "aws_cloudwatch_event_target" "salesforce_lambda" {
  rule = aws_cloudwatch_event_rule.salesforce_lambda.name
  event_bus_name = aws_cloudwatch_event_bus.salesforce.name
  arn = aws_lambda_function.salesforce.arn
}

resource "aws_lambda_permission" "salesforce_lambda" {
  statement_id = "AllowExecutionFromCloudWatch"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.salesforce.function_name
  principal = "events.amazonaws.com"
  source_arn = aws_cloudwatch_event_rule.salesforce_lambda.arn
}
