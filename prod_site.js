const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require("googleapis");

// Configuring email authentication
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  "689080175422-8mu26771p3jj2aeo13ojs50dn7djtsek.apps.googleusercontent.com", // ClientID
  "yUyZ6pAWf78S6Ap4qm5mJnmf", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: "1/WoYRsbYB4yIlBDa3a-owwJ6TZysQTkThNXFjWpScHopYoIj9-2nLb9P0L1EOd7cK"
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
        user: 'JAP.energy.info@gmail.com',
        pass: 'JAP_999!',
        type: "OAuth2", 
        clientId: "689080175422-8mu26771p3jj2aeo13ojs50dn7djtsek.apps.googleusercontent.com",
        clientSecret: "yUyZ6pAWf78S6Ap4qm5mJnmf",
        refreshToken: "1/WoYRsbYB4yIlBDa3a-owwJ6TZysQTkThNXFjWpScHopYoIj9-2nLb9P0L1EOd7cK",
        accessToken: accessToken
      }
    });
    // info@japrofessionalservices.com <- JAP Info
    mailOpts = {
      from: req.body.name + ' &lt;' + req.body.email + '&gt;',
      to: 'info@JAProfessionalServices.com',
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


