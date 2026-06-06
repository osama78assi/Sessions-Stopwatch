import { copyFile, copyFileSync, fstat, renameSync, rmSync } from "fs";
import ApplicationError from "../util/applicationError.js";
import fs from "fs";
import getSequelize, {
    connectDB,
    reconnectDatabase,
} from "../config/sequelize.js";
import path, { basename, dirname, join } from "path";
import { getDatabasePath } from "../config/main.js";
import { v4 } from "uuid";

class SettingsServices {
    async backup(destination) {
        try {

            await getSequelize().query(`VACUUM INTO '${destination}'`);

            // we waited the SQL to finish run not the file to get written
            while (!fs.existsSync(destination)) {
                await new Promise((res) => setTimeout(res, 100));
            }

            return true;
        } catch (err) {
            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }

            throw err;
        }
    }

    async restoreBackup(backupPath) {
        try {
            // Close the connection
            await getSequelize().close();

            // Save the copy in a different file name
            const newDbNamePath = join(
                dirname(getDatabasePath()),
                `${v4()}.db`,
            );

            // Copy the file to the database location and change the name of it
            copyFileSync(backupPath, newDbNamePath);

            // Delete the old database name
            rmSync(getDatabasePath());

            // Rename to the default dataabase name
            renameSync(
                newDbNamePath,
                join(dirname(getDatabasePath()), basename(getDatabasePath())),
            );

            // Connect to the new database
            await reconnectDatabase();

            // Successful operation
            return true;
        } catch (err) {
            if (!(err instanceof ApplicationError)) {
                console.log(err);
            }
            throw err;
        }
    }
}

export default new SettingsServices();
