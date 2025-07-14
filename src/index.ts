import express, { RequestHandler } from 'express';
import { loggerUtils } from './utils/loggerUtils';
import { constUtils } from './utils/constUtils';
import { steamBot } from './steam/steamBot';
import { callForSubRouter } from './api/callForSubREST';

const app = express();

const FETCH_INTERVAL_MS = 5000;

async function startSteamBot() {
    try {
        await steamBot.loginAsync();
    } catch (error) {
        loggerUtils.logError(`Couldn't login to steam bot account: ${error}`);
    }
}

startSteamBot();

app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.text() as RequestHandler);
app.use(loggerUtils.logRequests);
app.use(callForSubRouter);

app.listen(constUtils.SERVER_PORT, () => {
    console.log(`Server listening at port ${constUtils.SERVER_PORT}`);
});
console.log("Server is ready!");