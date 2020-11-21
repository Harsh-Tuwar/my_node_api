import * as e from 'express';
import firebase from 'firebase';
import { fbAdmin, fbApp } from '../firebase/ExpenseTracker';

const auth = fbApp.auth();
const db = fbAdmin.firestore();

export const CreateUser = (req: e.Request, res: e.Response) => {
	const { e, p, n } = req.body;

	if (!e || !p) {
		res.status(400).json({ error : "Email and/or Password field is empty!" });
	}

	auth.createUserWithEmailAndPassword(e, p).then(async (userData: firebase.auth.UserCredential) => {
		return res.status(200).json({ done: 1 });
	}).catch((err) => {
		return res.status(400).json({ error: `fail to create new user ${err}` });
	});
}

export const SignIn = (req: e.Request, res: e.Response) => {
	const { e, p } = req.body;

	if (!e || !p) {
		res.status(400).json({ err: "Email and/or Password field is empty!" });
	}

	auth.signInWithEmailAndPassword(e, p).then(() => {
		return res.status(200).json({ done: 1, user: auth.currentUser });
	}).catch((err: Error) => {
		return res.status(400).json({ error: `Error signing in: ${err}` });
	});
}