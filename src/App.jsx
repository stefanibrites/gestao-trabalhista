import { useState, useEffect } from 'react'

function carregarDados(chave) {
  try {
    const dados = localStorage.getItem(chave)
    return dados ? JSON.parse(dados) : []
  } catch {
    return []
  }
}
import './App.css'


function fazerBackup() {
  const backup = {
    dataBackup: new Date().toISOString(),
    empresas: carregarDados('gestao_empresas'),
    funcionarios: carregarDados('gestao_funcionarios')
  }

  const conteudo = JSON.stringify(backup, null, 2)
  const arquivo = new Blob([conteudo], {
    type: 'application/json'
  })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(arquivo)
  link.download = 'backup-gestao-trabalhista.json'
  link.click()

  URL.revokeObjectURL(link.href)
}


function restaurarBackup(event) {
  const arquivo = event.target.files[0]

  if (!arquivo) return

  const leitor = new FileReader()

  leitor.onload = () => {
    try {
      const backup = JSON.parse(leitor.result)

      if (
        !Array.isArray(backup.empresas) ||
        !Array.isArray(backup.funcionarios)
      ) {
        alert('Arquivo de backup inválido.')
        return
      }

      const confirmar = window.confirm(
        'A restauração substituirá os cadastros atuais. Deseja continuar?'
      )

      if (!confirmar) {
        event.target.value = ''
        return
      }

      localStorage.setItem(
        'gestao_empresas',
        JSON.stringify(backup.empresas)
      )

      localStorage.setItem(
        'gestao_funcionarios',
        JSON.stringify(backup.funcionarios)
      )

      alert('Backup restaurado! A página será atualizada.')

      window.location.reload()
    } catch {
      alert('Não foi possível ler o arquivo. Selecione um backup válido.')
    }

    event.target.value = ''
  }

  leitor.readAsText(arquivo)
}

function App() {
  const [tela, setTela] = useState('inicio')
  const [empresas, setEmpresas] = useState(() =>
  carregarDados('gestao_empresas')
)

const [funcionarios, setFuncionarios] = useState(() =>
  carregarDados('gestao_funcionarios')
)
const [obrigacoes, setObrigacoes] = useState(() =>
  carregarDados('gestao_obrigacoes')
)
useEffect(() => {
  localStorage.setItem('gestao_empresas', JSON.stringify(empresas))
}, [empresas])

useEffect(() => {
  localStorage.setItem('gestao_funcionarios', JSON.stringify(funcionarios))
}, [funcionarios])

useEffect(() => {
  localStorage.setItem(
    'gestao_obrigacoes',
    JSON.stringify(obrigacoes)
  )
}, [obrigacoes])

useEffect(() => {
  localStorage.setItem(
    'gestao_obrigacoes',
    JSON.stringify(obrigacoes)
  )
}, [obrigacoes])


  const [razaoSocial, setRazaoSocial] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [telefone, setTelefone] = useState('')

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [cargo, setCargo] = useState('')
  const [salario, setSalario] = useState('')
  const [empresaId, setEmpresaId] = useState('')
  
const [funcionarioFolha, setFuncionarioFolha] = useState('')
const [competencia, setCompetencia] = useState('')
const [horasExtras, setHorasExtras] = useState('0')
const [outrosProventos, setOutrosProventos] = useState('0')
const [outrosDescontos, setOutrosDescontos] = useState('0')


  function cadastrarEmpresa(event) {
    event.preventDefault()

    const novaEmpresa = {
      id: Date.now(),
      razaoSocial,
      cnpj,
      telefone
    }

    setEmpresas([...empresas, novaEmpresa])
    setRazaoSocial('')
    setCnpj('')
    setTelefone('')
    alert('Empresa cadastrada com sucesso!')
  }

  function excluirEmpresa(id) {
    const possuiFuncionarios = funcionarios.some(
      funcionario => funcionario.empresaId === id
    )

    if (possuiFuncionarios) {
      alert('Não é possível excluir uma empresa que possui funcionários cadastrados.')
      return
    }

    setEmpresas(empresas.filter(empresa => empresa.id !== id))
  }

  function cadastrarFuncionario(event) {
    event.preventDefault()

    if (!empresaId) {
      alert('Selecione uma empresa.')
      return
    }

    const novoFuncionario = {
      id: Date.now(),
      nome,
      cpf,
      cargo,
      salario: Number(salario),
      empresaId: Number(empresaId)
    }

    setFuncionarios([...funcionarios, novoFuncionario])

    setNome('')
    setCpf('')
    setCargo('')
    setSalario('')
    setEmpresaId('')

    alert('Funcionário cadastrado com sucesso!')
  }

  function excluirFuncionario(id) {
    setFuncionarios(
      funcionarios.filter(funcionario => funcionario.id !== id)
    )
  }

  function formatarSalario(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
  
const funcionarioSelecionado = funcionarios.find(
  funcionario => funcionario.id === Number(funcionarioFolha)
)

const salarioBase = funcionarioSelecionado
  ? funcionarioSelecionado.salario
  : 0

const totalProventos =
  salarioBase +
  Math.max(0, Number(horasExtras) || 0) +
  Math.max(0, Number(outrosProventos) || 0)

const totalDescontos = Math.max(
  0,
  Number(outrosDescontos) || 0
)

const salarioLiquido = totalProventos - totalDescontos


  return (
    <div className="sistema">
      <aside className="menu">
        <h2>Gestão Trabalhista</h2>
        <p>Menu principal</p>

        <nav>
          <a href="#inicio" onClick={() => setTela('inicio')}>
            🏠 Início
          </a>
          <a href="#empresas" onClick={() => setTela('empresas')}>
            🏢 Empresas
          </a>
          <a href="#funcionarios" onClick={() => setTela('funcionarios')}>
            👥 Funcionários
          </a>
          <a href="#folha" onClick={() => setTela('folha')}>
            💰 Folha de pagamento
          </a>
          <a href="#obrigacoes" onClick={() => setTela('obrigacoes')}>
            📅 Obrigações trabalhistas
          </a>
        </nav>
      </aside>

      <main className="conteudo">

        {tela === 'inicio' && (
          <>
            <h1>Painel de Gestão Trabalhista</h1>
            <p>Bem-vinda ao seu sistema de gestão!</p>

            <div className="cartoes">
              <div className="cartao">
                <h3>Empresas</h3>
                <p>{empresas.length} cadastrada(s)</p>
                <button onClick={() => setTela('empresas')}>
                  Acessar empresas
                </button>
              </div>

              <div className="cartao">
                <h3>Funcionários</h3>
                <p>{funcionarios.length} cadastrado(s)</p>
                <button onClick={() => setTela('funcionarios')}>
                  Acessar funcionários
                </button>
              </div>

              <div className="cartao">
                <h3>Folha de pagamento</h3>
                <p>Controle da folha de pagamento.</p>
              </div>

              <div className="cartao">
                <h3>Obrigações</h3>
                <p>Controle de prazos e guias.</p>
              </div>
            
            </div>

            <div className="cartoes-backup">
              <button onClick={fazerBackup}>
                Fazer backup
              </button>

              <label className="botao-restaurar">
                Restaurar backup
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={restaurarBackup}
                  hidden
                />
              </label>
            </div>
          </>
        )}


        {tela === 'empresas' && (
          <>
            <h1>Cadastro de Empresas</h1>
            <p>Cadastre e consulte as empresas atendidas.</p>

            <form className="formulario" onSubmit={cadastrarEmpresa}>
              <label>Razão social *</label>
              <input
                value={razaoSocial}
                onChange={e => setRazaoSocial(e.target.value)}
                required
                placeholder="Nome da empresa"
              />

              <label>CNPJ *</label>
              <input
                value={cnpj}
                onChange={e => setCnpj(e.target.value)}
                required
                placeholder="CNPJ da empresa"
              />

              <label>Telefone</label>
              <input
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="Telefone"
              />

              <button type="submit">Cadastrar empresa</button>
            </form>

            <h2>Empresas cadastradas</h2>

            {empresas.length === 0 ? (
              <p>Nenhuma empresa cadastrada.</p>
            ) : (
              <div className="lista-empresas">
                {empresas.map(empresa => (
                  <div className="empresa" key={empresa.id}>
                    <strong>{empresa.razaoSocial}</strong>
                    <p>CNPJ: {empresa.cnpj}</p>
                    <p>Telefone: {empresa.telefone || 'Não informado'}</p>
                    <button
                      className="botao-excluir"
                      onClick={() => excluirEmpresa(empresa.id)}
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="botao-secundario"
              onClick={() => setTela('inicio')}
            >
              Voltar ao início
            </button>
          </>
        )}

        {tela === 'funcionarios' && (
          <>
            <h1>Cadastro de Funcionários</h1>
            <p>Cadastre os funcionários e vincule cada um à sua empresa.</p>

            {empresas.length === 0 ? (
              <div className="aviso">
                <p>Você precisa cadastrar uma empresa primeiro.</p>
                <button onClick={() => setTela('empresas')}>
                  Cadastrar empresa
                </button>
              </div>
            ) : (
              <form
                className="formulario"
                onSubmit={cadastrarFuncionario}
              >
                <label>Nome completo *</label>
                <input
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                  placeholder="Nome do funcionário"
                />

                <label>CPF *</label>
                <input
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  required
                  placeholder="CPF do funcionário"
                />

                <label>Cargo *</label>
                <input
                  value={cargo}
                  onChange={e => setCargo(e.target.value)}
                  required
                  placeholder="Ex.: Auxiliar administrativo"
                />

                <label>Salário mensal (R$) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={salario}
                  onChange={e => setSalario(e.target.value)}
                  required
                  placeholder="Ex.: 2500.00"
                />

                <label>Empresa *</label>
                <select
                  value={empresaId}
                  onChange={e => setEmpresaId(e.target.value)}
                  required
                >
                  <option value="">Selecione a empresa</option>
                  {empresas.map(empresa => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.razaoSocial}
                    </option>
                  ))}
                </select>

                <button type="submit">
                  Cadastrar funcionário
                </button>
              </form>
            )}

            <h2>Funcionários cadastrados</h2>

            {funcionarios.length === 0 ? (
              <p>Nenhum funcionário cadastrado.</p>
            ) : (
              <div className="lista-empresas">
                {funcionarios.map(funcionario => {
                  const empresa = empresas.find(
                    item => item.id === funcionario.empresaId
                  )

                  return (
                    <div className="empresa" key={funcionario.id}>
                      <strong>{funcionario.nome}</strong>
                      <p>CPF: {funcionario.cpf}</p>
                      <p>Cargo: {funcionario.cargo}</p>
                      <p>Salário: {formatarSalario(funcionario.salario)}</p>
                      <p>Empresa: {empresa?.razaoSocial || 'Não encontrada'}</p>

                      <button
                        className="botao-excluir"
                        onClick={() => excluirFuncionario(funcionario.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <button
              className="botao-secundario"
              onClick={() => setTela('inicio')}
            >
              Voltar ao início
            </button>
          </>
        )}

        
{tela === 'folha' && (
  <>
    <h1>Folha de Pagamento</h1>
    <p>Faça um cálculo demonstrativo da folha mensal.</p>

    <form
      className="formulario"
      onSubmit={event => {
        event.preventDefault()
        alert('Cálculo demonstrativo atualizado!')
      }}
    >
      <label>Competência (mês/ano) *</label>
      <input
        type="month"
        value={competencia}
        onChange={event => setCompetencia(event.target.value)}
        required
      />

      <label>Funcionário *</label>
      <select
        value={funcionarioFolha}
        onChange={event => setFuncionarioFolha(event.target.value)}
        required
      >
        <option value="">Selecione um funcionário</option>
        {funcionarios.map(funcionario => (
          <option key={funcionario.id} value={funcionario.id}>
            {funcionario.nome}
          </option>
        ))}
      </select>

      {funcionarioSelecionado && (
        <p>
          Salário base: {formatarSalario(salarioBase)}
        </p>
      )}

      <label>Horas extras e adicionais (R$)</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={horasExtras}
        onChange={event => setHorasExtras(event.target.value)}
      />

      <label>Outros proventos (R$)</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={outrosProventos}
        onChange={event => setOutrosProventos(event.target.value)}
      />

      <label>Outros descontos (R$)</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={outrosDescontos}
        onChange={event => setOutrosDescontos(event.target.value)}
      />

      <button type="submit">Confirmar cálculo</button>
    </form>

    {funcionarioSelecionado && competencia && (
      <div className="cartao resultado-folha">
        <h2>Resumo da folha</h2>
        <p>Funcionário: {funcionarioSelecionado.nome}</p>
        <p>Competência: {competencia}</p>
        <p>Salário base: {formatarSalario(salarioBase)}</p>
        <p>Total de proventos: {formatarSalario(totalProventos)}</p>
        <p>Total de descontos informados: {formatarSalario(totalDescontos)}</p>
        <h2>
          Salário líquido demonstrativo: {formatarSalario(salarioLiquido)}
        </h2>
      </div>
    )}

    <button onClick={() => setTela('inicio')}>
      Voltar ao início
    </button>
  </>
)}


        
{tela === 'obrigacoes' && (
  <>
    <h1>Obrigações Trabalhistas</h1>
    <p>Cadastre e acompanhe os prazos das obrigações.</p>

    <form
      className="formulario"
      onSubmit={event => {
        event.preventDefault()

        const formulario = event.currentTarget
        const dados = new FormData(formulario)

        const novaObrigacao = {
          id: Date.now(),
          empresaId: Number(dados.get('empresaId')),
          descricao: dados.get('descricao'),
          vencimento: dados.get('vencimento'),
          status: 'Pendente'
        }

        setObrigacoes(lista => [...lista, novaObrigacao])
        formulario.reset()
      }}
    >
      <label>Empresa *</label>
      <select name="empresaId" required defaultValue="">
        <option value="">Selecione uma empresa</option>
        {empresas.map(empresa => (
          <option key={empresa.id} value={empresa.id}>
            {empresa.razaoSocial}
          </option>
        ))}
      </select>

      <label>Descrição da obrigação *</label>
      <input
        name="descricao"
        type="text"
        placeholder="Ex.: FGTS mensal"
        required
      />

      <label>Data de vencimento *</label>
      <input name="vencimento" type="date" required />

      <button type="submit">Cadastrar obrigação</button>
    </form>

    <h2>Obrigações cadastradas</h2>

    {obrigacoes.length === 0 ? (
      <p>Nenhuma obrigação cadastrada.</p>
    ) : (
      <div className="lista-empresas">
        {obrigacoes.map(obrigacao => {
          const empresa = empresas.find(
            item => item.id === obrigacao.empresaId
          )

          return (
            <div className="empresa" key={obrigacao.id}>
              <h3>{obrigacao.descricao}</h3>
              <p>Empresa: {empresa?.razaoSocial || 'Empresa não encontrada'}</p>
              <p>Vencimento: {obrigacao.vencimento}</p>
              <p>Status: {obrigacao.status}</p>

              {obrigacao.status !== 'Concluída' && (
                <button
                  type="button"
                  onClick={() =>
                    setObrigacoes(lista =>
                      lista.map(item =>
                        item.id === obrigacao.id
                          ? { ...item, status: 'Concluída' }
                          : item
                      )
                    )
                  }
                >
                  Marcar como concluída
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Deseja excluir esta obrigação?')) {
                    setObrigacoes(lista =>
                      lista.filter(item => item.id !== obrigacao.id)
                    )
                  }
                }}
              >
                Excluir
              </button>
            </div>
          )
        })}
      </div>
    )}
  </>
)}


      </main>
    </div>
  )
}

export default App
