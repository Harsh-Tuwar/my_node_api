import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { config } from './config';
import { InitRoutes } from './routes/Routes';

const app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(bodyParser.json());

app.use(cors());

if (config.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

InitRoutes(app);

const PORT = config.PORT || 5001;

app.listen(PORT, () => console.log(`We're live in ${config.NODE_ENV} mode on port ${PORT}`));