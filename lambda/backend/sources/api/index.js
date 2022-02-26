const resources = require("./resources");

module.exports = async function (event) {
  const { resource, body } = event;

  const resourceName = resource.replace("/", "-").replace(/^-+|-+$/g, "");

  return resources[resourceName](JSON.parse(body));
};
