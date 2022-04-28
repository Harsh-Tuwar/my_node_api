import * as validUrl from 'valid-url';
import express from 'express';
import shortid from 'shortid';
import DeviceDetector from 'device-detector-js';
import { config } from '../config';
import { fbAdmin } from '../firebase/URLShortner';
import { HttpStatusCode } from '../httpStatusCodes';

const admin = fbAdmin.firestore();

interface UrlDocument {
	clickCount: number;
	createdAt: string;
	urlCode: string;
	shortURL: string;
	longURL: string;
	id: string;
}

export const GenerateShortURL = async (req: express.Request, res: express.Response) => {
	const longURL = req.body.lurl; // longURL
	const slug = req.body.slug ?? ''; // custom slug
	const createdAt = new Date().toISOString(); //created Timestamp
	const baseURL = (config.NODE_ENV == 'development') ? `http://localhost:${config.PORT}` : config.BASE_URL;
	let query;

	try {
		query = await admin.collection('urls').where('urlCode', '==', slug).get();
	} catch (err) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err });
	}

	if (!query.empty) {
		return res.status(HttpStatusCode.CONFLICT).json({ err: 'Slug taken ' });
	}

	if (!validUrl.isUri(baseURL || 'https://cliqme.ml')) {
		return res.status(HttpStatusCode.BAD_REQUEST).json({ err: "Internal Server Error. URL is invalid" });
	}

	const urlCode = (slug == '') ? shortid.generate() : slug;

	if (validUrl.isUri(longURL)) {
		try {
			const query = await admin.collection('urls').where('longURL', '==', longURL).get();

			if (query.empty) {
				const shortURL = `${baseURL}/${urlCode}`;

				const urlDocument: UrlDocument = {
					longURL: longURL,
					shortURL: shortURL,
					urlCode: urlCode,
					clickCount: 0,
					createdAt: createdAt,
					id: '',
				};

				await admin.collection('urls').add(urlDocument);

				return res.status(HttpStatusCode.CREATED).json(urlDocument);
			} else {
				const url = {} as any;

				query.forEach(doc => {
					url[doc.id] = doc.data();
				});

				return res.status(HttpStatusCode.OK).json(url);
			}
		} catch (err) {
			console.error(err.message);
			return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: `Internal Server error ${err.message}` });
		}
	} else {
		return res.status(HttpStatusCode.BAD_REQUEST).json({ err: "Invalid URL. Please enter a valid url for shortening." });
	}
}

export const GetShortURL = async (req: express.Request, res: express.Response) => {
	const shortURLCode = req.params.shortUrl;
	const query = await admin.collection('urls').where('urlCode', '==', shortURLCode).get();

	let docsData = {} as UrlDocument;
	query.forEach(doc => {
		docsData = doc.data() as UrlDocument;
		docsData.id = doc.id;
	});

	if (query.empty) {
		return res.status(HttpStatusCode.NOT_FOUND).json("The short url doesn't exists in our system.");
	} else {
		const deviceDetector = new DeviceDetector();
		const userAgent: string | undefined = req.get('user-agent');
		const device = deviceDetector.parse(userAgent!);

		const analytics = {
			url: docsData.longURL,
			slug: docsData.urlCode,
			deviceClient: device.client,
			device: device.device,
			os: device.os,
			isBot: device.bot,
			clickedAt: new Date().toISOString()
		}

		await Promise.all([
			admin.collection('urls').doc(docsData.id).update({ clickCount: docsData.clickCount + 1 }),
			admin.collection('analytics').add(analytics),
		]);

		return res.status(HttpStatusCode.PERMANENT_REDIRECT).redirect(docsData.longURL);
	}
}
