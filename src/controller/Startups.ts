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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Send = (req: express.Request, res: express.Response) => {
	const appName = req.params.appName;
	const event = req.params.event;
	const { name, email, metadata } = req.body ?? {};

	const errors: string[] = [];
	if (!appName) errors.push('appName route param is required');
	if (!event) errors.push('event route param is required');
	if (typeof name !== 'string' || name.trim().length === 0) errors.push('name is required');
	if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) errors.push('a valid email is required');

	if (errors.length > 0) {
		res.status(HttpStatusCode.BAD_REQUEST).json({
			status: 'fail',
			errors
		});
		return;
	}

	const transport: Transport = {
		host: TRANSPORT_HOST,
		port: TRANSPORT_PORT,
		auth: {
			user: config.USERNAME,
			pass: config.PASS
		}
	}

	const transporter: Mail = nodemailer.createTransport(transport);

	const appLabel = appName.toLocaleUpperCase();
	const eventLabel = event.toLowerCase();
	const subject = `New ${eventLabel} request — ${appLabel}`;
	const submittedAt = new Date();

	const forwardedFor = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim();
	const ip = forwardedFor || req.ip || req.socket?.remoteAddress || 'unknown';
	const userAgent = (req.headers['user-agent'] as string | undefined) || 'unknown';
	const referer = (req.headers['referer'] || req.headers['referrer']) as string | undefined;
	const origin = req.headers['origin'] as string | undefined;
	const language = (req.headers['accept-language'] as string | undefined)?.split(',')[0];

	const escapeHtml = (value: unknown): string =>
		String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');

	const renderValue = (value: unknown): string => {
		if (value === null || value === undefined) return '<em style="color:#888;">—</em>';
		if (typeof value === 'boolean') return value ? '✅ true' : '❌ false';
		if (typeof value === 'object') {
			return `<pre style="margin:0;padding:8px;background:#f6f8fa;border-radius:4px;font-size:12px;overflow:auto;">${escapeHtml(JSON.stringify(value, null, 2))}</pre>`;
		}
		return escapeHtml(value);
	};

	const renderRow = (label: string, value: string): string => `
		<tr>
			<td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-weight:600;width:35%;vertical-align:top;">${escapeHtml(label)}</td>
			<td style="padding:8px 12px;border-bottom:1px solid #eee;color:#222;">${value}</td>
		</tr>
	`;

	const isValidMetadata =
		metadata &&
		typeof metadata === 'object' &&
		!Array.isArray(metadata) &&
		Object.keys(metadata).length > 0;

	const metadataSection: string = isValidMetadata
		? `
		<h3 style="margin:24px 0 8px;color:#333;font-size:16px;">Custom metadata</h3>
		<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-radius:6px;overflow:hidden;">
			${Object.entries(metadata).map(([k, v]) => renderRow(k, renderValue(v))).join('')}
		</table>
	`
		: '';

	const content: string = `
		<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#222;">
			<div style="border-left:4px solid #4f46e5;padding:4px 16px;margin-bottom:24px;">
				<div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">New ${escapeHtml(eventLabel)} request</div>
				<h2 style="margin:4px 0 0;font-size:22px;color:#111;">${escapeHtml(appLabel)}</h2>
			</div>

			<h3 style="margin:0 0 8px;color:#333;font-size:16px;">Submitter</h3>
			<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-radius:6px;overflow:hidden;">
				${renderRow('Name', escapeHtml(name ?? '—'))}
				${renderRow('Email', email ? `<a href="mailto:${escapeHtml(email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(email)}</a>` : '—')}
				${renderRow('App', escapeHtml(appName))}
				${renderRow('Event', `<span style="display:inline-block;padding:2px 8px;background:#eef2ff;color:#4f46e5;border-radius:12px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">${escapeHtml(eventLabel)}</span>`)}
			</table>

			${metadataSection}

			<h3 style="margin:24px 0 8px;color:#333;font-size:16px;">Request context</h3>
			<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-radius:6px;overflow:hidden;">
				${renderRow('Submitted at', `${escapeHtml(submittedAt.toISOString())} <span style="color:#888;">(${escapeHtml(submittedAt.toUTCString())})</span>`)}
				${renderRow('IP address', escapeHtml(ip))}
				${renderRow('User agent', escapeHtml(userAgent))}
				${origin ? renderRow('Origin', escapeHtml(origin)) : ''}
				${referer ? renderRow('Referer', escapeHtml(referer)) : ''}
				${language ? renderRow('Language', escapeHtml(language)) : ''}
			</table>

			<p style="margin-top:24px;color:#888;font-size:12px;">Reply directly to this email to respond to ${escapeHtml(name ?? 'the submitter')}.</p>
		</div>
	`;

	const mail: Mail.Options = {
		from: config.USERNAME,
		to: config.USERNAME,
		replyTo: email ? `${name ?? ''} <${email}>`.trim() : undefined,
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
