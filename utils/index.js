const puppeteer = require("puppeteer");
const { DateTime } = require("luxon");
const path = require("path");

const PUPPETEER_OPTIONS = {
  // headless: true,
  args: ["--disable-setuid-sandbox", "--no-sandbox"]
};

const openConnection = async () => {
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  const page = await browser.newPage();

  return { browser, page };
};

const closeConnection = async (page, browser) => {
  page && (await page.close());
  browser && (await browser.close());
};

/**
 * get timezone seoul timestamp
 */
const getTimestamp = () => {
  const now = DateTime.fromISO(DateTime.local(), { zone: "Asia/Seoul" });
  return now.toMillis();
};
const getUpdatedDate = () => {
  return DateTime.fromISO(DateTime.local(), { zone: "Asia/Seoul" }).toFormat(
    "yyyy년 LL월 dd일 HH시 mm분 ss초"
  );
};

const getModuleName = (filename, extension = "json") => {
  const name = path.basename(filename, path.extname(filename));
  return [name, extension].join(".");
};
const makeJSON = obj => {
  return {
    ...obj,
    timestamp: getTimestamp(),
    updatedDate: getUpdatedDate()
  };
};

const delay = (duration = 1500) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

module.exports = {
  openConnection,
  closeConnection,
  getUpdatedDate,
  getTimestamp,
  makeJSON,
  getModuleName,
  delay
};
