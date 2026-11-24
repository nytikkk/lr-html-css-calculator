const stocksService = require('../services/stocksService');

// Контроллер — «посредник» между пользователем и сервисом.
// Он достаёт из запроса нужные данные (id из адреса, поля из тела),
// просит сервис что-то сделать и сам решает, какой HTTP-статус
// вернуть: 200 — всё хорошо, 201 — создано, 204 — удалено,
// 400 — прислали плохие данные, 404 — ничего не найдено.

// GET /stocks (или /stocks?title=...) — список всех карточек
const getAllStocks = (req, res) => {
    const { title } = req.query;
    const stocks = stocksService.findAll(title);
    res.json(stocks);
};

// GET /stocks/:id — одна карточка по id из адреса
const getStockById = (req, res) => {
    const id = parseInt(req.params.id);
    const stock = stocksService.findOne(id);

    if (!stock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(stock);
};

// POST /stocks — создание новой карточки из тела запроса
const createStock = (req, res) => {
    // "|| {}" — защита на случай, если тело запроса пришло пустым
    const { src, title, text } = req.body || {};

    // Простая валидация: все три поля обязательны
    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};

// PATCH /stocks/:id — частичное обновление карточки
const updateStock = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedStock = stocksService.update(id, req.body);

    if (!updatedStock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.json(updatedStock);
};

// DELETE /stocks/:id — удаление карточки
const deleteStock = (req, res) => {
    const id = parseInt(req.params.id);
    const success = stocksService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }

    res.status(204).send(); // 204 No Content — успех, но тела ответа нет
};

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock
};
