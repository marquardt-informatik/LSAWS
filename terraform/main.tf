provider "aws" {
  region = var.region

  assume_role {
    role_arn = var.role_arn
  }
}

module "integrated-billing_label" {
  source      = "git::https://github.com/cloudposse/terraform-null-label.git"
  namespace   = "learnship"
  environment = var.environment
  name        = local.name

  tags = {
    Service     = "integrated-billing"
    Terraformed = true
  }
}

locals {
  name = "${var.name_prefix != "" ? "${var.name_prefix}-" : ""}integrated-billing"
}
