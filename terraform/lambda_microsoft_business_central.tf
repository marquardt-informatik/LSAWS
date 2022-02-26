locals {
  microsoft_business_central_location = "zip/microsoft-business-central.zip"
}

data "archive_file" "microsoft_business_central" {
  type        = "zip"
  source_dir  = "../lambda/microsoft-business-central"
  output_path = local.microsoft_business_central_location
}

resource "aws_lambda_function" "microsoft_business_central" {
  filename      = data.archive_file.microsoft_business_central.output_path
  function_name = "${module.integrated-billing_label.id}-microsoft-business-central"
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs14.x"
  handler       = "index.handler"

  source_code_hash = data.archive_file.microsoft_business_central.output_base64sha256

  memory_size = 512
  timeout     = 30

  environment {
    variables = {
      SNS_TOPIC_ARN    = aws_sns_topic.default.arn
      COMPANY_ID       = var.mbc_company_id
      ENVIRONMENT      = var.mbc_environment
      TOKEN            = var.mbc_token
      USER_DOMAIN_NAME = var.mbc_user_domain_token
    }
  }

  tags = module.integrated-billing_label.tags
}

resource "aws_lambda_event_source_mapping" "microsoft_business_central_sqs" {
  event_source_arn = aws_sqs_queue.microsoft_business_central.arn
  function_name    = aws_lambda_function.microsoft_business_central.arn
}
