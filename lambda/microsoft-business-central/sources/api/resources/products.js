const microsoft = require('../../../services/microsoft-business-central');

async function POST ({ body }) {
  // @todo validate body.
  const products = body ? JSON.parse(body) : []

  const response = await microsoft.createProducts(products);

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
}

module.exports = {
  POST,
};
