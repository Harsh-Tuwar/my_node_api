import * as admin from "firebase-admin";
import * as certs from "./certs.json";

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

export const fbAdmin = admin.initializeApp({
	credential: admin.credential.cert(params)
}, "my-divi");