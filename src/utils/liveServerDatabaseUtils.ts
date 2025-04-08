import mysql, { Connection, queryCallback } from 'mysql';
import { loggerUtils } from './loggerUtils';
import {dbAuth} from '../../.sub.auth';


export var liveServerDatabaseUtils = {
    performQueryAsync: async (query: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            performLiveQuery(query, (err, results, fields) => {
                if (err) {
                    loggerUtils.logError(`Database query error: ${err}`);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },
};

let mysqlConnection: Connection;

const getOrCreateConnection = async (): Promise<Connection> => {
    if (mysqlConnection && mysqlConnection.state !== 'disconnected') {
        return mysqlConnection;
    }

    return new Promise((resolve, reject) => {
        mysqlConnection = mysql.createConnection({
            host: dbAuth.host,
            port: dbAuth.port,
            user: dbAuth.user,
            password: dbAuth.password,
            database: dbAuth.database,
            connectTimeout: 10 * 1000,
            timeout: 3 * 1000,
        });
        mysqlConnection.connect((err) => {
            if (err) {
                loggerUtils.logError(`Database connection error: ${err}`);
                reject(err);
            } else {
                resolve(mysqlConnection);
            }
        });
        mysqlConnection.on('error', (err) => {
            loggerUtils.logError(`Database connection error: ${err}`);
        });
    });
};

const getConnection = async (tryCount: number = 3): Promise<Connection> => {
    let tries = 0;
    while (tries < tryCount) {
        try {
            const connection = await getOrCreateConnection();
            return connection;
        } catch (error) {
            loggerUtils.logError(`Database connection attempt #${tries + 1} failed: ${error}`);
            tries++;
            if (tries < tryCount) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }
    throw new Error(`Could not establish db connection after #${tryCount} tries`);
};

// const getConnection = (tryCount: number = 3) => {
//     let connection = dbConnection();
//     let tries = 1;
//     while (tries <= tryCount && tries > 0 && tryCount > tries) {
//         if (!connection || connection.state === 'disconnected') {
//             connection = dbConnection();
//             tries++;
//         } else {
//             return connection;
//         }
//     }
//     throw new Error(`Could not establish db connection after #${tries} tries`);
// };

const performLiveQuery = async (query: string, callback?: queryCallback) => {
    try {
    const connection = await getConnection();
    if (!connection) {
        return;
    }

    connection.query(query, (err, results, fields) => {
        if (err) {
            callback && callback(err, undefined, undefined);
        } else {
            callback && callback(null, results, fields);
        }
    });
} catch (error) {
    loggerUtils.logError(`Error performing database query: ${error}`);
}
};
