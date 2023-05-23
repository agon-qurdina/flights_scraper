const { launchBrowser } = require("./browser");

PRICE_LIMIT = 40;
PRICES_SELECTOR = "#destinations > ul > li > a > div > p";
COUNTRIES_SELECTOR = "#destinations > ul > li > a > div > h3";

const scrape = async (url) => {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForSelector(PRICES_SELECTOR);

    const prices = await fetchPrices(page);
    const countries = await fetchCountries(page, prices.length);

    const results = prices.reduce((obj, price, idx) => {
      const country = countries[idx];
      obj[country] = price;
      return obj;
    }, {});

    console.log(results);
  } catch (error) {
    console.log(`An error happened: ${error}`);
  } finally {
    await browser.close();
  }
};

const fetchPrices = async (page) => {
  const prices = await page.$$eval(PRICES_SELECTOR, (nodes) =>
    nodes.map((n) => {
      const priceStr = n.innerText.match(/from ([0-9]+) €/)?.[1];
      return priceStr && parseFloat(priceStr);
    })
  );
  return prices.filter((n) => n && n <= PRICE_LIMIT);
};

const fetchCountries = async (page, limit) => {
  if (limit == 0) return [];

  const countries = await page.$$eval(COUNTRIES_SELECTOR, (nodes) =>
    nodes.map((n) => n.innerText)
  );
  return countries.slice(0, limit);
};

module.exports = { scrape };
