const nodemailer = require('nodemailer');
const fetch = require("node-fetch");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})

const mailOptions = ({name, email, phone, company, message}) => ({
  from: process.env.EMAIL,
  to: process.env.RECEIVER,
  subject: `Bluesky Media Form | from ${email}`,
  text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nMessage: ${message}`
});

exports.send = async(req, res) => {
  const { date, token } = req.body

  // Honey pot
  if(date) res.status(400).send({ message: "Validation failed 01" }) 
  await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`, {method: 'post'})
    .then(async(captcha) => {
      if(captcha?.status === 200) {
        await transporter.sendMail(
          mailOptions(req.body), 
          async(err, data) => {
            if(err) {
              console.log(err);
              res.status(400).send({ message: "Something failed in the server"})
            } else res.status(200).send({ message: "Your message has been successfully sent!"})
          }
        )
      } else res.status(400).send({ message: "Validation failed 02"}) 
      })
    .catch(() => res.status(400).send({message: "Validation failed 03"}))
}
