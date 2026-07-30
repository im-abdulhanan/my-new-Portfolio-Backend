import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function main() {
  try {
    console.log('Verifying...');
    await transporter.verify();
    console.log('SMTP VERIFIED');
  } catch (err) {
    console.error(err);
  }
}

main();
