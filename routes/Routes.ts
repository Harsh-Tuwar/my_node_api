import * as Home from '../controller/Home';
import * as ShortURL from '../controller/ShortURL';
import * as ContactForm from '../controller/ContactForm';
import * as ExpenseTracker from '../controller/ExpenseTracker';
import * as YahooScrapper from '../controller/YahooScrapper';
import * as MyDivi from '../controller/MyDivi';

export const InitRoutes = (app: any) => {
	app.get('/', Home.Init);

	app.post('/short', ShortURL.GenerateShortURL);
	app.get('/:shortUrl', ShortURL.GetShortURL);

	app.post('/send', ContactForm.Send);

	app.post('/tracker/signup', ExpenseTracker.CreateUser);
	app.post('/tracker/signin', ExpenseTracker.SignIn);

	app.post('/api/SavePortfolio', MyDivi.SavePortfolio);

	app.post('/scrap/GetData_ByTicker', YahooScrapper.GetData_ByTicker);
}