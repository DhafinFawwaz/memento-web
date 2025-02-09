import { createTransport } from "nodemailer";
import { env } from "./env";

const transporter = createTransport({
    service: "gmail",
    auth: {
      user: env.emailUser,
      pass: env.gmailAppPassword,
    },
});
function createOption(file: string) {
    return {
        from: env.emailUser,
        to: env.emailUser,
        subject: "Today Report",
        text: "Here's the report",
        attachments: [
            {
                filename: "report.csv",
                content: file,
                contentType: "text/csv",
            },
        ],
    };
}

export function sendEmail(csvstr: string) {
    transporter.sendMail(createOption(csvstr), (err, info) => {
        if (err) {
            console.error(err);
        } else {
            console.log(info);
        }
    });
}