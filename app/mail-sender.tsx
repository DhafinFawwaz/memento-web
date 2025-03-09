import { createTransport } from "nodemailer";
import { env } from "./env";

const transporter = createTransport({
    service: "gmail",
    auth: {
      user: env.emailUser,
      pass: env.gmailAppPassword,
    },
});
function createOption(file: string, dayStr: string) {
    return {
        from: env.emailUser,
        to: env.emailUser,
        subject: "Memento Report",
        text: "Report for today, " + dayStr,
        attachments: [
            {
                filename: "report.csv",
                content: file,
                contentType: "text/csv",
            },
        ],
    };
}

export async function sendEmailToSelf(csvstr: string, dayStr: string): Promise<void> {
    return new Promise((resolve, reject) => {
        transporter.sendMail(createOption(csvstr, dayStr), (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve();
            }
        });
    });
}