import { Email } from "../models";
import nodemailer from "nodemailer";
import { prepare } from "./";

const { GMAILUSER, GMAILPSW } = process.env;

interface EmailForm {
  from: string;
  output: string;
  subject: string;
  text?: string;
}

export async function sendEmail(email: string, data: EmailForm) {
  if (email.includes("@") && email.includes(".")) {
    const [address, domain] = email.split("@");
    let EmailAdress: any = await Email.findOne({ address, domain });

    if (EmailAdress) {
      EmailAdress = prepare(EmailAdress);
      let { from, output, subject, text } = data;

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
        from: from,
        to: EmailAdress,
        subject: subject,
        text: text,
        html: output
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
