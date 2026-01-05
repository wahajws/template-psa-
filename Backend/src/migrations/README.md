# Migrations

This directory contains database migrations. 

## Generating Migrations

To generate migrations from Sequelize models, use:

```bash
npx sequelize-cli migration:generate --name migration-name
```

Or use sequelize-auto to generate from existing database:

```bash
npx sequelize-auto -o "./src/models" -d database_name -h localhost -u root -p 3306 -e mysql
```

## Running Migrations

```bash
npm run migrate
```

## Rolling Back

```bash
npm run migrate:undo
```



