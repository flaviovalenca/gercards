<%

	'Inclui arquivos com o código-fonte
%>
	<!--#include file='fnBD_TBD.asp'--> 
	<!--#include file='fnBD_TDialogo.asp'--> 
	<!--#include file='fnBD_TConRem.asp'--> 
<%
	'Instancia as classes
	Dim BD
	Set BD = new TBD

	Dim Dialogo
	Set Dialogo = new TDialogo

	Dim ConRem
	Set ConRem = new TConRem
%>