import axios from 'axios';
// import { steamBot } from '../../steam/steamBot';
import SteamID from 'steamid';
import { loggerUtils } from '../../utils/loggerUtils';
import { STEAM_API_KEY } from '../../../.sub.auth';

export const callForSubsLiveserverFetcher = {

    // processCallForSubAsync: async (callForSub: CallForSub) => {
    //     try {
    //         await callForSubsLiveserverFetcher.deleteCallForSubFromDatabaseAsync(callForSub.LP);

    //         const accid = callForSubsLiveserverFetcher.extractAccId(callForSub.SteamID);
    //         if (!accid) {
    //             loggerUtils.logError(`Invalid SteamID format: ${callForSub.SteamID}`);
    //             return;
    //         }

    //         const callerName = await callForSubsLiveserverFetcher.fetchCallerNameAsync(callForSub.SteamID);
    //         if (!callerName) {
    //             loggerUtils.logError(`Could not fetch caller name for SteamID: ${callForSub.SteamID}`);
    //             return;
    //         }

    //         await steamBot.sendMessageAsync(`[mention=${accid}]@${callerName}[/mention] called for a sub, [mention=here]@online[/mention]`);
    //     } catch (error) {
    //         loggerUtils.logError(`Error processing call for sub: ${error}`);
    //     }
    // },

    extractAccId: (steamId: string): string | null => {
        try {
            const sid = new SteamID(steamId);
            const steam3RenderedId = sid.getSteam3RenderedID();
            const regex = /\[(U:\d+:\d+)\]/;
            const match = steam3RenderedId.match(regex);

            if (match && match.length === 2) {
                return match[1].split(':')[2];
            }
            loggerUtils.logError(`Invalid SteamID format: ${steamId}`);
            return null;
        } catch (error) {
            loggerUtils.logError(`Error extracting Account ID from SteamID: ${error}`);
            return null;
        }
    },

    fetchCallerNameAsync: async (steamId: string): Promise<string | null> => {
        const fetchURL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`;

        try {
            const response = await axios.request({ method: 'get', url: fetchURL });

            if (response.data.response.players.length === 0) {
                loggerUtils.logError(`No players found for SteamID: ${steamId}`);
                return null;
            }

            return response.data.response.players[0].personaname;
        } catch (error) {
            loggerUtils.logError(`Error fetching player summary for SteamID ${steamId}: ${error}`);
            return null;
        }
    },
};
