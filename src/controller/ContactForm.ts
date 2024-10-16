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

	const { name, email, msg, subject } = req.body;
	const content: string = `
		 \nNew Message from ${name}
		  \nEmail: ${email}
		  \nWrote:
		  \n${msg}
	`;

	const mail: Mail.Options = {
		from: name,
		to: config.USERNAME,
		subject: subject,
		text: content
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

export const SendToDavisPatel = (req: express.Request, res: express.Response) => {
	const transport: Transport = {
		host: TRANSPORT_HOST,
		port: TRANSPORT_PORT,
		auth: {
			user: config.DAVIS_SMTP_USERNAME,
			pass: config.DAVIS_SMTP_PASSWORD
		}
	}

	const transporter: Mail = nodemailer.createTransport(transport);

	const { name, email, msg, subject, phone, address } = req.body;
	const content: string = `
		 \nNew Message from ${name}
		  \nEmail: ${email}
		  \nPhone: ${phone}
		  \nAddress: ${address}
		  \nWrote:
		  \n${msg}
	`;

	const mail: Mail.Options = {
		from: name,
		to: 'info@ddsgroup.ca',
		subject: subject,
		text: content
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
