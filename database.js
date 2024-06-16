import sqlite3 from "sqlite3";

const filepath = "./movies.db";

function createDbConnection() {
  const db = new sqlite3.Database(filepath, (error) => {
    if (error) {
      return console.error(error.message);
    }
  });
  console.log("Connection with SQLite has been established");
  return db;
}

const db = createDbConnection();
export default db;
