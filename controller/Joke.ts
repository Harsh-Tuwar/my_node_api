import * as e from 'express';
import axios, { AxiosResponse } from 'axios';
import HttpStatusCode from 'httpStatusCodes';

const baseURL = 'https://icanhazdadjoke.com/';

interface Joke {
	id: string;
	joke: string;
	status: number;
}

export const GetAJoke = async (_: e.Request, res: e.Response) => {
	let response;

	try {
		response = await axios.get(baseURL, {
			headers: { 'Accept': 'text/plain' }
		}) as AxiosResponse<Joke>;
	} catch (error) {
		console.log(error);
		return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
	}

	return res.status(HttpStatusCode.OK).send(response.data);
};