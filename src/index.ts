import express, { RequestHandler } from 'express';
import { loggerUtils } from './utils/loggerUtils';
import { constUtils } from './utils/constUtils';
import { steamBot } from './steam/steamBot';
import { callForSubRouter } from './api/callForSubREST';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Graceful shutdown or logging
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Handle or exit
});

const app = express();

async function startSteamBot() {
    try {
        await steamBot.loginAsync();
    } catch (error) {
        loggerUtils.logError(`Couldn't login to steam bot account: ${error}`);
    }
}
startSteamBot();

app.use(express.urlencoded({ extended: true }) as RequestHandler);
app.use(express.json() as RequestHandler);
app.use(loggerUtils.logRequests);
app.use(callForSubRouter);

// Centralized error-handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    loggerUtils.logError(`Unhandled error: ${err?.message || err}`);
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(constUtils.SERVER_PORT, () => {
    console.log(`Server listening at port ${constUtils.SERVER_PORT}`);
});
console.log("Server is ready!");
