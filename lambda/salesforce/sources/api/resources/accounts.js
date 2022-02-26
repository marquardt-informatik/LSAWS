const salesforce = require('../../../services/salesforce');

async function GET ({ queryStringParameters }) {
  const { limit, offset, ...filters } = queryStringParameters || {}

  const accounts = await salesforce.getAccounts(filters, limit, offset);

  const response = accounts.map(body => {
    return {
      sfContactId: body["Id"], // @todo sfAccountId
      sfParentContactId: body["ParentId"], // @todo sfParentAccountId
      name: body["Name"],
      legalEntity: body["Legal_Entities__c"],
      dispatchOfBilling: body["Dispatch_of_billing__c"],
      billingEmailAddress: body["Billing_email_address__c"],
      billingMethod: body["Billing_method__c"],
      paymentTerms: body["payment_terms__c"],
      language: body["Order_Form_Billing_language__c"],
      currencyCode: body["CurrencyIsoCode"],
      vatId: body["VAT_ID__c"],
      billToCountry: body["BillingCountryCode"],
      billToStreet: body["BillingStreet"],
      billToPostcode: body["BillingPostalCode"],
      billToCity: body["BillingCity"],
      billToState: body["BillingStateCode"],
      //'contactName': body[''], ??
      //'contactPhone': body['Phone'], ??
      accountingDescription: body["Accounting_Description__c"],
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
