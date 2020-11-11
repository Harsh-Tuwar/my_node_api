import * as Home from '../controller/Home';
import * as ShortURL from '../controller/ShortURL';

export const InitRoutes = (app: any) => {
	app.get('/', Home.Init);

	app.post('/api/v1/short', ShortURL.GenerateShortURL);
	app.get('/api/v1/:shortUrl', ShortURL.GetShortURL);
}