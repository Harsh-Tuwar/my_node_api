import * as express from 'express';
import * as Home from '../controller/Home';
import * as ShortURL from '../controller/ShortURL';
import * as ContactForm from '../controller/ContactForm';
import * as YahooScrapper from '../controller/YahooScrapper';
import * as StartupIdea from '../controller/StartupIdea';
import * as Quotes from '../controller/Quotes';
import * as Joke from '../controller/Joke';
import * as SmartBhangar from '../controller/SmartBhangar';

export const InitRoutes = (app: express.Express) => {
	app.get('/', Home.Init);

	app.post('/shortener', ShortURL.GenerateShortURL);
	app.get('/shortener/:shortUrl', ShortURL.GetShortURL);

	app.post('/send', ContactForm.Send);

	app.post('/inquiry', SmartBhangar.Inquiry);
	app.post('/submit-order', SmartBhangar.SubmitOrder);

	app.post('/scrap/GetData_ByTicker', YahooScrapper.GetData_ByTicker);
	app.post('/scrap/GetRecomendationsByTicker', YahooScrapper.GetRecomendationsByTicker);
	app.post('/scrap/GetTrendingSymbols', YahooScrapper.GetTrendingSymbols);
	app.post('/scrap/TickerAutoComplete', YahooScrapper.TickerAutoComplete);

	app.get('/ideas', StartupIdea.GetIdea);
	
	app.get('/jokes', Joke.GetAJoke);

	app.get('/quotes', Quotes.GetQuote);
}