import * as e from 'express';
import path from 'path';


export const Init = (req: e.Request, res: e.Response) => {
	return res.sendFile(path.join(__dirname, 'public', 'index.html'));
};