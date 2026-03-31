const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;
// thi sis a test
// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// enrolling in newsletter
// unique id: d42773de74
// api key a66f0f2f4f5b66605730a19b51efb98f-us21
app.post('/subscribe', (req, res) => {
    const {email} = req.body;
    console.log(req.body);
    // res.send(req.body);

    const mcData = {
        members: [
            {
                email_address: email,
                status: 'subscribed' //this is for double opt-in. Only show up if the user verfies the initiallyy
                // status: 'subscribed' //this is for singly opt-in. 

            }
        ]
    }

    const mcDataPost = JSON.stringify(mcData);

    const options = {
        url: 'https://us21.api.mailchimp.com/3.0/lists/d42773de74',
        method: 'POST',
        headers: {
            Authorization: 'auth a66f0f2f4f5b66605730a19b51efb98f-us21'
        },
        data: mcDataPost
    }

    if (email) {
        // Send the request to Mailchimp API
        axios(options)
        .then(response => {
            // if (response.data.errors && response.data.errors.length > 0 && response.data.errors[0].error_code === "ERROR_CONTACT_EXISTS") {
            // return res.send("error contact exists");
            // } else {
            //     res.sendStatus(200); //ok response
            // }

            // console.error(error);
            res.status(200).send('Message sent successfully!');
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send('Error subscribing');
        });
    } else {
        return res.status(500).send('Error subscribing');
    }

});

// Contact form route for submitting an email
app.post('/contact', (req, res) => {
  const { name, email, number, subject, message } = req.body;
    console.log(req.body);
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ayub.shahab13@gmail.com', // Replace with your email
      pass: 'jfabxorqlhrihngx', // Replace with your password or use environment variable
    },
  });

  // Configure email data
  const mailOptions = {
    from: '"Example Team" <from@example.com>',
    to: 'ayub.shahab13@gmail.com',
    subject: subject,
    text: `
      Name: ${name}\n
      Email: ${email}\n
      Number: ${number}\n
      Subject: ${subject}\n
      Message: ${message}\n
    `,
  };

  console.log(mailOptions);
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error sending email');
    }
    console.log(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).send('Message sent successfully!');
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



    // const mcData = {
    //     members: [
    //         {
    //             email_address: email,
    //             status: 'pending' //this is for double opt-in. Only show up if the user verfies the initiallyy
    //             // status: 'subscribed' //this is for singly opt-in. 

    //         }
    //     ]
    // }

    // const mcDataPost = JSON.stringify(mcData);

    // const options = {
    //     url: 'https://us21.api.mailchimp.com/3.0/lists/d42773de74',
    //     method: 'POST',
    //     headers: {
    //         Authorization: 'auth a66f0f2f4f5b66605730a19b51efb98f-us21'
    //     },
    //     body: mcDataPost
    // }

    // if(email){
    //     res.send('Message sent successfully!');
    // }else{
    //     return res.status(500).send('Error subscribing');
    // }

    // if (email) {
    //     // Send the request to Mailchimp API
    //     axios(options)
    //     .then(response => {
    //         console.log(response.data);
    //         res.send('Message sent successfully!');
    //     })
    //     .catch(error => {
    //         console.error(error);
    //         return res.status(500).send('Error subscribing');
    //     });
    // } else {
    //     return res.status(500).send('Error subscribing');
    // }