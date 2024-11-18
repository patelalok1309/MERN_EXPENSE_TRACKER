import { config } from 'dotenv';
config();
import { emailTemplate } from '../templates/email.js';
import { createTransport } from 'nodemailer';

const transport = createTransport({
	host: process.env.SMTP_HOST,
	port: 587,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export const sendMail = async (receiptentEmailAddress, verificationCode) => {
	try {
		const info = await transport.sendMail({
			from: 'MERN EXPENSE TRACKER',
			to: `${receiptentEmailAddress}`,
			subject: 'Verification mail for testing',
			html: emailTemplate(verificationCode),
		});

		console.log('INFO', info);
	} catch (error) {
		console.log('ERROR SENDING EMAIL', error);
	}
};
