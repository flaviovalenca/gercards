<%

response.clear
 response.Charset="utf-8"
 response.ContentType = "text/plain;"
 
 

Dim httpRequest
					
					' Cria o objeto ServerXMLHTTP
					Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")
	
					' Faz a requisiчуo GET para a pсgina2.asp
					httpRequest.open "GET", "http://localhost/apimonitoramento/painel.asp", False
					httpRequest.send
		
					response.write "teste" & httpRequest.responseText
	%>