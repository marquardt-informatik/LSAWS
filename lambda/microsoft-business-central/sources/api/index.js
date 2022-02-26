const resources = require("./resources");

module.exports = async function (event) {
  const { resource, httpMethod } = event;

  const resourceName = resource.replace("/", "-").replace(/^-+|-+$/g, "");

  return resources[resourceName][httpMethod](event);
};
