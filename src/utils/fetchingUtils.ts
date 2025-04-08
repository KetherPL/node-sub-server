import axios from 'axios';
import { loggerUtils } from './loggerUtils';

export const fetchingUtils = {
    fetchWrapHandleErrors: async (
        request: string,
        options: {
            method: 'post' | 'get' | 'update';
            headers?: any;
            body?: URLSearchParams;
        }
    ) => {
        try {
            const response = await axios.request({
                url: request,
                method: options.method,
                data: options.body,
                headers: options.headers,
            });
            return response?.data || null;
        } catch (error) {
            loggerUtils.logError(
                `Failed fetching: ${JSON.stringify(request)} with options ${JSON.stringify(options)}`
            );
            loggerUtils.logError(`Error: ${JSON.stringify(error)}`);
            return null;
        }
    },
};
