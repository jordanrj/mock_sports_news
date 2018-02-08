var express = require("express");
var app = express();
var bodyParser = require("bod-parser");
var mysql = require("mysql");
var validator = require("express-validator");

var dB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toor",
    database: "mockDatabase"
});

dB.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
      console.log("Connected to database successfully."); 
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

app.get("/", function(req, res) {
    res.render(path.join(__dirname, 'views/landing'));
});

app.get("/contact", function(req, res) {
    res.render(path.join(__dirname, "views/contact"));
});

app.post("/contact", function(req, res) {
    //Validate form entries
    req.checkBody("email", "Please enter a valid email address.").isEmail();
    req.checkBody("firstName", "Invalid First Name.").isAlpha();
    req.checkBody("lastName", "Invalid Last Name.").isAlpha();
    req.checkBody("zipcode", "Invalid ZipCode.").isPostalCode();

    var errs = req.validationErrors();
    if (errs) { 
        //if form is invalid, return error to user
        res.send(errs);
        return;
    } else {
        //parse vlaues from form fields and insert to database
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var zipcode = req.body.zipcode;
        var state = req.body.state;

        var sql = "INSERT INTO contacts (firstName, lastName, email, zipcode, state) VALUES (?, ?, ?, ?, ?)";
        dB.query(sql, [firstName, lastName, email, zipcode, state], function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send("Form successfully processed.");
            }
        })
    }

});

app.listen(process.end.PORT, function() {
    console.log("Server Launched.");
})