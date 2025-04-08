import express, { RequestHandler } from 'express';
import { loggerUtils } from './utils/loggerUtils';
import { constUtils } from './utils/constUtils';
import { steamBot } from './steam/steamBot';
import { callForSubsLiveserverFetcher } from './api/liveserver/callForSubsLiveserverFetcher';

const app = express();

const FETCH_INTERVAL_MS = 5000;

async function startSteamBot() {
    try {
        await steamBot.loginAsync();
    } catch (error) {
        loggerUtils.logError(`Couldn't login to steam bot account: ${error}`);
    }
}

async function fetchAndProcessCallsForSubsAsync() {
    try {
        await callForSubsLiveserverFetcher.fetchProcessAndPostOnChatGroupAsync();
    } catch (error) {
        loggerUtils.logError(`Error in fetchAndProcessCallsForSubsAsync: ${error}`);
    }
}

startSteamBot();

app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.json() as RequestHandler);
app.use(loggerUtils.logRequests);

setInterval(fetchAndProcessCallsForSubsAsync, FETCH_INTERVAL_MS);

// app.listen(constUtils.SERVER_PORT, () => {
//     console.log(`Server listening at port ${constUtils.SERVER_PORT}`);
// });
console.log("Server is ready!");