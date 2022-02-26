const jsforce = require("jsforce");

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const SECURITY_TOKEN = process.env.SECURITY_TOKEN;

async function createConnection(username, password) {
  const conn = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com",
  });

  return new Promise((resolve, reject) => {
    conn.login(username, password, (err) => {
      return err ? reject(err) : resolve(conn);
    });
  });
}

async function getAccounts (filters, limit = 10, offset = 0) {
  const conn = await createConnection(USERNAME, PASSWORD + SECURITY_TOKEN);

  return new Promise((resolve, reject) => {
    const q = conn.sobject('Account')
      .select('*')
      .limit(limit)
      .offset(offset)

    if ('sfAccountId' in filters) {
      q.where({ Id: filters.sfAccountId })
    }

    q.execute(function(err, records) {
      return err ? reject(err) : resolve(records)
    })
  })
}

async function getAccount(id) {
  const conn = await createConnection(USERNAME, PASSWORD + SECURITY_TOKEN);

  return new Promise((resolve, reject) => {
    conn.sobject("Account").retrieve(id, (err, account) => {
      return err ? reject(err) : resolve(account);
    });
  });
}

async function getContact(id) {
  const conn = await createConnection(USERNAME, PASSWORD + SECURITY_TOKEN);

  return new Promise((resolve, reject) => {
    conn.sobject("Contact").retrieve(id, (err, contact) => {
      return err ? reject(err) : resolve(contact);
    });
  });
}

async function getOpportunities (filters, limit = 10, offset = 0) {
  const conn = await createConnection(USERNAME, PASSWORD + SECURITY_TOKEN)

  return new Promise((resolve, reject) => {
    const q = conn.sobject('Opportunity')
      .select('*')
      .include("OpportunityLineItems")
      .select('*')
      .end()
      .limit(limit)
      .offset(offset)

    if ('opportunityId' in filters) {
      q.where({ Id: filters.opportunityId })
    }

    q.execute(function(err, records) {
      return err ? reject(err) : resolve(records)
    })
  })
}

async function getOpportunity(id) {
  const conn = await createConnection(USERNAME, PASSWORD + SECURITY_TOKEN);

  return new Promise((resolve, reject) => {
    conn
      .sobject("Opportunity")
      .select("*")
      .include("OpportunityLineItems")
      .select("*")
      .end()
      .where({ Id: id })
      .limit(1)
      .execute(function (err, records) {
        return err ? reject(err) : resolve(records[0] || null);
      });
  });
}

async function getProducts (filters, limit = 10, offset = 0) {
  const conn = await createConnection(USERNAME, PASSWORD + SECURITY_TOKEN)

  return new Promise((resolve, reject) => {
    const q = conn.sobject('Product2')
      .select('*')
      .limit(limit)
      .offset(offset)

    if ('sfProductId' in filters) {
      q.where({ Id: filters.sfProductId })
    }

    q.execute(function(err, records) {
      return err ? reject(err) : resolve(records)
    })
  })
}

async function getProduct(id) {
  const conn = await createConnection(USERNAME, PASSWORD + SECURITY_TOKEN);

  return new Promise((resolve, reject) => {
    conn.sobject("Product2").retrieve(id, (err, product) => {
      return err ? reject(err) : resolve(product);
    });
  });
}

module.exports = {
  getAccounts,
  getAccount,
  getContact,
  getOpportunities,
  getOpportunity,
  getProducts,
  getProduct,
};
