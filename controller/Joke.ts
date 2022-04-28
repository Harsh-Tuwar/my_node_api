import express from 'express';
import axios, { AxiosResponse } from 'axios';
import HttpStatusCode from '../httpStatusCodes';

const BASE_URL = 'https://icanhazdadjoke.com/';

interface Joke {
	id: string;
	joke: string;
	status: number;
}

export const GetAJoke = async (_: express.Request, res: express.Response) => {
	let response;

	try {
		response = await axios.get(BASE_URL, {
			headers: { 'Accept': 'text/plain' }
		}) as AxiosResponse<Joke>;
	} catch (error) {
		console.log(error);
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
	}

	return res.status(HttpStatusCode.OK).send(response.data);
};
