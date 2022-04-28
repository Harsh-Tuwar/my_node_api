import * as admin from 'firebase-admin';
import { config } from '../../config';

const params = {
	type: config.URL_SHORTNER_FB_TYPE,
	projectId: config.URL_SHORTNER_FB_PROJECT_ID,
	privateKeyId: config.URL_SHORTNER_FB_PROJECT_ID,
	privateKey: config.URL_SHORTNER_FB_PRIVATE_KEY,
	clientEmail: config.URL_SHORTNER_FB_CLIENT_EMAIL,
	clientId: config.URL_SHORTNER_FB_CLIENT_ID,
	authUri: config.URL_SHORTNER_FB_AUTH_URI,
	tokenUri: config.URL_SHORTNER_FB_TOKEN_URI,
	authProviderX509CertUrl: config.URL_SHORTNER_FB_AUTH_PROVIDER_X509_CERT_URL,
	clientC509CertUrl: config.URL_SHORTNER_FB_CLIENT_X509_CERT_URL
};

export const fbAdmin = admin.initializeApp({
	credential: admin.credential.cert(params)
}, 'url-shortner');


