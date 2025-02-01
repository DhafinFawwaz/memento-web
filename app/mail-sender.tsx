import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD,
    },
});
function createOption(file: string) {
    return {
        from: process.env.NEXT_PUBLIC_EMAIL_USER,
        to: process.env.NEXT_PUBLIC_EMAIL_USER,
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