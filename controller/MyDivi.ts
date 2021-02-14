import shortid from "shortid";
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

// export const LoadRes = async (req: Request, res: Response) => {
// 	const isAuthed = await isAuthenticated(req);

// 	if (!isAuthed) return res.status(403).json({ data: "Forbidden" });

// 	const { uid } = req.body;

// 	if (!uid) return res.status(400).json({ data: "Unknown User!" });

// 	let portfolios = null;

// 	await fbAdmin.firestore().collection('Portfolio').doc()
// };

export const SavePortfolio = async (req: Request, res: Response) => {
	const isAuthed = await isAuthenticated(req);

	if (!isAuthed) return res.status(403).json({ data: "Forbidden" });

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
		
		return res.status(200).json({ done: 1, savedPortfolio });
	} else {
		return res.status(400).json({ done: 0, savedPortfolio: null });
	}
};