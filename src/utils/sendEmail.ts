import * as nodemailer from 'nodemailer';

type MailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
};

export async function sendMail(mailOptions: MailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    }
  });

  transporter
    .sendMail({
      from: process.env.EMAIL_FROM,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html || mailOptions.text,
      attachments: mailOptions.attachments || [],
    })
    .then((info: { messageId: string }) => {
      console.log('Email sent successfully: ', info.messageId);
    })
    .catch((err: { message: string }) => {
      console.log('Error while sending the email: ', err.message || err);
    });
}