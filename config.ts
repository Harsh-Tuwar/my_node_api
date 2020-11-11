import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	ALLOWED_CLICKS: process.env.ALLOWED_CLICKS,
	BASE_URL: process.env.BASE_URL
}