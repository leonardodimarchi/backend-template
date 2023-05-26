import { DataSource } from "typeorm";
import { dataSourceOptions } from "./datasource-options";

export default new DataSource(dataSourceOptions);