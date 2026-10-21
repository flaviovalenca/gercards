<%
    if (session("logado") = false) then 
'        response.redirect "login.html"
'		response.end
    end if

	if (request.querystring("id") <> "") then
		Session("idlogin") = request.querystring("id")
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

 
    <!-- Custom Stylesheet -->
	<link href="./vendor/jquery-nice-select/css/nice-select.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

</head>

<body>

	<form id="frmHistorico">

		<input type="hidden" id="idnavio" name="idnavio" value="<%=Session("idlogin")%>">

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
        <div class="header">
            <div class="header-content">
                <nav class="navbar navbar-expand">
                    <div class="collapse navbar-collapse justify-content-left">
                        <div class="header-left" style="display:none;">
							<div class="input-group search-area">
								<input type="text" class="form-control" placeholder="Pesquise aqui...">
								<span class="input-group-text"><a href="javascript:void(0)">
									<svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M17.5605 15.4395L13.7527 11.6317C14.5395 10.446 15 9.02625 15 7.5C15 3.3645 11.6355 0 7.5 0C3.3645 0 0 3.3645 0 7.5C0 11.6355 3.3645 15 7.5 15C9.02625 15 10.446 14.5395 11.6317 13.7527L15.4395 17.5605C16.0245 18.1462 16.9755 18.1462 17.5605 17.5605C18.1462 16.9747 18.1462 16.0252 17.5605 15.4395V15.4395ZM2.25 7.5C2.25 4.605 4.605 2.25 7.5 2.25C10.395 2.25 12.75 4.605 12.75 7.5C12.75 10.395 10.395 12.75 7.5 12.75C4.605 12.75 2.25 10.395 2.25 7.5V7.5Z" fill="#01A3FF"/>
									</svg>
								</a></span>
							</div>
                        </div>
						
						<ul class="navbar-nav header-left">
							<li class="nav-item">							
							  <li>																  
								  <img class="logo-abbr dark-logo" width="200" src="./images/easbr.png" style="max-width: 100%;" alt="">								
							  </li>							
							  <li></li>															
							  <li>
								  <img class="logo-abbr dark-logo" width="200" src="<%=Session("Logo")%>"  style="max-width: 100%;" alt="">								
							  </li>							
							</li>
						</ul>

						  
						<ul class="navbar-nav header-right d-none">
							<li class="nav-item" style="margin-left: 30px">							
								<li><img class="logo-abbr dark-logo" width="200" src="./images/easbr.png" alt=""></li>							
								<li></li>															
								<li><img class="logo-abbr dark-logo" width="200" src="<%=Session("Logo")%>" alt=""></li>							
							</li>
						</ul>
					
                    </div>
				</nav>
			</div>
		</div>
                    
        <!--**********************************
            Header end ti-comment-alt
        ***********************************-->

        <!--**********************************
            Sidebar start
        ***********************************-->
		
		<div class="dlabnav">			
			<div class="dlabnav-scroll">	
				
				<ul class="metismenu" id="menu">										
					<li class="mm-active"><a class="has-arrow" href="javascript:void(0);" aria-expanded="false">
							<i class="material-icons-outlined">dashboard</i>
							<span class="nav-text">Serviços</span>
						</a>						
						<ul aria-expanded="false">                            
							<li><a href="index.asp?id=<%=Session("idlogin")%>">Home</a></li>
							<li class="mm-active"><a href="index.asp?id=<%=Session("idlogin")%>">Histórico de Acessos</a></li>
							<% if (Session("Login") = "ADMIN") then %>
							<li><a href="admin.asp">Painel de Administração</a></li>
							 <%end if%>
                            <li><a href="logoff.asp">Sair</a></li>
						</ul>

					</li>
				</ul>
			</div>
        </div>
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
									<h3 class="heading">Histórico de Acesso às catracas</h3>																	
								</div>
								<div class="d-flex align-items-center flex-wrap ">
									<% if Session("idlogin") = 0 then%>
									<h5 class="text-right"> <%=Session("Login")%></h5>												
									<% else %>
										<h5 class="text-right">Navio :  <%=Session("nomenavio")%></h5>												
									<% end if%>
								</div>
							</div>
						</div>
						
					</div>
				</div>

				<div class="filter cm-content-box box-primary">
                    <div class="content-title">
                        <div class="cpa">
                            <i class="fa-solid fa-filter me-1"></i>Filtro      
                        </div>
                        <div class="tools">
                            <a href="javascript:void(0);" class="expand SlideToolHeader"><i class="fal fa-angle-down"></i></a>
                        </div>
                    </div>
                    <div class="cm-content-body  form excerpt">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-xl-2 col-sm-4 mb-3 mb-sm-0 aguarde">
                                    <select class="me-sm-2 default-select form-control wide" id="selEstrutura">
                                        <option selected value="">Empresa...</option>                                                
                                    </select>                                    
                                </div>
                                <div class="col-xl-2 col-sm-4 mb-3 mb-sm-0 aguarde">
                                    <select class="me-sm-2 default-select form-control wide" id="selGrupo">
                                        <option selected value="">Grupo...</option>                                                
                                    </select>
                                </div>
                                <div class="col-xl-2 col-sm-4 mb-3 mb-sm-0 aguarde">
                                    <select class="me-sm-2 default-select form-control wide" id="selEquipamento">
                                        <option selected value="">Equipamento...</option>                                                
                                    </select>
                                </div>
                                
								<div class="col-xl-2 col-sm-3 mb-3 mb-sm-0 aguarde">
                                    <select class="me-sm-2 default-select form-control wide" id="selEntradaSaida">										
                                        <option value="1">Entrada</option>                                                
										<option  value="2">Saída</option>                                                
										<option selected value="3">Entrada/Saída</option>                                                
                                    </select>
                                </div>

								<div class="col-xl-1 col-sm-3 mb-3 mb-sm-0 aguarde">
									<select class="me-sm-2 default-select form-control wide" id="selDataHistorico" style="width:150px;">
										<option selected value="">Hoje</option>                                                
									</select>
								</div>
								
                                
                                <div class="col-xl-3 col-sm-6">                                    
                                    <a href="javascript:void(0);" id="lnkFiltrarHistoricoAcessos" class="btn btn-primary">Filtrar <i class="fa fa-search me-1"></i></a>
                                    <a href="javascript:void(0);" id="lnkRemoverFiltroHistoricoAcessos" class="btn btn-light">Remover Filtro</a>
                                </div>
                            </div>
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
                            <div class="card-header aguarde">
                                <h4 class="card-title"> <span id="spantitutoacessos">Registro de Entrada/Saída dos Colaboradores</span>									
										<span class="badge light badge-primary"><h3 id="h3totaltbacessos"></h3></span>	
								</h4>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table id="tbAcessos" class="display" style="min-width: 845px">
                                        <thead>
                                            <tr>
                                                <th>N.</th>
                                                <th>Credencial</th>
                                                <th>Matrícula</th>
                                                <th>Nome</th>
                                                <th>Empresa</th>
                                                <th>Grupo</th>
                                                <th>Equipamento</th>
                                                <th class="entradasaida">Data do Acesso</th> 
												<th>Tipo do Acesso</th>                                               
                                            </tr>
                                        </thead>
                                        <tbody>                                            
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>N.</th>
                                                <th>Credencial</th>
                                                <th>Matrícula</th>
                                                <th>Nome</th>
                                                <th>Empresa</th>
                                                <th>Grupo</th>
                                                <th>Equipamento</th>
                                                <th class="entradasaida">Data do Acesso </th>
												<th>Tipo do Acesso</th>                                               
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
		<div class="footer out-footer">
			<div class="copyright">
				<p>Copyright © AtlânticoSul &amp; Desenvolvido por <a href="https://www.siltecnologia.com" target="_blank">SilTech</a> 2023  - Versão 1.0.4 de 12/08/2023</p>
			</div>
		</div>
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

	<script src="./js/index.js"></script>
    <script src="./js/easbr.js?v=1.26"></script>
	<!--<script src="./js/styleSwitcher.js"></script>-->
	
	<script>
		//	setInterval(atualizarTempo, 1000);
		$(document).ready(function () {		
		
			if(!navigator.userAgent.match(/Mobile/)) {
				$('#main-wrapper').toggleClass("menu-toggle");
				$(".hamburger").toggleClass("is-active");
				body.attr('data-sidebar-style', 'mini');
				setCookie('sidebarStyle', 'mini');
			}	

			$.ajax({
				url: serverapi + "/easbr.asp?funcao=getdatahistoricoacesso&id=" + $('#idnavio').val() ,
				method: "GET",
				dataType: "json",            
				success: function(data) {        
					$("#selDataHistorico").empty();
					$("#selDataHistorico").append('<option value="">Hoje</option>');
					$.each(data.REGISTROS, function(index, option) {
						$("#selDataHistorico").append('<option value="' + option.DATA + '">' + option.DATA + '</option>');
					});                                
					$('.content-body').unblock();
				},
				error: function() {                
					$('.content-body').unblock();
				}
			})
					
		});
    </script>
	</form>
</body>
</html>