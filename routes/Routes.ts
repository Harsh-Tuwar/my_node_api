import * as Home from '../controller/Home';
import * as ShortURL from '../controller/ShortURL';
import * as ContactForm from '../controller/ContactForm';
import * as YahooScrapper from '../controller/YahooScrapper';

export const InitRoutes = (app: any) => {
	app.get('/', Home.Init);

	app.post('/short', ShortURL.GenerateShortURL);
	app.get('/:shortUrl', ShortURL.GetShortURL);

	app.post('/send', ContactForm.Send);

	app.post('/scrap/GetData_ByTicker', YahooScrapper.GetData_ByTicker);
}