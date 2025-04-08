import { Response } from 'express';
import { HttpStatusCode } from 'axios';
import { loggerUtils } from './loggerUtils';

export const databaseUtils = {
    wrapDatabaseTaskRequest: (task: Promise<any>, res: Response) => {
        task.then((dbResponse) => {
            res.send(dbResponse);
        }).catch((error) => {
            loggerUtils.logError(`Database task failed: ${error}`);
            res.status(HttpStatusCode.InternalServerError).send({ error: error.message }).end();
        });
    },
};
