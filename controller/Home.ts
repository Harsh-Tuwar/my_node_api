import * as e from 'express';

export const Init = (req: e.Request, res: e.Response) => {
	const html = `<div>This is something fancy</div>`;
	return res.status(200).send(html);
};