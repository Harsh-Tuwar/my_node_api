import * as e from "express";
import request from "request";
import cheerio from "cheerio";

export const GetData_ByTicker = async (req: e.Request, res: e.Response) => {
	const { t } = req.body;

	if (!t) return res.status(400).json({ err: 'Missing Ticker Symbol! ' });

	request(`https://ca.finance.yahoo.com/quote/${t}/key-statistics?p=${t}`, (err, resp, html) => {
		if (err) {
			console.log(err);
			return res.status(400).json(err);
		}

		const $ = cheerio.load(html);

		const name = $("div[data-reactid='6'] > h1[data-reactid='7']").text().toString();
		const price = $("div[data-reactid='31'] > span[data-reactid='32']").text().toString();
		const exDivDate = $("table[data-reactid='230'] td[data-reactid='284'] span[data-reactid='289']").text();
		
		return res.status(200).json({ price, name, exDivDate });
		// return res.status(200).json({ exDivDate });
	});
}