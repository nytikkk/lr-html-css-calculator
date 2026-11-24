# ЛР4 — REST API на Express.js

Бэкенд для карточек-фотографий: чтение, создание, изменение и удаление
через HTTP-запросы. Данные хранятся в файле `src/data/stocks.json`.

## Запуск

```shell
npm install        # один раз: скачать зависимости
npm run dev        # запуск с автоперезапуском (nodemon)
# или
npm start          # обычный запуск
```

Сервер: http://localhost:3000 — проверка в браузере: http://localhost:3000/stocks

> В скрипте `dev` стоит `--ignore src/data/`: сервер пишет в `stocks.json`,
> и без этого nodemon перезапускал бы его после каждого POST/PATCH/DELETE.

## Эндпоинты

| Метод  | Адрес            | Что делает                                   |
| ------ | ---------------- | -------------------------------------------- |
| GET    | `/stocks`        | все карточки                                 |
| GET    | `/stocks?title=` | поиск по названию (регистр не важен)         |
| GET    | `/stocks/:id`    | одна карточка по id                          |
| POST   | `/stocks`        | создать карточку (поля `src`, `title`, `text`) |
| PATCH  | `/stocks/:id`    | изменить поля карточки                       |
| DELETE | `/stocks/:id`    | удалить карточку                             |

Коды ответов: `200` ок, `201` создано, `204` удалено, `400` не все поля /
сломанный JSON, `404` не найдено, `500` ошибка сервера.

## Примеры (curl)

```shell
curl http://localhost:3000/stocks
curl "http://localhost:3000/stocks?title=горный"
curl http://localhost:3000/stocks/1

curl -X POST http://localhost:3000/stocks \
  -H "Content-Type: application/json" \
  -d '{"src":"images/new.jpg","title":"Новое фото","text":"Описание"}'

curl -X PATCH http://localhost:3000/stocks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Горный рассвет (обновлено)"}'

curl -X DELETE http://localhost:3000/stocks/1
```

## Структура

```
src/
├── index.js                      # сборка сервера: middleware, роутеры, ошибки
├── routes/stocks.js              # адреса → функции контроллера
├── controllers/stocksController.js   # работа с req/res, HTTP-статусы
├── services/stocksService.js     # бизнес-логика карточек
├── services/fileService.js       # чтение/запись JSON-файла
└── data/stocks.json              # данные
```

## Дополнительное задание: CORS + helmet

- `helmet()` — защитные HTTP-заголовки в каждом ответе.
- `cors({...})` — разрешены запросы со страниц с адресов
  `http://127.0.0.1:5500` и `http://localhost:5500` (Live Server), методы
  GET/POST/PATCH/DELETE. Увидеть в Postman: добавить к запросу заголовок
  `Origin: http://localhost:5500` — в ответе появится
  `Access-Control-Allow-Origin`.
