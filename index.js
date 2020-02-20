const puppeteer = require("puppeteer");
const { storage, makeJSON } = require(`./utils/storage`);

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

const url = "https://www.naver.com";
exports.scrapingExample = async (req, res) => {
  let { browser, page } = await openConnection();

  try {
    await page.goto(url, { waitUntil: "load" });

    const data = await page.evaluate(() => {
      return document.querySelector("body").innerHTML;
    });

    const json = makeJSON({ data });
    const file = storage.getTempFileName("data.json");

    storage.writeFileSync(file, json);
    storage.upload(file);

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    // closeConnection(page, browser);
  }
};
