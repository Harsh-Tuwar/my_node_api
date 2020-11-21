import * as admin from 'firebase-admin';
import firebase from 'firebase';
import * as certs from './certs.json';

const params = {
	type: certs.type,
	projectId: certs.project_id,
	privateKeyId: certs.private_key_id,
	privateKey: certs.private_key,
	clientEmail: certs.client_email,
	clientId: certs.client_id,
	authUri: certs.auth_uri,
	tokenUri: certs.token_uri,
	authProviderX509CertUrl: certs.auth_provider_x509_cert_url,
	clientC509CertUrl: certs.client_x509_cert_url
};

const firebaseConfig = {
	apiKey: "AIzaSyDzhi5URBCBG9hRhxAT7XF5eeP6qKdqC54",
	authDomain: "expense-tracker-48719.firebaseapp.com",
	databaseURL: "https://expense-tracker-48719.firebaseio.com",
	projectId: "expense-tracker-48719",
	storageBucket: "expense-tracker-48719.appspot.com",
	messagingSenderId: "136208547871",
	appId: "1:136208547871:web:5b420fee97ff0495bc152a",
	measurementId: "G-33K0MHNPQN"
};

export const fbApp = firebase.initializeApp(firebaseConfig);

export const fbAdmin = admin.initializeApp({
	credential: admin.credential.cert(params)
}, 'exp-tracker');