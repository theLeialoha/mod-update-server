// index.ts
import express, { NextFunction, Request, Response } from 'express';

import apiKeyRoute from './routes/apiKeyController';
import backupRoute from './routes/backupController';
import forgeRoute from './routes/forgeController';
import modRoute from './routes/modController';
import updateCheckRoute from './routes/updateCheckController';
import updateRoute from './routes/updateController';
import { ResponseStatusException } from './types/errors';
import { resolve } from 'path';

const app = express();
app.use(express.json());

const PORT = process.env.port || 3000;

// app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log('%s %s', req.method.toUpperCase(), req.url);
//     next();
// });

app.get('/', (req: Request, res: Response) => {
    res.sendFile(resolve('pages/welcome.html'));
});

app.use(forgeRoute);
app.use('/apikeys', apiKeyRoute);
app.use('/backup', backupRoute);
app.use('/mods', modRoute);
app.use('/check', updateCheckRoute);
app.use('/updates', updateRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ResponseStatusException) {
        const e: ResponseStatusException = err;
        res.status(e.status).send({ statusCode: e.status, message: e.message });
        console.error({ statusCode: e.status, message: e.message });
    } else {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


