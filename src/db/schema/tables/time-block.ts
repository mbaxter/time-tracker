import * as Sequelize from "sequelize";

interface ITimeBlockInstance {
    id: number,
    start: Date,
    end: Date
}

const timeBlockDefinition = {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    start: {
        type: Sequelize.DATE,
        field: 'start',
        allowNull: false
    },
    end: {
        type: Sequelize.DATE,
        field: 'end',
        allowNull: false
    }
};

export const name = "time_block";
export {timeBlockDefinition as definition};
export {ITimeBlockInstance as IInstance};