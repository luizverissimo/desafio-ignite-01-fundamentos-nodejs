import fs from "fs";
import { parse } from "csv-parse";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/fs_read.csv`).pipe(
    parse({
      columns: true,
      from_line: 1,
    })
  );
  for await (const record of parser) {
    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...record }),
    })
      .then((response) => {})
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  console.info(records);
})();
