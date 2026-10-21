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

	' Gera um novo token CSRF e armazena na sessão
    Dim csrf_token
    csrf_token = GenerateCSRFToken()
    Session("csrf_token") = csrf_token


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
						<p class="sub-title">Faça seu registro na aplicação e aguarde a liberação do seu acesso.</p>
						<h1 class="title">GerCard </h1>
						<p class="text">Sistema de Gerenciamento de Cards. Com uma interface intuitiva, proporciona controle total sobre seus cards, garantindo eficiência operacional.</p>
					</div>
				</div>
			</div>

			
			<div class="col-lg-6 col-md-7 col-sm-12 mx-auto align-self-center">
				<div class="modal fade" id="modalConfirmar">
					<div class="modal-dialog modal-dialog-centered" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title">GerCards</h5>
								<button type="button" class="btn-close" data-bs-dismiss="modal">
								</button>
							</div>
							<div class="modal-body">
								<!--<p><span>Confirma a Solicitação?</span></p>-->
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-danger light" data-bs-dismiss="modal">Cancelar</button>
								<button type="button" class="btn btn-primary" id="btnRegistrarAcesso">Confirmar</button>
							</div>
						</div>
					</div>
				</div>
				<div class="login-form">				
					<div class="login-head">						
						<!--<h3 class="title">Solicitar acesso.</h3>-->
						<h3><span>Acesso restrito aos usuários do Atlântico Sul, Heavy Industry Solution.</span></h3>
					</div>					
					<form action="#" id="frmRegistrarAcesso">

                        <input type="hidden" name="csrf_token" id="csrf_token" value="<%= Session("csrf_token") %>">
                        <input type="hidden" name="hdddatepicker" id="hdddatepicker" class="datepicker" >

						<div class="col-xl-12 col-lg-12" id="divMsg">						
    					</div>

                        <div class="mb-4 text-start">
							<label class="mb-1 form-label required">Matrícula</label>
							<input type="text" class="form-control" id="inputMatricula" maxlength="15" onkeyup="soNumeros(this);" value="" required>
                            <div class="invalid-feedback text-start">
                                Informe a Matrícula.
                            </div>
						</div>
                        <div class="mb-4 text-start">
							<label class="mb-1 form-label required">Nome</label>
							<input type="text" class="form-control" id="inputNome" value="" required>
                            <div class="invalid-feedback text-start">
                                Informe o Nome.
                            </div>
						</div>
                        <div class="mb-4 text-start">
							<label class="mb-1 form-label required">Email</label>
							<input type="email" class="form-control" id="inputEmail" value="" required>
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
                                Confirme a senha.
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
                                Confirme a senha.
                            </div>
						</div>                        						
						<div class="text-center mb-4">							
							<span>Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.</span>
						</div>	
						<div class="text-center mb-4">													
							<button type="button" class="btn btn-primary"  id="btnConfirmarRegistrar">Registrar</button>
						</div>
						<p class="text-center"><span>Não Autenticado?</span>  
							<a class="btn-link text-primary" href="login.asp">Logar</a>
						</p>
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
	<script src="vendor/global/global.min.js"></script>
	<script src="vendor/bootstrap-select/dist/js/bootstrap-select.min.js"></script>
    <script src="./vendor/jquery-blockui/js/jquery.blockUI.min.js"></script>
	<script src="./js/jquery/jquery.mask.js"></script>	
	<script src="js/custom.min.js"></script>
	<script src="js/dlabnav-init.js"></script>
    <script src="./js/scripts.js"></script>    
	<script src="./js/common.js"></script>    
    <script src="js/cadastraracesso.js?v=1.0.1"></script>
	    
</body>

</html>