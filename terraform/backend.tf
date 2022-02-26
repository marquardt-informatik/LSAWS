terraform {
  backend "s3" {
    bucket         = "learnship-terraform-states"
    dynamodb_table = "learnship-terraform-state-lock"
    encrypt        = true
    region         = "eu-central-1"
  }
}
