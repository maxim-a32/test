//console.log("Hello world!");
const { Client } = require("pg");
const client = new Client({
	host: process.env.DB_HOST || "db",
	user: process.env.DB_USER || "postgres",
	password: process.env.DB_PASSWORD || "my_secure_password_123",
	database: process.env.DB_NAME || "mydatabase",
	port: process.env.DB_PORT || 5432,
});
console.log("Спроба підключення до контейнера Postgres")
client.connect()

	.then(() => {
		console.log("Підключення успішне")
		return client.query("SELECT NOW() as current_time");
	})
	.then((res) => {
		console.log("Поточний час на сервері БД:", res.rows[0].current_time);
	})
	.catch((error) => {
		console.error("Помилка підключення до БД:", error.message);
	})
	.finally(() => {
		client.end()
			.then(() => console.log("З'єднання закрите, роботу завершено."))
			.catch((err) => console.error("Помилка при заритті з'єднання:", err.message));
	})
