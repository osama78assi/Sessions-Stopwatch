import { Model, DataTypes } from "sequelize";
import getSequelize from "../config/sequelize.js";

class Session extends Model {}

Session.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        duration: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        stopwatchId: {
            type: DataTypes.BIGINT,
            references: {
                model: "stopwatches",
                key: "id",
            },
            allowNull: false,
        },
        longestSet: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        stopCounts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        // The real time when the session get finished
        finishedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        // CreatedAt is the date of first start time of the session (when you hit lap, or start for the first time)
    },
    {
        timestamps: true,
        updatedAt: false,
        tableName: "sessions",
        sequelize: getSequelize(),
    },
);

export default Session;
