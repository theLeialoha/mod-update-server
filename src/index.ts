// index.ts
import { NextFunction, Request, Response } from 'express';
import * as express from 'express';

import { HOST, PORT } from './constants';

import apiKeyRoute from './routes/apiKeyController';
import backupRoute from './routes/backupController';
import forgeRoute from './routes/forgeController';
import modRoute from './routes/modController';
import updateCheckRoute from './routes/updateCheckController';
import updateRoute from './routes/updateController';
import { ResponseStatusException } from './types/errors';
import { resolve } from 'path';
import { connectDB } from './database';

connectDB()
const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.sendFile(resolve('pages/welcome.html'));
});

app.use(forgeRoute);
app.use('/apikeys', apiKeyRoute);
app.use('/backup', backupRoute);
app.use('/mods', modRoute);
app.use('/check', updateCheckRoute);
app.use('/updates', updateRoute);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ResponseStatusException) res.status(err.status).json(err.json);
    else if (err) res.status(500).json({ status: "500", message: err.message });
    else next();
});

app.listen(PORT, HOST, () => {
    console.log(`Server started on port ${PORT}`);
});


