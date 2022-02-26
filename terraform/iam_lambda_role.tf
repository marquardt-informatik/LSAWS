resource "aws_iam_role_policy" "lambda_policy" {
  name = "${module.integrated-billing_label.id}-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = file("./policies/lambda_policy.json")
}

resource "aws_iam_role" "lambda_role" {
  name               = "${module.integrated-billing_label.id}-lambda-role"
  assume_role_policy = file("./policies/lambda_assume_policy.json")

  tags = module.integrated-billing_label.tags
}
