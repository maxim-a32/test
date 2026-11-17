const http = require("http");
const { Client } = require("pg");

const PORT = process.env.PORT || 3000;

async function checkDatabase() {
	const client = new Client({
		host: process.env.DB_HOST || "db",
		user: process.env.DB_USER || "postgres",
		password: process.env.DB_PASSWORD || "my_secure_password_123",
		database: process.env.DB_NAME || "mydatabase",
		port: process.env.DB_PORT || 5432,
		ssl: process.env.DB_HOST && process.env.DB_HOST !== "db" 
			? { rejectUnauthorized: false } 
			: false,
	});

	try {
		await client.connect();
		const res = await client.query("SELECT NOW() as current_time");
		const time = res.rows[0].current_time;
		console.log("Підключення успішне. Час БД:", time);
		return `Підключення до БД успішне! Поточний час сервера БД: ${time}`;
	} catch (error) {
		console.error("Помилка підключення до БД:", error.message);
		return `Помилка підключення до БД: ${error.message}`;
	} finally {
		await client.end();
	}
}

const server = http.createServer(async (req, res) => {
	const dbMessage = await checkDatabase();
	res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
	res.end(`Сервер працює!\n${dbMessage}`);
});

server.listen(PORT, "0.0.0.0", () => {
	console.log(`Сервер запущено на порту ${PORT}`);
});