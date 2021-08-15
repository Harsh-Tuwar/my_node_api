import * as e from "express";
import yahooFinance from 'yahoo-finance2';

export const GetData_ByTicker = async (req: e.Request, res: e.Response) => {
	const { t } = req.body;

	if (!t) return res.status(500).json({ err: 'Missing Ticker Symbol! ' });
	
	let data = null;

	try {
		data = await yahooFinance.quote(t);
	} catch (error) {
		console.warn(`Skipping ${t} due to an error: ${error}`);
		return res.status(500).json({ err: 'Error!', data: error });
	}

	return res.status(200).json({ data });
};


export const GetRecomendationsByTicker = async (req: e.Request, res: e.Response) => {
	let data = null;
	const { t } = req.body;

	if (!t) return res.status(500).json({ err: 'Missing Ticker Symbol! ' });

	try {
		data = await yahooFinance.recommendationsBySymbol(t);
	} catch (error) {
		console.warn(`Skipping due to an error: ${error}`);
		return res.status(500).json({ err: 'Error!', data: error });
	}

	return res.status(200).json({ data });
};

export const GetTrendingSymbols = async (req: e.Request, res: e.Response) => {
	const country = req.body.country || 'CA';
	const queryOptions = { count: req.body.count || 10, lang: req.body.lang || 'en-US' };
	let data = null;

	try {
		data = await yahooFinance.trendingSymbols(country, queryOptions);
	} catch (error) {
		console.warn(`Unable to return trending symbols due to an error: ${error}`);
		return res.status(500).json({ err: 'Error!', data: error });
	}

	return res.status(200).json({ data });
};

export const TickerAutoComplete = async (req: e.Request, res: e.Response) => {
	const query = req.body.query || '';
	let data = null;
	
	try {
		data = await yahooFinance.autoc(query);
	} catch (error) {
		console.warn(`Autocomplete failed due to an error: ${error}`);
		return res.status(500).json({ err: 'Error!', data: error });
	}

	return res.status(200).json(JSON.stringify(data));
}