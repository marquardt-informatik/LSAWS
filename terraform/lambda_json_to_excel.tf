locals {
  json_to_excel_location = "zip/json-to-excel.zip"
}

data "archive_file" "json_to_excel" {
  type        = "zip"
  source_dir  = "../lambda/json-to-excel"
  output_path = local.json_to_excel_location
}

resource "aws_lambda_function" "json_to_excel" {
  filename      = data.archive_file.json_to_excel.output_path
  function_name = "${module.integrated-billing_label.id}-json-to-excel"
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs14.x"
  handler       = "index.handler"

  source_code_hash = data.archive_file.json_to_excel.output_base64sha256

  memory_size = 512
  timeout     = 30

  tags = module.integrated-billing_label.tags
}
