import { Model, DataTypes } from "sequelize";
import getSequelize from "../config/sequelize.js";
import Session from "./sessions.js";

class Stopwatch extends Model {}

Stopwatch.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        timestamps: true,
        updatedAt: false,
        tableName: "stopwatches",
        sequelize: getSequelize(),
    },
);

Stopwatch.hasMany(Session, {
    as: "sessions",
    foreignKey: "stopwatchId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Session.belongsTo(Stopwatch, {
    as: "stopwatch",
    foreignKey: "stopwatchId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

export default Stopwatch;
