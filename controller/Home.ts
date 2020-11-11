import * as e from 'express';

export const Init = (req: e.Request, res: e.Response) => {
	res.status(200).send("Hello World");
};