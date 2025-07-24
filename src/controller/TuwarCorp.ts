import express from 'express';
import HttpStatusCode from '../httpStatusCodes';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { config } from '../config';

const TRANSPORT_HOST = 'smtp.gmail.com';
const TRANSPORT_PORT = 587;

interface TransportAuth {
	user: string | undefined;
	pass: string | undefined;
}

interface Transport {
	host: string;
	port: number;
	auth: TransportAuth;
}

export const Inquiry = (req: express.Request, res: express.Response) => {
	const { name, email, project, phone } = req.body;

	const transport: Transport = {
		host: TRANSPORT_HOST,
		port: TRANSPORT_PORT,
		auth: {
			user: config.TUWAR_CORP_USERNAME,
			pass: config.TUWAR_CORP_PASSWORD
		}
	}

	const transporter: Mail = nodemailer.createTransport(transport);

	const msg = project;
	const subject = `We would like to use your service.`;
	
	const content: string = `
		<h2>New Waitlist request received For </h2>
		<p><strong>Name:</strong> ${name}</p>
		<p><strong>Phone:</strong> ${phone}</p>
		<p><strong>Email:</strong> ${email}</p>
		<p><strong>Subject:</strong> ${subject}</p>
		<hr>
		<p>Timestamp: ${new Date().toISOString()}</p>
		<p><strong>Project Request:</strong></p>
		<p>${msg.replace(/\n/g, '<br>')}</p>
	`;

	const mail: Mail.Options = {
		from: name,
		to: config.TUWAR_CORP_USERNAME,
		subject: subject,
		html: content
	}

	transporter.sendMail(mail, (err: Error | null, _: any) => {
		if (err) {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				err: err,
				status: 'fail'
			});
		} else {
			res.status(HttpStatusCode.OK).json({
				status: 'success'
			});
		}
	});
}
