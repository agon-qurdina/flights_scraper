const remainingMonthsOfTheYear = () => {
  const d = new Date();
  const currentMonth = d.getMonth() + 1;

  const dates = [];
  for (let i = currentMonth; i < 12; i++) {
    d.setMonth(i);
    dates.push(formattedDate(d));
  }
  return dates;
};

const formattedDate = (date) => {
  const year = date.getFullYear().toString().substr(-2);
  let month = "" + (date.getMonth() + 1);

  if (month.length < 2) month = "0" + month;

  return [year, month].join("");
};

module.exports = { remainingMonthsOfTheYear };
