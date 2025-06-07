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

export const Send = (req: express.Request, res: express.Response) => {
	const transport: Transport = {
		host: TRANSPORT_HOST,
		port: TRANSPORT_PORT,
		auth: {
			user: config.USERNAME,
			pass: config.PASS
		}
	}

	const transporter: Mail = nodemailer.createTransport(transport);

	const { name, email, role, munic, msg, subject } = req.body;
	const content: string = `
		<h2>New Message Received From CiviLens</h2>
		<p><strong>Name:</strong> ${name}</p>
		<p><strong>Email:</strong> ${email}</p>
		<p><strong>Role:</strong> ${role}</p>
		<p><strong>Municipality:</strong> ${munic}</p>
		<p><strong>Subject:</strong> ${subject}</p>
		<hr>
		<p><strong>Message:</strong></p>
		<p>${msg.replace(/\n/g, '<br>')}</p>
	`;

	const mail: Mail.Options = {
		from: name,
		to: config.USERNAME,
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
