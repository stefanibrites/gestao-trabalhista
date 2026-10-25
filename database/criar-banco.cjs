
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const caminhoBanco = path.join(__dirname, 'gestao-trabalhista.db');
const caminhoSchema = path.join(__dirname, 'schema.sql');

const db = new Database(caminhoBanco);

db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(caminhoSchema, 'utf8');
db.exec(schema);

const tabelas = db.prepare(`
  SELECT name
  FROM sqlite_master
  WHERE type = 'table'
    AND name NOT LIKE 'sqlite_%'
  ORDER BY name
`).all();

console.log('Tabelas criadas:');
console.table(tabelas);

db.close();
