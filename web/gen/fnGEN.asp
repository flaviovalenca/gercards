<%
	option explicit
	randomize

	Dim idiomaSessao
    
	if request.querystring("lang") = "en" then
		session("idioma") = "en"
	elseif request.querystring("lang") = "pt" then
		session("idioma") = "pt"
	else
		if (session("idioma") = "") or (IsNull(session("idioma"))) then
			session("idioma") = "pt"
		end if
	end if
	
	idiomaSessao = Session("idioma")
	
    'Expire a página em caso de back do navegador
    Response.Expires=0
    Response.Buffer = True 
    Response.ExpiresAbsolute = Now() - 1
    Response.CacheControl = "no-cache"
    Response.AddHeader "cache-control", "private" 
    Response.AddHeader "pragma", "no-cache"


	'Tempo de timeout (24 horas?)
	server.scripttimeout = 86400
	
	'Session("Versao") = "1.0.0 de 05/05/2024"	
	'Session("Versao") = "1.0.1 28/06/2024"		
	Session("Versao") = "2025 <br> <span>Versão </span> 1.0.2 30/04/2025"		

	Session ("stCamDados") = "C:\SistemasWeb\gercards\Dados\"
	Session ("stCamWeb") = "C:\SistemasWeb\gercards\web\"

	'Produ��o - DMZ
	Session ("stCamLog") = "C:\SistemasWeb\gercards\logapieasbr\"
	
	
	Session ("stCamIni") = Session ("stCamDados") & "iniFiles\config.ini"
	Session ("stCamQry") = Session ("stCamDados") & "queries\"
	Session ("stCamDlg") = Session ("stCamDados") & "dialogos\"
	Session ("stCamTemplate") = Session ("stCamDados") & "modelos\"
	Session ("stCamRaiz") = Request.ServerVariables("APPL_PHYSICAL_PATH")


	'N�vel do Log:
	' 0. Nenhum log
	' 1. Eventos sem os detalhes
	' 2. Detalhamento do evento
	' 3. Etapas do detalhamento do evento
	Dim nivelLog
	nivelLog = 3

	'Anti-cache
'	Response.Expires=0
'	Response.Buffer = True 
'	Response.ExpiresAbsolute = Now() - 1
'	Response.CacheControl = "no-cache"
'	Response.AddHeader "cache-control", "private" 
'	Response.AddHeader "pragma", "no-cache"


	'Padr�o de mensagem de sucesso
	Const msgOk = "OK"

	'Identifica��o do modo DEBUG
	Dim debugMode
	debugMode = false

	'Testes de performance
	dim dbgTempo(100)
	dim dbgTempoAtual


	'Objeto global de manipulação de arquivos
	Dim FSO
	Set FSO = CreateObject("Scripting.FileSystemObject")

	'Estado (UF) do usuário
	dim estUs
	estUs = "PE"

	'Perfis de usu�rio
	dim   codPerfilUsuarioWeb			'Perfil de usuário WEB

	codPerfilUsuarioWeb				= 9

	'E-mail de contato
	const mailREM					= "gercards@estaleiroatlanticosul.com.br"
	const mailBCC					= ""
	const urlApp					= "http://gercards.easbr.com/"
	const urlAppS					= "https://gercards.easbr.com/"
	const urlAssinador				= "http://localhost:8000/assinar"
	const urlEnvelope				= "http://localhost:8000/getenvelope"
	const urlConsentimento			= "http://localhost:8000/request-consent"

	
	'Busca o endere�o remoto
	if session ("remote_addr") & "" = "" then session ("remote_addr") = request.servervariables ("remote_addr")

	dim viewpadrao	
				
		viewpadrao = 			  " SELECT  "
		viewpadrao = viewpadrao & " lc.cred_numero CREDENCIAL, p.pes_numero MATRICULA, p.pes_nome NOME, e.est_descricao ESTRUTURA, "
		viewpadrao = viewpadrao & " g.grp_descricao GRUPO,eq.eqpi_descricao EQUIPAMENTO, "
		viewpadrao = viewpadrao & " TO_DATE(TO_CHAR(lc.mov_datahora, 'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS') DATA_HORA, lc.mov_entradasaida ENTRADA_SAIDA "
		viewpadrao = viewpadrao & " FROM  "
		viewpadrao = viewpadrao & " default_acesso_pessoas p "
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_cred_pessoas    cp ON p.pes_numero = cp.pes_numero"
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_log_credencial  lc ON p.pes_numero = lc.pes_numero  	   "
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_estrutura       e  ON p.est_numero = e.est_numero"
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_grupos          g  ON lc.grp_numero = g.grp_numero"
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_equipamentos    eq ON eq.eqpi_numero = lc.eqpi_numero"
		viewpadrao = viewpadrao & " 		"
		viewpadrao = viewpadrao & " WHERE"
		viewpadrao = viewpadrao & " lc.mov_datahora between sysdate - 40 and sysdate      "
		viewpadrao = viewpadrao & " and lc.lgcrti_numero in(10,12,26,27,32)"
		viewpadrao = viewpadrao & " and lc.grp_numero in(P_GRUPOS)"
		viewpadrao = viewpadrao & " AND UPPER(e.est_descricao) LIKE '%P_EMPRESA%'"
		viewpadrao = viewpadrao & " 					"
		viewpadrao = viewpadrao & " UNION      "
		viewpadrao = viewpadrao & " 			"  
		viewpadrao = viewpadrao & " SELECT  "
		viewpadrao = viewpadrao & " lc.cred_numero CREDENCIAL, p.pes_numero MATRICULA, p.pes_nome NOME, e.est_descricao ESTRUTURA, "
		viewpadrao = viewpadrao & " g.grp_descricao GRUPO,eq.eqpi_descricao EQUIPAMENTO, "
		viewpadrao = viewpadrao & " TO_DATE(TO_CHAR(lc.mov_datahora, 'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS') DATA_HORA, lc.mov_entradasaida ENTRADA_SAIDA "
		viewpadrao = viewpadrao & " FROM  "
		viewpadrao = viewpadrao & " default_acesso_pessoas p "
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_cred_pessoas    cp ON p.pes_numero = cp.pes_numero"
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_log_credencial  lc ON p.pes_numero = lc.pes_numero  	   "
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_estrutura       e  ON p.est_numero = e.est_numero"
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_grupos          g  ON lc.grp_numero = g.grp_numero"
		viewpadrao = viewpadrao & " LEFT JOIN default_acesso_equipamentos    eq ON eq.eqpi_numero = lc.eqpi_numero"
		viewpadrao = viewpadrao & " WHERE"
		viewpadrao = viewpadrao & " lc.mov_datahora between sysdate - 1 and sysdate      "
		viewpadrao = viewpadrao & " and lc.lgcrti_numero in(10,12,26,27,32)"
		viewpadrao = viewpadrao & " and lc.grp_numero in(P_GRUPOS)"
		viewpadrao = viewpadrao & " AND UPPER(e.est_descricao) NOT LIKE '%P_EMPRESA%'"
		viewpadrao = viewpadrao & " GROUP BY "
		viewpadrao = viewpadrao & " lc.cred_numero, p.pes_numero, p.pes_nome, e.est_descricao, g.grp_descricao, eq.eqpi_descricao, lc.mov_datahora, lc.mov_entradasaida"
	
%>