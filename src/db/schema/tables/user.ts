import * as Sequelize from "sequelize";

interface IUserInstance {
    id: number,
    email_address:string,
    password: string,
    first_name: string,
    last_name: string,
    time_zone: string
}

const userDefinition = {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    email_address: {
        type: Sequelize.STRING,
        field: 'email_address',
        allowNull: false,
        unique: 'email_unique'
    },
    password: {
        type: Sequelize.STRING,
        field: 'password',
        allowNull: false
    },
    first_name: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    last_name: {
        type: Sequelize.STRING,
        field: 'last_name'
    },
    time_zone: {
        type: Sequelize.STRING,
        field: 'time_zone',
        allowNull: false,
        default: "+00:00"
    },
};

export const name = "user";
export {userDefinition as definition, IUserInstance as IInstance};

