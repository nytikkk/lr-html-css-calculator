const fs = require('fs');

// Сервис работы с файлом: единственное место в проекте, которое
// напрямую обращается к файловой системе. Остальной код (сервисы,
// контроллеры) про файлы ничего не знает — они вызывают только эти
// две функции. Если потом захочется заменить файл на базу данных,
// менять придётся только этот слой.

// readData(filePath) — читает JSON-файл и возвращает его содержимое
// как JavaScript-массив. Если файл не прочитался — пишет ошибку в
// консоль и возвращает пустой массив, чтобы сервер не падал.
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
};

// writeData(filePath, data) — превращает массив обратно в JSON-текст
// и записывает в файл (с отступами в 2 пробела, чтобы файл был читаемым).
const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

module.exports = {
    readData,
    writeData
};
