<%
	Class TConRem

		Public  EndRemoto		'Endereço do script no servidor remoto (motivo-IS)
		Public  Conectado		'Informa se o servidor está online e conectado
		Public  Erro			'Mensagem de erro
		Public  CompConn		'Nome do componente usado na conexão
		Public  Timeout			'Timeout definido na conexão
		Public  Tempo			'Tempo utilizando na conexão e transferência dos dados

		Public Sub Conecta (stCompSel,TOut)
			Dim HttpObjSel
			Dim iniFile
			Dim i, ip, ipLocal

			Conectado = 0
			EndRemoto = ""
			TimeOut = 0
			Tempo = -1

			ipLocal = request.servervariables ("LOCAL_ADDR")

			Set iniFile = new TIniFile
			If iniFile.Create (Session ("stCamIni")) Then

				i = 1

				Do 
					ip = iniFile.ReadValue ("DATABASE","ip" & i,"")

					If ip = iplocal Then
						EndRemoto   = iniFile.ReadValue ("DATABASE","stRemoto" & i,"")
					End If
					i = i + 1
				Loop Until ip = "" Or ip = ipLocal

				If ipLocal <> ip Then
					Erro = "NÃO FOI ENCONTRADA CORRESPONDÊNCIA DE IP NO ARQUIVO INI!<br>IP:" & ipLocal
					Exit Sub
				End if
			Else
				Erro = "NÃO FOI POSSÍVEL ENCONTRAR O ARQUIVO INI!"
				Exit Sub
			End If
			Set iniFile = Nothing

			Erro = msgOk
			TimeOut = TOut

			'Tenta usar o componente AspHTTP
			If fnTestaObjeto ("AspHTTP.Conn") And (stCompSel = "" Or stCompSel = "AspHTTP.Conn") Then
				compConn = "AspHTTP.Conn"
				'Prepara o objeto AspHTTP
				Set HttpObjSel = Server.CreateObject("AspHTTP.Conn")
				HTTPObjSel.TimeOut = TimeOut
				HTTPObjSel.Url = EndRemoto & "teste_online.txt"
				HTTPObjSel.RequestMethod = "GET"
				'Executa o objeto e verifica o resultado
				If Left(HTTPObjSel.GetURL,6)="ONLINE" Then Conectado = 1
				'Limpa o objeto
				Set HttpObjSel = Nothing

			'Tenta usar o componente Dynu
			'Obs: Este componente não está funcionando para chamadas em loopback
			'por isso, está bloqueado (___) em tempo de desenvolvimento
			ElseIf fnTestaObjeto ("Dynu.HTTP___") And (stCompSel = "" Or stCompSel = "Dynu.HTTP") Then
				compConn = "Dynu.HTTP"
				'Prepara o objeto Dynu
				Set HttpObjSel = Server.CreateObject("Dynu.HTTP")
				HttpObjSel.SetTimeOut(TimeOut)
				HttpObjSel.Reset
				HttpObjSel.SetHeader "user-agent","DynuHTTP"
				'Executa o objeto e verifica o resultado
				HttpObjSel.SetUrl(EndRemoto & "teste_online.txt")
				If Left(HttpObjSel.GetUrl,6) = "ONLINE" Then Conectado = 1
				'Limpa o objeto
				Set HttpObjSel = Nothing

			'Usa o componente nativo do IIS XMLHTTP
			'Obs: XMLHTTP não está utilizando o timeout!
			Else
				compConn = "Microsoft.XMLHTTP"
				'Prepara o objeto XMLHTTP
				Set HttpObjSel = server.CreateObject("Microsoft.XMLHTTP")
				HttpObjSel.open "GET",EndRemoto & "teste_online.txt",false
				HttpObjSel.setrequestheader "ContentType","text/plain"
				'Executa o objeto e verifica o resultado
				On Error Resume Next
				server.scripttimeout = TimeOut
				HttpObjSel.send()
				If Err.number = 0 then
					If Left(HttpObjSel.responseText,6) ="ONLINE" Then Conectado = 1
				Else
					Erro = Err.Description
					Conectado = 0
				End If
				'Limpa o objeto
				Set httpObjSel = Nothing
			End If

			If Conectado = 0 Then Erro = "NÃO FOI POSSÍVEL CONECTAR AO SERVIDOR REMOTO!"
		End Sub


		Function InfoRem (stPagina, stParams)
			Dim Url
			Dim HttpObjSel


			InfoRem = ""
			If Conectado = 0 Then 
				Erro = "O SERVIDOR REMOTO NÃO ESTÁ CONECTADO!"
				Exit Function
			End If

			Url = EndRemoto & "request.asp?p=" & fnBase64Encode(stPagina) & "&q=" & fnBase64Encode(stParams)
			Erro = msgOk

			'Tenta usar o componente AspHTTP
			If compConn = "AspHTTP.Conn" Then
				'Prepara o objeto AspHTTP
				Set HttpObjSel = Server.CreateObject("AspHTTP.Conn")
				HTTPObjSel.TimeOut = TimeOut
				HTTPObjSel.Url = Url
				HTTPObjSel.RequestMethod = "GET"
				'Executa o objeto e devolve o resultado
				Tempo = CDbl(Time)
				InfoRem = fnUrlDecode(HTTPObjSel.GetURL)
				Tempo = CDbl(Time) - CDbl(Tempo)
				'Limpa o objeto
				Set HttpObjSel = Nothing

			'Tenta usar o componente Dynu
			'Obs: Este componente não está funcionando para chamadas em loopback
			'por isso, está bloqueado (___) em tempo de desenvolvimento
			ElseIf CompConn = "Dynu.HTTP" Then
				'Prepara o objeto Dynu
				Set HttpObjSel = Server.CreateObject("Dynu.HTTP")
				HttpObjSel.SetTimeOut(TimeOut)
				HttpObjSel.Reset
				HttpObjSel.SetHeader "user-agent","DynuHTTP"
				'Executa o objeto e devolve o resultado
				HttpObjSel.SetUrl(Url)
				tempo = CDbl(Time)
				InfoRem = fnUrlDecode(HttpObjSel.GetUrl)
				Tempo = CDbl(Time) - CDbl(Tempo)
				'Limpa o objeto
				Set HttpObjSel = Nothing

			'Usa o componente nativo do IIS XMLHTTP
			'Obs: XMLHTTP não está utilizando o timeout!
			Else
				'Prepara o objeto XMLHTTP
				Set HttpObjSel = server.CreateObject("Microsoft.XMLHTTP")
				HttpObjSel.open "GET",Url,false
				HttpObjSel.setrequestheader "ContentType","text/plain"
				'Executa o objeto e verifica o resultado
				'On Error Resume Next
				server.scripttimeout = TimeOut
				Tempo = CDbl(Time)
				HttpObjSel.send()
				If Err.number = 0 then
					InfoRem = fnUrlDecode(HttpObjSel.responseText)
				Else
					Erro = Err.Description
					InfoRem = erro
				End If
				Tempo = CDbl(Time) - CDbl(Tempo)
				'Limpa o objeto
				Set httpObjSel = Nothing
			End If

		End Function

	End Class
%>