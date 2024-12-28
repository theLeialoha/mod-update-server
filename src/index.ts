// index.ts
import express, { Request, Response } from 'express';
import modsRoute from './routes/mods';
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript Express!');
});

app.use('/mods', modsRoute);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});