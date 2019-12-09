const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Signup route
app.post("/signup", (req, res) => {
  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName || !email) {
    res.redirect("/fail.html");
    return;
  }

  // Constract req data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/8362cd9d83",
    method: "POST",
    headers: {
      Authorization: "auth 0c7d9c110ccaafb849156ac6eddd8c94-us4"
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if (err) {
      res.redirect("/fail.html");
    } else {
      if (response.statusCode === 200) {
        res.redirect("/success.html");
      } else {
        res.redirect("/fail.html");
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
