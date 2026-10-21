
<!--#include file="js/jquery/json/JSON_2.0.4.asp"-->
<!--#include file="gen\fnGerais.asp"--> 

<%

If Session("initiated") <> True Then
	Session.Contents.RemoveAll
	Session("initiated") = True
End If
 
response.clear
response.Charset="ISO-8859-1"
response.ContentType = "application/json"

Response.AddHeader "Access-Control-Allow-Origin", "*" 

On Error Resume Next
 
Dim funcao, id,password
Dim url, httpRequest, responseText

Dim objJson
Set objJson = jsObject()


funcao = request("funcao")
 
If funcao = "getlogin" then
	
	id = request("id")
    password = request("q")

	' URL Login
	url = "http://cliente.easbr.com:8080/apimonitoramento/easbr.asp?funcao=getlogin&id=" & id & "&q=" & MD5(password)
	'url = "http://localhost:81/apieasbr/easbr.asp?funcao=getlogin&id=" & id & "&q=" & MD5(password)

	' Cria o objeto ServerXMLHTTP
	Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")
	
	' Faz a requisição GET para a página2.asp
	httpRequest.open "GET", url, False
	httpRequest.send

	Session("idlogin") = id
	Session("Login") =  request("login")
	
	' Verifica se a requisição foi bem-sucedida (status 200)
	If httpRequest.status = 200 Then
		
		logado = httpRequest.responseText

		If logado = "True" then
			Session("Token") = GenerateToken()			
			Session("logado") = True		
			objJson("LOGADO") = True

			' Pega o nome do navio
			' URL Nome do navio
			url = "http://cliente.easbr.com:8080/apimonitoramento/easbr.asp?funcao=getnomenavio&id=" & Session("idlogin")
			'url = "http://localhost:81/apieasbr/easbr.asp?funcao=getnomenavio&id=" & id

			' Cria o objeto ServerXMLHTTP
			Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")
		
			' Faz a requisição GET para a página2.asp
			httpRequest.open "GET", url, False
			httpRequest.send

			Session("idlogin") = id
			Session("nomenavio") = ""
			
			' Verifica se a requisição foi bem-sucedida (status 200)
			If httpRequest.status = 200 Then
				nomenavio = httpRequest.responseText
				Session("nomenavio") = nomenavio		 
			End if
			
			
			' Pega o nome da empresa
			' URL Nome da empresa
			url = "http://cliente.easbr.com:8080/apimonitoramento/easbr.asp?funcao=getempresa&id=" & Session("idlogin")
			'url = "http://localhost:81/apieasbr/easbr.asp?funcao=getnomenavio&id=" & id

			' Cria o objeto ServerXMLHTTP
			Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")
		
			' Faz a requisição GET para a página2.asp
			httpRequest.open "GET", url, False
			httpRequest.send
			
			' Verifica se a requisição foi bem-sucedida (status 200)
			If httpRequest.status = 200 Then
				empresa = httpRequest.responseText
				Session("empresa") = empresa		 
			End if

		Else
			Session("logado") = False
			objJson("LOGADO") = False
		End if	
		
	Else
		Session("logado") = False		
		objJson("LOGADO") = False	
	End if

	objJson.Flush

ElseIf funcao = "getnomenavio" then
 
 	id = request.querystring("id")
 	
 	' URL Nome 
	'url = "http://cliente.easbr.com:8080/apimonitoramento/easbr.asp?funcao=getnomenavio&id=" & id 
 	url = "http://localhost:81/apieasbr/easbr.asp?funcao=getnomenavio&id=" & id

 	' Cria o objeto ServerXMLHTTP
 	Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")
 
 	' Faz a requisição GET para a página2.asp
 	httpRequest.open "GET", url, False
 	httpRequest.send

 	Session("idlogin") = id
	Session("nomenavio") = ""
 	 
 	' Verifica se a requisição foi bem-sucedida (status 200)
 	If httpRequest.status = 200 Then
		nomenavio = httpRequest.responseText
		Session("nomenavio") = nomenavio		 
	End if
 
 	objJson.Flush

End If

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