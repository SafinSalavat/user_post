# Сервис статей

## Требования

- Node.js 22+
- Docker + docker-compose (опционально)
- PostgreSQL
- Redis

## Запуск через Docker

1. Скопируйте `example.env` в `.env` и заполните нужные значения

```bash
cp example.env .env
```

2. Запустите БД и Redis

```bash
docker-compose up -d
```

3. Установите зависимости и выполните миграции

```bash
npm install
npm run migration:run
```

4. Запустите проект

```
npm run start:dev
```

## Запуск без Docker (локально)

1. Убедитесь, что PostgreSQL и Redis запущены локально с параметрами из .env
2. Выполните команду и заполните .env

```bash
cp example.env .env
```

3. Выполните команды:

```bash
npm install
npm run migration:run
npm run start:dev
```

## Основные скрипты

- `npm run test` - запуск тестов
- `npm run migration:run` – запуск миграций
- `npm run migration:generate` – создать новую миграцию
- `npm run migration:revert` – откат последней миграции
- `npm run build` – сборка продакшена
- `npm run start:prod` – запуск собранного проекта
