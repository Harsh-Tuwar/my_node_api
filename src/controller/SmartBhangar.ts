import express from 'express';
import HttpStatusCode  from '../httpStatusCodes';
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


interface CartItem { 
	title: string; 
	id: string;
	ourPrice: string;
	orderQuantity: string;
}

interface Cart {
	[id: string]: CartItem;
}

export const Inquiry = (req: express.Request, res: express.Response) => {
	const transport: Transport = {
		host: TRANSPORT_HOST,
		port: TRANSPORT_PORT,
		auth: {
			user: config.HIDDEN_TREASURES_USERNAME,
			pass: config.HIDDEN_TREASURES_PASS
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
		cc: 'sahil.lapsiwala@gmail.com, fenilshah288@gmail.com, vaimorss2468@gmail.com, tuwarharsh08@gmail.com, mdhruvin946@gmail.com',
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

export const SubmitOrder = (req: express.Request, res: express.Response) => {
	const transport: Transport = {
		host: TRANSPORT_HOST,
		port: TRANSPORT_PORT,
		auth: {
			user: config.HIDDEN_TREASURES_USERNAME,
			pass: config.HIDDEN_TREASURES_PASS
		}
	}

	const transporter: Mail = nodemailer.createTransport(transport);

	const { name, cart, email, phone, total, totalWithTax } = req.body;

	if (!cart || !name || !email || !phone || !total || !totalWithTax) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
			err: 'Missing required data!',
			status: 'fail'
		});
	}

	let products = '';

	if (Object.keys(cart).length) {
		Object.values(cart as Cart).forEach((item) => {
			products += `
				<tr>
					<td>${item.id}</td>
					<td>${item.title}</td>
					<td>${item.orderQuantity}</td>
					<td>${item.ourPrice}</td>
				</tr>
			`;
		});
	}
	
	const content: string = `
			<!DOCTYPE html>
			<html lang="en">
			
			<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>🤩 New Order 🤩</title>
			</head>
			
			<body>
				<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
					<h2 style="text-align: center;">New Order</h2>
					<hr>
					<p><strong>You have received a new order!</strong></p>

					<p>Here are the contact details of the customer! Please make sure to reach out to them in next 1 hour!<p>
					<div>
						<div><b>Name: </b> ${name}</div>
						<div><b>Email: </b> ${email}</div>
						<div><b>Phone: </b> ${phone}</div>
					</div>
					<p>Here are the order details:</p>
				
					<table style="width: 100%;">
						<tr>
							<th style="text-align: left;">Tag Number</th>
							<th style="text-align: left;">Product</th>
							<th style="text-align: left;">Quantity</th>
							<th style="text-align: left;">Price</th>
						</tr>
						${products}
						<tr>
							<td colspan="4">
								<hr style="border-top: 1px solid #ccc;">
							</td>
						</tr>

						<tr>
							<td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
							<td>${total}</td>
						</tr>

						<!-- Total with tax row -->
						<tr>
							<td colspan="3" style="text-align: right;"><strong>Total with Tax:</strong></td>
							<td>${totalWithTax}</td>
						</tr>
					</table>
				
					<p style="margin-top: 20px;">Please process the order and arrange for the shipment to the customer as soon as possible.</p>
					<p>Thank you for your prompt attention.</p>
					<p>Best regards,<br>Hidden Treasures</p>
				</div>
			</body>
			
			</html>
	`;

	const mail: Mail.Options = {
		from: name,
		to: config.USERNAME,
		cc: 'sahil.lapsiwala@gmail.com, fenilshah288@gmail.com, vaimorss2468@gmail.com, tuwarharsh08@gmail.com, mdhruvin946@gmail.com',
		subject: 'New Order Placed!',
		html: content
	}

	return transporter.sendMail(mail, (err: Error | null, _: any) => {
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