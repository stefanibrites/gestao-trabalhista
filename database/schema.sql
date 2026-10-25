
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS empresas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    razao_social TEXT NOT NULL,
    cnpj TEXT,
    telefone TEXT
);

CREATE TABLE IF NOT EXISTS funcionarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT,
    cargo TEXT,
    salario REAL,
    empresa_id INTEGER NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

CREATE TABLE IF NOT EXISTS obrigacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    vencimento TEXT,
    status TEXT NOT NULL DEFAULT 'Pendente',
    empresa_id INTEGER NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);
