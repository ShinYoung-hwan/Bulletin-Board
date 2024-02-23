import mysql from "mysql2/promise";

export const dbConnection = await mysql.createConnection({
    host: "localhost",
    user: "test",
    password: "test1234",
    database: "boardDB",
});

export async function checkDatabase() {
    const [ rows, _ ] = await dbConnection.query("SELECT * FROM posts");
    console.log("데이터베이스 정상 연결 완료");
}

const dbConfig = {
    checkDatabase,
}

export default dbConfig;