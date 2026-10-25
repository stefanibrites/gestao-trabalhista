
const Database = require('better-sqlite3');
const path = require('path');

const caminhoBanco = path.join(__dirname, 'gestao-trabalhista.db');
const db = new Database(caminhoBanco);

db.pragma('foreign_keys = ON');

db.prepare(`
  INSERT INTO empresas (razao_social, cnpj, telefone)
  VALUES (?, ?, ?)
`).run('Empresa Exemplo LTDA', '00000000000000', '(67) 99999-0000');

const empresa = db.prepare(`
  SELECT id FROM empresas
  WHERE razao_social = ?
`).get('Empresa Exemplo LTDA');

db.prepare(`
  INSERT INTO funcionarios
  (nome, cpf, cargo, salario, empresa_id)
  VALUES (?, ?, ?, ?, ?)
`).run('Funcionário de Teste', '00000000000', 'Assistente Administrativo', 2500, empresa.id);

db.prepare(`
  INSERT INTO obrigacoes
  (descricao, vencimento, status, empresa_id)
  VALUES (?, ?, ?, ?)
`).run('Conferir obrigação trabalhista', '2026-11-30', 'Pendente', empresa.id);

const resultado = db.prepare(`
  SELECT
    empresas.razao_social,
    funcionarios.nome AS funcionario,
    funcionarios.cargo,
    obrigacoes.descricao AS obrigacao,
    obrigacoes.status
  FROM empresas
  JOIN funcionarios ON funcionarios.empresa_id = empresas.id
  JOIN obrigacoes ON obrigacoes.empresa_id = empresas.id
  WHERE empresas.id = ?
`).all(empresa.id);

console.log('Dados consultados no banco:');
console.table(resultado);

db.close();
