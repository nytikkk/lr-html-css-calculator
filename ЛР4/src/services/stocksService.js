const fileService = require('./fileService');

// Сервис карточек: здесь вся «умная» работа с данными — поиск,
// создание, изменение, удаление. Сам он ничего не знает ни про
// HTTP-запросы, ни про файловую систему: данные берёт у fileService,
// а результат просто возвращает контроллеру.

// Путь к файлу с данными. Задаётся один раз при запуске сервера (init).
let dataFilePath;

// init(filePath) — запоминает, где лежит файл с карточками.
const init = (filePath) => {
    dataFilePath = filePath;
};

// findAll(title) — возвращает все карточки. Если передан title,
// оставляет только те, в названии которых он встречается
// (регистр букв не важен: «горный» найдёт «Горный рассвет»).
const findAll = (title) => {
    const stocks = fileService.readData(dataFilePath);
    if (title) {
        return stocks.filter(stock =>
            stock.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return stocks;
};

// findOne(id) — возвращает одну карточку по её id (или undefined,
// если такой нет).
const findOne = (id) => {
    const stocks = fileService.readData(dataFilePath);
    return stocks.find(stock => stock.id === id);
};

// create(stockData) — добавляет новую карточку. Новый id считается
// как «самый большой существующий + 1», затем массив записывается
// обратно в файл.
const create = (stockData) => {
    const stocks = fileService.readData(dataFilePath);

    // Генерация ID: берём максимальный ID + 1
    const newId = stocks.length > 0
        ? Math.max(...stocks.map(s => s.id)) + 1
        : 1;

    const newStock = { id: newId, ...stockData };
    stocks.push(newStock);
    fileService.writeData(dataFilePath, stocks);

    return newStock;
};

// update(id, stockData) — меняет только те поля, которые пришли в
// stockData, остальные оставляет как были. Если карточки с таким id
// нет — возвращает null. Поле id менять нельзя: оно выбрасывается
// из присланных данных, иначе можно было бы испортить нумерацию.
const update = (id, stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const index = stocks.findIndex(s => s.id === id);

    if (index === -1) return null;

    const { id: ignoredId, ...changes } = stockData || {};

    stocks[index] = { ...stocks[index], ...changes };
    fileService.writeData(dataFilePath, stocks);

    return stocks[index];
};

// remove(id) — удаляет карточку по id. Возвращает true, если
// что-то удалили, и false, если такой карточки не было.
const remove = (id) => {
    const stocks = fileService.readData(dataFilePath);
    const filteredStocks = stocks.filter(s => s.id !== id);

    if (filteredStocks.length === stocks.length) {
        return false; // Ничего не удалили
    }

    fileService.writeData(dataFilePath, filteredStocks);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
