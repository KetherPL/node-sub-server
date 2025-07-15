import { Router, Request, Response } from 'express';
import { loggerUtils } from '../utils/loggerUtils';
import { steamBot } from '../steam/steamBot';
import { callForSubsLiveserverFetcher } from './liveserver/callForSubsLiveserverFetcher';


const callForSubRouter = Router();

callForSubRouter.post('/api/callForSub', async (req: Request, res: Response) => {
    loggerUtils.logRequests(req, res, () => {});
    
    try {
        // The request body should be a JSON object like: { "steamID": "..." }
        const { steamID } = req.body;

        // Validate that steamID exists and is a non-empty string.
        if (typeof steamID !== 'string' || steamID.length === 0) {
            loggerUtils.logError(`Request body must be a JSON object with a 'steamID' property. Received: ${JSON.stringify(req.body)}`);
            res.status(400).send("Request body must be a JSON object with a 'steamID' property.");
            return;
        }

            const accid = callForSubsLiveserverFetcher.extractAccId(steamID);
            if (!accid) {
                loggerUtils.logError(`Invalid SteamID64 format: ${steamID}`);
                res.status(400).send('Invalid SteamID64 format.');
                return;
            }

            const callerName = await callForSubsLiveserverFetcher.fetchCallerNameAsync(steamID);
            if (!callerName) {
                loggerUtils.logError(`Could not fetch caller name for SteamID: ${steamID}`);
                res.status(400).send('Could not resolve SteamID to a user name.');
                return;
            }

            res.status(200).send('OK');
            await steamBot.sendMessageAsync(`[mention=${accid}]@${callerName}[/mention] called for a sub, [mention=here]@online[/mention]`);
        } catch (error) {
            // This will catch other unexpected errors during processing.
            loggerUtils.logError(`Error processing call for sub: ${error}`);
            if (!res.headersSent) {
                res.status(500).send('An internal server error occurred.');
            }
        }
});

export { callForSubRouter };
