import express from 'express';
import axios from 'axios';
import { HttpStatusCode } from 'httpStatusCodes';

const BASE_URL = "https://zenquotes.io/api";
const MODES = ["today", "author", "random"];

const generateUrl = () => {
	const modeIndex = Math.floor(Math.random() * (3));

	return `${BASE_URL}/${MODES[modeIndex]}`;
}

export const GetQuote = async (_: express.Request, res: express.Response) => {
	const reqUrl = generateUrl();
	const quote = await axios.get(reqUrl);

	if (quote.status !== HttpStatusCode.OK) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: quote.data });
	}

	return res.status(HttpStatusCode.OK).json({
		quote: quote.data
	});
}
