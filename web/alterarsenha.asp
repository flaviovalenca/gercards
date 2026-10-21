<!--#include file="gen\fnGEN.asp"--> 
<!--#include file="gen\fnGerais.asp"--> 
<!--#include file="gen\fnIniFiles.asp"--> 
<!--#include file="gen\fnBD.asp"--> 
<!--#include file="js/jquery/json/JSON_2.0.4.asp"-->
<!--#include file="gen\fnUTF8.asp"--> 

<%

	' Gera um novo token CSRF e armazena na sessão
    Dim csrf_token,Key, mensagem, info
    csrf_token = GenerateCSRFToken()
    Session("csrf_token") = csrf_token

	'Decodifica a chave enviada
	info = fnEncBase64(request("key"))
	info = fnBase64Decode(info)

	info = split(info,";")

	mensagem = ""

	If Not IsArray(info) Then		
		mensagem = "Chave inválida."				
	End if
	
	'Se a informação da chave não vier como esperada, sai
	If IsArray(info) Then
		if ubound(info) <> 2 then 
			mensagem = "Chave inválida."		
		end if
	End if

	if request("id") = "" then
		mensagem = "Id não informado."		
	end if

	'Se o id for diferente do informado sai
	If IsArray(info) Then
		if info(0) <> request("id") then
			mensagem = "Id ou Chave não confere"	
		end if
	End if	

	Session("ID")  = request.querystring("id")
	Session("KEY") = request.querystring("key")

	If IsArray(info) Then
		if ubound(info) = 2 then 
			Session("EMAIL") = info(2)		
		end if	
	End if	
	Session("MENSAGEM") = mensagem

%>


<!DOCTYPE html>
<html lang="en">

<head>

		<!-- Title -->
	<title id="titlepage">Atlântico Sul - Heavy Industry Solutions </title>
	
	<!-- Meta -->
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="author" content="Dexignlabs">
	<meta name="robots" content="">
	
	<meta name="keywords" content="siltech, tech, inovação">	
	<meta name="description" content="empresa especializada em desenvolver soluções inovadoras para os mais diversos setores. Nós utilizamos tecnologia de ponta e uma equipe altamente qualificada para criar soluções personalizadas e eficientes para nossos clientes. Se você procura por soluções de inovação que tragam resultados reais para sua empresa, a Siltech é a escolha certa.">
	
	<meta property="og:title" content="Siltech">
	<meta property="og:description" content="empresa especializada em desenvolver soluções inovadoras para os mais diversos setores. Nós utilizamos tecnologia de ponta e uma equipe altamente qualificada para criar soluções personalizadas e eficientes para nossos clientes. Se você procura por soluções de inovação que tragam resultados reais para sua empresa, a Siltech é a escolha certa.">
	<meta property="og:image" content="https://finlab.dexignlab.com/xhtml/social-image.png">
	<meta name="format-detection" content="telephone=no">
	

	<!-- Mobile Specific -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- FAVICONS ICON -->
	<link rel="shortcut icon" type="image/png" href="images/favicon.png">
	<link href="vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet">    
	<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">

	<link href="css/login.css" rel="stylesheet">


<body>

	<input type="hidden" id="idioma" name="idioma" value="<%=Session("idioma")%>">

    <div class="login-account block">


		<div class="row">
			<div class="col-lg-6 align-self-start d-none d-lg-block">
				<div class="account-info-area" style="background-image: url(images/rainbow.gif)">
					<div class="login-content">
						<h1 class="title">GerCard </h1>						
						<p class="sub-title">Alteração de Senha - Informe sua nova senha e confirme.</p>
					</div>
				</div>
			</div>
			<div class="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
				<div class="login-form">
					<%if (session("LOGADO") = false) then %>
						<div class="login-head">
							<h3 class="title">Bem-vindo!</h3>
							<p>Acesso restrito aos usuários do Atlântico Sul, Heavy Industry Solution.</p>
						</div>
					<%end if%>	
					<h6 class="login-title"><span>Alterar Senha</span></h6>
					<div class="row mb-5">
						<div class="col-xl-12 col-sm-6">
                            <div class="d-flex justify-content-center">
                                <img src="images/easbr.png">
                            </div>    
						</div>						
					</div>

					<% if Session("MENSAGEM") <> "" then%>					
					<form action="#" id="formErro">
						
						<div class="alert alert-danger alert-dismissible fade show">
							<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="me-2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
							<strong>Error!</strong> <%=Session("MENSAGEM")%>
							<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close">
							</button>
						</div>
						<%if (session("LOGADO") = false) then %>
						<p class="text-center"><span>Não Cadastrado?</span>  
							<a class="btn-link text-primary" href="cadastraracesso.asp">Registre-se</a>
						</p>
						<p class="text-center"><span>Não Autenticado?</span>  
							<a class="btn-link text-primary" href="login.asp">Logar</a>
						</p>
						<%end if%>
							
						<!--#include file="versao.asp"--> 
						
					</form>
					<% Else%>					
						<form action="#" id="frmAlterarSenha">

							<input type="hidden" name="csrf_token" id="csrf_token" value="<%= Session("csrf_token") %>">
							<input type="hidden" name="hddidusuario" id="hddidusuario" value="<%= Session("ID") %>">
							<input type="hidden" name="hddkey" id="hddkey" value="<%= Session("KEY") %>">

							<div class="col-xl-12 col-lg-12" id="divMsg">						
							</div>

							<%
							if (session("LOGADO")) then %>
								<div class="col-lg-12 mb-3">					
									<div class="text-end"> 
										<a href="mantercards.asp" id="btnVoltar" class="btn btn-success">Voltar</a>								
									</div>	
								</div>							
							<%
						    end if
							%>

							<div class="mb-4 text-start">
								<label class="mb-1 form-label required">Email</label>
								<input type="email" class="form-control readonly-input" id="inputEmail" value="<%=Session("EMAIL")%>" required readonly>
								<div class="invalid-feedback text-start">
									Informe o e-mail.
								</div>
							</div>                        
							<div class="mb-4 position-relative text-start">
								<label class="mb-1 form-label required">Senha</label>
								<input type="password" id="inputSenha" class="form-control" value="" required>
								<span class="show-pass eye">
									<i class="fa fa-eye-slash"></i>
									<i class="fa fa-eye"></i>							
								</span>
								<div class="invalid-feedback text-start">
									<span>Informe a senha.</span>
								</div>
							</div>
							<div class="mb-4 position-relative text-start">
								<label class="mb-1 form-label required">Confirmar Senha</label>
								<input type="password" id="inputConfirmarSenha" class="form-control" value="" required>
								<span class="show-pass eye confirmpass">
									<i class="fa fa-eye-slash"></i>
									<i class="fa fa-eye"></i>							
								</span>
								<div class="invalid-feedback text-start">
									<span>Confirme a senha.</span>
								</div>
							</div>                        	

							<div class="text-center mb-4">							
								Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.
							</div>					
							
							<div class="text-center mb-4">
								<button type="button" id="btnAlterarSenha" class="btn btn-primary btn-block"><span>Confirmar</span></button>
							</div>
							<%if (session("LOGADO") = false) then %>
								<p class="text-center"><span>Não Cadastrado?</span>  
									<a class="btn-link text-primary" href="cadastraracesso.asp"><span>Registre-se</span></a>
								</p>
								<p class="text-center"><span>Não Autenticado?</span>  
									<a class="btn-link text-primary" href="login.asp"><span>Logar</span></a>
								</p>
							<%end if%>
							<!--#include file="versao.asp"--> 

						</form>
					<% End if%>
					
				</div>
			</div>
		</div>
	    
    </div>
	<!--**********************************
        Scripts
    ***********************************-->
    
	<!-- Required vendors -->    
	<script src="vendor/global/global.min.js"></script>
	<script src="vendor/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
    <script src="./vendor/jquery-blockui/js/jquery.blockUI.min.js"></script>
	<script src="js/custom.min.js"></script>
	<script src="js/dlabnav-init.js"></script>
    <script src="./js/scripts.js"></script>    
	<script src="./js/common.js"></script>    
    <script src="js/alterarsenha.js"></script>
	    
</body>

</html>