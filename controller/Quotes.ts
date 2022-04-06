import axios from 'axios';
import * as express from 'express';

const BASE_URL = "https://zenquotes.io/api";
const MODES = ["today", "author", "random"];

const generateUrl = () => {
	const modeIndex = Math.floor(Math.random() * (3));

	return `${BASE_URL}/${MODES[modeIndex]}`;
}

export const GetQuote = async (_: express.Request, res: express.Response) => {
	const reqUrl = generateUrl();
	const quote = await axios.get(reqUrl);

	if (quote.status !== 200) {
		return res.status(500).json({ err: quote.data });
	}

	return res.status(200).json({
		quote: quote.data
	})
}
