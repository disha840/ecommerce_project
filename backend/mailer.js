
const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
});

async function mailer(to, subject, sub, otp) {
    try {
        const email = [
            `From: ${process.env.GMAIL_USER}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            "Content-Type: text/html; charset=utf-8",
            "",
            `<h1>${sub}</h1>`
        ].join("\n");

        const encodedEmail = Buffer.from(email)
            .toString("base64url");

        const mail = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedEmail
            }
        });

        return mail.data;

    } catch (error) {
        console.log("GMAIL API ERROR:", error.message);
        return null;
    }
}

module.exports = mailer;
