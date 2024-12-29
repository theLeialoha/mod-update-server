// index.ts
import express, { Request, Response } from 'express';

import apiKeyRoute from './routes/apiKeyController';
import backupRoute from './routes/backupController';
import forgeRoute from './routes/forgeController';
import modRoute from './routes/modController';
import updateCheckRoute from './routes/updateCheckController';
import updateRoute from './routes/updateController';

const app = express();

const PORT = process.env.port || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript Express!');
});

app.use(forgeRoute);
app.use('/apikeys', apiKeyRoute);
app.use('/backup', backupRoute);
app.use('/mods', modRoute);
app.use('/check', updateCheckRoute);
app.use('/updates', updateRoute);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


