<%
	Class TMenu

		Private		iniF	'Objeto do arquivo INI, gerado no Create
		Private		keys	'Chaves do arquivo INI
		Private		linInic	'Auxiliar para a varredura do arquivo INI
		Private		grupoUs	'Tipo de usuário, para filtrar itens do menu
		Private		codUs	'Código do usuário, idem
		Public		Erro


		Public Function create (stGrupoUs,stCodUs)

			create = true
			Set iniF = new TIniFile
			If Not iniF.Create (fnGetFilePath(Session ("stCamIni")) & "menu.ini") Then
				erro = "NÃO FOI POSSÍVEL ENCONTRAR O ARQUIVO menu.ini!"
				create = False
			Else 
				keys = Split(iniF.keys,",")
			End If

			lininic = 0
			grupoUs = stGrupoUs
			codUs = stCodUs

			session ("pqs") = ""
		End Function


		Public Function free
			Set iniF = nothing
		End Function


		'Retorna se o usuário tem permissão de apresentar um menu
		Private Function Permissao (item)

			If item = "" Then
				permissao = True

			ElseIf item = "0" And grupoUs = "" And codUs = "" Then
				permissao = True

			ElseIf UCase(item) = "X" Then
				permissao = False

			ElseIf Left(item,1) = "G" Then
				If InStr (item,"-") = 0 Then 
					Permissao = (InStr(Mid (item,2,Len(item)),grupoUs) > 0) And (grupoUs <> "")
				Else
					Permissao = (InStr(Mid (item,2,InStr(item,"-")-2),grupoUs) > 0) And (InStr(Mid (item, InStr(item,"-")+1,Len(item)),codUs) > 0) And (codUs <> "")
				End If

			Else
				permissao = False
			End If

		End Function

		'Retorna o id dos filhos de um menu passado
		Public Function filhos(pai)

			Dim result, i

			result = ""

			'Percorre todas as chaves
			For i = 0 To UBound(keys)
				If CStr(iniF.ReadValue (keys(i), "pai", "")) = CStr(pai) Then
					If result <> "" Then result = result & ","
					result = result & keys(i)
				End If
			Next

			filhos = result
		End Function


		'Retorna o JavaScript necessário para popular os menus
		'e possíveis submenus
		Public Function monta(pai, stT)

			Dim i, j, stRetorno
			Dim id, click, url, label, usuarios
			Dim mostra
			Dim submenus
			Dim numItens

			stRetorno = ""
			monta = ""
			submenus = ""



			'inicia a parte da lista
			If CStr(pai) = "0" Then
				stRetorno = stRetorno & stT & "<div id='primary-menu' >" & vbCrLf & _
										stT & "	<ul class='menubg' >" & vbCrLf
			Else
				stRetorno = stRetorno & stT & "	<ul>" & vbCrLf
			End If


			'Percorre todas as chaves
			For i = linInic To UBound(keys)

				If CStr(iniF.ReadValue (keys(i), "pai", "")) = CStr(pai) Then

					id		 = keys(i)
					click	 = iniF.ReadValue (keys(i), "click", "")
					url		 = iniF.ReadValue (keys(i), "url", "")
					label	 = iniF.ReadValue (keys(i), "label", "")
					usuarios = Trim(iniF.ReadValue (keys(i), "usuarios", ""))


					mostra = False

					If InStr (usuarios,",") > 0 Then
						usuarios = Split (usuarios,",")
						For j = 0 To UBound (usuarios)
							s = Trim(usuarios(j))
							mostra = mostra Or permissao (s)
						Next
					Else
						mostra = permissao (usuarios)
					End If


					If mostra Then
						numItens = numItens + 1
						If numItens > 1 And CStr(pai) = "0" Then stRetorno = stRetorno & stT & "		<li class='separator' ></li>" & vbCrLf

						stRetorno = stRetorno & stT & "		<li><a href='" &  Session("stPagInt") & id & "' >" & label & " " & "</a>"

						If filhos (id) <> "" Then
							j = linInic
							linInic = i+1
							stRetorno = stRetorno & vbCrLf & monta(id,stT & "	") & stT & "		</li>" & vbCrLf
							linInic = j
						Else
							stRetorno = stRetorno & "</li>" & vbCrLf
						End If
					End If

				End If

			Next

			stRetorno = stRetorno & stT & "	</ul>" & vbCrLf

			If CStr(pai) = "0" Then stRetorno = stRetorno & stT & "</div>" & vbCrLf & vbCrLf

			monta = stRetorno

		End Function


		Public Function PagDestino (id)

			Dim usuarios
			Dim mostra, j, s

			usuarios = Trim(iniF.ReadValue (id, "usuarios", ""))

			'Verifica se o usuário atual tem direito sobre este item
			mostra = False
			If InStr (usuarios,",") > 0 Then
				usuarios = Split (usuarios,",")
				For j = 0 To UBound (usuarios)
					s = Trim(usuarios(j))
					mostra = mostra Or permissao (s)
				Next
			Else
				mostra = permissao (usuarios)
			End If

			'Devolve a URL
			If mostra Then
				pagDestino = iniF.ReadValue (id, "url", "")
			Else
				pagDestino = ""
			End If


		End Function

		Public Function nomeItem(id)
			nomeItem = iniF.ReadValue(id, "label", "")
		End Function


		'Retorna o caminho completo, no estilo
		'Home > Menu > Submenu > Local
		Public Function caminho (id)
			Dim result, i, idI

			result = ""
			idI = id

			Do
				For i = 0 To UBound (keys)
					If CStr(keys(i)) = CStr(idI) Then

						If result <> "" Then result = "		<li>»</li> " & result
						result = "<li><a href='" & Session("stPagInt") & idI & "'>" & Replace(iniF.ReadValue (keys(i), "label", ""),"»","") & "</a></li>" & vbCrLf & result
						idI = CStr(iniF.ReadValue (keys(i), "pai", ""))

						Exit For
					End If
				Next

			Loop Until idI = "0"

			caminho = "<div id='clickpath' >" & vbCrLf & _
					  "	<ul>" & vbCrLf & _
					  "		<li><a href='.'>Home</a></li>" & vbCrLf

			If result <> "" Then 
						  caminho = caminho & _
						  "		<li>»</li> " & _
						  result
			End if

			caminho = caminho & _
					  "	</ul>" & vbCrLf & _
					  "</div>" & vbCrLf & vbCrLf

		End Function
		
	End Class

	Dim menu
	Set menu = new TMenu
%>