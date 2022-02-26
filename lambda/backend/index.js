const sources = require("./sources");
const utils = require("./utils");

exports.handler = async (event) => {
  const source = utils.getEventSource(event);

  return sources[source](event);
};
