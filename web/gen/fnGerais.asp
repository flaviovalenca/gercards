<%


' Inicializa o gerador de números aleatórios com base no horário atual
Randomize Timer


'Retorna somente os algarismos do parâmetro
function fnFormataSoNumeros (byval valor)
    dim i,s		
    
    s = ""	
    
    If Not IsNull(valor) Then
        for i = 1 to len (valor)
            if mid (valor,i,1) >= "0" and mid (valor,i,1) <= "9" then s = s & mid (valor,i,1)
        Next			
    End if	

    fnFormataSoNumeros = s
end function

' Função para adicionar aspas adicionais à string JSON
Function AddQuotes(jsonStringWithoutQuotes)
    AddQuotes = Replace(jsonStringWithoutQuotes, """", """""")
    AddQuotes = """" & AddQuotes & """"
End Function

Function GetIPv4()
    Dim ipAddress
    Dim ipParts

    ' Obtém o endereço IP remoto
    ipAddress = Request.ServerVariables("REMOTE_ADDR")

    ' Verifica se o endereço IP é uma representação de IPv6
    If InStr(ipAddress, ":") > 0 Then
        ' Divide o endereço IPv6 em partes separadas
        ipParts = Split(ipAddress, ":")

        ' Obtém a parte IPv4 do endereço IPv6 (a última parte)
        ipAddress = ipParts(Ubound(ipParts))
    End If

    GetIPv4 = ipAddress
End Function

Function verificaSenha(senha)
    Dim temNumero, temLetraMinuscula, temLetraMaiuscula
    temNumero = False
    temLetraMinuscula = False
    temLetraMaiuscula = False

    ' Verifica se a senha tem pelo menos 8 caracteres
    If Len(senha) < 8 Then
        verificaSenha = False
        Exit Function
    End If

    ' Verifica cada caractere da senha
    Dim i, caractere
    For i = 1 To Len(senha)
        caractere = Mid(senha, i, 1)

        ' Verifica se o caractere é um número
        If IsNumeric(caractere) Then
            temNumero = True
        End If

        ' Verifica se o caractere é uma letra minúscula
        If caractere >= "a" And caractere <= "z" Then
            temLetraMinuscula = True
        End If

        ' Verifica se o caractere é uma letra maiúscula
        If caractere >= "A" And caractere <= "Z" Then
            temLetraMaiuscula = True
        End If
    Next

    ' Verifica se a senha atende a todos os critérios
    If temNumero And temLetraMinuscula And temLetraMaiuscula Then
        verificaSenha = True
    Else
        verificaSenha = False
    End If
End Function

function fnBase64Encode(str)
		Dim b64, i, n1, n2, t, s, L
		b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
		For I = 1 To Len(str) Step 3
			if Mid(str, I + 1, 1) = "" then N1 = 0 else N1 = asc(Mid(str, I + 1, 1))
			if Mid(str, I + 2, 1) = "" then N2 = 0 else N2 = asc(Mid(str, I + 2, 1))
			T = &H10000 * Asc(Mid(str, I, 1)) + &H100 * N1 + N2
			T = Oct(T)
			T = String(8 - Len(T), "0") & T
			s = Mid(b64, CLng("&o" & Mid(T, 1, 2)) + 1, 1) + Mid(b64, CLng("&o" & Mid(T, 3, 2)) + 1, 1) + Mid(b64, CLng("&o" & Mid(T, 5, 2)) + 1, 1) + Mid(b64, CLng("&o" & Mid(T, 7, 2)) + 1, 1)
			fnBase64Encode = fnBase64Encode + s
		Next
		L = 3 - ( len(str) mod 3 )
		if L < 3 then fnBase64Encode = Left(fnBase64Encode , len(fnBase64Encode) - L) & string(L,"=")
end function


function fnBase64Decode(str)
		dim b64, start,db,n,b,c,d,s,out
		b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

		for start = 1 to len(str) step 4
			db = 3
			n = 0
			for b = 0 to 3
				c = mid(str,b+start,1)
				if c="=" then
					db = db-1
					d = 0
				else
					d = instr(b64,c)-1
				end if
				if d = -1 then exit function
				n = 64*n+d
			next
			n = hex(n)
			n = string(6 - len(n),"0") & n
			out = chr(CByte("&H"&mid(n,1,2))) & chr(CByte("&H"&mid(n,3,2))) & chr(CByte("&H"&mid(n,5,2)))
			fnBase64Decode = fnBase64Decode & left(out,db) 
		next
end function

Function fnEncBase64 (st)
		dim i, s1, s2
		s1 = ""

		for i = 1 to len(st)
			s2 = mid (st,i,1)
			if s2 >= "A" and s2 <= "Z" then 
				s2 = lcase(s2)
			else
				s2 = ucase(s2)
			end if
			s1 = s2 & s1
		next

		if instr(s1,"=") > 0 then
			fnEncBase64 = replace(s1,"=","-")
		else
			fnEncBase64 = replace(s1,"-","=")
		end if

end function

function validaCPF(cpf)

    Dim multiplic1, multiplic2
    multiplic1=Array(10, 9, 8, 7, 6, 5, 4, 3, 2)
    multiplic2=Array(11, 10, 9, 8, 7, 6, 5, 4, 3, 2 )
    Dim tempCpf,digit,sum,remainder,i,RegXP
    cpf = Trim(cpf)
    cpf = Replace(cpf,".", "")
    cpf = Replace(cpf,"-", "")
    if (Len(cpf) <> 11) Then
        validaCPF = false
    else
        tempCpf = Left (cpf, 9)
        sum = 0

        Dim intCounter
        Dim intLen 
        Dim arrChars()

        intLen = Len(tempCpf)-1
        redim arrChars(intLen)

        For intCounter = 0 to intLen
            arrChars(intCounter) = Mid(tempCpf, intCounter + 1,1)
        Next

        i=0
        For i = 0 to 8
            sum =sum + CInt(arrChars(i)) * multiplic1(i)
        Next

        remainder = sum Mod 11
        If (remainder < 2) Then
            remainder = 0
        else
            remainder = 11 - remainder
        End If

        digit = CStr(remainder)
        tempCpf = tempCpf & digit
        sum = 0

        intLen = Len(tempCpf)-1
        redim arrChars(intLen)
        intCounter= 0
        For intCounter = 0 to intLen
            arrChars(intCounter) = Mid(tempCpf, intCounter + 1,1)
        Next
        i=0
        For i = 0 to 9
            sum =sum + CInt(arrChars(i)) * multiplic2(i)
        Next        
        remainder = sum Mod 11

        If (remainder < 2) Then
            remainder = 0
        else
            remainder = 11 - remainder
        End If      
        digit = digit & CStr(remainder)

        Set RegXP=New RegExp
            RegXP.IgnoreCase=1
            RegXP.Pattern=digit & "$"

        If RegXP.test(cpf) Then 
            validaCPF = true
        else
            validaCPF = false
        end if
    end if
end Function

function comunicaAssinatura (card,matricula,email)

    dim s
    dim template
    dim existecontaemail
    dim nomeassinante
    dim idcard
    dim msg

    'Abre a conexão
    call BD.conecta
    call BD.insereCampoQuery("MATRICULA",matricula)
    call BD.insereCampoQuery("EMAIL",email)
    call BD.abreQuery("QRY_USUARIO_CADASTRADO",1)

    'Valor de retorno depende da existência do email
    existecontaemail = not BD.EOF

    'Não existe o email. Sai da função
    if BD.EOF then
        call BD.desconecta
        exit function
    end if

    nomeassinante = BD.valor("NOME")
    
    'Prepara o modelo de email para re-envio de SENHA
    if session("idioma")="en" then
        s = "mailCardAssinarEn.htm"
        msg = "Card Signature Request - EASBR"
    else
        s = "mailCardAssinar.htm"
        msg= "Solicitação de Assinatura de Card - EASBR"
    end if    

    call BD.fechaQuery
    call BD.insereCampoQuery("ID",card)    
    call BD.abreQuery("QRY_SELECT_CARDS_POR_ID",1)

    'Não card. Sai da função
    if BD.EOF then
        call BD.desconecta
        exit function
    end if

    idcard = BD.valor("ID_CARD")

    'Cria o objeto de template
    Set Template = new TTemplate
    call Template.create( _
        s, _
        msg, _
        mailREM, _
        mailBCC, _
        0, _
        msg)

    'Insere a chave da confirmação do email
    call Template.insereTag ("ID_CARD",idcard)
    call Template.insereTag ("NOME",nomeassinante)
    
    'Insere o usuário como único destinatário
    call Template.insereDest (nomeassinante, email, "", "")

    'Envia o e-mail
    call Template.enviaEmail (1, 1)

    'Fecha a conexão
    call BD.desconecta

    enviaSenhaEmail = existecontaemail

end function

function obteveconsentimento()

    Dim consentimento 
    Dim httpRequest
    Dim Params
    Dim stringConsentimento

    stringConsentimento = "{""consentimento"":""S""}"

    consentimento = false

	' Cria o objeto ServerXMLHTTP
	Set httpRequest = Server.CreateObject("MSXML2.ServerXMLHTTP")

	' Faz a requisição GET para a URL especificada
	httpRequest.open "GET", urlConsentimento, False

	' Define o tipo de conteúdo da requisição
	httpRequest.setRequestHeader "Content-Type", "application/x-www-form-urlencoded"

	' Envia a requisição com o corpo contendo os parâmetros
	httpRequest.send params

	' Verifica se a requisição foi bem-sucedida (status 200)
	If httpRequest.status = 200 Then
        
		Dim resultjson 
		resultjson = httpRequest.responseText
		if (InStr(resultjson, stringConsentimento) > 0) then
			consentimento = true			
		end if
				
	End If

    obteveconsentimento = consentimento

end function 

function enviaEmailAssinaturaCards (idcard)
    dim s, i,msg
    dim key
    dim template
    dim existecard

    existecard = false

    'Abre a conexão
    call BD.conecta

    call BD.insereCampoQuery("ID",idcard)
    call BD.abreQuery("QRY_CARDS_POR_ID",1)

    'Valor de retorno depende da existência do email
    existecard = not BD.EOF

    'Não existe o card. Sai da função
    if BD.EOF then
        call BD.desconecta
        exit function
    end if

    'Verifica se já enviado anteriormente o e-mail para não enviar de novo
    call BD.fechaQuery
    call BD.insereCampoQuery("ID_CARD",idcard)    
    call BD.abreQuery("QRY_SEL_LOG_EMAIL",1)

    existecard = (BD.BOF AND BD.EOF)

    'Email já enviado. Sai da função
    if Not(BD.BOF AND BD.EOF) then        
        call BD.desconecta
        exit function
    end if

    call BD.fechaQuery
    call BD.insereCampoQuery("ID",idcard)
    call BD.abreQuery("QRY_SEL_ASSINANTES_DOCARD",1)
    
    'Prepara o modelo 
    if session("idioma") = "en" then
        msg = "Card Signing - EASBR"
        s = "mailCardAssinarEn.htm"
    else
        msg = "Assinatura de Card - EASBR"
        s = "mailCardAssinar.htm"
    end if    

    'Cria o objeto de template
    Set Template = new TTemplate

    Do While (not BD.EOF)

        call Template.create( _
            s, _
            EncodeUTF8(msg), _
            mailREM, _
            mailBCC, _
            0, _
            EncodeUTF8(msg))

        'Insere as chaves
        call Template.insereTag ("ID_CARDS",BD.valor("ID_CARDS"))        
        call Template.insereTag ("NOME_ASSINANTE",CleanString(BD.valor("NOME_ASSINANTE")))        
        call Template.insereTag ("NOME_REQUISITANTE",CleanString(BD.valor("NOME_REQUISITANTE")))        
        call Template.insereTag ("DATA_SOLICITACAO",BD.valor("DATA_SOLICITACAO"))        
        call Template.insereTag ("UNIDADE",BD.valor("UNIDADE"))        
        call Template.insereTag ("DESCRICAO_UNIDADE",CleanString(BD.valor("DESCRICAO_UNIDADE")))        
        call Template.insereTag ("DESCRICAO",CleanString(BD.valor("DESCRICAO")))        
        call Template.insereTag ("QUANTIDADE",BD.valor("QUANTIDADE"))        
        call Template.insereTag ("DATA_INICIO",BD.valor("DATA_INICIO"))        
        call Template.insereTag ("DATA_TERMINO",BD.valor("DATA_TERMINO"))        
        call Template.insereTag ("SIGLA",BD.valor("SIGLA"))        
        call Template.insereTag ("NOME_EMPRESA",CleanString(BD.valor("NOME_EMPRESA")))        
        call Template.insereTag ("NOME_NAVIO",CleanString(BD.valor("NOME_NAVIO")))        
        call Template.insereTag ("NUMERO_CONTRATO",BD.valor("NUMERO_CONTRATO"))        

        call Template.insereTag ("URL_GERCARDS",urlApp)

        'Insere o usuário como único destinatário
        call Template.insereDest (CleanString(BD.valor("NOME_ASSINANTE")), BD.valor("EMAIL_ASSINANTE"), "", "")
        
        'Envia o e-mail
        call Template.enviaEmail (1, 1)

	    BD.prox
	Loop

    enviaEmailAssinaturaCards = "enviado"
    exit function

    'Grava o log de envio
    call BD.fechaQuery
    call BD.insereCampoQuery("ID_CARD_ENVIADO",idcard)
    call BD.insereCampoQuery("ID_USUARIO_LOGADO",Session("ID_LOGADO"))
    call BD.abreQuery("QRY_INS_LOG_EMAIL",0)

    'Fecha a conexão
    call BD.desconecta

    enviaEmailAssinaturaCards = existecard

end function


function enviaEmailRejeitadoCards (idcard)
    dim s, i
    dim key
    dim template
    dim existecard
    dim msg

    existecard = false

    'Abre a conexão
    call BD.conecta

    call BD.insereCampoQuery("ID",idcard)
    call BD.abreQuery("QRY_CARDS_POR_ID",1)

    'Valor de retorno depende da existência do email
    existecard = not BD.EOF

    'Não existe o card. Sai da função
    if BD.EOF then
        call BD.desconecta
        exit function
    end if
    
    'Prepara o modelo de email para Card Rejeitado
    if session("idioma")="en" then
        s = "mailCardRejeitadoEn.htm"
        msg = "Rejected Card - EASBR"
    else
        s = "mailCardRejeitado.htm"
        msg = "Card Rejeitado - EASBR"
    end if    

    'Cria o objeto de template
    Set Template = new TTemplate
        
    Do While (not BD.EOF)

        call Template.create( _
            s, _
            EncodeUTF8(msg), _
            mailREM, _
            mailBCC, _
            0, _
            EncodeUTF8(msg))

        'Insere a chave da confirmação do email    
        call Template.insereTag ("ID_CARDS",BD.valor("ID_CARDS"))        
        call Template.insereTag ("NOME_USUARIO_SOLICITACAO",BD.valor("NOME_USUARIO_SOLICITACAO"))        
        call Template.insereTag ("NOME_REQUISITANTE",BD.valor("NOME_REQUISITANTE"))        
        call Template.insereTag ("DATA_SOLICITACAO",BD.valor("DATA_SOLICITACAO"))        
        call Template.insereTag ("UNIDADE",BD.valor("UNIDADE"))        
        call Template.insereTag ("DESCRICAO_UNIDADE",BD.valor("DESCRICAO_UNIDADE"))            
        call Template.insereTag ("DESCRICAO",Replace(BD.valor("DESCRICAO"), vbLf, " ")) 
        call Template.insereTag ("QUANTIDADE",BD.valor("QUANTIDADE"))        
        call Template.insereTag ("DATA_INICIO",BD.valor("DATA_INICIO"))        
        call Template.insereTag ("DATA_TERMINO",BD.valor("DATA_TERMINO"))        
        call Template.insereTag ("SIGLA",BD.valor("SIGLA"))        
        call Template.insereTag ("NOME_EMPRESA",BD.valor("NOME_EMPRESA"))        
        call Template.insereTag ("NOME_NAVIO",BD.valor("NOME_NAVIO"))        
        call Template.insereTag ("NUMERO_CONTRATO",BD.valor("NUMERO_CONTRATO"))  
        call Template.insereTag ("MOTIVO_REJEICAO",Replace(BD.valor("MOTIVO_REJEICAO"), vbLf, " ")) 

        call Template.insereTag ("URL_GERCARDS",urlApp)

        'Insere o usuário como único destinatário
        call Template.insereDest (BD.valor("NOME_USUARIO_SOLICITACAO"), BD.valor("EMAIL_USUARIO_SOLICITACAO"), "", "")
        
        'Envia o e-mail
        call Template.enviaEmail (1, 1)

	    BD.prox
	Loop

    enviaEmailRejeitadoCards = "enviado"
    exit function

    'Grava o log de envio
    call BD.fechaQuery
    call BD.insereCampoQuery("ID_CARD_ENVIADO",idcard)
    call BD.insereCampoQuery("ID_USUARIO_LOGADO",Session("ID_LOGADO"))
    call BD.abreQuery("QRY_INS_LOG_EMAIL",0)

    'Fecha a conexão
    call BD.desconecta

    enviaEmailAssinaturaCards = existecard

end function



function enviaSenhaEmail (matricula,email)
    dim s, i, msg
    dim key
    dim template
    dim existecontaemail

    'Abre a conexão
    call BD.conecta
    call BD.insereCampoQuery("MATRICULA",matricula)
    call BD.insereCampoQuery("EMAIL",email)
    call BD.abreQuery("QRY_ENVIOSENHA",1)

    'Valor de retorno depende da existência do email
    existecontaemail = not BD.EOF

    'Não existe o email. Sai da função
    if BD.EOF then
        call BD.desconecta
        exit function
    end if
    
    'Prepara o modelo de email para re-envio de SENHA
    if session("idioma") = "en" then
        s = "mailRecuperarSenhaEn.htm"
        msg = "Recover Password for the Gercards System - EASBR"
    else
        s = "mailRecuperarSenha.htm"
        msg = "Recuperar Senha do Sistema Gercards - EASBR"
    end if    



    
    'Cria o objeto de template
    Set Template = new TTemplate
    call Template.create( _
        s, _
        msg, _
        mailREM, _
        mailBCC, _
        0, _
        msg)

    'Insere as tags que podem ser substituídas no texto
    for i = 0 to BD.numCampos-1
        s = BD.valor(BD.NomeCampo(i))
        call Template.insereTag (BD.NomeCampo(i), s)
    next

    'Insere a chave da confirmação do email
    key = fnEncBase64(fnBase64Encode(BD.valor("ID") & ";CONFMAIL;" & BD.valor("EMAIL")))
    call Template.insereTag ("ID",BD.valor("ID"))
    call Template.insereTag ("KEY",key)
    call Template.insereTag ("URL_GERCARDS",urlApp)

    'Insere o usuário como único destinatário
    call Template.insereDest (BD.valor("NOME"), BD.valor("EMAIL"), "", "")

    'Envia o e-mail
    call Template.enviaEmail (1, 1)

    'Fecha a conexão
    call BD.desconecta

    enviaSenhaEmail = existecontaemail

end function



'Rotina centralizada de envio de email
'Usando CDOSYS
Sub fnMailSend	(mailFrom, mailTo, mailBCC, mailSubject, mailBody, mailType, attach)

    Dim objCDOSYSMail, objCDOSYSCon, i

    'configurações do componente CDOSYS
    Set objCDOSYSMail = Server.CreateObject("CDO.Message")

    'Cria o objeto para configuração do SMTP
    Set objCDOSYSCon = Server.CreateObject ("CDO.Configuration")

    'SMTP / CDO / Timeout
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserver") = "smtp.ati.pe.gov.br"
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserverport")= 25
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 30
    'objCDOSYSCon.Fields.update

    objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserver") = "smtpout.secureserver.net"
    objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserverport")= 587
    objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate") = 1
    objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2
    objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 30		
    objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/sendusername") = "gercards@estaleiroatlanticosul.com.br"
    objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/sendpassword") = "Estaleir0"    
    objCDOSYSCon.Fields.update

    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserver") = "smtpout.secureserver.net"
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpserverport")= 465
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate") = 1
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 30		
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/sendusername") = "gercards@estaleiroatlanticosul.com.br"
    'objCDOSYSCon.Fields("http://schemas.microsoft.com/cdo/configuration/sendpassword") = "Estaleir0"


    'Anexos
    if attach <> "" then
        attach = split(attach, ";")
        for i = 0 to ubound(attach)
            if FSO.fileExists(attach(i)) then
                objCDOSYSMail.AddAttachment (attach(i))
            end if
        next
    end if

    'Atualiza a configuração do CDOSYS para o envio do e-mail
    Set objCDOSYSMail.Configuration = objCDOSYSCon

    'Informações de header
    objCDOSYSMail.From = mailFrom
    objCDOSYSMail.ReplyTo = mailFrom
    objCDOSYSMail.To = mailTo
    objCDOSYSMAIL.BCC = mailBCC
    objCDOSYSMail.Subject = mailSubject

    If mailType = 0 Then
        objCDOSYSMail.HtmlBody = mailBody
        objCDOSYSMail.fields.update
    Else
        objCDOSYSMail.TextBody = mailBody
    End If

    'Envia o e-mail
    objCDOSYSMail.Send
    'response.write (objCDOSYSMail.From & "<BR>" & objCDOSYSMail.ReplyTo & "<BR>" & objCDOSYSMail.To & "<BR>" & objCDOSYSMAIL.BCC & "<BR>" & objCDOSYSMail.Subject & "<BR>")

    'destrói os objetos
    Set objCDOSYSMail = Nothing
    Set objCDOSYSCon = Nothing

End Sub


Function MD5(text)
    Dim md5Obj, utf8Obj, byteArray, hashText, i

    Set md5Obj = CreateObject("System.Security.Cryptography.MD5CryptoServiceProvider")
    Set utf8Obj = CreateObject("System.Text.UTF8Encoding")

    ' Convert the text to bytes using UTF-8 encoding
    byteArray = md5Obj.ComputeHash_2(utf8Obj.GetBytes_4(text))

    ' Convert the byte array to a hexadecimal string
    hashText = ""
    For i = 1 To LenB(byteArray)
        hashText = hashText & Right("0" & Hex(Ascb(MidB(byteArray, i, 1))), 2)
    Next

    Set md5Obj = Nothing
    Set utf8Obj = Nothing

    MD5 = hashText
End Function


Function HexToDec(hex)
    Dim i, dec
    dec = 0
    For i = 1 To Len(hex)
        dec = dec * 16 + InStr("0123456789ABCDEF", UCase(Mid(hex, i, 1))) - 1
    Next
    HexToDec = dec
End Function

Function DecodeURIComponent(ByVal s)
    Dim i, hexCode, charCode
    Dim decodedString
    
    decodedString = ""
    
    i = 1
    While i <= Len(s)
        If Mid(s, i, 1) = "%" Then
            hexCode = Mid(s, i + 1, 2)
            charCode = HexToDec(hexCode)
            decodedString = decodedString & ChrW(charCode)
            i = i + 3 ' Pular os próximos dois caracteres (o código hexadecimal)
        Else
            decodedString = decodedString & Mid(s, i, 1)
            i = i + 1
        End If
    Wend
    
    DecodeURIComponent = decodedString
End Function




' Função para gerar um token de 20 dígitos (somente números)
Function GenerateToken()
    Dim token, i
    token = ""
    For i = 1 To 20
        token = token & Int(Rnd() * 10)
    Next
    GenerateToken = token
End Function

' Função para verificar se o token expirou (30 minutos de validade)
Function IsTokenExpired(creationTime)
    Dim expirationTime
    expirationTime = DateAdd("n", 30, creationTime)
    IsTokenExpired = Now > expirationTime
End Function

' Função para obter o token atual ou gerar um novo se ainda não existir ou tiver expirado
Function GetToken()
    If Session("token") = "" Or IsTokenExpired(CDate(Session("token_creation_time"))) Then
        Dim token
        token = GenerateToken()
        Session("token") = token
        Session("token_creation_time") = Now
        GetToken = token
    Else
        GetToken = Session("token")
    End If
End Function

' Função para gerar um token CSRF aleatório
Function GenerateCSRFToken()
    Dim chars, length, i, token
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    length = 32
    Randomize
    For i = 1 To length
        token = token & Mid(chars, Int((Len(chars) * Rnd) + 1), 1)
    Next
    GenerateCSRFToken = token
End Function

Function RemoverUltimaPalavra(ByVal str, ByVal palavra)
    Dim posicaoPalavra
    Dim tamanhoPalavra
    Dim resultado
    
    tamanhoPalavra = Len(palavra)
    posicaoPalavra = InStrRev(str, palavra) ' Encontra a posição da última ocorrência da palavra na string
    
    If posicaoPalavra > 0 Then
        resultado = Left(str, posicaoPalavra - 1) ' Extrai a parte da string antes da última ocorrência da palavra
        resultado = resultado & Mid(str, posicaoPalavra + tamanhoPalavra) ' Concatena a parte da string após a última ocorrência da palavra
    Else
        resultado = str ' Retorna a string original se a palavra não for encontrada
    End If
    
    RemoverUltimaPalavra = resultado
End Function

Function GetEmpresa(token,exibeprimeiroregistro,idselecionar)

    If token = Session("csrf_token") Then

        Dim Empresa

        If exibeprimeiroregistro Then
            If idselecionar = "" Then
                Empresa = "<option value='' selected>Empresa...</option>"
            Else
                Empresa = "<option value=''>Empresa...</option>"
            End If
        Else
            If idselecionar = "" Then
                Empresa = "<option value='' selected></option>"
            Else
                Empresa = "<option value='' ></option>"
            End If
        End If
    

        Call BD.conecta
        if (Session("PERFIL") = "A") then
            Call BD.abreQuery("QRY_EMPRESA",1)
        else    
            Call BD.insereCampoQuery("ID_USUARIO",Session("ID_LOGADO"))
            Call BD.abreQuery("QRY_EMPRESA_POR_ID_USUARIO",1)            
        end if    
            
        Do While (not bd.EOF)		
            if CStr(idselecionar) = CStr(BD.valor("ID")) then
                Empresa = Empresa & "<option value=" & BD.valor("ID") & " selected>" & DecodeUTF8(BD.valor("NOME_EMPRESA"))  & "</option>"		
            else
                Empresa = Empresa & "<option value=" & BD.valor("ID") & ">" & DecodeUTF8(BD.valor("NOME_EMPRESA"))  & "</option>"		
            end if
            BD.prox			
        Loop

        Call BD.fechaQuery
        Call BD.limpacamposQuery
        Call BD.desconecta

        GetEmpresa = Empresa

    Else

        GetEmpresa = ""
    
    End If


End Function

Function GetTipoRequisitante(token, exibeprimeiroregistro, idselecionar)

    If token <> Session("csrf_token") Then
        GetTipoRequisitante = ""
        Exit Function
    End If

    Dim TipoRequisitante
    Dim selectedBlank

    ' Define a opção inicial com base nas condições
    If exibeprimeiroregistro Then
        selectedBlank = "Tipo Requisitante..."
    Else
        selectedBlank = ""
    End If

    If idselecionar = "" Then
        TipoRequisitante = "<option value='' selected>" & selectedBlank & "</option>"
    Else
        TipoRequisitante = "<option value=''>" & selectedBlank & "</option>"
    End If

    ' Adiciona as opções com base no idselecionar
    Select Case UCase(CStr(idselecionar))
        Case "E"
            TipoRequisitante = TipoRequisitante & _
                "<option value='E' selected>EAS</option>" & _
                "<option value='A'>ARMADOR</option>"
        Case "A"
            TipoRequisitante = TipoRequisitante & _
                "<option value='E'>EAS</option>" & _
                "<option value='A' selected>ARMADOR</option>"
        Case Else
            TipoRequisitante = TipoRequisitante & _
                "<option value='E'>EAS</option>" & _
                "<option value='A'>ARMADOR</option>"
    End Select

    GetTipoRequisitante = TipoRequisitante

End Function



Function GetNavioPorIdEmpresa(token,exibeprimeiroregistro,idempresa,idselecionar)

       
    If token = Session("csrf_token") Then

        Dim Navio

        If exibeprimeiroregistro Then
            If idselecionar = "" Then
                Navio = "<option value='' selected>Navio...</option>"
            Else
                Navio = "<option value=''>Navio...</option>"
            End If
        Else
            If idselecionar = "" Then
                Navio = "<option value='' selected></option>"
            Else
                Navio = "<option value='' ></option>"
            End If
        End If
    

        Call BD.conecta
        Call BD.insereCampoQuery ("ID_EMPRESA",idempresa)
        Call BD.abreQuery("QRY_NAVIO_POR_ID_EMPRESA",1)
            
        Do While (not bd.EOF)		
            if CStr(idselecionar) = CStr(BD.valor("ID")) then
                Navio = Navio & "<option value=" & BD.valor("ID") & " selected>" & DecodeUTF8(BD.valor("NOME_NAVIO"))  & "</option>"		
            else
                Navio = Navio & "<option value=" & BD.valor("ID") & ">" & DecodeUTF8(BD.valor("NOME_NAVIO"))  & "</option>"		
            end if
            BD.prox			
        Loop

        Call BD.fechaQuery
        Call BD.limpacamposQuery
        Call BD.desconecta

        GetNavioPorIdEmpresa = Navio

    Else

        GetNavioPorIdEmpresa = ""
    
    End If


End Function


Function GetTipoId(token,exibeprimeiroregistro,idselecionar)


    If token = Session("csrf_token") Then

        Dim TipoId

        If exibeprimeiroregistro Then
            If idselecionar = "" Then
                TipoId = "<option value='' selected>Tipo...</option>"
            Else
                TipoId = "<option value=''>Tipo...</option>"
            End If
        Else
            If idselecionar = "" Then
                TipoId = "<option value='' selected></option>"
            Else
                TipoId = "<option value='' ></option>"
            End If
        End If

        Call BD.conecta
        Call BD.abreQuery("QRY_TIPO_ID",1)

        Do While (not bd.EOF)		
            if CStr(idselecionar) = CStr(BD.valor("ID")) then
                TipoId = TipoId & "<option value=" & BD.valor("ID") & " selected>" & (BD.valor("DESCRICAO"))  & "</option>"		
            else
                TipoId = TipoId & "<option value=" & BD.valor("ID") & ">" & (BD.valor("DESCRICAO"))  & "</option>"		
            end if
            BD.prox			
        Loop

        Call BD.fechaQuery
        Call BD.limpacamposQuery
        Call BD.desconecta

        GetTipoId = TipoId

    Else

        GetTipoId = ""
    
    End If


End Function

Sub AtualizarEnvelepId(id,envelopeid)

    if (Session("ID_ASSINAR")) and (id =Session("ID_ASSINAR")) then    
        Call BD.conecta
        Call BD.limpacamposQuery
        Call BD.insereCampoQuery("id",Session("ID_ASSINAR"))
        Call BD.insereCampoQuery("NOME_ASSINANTE",Session("NOME_LOGADO"))
        Call BD.insereCampoQuery("EMAIL_ASSINANTE",Session("EMAIL_LOGADO"))
        Call BD.insereCampoQuery("ENVELOPE_ID",envelopeid)
        Call BD.abreQuery("QRY_ATUALIZA_ENVELOPE_ID",0)        
        Call BD.desconecta
    end if    

End Sub 

Function GetNavio(token)

    If token = Session("csrf_token") Then

        Dim Navio	
        Navio = "<option value='' selected>Navio...</option>"

        Call BD.conecta
        Call BD.abreQuery("QRY_NAVIO",1)
                    
        Do While (not bd.EOF)		
        Navio = Navio & "<option value=" & BD.valor("ID") & ">" & DecodeUTF8(BD.valor("NOME_NAVIO"))  & "</option>"		
            BD.prox			
        Loop

        Call BD.fechaQuery
        Call BD.limpacamposQuery
        Call BD.desconecta

        GetNavio = Navio
    Else
        GetNavio = ""
    End if

End Function

Function GravaLogEnvelope(envelopeid)

    Call BD.conecta
    Call BD.limpaCamposQuery
    Call BD.insereCampoQuery("ID_USUARIO",Session("ID_LOGADO"))
    Call BD.insereCampoQuery("ENVELOPE_ID",envelopeid)
    Call BD.abreQuery("QRY_GRAVA_LOG_ENVELOPE",0)    
    Call BD.desconecta

End Function

Function getIntervaloEnvelope(envelopeid)

    Dim intervaloemminutos
    
    Call BD.conecta
    Call BD.limpaCamposQuery    
    Call BD.insereCampoQuery("ENVELOPE_ID",envelopeid)
    Call BD.abreQuery("QRY_INTERVALO_ENVELOPE",1)
    
    if (BD.eof and BD.bof) then
        intervaloemminutos = 0
    else    
        intervaloemminutos = BD.valor("TEMPOEMMINUTOS")
    end if    

    Call BD.desconecta

    getIntervaloEnvelope = intervaloemminutos

End Function

Function CarregaCards(ID)
    
    Set Session("CARD") = Server.CreateObject("Scripting.Dictionary")
    call session ("CARD").removeAll
    
    'Informações contidas no CARDS
    call bd.conecta
    call bd.limpaCamposQuery
    call bd.insereCampoQuery ("ID",ID)
    call bd.abreQuery ("QRY_CARDS_POR_ID",1)

    call session("CARD").add("ID",bd.valor("ID"))
    call session("CARD").add("ID_EMPRESA_NAVIO",bd.valor("ID_EMPRESA_NAVIO"))
    call session("CARD").add("ID_EMPRESA",bd.valor("ID_EMPRESA"))
    call session("CARD").add("ID_NAVIO",bd.valor("ID_NAVIO"))
    call session("CARD").add("NUMERO_CONTRATO",bd.valor("NUMERO_CONTRATO"))
    call session("CARD").add("NOME_REQUISITANTE",DecodeURIComponent(bd.valor("NOME_REQUISITANTE")))
    call session("CARD").add("ID_CARDS",bd.valor("ID_CARDS"))
    call session("CARD").add("TIPO_OUTRO",bd.valor("TIPO_OUTRO"))
    call session("CARD").add("DESCRICAO",DecodeURIComponent(bd.valor("DESCRICAO")))
    call session("CARD").add("DATA_INICIO",bd.valor("DATA_INICIO"))
    call session("CARD").add("DATA_TERMINO",bd.valor("DATA_TERMINO"))
    call session("CARD").add("QUANTIDADE",bd.valor("QUANTIDADE"))
    call session("CARD").add("UNIDADE",bd.valor("UNIDADE"))
    call session("CARD").add("UNIDADE_OUTRO",bd.valor("UNIDADE_OUTRO"))
    call session("CARD").add("NOME_ASSINANTE",DecodeURIComponent(bd.valor("NOME_ASSINANTE")))
    call session("CARD").add("EMAIL_ASSINANTE",bd.valor("EMAIL_ASSINANTE"))
    call session("CARD").add("ENVELOPE_ID",bd.valor("ENVELOPE_ID"))
    call session("CARD").add("DATA_ASSINATURA",bd.valor("DATA_ASSINATURA"))
    call session("CARD").add("DATA_SOLICITACAO",bd.valor("DATA_SOLICITACAO"))
    call session("CARD").add("ID_CARDS_TIPO_ID",bd.valor("ID_CARDS_TIPO_ID"))
    call session("CARD").add("ID_CARDS_TIPO_DETALHE_ID",bd.valor("ID_CARDS_TIPO_DETALHE_ID"))
    call session("CARD").add("NOME_EMPRESA",DecodeURIComponent(bd.valor("NOME_EMPRESA")))
    call session("CARD").add("NOME_NAVIO",DecodeURIComponent(bd.valor("NOME_NAVIO")))
    call session("CARD").add("MOTIVO_REJEICAO",DecodeURIComponent(bd.valor("MOTIVO_REJEICAO")))
    call session("CARD").add("DATA_REJEICAO",bd.valor("DATA_REJEICAO"))
    call session("CARD").add("QUEM_REJEITOU",bd.valor("QUEM_REJEITOU"))
    call session("CARD").add("TIPO_REQUISITANTE",bd.valor("TIPO_REQUISITANTE"))
    
    if bd.erro <> msgOk or bd.eof Then		
        If bd.erro <> "OK" then
            call session ("CARD").removeAll
            carregaCards = bd.erro
        else
            carregaCards = "Card não encontrado"
            
        End If			
        exit Function
    end If


End Function

Function CleanString(str)
		Dim cleanedStr
		' Remove espaços em branco no início e no final
		cleanedStr = Trim(str)
		' Remove tabulações
		cleanedStr = Replace(cleanedStr, Chr(9), "")
		' Remove quebras de linha e retornos de carro
		cleanedStr = Replace(cleanedStr, Chr(10), "")
		cleanedStr = Replace(cleanedStr, Chr(13), "")
        ' Remove o caractere ¿
        cleanedStr = Replace(cleanedStr, "¿", "")
		' Escapa caracteres JSON problemáticos
		cleanedStr = Replace(cleanedStr, Chr(8), "\b")
		cleanedStr = Replace(cleanedStr, Chr(12), "\f")
		cleanedStr = Replace(cleanedStr, Chr(9), "\t")
		cleanedStr = Replace(cleanedStr, Chr(10), "\n")
		cleanedStr = Replace(cleanedStr, Chr(13), "\r")
		CleanString = cleanedStr
End Function

Function MeuCard(ID)
    
    Set Session("CARD") = Server.CreateObject("Scripting.Dictionary")
    call session ("CARD").removeAll
    
    if (request("id") = "") then
		MeuCard = false
        Exit function
	end if
	    
    'Informações contidas no CARDS
    call bd.conecta
    call bd.limpaCamposQuery
    Call BD.insereCampoQuery ("ID",request("id"))	
	Call BD.insereCampoQuery ("ID_USUARIO",Session("ID_LOGADO"))		
	call BD.AbreQuery("QRY_GET_CARD_POR_USER_ID",1)							

    MeuCard = (BD.numRegs <> 0)


End Function



    

%>

