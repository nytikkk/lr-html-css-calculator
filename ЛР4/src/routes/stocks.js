const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');

// Таблица маршрутов: «какой метод + какой адрес → какая функция».
// Все адреса здесь относительные: в index.js этот роутер подключён
// к пути /stocks, поэтому '/' на самом деле значит '/stocks',
// а '/:id' — '/stocks/1', '/stocks/2' и т.д.
router.get('/', stocksController.getAllStocks);
router.get('/:id', stocksController.getStockById);
router.post('/', stocksController.createStock);
router.patch('/:id', stocksController.updateStock);
router.delete('/:id', stocksController.deleteStock);

module.exports = router;
