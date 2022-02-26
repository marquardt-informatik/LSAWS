# integrated-billing

This repository allows you to deploy the **integrated-billing** environment using Terraform in AWS.

## Installation

Pre-requirements: https://www.terraform.io/docs/cli/index.html

## Prerequisites

Terraform requires S3 bucket and DynamoDB table to manage its state. 

Run the following commands under `terraform/setup` directory:

```bash
terraform init
terraform plan -input=false
terraform apply -auto-approve=true
```

_Note: run it only once._

## Configuration

### Environment variables

Check [.env.dist](.env.dist) file to set the necessary environment variables for setup.

## Setup

Note: It necessary to do some steps manually because of current Terraform limitations.

There are 3 steps:
1. Setup AWS Appflow (Terraform doesn't support it)
2. Setup Terraform environment
3. Activate AWS Appflow flow (Terraform doesn't support it)

### AWS Appflow

Create [AWS Appflow](https://aws.amazon.com/appflow/) flows to receive Salesforce events.

#### `AccountChangeEvent`
1. Go to [Create flow](https://eu-central-1.console.aws.amazon.com/appflow/home?region=eu-central-1#/create/1) page (make sure AWS region is the correct one)
2. Set the flow name using the pattern `learnship-${TF_VAR_environment}-integrated-billing-salesforce-accounts` and click `Next`
3. Choose the source name value `Salesforce` and create new connection 
4. Choose the Salesforce event `AccountChangeEvent`
5. Choose the destination name `Amazon EventBridge` and choose the existing partner event source
6. Create and choose the S3 bucket with the following name pattern `learnship-${TF_VAR_environment}-integrated-billing-salesforce-accounts` (use default s3 configuration) and click `Next`
7. Choose source fields `Map all fields directly` and click `Next`
8. Skip adding filters and click `Next`
9. Click `Create flow`

#### `OpportunityChangeEvent`
1. Go to [Create flow](https://eu-central-1.console.aws.amazon.com/appflow/home?region=eu-central-1#/create/1) page (make sure AWS region is the correct one)
2. Set the flow name using the pattern `learnship-${TF_VAR_environment}-integrated-billing-salesforce-opportunities` and click `Next`
3. Choose the source name value `Salesforce` and create new connection 
4. Choose the Salesforce event `OpportunityChangeEvent`
5. Choose the destination name `Amazon EventBridge` and choose the existing partner event source
6. Create and choose the S3 bucket with the following name pattern `learnship-${TF_VAR_environment}-integrated-billing-salesforce-opportunities` (use default s3 configuration) and click `Next`
7. Choose source fields `Map all fields directly` and click `Next`
8. Skip adding filters and click `Next`
9. Click `Create flow`

#### `Product2ChangeEvent`
1. Go to [Create flow](https://eu-central-1.console.aws.amazon.com/appflow/home?region=eu-central-1#/create/1) page (make sure AWS region is the correct one)
2. Set the flow name using the pattern `learnship-${TF_VAR_environment}-integrated-billing-salesforce-products` and click `Next`
3. Choose the source name value `Salesforce` and create new connection 
4. Choose the Salesforce event `Product2ChangeEvent`
5. Choose the destination name `Amazon EventBridge` and create new partner event source with default values
6. Create and choose the S3 bucket with the following name pattern `learnship-${TF_VAR_environment}-integrated-billing-salesforce-products` (use default s3 configuration) and click `Next`
7. Choose source fields `Map all fields directly` and click `Next`
8. Skip adding filters and click `Next`
9. Click `Create flow`

### Terraform environment

Go to `terraform` directory and run the following commands one by one:

```bash
terraform init -backend-config="key=${TF_BACKEND_CONFIG_KEY}"
```

```bash
terraform plan -input=false -out "integrated-billing-planfile"
```

```bash
terraform apply -auto-approve "integrated-billing-planfile"
```

### Activate AWS Appflow

1. Go to [Flows](https://eu-central-1.console.aws.amazon.com/appflow/home?region=eu-central-1#/list) page
2. Choose `learnship-${TF_VAR_environment}-integrated-billing-salesforce-products` flow
3. Click `Activate flow`
