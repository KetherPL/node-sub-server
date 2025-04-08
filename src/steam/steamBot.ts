import SteamUser from 'steam-user';
import { loggerUtils } from '../utils/loggerUtils';
import { steamBotAuth, steamChatIDs } from '../../.sub.auth';

let steamUser = new SteamUser({});

export const steamBot = {
    loginAsync: async () => {
        return new Promise<void>((resolve, reject) => {
            try {
                steamUser.logOn({
                    accountName: steamBotAuth.accountName,
                    password: steamBotAuth.password,
                    autoRelogin: true,
                });
                steamUser.on('loggedOn', () => {
                    loggerUtils.logRequests({ originalUrl: 'SteamBot' } as any, {} as any, () => {});
                    resolve();
                });
                steamUser.on('error', (error) => {
                    loggerUtils.logError(`SteamBot login error: ${error}`);
                    reject(error);
                });
            } catch (error) {
                loggerUtils.logError(`Couldn't login to steambot: ${error}`);
                reject(error);
            }
        });
    },
    sendMessageAsync: async (message: string) => {
        return new Promise<void>((resolve, reject) => {
            try {
                steamUser.chat.sendChatMessage(
                    steamChatIDs.GROUP_CHAT_ID,
                    steamChatIDs.DEFAULT_CHANNEL_ID,
                    message
                );
                resolve();
            } catch (error) {
                loggerUtils.logError(`Couldn't send message to steam chat: ${error}`);
                reject(error);
            }
        });
    },
};
