import * as e from 'express';
import shortid from 'shortid';
import * as validUrl from 'valid-url';
import { config } from '../config';
import { fbAdmin } from '../firebase';

const admin = fbAdmin.firestore();

export const GenerateShortURL = async (req: e.Request, res: e.Response) => {
	const longURL = req.body.lurl;
	const baseURL = (config.NODE_ENV == 'development') ? 'http://localhost:5000/api' : config.BASE_URL;

	if (!validUrl.isUri(baseURL || 'https://url-shortner-kappa.vercel.app')) {
		return res.status(401).json("Internal Server Error. URL is invalid");
	}

	const urlCode = shortid.generate();

	if (validUrl.isUri(longURL)) {
		try {
			const query = await admin.collection('urls').where('longURL', '==', longURL).get();

			if (query.empty) {
				const shortURL = `${baseURL}/${urlCode}`;

				const data = {
					longURL: longURL,
					shortURL: shortURL,
					urlCode: urlCode,
					clickCount: "0"
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
		let clickCount = docsData.clickCount;
		const limit = config.ALLOWED_CLICKS || 20;

		if (clickCount >= limit) {
			console.log(`The click coun for ShortCode '${shortURLCode}' has passed the limit of ${limit}.`);
			return res.status(400).json(`The click count for shortcode '${shortURLCode}' has passed the limit of ${limit}.`);
		}

		clickCount++;
		
		await admin.collection('urls').doc(docsData.id).update({ clickCount: clickCount });
		
		return res.redirect(docsData.longURL);
	}
}