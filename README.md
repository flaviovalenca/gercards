# GerCards

Aplicação de gerenciamento e aprovação de cards. A interface principal é um sistema legado em ASP Clássico, servido pelo IIS, com telas em JavaScript, jQuery, Bootstrap e DataTables. O projeto também contém uma API Node.js separada.

## Estrutura

- `web/`: páginas ASP, scripts JavaScript, estilos, imagens e bibliotecas da interface.
- `web/gen/`: funções compartilhadas de ASP, acesso a dados, sessões e utilitários.
- `Dados/queries/`: consultas SQL usadas pelo sistema ASP.
- `Dados/iniFiles/`: configurações locais de conexão e caminhos. Os arquivos podem conter dados sensíveis.
- `Dados/scripts/sql/`: scripts para criação e manutenção do esquema Oracle.
- `api/`: serviço Node.js/Express independente, com dependência Oracle.

## Requisitos

Para executar a aplicação web:

- Windows com IIS e o recurso **ASP Clássico** habilitado.
- Oracle Database acessível pela máquina do IIS.
- Oracle Provider for OLE DB instalado, com arquitetura compatível com a arquitetura do Application Pool.
- Alias de conexão Oracle `XE` configurado para a instância local ou ajuste da conexão em `web/gen/fnBD_TBD.asp`.
- Permissão de leitura do Application Pool nas pastas `Dados/` e `web/`, além das permissões de escrita necessárias às rotinas que geram arquivos.

Para executar a API opcional, também é necessário Node.js, Oracle Instant Client e a configuração de conexão Oracle descrita em `api/install.txt`.

## Configuração local no IIS

1. Coloque o projeto em `C:\SistemasWeb\gercards` ou ajuste os caminhos absolutos usados pela aplicação.
2. No IIS, crie uma aplicação chamada `gercards` apontando para a pasta `web/`.
3. Habilite ASP Clássico no IIS e selecione um Application Pool com arquitetura compatível com o Oracle Provider instalado.
4. Configure e valide a conexão Oracle. A página ASP usa o provider `OraOLEDB.Oracle.1` e o alias `XE`.
5. Confira os caminhos de dados e consultas em `web/gen/fnGEN.asp`, `web/gen/fnBD_TBD.asp` e `web/global.asa`. O leitor de consultas usa `Dados/queries/qgercards.txt`.
6. Acesse `http://localhost/gercards/`. O documento padrão configurado em `web/web.config` é `login.asp`.

As configurações de `Dados/iniFiles/` e as credenciais usadas na conexão Oracle devem ser locais e protegidas. Não publique senhas, tokens ou chaves em documentação ou commits.

## API Node.js opcional

A API em `api/` é independente das páginas ASP. Para instalar dependências e iniciá-la em desenvolvimento:

```powershell
cd api
npm ci
node conectar.js
```

Por padrão, o serviço escuta na porta `3000` (pode ser alterada pela variável `PORT`). Antes de iniciar ou publicar o serviço, revise `api/conectar.js` e configure credenciais, chaves JWT e caminhos do Oracle Instant Client de forma segura. Não reutilize valores de desenvolvimento em produção.

## Dados e consultas

Os scripts SQL estão em `Dados/scripts/sql/`; revise-os e aplique-os ao banco apropriado conforme o ambiente. A aplicação ASP carrega as consultas de `Dados/queries/qgercards.txt`. Alterações no esquema podem exigir mudanças tanto nos scripts SQL quanto nas consultas e páginas que consomem seus campos.

## Observações de desenvolvimento

- O login ASP consulta o banco Oracle; uma página de login carregada com sucesso não confirma que o banco está conectado.
- A URL base local do JavaScript é definida em `web/js/common.js`.
- As páginas ASP mantêm sessão e CSRF para operações da aplicação. Faça alterações de API respeitando esses fluxos.
- Não há uma suíte de testes automatizados documentada no repositório.
