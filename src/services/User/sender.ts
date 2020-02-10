import { Email } from "../../models";
import nodemailer from "nodemailer";

const { GMAILUSER, GMAILPSW, HOST } = process.env;

export async function sendPswResetEmail(email: string) {
  if (email.includes("@") && email.includes(".")) {
    const [address, domain] = email.split("@");
    const EmailAdress: any = await Email.findOne({ address, domain });

    if (EmailAdress) {
      const link = `${HOST}`;
      const output = `
        <h3>Click the link below to reset your password:</h3>
        <a href=${link}>Reset password</a>
      `;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAILUSER,
          pass: GMAILPSW
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let info = await transporter.sendMail({
        from: '"Feathery ➳" <GMAILUSER>',
        to: EmailAdress,
        subject: "Password Reset",
        text: "Hello world?",
        html: "<b>Hello world?</b>"
      });

      // console.log("Message sent: %s", info.messageId);
      // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return EmailAdress;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
