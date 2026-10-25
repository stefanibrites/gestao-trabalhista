
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(
  path.join(__dirname, 'gestao-trabalhista.db')
);

db.pragma('foreign_keys = ON');

try {
  db.prepare(`
    INSERT INTO funcionarios
    (nome, cpf, cargo, salario, empresa_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'Teste de Relacionamento',
    '11111111111',
    'Assistente',
    2000,
    999999
  );

  console.log('Atenção: o registro foi aceito.');
} catch (erro) {
  console.log('Teste realizado: a chave estrangeira impediu o cadastro.');
  console.log('Mensagem:', erro.message);
}

db.close();
