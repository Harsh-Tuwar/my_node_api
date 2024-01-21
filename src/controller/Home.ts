import express from 'express';
import { config } from '../config';

export const Init = (_: express.Request, res: express.Response) => {
	return res.redirect(config.HARSH_TUWAR_URL ?? 'https://harshtuwar.vercel.app');
};
