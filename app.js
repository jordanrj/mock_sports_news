/* THIS FILE is a server implementation for the mock website for Octagon.
    Features include:
        *Form Validation
        *Form submission to nonexistent MySQL database
        *RESTful calls for both views

    **NOTE: This server will not connect to a database or actual render the views.
*/

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql = require("mysql");
var validator = require("express-validator");
var path = require("path");
//Initiate connection to dB ('using' mock MySQL database)
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
app.use(express.static(__dirname));
const views = path.join(__dirname, 'views');


app.get("/", function(req, res) {
    res.sendFile('landing.html', {root: views});
});

app.get("/contact", function(req, res) {
    res.sendFile('contact.html', { root: views });
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

        //Create dB query and call it
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

app.listen(8080, function() {
    console.log("Server Launched.");
})