<!--#include file="gen\fnGEN.asp"--> 
<!--#include file="gen\fnGerais.asp"--> 
<!--#include file="gen\fnIniFiles.asp"--> 
<!--#include file="gen\fnBD.asp"--> 
<!--#include file="js/jquery/json/JSON_2.0.4.asp"-->
<!--#include file="gen\fnUTF8.asp"--> 

<%

	if (session("LOGADO") = false) then 
        response.redirect "login.asp"
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
<!DOCTYPE html>
<html lang="en">

<head>
     	
    <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="author" content="" >
	<meta name="robots" content="" >
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="Atlântico Sul - Heavy Industry Solutions" >
	<meta property="og:title" content="Atlântico Sul - Heavy Industry Solutions" >
	<meta property="og:description" content="Atlântico Sul - Heavy Industry Solutions" >	
	<meta name="format-detection" content="telephone=no">
	
	<!-- PAGE TITLE HERE -->
	<title id="titlepage">Atlântico Sul - Heavy Industry Solutions </title>
	<!-- FAVICONS ICON -->
	<link rel="shortcut icon" type="image/png" href="images/favicon.png" >

    <!-- Datatable -->
    <link href="./vendor/datatables/css/jquery.dataTables.min.css" rel="stylesheet">
    <link href="./vendor/datatables/css/buttons.dataTables.min.css" rel="stylesheet">

    <link href="vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./vendor/jquery-nice-select/css/nice-select.css">
    <link href="vendor/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet">
	<link rel="stylesheet" href="./vendor/select2/css/select2.min.css">

	<!-- Pick date -->
	<link rel="stylesheet" href="vendor/pickadate/themes/default.css">
	<link rel="stylesheet" href="vendor/pickadate/themes/default.date.css">
	<link href="vendor/datepicker/css/bootstrap-datepicker.min.css" rel="stylesheet">
	<style>
		#divtbCards {
			max-height: none;
			overflow-x: auto;
			overflow-y: visible;
		}

		#tbCardsFixedHeader {
			position: fixed;
			top: 0;
			display: none;
			overflow: hidden;
			z-index: 1025;
			background-color: var(--primary);
		}

		#tbCardsFixedHeader table {
			margin: 0;
			table-layout: fixed;
		}

		#tbCardsFixedHeader th {
			background-color: var(--primary);
		}

		.cards-total .card-body {
			padding: 0.75rem !important;
		}

		.cards-total .media > span {
			margin-right: 0.5rem !important;
		}

		.cards-total .media-body p {
			font-size: 0.875rem !important;
			margin-bottom: 0.35rem !important;
		}

		.cards-total .media-body h3 {
			font-size: 1.35rem;
			margin-bottom: 0.35rem;
		}

		.cards-total .progress {
			height: 0.35rem;
			margin-bottom: 0.4rem !important;
		}

		.cards-total .media-body small {
			font-size: 0.75rem !important;
			line-height: 1.2;
		}
	</style>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href="vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet">
	<!-- Custom Stylesheet -->
	
    <!-- Custom Stylesheet -->
	<link href="./vendor/jquery-nice-select/css/nice-select.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

	<style>
		.last-row-height td {
            height: 210px; /* Altura original + 100px adicionais */
        }    

		/* Adjust this style to move the dropdown menu */
		.dropdown {
			top: -15px !important; /* Move up 50px */
		}
        
	</style>
	
</head>

<body>

	<input type="hidden" id="idioma" name="idioma" value="<%=Session("idioma")%>">

	<form id="frmManterCards">

		<input type="hidden" name="csrf_token" id="csrf_token" value="<%= Session("csrf_token") %>">
		<input type="hidden" id="perfil" name="perfil" value="<%=Session("PERFIL")%>">
	

    <!--*******************
        Preloader start
    ********************-->
    	
    <div id="preloader">
	  <div class="loader"></div>
	</div>
    <!--*******************
        Preloader end
    ********************-->


    <!--**********************************
        Main wrapper start
    ***********************************-->
    <div id="main-wrapper">

        <!--**********************************
            Nav header start
        ***********************************-->
		   
				
		<div class="nav-header" style="width:0px;margin-left:20px;">
            <a href="index.html" class="brand-logo d-none">
				<svg class="logo-abbr d-none" width="40" height="40" viewBox="0 0 64 61" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M7.0188 22.6571H56.1512L49.1323 33.9857H28.0756L38.6039 49.6714L31.585 61L7.0188 22.6571Z" fill="var(--primary)"></path>
					<path d="M7.01891 0H56.1513L63.1702 12.2H0L7.01891 0Z" fill="var(--primary)"></path>
				</svg>	
				<div class="brand-title d-none">
					<svg width="100" height="35" viewBox="0 0 176 44" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M23.9171 4.94226V11.1817H7.83215V21.0653H20.1581V27.1942H7.83215V43.4827H0.09375V4.94226H23.9171Z" fill="#2A353A"></path>
						<path d="M33.328 9.24916C31.965 9.24916 30.823 8.82586 29.901 7.97926C29.017 7.09576 28.575 6.00986 28.575 4.72156C28.575 3.43316 29.017 2.36566 29.901 1.51902C30.823 0.635568 31.965 0.193848 33.328 0.193848C34.692 0.193848 35.816 0.635568 36.7 1.51902C37.621 2.36566 38.082 3.43316 38.082 4.72156C38.082 6.00986 37.621 7.09576 36.7 7.97926C35.816 8.82586 34.692 9.24916 33.328 9.24916ZM37.142 12.8935V43.4828H29.404V12.8935H37.142Z" fill="#2A353A"></path>
						<path d="M61.757 12.4517C65.405 12.4517 68.353 13.6113 70.601 15.9303C72.849 18.2126 73.973 21.4151 73.973 25.5378V43.4828H66.234V26.5869C66.234 24.1574 65.626 22.2985 64.41 21.0101C63.194 19.685 61.536 19.0224 59.435 19.0224C57.298 19.0224 55.603 19.685 54.35 21.0101C53.134 22.2985 52.526 24.1574 52.526 26.5869V43.4828H44.788V12.8935H52.526V16.7033C53.558 15.3782 54.866 14.3475 56.451 13.6113C58.072 12.8382 59.841 12.4517 61.757 12.4517Z" fill="#2A353A"></path>
						<path d="M89.0701 37.3538H101.783V43.4827H81.3311V4.94226H89.0701V37.3538Z" fill="#2A353A"></path>
						<path d="M104.711 28.0776C104.711 24.9856 105.319 22.2432 106.535 19.8505C107.788 17.4578 109.465 15.6173 111.565 14.329C113.703 13.0406 116.079 12.3964 118.696 12.3964C120.98 12.3964 122.97 12.8565 124.665 13.7768C126.397 14.6971 127.779 15.8566 128.811 17.2554V12.8934H136.604V43.4827H128.811V39.0103C127.816 40.4459 126.434 41.6422 124.665 42.5993C122.933 43.5196 120.925 43.9797 118.64 43.9797C116.061 43.9797 113.703 43.3171 111.565 41.9919C109.465 40.6668 107.788 38.8078 106.535 36.4152C105.319 33.9857 104.711 31.2065 104.711 28.0776ZM128.811 28.1881C128.811 26.3107 128.442 24.7095 127.705 23.3843C126.968 22.0223 125.973 20.9916 124.72 20.2922C123.468 19.556 122.123 19.1879 120.685 19.1879C119.248 19.1879 117.922 19.5376 116.706 20.237C115.49 20.9364 114.495 21.9671 113.721 23.3291C112.984 24.6543 112.615 26.2371 112.615 28.0776C112.615 29.9181 112.984 31.5378 113.721 32.9366C114.495 34.2986 115.49 35.3477 116.706 36.0839C117.959 36.8201 119.285 37.1882 120.685 37.1882C122.123 37.1882 123.468 36.8385 124.72 36.1391C125.973 35.4029 126.968 34.3722 127.705 33.047C128.442 31.685 128.811 30.0654 128.811 28.1881Z" fill="#2A353A"></path>
						<path d="M151.901 17.3658C152.896 15.8934 154.259 14.6971 155.991 13.7768C157.76 12.8565 159.768 12.3964 162.016 12.3964C164.632 12.3964 166.99 13.0406 169.091 14.329C171.228 15.6173 172.905 17.4578 174.121 19.8505C175.374 22.2064 176 24.9487 176 28.0776C176 31.2065 175.374 33.9857 174.121 36.4152C172.905 38.8078 171.228 40.6668 169.091 41.9919C166.99 43.3171 164.632 43.9797 162.016 43.9797C159.731 43.9797 157.723 43.538 155.991 42.6545C154.296 41.7343 152.932 40.5563 151.901 39.1207V43.4827H144.162V2.62329H151.901V17.3658ZM168.096 28.0776C168.096 26.2371 167.709 24.6543 166.935 23.3291C166.198 21.9671 165.203 20.9364 163.95 20.237C162.734 19.5376 161.408 19.1879 159.971 19.1879C158.57 19.1879 157.244 19.556 155.991 20.2922C154.775 20.9916 153.78 22.0223 153.006 23.3843C152.269 24.7463 151.901 26.3475 151.901 28.1881C151.901 30.0286 152.269 31.6298 153.006 32.9918C153.78 34.3538 154.775 35.4029 155.991 36.1391C157.244 36.8385 158.57 37.1882 159.971 37.1882C161.408 37.1882 162.734 36.8201 163.95 36.0839C165.203 35.3477 166.198 34.2986 166.935 32.9366C167.709 31.5746 168.096 29.9549 168.096 28.0776Z" fill="#2A353A"></path>
					</svg>
				</div> 
            </a>
            <div class="nav-control">
                <div class="hamburger">
                    <span class="line"></span><span class="line"></span><span class="line"></span>
					<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="22" y="11" width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect x="11" width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect x="22" width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect x="11" y="11" width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect x="11" y="22" width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect y="11" width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect x="22" y="22" width="4" height="4" rx="2" fill="#2A353A"></rect>
						<rect y="22" width="4" height="4" rx="2" fill="#2A353A"></rect>
					</svg>		
                </div>
            </div>
        </div>

        <!--**********************************
            Nav header end
        ***********************************-->
		
        <!--**********************************
            Header start
        ***********************************-->
        <!--#include file="cabecalho.asp"--> 
                    
        <!--**********************************
            Header end ti-comment-alt
        ***********************************-->

        <!--**********************************
            Sidebar start
        ***********************************-->
		
		<!--#include file="menu.asp"--> 


        <!--**********************************
            Sidebar end
        ***********************************-->

        <!--**********************************
            Content body start
        ***********************************-->
        <div class="content-body">
            <div class="container-fluid">
            
				<div id="divStatus" class="mb-1">
					<div class="row">
						<div class="col-xl-12">
							<div class="page-titles">
								<div class="d-flex align-items-center flex-wrap ">
									<h3 class="heading traduzir" data-lang="<%=idiomaSessao %>">Gercards - Sistema de Gerenciamento de Cards</h3>																	
								</div>
								<div class="d-flex align-items-center flex-wrap traduzir" data-lang="<%=idiomaSessao %>">									
									<h5 class="text-right"><span class="traduzir" data-lang="<%=idiomaSessao %>">Usuário Logado</span> : <%=EncodeUTF8(Session("NOME_LOGADO"))%></h5>																					
								</div>
							</div>
						</div>						
					</div>
				</div>

				<%if (Session("PERFIL") = "A") or (Session("PERFIL") = "E") then%>
				<div class="col-lg-12 mb-3">					
					<div class="text-end"> 
						<a href="cadastrarcards.asp" class="btn btn-success traduzir" data-lang="<%=idiomaSessao %>" title="Novo card">Novo</a>
					</div>					
				</div>
				<%end if%>

				<div class="col-xl-12">
					<div class="page-titles">
						<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
							<ol class="breadcrumb">
								<li class="breadcrumb-item traduzir" data-lang="<%=idiomaSessao %>"><a href="logoff.asp">Sair</a></li>
								<li class="breadcrumb-item active traduzir" data-lang="<%=idiomaSessao %>" aria-current="page">Meus Cards</li>
							</ol>
							</nav>
					</div>
				</div>
				
				<div class="col-xl-12 col-lg-12" id="divMsg">						
				</div>
				
				<div class="filter cm-content-box box-primary d-none">
                    <div class="content-title">
                        <div class="cpa">
                            <i class="fa-solid fa-filter me-1"></i>Painel      
                        </div>
                        <div class="tools">
                            <a href="javascript:void(0);" id="lnkPainel" class="expand SlideToolHeader"><i class="fal fa-angle-down"></i></a>
                        </div>
                    </div>
                    <div class="cm-content-body  form excerpt">
                        <div class="card-body">							
                        </div>								
                    </div>
                </div>

				<div class="row cards-total">

					<div class="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
						<div id="divassinado" class="widget-stat card bg-success">
							<div class="card-body  p-4">
								<div class="media">
									<span class="me-3">
										<i class="flaticon-381-calendar-1"></i>
									</span>
									<div class="media-body text-white">
										<p class="mb-1 text-white fs-3 traduzir" data-lang="<%=idiomaSessao %>">ASSINADO</p>
										<h3 class="text-white" id="h2totalassinado"></h3>
										<div class="progress mb-2 bg-secondary">
											<div class="progress-bar progress-animated bg-white" id="pgbassinado" style="width: 0%"></div>
										</div>
										<small id="msgassinado" class="fs-4 traduzir" data-lang="<%=idiomaSessao %>">Cards assinados com sucesso.</small>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
						<div id="divnaoassinado" class="widget-stat card bg-secondary">
							<div class="card-body p-4">
								<div class="media">
									<span class="me-3">
										<i class="flaticon-381-calendar-1"></i>
									</span>
									<div class="media-body text-white">
										<p class="mb-1 text-white fs-3 traduzir" data-lang="<%=idiomaSessao %>">NÃO ASSINADO</p>
										<h3 class="text-white" id="h2totalnassinado"></h3>
										<div class="progress mb-2 bg-primary">
											<div class="progress-bar progress-animated bg-white" id="pgbnaoassinado" style="width: 0%"></div>
										</div>
										<small id="msgnaoassinado" class="fs-4 traduzir" data-lang="<%=idiomaSessao %>">Cards solicitados e não assinados.</small>
									</div>
								</div>
							</div>
						</div>
					</div>					
					
					<div class="col-xl-4 col-xxl-4 col-lg-4 col-sm-6">
						<div id="divrejeitado" class="widget-stat card bg-danger">
							<div class="card-body  p-4">
								<div class="media">
									<span class="me-3">
										<i class="flaticon-381-calendar-1"></i>
									</span>
									<div class="media-body text-white">
										<p class="mb-1 text-white fs-3 traduzir" data-lang="<%=idiomaSessao %>">REJEITADOS</p>
										<h3 class="text-white" id="h2totalrejeitado"></h3>
										<div class="progress mb-2 bg-secondary">
											<div class="progress-bar progress-animated bg-white" id="pgbrejeitados" style="width: 0%"></div>
										</div>
										<small id="msgrejeitados" class="fs-4 traduzir" data-lang="<%=idiomaSessao %>">Cards rejeitados pelo cliente.</small>
									</div>
								</div>
							</div>
						</div>
					</div>					
				</div>    

				<div class="filter cm-content-box box-primary">
                    <div class="content-title">
                        <div class="cpa traduzir" data-lang="<%=idiomaSessao %>">
                            <i class="fa-solid fa-filter me-1"></i><span>Filtro </span>      
                        </div>
                        <div class="tools">
                            <a href="javascript:void(0);" id="lnkfiltrar" class="expand SlideToolHeader"><i class="fal fa-angle-down"></i></a>
                        </div>
                    </div>					
                    <div class="cm-content-body  form excerpt">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-xl-1 col-sm-4 mb-3 mb-sm-0 aguarde">
                                    <select class="me-sm-2 default-select form-control wide" id="selEmpresa">
                                        <%=GetEmpresa(Session("csrf_token"),true,"")%>
                                    </select>                                    
                                </div>
                                <div class="col-xl-1 col-sm-4 mb-3 mb-sm-0 aguarde">
                                    <select class="me-sm-2 default-select form-control wide" id="selNavio">                                        
										<option value="">Navio</option>
                                    </select>
                                </div>
                                <div class="col-xl-2 col-sm-4 mb-3 mb-sm-0 aguarde input-data-pequeno">
									<input type="text" class="form-control" id="inputContrato" placeholder="Contrato">
                                </div>
                                
								<div class="col-xl-1 col-sm-3 mb-3 mb-sm-0 aguarde">
                                    <input type="text" class="form-control" id="inputId" placeholder="ID">
                                </div>

								<div class="col-xl-2 col-sm-3 mb-3 mb-sm-0 aguarde input-data-pequeno">																		
									<div class="input-hasicon">
										<input class="form-control bt-datepicker datepicker required"  name="datepicker" id="inputDataInicio" placeholder="Ini Contrato" required="">
										<div class="icon"><i class="far fa-calendar"></i></div>
										<div class="invalid-feedback text-start">
											Informe a data de início.
										</div>
									</div>														
								</div>
								<div class="col-xl-2 col-sm-3 mb-3 mb-sm-0 aguarde input-data-pequeno">									
									<div class="input-hasicon">
										<input class="form-control bt-datepicker datepicker required"  name="datepicker" id="inputDataTermino" placeholder="Fim Contrato" required="">
										<div class="icon"><i class="far fa-calendar"></i></div>
										<div class="invalid-feedback text-start">
											Informe a data de término.
										</div>
									</div>														
								</div>
								
								<div class="col-xl-1 col-sm-4 mb-3 mb-sm-0 aguarde">
                                    <select class="me-sm-2 default-select form-control wide" id="selAssinado">                                        
										<option value="">Status de Análise</option>
										<option value="S">ASSINADO</option>
										<option value="N">NÃO ASSINADO</option>
										<option value="R">REJEITADO</option>
                                    </select>
                                </div>

								<% 
								Dim ExibeArquivado
								if Session("PERFIL") <> "A" then
									 ExibeArquivado = "d-none"
								end if		 
								%>

								<div class="col-xl-auto col-sm-4 mb-3 mb-sm-0 aguarde <%=ExibeArquivado%>">									
									<select class="me-sm-2 default-select form-control wide" id="selTipoRequisitante" placeholder="Tipo Requisitante">
										<option value="">Tipo Requisitante...</option>
										<option value="E">EAS</option>
										<option value="A">Armador</option>
									</select>                                                        
								</div>

								<div class="col-xl-1 col-sm-4 mb-3 mb-sm-0 aguarde <%=ExibeArquivado%>">
									<label class="form-label d-block mb-1">Arquivado?</label> <!-- Este não deve ter 'for' -->
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" id="switchArquivado" name="arquivado" value="N">
										<label class="form-check-label text-status" for="switchArquivado">NÃO</label>
									</div>
								</div>
                                

                                <div class="d-flex justify-content-end mt-3" style="position: sticky; bottom: 0; background: white; z-index: 10; padding-top: 10px;">
									<a href="javascript:void(0);" id="lnkFiltrar" class="btn btn-primary me-2">
										<span>Filtrar </span> <i class="fa fa-search me-1"></i>
									</a>
									<a href="javascript:void(0);" id="lnkRemoverFiltro" class="btn btn-danger light">
										Remover Filtro
									</a>
								</div>
                            </div>
                        </div>								
                    </div>
                </div>
				<div class="row d-none" id="divFiltro">
						<div class="col-xl-12 text-start mb-2">													
							<div class="cardsfiltro" id="h3titulorel">								
							</div>																	
						</div>						
				</div>										

                <div class="row">
					<div class="col-xl-12">
                    </div>
                </div>    
                
                
                <div class="row aguarde">
                    <div class="col-12">						
                        <div class="card">
                            <div class="card-header aguarde traduzir" data-lang="<%=idiomaSessao%>">
                                <h4 class="card-title"> <span id="spantitutototal traduzir">Registro de Cards</span>									
										<span class="badge light badge-primary"><h3 id="h3totaltbacessos"></h3></span>	
								</h4>								
                            </div>
                            <div class="card-body">
                                <div class="table-responsive" id="divtbCards">
                                    <table id="tbCards" class="display table table-striped verticle-middle table-responsive-sm" style="min-width: 845px">
                                        <thead>
                                            <tr style="dropdown">
                                                <th class="traduzir" data-lang="<%=idiomaSessao%>">Ações</th> 	
												<th>Status</th>     		
												<th>N.</th>
												<th>Id</th>
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Contrato</th>                                                
								                <th class="traduzir" data-lang="<%=idiomaSessao%>">Empresa</th>                                                
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Requisitante</th>                                                
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Tipo Requisitante</th>                                                
                                                <th class="traduzir" data-lang="<%=idiomaSessao%>">Quantidade</th>  
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Unidade</th>                                               												
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Solicitação</th>												                                           									
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Descrição</th>
                                            </tr>
                                        </thead>
                                        <tbody>                      
						                </tbody>
                                        <tfoot>
                                            <tr class="last-row-height">
                                                <th class="traduzir" data-lang="<%=idiomaSessao%>">Ações</th> 
												<th class="traduzir" data-lang="<%=idiomaSessao%>" >Status</th>                                                
												<th class="traduzir" data-lang="<%=idiomaSessao%>">N.</th>
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Id</th>
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Contrato</th>												
                                                <th class="traduzir" data-lang="<%=idiomaSessao%>">Empresa</th>                                                
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Requisitante</th>                                                
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Tipo Requisitante</th>                                                
                                                <th class="traduzir" data-lang="<%=idiomaSessao%>">Quantidade</th>                                                
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Unidade</th> 
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Solicitação</th>																							
												<th class="traduzir" data-lang="<%=idiomaSessao%>">Descrição</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>					
				</div>
            </div>
        </div>
        <!--**********************************
            Content body end
        ***********************************-->
		
		<!--**********************************
			Footer start
		***********************************-->
		<!--#include file="rodape.asp"--> 
		<!--**********************************
			Footer end
		***********************************-->



        <!--**********************************
           Support ticket button start
        ***********************************-->

        <!--**********************************
           Support ticket button end
        ***********************************-->

        
    </div>
    <!--**********************************
        Main wrapper end
    ***********************************-->

    <!--**********************************
        Scripts
    ***********************************-->
    <!-- Required vendors -->
    <script src="./vendor/global/global.min.js"></script>
    <script src="./vendor/chart.js/Chart.bundle.min.js"></script>
    
    <!--select plugins-file-->
	<script src="./vendor/select2/js/select2.full.min.js"></script>
	<script src="./js/plugins-init/select2-init.js"></script>
    
	<!-- Apex Chart -->
	<script src="./vendor/apexchart/apexchart.js"></script>
	
    <!-- Datatable -->
    <script src="./vendor/datatables/js/jquery.dataTables.min.js"></script>
	<script type="text/javascript" language="javascript" src="https://cdn.datatables.net/buttons/2.3.6/js/dataTables.buttons.min.js"></script>
	<script type="text/javascript" language="javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
	<script type="text/javascript" language="javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
	<script type="text/javascript" language="javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
	<script type="text/javascript" language="javascript" src="https://cdn.datatables.net/buttons/2.3.6/js/buttons.html5.min.js"></script>
	<script type="text/javascript" language="javascript" src="https://cdn.datatables.net/buttons/2.3.6/js/buttons.print.min.js"></script>
    <script src="./js/plugins-init/datatables.init.js?v=1.3"></script>

	<script src="vendor/jquery-nice-select/js/jquery.nice-select.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min.js"></script>

    <script src="js/dashboard/cms.js"></script>
    <script src="./js/custom.min.js"></script>
	<script src="./js/dlabnav-init.js"></script>
	<script src="./js/demo.js"></script>


	<!-- Daterangepicker -->
    <!-- momment js is must -->
    <script src="vendor/moment/moment.min.js"></script>
    <script src="vendor/bootstrap-daterangepicker/daterangepicker.js"></script>
    <!-- clockpicker -->
    <script src="vendor/clockpicker/js/bootstrap-clockpicker.min.js"></script>
    <!-- asColorPicker -->
    <script src="vendor/jquery-ascolor/jquery-ascolor.min.js"></script>
    <script src="vendor/jquery-asgradient/jquery-asgradient.min.js"></script>
    <script src="vendor/jquery-ascolorpicker/js/jquery-ascolorpicker.min.js"></script>
    <!-- Material color picker -->
    <script src="vendor/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js"></script>
	<script src="vendor/bootstrap-datepicker-master/js/bootstrap-datepicker.min.js"></script>
    <!-- pickdate -->
    <script src="vendor/pickadate/picker.js"></script>
    <script src="vendor/pickadate/picker.time.js"></script>
    <script src="vendor/pickadate/picker.date.js"></script>


    <!-- Daterangepicker -->
    <script src="js/plugins-init/bs-daterange-picker-init.js"></script>
    <!-- Clockpicker init -->
    <script src="js/plugins-init/clock-picker-init.js"></script>
    <!-- asColorPicker init -->
    <script src="js/plugins-init/jquery-ascolorpicker.init.js"></script>
    <!-- Material color picker init -->
    <script src="js/plugins-init/material-date-picker-init.js"></script>
    <!-- Pickdate -->
    <script src="js/plugins-init/pickadate-init.js"></script>
    
	<script src="./js/common.js?v=1.0.0"></script>
	<script src="./js/cards.js"></script>
	<script src="./js/mantercards.js?v=1.9"></script>
	
	</form>
	
	<div class="modal fade" id="ModalCenterConfirmarArquivar">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Confirma o arquivamento deste card?</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal">
					</button>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger light" data-bs-dismiss="modal" id="btnCancelarArquivar">Cancelar</button>
					<button type="button" class="btn btn-primary" id="btnConfirmarArquivar">Confirmar </button>
				</div>
			</div>
		</div>
	</div>	

	<div class="modal fade" id="divModalArquivar">
		<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Arquivar Card</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal">
					</button>
				</div>
				<div class="modal-body">
						<div class="form-validation">
							<form class="needs-validation" id="frmArquivarCards" novalidate >
			
								<div class="row">

									<div class="col-xl-12 col-lg-12 divMsg" id="divMsgArquivar">						
									</div>

									<input type="hidden" id="hddidarquivar" name="hddidarquivar" value="">

									<div class="mb-3 col-md-3">
										<label class="form-label">ID Cards</label>
										<input type="text" class="form-control uppercase readonly-input" id="inputIdCardsArquivar" placeholder="ID" required disabled>
										<div class="invalid-feedback">
											Informe o ID do Cards
										</div>
									</div>
									
									<div class="mb-3 col-md-5">
										<label class="form-label">Requisitante</label>
										<input type="text" class="form-control readonly-input" id="inputRequisitanteArquivar" value="" required disabled>
										<div class="invalid-feedback text-start">
											Informe a Matrícula.
										</div>
									</div>

									<div class="mb-3 col-md-4">
										<label class="form-label">Data da Solicitação</label>
										<input type="text" class="form-control readonly-input" id="inputDataSolicitacaoArquivar" value="" required disabled>
										<div class="invalid-feedback text-start">
											Informe a Data da Solicitação.
										</div>
									</div>


									<div class="mb-3 col-md-6">
										<label class="form-label">Empresa</label>
										<select class="me-sm-2 default-select form-control wide readonly-input" id="selEmpresaArquivar" disabled>                                    
										</select>                                    
										<div class="invalid-feedback">
											Selecione a Empresa
										</div>
									</div>

									<div class="mb-3 col-md-6">
										<label class="form-label">Navio</label>
										<select class="me-sm-2 default-select form-control wide readonly-input" id="selNavioArquivar" disabled>                                    
										</select>                                    
										<div class="invalid-feedback">
											Selecione o Navio
										</div>
									</div>
									
								</div>																																		
							</form>
					
						</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger light" data-bs-dismiss="modal">Fechar</button>
					<button type="button" class="btn btn-primary" id="btnArquivarCard">Arquivar</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="divModalDesarquivar">
		<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Desarquivar Card</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal">
					</button>
				</div>
				<div class="modal-body">
						<div class="form-validation">
							<form class="needs-validation" id="frmDesarquivarCards" novalidate >
			
								<div class="row">

									<div class="col-xl-12 col-lg-12 divMsg" id="divMsgDesarquivar">						
									</div>

									<input type="hidden" id="hddiddesarquivar" name="hddiddesarquivar" value="">

									<div class="mb-3 col-md-3">
										<label class="form-label">ID Cards</label>
										<input type="text" class="form-control uppercase readonly-input" id="inputIdCardsDesarquivar" placeholder="ID" required disabled>
										<div class="invalid-feedback">
											Informe o ID do Cards
										</div>
									</div>
									
									<div class="mb-3 col-md-5">
										<label class="form-label">Requisitante</label>
										<input type="text" class="form-control readonly-input" id="inputRequisitanteDesarquivar" value="" required disabled>
										<div class="invalid-feedback text-start">
											Informe o Requisitante.
										</div>
									</div>

									<div class="mb-3 col-md-4">
										<label class="form-label">Data da Solicitação</label>
										<input type="text" class="form-control readonly-input" id="inputDataSolicitacaoDesarquivar" value="" required disabled>
										<div class="invalid-feedback text-start">
											Informe a Data da Solicitação.
										</div>
									</div>


									<div class="mb-3 col-md-6">
										<label class="form-label">Empresa</label>
										<select class="me-sm-2 default-select form-control wide readonly-input" id="selEmpresaDesarquivar" disabled>                                    
										</select>                                    
										<div class="invalid-feedback">
											Selecione a Empresa
										</div>
									</div>

									<div class="mb-3 col-md-6">
										<label class="form-label">Navio</label>
										<select class="me-sm-2 default-select form-control wide readonly-input" id="selNavioDesarquivar" disabled>                                    
										</select>                                    
										<div class="invalid-feedback">
											Selecione o Navio
										</div>
									</div>
									
								</div>																																		
							</form>
					
						</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger light" data-bs-dismiss="modal">Fechar</button>
					<button type="button" class="btn btn-primary" id="btnDesarquivarCard">Desarquivar</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="ModalCenterConfirmarRejeitar">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header"> 
					<h5 class="modal-title">Confirma a rejeição deste card?</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal">
					</button>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger light" data-bs-dismiss="modal" id="btnCancelarRejeitar">Cancelar</button>
					<button type="button" class="btn btn-primary" id="btnConfirmarRejeitar">Confirmar </button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="divModalRejeitar">
		<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Rejeitar Card</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal">
					</button>
				</div>
				<div class="modal-body">
						<div class="form-validation">
							<form class="needs-validation" id="frmRejeitarCards" novalidate >
			
								<div class="row">

									<div class="col-xl-12 col-lg-12 divMsg" id="divMsgRejeitar">						
									</div>

									<input type="hidden" id="hddidrejeitar" name="hddidrejeitar" value="">

									<div class="mb-3 col-md-3">
										<label class="form-label">ID Cards</label>
										<input type="text" class="form-control uppercase readonly-input" id="inputIdCardsRejeitar" placeholder="ID" required disabled>
										<div class="invalid-feedback">
											Informe o ID do Cards
										</div>
									</div>
									
									<div class="mb-3 col-md-5">
										<label class="form-label">Requisitante</label>
										<input type="text" class="form-control readonly-input" id="inputRequisitanteRejeitar" value="" required disabled>
										<div class="invalid-feedback text-start">
											Informe a Matrícula.
										</div>
									</div>

									<div class="mb-3 col-md-4">
										<label class="form-label">Data da Solicitação</label>
										<input type="text" class="form-control readonly-input" id="inputDataSolicitacaoRejeitar" value="" required disabled>
										<div class="invalid-feedback text-start">
											Informe a Data da Solicitação.
										</div>
									</div>


									<div class="mb-3 col-md-6">
										<label class="form-label">Empresa</label>
										<select class="me-sm-2 default-select form-control wide readonly-input" id="selEmpresaRejeitar" disabled>                                    
										</select>                                    
										<div class="invalid-feedback">
											Selecione a Empresa
										</div>
									</div>

									<div class="mb-3 col-md-6">
										<label class="form-label">Navio</label>
										<select class="me-sm-2 default-select form-control wide readonly-input" id="selNavioRejeitar" disabled>                                    
										</select>                                    
										<div class="invalid-feedback">
											Selecione o Navio
										</div>
									</div>

									<div class="mb-3 col-md-12">
										<label class="col-lg-4 col-form-label text-start" for="txtDescricaoMotivoRejeitar"><span>Motivo da Rejeição</span><b class="required">*</b></label>
										<div class="col-lg-12">
											<textarea class="form-control" id="txtDescricaoMotivoRejeitar" rows="5" maxlength="4000" placeholder="" required></textarea>
											<div class="invalid-feedback text-start">
												Informe o motivo.
											</div>
										</div>
                                    </div>


									
								</div>																																		
							</form>
					
						</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger light" data-bs-dismiss="modal">Fechar</button>
					<button type="button" class="btn btn-primary" id="btnRejeitarCard">Salvar</button>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" tabindex="-1"  aria-modal="true" role="dialog" id="divModalTempo">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Visualização de Cards</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal">
					</button>
				</div>
				<div class="modal-body" id="divMsgCard"></div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger light" data-bs-dismiss="modal">Fechar</button>					
				</div>
			</div>
		</div>
	</div>
</body>
</html>
