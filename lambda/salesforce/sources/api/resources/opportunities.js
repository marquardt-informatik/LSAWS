const salesforce = require('../../../services/salesforce');

async function GET ({ queryStringParameters }) {
  const { limit, offset, ...filters } = queryStringParameters || {}

  const opportunities = await salesforce.getOpportunities(filters, limit, offset);

  const response = opportunities.map(body => {
    return {
      opportunityId: body["Id"], // @todo sfOpportunityId
      parentOpportunityId: body["Parent_Opportunity__c"], // @todo sfParentOpportunityId
      oppLegalEntity: body["Opp_Legal_Entity__c"],
      accountId: body["AccountId"],
      stage: body["StageName"],
      billingMethod: body["Billing_Method__c"],
      customerLegalName: body["Customer_Legal_Name__c"],
      language: body["language__c"],
      currency: body["CurrencyIsoCode"],
      paymentTerms: body["Payment_Terms__c"],
      billToAccountId: body["AccountId"],
      billToContactName: body["Invoice_Contact_Name_Title__c"],
      billToContactPhone: body["Invoice_Contact_Phone__c"],
      billToContacteMail: body["Customer_Billing_Email_Address__c"],
      sellToAccountId: body["AccountId"],
      sellToContactName: body["Different_Billing_Contact_Name__c"],
      sellToContactPhone: body["Different_Billing_Contact_Phone__c"],
      sellToContacteMail: body["Different_Billing_Email_Address__c"],
      purchaseOrder: body["PO_Number__c"],
      costCenter: body["Cost_Center__c"],
      installmentsNeeded: body["Are_Multiple_Invoices_Req_d__c"],
      installments: body["Number_Installment_payments__c"],
    }
  })

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}

module.exports = {
  GET,
};
