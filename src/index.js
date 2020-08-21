import fetch from 'node-fetch';
import ora from 'ora';

import parser from './parser';
import csv from './csv';

const LOG_FILE = "https://cti-developer-dropbox.s3.amazonaws.com/gobankingrates.com.access.log";
const OUT_FILE = "./logs.csv";

(async () => {
  const spinner = ora('Transforming logs...').start();

  try {
    let res = await fetch(LOG_FILE);
    let rawLogs = await res.text();

    rawLogs = rawLogs.trim().split("\n");

    let data = parser(rawLogs);
    csv(OUT_FILE, data);

    spinner.stop();
    console.log(`${data.length} Logs processed...`);
  } catch (e) {
    console.log(e);
  }
})();