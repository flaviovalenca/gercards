<%@ Language=VBScript %>
<% Option Explicit %>
<%
Dim path
path = LCase(Request.ServerVariables("PATH_INFO"))

Select Case path
    Case "/gercards/router.asp"
        Dim query
        query = LCase(Request.QueryString)

        If InStr(query, "cadastrarcards") > 0 Then
            Server.Execute("/gercards/cadastrarcards.asp")
        ElseIf InStr(query, "mantercards") > 0 Then
            Server.Execute("/gercards/mantercards.asp")        
        Else
                Server.Execute("/gercards/mantercards.asp")        
            'Response.Status = "404 Not Found"
        End If
    Case Else
        'Response.Status = "404 Not Found"
        Server.Execute("/gercards/mantercards.asp") 
End Select
%>
