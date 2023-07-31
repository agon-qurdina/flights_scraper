const { launchBrowser } = require("./browser");

PRICE_LIMIT = 50;
// CONTAINER_SELECTOR = "#CombinedResultsPlaces > div:nth-child(4) > div.ResultList_container__MDk1N";
PRICES_SELECTOR =
  '//*[@id="CombinedResultsPlaces"]/div[3]/div[1]/div/a/div/div[2]/div[2]/span[2]';
COUNTRIES_SELECTOR =
  '//*[@id="CombinedResultsPlaces"]/div[3]/div[1]/div/a/div/div[2]/div[1]/span';

const scrape = async (url) => {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url);

    await page.waitForXPath(PRICES_SELECTOR);

    const prices = await fetchPrices(page);
    const countries = await fetchCountries(page, prices.length);

    const results = prices.reduce((obj, price, idx) => {
      const country = countries[idx];
      obj[country] = price;
      return obj;
    }, {});

    return results;
  } catch (error) {
    console.log(`An error happened: ${error}`);
  } finally {
    await browser.close();
  }
};

const fetchPrices = async (page) => {
  const priceHandles = await page.$x(PRICES_SELECTOR);
  const prices = await Promise.all(
    priceHandles.map((p) =>
      page.evaluate((el) => {
        const priceStr = el.textContent.match(/([0-9]+) €/)?.[1];
        return priceStr && parseFloat(priceStr);
      }, p)
    )
  );
  return prices.filter((n) => n && n <= PRICE_LIMIT);
};

const fetchCountries = async (page, limit) => {
  if (limit == 0) return [];

  const countryHandles = await page.$x(COUNTRIES_SELECTOR);
  const countries = await Promise.all(
    countryHandles.map((c) => page.evaluate((el) => el.textContent, c))
  );
  // const countries = await page.$$eval(COUNTRIES_SELECTOR, (nodes) =>
  //   nodes.map((n) => n.innerText)
  // );
  return countries.slice(0, limit);
};

module.exports = { scrape };
