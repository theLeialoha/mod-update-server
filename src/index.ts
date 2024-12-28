// index.ts
import express, { Request, Response } from 'express';
import modsRoute from './routes/mods';
const app = express();

const PORT = process.env.port || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript Express!');
});

app.use('/mods', modsRoute);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


// The Forge update check format.
// (GET) /forge/MOD_ID

// A general purpose update check format.
// (GET) /check/LOADER/MOD_ID

// A list of all API keys.
// (GET) /apikeys

// Adds a new API keys. See [ApiKey](#apikey).
// (POST) /apikeys/add

// Removes an API keys.
// (DELETE) /apikeys/APIKEY

