const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

exports.handler = async (event) => {
  const { pdf } = JSON.parse(event.body);

  await fs.promises.writeFile("/tmp/tmp.pdf", Buffer.from(pdf, "base64"));

  await exec(
    "gs -o /tmp/tmp.tif -sDEVICE=tiffg4 -r720x720 -sPAPERSIZE=a4 /tmp/tmp.pdf"
  );

  const buffer = await fs.promises.readFile("/tmp/tmp.tif");

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      data: buffer.toString("base64"),
    }),
  };
};
