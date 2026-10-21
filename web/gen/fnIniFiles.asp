<!--#include file='fnGerais.asp'--> 
<%
'	EXEMPLO DE USO
'
'	Dim iniFile,s,sCaminho
'	sCaminho = fnGetFilePath (Server.MapPath("teste.ini"))
'	Set iniFile = new TIniFile
'	If iniFile.Create (sCaminho & "teste.ini") Then
'		s = iniFile.ReadValue ("secao 1","chave 1","xxx")
'		Call iniFile.writeValue ("secao 1","chave 1",s & "*")
'	End If
'	Set iniFile = nothing


	Class TIniFile

		Private sNomeArqTemp	'Nome do arquivo temporário (usado em writevalue)
		Private sNomeArquivo	'Nome do arquivo
		Private sLinhas			'Armazena as linhas em um array
		public secoes			'Dicionário com as seções e a linha inicial de cada uma


		Public Function Create (nomeArquivo)
			Dim FSO		'Objeto local de manipulação de arquivos
			Dim Arq		'Arquivo a ser aberto
			Dim i, s

			Set FSO = CreateObject("Scripting.FileSystemObject")

			'Inicializa a propriedade e o valor de retorno
			sNomeArquivo = ""
			sNomeArqTemp = fnGetFilePath(nomeArquivo) & "@@@arqTemp.tmp"
			Create = false

			'Verifica se o arquivo existe e seta as propriedades
			If FSO.FileExists (nomeArquivo) Then
				sNomeArquivo = nomeArquivo
				Create = True

				'Obtém todas as linhas
				Set Arq = FSO.OpenTextFile (sNomeArquivo,1,false)
				sLinhas = Split (Arq.ReadAll,vbCrLf)
				Arq.Close

				'Dicionário com todas as seções no array de linhas
				Set secoes = CreateObject("Scripting.Dictionary")

				For i = 0 To UBound (sLinhas)
					s = Trim (sLinhas(i))

					'Insere um item no dicionário (seção, linha inicial)
					If Left(s,1) = "[" And Right(s,1) = "]" Then
						secoes.add UCase(Mid(s,2,Len(s)-2)), i
					End If
				Next

			End If
		End Function


		Public Function ReadValue (section, ident, default)
			Dim s, i, fl

			'Inicializa o valor de retorno
			ReadValue = default

			'Verifica a prévia 'criação' do objeto e a existência do arquivo
			If sNomeArquivo = "" Then Exit Function

			'Verifica se a seção existe no dicionário
			If Not secoes.exists(UCase(section)) Then Exit Function

			'Busca a ocorrência no array de linhas de texto
			fl = false
			For i = secoes.item(UCase(section)) To UBound (sLinhas)
				If UCase(sLinhas(i)) = "[" & UCase(section) & "]" Then
					fl = True

				ElseIf Left(sLinhas(i),1) = "[" And fl = True Then
					Exit For

				ElseIf fl Then
					s = Trim(sLinhas(i))
					If Left (s,1) = "[" Then Exit For

					If Left(s,1) <> ";" And InStr(s,"=") > 1 Then
						If Trim(UCase (ident)) = Trim (UCase(Left(s,InStr(s,"=")-1))) Then
							ReadValue = Mid(s,InStr(s,"=")+1,Len(s))
							Exit For
						End If
					End If
				End If
			Next

		End Function


		Public Sub WriteValue (section, ident, value)
			Dim FSO         'Objeto local de manipulação de arquivos
			Dim Arq1,Arq2   'Arquivos a serem abertos (leitura e escrita)
			Dim s,stSecao,f 'Variáveis de uso geral

			Set FSO = CreateObject("Scripting.FileSystemObject")

			'Inicializa variáveis
			stSecao = ""
			f = false

			'Verifica a prévia 'criação' do objeto e a existência do arquivo
			If sNomeArquivo = "" Then Exit Sub

			'Abre um arquivo para leitura e outro para escrita
			Set Arq1 = FSO.OpenTextFile (sNomeArquivo,1,false)
			Set Arq2 = FSO.OpenTextFile (sNomeArqTemp,2,true)

			'Percorre o arquivo lido até o seu final
			Do While Not Arq1.AtEndOfStream
				s = Trim(Arq1.ReadLine)

				'Verifica se encontrou uma seção
				If Left(s,1) = "[" Then
					'Em caso afirmativo, verifica se a seção anterior é a desejada...
					If UCase(stSecao) = UCase(section) Then 
						'...e se o valor não já foi gravado
						If Not f Then 
							Arq2.WriteLine(ident & "=" & value)
							f = True
						End If
					End If
					'Atualiza o nome da seção atual
					stSecao = Mid (s,2,Len(s)-2)

				'Se não encontrou uma seção, verifica se a seção atual é a desejada
				'e se o valor foi encontrado
				Else
					If UCase(stSecao) = UCase(section) And s <> "" And Left (s,1) <> ";" And InStr(s,"=")>1 And Not f Then
						If UCase(Trim(Left(s,InStr(s,"=")-1))) = UCase(ident) Then
							s = ident & "=" & value
							f = true
						End If
					End If
			
				End If
				'Escreve a linha, de qualquer forma, no arquivo de saída
				Arq2.writeLine (s)
			Loop

			'Fecha os arquivos
			Arq1.close
			Arq2.close

			'Organiza os nomes
			FSO.DeleteFile(sNomeArquivo)
			FSO.MoveFile sNomeArqTemp,sNomeArquivo

			'Recarrega os dados atualizados
			create(sNomeArquivo)


			Set FSO = Nothing

		End Sub

		Public Function keys

			If sNomeArquivo = "" Then Exit Function
			keys = join(secoes.keys,",")

		End Function

	End Class
%>