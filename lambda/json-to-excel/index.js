const XLSX = require("sheetjs-style");

exports.handler = async (event) => {
  const { body } = event;
  const { name, data, merges = [], rows = [], cols = [] } = JSON.parse(body);

  const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

  ws["!merges"] = merges;
  ws["!rows"] = rows;
  ws["!cols"] = cols;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, name);

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

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
