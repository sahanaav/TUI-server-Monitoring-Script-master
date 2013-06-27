var nodemailer = require("nodemailer");
var Reciever_emails = require("./Reciever_emails");
// create reusable transport method (opens pool of SMTP connections)

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    //port:465,
    auth: {
        user: "madhusangita.behuria@gmail.com",
        pass: "kanchalanka"
    }
});
var listOfuser = Reciever_emails.listOfReciever;
//var transport = nodemailer.createTransport("Sendmail");
// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Madhusangita ✔ <madhusangita.behuria@gmail.com>", // sender address
    to: listOfuser, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world ✔", // plaintext body
   // html: "<b>Hello world ✔</b>" // html body
}
var sendEmail = function sendEmail(subject,text){
	//transport.sendMail(mailOptions);
	mailOptions.subject = subject;
	mailOptions.text = text;
	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}

		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	}); 
		
	

}

exports.sendEmail = sendEmail;