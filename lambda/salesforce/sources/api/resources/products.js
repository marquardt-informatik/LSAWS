const salesforce = require('../../../services/salesforce');

async function GET ({ queryStringParameters }) {
  const { limit, offset, ...filters } = queryStringParameters || {}

  const products = await salesforce.getProducts(filters, limit, offset);

  const response = products.map(body => {
    return {
      sfProductId: body["Id"],
      productCode: body["ProductCode"],
      currency: body["CurrencyIsoCode"],
      description: body["Description"],
      family: body["Family"],
      name: body["Name"],
      numberOfHours: body["of_Hours__c"],
      numberOfSessions: body["of_Sessions__c"],
      numberOfSubscribers: body["of_Subscribers__c"],
      bwf: body["BWF__c"],
      category: body["Category__c"],
      productcontent: body["Content__c"],
      contentType: body["Content_Type__c"],
      courseType: body["Course_Type__c"],
      deliveryChannel: body["Delivery_Channel__c"],
      elementType: body["Element_Type__c"],
      geProductId: body["ge_product_id__c"],
      geProductIdRef: body["GE_Product_ID_ref__c"],
      language: body["Language__c"],
      learningMode: body["Learning_Mode__c"],
      periodOfUse: body["Period_of_Use__c"],
      productDescriptionInvoice: body["Product_Description_Invoice__c"],
      productEntity: body["Product_Entity__c"],
      productLine: body["Product_Line__c"],
      productType: body["Product_Type__c"],
      productVersion: body["Product_Version__c"],
      sessionLength: body["Session_Length__c"],
      trainingType: body["Training_Type__c"],
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
