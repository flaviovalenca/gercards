<%
	Class TDialogo

		Private camMods			'Caminho físico dos modelos de documentos
		Private urlAcao			'URL da página conversora de RTF
		Private nomeArquivo		'Nome do arquivo com os dados do formulário
		Private numOris, oris()	'Dicionário de Orientações
		Private camImgHelp		'Caminho da imagem de help (?)
		Private Titulo			'Título do diálogo
		Private Estilo			'Estilo da tabela (width e align)

		Private numCamposP		'Número de campos inseridos via programação
		Private CamposP()		'Campos inseridos via programação (insereCampo)
		Private iCamposP		'Auxiliar no ajusta do código para aceitar
								'campos inseridos via programação



		'Função que busca no dicionário de orientações uma que atenda
		'ao nome do campo
		Private Function buscaOri (campo)
			Dim i,s1, ori

			ori = ""

			For i = 1 To numOris
				s1 = Split (oris(i),"|")
				If s1(0) = Replace(campo,"%","") Then ori = Replace(s1(1),"'","´")
			next


			If ori <> "" Then 
				buscaOri = "<td class='dgHelp' align='right'><img src='" & camImgHelp & "' width='16' height='16' style='cursor:hand;' alt = '" & ori & "' onclick=" & Chr(34) & "javascript:alert('" & ori & "');" & Chr(34) & "></td>"
			Else
				buscaOri = "<td class='dgHelp'>&nbsp;</td>"
			End If

		End Function


		Public Function create (stArquivo, stAcao, stEstilo)

			Titulo = ""
			nomeArquivo = stArquivo & ".txt"
			urlAcao = stAcao
			Estilo = stEstilo
			camMods = Session ("stCamDlg")


			camImgHelp = "images/common/int.gif"
			numCamposP = 0
			iCamposP = 0

		End function


		Public Sub insereCampo(campo)

			numCamposP = numCamposP + 1
			ReDim Preserve camposP (numCamposP)
			camposP(numCamposP-1) = campo

		End Sub


		'Função que monta o diálogo baseado no nome do arquivo passado
		Public Function montaDialogo

			Dim result				'Resultado
			Dim resRep				'Resultado temporário (da repetição)
			Dim s,s1,s2,i,j			'Uso geral
			Dim arq					'Arquivo do modelo
			Dim numSels, sels()		'Selects
			Dim numReps, reps()		'Repetidores
			Dim repAtu				'Repetidor atual
			Dim repTit				'Título do repetidor
			Dim jScript				'Texto com o JavaScript
			Dim btRodape			'HTML com os botões do formulário
			Dim numArraysDinamicos	'Explique isso depois, POR FAVOR!!!



			result = "<form method='post' name='frmpreenche' action='" & urlAcao & "'>" & vbCrLf & _
					 "<input type='hidden' name='_arquivo' value='" & nomeArquivo & "'>" & vbCrLf & _
					 "<table border='0' cellspacing='0' cellpadding='0' " & estilo & ">" & vbCrLf & _
					 "<tr><td colspan='3' class='dgTitulo'><div id='Tit'></div></td></tr>" & vbCrLf

			numSels = 0
			numReps = 0
			repAtu  = 0

			numOris = 0

			numArraysDinamicos = 0
			jScript = ""
			btRodape = ""

			'O arquivo existe?
			If Not FSO.fileExists (camMods & nomeArquivo) Then
				montaDialogo = ""
				Exit Function
			End If


			'Antes do parsing, catalogue as orientações no dicionário
			Set arq = FSO.openTextFile (camMods & nomeArquivo,1, false)


			'Busca o início de tudo: a linha de título
			Do While Not arq.atEndOfStream And s <> "MODELO DIALOGO"
				s = Trim(arq.readLine)
			Loop

			'Percorre toda a região do comentário
			Do While Not arq.atEndOfStream

				'Realiza a leitura de uma linha
				s = Trim(arq.readLine)
				If InStr (s, "'") <> 0 Then s = left (s,InStr (s, "'")-1)

				'É uma orientação: inclui no array
				If Left(s,1) = "O" then
					numOris = numOris + 1
					ReDim preserve oris(numOris)

					s1 = Split (Mid(s,3,Len(s)),",")
					oris(numOris) = s1(0) & "|" & s1(1)
				End if

			Loop
			arq.close

			'Cataloga, agora, as orientações inseridas via programação (insereCampo)
			If numCamposP > 0 Then
				For i = 1 To numCamposP

					s = camposP(i-1)

					'É uma orientação: inclui no array
					If Left(s,1) = "O" then
						numOris = numOris + 1
						ReDim preserve oris(numOris)

						s1 = Split (Mid(s,3,Len(s)),",")
						oris(numOris) = s1(0) & "|" & s1(1)
					End if

				next
			End If

			iCamposP = 0

			'Agora, reabre o arquivo para o parsing real
			Set arq = FSO.openTextFile (camMods & nomeArquivo,1, false)

			'Busca o início de tudo: a linha de título
			Do While Not arq.atEndOfStream And s <> "MODELO DIALOGO"
				s = Trim(arq.readLine)
			Loop

			'Percorre todo o arquivo
			Do While Not arq.atEndOfStream

				If iCamposP < numCamposP Then
					'Se ainda houver um campo inserido via programação, obtenha-o
					'ANTES de parsear o arquivo
					s = camposP(iCamposP)
					iCamposP = iCamposP + 1
				else
					'Lê a linha do arquivo
					s = Trim(arq.readLine)
				End If

				'Remove qualquer área comentada (à direita) e tabulações (à esquerda)
				If InStr (s, "'") <> 0 Then s = left (s,InStr (s, "'")-1)

				If s <> "" then
					Do While Asc(Left(s,1)) <= 32
						s = Right (s, Len(s)-1)
					Loop
				End If
				
				If s & " " <> " " Then 

				Select Case UCase(Left (s,1))

					'É um divisor
					Case "D"
						result = result & "<tr><td colspan='3' class='dgDiv'><img src='images/blank.gif' width='1' height='1'></td></tr>" & vbCrLf

					'É m botão
					Case "B"
						s1 = Split (Mid(s,3,Len(s)),",")
						If s1(1) = "RESET" Then 
							btRodape = btRodape & "<input class='dgBtn' type='reset' value='" & s1(0) & "'> "
						ElseIf s1(1) = "POST" Then 
							btRodape = btRodape & "<input class='dgBtn' type='submit' name='" & s1(0) & "' value='" & s1(0) & "'> "
						Else
							btRodape = btRodape & "<input class='dgBtn' type='button' onclick=" & Chr(34) & Replace(Replace(s1(1),"[vir]",","),"[apos]","'") &  chr(34) & " name='" & s1(0) & "' value='" & s1(0) & "'> "
						End If
						btRodape = btRodape & vbCrLf


					'É o título do form
					Case "T"
						Titulo = Mid (s,3,Len(s))
						result = result & "<input type='hidden' name='_titulo' value='" & Titulo & "'>" & vbCrLf
						jScript = jScript & "document.getElementById('Tit').innerHTML='" & titulo & "';" & vbCrLf


					'É a categoria do form
					Case "C"
						result = result & "<input type='hidden' name='_categoria' value='" & Mid (s,3,Len(s)) & "'>" & vbCrLf

					'É um campo hidden
					Case "H"
						s1 = Split (Trim(Mid (s,3,Len(s))), ",")
						result = result & "<input type='hidden' name='" & s1(0) & "' value='" & s1(1) & "'>" & vbCrLf


					'É um select: inclui no array
					Case "S"
						numSels = numSels + 1 
						ReDim preserve sels(numSels)
						sels(numSels) = Trim(Mid (s,3,Len(s)))
						'Cria fragmento JavaScript para informar o cliente das opções deste select
						s = Split (sels(numSels),",")
						jScript = jScript & "var " & s(0) & "=new Array("
						For i = 1 To UBound (s)
							jScript = jScript & "'" & Split(s(i),"|")(0) & "'"
							If i < UBound(s) Then jScript = jScript & ","
						Next
						jScript = jScript & ");" & vbCrLf


					'É um repetidor: liga (ou desliga) a variável 
					'de repetição e inicia (ou finaliza) a gravação 
					'do bloco a ser repetido
					Case "R"
						s1 = Split (Mid(s,3,Len(s)),",")
							If Right (s1(0),1) <> "/" Then

								'Está ligando
								resRep = ""
								repTit = s1(1)
								For i = 1 To numReps
									If Trim(Split(reps(i),",")(0)) = s1(0) Then 
										repAtu = i

									End If
								Next
							Else
								'Está desligando
								For i = 1 To Split(reps(repAtu),",")(2)
									If i <= Int(Split(reps(repAtu),",")(1)) Then s = "block" Else s = "none"
									result = result & "<tr><td colspan='3'>"
									result = result & "<div id='" & Trim(Split(reps(repAtu),",")(0)) & i & "' style='display:" & s & "'>"
									result = result & "<table border='0' cellspacing='0' cellpadding='0' width='100%'>"
									result = result & "<tr><td class='dgCabRep' colspan='3'>" & repTit & " " & i & "</td></tr>"
									result = result & Replace (resRep,"%",i)
									result = result & "</table></div>"
									result = result & "</td></tr>" & vbCrLf
								Next
								repAtu = 0
							End If


					'É um campo
					Case "F"
						s1 = Split (Trim(Mid (s,3,Len(s))), ",")
						For i = 0 To UBound (s1)
							s1(i) = Trim (s1(i))
						Next


						'É um campo texto, número, valor, data, label, password ou email
						If s1(2) = "T" Or s1(2) = "N" Or s1(2) = "V" Or s1(2) = "D" Or s1(2) = "L" Or s1(2) = "P" Or s1(2) = "M" Then

							If s1(3) > 40 Then j = 52 Else j = Int(s1(3)*1.3)

							If s1(2) = "D" Then s1(3) = 10
							If s1(2) = "V" Then j = j + 2



							If s1(2) = "N" Or s1(2) = "V" Then
								'Numérico/Valor
								s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
									"<td class = 'dgValor' width='100%'>" & _
									"<input type='text' class='dgTxt' name = '" & s1(0) & "'" & _
									" onkeyUp = " & Chr(34) & "javaScript:trata(" & s1(0) & ",'" & s1(2) & "',null)" & Chr(34) & _
									" onFocus = " & Chr(34) & "javaScript:formataValor(" & s1(0) & "," & InStr ("NV",s1(2))-1 & ",0)" & Chr(34) & _
									" onBlur = "  & Chr(34) & "javaScript:formataValor(" & s1(0) & "," & InStr ("NV",s1(2))-1 & ",1);"

								'Verifica se há inserção de extenso
								If UBound (s1) > 3 Then s = s & "insereExtenso(" & s1(0) & "," & s1(4) & "," & InStr ("NV",s1(2))-1 & ");"

								s = s & Chr(34) & " size = '" & j & "' maxlength = '" & s1(3) & "'></td>"
								
							ElseIf s1(2) ="T" Then 
								'Texto
								If UBound(s1) = 3 Then 
									s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
										"<td class = 'dgValor' width='100%'>" & _
										"<input type='text' class='dgTxt' name = '" & s1(0) & "'" & _
										" onkeyUp = " & Chr(34) & "javaScript:trata(" & s1(0) & ",'" & s1(2) & "',null)" & Chr(34) & _
										" size = '" & j & "' maxlength = '" & s1(3) & "'></td>"
								ElseIf UBound(s1) = 4 Then
									s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
										"<td class = 'dgValor' width='100%'>" & _
										"<input type='text' class='dgTxt' name = '" & s1(0) & "'" & _
										" onkeyUp = " & Chr(34) & "javaScript:trata(" & s1(0) & ",'" & s1(2) & "',null)" & Chr(34) & _
										" size = '" & j & "' maxlength = '" & s1(3) & "' value='" & s1(4) & "'></td>"
								Else
									s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
										"<td class = 'dgValor' width='100%'>" & _
										"<textarea class='dgTxt' name = '" & s1(0) & "'" & _
										" onkeyUp = " & Chr(34) & "javaScript:trata(" & s1(0) & ",'" & s1(2) & "',null)" & Chr(34) & _
										" cols = '" & s1(3) & "' rows = '" & s1(4) & "'>" & s1(5) & "</textarea></td>"
								End If

							ElseIf s1(2) ="P" Then 
								'Password
								If UBound (s1) = 3 Then
									ReDim preserve s1(5)
									s1(4) = ""
								End If
								s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
									"<td class = 'dgValor' width='100%'>" & _
									"<input type='password' class='dgTxt' name = '" & s1(0) & "'" & _
									" onkeyUp = " & Chr(34) & "javaScript:trata(" & s1(0) & ",'" & s1(2) & "'," & s1(4) & ")" & Chr(34) & _
									" size = '" & j & "' maxlength = '" & s1(3) & "'></td>"

							ElseIf s1(2) ="L" Then 
								'Label (texto fixo!)
								s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
									"<td class = 'dgValor' width='100%'>" & _
									"<input type='text' class='dgTxtReadOnly' readonly name = '" & s1(0) & "'" & _
									" size = '" & j & "' maxlength = '" & s1(3) & "' value = '" & Replace (s1(4),"'","´") & "'></td>"

							ElseIf s1(2) ="D" Then 
								'Data
								s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
									"<td class = 'dgValor' width='100%'>" & _
									"<input type='text' class='dgTxt' name = '" & s1(0) & "'" & _
									" onkeyUp = " & Chr(34) & "javaScript:trataData(" & s1(0) & ",0);" & Chr(34) & _
									" onBlur = " & Chr(34) & "javaScript:trataData(" & s1(0) & ",1);" & Chr(34) & _
									" size = '" & j & "' maxlength = '" & s1(3) & "'> (ddmmaaaa)</td>"

							ElseIf s1(2) ="M" Then 
								'Texto
								s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
									"<td class = 'dgValor' width='100%'>" & _
									"<input type='text' class='dgTxt' name = '" & s1(0) & "'" & _
									" onBlur = " & Chr(34) & "javaScript:trataEmail(" & s1(0) & ");" & Chr(34) & _
									" size = '" & j & "' maxlength = '" & s1(3) & "'></td>"

							End If

							s = s & buscaOri(s1(0)) & "</tr>" & vbCrLf



							If repAtu = 0 Then result = result & s Else resRep = resRep & s

						End If


						'É um campo atividade econômica
						If s1(2) = "AE" Then

							If s1(3) > 50 Then j = 65 Else j = Int(s1(3)*1.3)

							s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
								"<td class = 'dgValor' width='100%'>" & _
								"<input readonly type='text' class='dgTxt' name = '" & s1(0) & "_1'" & _
								" size = '12' value=''> " & _

								"<input type='button' onclick='javascript:buscaCnae(" & s1(0) &"_1," & s1(0) & "_2)' value='...'>" & _

								" <input readonly type='text' class='dgTxt' name = '" & s1(0) & "_2'" & _
								" size = '" & j & "' maxlength = '" & s1(3) & "' value=''></td>" & buscaOri(s1(0)) & "</tr>" & vbCrLf


							If repAtu = 0 Then result = result & s Else resRep = resRep & s
						End If




						'É um campo valor por extenso (texto)
						If s1(2) = "VE" Then
							s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
								"<td class = 'dgValor' width='100%'>" & _
								"<textarea rows='3' cols='" & Int(s1(3)*1.3) &"' readonly type='text' class='dgTxtReadOnly' name = '" & s1(0) & "'" & _
								" onfocus = " & Chr(34) & "javaScript:proxControl(" & s1(0) & ")" & Chr(34) & " ></textarea></td>" & buscaOri(s1(0)) & "</tr>" & vbCrLf

							If repAtu = 0 Then result = result & s Else resRep = resRep & s
						End If


						'É um campo CEP
						If s1(2) = "C" Then

							s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
								"<td class = 'dgValor' width='100%'>" & _
								"<input type='text' class='dgTxt' name = '" & s1(0) & "_1' size = '5' maxlength='5' " & _
								" onkeyUp = 'trataCep(" & s1(0) & "_1,null," & s1(0) & "_2,null,null,null,null,null,null)'> - " & _

								"<input type='text' class='dgTxt' name = '" & s1(0) & "_2' size = '3' maxlength='3' " & _
								" onkeyUp = 'trataCep(" & s1(0) & "_2," & s1(0) & "_1,null," & s1(3) & "," & s1(4) & "," & _
								s1(6) & "," & s1(7) & "," & s1(8) & ",this.form)'></td>" & buscaOri(s1(0)) & "</tr>" & vbCrLf

							If repAtu = 0 Then result = result & s Else resRep = resRep & s

						End If




						'É um campo repetidor
						If s1(2) = "R" Then
							numReps = numReps + 1
							ReDim preserve reps(numReps)
							reps(numReps) = s1(0) & "," & s1(3) & "," & s1(4)
						End If


						
						'É um select ou repetidor
						If s1(2) = "R" Or s1(2) = "S" Then
							If s1(2) = "S" Then
							
								For i = 1 To numSels
									If s1(3) = Trim(Split(sels(i),",")(0)) Then
										'Encontrou o referido select

										'Monta o campo
										s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
											"<td class = 'dgValor' width='100%'>" & _
											"<select class='dgTxt' name = '" & s1(0) & "'"

										If (UBound (s1) = 4) And InStr(Split(sels(i),",")(1),"|")> 0 Then
											'Possui um select filho que deve ser alimentado
											numArraysDinamicos = numArraysDinamicos + 1
											s = s & "onchange='javaScript:mudaSelect(" & s1(0) & "," & s1(4) & "," & numArraysDinamicos & ");'"
										End If
										s = s & ">"

										'Percorre todas as opções, colocando apenas a parte antes do pipe
										s2 = Split (sels(i),",")
											For j = 1 To UBound (s2)
												s = s & "<option>" & Split(s2(j),"|")(0) & "</option>"
											Next


										s = s & "</select></td>" & buscaOri(s1(0)) & "</tr>" & vbCrLf

										If (UBound (s1) = 4) And InStr(Split(sels(i),",")(1),"|")> 0 Then
											'Cria fragmento de javascript que mostra ao sistema o array de filhos possíveis
											jScript = jScript & "var arrayDinamico" & numArraysDinamicos & " = new Array("

											For j = 1 To UBound (s2)
												jScript = jScript & "'" & Split(s2(j),"|")(1) & "'"
												If j < UBound (s2) Then jScript = jScript & ","
											Next
											jScript = jScript & ");" & vbCrLf
										End If


										If repAtu = 0 Then result = result & s Else resRep = resRep & s

										Exit For
									End If

								Next
							Else

								s = "<tr><td class = 'dgLabel' width='0%'>" & Replace(s1(1)," ","&nbsp;") & "</td>" & _
									"<td class = 'dgValor' width='100%'>" & _
									"<select class='dgTxt' name = '" & s1(0) & "'" & _
									" onchange=" & Chr(34) & "javascript:muda('" & s1(0) & "',selectedIndex+" & s1(3) & "," & s1(4) & ");" & Chr(34)& ">"

								For j = s1(3) To s1(4)
									s = s & "<option>" & j & "</option>"
								Next 

								result = result & s & "</select></td>" & buscaOri(s1(0)) & "</tr>" & vbCrLf


							End If 

						End If 
						

				End Select
				End If

			Loop

			arq.close

			result = result & "<tr><td class='dgFoot' colspan='3' align='center'>" & btRodape & "</td></tr></table>" & vbCrLf
			result = result & "</form>" & vbCrLf
			If jScript <> "" Then result = result & vbCrLf & "<script language='javaScript'>" & vbCrLf & jScript & "</script>" & vbCrLf & vbCrLf
			montaDialogo = result & "<iframe id='Posts' name='Posts' width=0px height=0px; style='border=0px; background-color: #F0F0F0;visibility:hidden'></iframe>"

		End Function

	End Class
%>