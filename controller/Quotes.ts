import express from 'express';
import axios from 'axios';
import { HttpStatusCode } from '../httpStatusCodes';

const BASE_URL = "https://zenquotes.io/api";
const MODES = ["today", "author", "random"];

const generateUrl = (mode?: string) => {
	if (!mode) {
		return BASE_URL;
	}

	return `${BASE_URL}/${mode}`;
}

export const GetQuote = async (req: express.Request, res: express.Response) => {
	const mode = req.query.mode as string | undefined;

	if (mode && !MODES.includes(mode)) {
		return res.status(HttpStatusCode.BAD_REQUEST).json({ err: 'Invalid mode! ' });
	}

	const reqUrl = generateUrl(mode);
	const quote = await axios.get(reqUrl);

	if (quote.status !== HttpStatusCode.OK) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: quote.data });
	}

	return res.status(HttpStatusCode.OK).json({
		quote: quote.data
	});
}
