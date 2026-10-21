<%
	Class TBD

		Private db				'Objeto Connection
		Private Cursor			'Cursor pra se movimentar

		Private stServer		'Endere�o do servidor
		Private stDataBase		'Nome da base de dados
		Private stUid			'Login
		Private stPwd			'Senha
		Private stConnStr		'String de conex�o com tags com nome das vari�veis
		Private stTipoConn		'Tipo de banco de dados

		Private stQryCampo()	'Campos a serem substitu�dos na query
		Private stQryValor()	'Valor destes campos
		Private numCamposQuery	'N�mero de campos

		Private stTabCampo()	'Nome do campo a compor a tabelaÙ
		Private stTabLabel()	'Label para o t�tulo da coluna
		Private stTabFmt()		'largura da coluna;estilo da c�lula
		Private numCamposTab	'N�mero de colunas da tabela

		Private stTabIndice()	'Campo �ndice da tabela (usada para links)
		Private numIndicesTab	'N�mero de �ndices da tabela (usada para links)

		Private stTransQueries()'Queries a ser executadas numa transa��o
		Private transNumQueries	'N�mero de queries em uma transa��o
		Private flagTransacao	'Indica se h� uma transa��o aberta
		Private transQueryAtual	'Armazena a query sendo executada

		Private stQryTransCampo()	'Campos a serem substitu�dos numa �nica query de uma transa��o
		Private stQryTransValor()	'Valor destes campos
		Private stQryTransSeq()		'Sequ�ncia da query onde este campo ser� v�lido
		Private numCamposQueryTrans	'N�mero de campos de transa��o


		Public  numCampos		'N�mero de campos da consulta
		Public  NomeCampo()		'Nome dos campos da consulta
		Public  numRegs			'N�mero de registros

		Public  Erro			'Mensagem de erro
		Public  Query			'Query final executada
		Public  EOF, BOF		'Indicadores de in�cio e fim de recordset



		'Conecta o banco com informa��es passadas por par�metro
		Public Sub ConectaDireto (servidor, banco, login, senha, tipoCon)

			Dim iniFile, j, s

			set db = server.createobject("ADODB.Connection")
			db.CursorLocation = 3'adUseClient

			stServer   = servidor
			stDataBase = banco
			stUid      = login
			stPwd      = senha
			stTipoConn = tipoCon
			
			Set Cursor = Nothing
			Erro = msgOk
			Query = ""
			flagTransacao = false
			EOF = True
			numCamposQuery = 0
			numCamposQueryTrans =0 
			transNumQueries = 0
			numCamposTab = 0
			numRegs = 0
			numCampos = 0

			Set iniFile = new TIniFile
			If iniFile.Create (Session ("stCamIni")) Then

				j = 1
				stConnStr = ""
				Do 
					s = UCase(iniFile.ReadValue ("TIPOCONN","TipoConn" & j,""))
					If s = UCase(stTipoConn) Then
						stConnStr = iniFile.ReadValue ("TIPOCONN","StrConn" & j,"")
					End If 
					j = j + 1
				Loop Until stConnStr <> "" Or s = ""

				'Se n�o encontrou uma string para o tipo de conex�o, retorna o erro
				If stConnStr = "" Then
					Erro = "ERRO! TIPO DE CONEX�O N�O ENCONTRADO!"
					Exit sub
				End If

				'Se for arquivo ACCESS, verifica se o arquivo foi encontrado
				If stTipoConn = "MSACCESS" Then
					If Not FSO.FileExists (stDatabase) Then
						If Not FSO.FileExists (Session ("stCamDados") & "mdb\" & stDataBase) Then
							Erro = "ERRO! ARQUIVO MDB N�O ENCONTRADO!"
							Exit Sub
						Else
							stDataBase = Session ("stCamDados") & "mdb\" & stDataBase
						End If
					End If
				End If

				'Substitui os poss�veis par�metros
				stConnStr  = Replace (stConnStr, "#STSERVER#",stServer)
				stConnStr  = Replace (stConnStr, "#STDATABASE#",stDatabase)
				stConnStr  = Replace (stConnStr, "#STUID#",stUid)
				stConnStr  = Replace (stConnStr, "#STPWD#",stPwd)
				
				stconnStr  = Replace (stconnStr,"dbjpe01","200.238.99.102:2115/dbjpe01")
				stconnStr  = Replace (stconnStr,"prod","200.238.99.102:2115/prod")
		
				'Abre o banco
				db.Open stconnStr

			Else
				Erro = "N�O FOI POSS�VEL ENCONTRAR O ARQUIVO INI!"
			End If
			Set iniFile = nothing
		End Sub

		'Conecta o banco com informa��es obtidas atrav�s do arquivo INI
		Public Sub Conecta

						
			set db = server.createobject("ADODB.Connection")
			db.CursorLocation = 3'adUseClient

			Set Cursor = Nothing
			Erro = msgOk
			Query = ""
			flagTransacao = false
			EOF = True
			numCamposQuery = 0
			numCamposQueryTrans =0 
			numCamposTab = 0
			numRegs = 0
			numCampos = 0


			'verifica se esta com algum erro na conexao do banco
			On Error Resume Next

			'Abre o banco
						
			'stconnStr = "Provider=OraOLEDB.Oracle.1;Password=As@gercards2024;Persist Security Info=True;User ID=gercards;Data Source=EASPROD1"
	     	stconnStr = "Provider=OraOLEDB.Oracle.1;Password=As@gercards2024;Persist Security Info=True;User ID=gercards;Data Source=XE"
							
			db.Open stconnStr
			
			If Err.Number <> 0 Then
			
			  'Error Ocorreu 
			   response.write "<div id='errorBd'>erro no banco de dados!</div>" & Err.Description
			   response.end 
			
			End If
			
			On Error Goto 0 

						
		End Sub


		'Desconecta e fecha o banco
		Public Sub Desconecta

			stServer = ""
			stDataBase = ""
			stUid = ""
			stPwd = ""

			stConnStr = ""
			stTipoConn = ""

			On Error Resume next
			db.close
			Set db=Nothing
			Set cursor = Nothing
			Erro = msgOk
			Query = ""
			EOF = True
			BOF = True
			numCampos = 0
			numCamposQuery = 0
			numCamposQueryTrans =0 
			numCamposTab = 0
			numRegs = 0
			If Err.Number <> 0 Then Erro = Err.Description
			On Error goto 0
		End Sub


		Public Sub Reinicia
			On Error Resume Next
			If Not Cursor Is Nothing Then
				Cursor.close
				Set Cursor = nothing
			End If
			Erro = msgOk
			Query = ""
			EOF = True
			BOF = True
			NumCampos = 0
			NumCamposQuery = 0
			numCamposQueryTrans =0 
			numCamposTab = 0
			numRegs = 0
			On Error goto 0
		End Sub

		Function CorrigirJson(json)
        	Dim resultado
        	resultado = Replace(json, """{ : }""", "{}")
        	CorrigirJson = resultado
    	End Function


		Public Function GetJsonFromRs(Name)
			Dim JSON, registros(), registro, x, i, totalCampos

			JSON = "{}"

			If Cursor Is Nothing Then
				GetJsonFromRs = JSON
				Exit Function
			End If

			If Cursor.State = 0 Then
				' Cursor fechado
				GetJsonFromRs = JSON
				Exit Function
			End If

			If Cursor.EOF And Cursor.BOF Then
				GetJsonFromRs = JSON
				Exit Function
			End If

			' Garante que a leitura comece do início
			Cursor.MoveFirst

			totalCampos = Cursor.Fields.Count
			i = 0

			Do Until Cursor.EOF
				registro = "{"
				For x = 0 To totalCampos - 1
					Dim campo, valor
					campo = Cursor.Fields(x).Name

					If IsNull(Cursor.Fields(x).Value) Then
						valor = ""
					Else
						valor = CStr(Cursor.Fields(x).Value)
						valor = Replace(valor, """", "\""")
						valor = Replace(valor, vbCrLf, "\n")
						valor = Replace(valor, vbLf, "\n")
						valor = Replace(valor, vbCr, "\n")
					End If

					registro = registro & """" & campo & """:""" & valor & """"
					If x < totalCampos - 1 Then
						registro = registro & ","
					End If
				Next

				registro = registro & "}"

				If i = 0 Then
					ReDim registros(0)
				Else
					ReDim Preserve registros(i)
				End If

				registros(i) = registro
				i = i + 1
				Cursor.MoveNext
			Loop

			JSON = "{" & """" & Name & """:[" & Join(registros, ",") & "]}"
			GetJsonFromRs = CorrigirJson(JSON)
		End Function


	
		'Exceuta a query passada no par�metro sem ter a necessidade de incluir no
		'Arquivo de querys
		Public Sub AbreQueryDireto(txtQuery)
			Dim i, s, countQuery, rsCount, totalCampos

			query = txtQuery
			Erro = msgOk
			Set Cursor = Nothing
			Set rsCount = Nothing
			EOF = True
			BOF = True
			numCampos = 0
			numRegs = 0

			On Error Resume Next

			' --- Etapa 1: Executar contagem total de registros ---
			countQuery = "SELECT COUNT(*) AS TOTAL FROM (" & query & ") X"
			Set rsCount = Server.CreateObject("ADODB.Recordset")
			rsCount.Open countQuery, db, 1, 1 ' adOpenKeyset, adLockReadOnly

			If Err.Number = 0 And Not rsCount.EOF Then
				numRegs = rsCount("TOTAL")
			Else
				numRegs = -1 ' erro na contagem
			End If
			rsCount.Close
			Set rsCount = Nothing

			' --- Etapa 2: Executar a query original ---
			Set Cursor = Server.CreateObject("ADODB.Recordset")
			Cursor.Open query, db, 1, 1

			If Err.Number <> 0 Then
				Erro = "Erro na execução da query: " & Err.Description
				Set Cursor = Nothing
				Exit Sub
			End If

			' --- Etapa 3: Preparar dados ---
			If Not Cursor Is Nothing Then
				If Not Cursor.EOF Then
					EOF = False
					BOF = False
				Else
					EOF = True
					BOF = True
				End If

				' Coleta nomes dos campos com índice (mais rápido)
				totalCampos = Cursor.Fields.Count
				ReDim NomeCampo(totalCampos - 1)

				For i = 0 To totalCampos - 1
					NomeCampo(i) = Cursor.Fields(i).Name
				Next

				numCampos = totalCampos
			Else
				Erro = "Erro ao abrir cursor."
			End If

			On Error GoTo 0
		End Sub


		'Executa queries no banco aberto
		Public Sub AbreQuery (alias, abre)
			Dim caminho, arq, s, i
			Dim fld, fls, f

			'Localiza a query que atende pelo alias solicitado
			caminho = (Session ("stCamQry"))
						
			caminho = "C:\sistemasweb\gercards\Dados\queries"
			
			Erro = msgOk
			query = ""

			If Not FSO.FolderExists (caminho) Then
				erro = "N�O FOI POSS�VEL ENCONTRAR ARQUIVO DE QUERIES!"
				Exit Sub
			End If

			Set fld = FSO.GetFolder (caminho)
			Set fls = fld.files

			query = ""

			For Each f In fls
				If Right (f.name,4) = ".txt" Then 
					Set arq = FSO.OpenTextFile (caminho & "\" & f.name,1,false)

					Do
						s = arq.ReadLine
						If UCase (s) = "[" & UCase(alias) & "]" Then
							Do
								s = arq.ReadLine
								If s <> "" and Left(s,1) <> ";" And Left(s,1) <> "[" Then
									Query = Query & s & " "
								End If
							Loop Until Left(s,1) = "[" Or arq.AtEndOfStream Or Right (s,1) = ";"
						End if
					Loop Until Query <> "" Or arq.AtEndOfStream

					arq.close

					If query <> "" Then Exit For
				End If
			Next

			Set fls = Nothing
			Set fld = Nothing

			'A query n�o foi encontrada
			If Query = "" Then
				erro = "N�O FOI POSS�VEL ENCONTRAR A QUERY [" & alias & "] NO ARQUIVO"
				Exit Sub
			End If

			'Substitui as TAGS de transa��o
			if flagTransacao and numCamposQueryTrans <> 0 then
				for i = 0 to numCamposQueryTrans-1
					if stQryTransSeq(i) = transQueryAtual then
						Query = Replace (Query,"#" & UCase(stQryTransCampo(i)) & "#",stQryTransValor(i))
					end if
				next
			end if

			'Substitui as TAGS
			For i = 0 To numCamposQuery-1

				Query = Replace (Query,"#" & UCase(stQryCampo(i)) & "#",stQryValor(i))
			next

			if debugMode then response.write ("<b>[" & alias & "] (Modo " & abre & ")</b><br>" & Query & "<br><b>")

			'Modo de teste de query. N�o executa - s� monta
			if abre = 2 then 
				Set cursor = Nothing
				EOF = True
				BOF = True
				'numCamposQuery = 0
				numCamposTab = 0
				numRegs = 0
				Erro = msgOk
				if debugMode then response.write ("Resposta: TESTE</b><br><br>")
				exit sub
			end if

			'Tenta executar a query j� montada
			On Error Resume Next
			If abre = 1 Then 
				'Set Cursor = db.execute (Query) 
				Set Cursor = Server.CreateObject("ADODB.Recordset")
				Cursor.open query, db
			Else 
				'db.autocommit = false
				'db.beginTrans
				db.execute (Query)
				'db.commitTrans
				'db.autocommit = true
			End If
			

			If Err.Number <> 0 Then Erro = Err.Description Else Erro = msgOk

			If abre = 1 Then 
				'Se a tarefa for abrir, ent�o prepare os cursores,
				'catalogue os campos e conte o n�mero de registros
				If Err.number = 0 Then 
					EOF = Cursor.EOF
					BOF = Cursor.BOF
					numCampos = 0
					For Each s In Cursor.Fields
						redim Preserve NomeCampo (numCampos)
						NomeCampo (numCampos) = s.name
						numCampos = numCampos + 1
					Next


					'Novo teste de recordcount
					numRegs = cursor.recordCount

				Else
					'Ocorreu um erro na abertura
					EOF = True
					BOF = True
					Set Cursor = Nothing
				End If
			Else
				'Era somente execu��o da query
				Set cursor = Nothing
				EOF = True
				BOF = True
				'numCamposQuery = 0
				numCamposTab = 0
				numRegs = 0
			End If 
			On Error goto 0

			if debugMode then response.write ("Resposta: " & Erro & "</b><br><br>")

		End Sub

		Public Sub FechaQuery
			If Not cursor Is Nothing Then
				Cursor.Close
				Set Cursor = Nothing
				Erro = msgOk
				Query = ""
				EOF = True
				BOF = True
			End If
		End Sub


		Public Sub Prox
			EOF = true
			If Not Cursor is Nothing Then
				If Not Cursor.EOF Then Cursor.MoveNext
				EOF = Cursor.EOF
				erro = msgOk
			Else
				erro = "DATASET FECHADO!"
			End If
		End Sub


		Public Sub Ant
			BOF = true
			If Not Cursor is Nothing Then
				If Not Cursor.BOF Then Cursor.MovePrevious
				BOF = Cursor.BOF
				erro = msgOk
			Else
				erro = "DATASET FECHADO!"
			End If
		End Sub


		Public Function Valor(stCampo)
			If Not Cursor Is Nothing Then
				On Error Resume Next
				Valor = Cursor(stCampo)
				If Err.number <> 0 Then
					erro = Err.Description & " (" & stCampo & ")"
					Valor = erro
				Else
					erro = msgOk
				End If
				On Error goto 0
			End If
		End Function


		Public Sub LimpaCamposQuery
			dim i

			if numCamposQuery >=1 then 
				for i = 1 to numCamposQuery
					stQryCampo(i-1) = ""
					stQryValor(i-1) = ""
				next
			end if

			numCamposQuery = 0
			numCamposQueryTrans =0 

		End Sub


		Public Sub InsereCampoQuery(byval stNome,byval stValor)
			numCamposQuery = numCamposQuery + 1
			ReDim Preserve stQryCampo(numCamposQuery-1)
			ReDim Preserve stQryValor(numCamposQuery-1)

			stQryCampo(numCamposQuery-1) = stNome
			If stValor & "" <> "" then
				stQryValor(numCamposQuery-1) = replace(replace(stValor,"'","''"),"`","'")
			Else
				stQryValor(numCamposQuery-1) = ""
'				response.write ("-o " & stNome & " - " & stValor & "<br>")
			End If
			'INJECTION RULEZ!
			'Caso seja necess�rio enviar um ap�strofo ('),
			'� necess�rio enviar um acento grave no lugar (`),
			'pois todos os ap�strofos ser�o substitu�dos por duplo ('')
		End Sub

		Public Sub insereCampoQueryAdicional(byval stNome,byval stValor)
			numCamposQuery = numCamposQuery + 1
			ReDim Preserve stQryCampo(numCamposQuery-1)
			ReDim Preserve stQryValor(numCamposQuery-1)

			stQryCampo(numCamposQuery-1) = stNome
			If stValor & "" <> "" then
				stQryValor(numCamposQuery-1) = replace(replace(stValor,"''","'"),"`","'")
			Else
				stQryValor(numCamposQuery-1) = ""
'				response.write ("-o " & stNome & " - " & stValor & "<br>")
			End If
			'INJECTION RULEZ!
			'Caso seja necess�rio enviar um ap�strofo ('),
			'� necess�rio enviar um acento grave no lugar (`),
			'pois todos os ap�strofos ser�o substitu�dos por duplo ('')
		End Sub
		
		Public Sub insereCampoQueryView(byval stNome,byval stValor)
			numCamposQuery = numCamposQuery + 1
			ReDim Preserve stQryCampo(numCamposQuery-1)
			ReDim Preserve stQryValor(numCamposQuery-1)

			stQryCampo(numCamposQuery-1) = stNome
			If stValor & "" <> "" then
				stQryValor(numCamposQuery-1) = replace(replace(stValor,"''","'"),"`","'")
			Else
				stQryValor(numCamposQuery-1) = ""
'				response.write ("-o " & stNome & " - " & stValor & "<br>")
			End If
			'INJECTION RULEZ!
			'Caso seja necess�rio enviar um ap�strofo ('),
			'� necess�rio enviar um acento grave no lugar (`),
			'pois todos os ap�strofos ser�o substitu�dos por duplo ('')
		End Sub


		'Insere campos em uma query de transa��o
		'Estes campos s�o v�lidos apenas para a pr�xima query inserida na transa��o
		'A partir da query seguinte, eles perdem o valor
		'
		'Caso haja um campo gen�rico (insereCampoQuery) e um
		'espec�fico (insereCampoQueryTrans) com o mesmo nome,
		'a ordem de preval�ncia � o campo de query de transa��o
		'seguido de campo de query gen�rico
		Public Sub InsereCampoQueryTrans(byval stNome,byval stValor)
			'Verifica se h� uma trabsa��o aberta
			if not flagTransacao then
				erro = "N�O EXISTE TRANSA��O ABERTA"
				exit sub
			end if

			'Incrementa o contador e redimensiona o array
			numCamposQueryTrans = numCamposQueryTrans + 1
			ReDim Preserve stQryTransSeq(numCamposQueryTrans-1)		'Sequ�ncia da query
			ReDim Preserve stQryTransCampo(numCamposQueryTrans-1)
			ReDim Preserve stQryTransValor(numCamposQueryTrans-1)

			stQryTransCampo(numCamposQueryTrans-1) = stNome
			stQryTransSeq(numCamposQueryTrans-1) = transNumQueries

			If stValor & "" <> "" then
				stQryTransValor(numCamposQueryTrans-1) = replace(replace(stValor,"'","''"),"`","'")
			Else
				stQryTransValor(numCamposQueryTrans-1) = ""
'				response.write ("-o " & stNome & " - " & stValor & "<br>")
			End If
			'INJECTION RULEZ!
			'Caso seja necess�rio enviar um ap�strofo ('),
			'� necess�rio enviar um acento grave no lugar (`),
			'pois todos os ap�strofos ser�o substitu�dos por duplo ('')
		End Sub


		Public Sub LimpaCamposTab
			numCamposTab = 0
			numIndicesTab = 0
		End Sub


		Public Sub InsereCampoTab(nomeCampo,labelCampo, largCampo, estilo, chaveLink)
			Dim s
			
			numCamposTab = numCamposTab + 1
			ReDim Preserve stTabCampo(numCamposTab-1)
			ReDim Preserve stTabLabel(numCamposTab-1)
			ReDim Preserve stTabFmt(numCamposTab-1)

			If abs(chaveLink) = 0 Then s = "0" Else s = "1"

			stTabCampo(numCamposTab-1) = nomeCampo
			stTabLabel(numCamposTab-1) = labelCampo
			stTabFmt(numCamposTab-1) = largCampo & ";" & estilo & ";" & s

		End Sub


		Public Sub InsereIndiceTab(nomeCampo)

			numIndicesTab = numIndicesTab + 1
			ReDim Preserve stTabIndice(numIndicesTab-1)
			stTabIndice(numIndicesTab-1) = nomeCampo

		End Sub


		Public Function Tabela(formato,titulo,temNum,numPag,itensPPag,linkPag,linkItem)
			Dim s, s1, s2, i, j, k
			Dim estilo
			Dim iniFile
			Dim stCabecalho, stSubtitulo, stCampo, stRodape, stNum, stPagAntes, stPagDepois

			Dim numPaginas

			If numPag & "" = "" Then numPag = 1

			If numPag <> 0 then
				numPaginas = numRegs / itensPPag
				If numPaginas <> Int (numPaginas) Then numPaginas = Int (numPaginas) + 1
			Else
				numPaginas = 1
			End If

			If (CInt(numPag) <> 0 And cint (numPag) > numPaginas) Or CInt(numPag) < 0 Then
				erro = "P�GINA INV�LIDA: " & numPag
				Tabela = ""
				Exit function
			End If


			If Not Cursor Is Nothing Then
				If Not (Cursor.EOF And Cursor.BOF) Then

					Cursor.MoveFirst

					If numPag <> 0 then
						i = numPag
						Do Until i <= 1
							For j = 1 To itensPPag
								prox
							Next
							i = i - 1
						Loop
					End If


					'Busca os padr�es de formata��o no arquivo ini
					Set iniFile = new TIniFile

					If iniFile.Create (fnGetFilePath(Session ("stCamIni")) & "formatTab.ini") Then

						i = 1
						Do
							s = iniFile.readValue (formato,"Cabecalho" & i,"")
							stCabecalho = stCabecalho & s
							If s <> "" Then stCabecalho = stCabecalho & vbCrLf
							i = i + 1
						Loop Until s = ""

						i = 1
						Do
							s = iniFile.readValue (formato,"Subtitulo" & i,"")
							stSubtitulo = stSubtitulo & s
							If s <> "" Then stSubtitulo = stSubtitulo & vbCrLf
							i = i + 1
						Loop Until s = ""

						i = 1
						Do
							s = iniFile.readValue (formato,"Campo" & i,"")
							stCampo = stCampo & s
							If s <> "" Then stCampo = stCampo & vbCrLf
							i = i + 1
						Loop Until s = ""

						i = 1
						Do
							s = iniFile.readValue (formato,"Rodape" & i,"")
							stRodape = stRodape & s
							If s <> "" Then stRodape = stRodape & vbCrLf
							i = i + 1
						Loop Until s = ""

						i = 1
						Do
							s = iniFile.readValue (formato,"Num" & i,"")
							stNum = stNum & s
							If s <> "" Then stNum = stNum & vbCrLf
							i = i + 1
						Loop Until s = ""

						stPagAntes = iniFile.readValue (formato,"pagAntes","&lt;&lt;")
						stPagDepois = iniFile.readValue (formato,"pagDepois","&gt;&gt;")

					End If
					Set iniFile = Nothing

					If CInt (numPag) = 0 Then
						stCabecalho = Replace (Replace (Replace (stCabecalho, "#PANT#",""), "#PPROX#",""), "#PAG#","1")
					End If 

					If CInt(numPag) = 1 Then 
						stCabecalho = Replace (stCabecalho,"#PANT#",stPagAntes)
					Else
						stCabecalho = Replace (stCabecalho,"#PANT#","<a href='" & linkPag & (numPag-1) & "'>" & stPagAntes & "</a>")
					End If 

					If CInt(numPag) = CInt(numPaginas) Then 
						stCabecalho = Replace (stCabecalho,"#PPROX#",stPagDepois)
					Else
						stCabecalho = Replace (stCabecalho,"#PPROX#","<a href='" & linkPag & (numPag+1) & "'>" & stPagDepois & "</a>")
					End If 

					stCabecalho = Replace (stCabecalho,"#NCOL#",numCamposTab + Abs(temnum))
					stCabecalho = Replace (stCabecalho,"#TITULO#",titulo)
					stCabecalho = Replace (Replace (stCabecalho,"#NCOL#",numCamposTab + Abs(temnum)),"#NREG#",numRegs)
					stCabecalho = Replace (Replace (stCabecalho,"#PAG#",numPag),"#TPAG#",numPaginas)

					s = stCabecalho

					estilo = ""
					j = 0

					'Insere a linha de t�tulo da tabela
					s = s & "  <tr>" & vbCrLf
						If temNum Then s = s & Replace(Replace(stSubTitulo,"#LARG#","0"),"#SUBTITULO#","#")
					For i = 0 To numCamposTab - 1
						s = s & Replace(Replace(stSubTitulo,"#LARG#",Split(stTabFmt(i),";")(0)),"#SUBTITULO#",stTabLabel(i))
					Next
					s = s & "  </tr>" & vbCrLf

					'Insere as linhas de dados
					Do Until EOF Or (j = itensPPag And numPaginas > 1)
						If estilo = "Impar" Then estilo = "Par" Else estilo = "Impar"
						j = j + 1
						s = s & "  <tr>" & vbCrLf
						If temNum Then 
							If numPag > 0 Then 
								s = s & replace (stNum,"#NUM#",j + itensPPag * (numPag-1)) 
							Else
								s = s & replace (stNum,"#NUM#",j) 
							End If
						End If

						For i = 0 To numCamposTab - 1
							s1 = ""


							If CStr(Split(stTabFmt(i),";")(2)) = "1" And LinkItem <> "" then
								'For k = 0 To numCamposTab - 1
								'	If CStr(Split(stTabFmt(k),";")(2)) = "1" Then
								'		If s1 = "" And InStr (linkItem,"?") = 0 Then s1 = s1 & "?" Else s1 = s1 & "&"
								'		s1 = s1 & stTabCampo(k) & "=" & valor(stTabCampo(k))
								'	End If
								'Next

								For k = 0 To numIndicesTab - 1

									If s1 = "" And InStr (linkItem,"?") = 0 Then s1 = s1 & "?" Else s1 = s1 & "&"
									s1 = s1 & stTabIndice(k) & "=" & valor(stTabIndice(k))

								Next

								s1 = "<a class='tab' href='" & LinkItem & s1 & "'>"
							End If

							s1 = s1 & valor(stTabCampo(i)) 

							If CStr(Split(stTabFmt(i),";")(2)) = "1" And LinkItem <> "" Then
								s1 = s1 & "</a>"
							End If
							s = s & Replace (Replace (replace (stCampo,"#CLASSE#",Split(stTabFmt(i),";")(1) & estilo),"#VALOR#",s1),"#LARG#",Split(stTabFmt(i),";")(0))
						Next

						s = s & "  </tr>" & vbCrLf

						Prox
					Loop

					If CInt (numPag) = 0 Then
						stRodape = Replace (Replace (Replace (stRodape, "#PANT#",""), "#PPROX#",""), "#PAG#","1")
					End If 

					If CInt(numPag) = 1 Then 
						stRodape = Replace (stRodape,"#PANT#",stPagAntes)
					Else
						stRodape = Replace (stRodape,"#PANT#","<a href='" & linkPag & (numPag-1) & "'>" & stPagAntes & "</a>")
					End If 

					If CInt(numPag) = CInt(numPaginas) Then 
						stRodape = Replace (stRodape,"#PPROX#",stPagDepois)
					Else
						stRodape = Replace (stRodape,"#PPROX#","<a href='" & linkPag & (numPag+1) & "'>" & stPagDepois & "</a>")
					End If 

					stRodape = Replace (Replace (stRodape,"#NCOL#",numCamposTab + Abs(temnum)),"#NREG#",numRegs)
					stRodape = Replace (Replace (stRodape,"#PAG#",numPag),"#TPAG#",numPaginas)

					s = s & stRodape
					Tabela = s
				Else
					erro = "CONSULTA VAZIA!"
				End If

			Else
				erro = "DATASET FECHADO!"
			End If

		End Function



		'Inicia uma transa��o
		'deve ser precedido por insereQuery (para inserir todas as queries a ser executadas)
		'e finalizada por executaTransacao
		public function iniciaTransacao

			call db.beginTrans

			transNumQueries = 0
			numCamposQueryTrans = 0
			flagTransacao = true

		end function



		'Insere uma query na transa��o. Elas ser�o executadas na sequ�ncia em que forem inseridas.
		'As queries podem usar vari�veis normalmente
		public function insereQuery (q)

			'Verifica se h� uma trabsa��o aberta
			if not flagTransacao then
				erro = "N�O EXISTE TRANSA��O ABERTA"
				exit function
			end if

			transNumQueries = transNumQueries + 1
			ReDim Preserve stTransQueries(transNumQueries-1)
			stTransQueries(transNumQueries-1) = q

		end function



		'A transa��o ser� executada
		'Se ocorrer erro, retorna a query que deu erro
		'Se todas as queries foram executadas, returna msgOk
		'A mensagem de erro retorna em TBD.erro
		public function executaTransacao

			dim i
			dim cmd 'Objeto Command


			'Verifica se h� uma trabsa��o aberta
			if not flagTransacao then
				erro = "N�O EXISTE TRANSA��O ABERTA"
				exit function
			end if

			'Verifica se h� queries a executar
			if transNumQueries = 0 then
				erro = "N�O EXISTEM QUERIES A EXECUTAR"
				flagTransacao = true
				transNumQueries = 0
				exit function
			end if

			'Inicializa o objeto COMMAND
			Set cmd = Server.CreateObject("ADODB.COMMAND")
			cmd.CommandType = 1 'adCmdText
			cmd.ActiveConnection = db


			'Resultado esperado da fun��o
			executaTransacao = msgOk


			'Percorre todas as queries inclu�das na transa��o
			for transQueryAtual = 0 to transNumQueries-1

				'Abre a query no modo execu��o
				'O primeiro par�metro � o alias da query
				'O segundo par�metro significa execu��o sem cursor (execute)
				call AbreQuery (stTransQueries(transQueryAtual), 0)

				'Se a query n�o foi executada corretamente, realiza o rollback
				if erro <> msgOk then

					'Rollback
					db.RollbackTrans

					'Retorna a query que deu erro no valor da fun��o
					'Para saber a descri��o do erro, verifique TBD.erro
					executaTransacao = stTransQueries(transQueryAtual)

					'Sai do loop
					exit for

				end if

			next

			'Se n�o houve erro, comita a transa��o
			if erro = msgOk then call db.CommitTrans

			'Fecha o modo de transa��o
			flagTransacao = false


		end function

	End Class
%>