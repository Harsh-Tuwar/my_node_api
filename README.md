# My Node API

This repository contains the code for my personal Node API which I am using for many of my side projects. It's currently deployed on Vercel and I've been using it for:

- Contact Form on my [website](https://harshtuwar.ml)
- Random Joke
- Url Shortener
- Random startup idea
- Yahoo Finance Scrapping

# 💻 Setup

1. Clone Repo and install node packages

```sh
git clone git@github.com:Harsh-Tuwar/my_node_api.git
cd my_node_api && npm install
```

2. Once installed you'll need an `.env` file for URL Shortener and NodeMailer to work.

3. Setup `.env` 
    - if you are already a part of `Harsh's Vercel Team`, run the following command and that would  generate an `.env` file for you.
	```sh
		npx vercel env pull
	```
	- if not, create a new `.env` file under the root of your project or run this command below.
	```sh
		touch .env &&
		echo `
			# required only for URL Shortener to work
			# create a firebase project, create a new admin app > copy JSON data into your .env file
			URL_SHORTNER_FB_CLIENT_X509_CERT_URL=""
			URL_SHORTNER_FB_AUTH_PROVIDER_X509_CERT_URL=""
			URL_SHORTNER_FB_TOKEN_URI=""
			URL_SHORTNER_FB_AUTH_URI=""
			URL_SHORTNER_FB_CLIENT_ID=""
			URL_SHORTNER_FB_CLIENT_EMAIL=""
			URL_SHORTNER_FB_PRIVATE_KEY=""
			URL_SHORTNER_FB_PROJECT_ID=""
			URL_SHORTNER_FB_TYPE=""
			BASE_URL=""
			ALLOWED_CLICKS=""
			# required only for Nodemailer to work, where to get this data? => https://support.google.com/accounts/answer/185833?hl=en)
			PASS=""
			USERNAME=""
			# required for node
			PORT="5001"
			NODE_ENV="development"
		` >> .env
	```
4. you are all set. Compile and run your code by running this command in your terminal

```sh
npm run dev 
# or
yarn dev
````

Happy coding :)

# API Endpoints
```sh
GET http://localhost:5001/
GET http://localhost:5001/shortener/:shortURL
GET http://localhost:5001/ideas
GET http://localhost:5001/jokes
GET http://localhost:5001/quotes

POST http://localhost:5001/shortener
POST http://localhost:5001/send
POST http://localhost:5001/scrap/GetData_ByTicker
POST http://localhost:5001/scrap/GetRecomendationsByTicker
POST http://localhost:5001/scrap/GetTrendingSymbols
POST http://localhost:5001/scrap/TickerAutoComplete
```


