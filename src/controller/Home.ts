import express from 'express';

export const Init = (_: express.Request, res: express.Response) => {
	return res.redirect('https://harshtuwar.ml');
};
