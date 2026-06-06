import { Sequelize } from "sequelize";
import { getDatabasePath } from "./main.js";
import { app } from "electron";

let sequelize = new Sequelize({
    dialect: "sqlite",
    storage: getDatabasePath(),
});

// This function will save us from the cached module when restoring the database
export default function getSequelize() {
    return sequelize;
}

export async function connectDB(params) {
    try {
        const isDev = !app.isPackaged;
        await sequelize.authenticate({ logging: false });

        if (isDev) {
            await sequelize.sync({ force: true });
        }

        /*
        Remember: SQLite is file based I/O database so any request will open the file, it uses internal some optimization one of them is page caching
        and to use it wrap many queries in the same transaction

        same for update if you did that it will do all the update in the memory then it will write them in the desk
        */

        console.log("connected to database successfully");
    } catch (err) {
        console.log(err);
    }
}

export async function reconnectDatabase() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: getDatabasePath(),
    });

    await connectDB();
}