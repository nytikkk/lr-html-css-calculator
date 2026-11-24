const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();

const PORT = process.env.PORT || 3000;

// Определяем путь к файлу данных и сообщаем его сервису
const DATA_FILE_PATH = path.join(__dirname, 'data/stocks.json');
stocksService.init(DATA_FILE_PATH);

// ---------------------------------------------------------------
// Middleware — функции, через которые по очереди проходит КАЖДЫЙ
// запрос. Порядок подключения важен!
// ---------------------------------------------------------------

// Доп. задание, часть 1 — helmet: добавляет в ответы защитные
// HTTP-заголовки (например, X-Content-Type-Options) и убирает
// заголовок X-Powered-By, который выдаёт, что сервер на Express.
app.use(helmet());

// Доп. задание, часть 2 — CORS: разрешает браузерным страницам с
// ДРУГОГО адреса (наша галерея из ЛР3 открывается через Live Server
// на порту 5500) обращаться к этому API на порту 3000. Без этого
// браузер заблокировал бы такие запросы. Разрешены только
// перечисленные адреса и методы.
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// 1. Встроенный middleware для чтения JSON из тела запроса
app.use(express.json());

// 2. Логирующий middleware: пишет в консоль время, метод и адрес запроса
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Обязательно вызываем next(), иначе запрос зависнет
});

// 3. Подключение маршрутов: всё, что начинается с /stocks,
//    передаётся роутеру из routes/stocks.js
app.use('/stocks', stocksRouter);

// 4. Глобальная обработка 404 — сюда попадает всё, что не совпало
//    ни с одним маршрутом выше
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// 5. Обработчик ошибок — всегда последним. Отличается от обычных
//    middleware тем, что у него ЧЕТЫРЕ аргумента (err, req, res, next).
app.use((err, req, res, next) => {
    // Если клиент прислал сломанный JSON — это его ошибка (400),
    // а не наша (500)
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
    }

    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// 6. Запуск сервера. Если порт уже занят (например, сервер уже
//    запущен в другом окне терминала), выводим понятное сообщение.
app.listen(PORT, (err) => {
    if (err) {
        console.error(`Не удалось запустить сервер на порту ${PORT}:`, err.message);
        process.exit(1);
    }
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
