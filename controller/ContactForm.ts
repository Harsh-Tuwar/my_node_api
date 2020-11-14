import e from 'express';
import express from 'express';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { config } from '../config';

export const Send = (req: express.Request, res: express.Response) => {
	const transport = {
		host: 'smtp.gmail.com',
		port: 587,
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

	transporter.sendMail(mail, (err: any, data: any) => {
		if (err) {
			res.json({
				err: err,
				status: 'fail'
			});
		} else {
			res.json({
				status: 'success'
			});
		}
	});
}