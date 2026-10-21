<!--#include file="gen\fnGEN.asp"--> 
<!--#include file="gen\fnGerais.asp"--> 
<!--#include file="gen\fnIniFiles.asp"--> 
<!--#include file="gen\fnBD.asp"--> 

<%
	
	Response.CharSet = "ISO-8859-1"

	' Declaração
	Dim campo, tabela, valor
	campo  = request.querystring("cpo")
	tabela = request.querystring("tbl")
	valor  = request.querystring("q")

	' Abre a conexão com o banco de dados
	call BD.conecta

	If tabela = "unidade" Then
		call BD.insereCampoQuery ("DESCRICAO",UCase(valor))
		call BD.abreQuery ("QRY_AUTOCOMPLETE_UNIDADE",1) 
	Else
		call BD.insereCampoQuery ("CAMPO",campo)
		call BD.insereCampoQuery ("TABELA",tabela)
		call BD.insereCampoQuery ("VALOR",UCase(valor))
		call BD.abreQuery ("AUTOCOMPLETE",1) 
	End If	
	
    ' Fecha a Query e o Banco
	call BD.fechaQuery
	call BD.desconecta

%>