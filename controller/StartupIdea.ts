import express from 'express';
import axios, { AxiosResponse } from 'axios';
import HttpStatusCode from '../httpStatusCodes';

const BASE_URL = 'https://itsthisforthat.com/api.php?text';

export const GetIdea = async (_: express.Request, res: express.Response) => {
	const response: AxiosResponse<string> = await axios.get(BASE_URL);
	
	if (response.data === undefined) {
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error!' });
	}

	const idea = response.data.split('So, Basically, It\'s Like A ')[1];

	return res.status(HttpStatusCode.OK).json({ idea });
}
