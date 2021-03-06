const configGmail = require('../../config/configGmail.json');
const nodemailer = require('nodemailer');
const token = require('../../constants/token.js');
const htmlMailCode = require('../../constants/htmlMailCode.js');
const userModel = require('../../models/userModel.js');

module.exports = async (req, res) => {
  if (!req.body.email) {
    res.json({
      code: 430,
      title: 'Error',
      data: {
        message: "Tokens do not exist or expire!"
      }
    })
  } else {
    const code = Math.floor(Math.random() * 899999) + 100000;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: configGmail.user, // generated ethereal user
        pass: configGmail.password // generated ethereal password
      }
    });
    try {
      // const data = await token.verify(req.body.token);
      const info = await transporter.sendMail({
        from: '"Learn Japanese Verify Code👻" <dev.learn.backend@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Verify Code ✔", // Subject line
        text: "Hello world?", // plain text body
        html: htmlMailCode(code)
        // html body
      });

      if (info) {
        userModel.setEmailCode({
          emailCode: code,
          email: req.body.email
        })
        res.json({
          code: 200,
          title: 'Success',
          data: {
            message: 'Please check your mail to Verify Code.'
          }
        })
      } else {
        res.json({
          code: 451,
          title: 'Error',
          data: {
            message: 'Send mail fail.'
          }
        })
      }
    } catch (err) {
      res.sendStatus(400).send(err);
    }
  }
}