import * as express from 'express';
import * as Home from '../controller/Home';
import * as Joke from '../controller/Joke';
import * as Book from '../controller/Books';
import * as StartupIdea from '../controller/StartupIdea';
import * as ContactForm from '../controller/ContactForm';
import * as CiviLens from '../controller/CiviLens';
import * as Startups from '../controller/Startups';
import * as TuwarCorp from '../controller/TuwarCorp';

export const InitRoutes = (app: express.Express) => {
	app.get('/', Home.Init);

	app.post('/send', ContactForm.Send);
	
	app.post('/dpatel/send', ContactForm.SendToDavisPatel);

	app.get('/idea', StartupIdea.GetIdea);
	
	app.get('/jokes', Joke.GetAJoke);

	app.get('/book/:bookId', Book.GetBookById);

	app.post('/civilens/waitlist', CiviLens.Send)

	app.post('/:appName/waitlist', Startups.Send);

	app.post('/inquiry', TuwarCorp.Inquiry);
}
