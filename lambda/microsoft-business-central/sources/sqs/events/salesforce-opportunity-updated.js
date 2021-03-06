const sns = require("../../../services/sns");
const microsoft = require("../../../services/microsoft-business-central");

module.exports = async function (event) {
  const { body } = event;
  const { records: opportunityLines = [] } = body["OpportunityLineItems"] || {};

  let contract = await microsoft.getContract(body.Id);
  if (!contract) {
    throw new Error(`Contract ${body.Id} not found`);
  }

  let { lineItems: contractLines = [] } = contract;

  contract = await microsoft.updateContract(contract, {
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
    // 'billToCountry': body[''],
    // 'billToStreet': body[''],
    // 'billToPostcode': body[''],
    // 'billToState': body[''],
    billToContactName: body["Invoice_Contact_Name_Title__c"],
    billToContactPhone: body["Invoice_Contact_Phone__c"],
    billToContacteMail: body["Customer_Billing_Email_Address__c"],
    invoiceAccountId: body["Invoice_Account__c"],
    invoiceContactId: body["Invoice_Contact__c"],
    sellToAccountId: body["AccountId"],
    // 'sellToCountry': body[''],
    // 'sellToStreet': body[''],
    // 'sellToPostcode': body[''],
    // 'sellToCity': body[''],
    // 'sellToState': body[''],
    sellToContactName: body["Different_Billing_Contact_Name__c"],
    sellToContactPhone: body["Different_Billing_Contact_Phone__c"],
    sellToContacteMail: body["Different_Billing_Email_Address__c"],
    // 'acceptanceDate': body[''],
    // 'contractStart': body[''],
    // 'contractEnd': body[''],
    // 'budget': body[''],
    // 'budgetCurrency': body[''],
    // 'budgetType': body[''],
    // 'sendingProfile': body[''],
    purchaseOrder: body["PO_Number__c"],
    // 'ordererName': body[''],
    // 'ordererEMail': body[''],
    // 'additionalText': body[''],
    costCenter: body["Cost_Center__c"],
    installmentsNeeded: body["Are_Multiple_Invoices_Req_d__c"],
    installments: body["Number_Installment_payments__c"],
  });

  contractLines = await syncContractLines(opportunityLines, contractLines);

  await sns.publish("MicrosoftBusinessCentralContractCreated", {
    ...contract,
    lineItems: contractLines,
  });
};

async function syncContractLines(opportunityLines, contractLines) {
  const newContractLines = opportunityLines
    .filter(
      (opportunityLine) =>
        !contractLines.find(
          (contractLine) => opportunityLine["Id"] === contractLine["lineItemId"]
        )
    )
    .map((opportunityLine) => {
      return microsoft.createContractLine({
        lineItemId: opportunityLine["Id"], // @todo sfLineItemId
        opportunityId: opportunityLine["OpportunityId"],
        productId: opportunityLine["Product2Id"], // @todo sfProductId
        quantity: opportunityLine["Quantity"],
        unitSalesProce: opportunityLine["UnitPrice"], // @todo Price*
        currency: opportunityLine["CurrencyIsoCode"],
        serviceActivationDate: opportunityLine["Service_Activation_Date__c"],
        serviceExpirationDate: opportunityLine["Service_Expiration_Date__c"],
        enrollmentEndDate: opportunityLine["Enrollment_End_Date__c"],
      });
    });

  const updatedContractLines = opportunityLines
    .filter((opportunityLine) =>
      contractLines.find(
        (contractLine) => opportunityLine["Id"] === contractLine["lineItemId"]
      )
    )
    .map((opportunityLine) => {
      const contractLine = contractLines.find(
        (contractLine) => opportunityLine["Id"] === contractLine["lineItemId"]
      );

      return microsoft.updateContractLine(contractLine, {
        lineItemId: opportunityLine["Id"], // @todo sfLineItemId
        opportunityId: opportunityLine["OpportunityId"],
        productId: opportunityLine["Product2Id"], // @todo sfProductId
        quantity: opportunityLine["Quantity"],
        unitSalesProce: opportunityLine["UnitPrice"], // @todo Price*
        currency: opportunityLine["CurrencyIsoCode"],
        serviceActivationDate: opportunityLine["Service_Activation_Date__c"],
        serviceExpirationDate: opportunityLine["Service_Expiration_Date__c"],
        enrollmentEndDate: opportunityLine["Enrollment_End_Date__c"],
      });
    });

  const deletedContractLines = contractLines
    .filter(
      (contractLine) =>
        !opportunityLines.find(
          (opportunityLine) =>
            opportunityLine["Id"] === contractLine["lineItemId"]
        )
    )
    .map((contractLine) => {
      return microsoft.deleteContractLine(contractLine["lineItemId"]);
    });

  const lines = await Promise.all([
    ...newContractLines,
    ...updatedContractLines,
    ...deletedContractLines,
  ]);

  return lines.filter((line) => line !== null);
}
