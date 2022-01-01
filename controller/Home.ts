import * as e from 'express';
import fs from 'fs';

export const Init = (req: e.Request, res: e.Response) => {
	fs.readFile(__dirname + "/../public/home.html", function (error, html) {
		if (error) {
			return res.status(500).json({ error });
		}
		
		res.status(200).end(html);
	});
};