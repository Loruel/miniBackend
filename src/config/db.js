import { createPool } from "mysql2/promise";
import { DB_USER, DB_PASSWORD, DB_PORT, DB_HOST, DB_DATABASE } from './config.js'

export const pool = createPool({
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    host: DB_HOST,
    database: DB_DATABASE
})