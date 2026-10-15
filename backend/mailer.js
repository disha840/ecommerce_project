const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    // host:"smtp.ethereal.email",
    // port:587,
    // secure:false,
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})
transporter.verify((error, success) => {
    if (error) {
        console.log("MAIL ERROR:", error);
    } else {
        console.log("Mail server is ready");
    }
});


async function mailer(to,subject,sub,otp){
const mail=await transporter.sendMail({
    from:process.env.EMAIL,
    to:to,
    subject:subject,
    html:`<h1> your ${sub} is ${otp}</h1>`

})
return mail
}
module.exports=mailer