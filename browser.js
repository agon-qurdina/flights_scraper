const puppeteer = require("puppeteer");

const launchBrowser = async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--disable-setuid-sandbox"],
    });
  } catch (error) {
    console.log(`An error occurred ${error}`);
  }

  return browser;
};

module.exports = { launchBrowser };
