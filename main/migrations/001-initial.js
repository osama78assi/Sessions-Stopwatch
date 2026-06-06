export async function up(sequelize, queryInterface) {
    // STOPWATCHES
    await queryInterface.createTable("stopwatches", {
        id: {
            type: "BIGINT",
            primaryKey: true,
            autoIncrement: true,
        },
        category: {
            type: "STRING(255)",
            allowNull: false,
        },
        createdAt: {
            type: "DATETIME",
            allowNull: false,
        }
    });

    // SESSIONS
    await queryInterface.createTable("sessions", {
        id: {
            type: "BIGINT",
            primaryKey: true,
            autoIncrement: true,
        },

        duration: {
            type: "BIGINT",
            allowNull: false,
        },

        stopwatchId: {
            type: "BIGINT",
            allowNull: false,
            references: {
                model: "stopwatches",
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        longestSet: {
            type: "BIGINT",
            allowNull: false,
        },

        stopCounts: {
            type: "INTEGER",
            allowNull: false,
            defaultValue: 0,
        },

        description: {
            type: "STRING(500)",
            allowNull: true,
        },

        finishedAt: {
            type: "DATETIME",
            allowNull: false,
        },

        createdAt: {
            type: "DATETIME",
            allowNull: false,
        }
    });
}

export async function down(sequelize, queryInterface) {
    await queryInterface.dropTable("sessions");
    await queryInterface.dropTable("stopwatches");
}