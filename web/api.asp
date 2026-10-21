<!--#include file="gen\fnGEN.asp"--> 
<!--#include file="gen\fnGerais.asp"--> 
<!--#include file="gen\fnIniFiles.asp"--> 
<!--#include file="gen\fnBD.asp"--> 
<!--#include file="gen\fnTemplate.asp"--> 
<!--#include file="js/jquery/json/JSON_2.0.4.asp"-->
<!--#include file="gen\fnUTF8.asp"--> 

<%

If Session("initiated") <> True Then
	Session.Contents.RemoveAll
	Session("initiated") = True
End If
 
'response.clear
response.Charset="UTF8"
response.ContentType = "application/json"

Response.AddHeader "Access-Control-Allow-Origin", "*" 

On Error Resume Next
 
Dim funcao, id,empresa
Dim url, httpRequest, responseText
Dim senhaMD5,userIP, key
Dim empnaviousu
Dim arrayempnavio
Dim arraytitemempnav
Dim itemempnav
Dim numreg
Dim incluiand
Dim groupby
Dim groupbyitem
Dim qrycardsitem
Dim idcard	
Dim registros
Dim temWhere

Dim objJson
Set objJson = jsObject()

funcao = request("funcao")
id = request("id")

If request("token") <> Session("csrf_token") and (funcao <> "getlogin") Then			
	objJson("ERRO") = "Token Expirado"
	objJson.Flush  
	response.end
End If

Call BD.conecta

if (funcao = "getsessao") then
	If request("token") <> Session("csrf_token") and (funcao <> "getlogin") Then	
		objJson("ERRO") = "Token Expirado" 			
		objJson.Flush  
		response.end
	Else
		objJson("ERRO") = "OK" 			
		objJson.Flush  
		response.end
	End If
end if


if (funcao = "gettiposid") then
	Call BD.limpaCamposQuery	
	Call BD.abreQuery("QRY_SEL_TIPOS_ID",1)	
end if

if (funcao = "gettiposdetalhesid") then
	Call BD.limpaCamposQuery	
	Call BD.abreQuery("QRY_SEL_TIPOS_DETALHES_ID",1)	
end if

if (funcao = "gettiposdetalhesporparametro") then

	qry = qry & " SELECT CTITDI.ID, CTITDI.ID_CARDS_TIPO_ID ,cti.SIGLA, cti.SIGLA || '-' || cti.DESCRICAO AS TIPO_DESCRICAO,cti.DESCRICAO AS TIPO_DESCRICAO1, ctdi.DESCRICAO  AS TIPO_DETALHE_DESCRICAO,CTITDI.ID_CARDS_TIPO_DETALHE_ID "
	qry = qry & " FROM GERCARDS.CARDS_TIPO_ID_TIPO_DETALHE_ID ctitdi INNER JOIN GERCARDS.CARDS_TIPO_DETALHE_ID ctdi ON "
	qry = qry & " ctitdi.ID_CARDS_TIPO_DETALHE_ID = ctdi.ID INNER JOIN GERCARDS.CARDS_TIPO_ID cti  ON ctitdi.ID_CARDS_TIPO_ID  = cti.ID "

	if (request("tipoid") <> "") or (request("tipoiddetalhe") <> "") then
		qry = qry & " WHERE "
	end if

	if request("tipoid") <> "" then
		qry = qry & " CTITDI.ID_CARDS_TIPO_ID = " & request("tipoid")
	end if

	if request("tipoiddetalhe") <> "" then
		if request("tipoid") <> "" then
			qry = qry & " AND "
		end if
		qry = qry & " CTITDI.ID_CARDS_TIPO_DETALHE_ID = " & request("tipoiddetalhe")
	end if

	qry = qry & " ORDER BY cti.DESCRICAO, ctdi.DESCRICAO"
	call BD.AbreQueryDireto(qry)
	
end if

if (funcao = "gettiposdetalhesidportipoid") then
	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery("ID",request("tipoid"))
	Call BD.abreQuery("QRY_TIPO_DETALHE_POR_TIPO_ID",1)
end if	


if (funcao = "instipo") then

	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20n%C3%A3o%20 Autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("tipoid") = "") then
		objJson("ERRO") = "Tipo Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tiposigla") = "") then
		objJson("ERRO") = "Sigla %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipodetalheid") = "") then
		objJson("ERRO") = "Tipo Detalhe Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("SIGLA",request("tiposigla"))
	Call BD.insereCampoQuery ("DESCRICAO",request("tipoid"))
	Call BD.abreQuery("QRY_INS_TIPO",0)
	
	if InStr(UCASE(BD.ERRO),"UNIQUE ") > 0 then
		objJson("ERRO") = "Sigla ou Descrição %20j%C3%A1%20 cadastrada"
		objJson.Flush  
		response.end
	else
		objJson("ERRO") = BD.ERRO
	end if	

	' Cadastra Tipo Detalhe Id e Faz a associação Tipo Id e Tipo Detalhe	
	if BD.ERRO = "OK" then

		Dim idTipo
		Dim idDetalheTipo

		' Resgata o Id do Navio
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("SIGLA",request("tiposigla"))
		Call BD.insereCampoQuery ("DESCRICAO",request("tipoid"))					
		Call BD.abreQuery("QRY_SEL_TIPO_ID_POR_SIGLA_DESCRICAO",1)


		if (BD.EOF and BD.BOF) then
			objJson("ERRO") = "Tipo Id  %20n%C3%A3o%20 cadastrado"
			objJson.Flush  
			response.end
		end if
		
		idTipo = BD.valor("ID")
		Call BD.fechaQuery

		' Insere Tipo Detalhe Id
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("DESCRICAO",request("tipodetalheid"))
		Call BD.abreQuery("QRY_INS_TIPO_DETALHE_ID",0)

		if InStr(BD.ERRO,"UNIQUE") > 0 then
			objJson("ERRO") = "Tipo Detalhe %20j%C3%A1%20 cadastrado"
			objJson.Flush  
			response.end
		else
			objJson("ERRO") = BD.ERRO
		end if
		
		' Resgata o Tipo Detalhe Id		
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("DESCRICAO",request("tipodetalheid"))					
		Call BD.abreQuery("QRY_SEL_TIPO_DETALHE_ID_POR_DESCRICAO",1)
		
		if (BD.EOF and BD.BOF) then
			objJson("ERRO") = "Tipo Id  não cadastrado"
			objJson.Flush  
			response.end
		end if
		
		idDetalheTipo = BD.valor("ID")
		Call BD.fechaQuery

		' Insere Tipo Id e Tipo Detalhe Id
		Call BD.insereCampoQuery ("TIPO_ID",idTipo)
		Call BD.insereCampoQuery ("TIPO_DETALHE_ID",idDetalheTipo)
		
		Call BD.abreQuery("QRY_INS_TIPO_ID_TIPO_DETALHE_ID",0)

		if InStr(BD.ERRO,"UNIQUE") > 0 then
			objJson("ERRO") = "Tipo Detalhe %20j%C3%A1%20 cadastrado"
			objJson.Flush  
			response.end
		else
			objJson("ERRO") = BD.ERRO
		end if

	end if
	
	objJson.Flush  
	response.end

end if

if (funcao = "updtipo") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("tipoid") = "") then
		objJson("ERRO") = "Tipo Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipoiddetalhe") = "") then
		objJson("ERRO") = "Tipo Detalhe Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipoidsigla") = "") then
		objJson("ERRO") = "Sigla %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipoiddescricao") = "") then
		objJson("ERRO") = "Tipo Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipoiddetalhedescricao") = "") then
		objJson("ERRO") = "Tipo Detalhe Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	' Atualiza Tipo Id
	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID",request("tipoid"))
	Call BD.insereCampoQuery ("SIGLA",request("tipoidsigla"))	
	Call BD.insereCampoQuery ("DESCRICAO",request("tipoiddescricao"))	
	Call BD.abreQuery("QRY_UPD_TIPO_ID",0)

	
	' Atualiza Tipo Detalhe Id
	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID",request("tipoiddetalhe"))
	Call BD.insereCampoQuery ("DESCRICAO",request("tipoiddetalhedescricao"))	
	Call BD.abreQuery("QRY_UPD_TIPO_DETALHE_ID",0)

	objJson("ERRO") = BD.ERRO
	objJson.Flush  
	response.end


end if


if (funcao = "deltipoidtipodetalhe") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("id") = "") then
		objJson("ERRO") = "Id Tipo Id/Tipo Detalhe Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipoid") = "") then
		objJson("ERRO") = "Tipo Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipodetalheid") = "") then
		objJson("ERRO") = "Tipo Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.abreQuery("QRY_DEL_TIPO_ID_TIPO_DETALHE_ID_POR_ID",0)
		
	if InStr(BD.ERRO,"violada") > 0 then
		objJson("ERRO") = "Este Tipo/Tipo Detalhe possui registros associados."		
	else

		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("ID",request("tipodetalheid"))	
		Call BD.abreQuery("QRY_DEL_TIPO_DETALHE_ID_POR_ID",0)
		objJson("ERRO")  = BD.ERRO

		if BD.ERRO = "OK" then
			Call BD.limpaCamposQuery
			Call BD.insereCampoQuery ("ID",request("tipoid"))	
			Call BD.abreQuery("QRY_DEL_TIPO_ID_POR_ID",0)			
		else
			objJson("ERRO") = "Este tipo detalhe id possui registros associados."			
		end if		
	end if	
	
	objJson.Flush  
	response.end

end if

if (funcao = "instipodetalhe") then
	
	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("tipoid") = "") then
		objJson("ERRO") = "Tipo Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipoiddetalhedescricao") = "") then
		objJson("ERRO") = "Tipo detalhe descrição %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("DESCRICAO",request("tipoiddetalhedescricao"))	
	Call BD.abreQuery("QRY_INS_TIPO_DETALHE_ID",0)
		
	if InStr(BD.ERRO,"unique") > 0 then
		objJson("ERRO") = "Tipo detalhe descrição já cadastrado"		
	else
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("DESCRICAO",request("tipoiddetalhedescricao"))	
		Call BD.abreQuery("QRY_SEL_TIPO_DETALHE_ID_POR_DESCRICAO",1)
		
		objJson("ERRO")  = BD.ERRO

		if BD.ERRO = "OK" then

			idDetalheTipo = BD.valor("ID")
			Call BD.fechaQuery

			' Insere Tipo Id e Tipo Detalhe Id
			Call BD.limpaCamposQuery
			Call BD.insereCampoQuery ("TIPO_ID",request("tipoid"))
			Call BD.insereCampoQuery ("TIPO_DETALHE_ID",idDetalheTipo)			
			Call BD.abreQuery("QRY_INS_TIPO_ID_TIPO_DETALHE_ID",0)

			if InStr(BD.ERRO,"UNIQUE") > 0 then
				objJson("ERRO") = "Tipo Detalhe %20j%C3%A1%20 cadastrado"
				objJson.Flush  
				response.end
			else
				objJson("ERRO") = BD.ERRO
			end if
	
		end if		
	end if	
	
	objJson.Flush  
	response.end



end if

if (funcao = "gettotalcardsassinado") then
	
	Call BD.limpaCamposQuery
	if (Session("PERFIL") = "S") or (Session("PERFIL") = "C") or (Session("PERFIL") = "E") then
		Call BD.insereCampoQuery("ID_USUARIO",Session("ID_LOGADO"))
		Call BD.abreQuery("QRY_TOTAL_CARDS_ASSINADO_POR_ID_EMPRESA_NAVIO",1)
	else			
		Call BD.abreQuery("QRY_TOTAL_CARDS_ASSINADO",1)
	end if	

end if

if (funcao = "gettotalcardsrejeitado") then
	
	Call BD.limpaCamposQuery
	if (Session("PERFIL") = "S") or (Session("PERFIL") = "C") or (Session("PERFIL") = "E") then
		Call BD.insereCampoQuery("ID_USUARIO",Session("ID_LOGADO"))
		Call BD.abreQuery("QRY_TOTAL_CARDS_REJEITADO_POR_ID_EMPRESA_NAVIO",1)
	else			
		Call BD.abreQuery("QRY_TOTAL_CARDS_REJEITADO",1)
	end if	

end if

if (funcao = "gettotalcardnsassinado") then
	
	Call BD.limpaCamposQuery
	if (Session("PERFIL") = "S") or (Session("PERFIL") = "C") or (Session("PERFIL") = "E") then
		Call BD.insereCampoQuery("ID_USUARIO",Session("ID_LOGADO"))
		Call BD.abreQuery("QRY_TOTAL_CARDS_NASSINADO_POR_ID_EMPRESA_NAVIO",1)
	else			
		Call BD.abreQuery("QRY_TOTAL_CARDS_NASSINADO",1)
	end if	

end if


if (funcao = "getempresa") then
	
	Call BD.abreQuery("QRY_EMPRESA",1)

end if

if (funcao = "getempresaporid") then

	if (request("id") = "") then
		Call BD.abreQuery("QRY_EMPRESA",1)
	else
		Call BD.insereCampoQuery("ID",request("id"))
		Call BD.abreQuery("QRY_EMPRESA_POR_ID",1)
	end if
	
end if


if (funcao = "getnavio") then
	
	Dim qry

	qry = " SELECT EN.*,N.NOME_NAVIO,E.NOME_EMPRESA FROM GERCARDS.CARDS_EMPRESA_NAVIO EN INNER JOIN GERCARDS.CARDS_NAVIO N ON "
	qry = qry & " EN.ID_NAVIO = N.ID  INNER JOIN GERCARDS.CARDS_EMPRESA E ON EN.ID_EMPRESA = E.ID " 

	if (request("empresa") <> "") or  (request("navio") <> "") then
		qry = qry & " WHERE "
	end if

	if (request("empresa") <> "")  then
		qry = qry & " ID_EMPRESA = " & request("empresa") & " AND "
	end if

	if (request("navio") <> "")  then
		qry = qry & " ID_NAVIO = " & request("navio") & " AND "
	end if

	qry = RemoverUltimaPalavra(qry,"AND")	

	qry = qry & " ORDER BY E.NOME_EMPRESA,N.NOME_NAVIO"
	
	call BD.AbreQueryDireto(qry)


end if

if (funcao = "getunidade") then
	
	Call BD.abreQuery("QRY_UNIDADE",1)

end if


if (funcao = "getnavioporid") then

	if (request("id") = "") then
		Call BD.abreQuery("QRY_NAVIO",1)
	else
		Call BD.insereCampoQuery("ID",request("id"))
		Call BD.abreQuery("QRY_NAVIO_POR_ID",1)
	end if
	
end if

if (funcao = "getunidadeporid") then

	if (request("id") = "") then
		Call BD.abreQuery("QRY_UNIDADE",1)
	else
		Call BD.insereCampoQuery("ID",request("id"))
		Call BD.abreQuery("QRY_UNIDADE_POR_ID",1)
	end if
	
end if



if (funcao = "getnavioporempresa") then
	
	if (request("id") = "") then
		objJson("ERRO") = "Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("id"))
	if (Session("PERFIL") = "A") then
		Call BD.abreQuery("QRY_NAVIO_POR_EMPRESA",1)
	Else
		Call BD.insereCampoQuery("ID_USUARIO",Session("ID_LOGADO"))
		Call BD.abreQuery("QRY_NAVIO_POR_EMPRESA_POR_USUARIO_ID",1)
	End if'		

end if

if (funcao = "insempresa") then

	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20n%C3%A3o%20 Autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("nomeempresa") = "") then
		objJson("ERRO") = "Nome da empresa %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("NOME_EMPRESA",DecodeUTF8(request("nomeempresa")))
	Call BD.abreQuery("QRY_INS_EMPRESA",0)

	if InStr(BD.ERRO,"UNIQUE_EMPRESA_NOME") > 0 then
		objJson("ERRO") = "Empresa %20j%C3%A1%20 cadastrada"
	else
		objJson("ERRO") = BD.ERRO
	end if	
	
	objJson.Flush  
	response.end

end if

if (funcao = "insnavio") then

	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20n%C3%A3o%20 Autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("idempresa") = "") then
		objJson("ERRO") = "Id da empresa %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("nomenavio") = "") then
		objJson("ERRO") = "Nome do navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("numerocontrato") = "") then
		objJson("ERRO") = "N%C3%BAmero%20do%20Contrato%20n%C3%A3o%20informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("NOME_NAVIO",request("nomenavio"))
	Call BD.abreQuery("QRY_INS_NAVIO",0)
	
	if InStr(BD.ERRO,"UNIQUE_NAVIO_NOME") > 0 then
		objJson("ERRO") = "Navio %20j%C3%A1%20 cadastrado"
		objJson.Flush  
		response.end
	else
		objJson("ERRO") = BD.ERRO
	end if	

	' Faz a associação Empresa/Navio	
	if BD.ERRO = "OK" then

		Dim idNavio

		' Resgata o Id do Navio
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("NOME_NAVIO",request("nomenavio"))						
		Call BD.abreQuery("QRY_SEL_NAVIO_POR_NOME",1)

		if (BD.EOF and BD.BOF) then
			objJson("ERRO") = "Navio %20j%C3%A1%20 cadastrado"
			objJson.Flush  
			response.end
		end if
		
		idNavio = BD.valor("ID")
		Call BD.fechaQuery

		' Insere Empresa/Navio
		Call BD.insereCampoQuery ("ID_EMPRESA",request("idempresa"))
		Call BD.insereCampoQuery ("ID_NAVIO",idNavio)
		Call BD.insereCampoQuery ("NUMERO_CONTRATO",request("numerocontrato"))				
		Call BD.abreQuery("QRY_INS_EMPRESA_NAVIO",0)

		if InStr(BD.ERRO,"UNIQUE") > 0 then
			objJson("ERRO") = "Navio %20j%C3%A1%20 cadastrado"
			objJson.Flush  
			response.end
		else
			objJson("ERRO") = BD.ERRO
		end if	


	end if
	
	objJson.Flush  
	response.end

end if

if (funcao = "insunidade") then

	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20n%C3%A3o%20 Autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("nomeunidade") = "") then
		objJson("ERRO") = "Nome da unidade %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("siglaunidade") = "") then
		objJson("ERRO") = "Sigla da unidade %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("DESCRICAO",DecodeUTF8(request("nomeunidade")))
	Call BD.insereCampoQuery ("SIGLA",DecodeUTF8(request("siglaunidade")))
	Call BD.abreQuery("QRY_INS_UNIDADE",0)

	if InStr(BD.ERRO,"UNIQUE_UNIDADE_NOME") > 0 then
		objJson("ERRO") = "Unidade %20j%C3%A1%20 cadastrada"
	else
		objJson("ERRO") = BD.ERRO
	end if	
	
	objJson.Flush  
	response.end

end if



if (funcao = "updempresa") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("id") = "") then
		objJson("ERRO") = "Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("nomeempresa") = "") then
		objJson("ERRO") = "Nome da empresa %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if
	
	Call BD.insereCampoQuery ("ID",request("id"))
	Call BD.insereCampoQuery ("NOME_EMPRESA",request("nomeempresa"))
	Call BD.abreQuery("QRY_UPD_EMPRESA",0)

	if InStr(BD.ERRO,"UNIQUE_EMPRESA_NOME") > 0 then
		objJson("ERRO") = "Empresa %20j%C3%A1%20 cadastrada"
	else
		objJson("ERRO") = BD.ERRO
	end if	
	
	objJson.Flush  
	response.end

end if

if (funcao = "updnavio") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("idempresa") = "") then
		objJson("ERRO") = "Id Empresa %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("idnavio") = "") then
		objJson("ERRO") = "Id Navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("nomenavio") = "") then
		objJson("ERRO") = "Nome do navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("numerocontrato") = "") then
		objJson("ERRO") = "N%C3%BAmero%20do%20Contrato%20n%C3%A3o%20informado" 			
		objJson.Flush  
		response.end
	end if

	
	Call BD.insereCampoQuery ("ID",request("idnavio"))
	Call BD.insereCampoQuery ("NOME_NAVIO",request("nomenavio"))	
	Call BD.abreQuery("QRY_UPD_NAVIO",0)

	if InStr(BD.ERRO,"UNIQUE_NAVIO_NOME") > 0 then
		objJson("ERRO") = "Navio %20j%C3%A1%20 cadastrado"
	else
		if BD.ERRO = "OK" then
			Call BD.insereCampoQuery ("ID_EMPRESA",request("idempresa"))
			Call BD.insereCampoQuery ("ID_NAVIO",request("idnavio"))
			Call BD.insereCampoQuery ("NUMERO_CONTRATO",request("numerocontrato"))
			Call BD.abreQuery("QRY_UPD_CONTRATO",0)
			objJson("ERRO") = BD.ERRO
		else	
			objJson("ERRO") = BD.ERRO
		end if	
	end if	
	
	objJson.Flush  
	response.end

end if


if (funcao = "updunidade") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("id") = "") then
		objJson("ERRO") = "Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("nomeunidade") = "") then
		objJson("ERRO") = "Nome da unidade %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("siglaunidade") = "") then
		objJson("ERRO") = "Sigla da unidade %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if
	
		
	Call BD.insereCampoQuery ("ID",request("id"))
	Call BD.insereCampoQuery ("NOME_UNIDADE",request("nomeunidade"))
	Call BD.insereCampoQuery ("SIGLA",request("siglaunidade"))
	Call BD.abreQuery("QRY_UPD_UNIDADE",0)

	if InStr(BD.ERRO,"UNIQUE_UNIDADE_NOME") > 0 then
		objJson("ERRO") = "Unidade %20j%C3%A1%20 cadastrada"
	else
		objJson("ERRO") = BD.ERRO
	end if	
	
	objJson.Flush  
	response.end

end if



if (funcao = "delempresa") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("id") = "") then
		objJson("ERRO") = "Id %20j%C3%A1%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.abreQuery("QRY_DEL_EMPRESA_POR_ID",0)

	
	if InStr(BD.ERRO,"violada") > 0 then
		objJson("ERRO") = "Esta empresa possui registros associados."
	else
		objJson("ERRO") = BD.ERRO
	end if	
	
	objJson.Flush  
	response.end


end if

if (funcao = "delnavio") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("id") = "") then
		objJson("ERRO") = "Id empresa/navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("idnavio") = "") then
		objJson("ERRO") = "Id navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.abreQuery("QRY_DEL_EMPRESA_NAVIO_POR_ID",0)
		
	if InStr(BD.ERRO,"violada") > 0 then
		objJson("ERRO") = "Este navio possui registros associados."		
	else
		if BD.ERRO = "OK" then
			Call BD.insereCampoQuery ("ID",request("idnavio"))	
			Call BD.abreQuery("QRY_DEL_NAVIO_POR_ID",0)
			objJson("ERRO")  = BD.ERRO
		else
			objJson("ERRO") = "Este navio possui registros associados."
		end if
	end if	
	
	objJson.Flush  
	response.end

end if


if (funcao = "updcardsrejeitar") then

	if (Session("PERFIL") <> "A") and (Session("PERFIL") <> "S") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("id") = "") then
		objJson("ERRO") = "Id nao informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("movitorejeicao") = "") then
		objJson("ERRO") = "Motivo nao informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.insereCampoQuery ("MOTIVO_REJEICAO",request("movitorejeicao"))	
	Call BD.insereCampoQuery ("ID_USUARIO_REJEICAO",Session("ID_LOGADO"))	
	Call BD.abreQuery("QRY_UPD_REJEICAO",0)

	objJson("ERRO") = BD.ERRO

	if BD.ERRO = "OK" then
		enviaEmailRejeitadoCards (request("id"))
	end if 
	
	objJson.Flush  
	response.end


end if


if (funcao = "updcardsarquivar") then

	if (Session("PERFIL") <> "A") and (Session("PERFIL") <> "S") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("id") = "") then
		objJson("ERRO") = "Id nao informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("id"))		
	Call BD.insereCampoQuery ("ID_USUARIO_ARQUIVAMENTO",Session("ID_LOGADO"))	
	Call BD.abreQuery("QRY_UPD_ARQUIVAR",0)

	objJson("ERRO") = BD.ERRO

	objJson.Flush  
	response.end


end if

if (funcao = "updcardsdesarquivar") then

	if (Session("PERFIL") <> "A") and (Session("PERFIL") <> "S") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if
	
	if (request("id") = "") then
		objJson("ERRO") = "Id nao informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("id"))			
	Call BD.abreQuery("QRY_UPD_DESARQUIVAR",0)

	objJson("ERRO") = BD.ERRO

	objJson.Flush  
	response.end


end if



if (funcao = "delunidade") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("id") = "") then
		objJson("ERRO") = "Id %20j%C3%A1%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.abreQuery("QRY_DEL_UNIDADE_POR_ID",0)

	
	if InStr(BD.ERRO,"violada") > 0 then
		objJson("ERRO") = "Esta unidade possui registros associados."
	else
		objJson("ERRO") = BD.ERRO
	end if	
	
	objJson.Flush  
	response.end


end if

if (funcao = "getcardsporusuarioid") then

	if (request("id") = "") then
		objJson("ERRO") = "Id %20j%C3%A1%20 informado" 			
		objJson.Flush  
		response.end
	end if
	
	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.insereCampoQuery ("ID_USUARIO",Session("ID_LOGADO"))		
	call BD.AbreQuery("QRY_GET_CARD_POR_USER_ID",1)							

	objJson("ERRO") = BD.ERRO
	objJson("MEUCARD") = (BD.numRegs <> 0)
	objJson.Flush  
	response.end
	

end if 

if (funcao = "getcards") then

	Dim qrycards

	qrycards = "SELECT "
	qrycards = qrycards & " C.ID, C.ID_EMPRESA_NAVIO, C.NUMERO_CONTRATO, C.NOME_REQUISITANTE, C.ID_CARDS,C.TIPO_OUTRO, C.DESCRICAO, C.DATA_INICIO, C.DATA_TERMINO, TO_CHAR(c.QUANTIDADE, 'FM999999990.000') AS QUANTIDADE, C.ID_UNIDADE AS UNIDADE, C.NOME_ASSINANTE, "
	qrycards = qrycards & " EMAIL_ASSINANTE, ENVELOPE_ID, DATA_ASSINATURA,DATA_SOLICITACAO,CU.DESCRICAO AS DESCRICAO_UNIDADE,C.DATA_REJEICAO,C.TIPO_REQUISITANTE,"
	qrycards = qrycards & " CE.NOME_EMPRESA,CN.NOME_NAVIO,CU2.NOME AS USUARIO_ARQUIVAMENTO,C.DT_ARQUIVAMENTO  FROM GERCARDS.CARDS C INNER JOIN GERCARDS.CARDS_EMPRESA_NAVIO EN ON"
	qrycards = qrycards & " C.ID_EMPRESA_NAVIO = EN.ID INNER JOIN GERCARDS.CARDS_EMPRESA CE ON EN.ID_EMPRESA = CE.ID "
	qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_NAVIO CN ON EN.ID_NAVIO = CN.ID "
	qrycards = qrycards & " LEFT JOIN GERCARDS.CARDS_UNIDADE CU ON C.ID_UNIDADE = CU.ID "
	qrycards = qrycards & " LEFT JOIN GERCARDS.CARDS_USUARIO CU2 ON C.ID_USUARIO_ARQUIVAMENTO  = CU2.ID"
	
	if (request("empresa") <> "") or  (request("navio") <> "") or (request("contrato") <> "") or (request("id") <> "") or (request("datainicio") <> "") or (request("datatermino") <> "") or (request("assinado") <> "") or (Session("PERFIL") <> "A") then
		qrycards = qrycards & " WHERE "
	end if

	if (request("empresa") <> "")  then
		qrycards = qrycards & " ID_EMPRESA = " & request("empresa") & " AND "
	end if

	if (request("navio") <> "")  then
		qrycards = qrycards & " ID_NAVIO = " & request("navio") & " AND "
	end if

	if (request("contrato") <> "")  then
		qrycards = qrycards & " NUMERO_CONTRATO = '" & request("contrato") & "' AND "
	end if

	if (request("id") <> "")  then
		qrycards = qrycards & " ID_CARDS = '" & request("id") & "' AND "
	end if

	if (request("assinado") = "S")  then
		qrycards = qrycards & " ENVELOPE_ID IS NOT NULL AND "
	end if

	if (request("assinado") = "N")  then
		qrycards = qrycards & " ENVELOPE_ID IS NULL AND DATA_REJEICAO IS NULL AND "
	end if

	if (request("assinado") = "R")  then
		qrycards = qrycards & " DATA_REJEICAO IS NOT NULL AND "
	end if

	' Se não for ADM só ver os cards da empresa e navio que ele tá cadastrado
	if (Session("PERFIL") <> "A") then
		qrycards = qrycards & " EN.ID  IN ("
		qrycards = qrycards & " SELECT ID_EMPRESA_NAVIO FROM GERCARDS.CARDS_USUARIO_EMPRESA_NAVIO WHERE ID_USUARIO =" & Session("ID_LOGADO") & ") AND "
	end if

	if (request("datainicio") <> "") and (request("datatermino") <> "")  then
		qrycards = qrycards & " TO_CHAR(DATA_INICIO,'DD/MM/YYYY') = " & "'" & request("datainicio")  & "' AND TO_CHAR(DATA_TERMINO,'DD/MM/YYYY') = '" & request("datatermino") & "'"
	else
		qrycards = RemoverUltimaPalavra(qrycards,"AND")	
	end if

	temWhere = InStr(1, UCase(qrycards), "WHERE") > 0

	Dim tiporequisitante
	tiporequisitante = ""
	If (request("tiporequisitante") <> "")  then
		if session("PERFIL") = "A" then
			tiporequisitante = " AND TIPO_REQUISITANTE = '" &  request("tiporequisitante") & "'"		
		else
			tiporequisitante = " AND TIPO_REQUISITANTE = 'A'"		
		end if 	
	Else
		if session("PERFIL") <> "A" then
			tiporequisitante = " AND ((TIPO_REQUISITANTE = 'A') OR (TIPO_REQUISITANTE IS NULL))"		
		end if	
	End if	

	If session("PERFIL") = "A" then
		If temWhere Then
			if request("arquivar") = "S" then
				qrycards = qrycards & " AND C.DT_ARQUIVAMENTO IS NOT NULL " & tiporequisitante & " ORDER BY C.DATA_SOLICITACAO DESC"
			else
				qrycards = qrycards & " AND C.DT_ARQUIVAMENTO IS NULL " & tiporequisitante & " ORDER BY C.DATA_SOLICITACAO DESC"
			end if		
		Else
			if request("arquivar") = "S" then
				qrycards = qrycards & " WHERE C.DT_ARQUIVAMENTO IS NOT NULL " & tiporequisitante & " ORDER BY C.DATA_SOLICITACAO DESC"
			else
				qrycards = qrycards & " WHERE C.DT_ARQUIVAMENTO IS NULL " & tiporequisitante & " ORDER BY C.DATA_SOLICITACAO DESC"
			end if		
		End If
	Else		
		If temWhere Then
			qrycards = qrycards & " AND C.DT_ARQUIVAMENTO IS NULL " & tiporequisitante & " ORDER BY C.DATA_SOLICITACAO DESC"					
		Else
			qrycards = qrycards & " WHERE C.DT_ARQUIVAMENTO IS NULL " & tiporequisitante & " ORDER BY C.DATA_SOLICITACAO DESC"					
		End if	
	End if	
	
	call BD.AbreQueryDireto(qrycards)
		
	'objJson("query") = BD.query
	'objJson.Flush  
	'response.end

end if

if (funcao = "getcardstotal") then

	qrycards = "SELECT "	
	qrycards = qrycards & " COUNT(*) AS TOTAL FROM GERCARDS.CARDS C INNER JOIN GERCARDS.CARDS_EMPRESA_NAVIO EN ON"
	qrycards = qrycards & " C.ID_EMPRESA_NAVIO = EN.ID INNER JOIN GERCARDS.CARDS_EMPRESA CE ON EN.ID_EMPRESA = CE.ID "
	qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_NAVIO CN ON EN.ID_NAVIO = CN.ID "
	qrycards = qrycards & " LEFT JOIN GERCARDS.CARDS_UNIDADE CU ON C.ID_UNIDADE = CU.ID"
	
	if (request("empresa") <> "") or  (request("navio") <> "") or (request("contrato") <> "") or (request("id") <> "") or (request("datainicio") <> "") or (request("datatermino") <> "") or (request("tiporequisitante") <> "") or (Session("PERFIL") <> "A") then
		qrycards = qrycards & " WHERE "
	end if
	
	if (request("tiporequisitante") <> "")  then
		if session("PERFIL") = "A" then
			qrycards = qrycards & " TIPO_REQUISITANTE = '" & request("tiporequisitante") & "' AND "
		else
			qrycards = qrycards & " (TIPO_REQUISITANTE = 'A' OR TIPO_REQUISITANTE IS NULL) AND "
		end if	
	else
		if session("PERFIL") <> "A" then
			qrycards = qrycards & " (TIPO_REQUISITANTE = 'A' OR TIPO_REQUISITANTE IS NULL) AND "
		end if	
	end if

	if (request("empresa") <> "")  then
		qrycards = qrycards & " ID_EMPRESA = " & request("empresa") & " AND "
	end if

	if (request("navio") <> "")  then
		qrycards = qrycards & " ID_NAVIO = " & request("navio") & " AND "
	end if

	if (request("contrato") <> "")  then
		qrycards = qrycards & " NUMERO_CONTRATO = '" & request("contrato") & "' AND "
	end if

	if (request("id") <> "")  then
		qrycards = qrycards & " ID_CARDS = '" & request("id") & "' AND "
	end if

	' Se não for ADM só ver os cards da empresa e navio que ele tá cadastrado
	if (Session("PERFIL") <> "A") then
		qrycards = qrycards & " EN.ID  IN ("
		qrycards = qrycards & " SELECT ID_EMPRESA_NAVIO FROM GERCARDS.CARDS_USUARIO_EMPRESA_NAVIO WHERE ID_USUARIO =" & Session("ID_LOGADO") & ") AND "
	end if

	if (request("datainicio") <> "") and (request("datatermino") <> "")  then
		qrycards = qrycards & " TO_CHAR(DATA_INICIO,'DD/MM/YYYY') = " & "'" & request("datainicio")  & "' AND TO_CHAR(DATA_TERMINO,'DD/MM/YYYY') = '" & request("datatermino") & "'"
	else
		qrycards = RemoverUltimaPalavra(qrycards,"AND")	
	end if

	if ((request("empresa") <> "") or  (request("navio") <> "") or (request("contrato") <> "") or (request("id") <> "") or (request("datainicio") <> "") or (request("datatermino") <> "") or (request("tiporequisitante") <> "") or (Session("PERFIL") <> "A")) then	
		incluiand = " AND "
	else
		incluiand = "  WHERE "
	end if

   ' Total assinado
    if request("assinado") = "S" then
		if request("arquivar") = "S" then
			call BD.AbreQueryDireto(qrycards & incluiand & " ENVELOPE_ID IS NOT NULL AND DT_ARQUIVAMENTO IS NOT NULL ")							
		else
			call BD.AbreQueryDireto(qrycards & incluiand & " ENVELOPE_ID IS NOT NULL AND DT_ARQUIVAMENTO IS NULL ")							
		end if	
		objJson("TOTALASSINADO") = BD.valor("TOTAL")
		objJson("TOTALNAOASSINADO") = ""
		objJson("TOTALREJEITADO") = ""
		Call BD.fechaQuery
	end if		
		
	' Total não assinado	
	if request("assinado") = "N" then
		if request("arquivar") = "S" then
			call BD.AbreQueryDireto(qrycards  & incluiand & " ENVELOPE_ID IS NULL AND DATA_REJEICAO IS NULL AND DT_ARQUIVAMENTO IS NOT  NULL ")	
		else
			call BD.AbreQueryDireto(qrycards  & incluiand & " ENVELOPE_ID IS NULL AND DATA_REJEICAO IS NULL AND DT_ARQUIVAMENTO IS NULL ")	
		end if	
		objJson("TOTALNAOASSINADO") = BD.valor("TOTAL")	
		objJson("TOTALASSINADO") = ""
		objJson("TOTALREJEITADO") = ""						
		Call BD.fechaQuery
	end if	
	
	' Total Rejeitado
	if request("assinado") = "R" then
		if request("arquivar") = "S" then
			call BD.AbreQueryDireto(qrycards  & incluiand & " DATA_REJEICAO IS NOT NULL AND DT_ARQUIVAMENTO IS NOT NULL ")	
		else
			call BD.AbreQueryDireto(qrycards  & incluiand & " DATA_REJEICAO IS NOT NULL AND DT_ARQUIVAMENTO IS NULL ")	
		end if	
		objJson("TOTALASSINADO") = ""
		objJson("TOTALNAOASSINADO") = ""
		objJson("TOTALREJEITADO") = BD.valor("TOTAL")		
		Call BD.fechaQuery
	end if	

	if request("assinado") = "" then
		if request("arquivar") = "S" then
			call BD.AbreQueryDireto(qrycards & incluiand & " ENVELOPE_ID IS NOT NULL AND DT_ARQUIVAMENTO IS NOT NULL")							
		else
			call BD.AbreQueryDireto(qrycards & incluiand & " ENVELOPE_ID IS NOT NULL AND DT_ARQUIVAMENTO IS NULL")							
		end if	
		objJson("TOTALASSINADO") = BD.valor("TOTAL")		
		Call BD.fechaQuery

		if request("arquivar") = "S" then
			call BD.AbreQueryDireto(qrycards  & incluiand & " ENVELOPE_ID IS NULL AND DATA_REJEICAO IS NULL AND DT_ARQUIVAMENTO IS NOT NULL ")	
		else
			call BD.AbreQueryDireto(qrycards  & incluiand & " ENVELOPE_ID IS NULL AND DATA_REJEICAO IS NULL AND DT_ARQUIVAMENTO IS NULL ")	
		end if	
		objJson("TOTALNAOASSINADO") = BD.valor("TOTAL")							
		Call BD.fechaQuery

		if request("arquivar") = "S" then
			call BD.AbreQueryDireto(qrycards  & incluiand & " DATA_REJEICAO IS NOT NULL  AND DT_ARQUIVAMENTO IS NOT NULL ")			
		else	
			call BD.AbreQueryDireto(qrycards  & incluiand & " DATA_REJEICAO IS NOT NULL  AND DT_ARQUIVAMENTO IS NULL ")			
		end if 	
		objJson("TOTALREJEITADO") = BD.valor("TOTAL")		
		Call BD.fechaQuery
	end if
	
	
	objJson.Flush  
	response.end
	
	
end if


if (funcao = "getcardsconsolidado") then
	
	qrycards = ""

	qrycards = qrycards & " FROM GERCARDS.CARDS C INNER JOIN GERCARDS.CARDS_EMPRESA_NAVIO EN ON"
	qrycards = qrycards & " C.ID_EMPRESA_NAVIO = EN.ID INNER JOIN GERCARDS.CARDS_EMPRESA CE ON EN.ID_EMPRESA = CE.ID "
	qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_NAVIO CN ON EN.ID_NAVIO = CN.ID "
	qrycards = qrycards & " LEFT JOIN GERCARDS.CARDS_UNIDADE CU ON C.ID_UNIDADE = CU.ID "
	qrycards = qrycards & " WHERE DT_ARQUIVAMENTO IS NULL AND "
	
	if (request("empresa") <> "")  then
		qrycards = qrycards & " ID_EMPRESA = " & request("empresa") & " AND "
	end if

	if (request("navio") <> "")  then
		qrycards = qrycards & " ID_NAVIO = " & request("navio") & " AND "
	end if

	if (request("tipodetalheid") <> "Tipo Detalhe Id...") and (request("tipodetalheid") <> "Detail ID Type...")	and  (request("tipodetalheid") <> "") then
		qrycards = qrycards & " ID_CARDS LIKE '%" & request("tipodetalheid") & "%' AND "	
	end if


	' Se não for ADM só ver os cards da empresa e navio que ele tá cadastrado
	if (Session("PERFIL") <> "A") then
		qrycards = qrycards & " EN.ID = " & Session("ID_EMPRESA_NAVIO_LOGADO") & " AND "
	end if

	if (request("datainicio") <> "") and (request("datatermino") <> "")  then
		qrycards = qrycards & " (TO_DATE(TO_CHAR(DATA_SOLICITACAO,'DD/MM/YYYY'),'DD/MM/YYYY') >= TO_DATE(" & "'" & request("datainicio")  & "','DD/MM/YYYY')) AND " & "(TO_DATE(TO_CHAR(DATA_SOLICITACAO,'DD/MM/YYYY'),'DD/MM/YYYY') <= TO_DATE(" & "'" & request("datatermino")  & "','DD/MM/YYYY')) AND "
	end if

	qrycards = RemoverUltimaPalavra(qrycards,"AND")	

	' Usa uma cláusula padrão para fechar os WHEREs    
    incluiand = " 1=1 AND "

	' Calcula os três totais em uma única leitura da tabela
	call BD.AbreQueryDireto("SELECT COUNT(CASE WHEN ENVELOPE_ID IS NOT NULL THEN 1 END) AS TOTALASSINADO, " & _
		"COUNT(CASE WHEN ENVELOPE_ID IS NULL AND DATA_REJEICAO IS NULL THEN 1 END) AS TOTALNAOASSINADO, " & _
		"COUNT(CASE WHEN DATA_REJEICAO IS NOT NULL THEN 1 END) AS TOTALREJEITADO " & qrycards)
	objJson("TOTALASSINADO") = BD.valor("TOTALASSINADO")
	objJson("TOTALNAOASSINADO") = BD.valor("TOTALNAOASSINADO")
	objJson("TOTALREJEITADO") = BD.valor("TOTALREJEITADO")
	Call BD.fechaQuery

	' Registros
	if not ((request("empresa") <> "") or  (request("navio") <> "") or  (request("tipodetalheid") <> "Tipo Detalhe Id...") or (request("datainicio") <> "") or (request("datatermino") <> "") or (Session("PERFIL") <> "A")) then	
		'qrycards = RemoverUltimaPalavra(qrycards,"WHERE")	
	end if	

	call BD.AbreQueryDireto("SELECT C.ID, C.ID_EMPRESA_NAVIO, CE.NOME_EMPRESA,CU.SIGlA,CN.NOME_NAVIO, C.NUMERO_CONTRATO, C.NOME_REQUISITANTE, C.ID_CARDS, C.TIPO_OUTRO, CU.DESCRICAO AS UNIDADE,escape_special_chars(C.DESCRICAO) AS DESCRICAO, C.DATA_SOLICITACAO, C.DATA_INICIO, C.DATA_TERMINO, TO_CHAR(c.QUANTIDADE, 'FM999999990.000') AS QUANTIDADE, C.ID_UNIDADE, C.UNIDADE_OUTRO, C.NOME_ASSINANTE, C.EMAIL_ASSINANTE, C.ENVELOPE_ID, C.DATA_ASSINATURA, C.ID_CARDS_TIPO_ID_DET_ID, C.ID_USUARIO_REJEICAO, C.DATA_REJEICAO, C.MOTIVO_REJEICAO, C.STATUS_ANALISE, C.ID_USUARIO_SOLICITACAO, C.TIPO_REQUISITANTE " & qrycards)	
		
	Registros = BD.GetJsonFromRs("REGISTROS")
	Registros = Replace(Registros,vbCrLf, " ")
	Registros = Replace(Registros,vbCr, " ")
	Registros = Replace(Registros, vbLf, " ")
	objJson("REGISTROS") = Registros	
	
	Call BD.fechaQuery


	objJson.Flush  
	response.end

end if


if (funcao = "getcardsgraficoconsolidado") then
	
	qrycards = ""

    qrycards = qrycards & " SELECT STATUS_ANALISE, CTDI.DESCRICAO, COUNT(*) AS TOTAL "
    qrycards = qrycards & " FROM GERCARDS.CARDS C "
    qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_TIPO_ID_TIPO_DETALHE_ID ctitdi ON C.ID_CARDS_TIPO_ID_DET_ID = CTITDI.ID "
    qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_TIPO_ID cti ON CTITDI.ID_CARDS_TIPO_ID = CTI.ID "
    qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_TIPO_DETALHE_ID ctdi ON CTITDI.ID_CARDS_TIPO_DETALHE_ID = CTDI.ID "
    qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_EMPRESA_NAVIO EN ON C.ID_EMPRESA_NAVIO = EN.ID "
    qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_EMPRESA CE ON EN.ID_EMPRESA = CE.ID "
    qrycards = qrycards & " INNER JOIN GERCARDS.CARDS_NAVIO CN ON EN.ID_NAVIO = CN.ID "
    qrycards = qrycards & " LEFT JOIN GERCARDS.CARDS_UNIDADE CU ON C.ID_UNIDADE = CU.ID "
    qrycards = qrycards & " WHERE DT_ARQUIVAMENTO IS NULL AND "

    ' Filtros
    If Request("empresa") <> "" Then
        qrycards = qrycards & " ID_EMPRESA = " & Request("empresa") & " AND "
    End If

    If Request("navio") <> "" Then
        qrycards = qrycards & " ID_NAVIO = " & Request("navio") & " AND "
    End If

    If Request("tipodetalheid") <> "Tipo Detalhe Id..." And Request("tipodetalheid") <> "Detail ID Type..." Then
        qrycards = qrycards & " ID_CARDS LIKE '%" & Request("tipodetalheid") & "%' AND "
    End If

    If Session("PERFIL") <> "A" Then
        qrycards = qrycards & " EN.ID = " & Session("ID_EMPRESA_NAVIO_LOGADO") & " AND "
    End If

    If Request("datainicio") <> "" And Request("datatermino") <> "" Then
        qrycards = qrycards & " (DATA_SOLICITACAO >= TO_DATE('" & Request("datainicio") & "','DD/MM/YYYY')) AND "
        qrycards = qrycards & " (DATA_SOLICITACAO <= TO_DATE('" & Request("datatermino") & "','DD/MM/YYYY')) AND "
    End If

    qrycards = RemoverUltimaPalavra(qrycards, "AND")
    qrycards = qrycards & " GROUP BY STATUS_ANALISE, CTDI.DESCRICAO "

    Call BD.AbreQueryDireto(qrycards)
    objJson("REGISTROS") = BD.GetJsonFromRs("REGISTROS")
    Call BD.fechaQuery

    objJson.Flush
    Response.End

end if


if (funcao = "gettipoid") then		
	Call BD.abreQuery("QRY_NAVIO_TIPO_ID",1)

end if

if (funcao = "gettipodetalheidporid") then
	Call BD.insereCampoQuery ("ID_CARDS_TIPO_ID",request("id"))
	Call BD.abreQuery("QRY_TIPO_DETALHE_ID_POR_ID",1)
end if

if (funcao = "getunidade") then	
	call BD.abreQuery ("QRY_UNIDADE",1) 
end if	

if (funcao = "gettipoid") then
	Call BD.abreQuery("QRY_TIPO_ID",1)
end if

if (funcao = "getlogin") then
	
	senhaMD5 = UCase(md5(request("s")))

	session("LOGADO") = false

	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("EMAIL",request("e"))
	Call BD.insereCampoQuery ("SENHA", senhaMD5)
	Call BD.abreQuery("QRY_LOGIN",1)
	
	objJson("LOGADO") = "N"

	if (BD.eof and BD.bof) then
		objJson("ERRO") = "Usu%C3%A1rio%20ou%20Senha%20n%C3%A3o%20conferem"					
		objJson.Flush  
		response.end
	end if

	if (BD.valor("ATIVO") <> "S") then
	 	objJson("ERRO") = "Login desativado, solicite a Ativa%C3%A7%C3%A3o" 					
		objJson.Flush  
		response.end
	end if	
	
	objJson("ERRO") = "OK" 					
	objJson("LOGADO") = "S"
	objJson("NOME_LOGADO") = BD.valor("NOME")
	objJson("EMAIL_LOGADO") = BD.valor("EMAIL")
	objJson("IDIOMA")= Session("IDIOMA")
	
	Session("LOGADO") = true
	Session("PERFIL") = BD.VALOR("TIPO")
	Session("NOME_LOGADO") = BD.valor("NOME")
	Session("EMAIL_LOGADO") = BD.valor("EMAIL")
	Session("ID_LOGADO") = BD.valor("ID")
	Session("ID_EMPRESA_NAVIO_LOGADO") = BD.valor("ID_EMPRESA_NAVIO")
	
	objJson.Flush  
	response.end
end if

if (funcao = "getempnaviosporidusuario") then
	
	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("id") = "") then
		objJson("ERRO") = "Id Usuario %20j%C3%A1%20 informado" 			
		objJson.Flush  
		response.end
	end if

	' Apaga os registros temporarios anteriores
	Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
	Call BD.abreQuery("QRY_DEL_EMP_NAV_USU_TMP",0)

	' Resgata os dados e atualiza a tabela temporária com os registros
	Call BD.insereCampoQuery ("ID_USUARIO",request("id"))	
	Call BD.abreQuery("QRY_ID_EMPRESA_NAVIO_POR_ID_USUARIO",1)

	numreg = BD.numRegs

	ReDim arrayempnavio(numreg-1)

	' Preencher o Dictionary os registros de empresa e navio		
	itemempnav = 0
	Do While (not BD.EOF)	
		arrayempnavio(itemempnav) = BD.valor("ID_EMPRESA") & ";" & BD.valor("ID_NAVIO")						
		itemempnav = itemempnav + 1
		BD.prox
	Loop

	For itemempnav = 0 To UBound(arrayempnavio)

		arraytitemempnav = Split(arrayempnavio(itemempnav),";")

		' Cadastra a empresa e o navio para o usuário criado
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))			
		Call BD.insereCampoQuery ("ID_EMPRESA",arraytitemempnav(0))	
		Call BD.insereCampoQuery ("ID_NAVIO",arraytitemempnav(1))			
		Call BD.abreQuery("QRY_INSERT_EMP_NAV_USU_TMP",0)			

	Next

	Call BD.fechaQuery
	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
	Call BD.abreQuery("QRY_SEL_EMP_NAV_USU_TMP_POR_IDUSUARIO",1)

	empnaviousu = ""

	Do While (not BD.EOF)
		empnaviousu = empnaviousu & "<tr>"
		empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_EMPRESA") & "</td>"
		empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_NAVIO") & "</td>"
		empnaviousu = empnaviousu & "<td>"
		empnaviousu = empnaviousu & "<div>"																			
		empnaviousu = empnaviousu & "<a href='#' onclick=removerempnavalterar('"  & BD.valor("ID") & "') title='Remover' class='btn btn-danger shadow btn-xs sharp'><i class='fa fa-trash'></i> </a>"
		empnaviousu = empnaviousu & "</div>"
		empnaviousu = empnaviousu & "</td>"
		empnaviousu = empnaviousu & "</tr>"
		BD.prox
	Loop

	objJson("ERRO") = BD.ERRO
	objJson("TABELA") = empnaviousu
	objJson.Flush  
	response.end
	
end if

if (funcao = "insusuario") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20n%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("matricula") = "") then
		objJson("ERRO") = "Matrícula %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("nome") = "") then
		objJson("ERRO") = "Nome %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("empresa") = "") then
		objJson("ERRO") = "Empresa %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("navio") = "") then
		objJson("ERRO") = "Navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("email") = "") then
		objJson("ERRO") = "Email %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("senha") = "") then
		objJson("ERRO") = "Senha %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("ativo") = "") then
		objJson("ERRO") = "Ativo %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipo") = "") then
		objJson("ERRO") = "Tipo %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Dim clientIP
	clientIP = Request.ServerVariables("HTTP_X_FORWARDED_FOR")

	If clientIP = "" Or clientIP = "unknown" Then
    	clientIP = Request.ServerVariables("REMOTE_ADDR")
	End If

	Call BD.insereCampoQuery ("MATRICULA",request("matricula"))	
	Call BD.insereCampoQuery ("NOME",request("nome"))		
    Call BD.insereCampoQuery ("EMAIL",request("email"))	
	Call BD.insereCampoQuery ("SENHA",UCase(md5(request("senha"))))	
    Call BD.insereCampoQuery ("ATIVO",request("ativo"))	
    Call BD.insereCampoQuery ("TIPO",request("tipo"))	
	Call BD.insereCampoQuery ("EMPRESA",request("empresa"))	
	Call BD.insereCampoQuery ("NAVIO",request("navio"))	
	Call BD.insereCampoQuery ("IP",clientIP)	
    
	if (request("ativo") = "S") then
		Call BD.insereCampoQuery ("ID_LIBERACAO",Session("ID_LOGADO"))		
		Call BD.abreQuery("QRY_INSERIR_USUARIO_LIBERACAO",0)
	else
		Call BD.abreQuery("QRY_INSERIR_USUARIO",0)
	end if	

	if InStr(BD.ERRO,"violada") > 0 then
		objJson("ERRO") = "E-mail %20j%C3%A1%20 cadastro para esta matricula."
	else
		
		Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
		Call BD.abreQuery ("QRY_SEL_EMP_NAV_USU_TMP_POR_IDUSUARIO",1)
		
		numreg = BD.numRegs

		ReDim arrayempnavio(numreg-1)

		' Preencher o Dictionary os registros de empresa e navio		
		itemempnav = 0
		Do While (not BD.EOF)	
			arrayempnavio(itemempnav) = BD.valor("ID_EMPRESA") & ";" & BD.valor("ID_NAVIO")						
			itemempnav = itemempnav + 1
			BD.prox
		Loop

		For itemempnav = 0 To UBound(arrayempnavio)

			arraytitemempnav = Split(arrayempnavio(itemempnav),";")

			' Cadastra a empresa e o navio para o usuário criado
			Call BD.limpaCamposQuery
			Call BD.insereCampoQuery ("MATRICULA",request("matricula"))	
			Call BD.insereCampoQuery ("EMAIL",request("email"))		
			Call BD.insereCampoQuery ("EMPRESA",arraytitemempnav(0))	
			Call BD.insereCampoQuery ("NAVIO",arraytitemempnav(1))			
			Call BD.abreQuery("QRY_INSERIR_USUARIO_EMPRESA_NAVIO",0)			

		Next
		
		if InStr(BD.ERRO,"violada") > 0 then
			objJson("ERRO") = "Usuario %20j%C3%A1%20 cadastro para esta empresa e navio."
		else
			objJson("ERRO") = BD.ERRO				
		end if	

	end if	
	
	objJson.Flush  
	response.end
	
end if

if (funcao = "updusuario") then

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "%20N%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("id") = "") then
		objJson("ERRO") = "Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("matricula") = "") then
		objJson("ERRO") = "Matrícula %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("nome") = "") then
		objJson("ERRO") = "Nome %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("email") = "") then
		objJson("ERRO") = "Email %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("ativo") = "") then
		objJson("ERRO") = "Ativo %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (request("tipo") = "") then
		objJson("ERRO") = "Tipo %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	clientIP = Request.ServerVariables("HTTP_X_FORWARDED_FOR")

	If clientIP = "" Or clientIP = "unknown" Then
    	clientIP = Request.ServerVariables("REMOTE_ADDR")
	End If

	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.insereCampoQuery ("MATRICULA",request("matricula"))	
	Call BD.insereCampoQuery ("NOME",request("nome"))
    Call BD.insereCampoQuery ("EMAIL",request("email"))		
    Call BD.insereCampoQuery ("ATIVO",request("ativo"))	
    Call BD.insereCampoQuery ("TIPO",request("tipo"))	
	Call BD.insereCampoQuery ("EMPRESA",request("empresa"))	
	Call BD.insereCampoQuery ("NAVIO",request("navio"))	
	Call BD.insereCampoQuery ("IP",clientIP)	
    
	if (request("ativo") = "S") then
		Call BD.insereCampoQuery ("ID_LIBERACAO",Session("ID_LOGADO"))		
		Call BD.abreQuery("QRY_UPDATE_USUARIO_LIBERACAO",0)
	else
		Call BD.abreQuery("QRY_UPDATE_USUARIO",0)
	end if	

	if (BD.ERRO = "OK") then		
		
		' Apaga o projeto anterior definido para o usuário
		Call BD.fechaQuery
		Call BD.limpaCamposQuery		
		Call BD.insereCampoQuery ("ID_USUARIO",request("id"))	
		Call BD.abreQuery("QRY_DELETE_USUARIO_EMPRESA_NAVIO",0)

		if InStr(BD.ERRO,"violada") > 0 then
			objJson("ERRO") = "Usuario ja cadastro para esta empresa e navio."
			objJson.Flush  
			response.end
		end if	

		' Cadastra a empresa e o navio para o usuário 
		Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
		Call BD.abreQuery ("QRY_SEL_EMP_NAV_USU_TMP_POR_IDUSUARIO",1)
		
		numreg = BD.numRegs

		ReDim arrayempnavio(numreg-1)

		' Preencher o Dictionary os registros de empresa e navio		
		itemempnav = 0
		Do While (not BD.EOF)	
			arrayempnavio(itemempnav) = BD.valor("ID_EMPRESA") & ";" & BD.valor("ID_NAVIO")						
			itemempnav = itemempnav + 1
			BD.prox
		Loop

		For itemempnav = 0 To UBound(arrayempnavio)

			arraytitemempnav = Split(arrayempnavio(itemempnav),";")

			' Cadastra a empresa e o navio para o usuário criado
			Call BD.limpaCamposQuery
			Call BD.insereCampoQuery ("MATRICULA",request("matricula"))	
			Call BD.insereCampoQuery ("EMAIL",request("email"))		
			Call BD.insereCampoQuery ("EMPRESA",arraytitemempnav(0))	
			Call BD.insereCampoQuery ("NAVIO",arraytitemempnav(1))			
			Call BD.abreQuery("QRY_INSERIR_USUARIO_EMPRESA_NAVIO",0)			

		Next
				
		
		if InStr(BD.ERRO,"violada") > 0 then
			objJson("ERRO") = "Este usuario possui registros vinculados."
		else
			objJson("ERRO") = BD.ERRO				
		end if	
	end if	
	
	objJson.Flush  
	response.end
	
end if

if (funcao = "delusuario") then

	if (request("id") = "") then
		objJson("ERRO") = "Id %20j%C3%A1%20 informado" 			
		objJson.Flush  
		response.end
	end if

	if (Session("PERFIL") <> "A") then
		objJson("ERRO") = "Voc%C3%AA%20n%C3%A3o%20tem%20autoriza%C3%A7%C3%A3o%20para%20excluir%20este%20usu%C3%A1rio." 			
		objJson.Flush  
		response.end
	end if

	'Verifica se o usuário a ser excluído é um administrador
	Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.abreQuery("QRY_USUARIO_POR_ID",1)
	if BD.valor("TIPO") = "A" then
		objJson("ERRO") = "Voc%C3%AA%20n%C3%A3o%20pode%20excluir%20um%20usu%C3%A1rio%20administrador%20do%20sistema." 			
		objJson.Flush  
		response.end
	end if


	Call BD.insereCampoQuery ("ID_USUARIO",request("id"))	
	Call BD.abreQuery("QRY_DELETE_USUARIO_EMPRESA_NAVIO",0)

	if InStr(BD.ERRO,"violada") > 0 then
		objJson("ERRO") = "Este usuario possui registros associados."
	else
		if BD.ERRO = "OK" then
			Call BD.insereCampoQuery ("ID",request("id"))	
			Call BD.abreQuery("QRY_DELETE_USUARIO_POR_ID",0)

			objJson("ERRO") = BD.ERRO 
		else
			objJson("ERRO") = BD.ERRO
		end if	
	end if	
	
	objJson.Flush  
	response.end


end if


if (funcao = "inscards") then

	if (Session("PERFIL") <> "A") and (Session("PERFIL") <> "E") then
		objJson("ERRO") = "%20n%C3%A3o%20 Autorizado" 			
		objJson.Flush  
		response.end
	end if

	' Limpa aspas simples e duplas
	Dim descricaoLimpa
	descricaoLimpa = Replace(request("descricao"), """", "") ' Remove aspas duplas
	descricaoLimpa = Replace(descricaoLimpa, "'", "")        ' Remove aspas simples

	Call BD.insereCampoQuery ("TIPO_REQUISITANTE",request("tiporequisitante"))	
	Call BD.insereCampoQuery ("ID_CARDS_TIPO_ID",request("tipoid"))	
	Call BD.insereCampoQuery ("ID_CARDS_TIPO_DETALHE_ID",request("tipodetalheid"))		
    Call BD.insereCampoQuery ("ID_EMPRESA",request("empresa"))	
	Call BD.insereCampoQuery ("ID_NAVIO",request("navio"))	
    Call BD.insereCampoQuery ("NUMERO_CONTRATO",request("contrato"))	
    Call BD.insereCampoQuery ("NOME_REQUISITANTE",request("requisitante"))	
    Call BD.insereCampoQuery ("DESCRICAO", descricaoLimpa)
    Call BD.insereCampoQuery ("DATA_INICIO",request("datainicio"))	
    Call BD.insereCampoQuery ("DATA_TERMINO",request("datatermino"))	
    Call BD.insereCampoQuery ("QUANTIDADE",Replace(request("quantidade"),",","."))	
    Call BD.insereCampoQuery ("UNIDADE",request("unidade"))	
	Call BD.insereCampoQuery ("UNIDADE_OUTRO",request("unidadeoutro"))	
	Call BD.insereCampoQuery ("TIPO_OUTRO",request("tipodetalheoutro"))	
	Call BD.insereCampoQuery ("ID_USUARIO_SOLICITACAO",Session("ID_LOGADO"))	

	Call BD.abreQuery("QRY_INSERIR_CARDS",0)

	objJson("ERRO") = BD.ERRO				
	
	if BD.ERRO = "OK" then
		
		if request("tiporequisitante") = "A" then 'Se for A - Armador envia o email
			Call BD.abreQuery("QRY_SELECT_CARDS_POR_USUARIO",1)
			objJson("ID_CARDS") = BD.valor("ID_CARDS") 

			idcard = BD.valor("ID")
			'Envia Email Informando sobre assinatura		
			enviaEmailAssinaturaCards(idcard)
		end if	

	end if
	
	objJson.Flush  
	response.end
	
end if

if (funcao = "delcards") then

	if (Session("ID_EXCLUIR") <> request("id")) then
		objJson("ERRO") = "Exclus%C3%A3o%20n%C3%A3o%20autorizada"				
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("id"))		
	Call BD.abreQuery("QRY_DELETE_CARDS_POR_ID",0)

	objJson("ERRO") = BD.ERRO				
	objJson.Flush  
	response.end
	
end if

if (funcao = "insregistroacesso") then

	userIP =  Request.ServerVariables("REMOTE_ADDR")

	if ((request("matricula") = "") or (request("nome") = "") or (request("e") = "") or (request("s") = "")) then
		objJson("ERRO") = "Dados informados insuficientes"				
	elseif Not ((len(request("matricula")) >= 4) and (len(request("matricula")) <= 15)) then
		objJson("ERRO") = "Matricula %20inv%C3%A1lida"		
	else
		senhaMD5 = UCase(md5(request("s")))
		Call BD.insereCampoQuery ("MATRICULA",request("matricula"))	
		Call BD.insereCampoQuery ("NOME",request("nome"))		
    	Call BD.insereCampoQuery ("EMAIL",request("e"))	
		Call BD.insereCampoQuery ("SENHA",senhaMD5)	    
		Call BD.insereCampoQuery ("IP",userIP)	
		Call BD.abreQuery("QRY_INSERIR_ACESSO",0)

		if InStr(BD.ERRO,"UNIQUE_USUARIO_MATRICULA") > 0 then
			objJson("ERRO") = "E-mail %20j%C3%A1%20 cadastrado para esta Matricula"
		else
			objJson("ERRO") = BD.ERRO
		end if	
	end if

	objJson.Flush  
	response.end

end if	

if (funcao = "updsenha") then

	Dim info
	Dim senha
	Dim confirmarsenha

	'Decodifica a chave enviada
	info = fnEncBase64(request("key"))
	info = fnBase64Decode(info)
	
	info = split(info,";")

	'Se a informação da chave não vier como esperada, sai
	if ubound(info) <> 2 then 	
		objJson("ERRO") = "Chave%20inv%C3%A1lida"
		objJson.Flush  
		response.end
	end if

	if request("id") = "" then
		objJson("ERRO") = "Id%20n%C3%A3o%20informado"
		objJson.Flush  
		response.end
	end if

	'Se o id for diferente do informado sai
	if info(0) <> request("id") then
		objJson("ERRO") = "Id%20n%C3%A3o%20confere"
		objJson.Flush  
		response.end
	end if

	if request("s") = "" then
		objJson("ERRO") = "Senha%20n%C3%A3o%20informada"
		objJson.Flush  
		response.end
	end if

	if request("cs") = "" then
		objJson("ERRO") = "Confirma%C3%A7%C3%A3o%20de%20senha%20n%C3%A3o%20informada"
		objJson.Flush  
		response.end
	end if

	if request("s") <> request("cs") then
		objJson("ERRO") = "Senha%20n%C3%A3o%20confirmada"
		objJson.Flush  
		response.end
	end if

	if not verificaSenha(request("s")) then
		objJson("ERRO") = "A%20senha%20n%C3%A3o%20atende%20aos%20crit%C3%A9rios"
		objJson.Flush  
		response.end
	end if

	senha = DecodeUTF8(request("s"))
	confirmarsenha = DecodeUTF8(request("cf"))
	
	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID",request("id"))			    
	Call BD.abreQuery("QRY_USUARIO_POR_ID",1)

	if (BD.EOF and BD.BOF) then
		objJson("ERRO") = "Id%20n%C3%A3o%20cadastrado"
		objJson.Flush  
		response.end
	end if

	Call BD.fechaQuery
	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID",request("id"))			    
	Call BD.insereCampoQuery ("SENHA",UCase(md5(request("s"))))
	Call BD.abreQuery("QRY_ALTERAR_SENHA_POR_ID",0)

	objJson("ERRO") = BD.ERRO
	objJson.Flush  
	response.end

end if

if (funcao = "getsenha") then

	if (request("matricula") = "") then
		objJson("ERRO") = "Matr%C3%ADcula%20n%C3%A3o%20informada"		
		objJson.Flush  
		response.end	
	elseif Not ((len(request("matricula")) >= 4) and (len(request("matricula")) <= 15)) then
		objJson("ERRO") = "Matricula %20inv%C3%A1lida"		
		objJson.Flush  
		response.end		
	elseif (request("email") = "") then
		objJson("ERRO") = "E-mail%20n%C3%A3o%20informado"		
		objJson.Flush  
		response.end	
	end if

	Dim enviousenha
	enviousenha = enviaSenhaEmail (request("matricula"),request("email"))
	
	if enviousenha then		

		' Atualiza a flag para poder expirar o link
		Call BD.conecta
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("MATRICULA",request("matricula"))			
    	Call BD.insereCampoQuery ("EMAIL",request("email"))			
		Call BD.abreQuery("QRY_UPDATE_RECUPERAR_SENHA",0)
				
		objJson("ERRO") = BD.ERRO
	else
		objJson("ERRO") = "Matr%C3%ADcula%20ou%20e-mail%20n%C3%A3o%20conferem"		
	end if	
	
	objJson.Flush  
	response.end
	
end if 

if (funcao = "getusuario") then

	Dim qryusuario

	qryusuario = "SELECT	 " 
	qryusuario = qryusuario & " ROWNUM INDICE,U.ID,U.NOME,U.MATRICULA, U.TIPO,DECODE(U.TIPO,'A','ADMINISTRADOR','C','CONSULTA','S','ASSINANTE','E','EMITIR CARD','U','NAO DEFINIDO',U.TIPO) AS PERFIL, U.ATIVO, U.EMAIL  " 
	qryusuario = qryusuario & " FROM " 
	qryusuario = qryusuario & " GERCARDS.CARDS_USUARIO U " 
		
	if (request("empresa") <> "") or  (request("navio") <> "") or (request("matricula") <> "") then
		qryusuario = qryusuario & " WHERE "
	end if

	if (request("empresa") <> "")  then
		qryusuario = qryusuario & " U.ID IN (SELECT CUEN.ID_USUARIO FROM GERCARDS.CARDS_USUARIO_EMPRESA_NAVIO CUEN "
		qryusuario = qryusuario & " INNER JOIN GERCARDS.CARDS_EMPRESA_NAVIO CEN ON CUEN.ID_EMPRESA_NAVIO = CEN.ID"		
		qryusuario = qryusuario & " WHERE CEN.ID_EMPRESA = " & request("empresa") & ") AND "
	end if

	if (request("navio") <> "")  then		
		qryusuario = qryusuario & " U.ID IN (SELECT CUEN.ID_USUARIO FROM GERCARDS.CARDS_USUARIO_EMPRESA_NAVIO CUEN "
		qryusuario = qryusuario & " INNER JOIN GERCARDS.CARDS_EMPRESA_NAVIO CEN ON CUEN.ID_EMPRESA_NAVIO = CEN.ID "		
		qryusuario = qryusuario & " WHERE CEN.ID_NAVIO = " & request("navio") & ") AND "
	end if

	if (request("matricula") <> "")  then
		qryusuario = qryusuario & " MATRICULA = '" & request("matricula") & "' AND "
	end if

	qryusuario = RemoverUltimaPalavra(qryusuario,"AND")	

	call BD.AbreQueryDireto(qryusuario)
	
	
end if

if (funcao = "gettipoid") then		
	Call BD.abreQuery("QRY_NAVIO_TIPO_ID",1)

end if

if (funcao = "gettipodetalheidporid") then
	Call BD.insereCampoQuery ("ID_CARDS_TIPO_ID",request("id"))
	Call BD.abreQuery("QRY_TIPO_DETALHE_ID_POR_ID",1)
end if

if (funcao = "getunidade") then	
	call BD.abreQuery ("QRY_UNIDADE",1) 
end if	

if (funcao = "gettipoid") then
	Call BD.abreQuery("QRY_TIPO_ID",1)
end if

if (funcao = "getcontrato") then
	' Resgata ID_EMPRESA_NAVIO
	Call BD.limpaCamposQuery
	Call BD.insereCampoQuery ("ID_EMPRESA",request("empresa"))	
	Call BD.insereCampoQuery ("ID_NAVIO",request("navio"))	
	Call BD.abreQuery("QRY_ID_EMPRESA_NAVIO_POR_ID_NAVIO_EMPRESA",1)		
end if 

if (funcao = "getenvelope") then

	if (request("envelope") = "") then
		objJson("ERRO") = "Envelope%20n%C3%A3o%20informado"		
		objJson.Flush  
		response.end	
	end if

	'Dim tempoaguardar 
	tempoaguardar = getIntervaloEnvelope(request("envelope"))

	objJson("TEMPORESTANTE") = -1
	objJson("AUTORIZADO") = "S"
	objJson("ENVELOPE") = request("envelope")	
	objJson("TEMPORESTANTE") = tempoaguardar
		
	'if (Cdbl(tempoaguardar) >= 0.01) and (Cdbl(tempoaguardar) <= 20) then
	'	objJson("ERRO") = "Solicita%C3%A7%C3%A3o%20n%C3%A3o%20autorizada. Aguarde <b>" & (20 - Cdbl(tempoaguardar)) & "%20minutos%20</b>para%20realizar%20nova%20solicita%C3%A7%C3%A3o."		
	'	objJson("TEMPORESTANTE") = 20 - CDbl(tempoaguardar)		
	'	objJson("AUTORIZADO") = "N"
	'	objJson.Flush  
	'	response.end	
	'end if

	' Cria o objeto ServerXMLHTTP
	Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")

	' Faz a requisição POST para a URL especificada
	httpRequest.open "GET", urlEnvelope & "/" & request("envelope") , False

	' Define o tipo de conteúdo da requisição
	httpRequest.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"

	' Envia a requisição com o corpo contendo os parâmetros
	httpRequest.send params

	' Verifica se a requisição foi bem-sucedida (status 200)
	If httpRequest.status = 200 Then

		GravaLogEnvelope(request("envelope"))

		resultjson = httpRequest.responseText
		if (InStr(resultjson, "envelopeId") > 0) then
			objJson("ERRO") = "OK"
			objJson("ENVELOPE") = resultjson
		else
			objJson("ERRO") = "Problema de comunicação com o servidor de assinatura, tente novamente!"			
		end if
		
				
	Else	
		objJson("ERRO") = "Problema%20de%20comunica%C3%A7%C3%A3o%20com%20o%20servidor%20de%20assinatura%2C%20tente%20novamente%21"				
	End If

	objJson.Flush  
	response.end	

end if

if (funcao ="assinarcards") then
	
	Dim params

	params = 	"id=" & request("id") & _
				"&idcard=" & request("idcard") & _
				"&empresa=" & request("empresa") & _
				"&navio=" & request("navio") & _
				"&requisitante=" & request("requisitante") & _
				"&contrato=" & request("contrato") & _
				"&quantidade=" & request("quantidade") & _
				"&unidade=" & request("unidade") & _
				"&descricao=" & request("descricao") & _
				"&datainicio=" & request("datainicio") & _
				"&datatermino=" & request("datatermino") & _
				"&nomeassinante=" & request("nomeassinante") & _
				"&emailassinante=" & request("emailassinante")

	' Cria o objeto ServerXMLHTTP
	Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")

	' Faz a requisição POST para a URL especificada
	httpRequest.open "POST", urlassinador, False

	' Define o tipo de conteúdo da requisição
	httpRequest.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"

	' Envia a requisição com o corpo contendo os parâmetros
	httpRequest.send params

	' Verifica se a requisição foi bem-sucedida (status 200)
	If httpRequest.status = 200 Then

		Dim resultjson 
		resultjson = httpRequest.responseText
		if (InStr(resultjson, "url") > 0) then
			objJson("ERRO") = "OK"
			objJson("URL") = resultjson
		else
			objJson("ERRO") = "Problema de comunicação com o servidor de assinatura, tente novamente!"			
		end if
		
				
	Else	
		objJson("ERRO") = "Problema%20de%20comunica%C3%A7%C3%A3o%20com%20o%20servidor%20de%20assinatura%2C%20tente%20novamente%21"				
	End If

	objJson.Flush  
	response.end


end if


if (funcao = "delempnaviousuariotmp") then
	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20N%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
	Call BD.abreQuery("QRY_DEL_EMP_NAV_USU_TMP",0)

	objJson("ERRO") = BD.ERRO
	objJson.Flush  
	response.end

end if

if (funcao = "insempnaviousuariotmp") then
	
	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20N%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("empresa") = "") then
		objJson("ERRO") = "Empresa %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("navio") = "") then
		objJson("ERRO") = "Navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
	Call BD.insereCampoQuery ("ID_EMPRESA",request("empresa"))	
	Call BD.insereCampoQuery ("ID_NAVIO",request("navio"))	    
	Call BD.abreQuery("QRY_INSERT_EMP_NAV_USU_TMP",0)

	if (InStr(BD.ERRO,"restri") > 0) or (InStr(BD.ERRO,"exclu") > 0) then
		objJson("ERRO") = "Empresa e Navio ja adicionados" 			
		objJson.Flush  
		response.end
	End if

	if (BD.ERRO = "OK") then

		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
		Call BD.abreQuery("QRY_SEL_EMP_NAV_USU_TMP_POR_IDUSUARIO",1)

		empnaviousu = ""

		Do While (not BD.EOF)
			empnaviousu = empnaviousu & "<tr>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_EMPRESA") & "</td>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_NAVIO") & "</td>"
			empnaviousu = empnaviousu & "<td>"
			empnaviousu = empnaviousu & "<div>"																			
			empnaviousu = empnaviousu & "<a href='#' onclick=removerempnav('"  & BD.valor("ID") & "') title='Remover' class='btn btn-danger shadow btn-xs sharp'><i class='fa fa-trash'></i> </a>"
			empnaviousu = empnaviousu & "</div>"
			empnaviousu = empnaviousu & "</td>"
			empnaviousu = empnaviousu & "</tr>"
			BD.prox
		Loop

		objJson("ERRO") = BD.ERRO
		objJson("TABELA") = empnaviousu
		objJson.Flush  
		response.end

	end if
	
	objJson("ERRO") = BD.ERRO				
	objJson.Flush  
	response.end


end if

if (funcao = "insempnaviousuarioalterartmp") then
	
	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20N%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("empresa") = "") then
		objJson("ERRO") = "Empresa %20n%C3%A3o%20 informada" 			
		objJson.Flush  
		response.end
	end if

	if (request("navio") = "") then
		objJson("ERRO") = "Navio %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
	Call BD.insereCampoQuery ("ID_EMPRESA",request("empresa"))	
	Call BD.insereCampoQuery ("ID_NAVIO",request("navio"))	    
	Call BD.abreQuery("QRY_INSERT_EMP_NAV_USU_TMP",0)

	if (InStr(BD.ERRO,"restri") > 0) or (InStr(BD.ERRO,"exclu") > 0) then
		objJson("ERRO") = "Empresa e Navio ja adicionados" 			
		objJson.Flush  
		response.end
	End if

	if (BD.ERRO = "OK") then

		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
		Call BD.abreQuery("QRY_SEL_EMP_NAV_USU_TMP_POR_IDUSUARIO",1)

		empnaviousu = ""

		Do While (not BD.EOF)
			empnaviousu = empnaviousu & "<tr>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_EMPRESA") & "</td>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_NAVIO") & "</td>"
			empnaviousu = empnaviousu & "<td>"
			empnaviousu = empnaviousu & "<div>"																			
			empnaviousu = empnaviousu & "<a href='#' onclick=removerempnavalterar('"  & BD.valor("ID") & "') title='Remover' class='btn btn-danger shadow btn-xs sharp'><i class='fa fa-trash'></i> </a>"
			empnaviousu = empnaviousu & "</div>"
			empnaviousu = empnaviousu & "</td>"
			empnaviousu = empnaviousu & "</tr>"
			BD.prox
		Loop

		objJson("ERRO") = BD.ERRO
		objJson("TABELA") = empnaviousu
		objJson.Flush  
		response.end

	end if
	
	objJson("ERRO") = BD.ERRO				
	objJson.Flush  
	response.end


end if


if (funcao = "delempnaviousuariotmpalterarporid") then
	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20N%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("id") = "") then
		objJson("ERRO") = "Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("ID"))		
	Call BD.abreQuery("QRY_DELETE_EMP_NAV_USU_TMP_POR_ID",0)

	if BD.ERRO = "OK" then

		empnaviousu = ""
	
		Call BD.fechaQuery
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
		Call BD.abreQuery("QRY_SEL_EMP_NAV_USU_TMP_POR_IDUSUARIO",1)

		Do While (not BD.EOF)
			empnaviousu = empnaviousu & "<tr>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_EMPRESA") & "</td>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_NAVIO") & "</td>"
			empnaviousu = empnaviousu & "<td>"
			empnaviousu = empnaviousu & "<div>"																			
			empnaviousu = empnaviousu & "<a href='#' onclick=removerempnavalterar('"  & BD.valor("ID") & "') title='Remover' class='btn btn-danger shadow btn-xs sharp'><i class='fa fa-trash'></i> </a>"
			empnaviousu = empnaviousu & "</div>"
			empnaviousu = empnaviousu & "</td>"
			empnaviousu = empnaviousu & "</tr>"
			BD.prox
		Loop

		objJson("ERRO") = BD.ERRO
		objJson("TABELA") = empnaviousu
		objJson.Flush  
		response.end


	else
		objJson("ERRO") = BD.ERRO				
		objJson.Flush  
		response.end
	end if	



end if


if (funcao = "delempnaviousuariotmpporid") then
	if (Session("PERFIL") <> "A")then
		objJson("ERRO") = "%20N%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (request("id") = "") then
		objJson("ERRO") = "Id %20n%C3%A3o%20 informado" 			
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",request("ID"))		
	Call BD.abreQuery("QRY_DELETE_EMP_NAV_USU_TMP_POR_ID",0)

	if BD.ERRO = "OK" then

		empnaviousu = ""
	
		Call BD.fechaQuery
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("ID_USUARIO_LOGADO",Session("ID_LOGADO"))	
		Call BD.abreQuery("QRY_SEL_EMP_NAV_USU_TMP_POR_IDUSUARIO",1)

		Do While (not BD.EOF)
			empnaviousu = empnaviousu & "<tr>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_EMPRESA") & "</td>"
			empnaviousu = empnaviousu & "<td>" & BD.valor("NOME_NAVIO") & "</td>"
			empnaviousu = empnaviousu & "<td>"
			empnaviousu = empnaviousu & "<div>"																			
			empnaviousu = empnaviousu & "<a href='#' onclick=removerempnav('"  & BD.valor("ID") & "') title='Remover' class='btn btn-danger shadow btn-xs sharp'><i class='fa fa-trash'></i> </a>"
			empnaviousu = empnaviousu & "</div>"
			empnaviousu = empnaviousu & "</td>"
			empnaviousu = empnaviousu & "</tr>"
			BD.prox
		Loop

		objJson("ERRO") = BD.ERRO
		objJson("TABELA") = empnaviousu
		objJson.Flush  
		response.end


	else
		objJson("ERRO") = BD.ERRO				
		objJson.Flush  
		response.end
	end if	



end if

if (funcao = "updcards") then

	if (Session("PERFIL") <> "A") and (Session("PERFIL") <> "E") then
		objJson("ERRO") = "%20N%C3%A3o%20 autorizado" 			
		objJson.Flush  
		response.end
	end if

	if (CStr(request("id")) <> CStr(session("CARD").item("ID"))) then
		objJson("ERRO") = "O Id informado %20j%C3%A1%20 confere com o selecionado."
		objJson.Flush  
		response.end
	end if

	Call BD.insereCampoQuery ("ID",session("CARD").item("ID"))	
	Call BD.insereCampoQuery ("ID_CARDS_TIPO_ID",request("tipoid"))	
	Call BD.insereCampoQuery ("ID_CARDS_TIPO_DETALHE_ID",request("tipodetalheid"))		
    Call BD.insereCampoQuery ("ID_EMPRESA",request("empresa"))	
	Call BD.insereCampoQuery ("ID_NAVIO",request("navio"))	
    Call BD.insereCampoQuery ("NUMERO_CONTRATO",request("contrato"))	
    Call BD.insereCampoQuery ("NOME_REQUISITANTE",request("requisitante"))	
    Call BD.insereCampoQuery ("DESCRICAO",request("descricao"))
    Call BD.insereCampoQuery ("DATA_INICIO",request("datainicio"))	
    Call BD.insereCampoQuery ("DATA_TERMINO",request("datatermino"))	
    Call BD.insereCampoQuery ("QUANTIDADE",Replace(request("quantidade"),",","."))	
    Call BD.insereCampoQuery ("UNIDADE",request("unidade"))	
	Call BD.insereCampoQuery ("UNIDADE_OUTRO",request("unidadeoutro"))	
	Call BD.insereCampoQuery ("TIPO_OUTRO",request("tipodetalheoutro"))	
	Call BD.insereCampoQuery ("TIPO_REQUISITANTE",request("tiporequisitante"))	

	Call BD.abreQuery("QRY_UPDATE_CARDS",0)
	
	objJson("ERRO") = BD.ERRO				
	
	if BD.ERRO = "OK" then
		Call BD.limpaCamposQuery
		Call BD.insereCampoQuery ("ID",session("CARD").item("ID"))	
		Call BD.abreQuery("QRY_SELECT_CARDS_POR_ID",1)			
		objJson("ID_CARDS") = BD.valor("ID_CARDS") 
	end if
	
	objJson.Flush  
	response.end
	
end if

Registros = CleanString(BD.GetJsonFromRs("REGISTROS"))
'Registros = Replace(Registros,vbCrLf, " ")
'Registros = Replace(Registros,vbCr, " ")
'Registros = Replace(Registros, vbLf, " ")

response.write Registros

' Verifica se houve erro 
If (Err.Number <> 0) then	

	Dim json, errorObj
	Set json = Server.CreateObject("Scripting.Dictionary")
	json.Add "success", False ' indicate that the operation was not successful

	' get the error information and add it to the JSON object
	Set errorObj = Server.GetLastError()
	json.Add "error", erro'errorObj.Description

	' output the JSON object as a response	
	Response.write Jsoon.json

End If

 

 %>
