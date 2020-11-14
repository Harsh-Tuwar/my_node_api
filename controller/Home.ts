import * as e from 'express';

export const Init = (req: e.Request, res: e.Response) => {
	res.status(200).json({
		data: 'Welcome to Harsh Tuwar\'s api. You can reach to him via https://harshtuwar.ml'
	});
};