import * as Connection from "../connection";
import * as tables from "./tables";
import * as Sequelize from "sequelize";

const connection = Connection.getInstance();

class Schema {
    private _createTables() {
        const generatedTables = {};
        for (let table of tables) {
            let name = table.name;
            generatedTables[name] = Sequelize.define<any>(name, table.definition);
            generatedTables[name] = connection.define<, any>(name, table);
        }
    }
}

export default Schema;