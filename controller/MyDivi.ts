import { Request, Response } from "express";
import { fbAdmin } from "../firebase/MyDivi";

const isAuthenticated = async (req: Request) => {
	if (!req.headers.authorization) { return false };

	let gtg = false;

	await fbAdmin
		.auth()
		.verifyIdToken(req.headers.authorization)
		.then((decodedToken: any) => {
			gtg = true;
		}).catch((err) => {
			gtg = false;
		});
	
	return gtg;
};

export const SavePortfolio = async (req: Request, res: Response) => {
	const isAuthed = await isAuthenticated(req);

	if (!isAuthed) return res.status(403).json({ data: "Forbidden " });

	return res.status(200).json({ done: 1 });
}