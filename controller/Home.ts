import * as e from 'express';
import fs from 'fs';

export const Init = (req: e.Request, res: e.Response) => {
	fs.readFile(__dirname + "/../public/index.html", function (error, html) {
		if (error) {
			throw error;
		}

		res.status(200).end(html);
	});
	// return res.status(200).send(html);
};