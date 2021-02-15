import shortid from "shortid";
import { NextFunction, Request, Response } from "express";
import { fbAdmin } from "../firebase/MyDivi";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) { return false };

	await fbAdmin
		.auth()
		.verifyIdToken(req.headers.authorization)
		.then((decodedToken: any) => {
			next();
		}).catch((err) => {
			return res.status(403).json({ err });
		});
};

export const SavePortfolio = async (req: Request, res: Response) => {
	const { l, uid } = req.body;

	if (!uid) return res.status(400).json({ data: "Unknown User!" });

	if (!l) return res.status(400).json({ data: "Missing Label" });

	const user = await fbAdmin.auth().getUser(uid);
	const savedPortfolio = {
		uid: uid,
		label: l,
		createdAt: new Date().toISOString(),
		pid: shortid.generate()
	};

	if (user) {
		await fbAdmin.firestore().collection('Portfolio').doc().create(savedPortfolio);
		
		return res.status(200).json({ done: 1 });
	} else {
		return res.status(400).json({ done: 0 });
	}
};