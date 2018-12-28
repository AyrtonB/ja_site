const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require("googleapis");

// Configuring email authentication
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  "", // ClientID
  "", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: ""
});
  
const accessToken = oauth2Client.refreshAccessToken()
  .then(res => res.credentials.access_token);

// Setting up Express
const app = express()
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')

app.listen(5656, () => {
    console.log('http://localhost:5656')
})

app.use('/src', express.static(__dirname + '/src'));

// Pages

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/home', (req, res) => {
    res.render('pages/index')
})

app.get('/sectors', (req, res) => {
    res.render('pages/sectors')
})

app.get('/services', (req, res) => {
    res.render('pages/services')
})

// POST route from contact form
app.post('/contact', function (req, res) {
    let mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: '',
        pass: '',
        type: "OAuth2", 
        clientId: "",
        clientSecret: "",
        refreshToken: "",
        accessToken: accessToken
      }
    });
    //
    mailOpts = {
      from: req.body.name + ' &lt;' + req.body.email + '&gt;',
      to: '',
      subject: 'Inquiries',
      text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    };
    smtpTrans.sendMail(mailOpts, function (error, response) {
      if (error) {
        console.log(error)
        res.render('pages/index');
      }
      else {
        console.log('Email Sent')
        res.render('pages/index');
      }
    });
  });


