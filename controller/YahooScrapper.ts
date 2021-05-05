import * as e from "express";
const yahooStockAPI = require('yahoo-stock-api');
const yahoo = require("yahoo-financial-data");

export const GetData_ByTicker = async (req: e.Request, res: e.Response) => {
	const { t } = req.body;

	if (!t) return res.status(400).json({ err: 'Missing Ticker Symbol! ' });

	const d = await yahooStockAPI.getSymbol(t);

	const preparedData: any = await prepareDataForTicker(d, t);

	return res.status(200).json({ payload: preparedData });
};

export const GetName_ByTicker = async (req: e.Request, res: e.Response) => {
	const { t } = req.body;

	if (!t) return res.status(400).json({ err: 'No Symbol Found!' });

	const name: any = await new Promise((resolve, reject) => {
		yahoo.companyName(t, function (err: Error, data: any) {
			if (err) {
				reject({ err });
			} else {
				resolve({ data });
			}
		});
	});

	return res.status(200).json({ name: name.data });
}

const prepareDataForTicker = async (data: any, ticker: string) => {
	if (data && data.response) {
		const price: any = await new Promise((resolve, reject) => {
			yahoo.price(ticker, function (err: Error, data: any) {
				if (err) {
					reject({ err });
				} else {
					resolve({ data });
				}
			});
		});

		const name: any = await new Promise((resolve, reject) => {
			yahoo.companyName(ticker, function (err: Error, data: any) {
				if (err) {
					reject({ err });
				} else {
					resolve({ data });
				}
			});
		});

		data.response.name = name.data;
		data.response.price = price.data;	
		
		if (data.response.hasOwnProperty('inceptionDate')) {
			data.response.dividendYield = Number(data.response.yield * 100).toFixed(2) + "%";

			[
				'netAssets', 'nav',
				'ytdDailyTotalReturn', 'expenseRatio',
				'inceptionDate'
			].forEach((item) => data.response[item]);
		} else {
			const divYeild = data.response.forwardDividendYield.split(" ");
			
			if (divYeild[0] === 'N/A' || divYeild[1] === '(N/A)') {
				data.response.dividendYield = "N/A";
				data.response.dividend = "N/A";
			} else {
				data.response.dividendYield = divYeild[1].match(/\((.*)\)/).pop();
				data.response.dividend = divYeild[0];
			}

			['forwardDividendYield', 'eps'].forEach((item) => delete data.response[item]);
		}
		
		[
			'updated', 'previousClose', 'peRatio',
			'open', 'bid', 'eps',
			'ask', 'dayRange', 'oneYearTargetEst',
			'volume', 'avgVolume', 'beta', 'fiftyTwoWeekRange'
		].forEach((item: string) => delete data.response[item]);

		const payload: any = {
			error: data.error,
			currency: data.currency,
			isETF: data.response.hasOwnProperty('inceptionDate'),
			exDivDate: data.response.exDividendDate ?? "",
			name: data.response.name,
			price: String(data.response.price),
			dividendYield: data.response.dividendYield ?? "",
			dividend: data.response.dividend ?? String(data.response.ytdDailyTotalReturn)
		}

		return payload;
	}
}