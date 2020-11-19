import * as e from 'express';
import shortid from 'shortid';
import DevideDetector from 'device-detector-js';
import * as validUrl from 'valid-url';
import { config } from '../config';
import { fbAdmin } from '../firebase';

const admin = fbAdmin.firestore();

export const GenerateShortURL = async (req: e.Request, res: e.Response) => {
	const longURL = req.body.lurl; // longURL
	const slug = req.body.slug ?? ''; // custom slug
	const createdAt = new Date().toISOString(); //created Timestamp
	const baseURL = (config.NODE_ENV == 'development') ? 'http://localhost:5000' : config.BASE_URL;
	const query = await admin.collection('urls').where('urlCode', '==', slug).get();

	if (!query.empty) {
		return res.status(400).json({ err: 'Slug taken ' });
	}

	if (!validUrl.isUri(baseURL || 'https://cliqme.ml')) {
		return res.status(401).json("Internal Server Error. URL is invalid");
	}

	const urlCode = (slug == '') ? shortid.generate() : slug;

	if (validUrl.isUri(longURL)) {
		try {
			const query = await admin.collection('urls').where('longURL', '==', longURL).get();

			if (query.empty) {
				const shortURL = `${baseURL}/${urlCode}`;

				const data = {
					longURL: longURL,
					shortURL: shortURL,
					urlCode: urlCode,
					clickCount: "0",
					createdAt: createdAt
				};

				await admin.collection('urls').add(data);

				return res.status(201).json(data);
			} else {
				const url = {} as any;

				query.forEach(doc => {
					url[doc.id] = doc.data();
				});

				return res.status(200).json(url);
			}
		} catch (err) {
			console.error(err.message);
            return res.status(500).json("Internal Server error " + err.message);
		}
	} else {
		res.status(400).json("Invalid URL. Please enter a vlaid url for shortening.");
	}
}

export const GetShortURL = async (req: e.Request, res: e.Response) => {
	const shortURLCode = req.params.shortUrl;
	const query = await admin.collection('urls').where('urlCode', '==', shortURLCode).get();
	
	let docsData = {} as any;
	query.forEach(doc => {
		docsData = doc.data();
		docsData.id = doc.id; 
	});

	if (query.empty) {
		return res.status(400).json("The short url doesn't exists in our system.");
	} else {
		const limit = config.ALLOWED_CLICKS || 20;
		const deviceDetector = new DevideDetector();
		const userAgent: any = req.get('user-agent');
		const device = deviceDetector.parse(userAgent);

		const analytics = {
			url: docsData.longURL,
			slug: docsData.urlCode,
			deviceClient: device.client,
			device: device.device,
			os: device.os,
			isBot: device.bot,
			clickedAt: new Date().toISOString()
		}

		let clickCount = docsData.clickCount;

		clickCount++;
		
		await admin.collection('urls').doc(docsData.id).update({ clickCount: clickCount });

		await admin.collection('analytics').add(analytics);
		
		return res.redirect(docsData.longURL);
	}
}