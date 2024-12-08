import express from 'express';
import { Storage } from 'megajs'
import { config } from '../config';
import HttpStatusCode from '../httpStatusCodes';

export const GetBookById = async (req: express.Request, res: express.Response) => {
	try {
		const { bookId } = req.params;

		const storage = await new Storage({
			email: config.MEGA_NZ_EMAIL ?? '',
			password: config.MEGA_NZ_PASS ?? '',
			autologin: true,
		}).ready.catch((err) => {
			throw new Error(err);
		});

		const file = storage.find(`${bookId}.pdf`, true);

		if (!file) throw new Error('File not found!');

		const fileUrl = await file?.link({ key: file.key?.toString() });

		return res.status(HttpStatusCode.OK).redirect(fileUrl);
	} catch (error) {
		console.log(error);
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
			error: 'Something went wrong. Check logs for debugging.'
		});
	}
};
