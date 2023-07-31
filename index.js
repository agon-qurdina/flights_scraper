require("dotenv").config();

(async () => {
  const { remainingMonthsOfTheYear } = require("./utils/datetime_helper");
  const { scrape } = require("./scraper");
  const { sendMail } = require("./mailer");

  const months = remainingMonthsOfTheYear();

  let results = {};
  for (const month of months) {
    const monthResults = await scrape(
      `https://www.skyscanner.com/transport/flights-from/prn/?rtn=1&currency=EUR&oym=${month}&iym=${month}`
    );
    if (Object.keys(monthResults).length > 0) {
      results[month] = monthResults;
    }
    console.log(`Month ${month} done`);
  }

  if (Object.keys(results).length == 0) {
    return;
  }
  await sendMail(results);
})();
