import * as Sequelize from "sequelize";

const createConnection: () => Sequelize = function() {
    return new Sequelize(process.env.JAWSDB_URL, {
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: false
    });
};

const instance:Sequelize = createConnection();

export function getInstance():Sequelize {
    return instance;
};