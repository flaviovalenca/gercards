<!--#include file="gen\fnGEN.asp"--> 
<!--#include file="gen\fnGerais.asp"--> 
<!--#include file="gen\fnIniFiles.asp"--> 
<!--#include file="gen\fnBD.asp"--> 
<!--#include file="js/jquery/json/JSON_2.0.4.asp"-->
<!--#include file="gen\fnUTF8.asp"--> 

<%

    if (session("LOGADO") = true) then 
        response.redirect "mantercards.asp"
		response.end
    end if

	if (request.querystring("id") <> "") then
		Session("ID_LOGADO") = request.querystring("id")
	end if

	' Gera um novo token CSRF e armazena na sessão
    Dim csrf_token
    csrf_token = GenerateCSRFToken()
    Session("csrf_token") = csrf_token
	
%>

<%
' Se já tem o parâmetro lang, segue normalmente
If Request.QueryString("lang") = "" Then
%>
<script>
    // Verifica se existe lang no localStorage
    const lang = localStorage.getItem("lang") || "pt"; // fallback para 'pt'
    const url = new URL(window.location.href);

    // Se ainda não tem o parâmetro lang na URL
    if (!url.searchParams.get("lang")) {
        url.searchParams.set("lang", lang);
        window.location.href = url.toString(); // Redireciona com ?lang=...
    }
</script>
<%
    Response.End ' Impede que o restante do ASP continue até redirecionar
End If
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
	<meta property="og:image" content="https://gercards.easbr.com/images/logo_lgr.png">
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
						<p class="sub-title traduzir" data-lang="<%=idiomaSessao %>">Realize seu Login na aplicação para solicitar autorização do seu card.</p>
						<h1 class="title">GerCard </h1>
						<p class="text traduzir" data-lang="<%=idiomaSessao %>">Sistema de Gerenciamento de Cards. Com uma interface intuitiva, proporciona controle total sobre seus cards, garantindo eficiência operacional.</p>
					</div>
				</div>
			</div>
			<div class="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
				<div class="login-form">
					<div class="login-head">
						<h3 class="title traduzir" data-lang="<%=idiomaSessao %>"  >Bem-vindo!</h3>
						<p class="traduzir" data-lang="<%=idiomaSessao %>">Acesso restrito aos usuários do Atlântico Sul, Heavy Industry Solution.</p>
					</div>
					<h6 class="login-title"><span>Login</span></h6>
					<div class="row mb-5">
						<div class="col-xl-12 col-sm-6">
                            <div class="d-flex justify-content-center">
                                <img src="images/easbr.png">
                            </div>    
						</div>						
					</div>
					<form action="#" id="formLogin">

                        <input type="hidden" name="csrf_token" id="csrf_token" value="<%= Session("csrf_token") %>">
                        <input type="hidden" name="hdddatepicker" id="hdddatepicker" class="datepicker" >

						<div class="col-xl-12 col-lg-12" id="divMsg">						
    					</div>

                        
                        <div class="mb-4 text-start">
							<label class="mb-1 form-label required">Email</label>
							<input type="email" class="form-control" id="inputEmail" value="" required>
                            <div class="invalid-feedback text-start traduzir" data-lang="<%=idiomaSessao %>">
                                Informe o e-mail.
                            </div>
						</div>
                        
						<div class="mb-4 position-relative text-start">
							<label class="mb-1 form-label required traduzir" data-lang="<%=idiomaSessao %>">Senha</label>
							<input type="password" id="inputSenha" class="form-control" value="" required>
							<span class="show-pass eye">
								<i class="fa fa-eye-slash"></i>
								<i class="fa fa-eye"></i>							
							</span>
                            <div class="invalid-feedback text-start traduzir" data-lang="<%=idiomaSessao %>">
                                Informe a senha.
                            </div>
						</div>
                        <div class="form-row d-flex justify-content-between mt-4 mb-2">
							<div class="mb-4">
								<div class="form-check custom-checkbox mb-3">
									<input type="checkbox" class="form-check-input" id="ckbSalvarSenha">
									<label class="form-check-label traduzir" data-lang="<%=idiomaSessao %>" for="ckbSalvarSenha">Salvar minha senha.</label>
								</div>                                
							</div>
							<div class="mb-4">
								<a href="esqueceusenha.asp" class="btn-link text-primary traduzir" data-lang="<%=idiomaSessao %>">Esqueceu a senha?</a>
							</div>
						</div>
						
						<div class="text-center mb-4">
							<button type="button" id="btnLogar" class="btn btn-primary btn-block traduzir" data-lang="<%=idiomaSessao %>">Acessar</button>
						</div>
						<p class="text-center traduzir" data-lang="<%=idiomaSessao %>"><span>Não Cadastrado?</span>  
							<a class="btn-link text-primary" href="cadastraracesso.asp">Registre-se</a>
						</p>
						<div class="text-center mb-4">
							<a href="#" class="btn btn-outline-primary btn-sm me-2" onclick="setLanguage('pt')">
								<img src="images/flags/flag-br.png" alt="Português" style="width: 20px; height: 14px; margin-right: 5px;">
								Português
							</a>
							<a href="#" class="btn btn-outline-secondary btn-sm" onclick="setLanguage('en')">
								<img src="images/flags/flag-us.png" alt="English" style="width: 20px; height: 14px; margin-right: 5px;">
								English
							</a>
						</div>
						
						<!--#include file="versao.asp"--> 
       			</form>
				</div>
			</div>
		</div>
	    
    </div>
	<!--**********************************
        Scripts
    ***********************************-->
    
	<!-- Required vendors -->    
	<script src="./vendor/global/global.min.js"></script>
	<script src="./vendor/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
    <script src="./vendor/jquery-blockui/js/jquery.blockUI.min.js"></script>
	<script src="./js/custom.min.js"></script>
	<script src="./js/dlabnav-init.js"></script>
    <script src="./js/scripts.js?v=1.0.2"></script>    
    <script src="./js/common.js?v=1.0.3"></script>
	<script src="./js/login.js?v=1.0.2"></script>
	    
</body>

</html>
