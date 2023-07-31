const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail(results) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  let html = "";
  for (const month in results) {
    html += `<h2>${month}</h2><ul>`;

    const countries = results[month];
    for (const country in countries) {
      html += `<li>${country}: ${countries[country]} EUR</li>`;
    }

    html += "</ul></br>";
  }

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Scraper" <${process.env.MAIL_USERNAME}>`, // sender address
    to: process.env.SUBSCRIBERS.split(","), // list of receivers
    subject: "Cheap flights", // Subject line
    text: Object.keys(results)
      .map((c) => `${c} (${results[c]} EUR)`)
      .join(","), // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { sendMail };
