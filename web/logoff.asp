<%
    session("LOGADO") = false
	Session("ID_LOGADO") = ""    
    Session("NOME_LOGADO") = ""    
    response.redirect "Login.asp"
%>