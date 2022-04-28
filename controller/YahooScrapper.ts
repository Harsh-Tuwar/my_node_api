import express from "express";
import HttpStatusCode from '../httpStatusCodes';
import yahooFinance from 'yahoo-finance2';
import { QuoteResponseArray } from 'yahoo-finance2/dist/esm/src/modules/quote';
import { RecommendationsBySymbolResponse } from 'yahoo-finance2/dist/esm/src/modules/recommendationsBySymbol';
import { TrendingSymbolsResult } from 'yahoo-finance2/dist/esm/src/modules/trendingSymbols';
import { AutocResultSet } from 'yahoo-finance2/dist/esm/src/modules/autoc';

export const GetData_ByTicker = async (req: express.Request, res: express.Response) => {
	const { t } = req.body;

	if (!t) {
		return res.status(HttpStatusCode.NOT_FOUND).json({ err: 'Missing Ticker Symbol! ' });
	}
	
	let data: QuoteResponseArray;

	try {
		data = await yahooFinance.quote(t);
	} catch (error) {
		console.warn(`Skipping ${t} due to an error: ${error}`);
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: error });
	}

	return res.status(HttpStatusCode.OK).json({ data });
};


export const GetRecomendationsByTicker = async (req: express.Request, res: express.Response) => {
	const { t } = req.body;
	
	if (!t) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: 'Missing Ticker Symbol! ' });
	}

	let data: RecommendationsBySymbolResponse;

	try {
		data = await yahooFinance.recommendationsBySymbol(t);
	} catch (error) {
		console.warn(`Skipping due to an error: ${error}`);
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: error });
	}

	return res.status(HttpStatusCode.OK).json({ data });
};

export const GetTrendingSymbols = async (req: express.Request, res: express.Response) => {
	const country = req.body.country || 'CA';
	const queryOptions = { count: req.body.count || 10, lang: req.body.lang || 'en-US' };
	let data: TrendingSymbolsResult;

	try {
		data = await yahooFinance.trendingSymbols(country, queryOptions);
	} catch (error) {
		console.warn(`Unable to return trending symbols due to an error: ${error}`);
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: error });
	}

	return res.status(HttpStatusCode.OK).json({ data });
};

export const TickerAutoComplete = async (req: express.Request, res: express.Response) => {
	const query = req.body.query || '';
	let data: AutocResultSet;
	
	try {
		data = await yahooFinance.autoc(query);
	} catch (error) {
		console.warn(`Autocomplete failed due to an error: ${error}`);
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ err: error });
	}

	return res.status(HttpStatusCode.OK).json(JSON.stringify(data));
}
