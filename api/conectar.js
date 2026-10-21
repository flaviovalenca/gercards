const express = require('express');
const oracledb = require('oracledb');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o pacote cors

const app = express();

app.use(cors()); 
app.use(bodyParser.json());

// Configuração da conexão do banco de dados
let clientOpts = {};
if (process.platform === 'win32') {
  // Windows
  clientOpts = { libDir: 'C:\\Oracle\\instantclient_21_9' };
} else if (process.platform === 'darwin' && process.arch === 'x64') {
  // macOS Intel
  clientOpts = { libDir: process.env.HOME + '/Downloads/instantclient_19_8' };
}
oracledb.initOracleClient(clientOpts);

const dbConfig = {
  user: 'sevenrio',
  password: 'sevenrioeas2023',
  connectString: 'localhost/XE',
  tnsAdmin: 'C:\\Oracle\\instantclient_21_9\\network\\admin'
};

// Middleware para validar o token JWT
function validarToken(req, res, next) {

    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token) {
    jwt.verify(token, 'chave_secreta', (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Token inválido' });
      } else {
        // Se o token for válido, armazene o usuário decodificado no objeto de requisição
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ error: 'Token não fornecido' });
  }
}

// Rota para autenticar o usuário e gerar o token JWT
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verificação das credenciais
  if (username === 'usuario' && password === 'senha') {
    // Se as credenciais estiverem corretas, gerar um token JWT
    const token = jwt.sign({ username }, 'chave_secreta');
    res.status(200).json({ token }); // Enviar o token JWT como resposta
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rota protegida para "/cards", que requer um token JWT válido para acessar
app.get('/cards', validarToken, async (req, res) => {
  let connection;


  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM DEFAULT_ACESSO.CARDS');
    
    // Retornar os dados em formato JSON
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao executar a consulta:", err);
    res.status(500).json({ error: 'Erro ao executar a consulta' });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("Conexão fechada com sucesso!");
      } catch (err) {
        console.error("Erro ao fechar a conexão:", err);
      }
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
