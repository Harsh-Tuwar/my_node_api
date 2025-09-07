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
	const {
		name,
		email,
		phone,
		contactMethod,
		address,
		serviceArea,
		spaceType,
		currentCondition,
		hasCracks,
		squareFootage,
		desiredFinish,
		timeline,
		budget,
		description,
		agreeToContact
	} = req.body;

	const transport: Transport = {
		host: TRANSPORT_HOST,
		port: TRANSPORT_PORT,
		auth: {
			user: config.TUWAR_CORP_USERNAME,
			pass: config.TUWAR_CORP_PASSWORD
		}
	};

	const transporter: Mail = nodemailer.createTransport(transport);

	const subject = `Titan Bond Epoxy : New Service Inquiry from ${name || "Unknown"}`;

	const content: string = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8" />
			<title>${subject}</title>
		</head>
		<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; margin:0;">
			<table width="100%" cellpadding="0" cellspacing="0" border="0">
				<tr>
					<td align="center">
						<table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
							<tr>
								<td style="background:#004080; color:#ffffff; padding:20px; text-align:center;">
									<h2 style="margin:0; font-size:22px;">Titan Bond Epoxy: New Service Inquiry</h2>
								</td>
							</tr>
							<tr>
								<td style="padding:20px;">
									<p style="font-size:14px; color:#333;">A new service request has been submitted. Below are the details:</p>
									
									<h3 style="margin-top:20px; color:#004080;">📇 Contact Info</h3>
									<table width="100%" cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse; font-size:14px;">
										<tr><td><strong>Name:</strong></td><td>${name || "N/A"}</td></tr>
										<tr><td><strong>Email:</strong></td><td>${email || "N/A"}</td></tr>
										<tr><td><strong>Phone:</strong></td><td>${phone || "N/A"}</td></tr>
										<tr><td><strong>Preferred Contact:</strong></td><td>${contactMethod || "N/A"}</td></tr>
									</table>

									<h3 style="margin-top:20px; color:#004080;">🏗 Project Details</h3>
									<table width="100%" cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse; font-size:14px;">
										<tr><td><strong>Address:</strong></td><td>${address || "N/A"}</td></tr>
										<tr><td><strong>Service Area:</strong></td><td>${serviceArea || "N/A"}</td></tr>
										<tr><td><strong>Space Type:</strong></td><td>${spaceType || "N/A"}</td></tr>
										<tr><td><strong>Current Condition:</strong></td><td>${currentCondition || "N/A"}</td></tr>
										<tr><td><strong>Has Cracks:</strong></td><td>${hasCracks || "N/A"}</td></tr>
										<tr><td><strong>Square Footage:</strong></td><td>${squareFootage || "N/A"}</td></tr>
										<tr><td><strong>Desired Finish:</strong></td><td>${desiredFinish || "N/A"}</td></tr>
										<tr><td><strong>Timeline:</strong></td><td>${timeline || "N/A"}</td></tr>
										<tr><td><strong>Budget:</strong></td><td>${budget || "N/A"}</td></tr>
									</table>

									<h3 style="margin-top:20px; color:#004080;">📝 Additional Info</h3>
									<p style="font-size:14px; color:#333;"><strong>Description:</strong></p>
									<p style="font-size:14px; color:#555; background:#f0f0f0; padding:10px; border-radius:4px;">
										${description ? description.replace(/\n/g, "<br>") : "N/A"}
									</p>
									<p style="font-size:14px; color:#333;"><strong>Agree To Be Contacted:</strong> ${agreeToContact ? "Yes" : "No"}</p>
								</td>
							</tr>
							<tr>
								<td style="background:#f0f0f0; padding:10px; text-align:center; font-size:12px; color:#666;">
									Submitted on: ${new Date().toLocaleString()}
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>
		</html>
	`;

	const mail: Mail.Options = {
		from: `"${name || "Website Visitor"}" <${email || config.TUWAR_CORP_USERNAME}>`,
		to: config.TUWAR_CORP_USERNAME,
		cc: 'vasupatel21998@gmail.com',
		subject: subject,
		html: content
	};

	transporter.sendMail(mail, (err: Error | null, _: any) => {
		if (err) {
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				err: err,
				status: "fail"
			});
		} else {
			res.status(HttpStatusCode.OK).json({
				status: "success"
			});
		}
	});
};
