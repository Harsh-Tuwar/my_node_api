import * as express from 'express';
import * as Home from '../controller/Home';
import * as Joke from '../controller/Joke';
import * as Book from '../controller/Books';
import * as StartupIdea from '../controller/StartupIdea';
import * as ContactForm from '../controller/ContactForm';

export const InitRoutes = (app: express.Express) => {
	app.get('/', Home.Init);

	app.post('/send', ContactForm.Send);
	
	app.post('/dpatel/send', ContactForm.SendToDavisPatel);

	app.get('/idea', StartupIdea.GetIdea);
	
	app.get('/jokes', Joke.GetAJoke);

	app.get('/book/:bookId', Book.GetBookById);
}
