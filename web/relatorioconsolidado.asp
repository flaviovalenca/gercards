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

	if session("PERFIL") <> "A" then
        response.redirect "mantercards.asp"
        response.end
    end if



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
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href="vendor/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet">
	<!-- Custom Stylesheet -->
	
    <!-- Custom Stylesheet -->
	<link href="./vendor/jquery-nice-select/css/nice-select.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
	
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
									<h3 class="heading">Gercards - Sistema de Gerenciamento de Cards</h3>																	
								</div>
								<div class="d-flex align-items-center flex-wrap ">									
									<h5 class="text-right"><span>Usuário Logado</span> : <%=EncodeUTF8(Session("NOME_LOGADO"))%></h5>																					
								</div>
							</div>
						</div>
						
					</div>
				</div>

				<!--<div class="col-lg-12 mb-3">					
					<div class="text-end"> 
						<a href="#" id="lnkImprimir" class="btn btn-success" title="Exportar para PDF">Exportar para PDF</a>
					</div>					
				</div>
				-->

				<div id="divPrint">
					<div class="col-xl-12">
						<div class="page-titles">
							<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
								<ol class="breadcrumb">
									<li class="breadcrumb-item"><a href="logoff.asp">Sair</a></li>
									<li class="breadcrumb-item active" aria-current="page">Consulta Consolidada</li>
								</ol>
							</nav>
						</div>
					</div>

					<div class="col-xl-12 col-lg-12" id="divMsg">						
					</div>
				
					<div class="filter cm-content-box box-primary">
						<div class="content-title">
							<div class="cpa">
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
											<option value="">Navio...</option>
										</select>
									</div>
									<div class="col-xl-1 col-sm-4 mb-3 mb-sm-0 aguarde">										
										<select class="me-sm-2 default-select form-control wide" required id="selTipoID">
											<option value=""></option>
										</select>
										<div class="invalid-feedback text-start">
											Informe o tipo Id.
										</div>
									</div>
									<div class="col-xl-1 col-sm-4 mb-3 mb-sm-0 aguarde">										
										<select class="me-sm-2 default-select form-control wide" required id="selDetalheTipoID">
											<option value="">Tipo Detalhe Id...</option>
										</select>                                                        
										<div class="invalid-feedback text-start">
											Informe o tipo detalhe.
										</div>
									</div>                                            
									<div class="col-xl-2 col-sm-3 mb-3 mb-sm-0 aguarde">																		
										<div class="input-hasicon">
											<input class="form-control bt-datepicker datepicker required"  name="datepicker" id="inputDataInicio" placeholder="Início Solicitação" required="">
											<div class="icon"><i class="far fa-calendar"></i></div>
											<div class="invalid-feedback text-start">
												Informe a data de início.
											</div>
										</div>														
									</div>
									<div class="col-xl-2 col-sm-3 mb-3 mb-sm-0 aguarde">									
										<div class="input-hasicon">
											<input class="form-control bt-datepicker datepicker required"  name="datepicker" id="inputDataTermino" placeholder="Fim Solicitação" required="">
											<div class="icon"><i class="far fa-calendar"></i></div>
											<div class="invalid-feedback text-start">
												Informe a data de término.
											</div>
										</div>														
									</div>
									<div class="col-xl-3 col-sm-6">                                    
										<a href="javascript:void(0);" id="lnkFiltrarConsolidado" class="btn btn-primary"><span>Filtrar </span> <i class="fa fa-search me-1"></i></a>
										<!--<a href="javascript:void(0);" id="lnkRemoverConsolidadeFiltro" class="btn btn-danger light">Remover Filtro</a>-->
									</div>
								</div>
							</div>								
						</div>
					</div>
					<div class="row">
							<div class="col-xl-12">
								<div class="page-titles">								
									<h3 id="h3titulo" class="heading">Consulta de Registros de Cards</h3>																	
								</div>
							</div>						
					</div>
					<div class="row" id="divFiltro">
					<div class="col-xl-12 text-start mb-2">													
						<div id="h3titulorel">								
						</div>																	
					</div>						
					</div>					
					<div class="row">

						<div class="col-xl-4 col-xxl-6 col-lg-6 col-sm-6" >
							<div id="divassinado" class="widget-stat card bg-success">
								<div class="card-body  p-4">
									<div class="media">
										<span class="me-3">
											<i class="flaticon-381-calendar-1"></i>
										</span>
										<div class="media-body text-white">
											<p class="mb-1 text-white fs-3">ASSINADO</p>
											<h3 class="text-white" id="h2totalassinado"></h3>
											<div class="progress mb-2 bg-secondary">
												<div class="progress-bar progress-animated bg-white" id="pgbassinado" style="width: 0%"></div>
											</div>
											<small id="msgassinado" class="fs-4">Cards assinados com sucesso.</small>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-xxl-6 col-lg-6 col-sm-6">
							<div id="divnaoassinado" class="widget-stat card bg-secondary">
								<div class="card-body p-4">
									<div class="media">
										<span class="me-3">
											<i class="flaticon-381-calendar-1"></i>
										</span>
										<div class="media-body text-white">
											<p class="mb-1 text-white fs-3">NÃO ASSINADO</p>
											<h3 class="text-white" id="h2totalnassinado"></h3>
											<div class="progress mb-2 bg-primary">
												<div class="progress-bar progress-animated bg-white" id="pgbnaoassinado" style="width: 0%"></div>
											</div>
											<small id="msgnaoassinado" class="fs-4">Cards solicitados e não assinados.</small>
										</div>
									</div>
								</div>
							</div>
						</div>					
						
						<div class="col-xl-4 col-xxl-6 col-lg-6 col-sm-6">
							<div id="divrejeitado" class="widget-stat card bg-danger">
								<div class="card-body  p-4">
									<div class="media">
										<span class="me-3">
											<i class="flaticon-381-calendar-1"></i>
										</span>
										<div class="media-body text-white">
											<p class="mb-1 text-white fs-3">REJEITADO</p>
											<h3 class="text-white" id="h2totalrejeitado"></h3>
											<div class="progress mb-2 bg-secondary">
												<div class="progress-bar progress-animated bg-white" id="pgbrejeitados" style="width: 0%"></div>
											</div>
											<small id="msgrejeitados" class="fs-4">Cards rejeitados pelo cliente.</small>
										</div>
									</div>
								</div>
							</div>
						</div>					
					</div>					
					<div class="row">
						<div class="col-xl-4 col-xxl-6 col-lg-6 col-sm-6">
							<div class="wow fadeInUp" data-wow-delay="1s" style="visibility: visible; animation-delay: 1s; animation-name: fadeInUp;">
								<div class="card" id="divGraficoAssinado">
									<div class="card-header border-0">
										<h2 class="card-title"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"><span>Assinado</span></font></font></h2>
										<div class="dropdown custom-dropdown d-none">
											<div class="btn sharp btn-primary tp-btn" data-bs-toggle="dropdown" aria-expanded="false">
												<svg width="5" height="15" viewBox="0 0 6 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M5.19995 10.001C5.19995 9.71197 5.14302 9.42576 5.03241 9.15872C4.9218 8.89169 4.75967 8.64905 4.55529 8.44467C4.35091 8.24029 4.10828 8.07816 3.84124 7.96755C3.5742 7.85694 3.28799 7.80001 2.99895 7.80001C2.70991 7.80001 2.4237 7.85694 2.15667 7.96755C1.88963 8.07816 1.64699 8.24029 1.44261 8.44467C1.23823 8.64905 1.0761 8.89169 0.965493 9.15872C0.854882 9.42576 0.797952 9.71197 0.797952 10.001C0.798085 10.5848 1.0301 11.1445 1.44296 11.5572C1.85582 11.9699 2.41571 12.2016 2.99945 12.2015C3.58319 12.2014 4.14297 11.9694 4.55565 11.5565C4.96832 11.1436 5.20008 10.5838 5.19995 10L5.19995 10.001ZM5.19995 3.00101C5.19995 2.71197 5.14302 2.42576 5.03241 2.15872C4.9218 1.89169 4.75967 1.64905 4.55529 1.44467C4.35091 1.24029 4.10828 1.07816 3.84124 0.967552C3.5742 0.856941 3.28799 0.800011 2.99895 0.800011C2.70991 0.800011 2.4237 0.856941 2.15667 0.967552C1.88963 1.07816 1.64699 1.24029 1.44261 1.44467C1.23823 1.64905 1.0761 1.89169 0.965493 2.15872C0.854883 2.42576 0.797953 2.71197 0.797953 3.00101C0.798085 3.58475 1.0301 4.14453 1.44296 4.55721C1.85582 4.96988 2.41571 5.20164 2.99945 5.20151C3.58319 5.20138 4.14297 4.96936 4.55565 4.5565C4.96832 4.14364 5.20008 3.58375 5.19995 3.00001L5.19995 3.00101ZM5.19995 17.001C5.19995 16.712 5.14302 16.4258 5.03241 16.1587C4.9218 15.8917 4.75967 15.6491 4.55529 15.4447C4.35091 15.2403 4.10828 15.0782 3.84124 14.9676C3.5742 14.8569 3.28799 14.8 2.99895 14.8C2.70991 14.8 2.4237 14.8569 2.15666 14.9676C1.88963 15.0782 1.64699 15.2403 1.44261 15.4447C1.23823 15.6491 1.0761 15.8917 0.965493 16.1587C0.854882 16.4258 0.797952 16.712 0.797952 17.001C0.798084 17.5848 1.0301 18.1445 1.44296 18.5572C1.85582 18.9699 2.41571 19.2016 2.99945 19.2015C3.58319 19.2014 4.14297 18.9694 4.55565 18.5565C4.96832 18.1436 5.20008 17.5838 5.19995 17L5.19995 17.001Z" fill="#01A3FF"></path>
												</svg>
											</div>
											<div class="dropdown-menu dropdown-menu-end" style="">
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Opção 1</font></font></a>
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">opção 2</font></font></a>
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Opção 3</font></font></a>
											</div>
										</div>
									</div>
									<div class="card-body text-center pt-0 pb-2">
										<div id="pieChartAssinado" class="d-inline-block" style="min-height: 182.8px;"></div>
										<div class="chart-items">
											<!--row-->
											<div class="row">
												<!--column-->
												<div class=" col-xl-12 col-sm-12">
													<div class="text-start mt-2 divitemassinado" id="divitemassinado">
													</div>													
												</div>
											</div>
											<!--row closed-->
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="col-xl-4 col-xxl-6 col-lg-6 col-sm-6">
							<div class="wow fadeInUp" data-wow-delay="1s" style="visibility: visible; animation-delay: 1s; animation-name: fadeInUp;">
								<div class="card" id="divGraficoNaoAssinado">
									<div class="card-header border-0">
										<h2 class="card-title"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Não Assinado</font></font></h2>
										<div class="dropdown custom-dropdown d-none">
											<div class="btn sharp btn-primary tp-btn" data-bs-toggle="dropdown" aria-expanded="false">
												<svg width="5" height="15" viewBox="0 0 6 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M5.19995 10.001C5.19995 9.71197 5.14302 9.42576 5.03241 9.15872C4.9218 8.89169 4.75967 8.64905 4.55529 8.44467C4.35091 8.24029 4.10828 8.07816 3.84124 7.96755C3.5742 7.85694 3.28799 7.80001 2.99895 7.80001C2.70991 7.80001 2.4237 7.85694 2.15667 7.96755C1.88963 8.07816 1.64699 8.24029 1.44261 8.44467C1.23823 8.64905 1.0761 8.89169 0.965493 9.15872C0.854882 9.42576 0.797952 9.71197 0.797952 10.001C0.798085 10.5848 1.0301 11.1445 1.44296 11.5572C1.85582 11.9699 2.41571 12.2016 2.99945 12.2015C3.58319 12.2014 4.14297 11.9694 4.55565 11.5565C4.96832 11.1436 5.20008 10.5838 5.19995 10L5.19995 10.001ZM5.19995 3.00101C5.19995 2.71197 5.14302 2.42576 5.03241 2.15872C4.9218 1.89169 4.75967 1.64905 4.55529 1.44467C4.35091 1.24029 4.10828 1.07816 3.84124 0.967552C3.5742 0.856941 3.28799 0.800011 2.99895 0.800011C2.70991 0.800011 2.4237 0.856941 2.15667 0.967552C1.88963 1.07816 1.64699 1.24029 1.44261 1.44467C1.23823 1.64905 1.0761 1.89169 0.965493 2.15872C0.854883 2.42576 0.797953 2.71197 0.797953 3.00101C0.798085 3.58475 1.0301 4.14453 1.44296 4.55721C1.85582 4.96988 2.41571 5.20164 2.99945 5.20151C3.58319 5.20138 4.14297 4.96936 4.55565 4.5565C4.96832 4.14364 5.20008 3.58375 5.19995 3.00001L5.19995 3.00101ZM5.19995 17.001C5.19995 16.712 5.14302 16.4258 5.03241 16.1587C4.9218 15.8917 4.75967 15.6491 4.55529 15.4447C4.35091 15.2403 4.10828 15.0782 3.84124 14.9676C3.5742 14.8569 3.28799 14.8 2.99895 14.8C2.70991 14.8 2.4237 14.8569 2.15666 14.9676C1.88963 15.0782 1.64699 15.2403 1.44261 15.4447C1.23823 15.6491 1.0761 15.8917 0.965493 16.1587C0.854882 16.4258 0.797952 16.712 0.797952 17.001C0.798084 17.5848 1.0301 18.1445 1.44296 18.5572C1.85582 18.9699 2.41571 19.2016 2.99945 19.2015C3.58319 19.2014 4.14297 18.9694 4.55565 18.5565C4.96832 18.1436 5.20008 17.5838 5.19995 17L5.19995 17.001Z" fill="#01A3FF"></path>
												</svg>
											</div>
											<div class="dropdown-menu dropdown-menu-end" style="">
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Opção 1</font></font></a>
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">opção 2</font></font></a>
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Opção 3</font></font></a>
											</div>
										</div>
									</div>
									<div class="card-body text-center pt-0 pb-2">
										<div id="pieChartNaoAssinado" class="d-inline-block" style="min-height: 182.8px;"></div>
										<div class="chart-items">
											<!--row-->
											<div class="row">
												<!--column-->
												<div class=" col-xl-12 col-sm-12">
													<div class="text-start mt-2 divitemnaoassinado" id="divitemnaoassinado">
													</div>
												</div>
											</div>
											<!--row closed-->
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-xxl-6 col-lg-6 col-sm-6">
							<div class="wow fadeInUp" data-wow-delay="1s" style="visibility: visible; animation-delay: 1s; animation-name: fadeInUp;">
								<div class="card" id="divGraficoRejeitado">
									<div class="card-header border-0">
										<h2 class="card-title"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rejeitado</font></font></h2>
										<div class="dropdown custom-dropdown d-none">
											<div class="btn sharp btn-primary tp-btn" data-bs-toggle="dropdown" aria-expanded="false">
												<svg width="5" height="15" viewBox="0 0 6 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M5.19995 10.001C5.19995 9.71197 5.14302 9.42576 5.03241 9.15872C4.9218 8.89169 4.75967 8.64905 4.55529 8.44467C4.35091 8.24029 4.10828 8.07816 3.84124 7.96755C3.5742 7.85694 3.28799 7.80001 2.99895 7.80001C2.70991 7.80001 2.4237 7.85694 2.15667 7.96755C1.88963 8.07816 1.64699 8.24029 1.44261 8.44467C1.23823 8.64905 1.0761 8.89169 0.965493 9.15872C0.854882 9.42576 0.797952 9.71197 0.797952 10.001C0.798085 10.5848 1.0301 11.1445 1.44296 11.5572C1.85582 11.9699 2.41571 12.2016 2.99945 12.2015C3.58319 12.2014 4.14297 11.9694 4.55565 11.5565C4.96832 11.1436 5.20008 10.5838 5.19995 10L5.19995 10.001ZM5.19995 3.00101C5.19995 2.71197 5.14302 2.42576 5.03241 2.15872C4.9218 1.89169 4.75967 1.64905 4.55529 1.44467C4.35091 1.24029 4.10828 1.07816 3.84124 0.967552C3.5742 0.856941 3.28799 0.800011 2.99895 0.800011C2.70991 0.800011 2.4237 0.856941 2.15667 0.967552C1.88963 1.07816 1.64699 1.24029 1.44261 1.44467C1.23823 1.64905 1.0761 1.89169 0.965493 2.15872C0.854883 2.42576 0.797953 2.71197 0.797953 3.00101C0.798085 3.58475 1.0301 4.14453 1.44296 4.55721C1.85582 4.96988 2.41571 5.20164 2.99945 5.20151C3.58319 5.20138 4.14297 4.96936 4.55565 4.5565C4.96832 4.14364 5.20008 3.58375 5.19995 3.00001L5.19995 3.00101ZM5.19995 17.001C5.19995 16.712 5.14302 16.4258 5.03241 16.1587C4.9218 15.8917 4.75967 15.6491 4.55529 15.4447C4.35091 15.2403 4.10828 15.0782 3.84124 14.9676C3.5742 14.8569 3.28799 14.8 2.99895 14.8C2.70991 14.8 2.4237 14.8569 2.15666 14.9676C1.88963 15.0782 1.64699 15.2403 1.44261 15.4447C1.23823 15.6491 1.0761 15.8917 0.965493 16.1587C0.854882 16.4258 0.797952 16.712 0.797952 17.001C0.798084 17.5848 1.0301 18.1445 1.44296 18.5572C1.85582 18.9699 2.41571 19.2016 2.99945 19.2015C3.58319 19.2014 4.14297 18.9694 4.55565 18.5565C4.96832 18.1436 5.20008 17.5838 5.19995 17L5.19995 17.001Z" fill="#01A3FF"></path>
												</svg>
											</div>
											<div class="dropdown-menu dropdown-menu-end" style="">
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Opção 1</font></font></a>
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">opção 2</font></font></a>
												<a class="dropdown-item" href="javascript:void(0);"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Opção 3</font></font></a>
											</div>
										</div>
									</div>
									<div class="card-body text-center pt-0 pb-2">
										<div id="pieChartRejeitado" class="d-inline-block" style="min-height: 182.8px;"></div>
										<div class="chart-items">
											<!--row-->
											<div class="row">
												<!--column-->
												<div class=" col-xl-12 col-sm-12">
													<div class="text-start mt-2 divitemrejeitado" id="divitemrejeitado">													
													</div>
												</div>
											</div>
											<!--row closed-->
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>



					<div class="table-responsive" id="divtbCards">
						<div class="col-xl-12 text-start mb-2">													
							<table id="tbCards" class="display table table-striped verticle-middle table-responsive-sm" style="min-width: 845px">
								<thead>
									<tr>
										<th>N.</th>
										<th>Id</th>
										<th>Contrato</th>                                                
										<th>Empresa</th>                                                
										<th>Requisitante</th>  
										<th>Tipo Requisitante</th>                                                
										<th>Solicitação</th> 										
										<th>Quantidade</th>
										<th >Unidade</th> 												
										<th>Assinante</th>
										<th>Descrição</th>                                                        
										<th>Status</th>										
									</tr>
								</thead>
								<tbody>                      
								</tbody>
								<tfoot>
									<tr>
										<th>N.</th>
										<th>Id</th>
										<th>Contrato</th>                                                
										<th>Empresa</th>                                                
										<th>Requisitante</th> 
										<th>Tipo Requisitante</th>                 										
										<th>Solicitação</th>                                               
										<th>Quantidade</th> 
										<th >Unidade</th> 												
										<th>Assinante</th>
										<th>Descrição</th>                                                        
										<th>Status</th>
										
									</tr>
								</tfoot>
							</table>
						</div>									
                    </div>

					</div>
				</div>

                <div class="row">
					<div class="col-xl-12">
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
    <script src="./js/plugins-init/datatables.init.js?v=1.0"></script>

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
    
	<script src="./js/cards.js?v=1.0.2"></script>
	<script src="./js/common.js?v=1.0.2"></script>
    <script src="./js/jquery/jspdf.min.js"></script>
    <script src="./js/jquery/html2canvas.min.js"></script>

	<script src="./js/grafico.js?v=1.0.2"></script>
	<script src="./js/relatorioconsolidado.js?v=1.0.14"></script>	
	
	</form>
	
</body>
</html>