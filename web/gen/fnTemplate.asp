<%
	Class TTemplate

		Public numDest

		Private numTags, tag(), valor()					'Tags gerais a substituir
		Private dest(), tagList(), valList()			'Destinat�rios e tags espec�ficas (divididas por ;)
		Private numAttachs, attachs()					'Anexos aos emails
		Private assunto, mailRem, nomeRem, CCO			'Dados do e-mail
		Private tipoMail								'Tipo: texto plano ou HTML
		public  texto									'Texto original do arquivo em uma vari�vel


		'Inicializa vari�veis e verifica se o arquivo modelo existe
		Public Function Create (stArqModelo, stNomeRem, stEndRem, stCCO, inTipoMail, stAssunto)

			Dim f

			'O arquivo existe?
			If Not FSO.FileExists (Session ("stCamTemplate") & stArqModelo) Then
				Create = False
				Exit Function
			End If

			'Inicializa vari�veis
			numTags  = 0
			numDest  = 0
			numAttachs = 0
			assunto  = stAssunto
			mailRem   = stNomeRem & "<" & stEndRem & ">"
			CCO      = stCCO
			tipoMail = inTipoMail	' (0 = HTML ; 1 = Text)

			'L� o texto (modelo, com todas as tags) por completo
			Set f = FSO.openTextFile (Session ("stCamTemplate") & stArqModelo, 1)
			texto = f.readAll
			f.close

			create = True

		End Function


		'Finaliza o objeto
		Public Function Finaliza

		End Function


		'Insere uma tag a ser substitu�da no texto modelo
		Public Sub insereTag (stTag, stValor)

			numTags = numTags + 1
			ReDim preserve tag(numTags+1)
			ReDim preserve valor(numTags+1)

			tag  (numTags) = Replace(stTag,"#","")
			valor (numTags) = stValor

		End Sub


		'Insere um destinat�rio, com a lista de tags e seus respectivos valores
		Public Sub insereDest (stNome, stEmail, stTagList, stValList)

			numDest = numDest + 1
			ReDim preserve dest    (numDest+1)
			ReDim preserve tagList (numDest+1)
			ReDim preserve valList (numDest+1)

			dest (numDest) = stNome & " <" & stEmail & ">"

			If stTagList <> "" then
				tagList (numDest) = Split (stTagList,";")
				valList (numDest) = Split (stValList,";")
			Else
				tagList (numDest) = ""
				valList (numDest) = ""
			End If

		End Sub


		'Insere um anexo (na lista)
		Public Sub insereAttach(attach)

			ReDim preserve attachs(numAttachs)
			numAttachs = numAttachs + 1

			attachs (numAttachs-1) = attach
		End Sub


		'Retorna texto montado com o �ndice do destinat�rio espec�fico
		'ou apenas com as tags gerais substitu�das (se inDestNum = 0)
		Public Function montaTexto (inDestNum)

			Dim i, s

			s = texto

			montaTexto = ""

			If inDestNum > numDest Then Exit Function

			For i = 1 To numTags
				s = Replace (s, "#" & tag(i) & "#", valor(i) & "")
			Next

			If inDestNum <> 0 Then
				If isarray (tagList(inDestNum)) Then

					For i = 0 To UBound (tagList(inDestNum))
						s = Replace (s, "#" & tagList (inDestNum)(i) & "#", valList (inDestNum)(i))
					Next

				End If
			End If

			montaTexto = s

		End Function


		'Envia uma p�gina com o n�mero indicado de destinat�rios
		Public Function enviaEmail (inNumPag, inDestPorPag)

			Dim i, j, k
			Dim Mailer

			j = 0 : k = 1

			'Percorre os itens a serem enviados
			For i = 1 To inDestPorPag

				k = (inNumPag-1) * inDestPorPag + i

				If k <= numDest Then

					j = j + 1
					'response.write (dest(k) & "<br>")

					'Chama a rotina modularizada de envio de emails (fnGerais)
					Call fnMailSend (mailRem, dest(k), CCO, assunto, montaTexto(k), tipoMail, join(attachs,";"))
				End If

			Next

			enviaEmail = j

			Set Mailer = Nothing 

		End Function

	End Class
%>