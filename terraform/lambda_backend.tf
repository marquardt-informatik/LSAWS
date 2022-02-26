locals {
  backend_location = "zip/backend.zip"
}

data "archive_file" "backend" {
  type        = "zip"
  source_dir  = "../lambda/backend"
  output_path = local.backend_location
}

resource "aws_lambda_function" "backend" {
  filename      = data.archive_file.backend.output_path
  function_name = "${module.integrated-billing_label.id}-backend"
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs14.x"
  handler       = "index.handler"

  source_code_hash = data.archive_file.backend.output_base64sha256

  memory_size = 512
  timeout     = 30

  environment {
    variables = {
      SNS_TOPIC_ARN = aws_sns_topic.default.arn
    }
  }

  tags = module.integrated-billing_label.tags
}

resource "aws_lambda_event_source_mapping" "backend_sqs" {
  event_source_arn = aws_sqs_queue.backend.arn
  function_name    = aws_lambda_function.backend.arn
}
