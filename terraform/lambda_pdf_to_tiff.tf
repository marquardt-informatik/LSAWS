locals {
  pdf_to_tiff_location = "zip/pdf-to-tiff.zip"
}

data "archive_file" "pdf_to_tiff" {
  type        = "zip"
  source_dir  = "../lambda/pdf-to-tiff"
  output_path = local.pdf_to_tiff_location
}

resource "aws_lambda_layer_version" "gs" {
  filename   = "../lambda-layers/gs.zip"
  layer_name = "${module.integrated-billing_label.id}-gs"

  compatible_runtimes = ["nodejs12.x", "nodejs14.x"]
}

resource "aws_lambda_function" "pdf_to_tiff" {
  filename      = data.archive_file.pdf_to_tiff.output_path
  function_name = "${module.integrated-billing_label.id}-pdf-to-tiff"
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs14.x"
  handler       = "index.handler"
  layers        = [aws_lambda_layer_version.gs.arn]

  source_code_hash = data.archive_file.pdf_to_tiff.output_base64sha256

  memory_size = 2048
  timeout     = 30

  tags = module.integrated-billing_label.tags
}
