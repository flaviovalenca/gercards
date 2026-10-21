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

	response.redirect "mantercards.asp"
	response.end

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
									<h5 class="text-right">Usuário Logado : <%=EncodeUTF8(Session("NOME_LOGADO"))%></h5>																					
								</div>
							</div>
						</div>
						
					</div>
				</div>

				<%if (Session("PERFIL") = "A") then%>
				<div class="col-lg-12 mb-3">					
					<div class="text-end"> 
						<a href="cadastrarcards.asp" class="btn btn-success" title="Novo card">Novo</a>
					</div>					
				</div>
				<%end if%>

				<div class="col-xl-12">
					<div class="page-titles">
						<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
							<ol class="breadcrumb">
								<li class="breadcrumb-item"><a href="logoff.asp">Sair</a></li>
								<li class="breadcrumb-item active" aria-current="page">Meus Cards</li>
							</ol>
							</nav>
					</div>
				</div>
				<div class="row">
				 	<div class="col-xl-3">
						<div style="width: 284px; margin-right: 30px;"  class="ml-auto" role="group" aria-label="1 / 5">
						<div class="card counter">
							<div class="card-body d-flex align-items-center">
								<div class="card-box-icon">
									<svg width="22" height="22" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M22.8333 6.66667V7.16667H23.3333H28.3333C28.6428 7.16667 28.9395 7.28958 29.1583 7.50838C29.3771 7.72717 29.5 8.02391 29.5 8.33333V28.3333C29.5 28.6428 29.3771 28.9395 29.1583 29.1583C28.9395 29.3771 28.6428 29.5 28.3333 29.5H13.3333C13.0239 29.5 12.7272 29.3771 12.5084 29.1583C12.2896 28.9395 12.1667 28.6428 12.1667 28.3333C12.1667 28.0239 12.2896 27.7272 12.5084 27.5084C12.7272 27.2896 13.0239 27.1667 13.3333 27.1667H26.6667H27.1667V26.6667V18.3333V17.8333H26.6667H20H19.5V18.3333V20C19.5 20.3094 19.3771 20.6062 19.1583 20.825C18.9395 21.0438 18.6428 21.1667 18.3333 21.1667H11.6667C11.3572 21.1667 11.0605 21.0438 10.8417 20.825C10.6229 20.6062 10.5 20.3094 10.5 20V18.3333V17.8333H10H3.33333H2.83333V18.3333V26.6667V27.1667H3.33333H6.66667C6.97609 27.1667 7.27283 27.2896 7.49162 27.5084C7.71042 27.7272 7.83333 28.0239 7.83333 28.3333C7.83333 28.6428 7.71042 28.9395 7.49162 29.1583C7.27283 29.3771 6.97609 29.5 6.66667 29.5H1.66667C1.35725 29.5 1.0605 29.3771 0.841709 29.1583C0.622917 28.9395 0.5 28.6428 0.5 28.3333V8.33333C0.5 8.02391 0.622916 7.72717 0.841709 7.50838C1.0605 7.28958 1.35725 7.16667 1.66667 7.16667H6.66667H7.16667V6.66667V1.66667C7.16667 1.35725 7.28958 1.0605 7.50838 0.841709C7.72717 0.622916 8.02391 0.5 8.33333 0.5H21.6667C21.9761 0.5 22.2728 0.622916 22.4916 0.841709C22.7104 1.0605 22.8333 1.35725 22.8333 1.66667V6.66667ZM10 2.83333H9.5V3.33333V6.66667V7.16667H10H20H20.5V6.66667V3.33333V2.83333H20H10ZM16.6667 18.8333H17.1667V18.3333V15V14.5H16.6667H13.3333H12.8333V15V18.3333V18.8333H13.3333H16.6667ZM19.5 15V15.5H20H26.6667H27.1667V15V10V9.5H26.6667H3.33333H2.83333V10V15V15.5H3.33333H10H10.5V15V13.3333C10.5 13.0239 10.6229 12.7272 10.8417 12.5084C11.0605 12.2896 11.3572 12.1667 11.6667 12.1667H18.3333C18.6428 12.1667 18.9395 12.2896 19.1583 12.5084C19.3771 12.7272 19.5 13.0239 19.5 13.3333V15Z" fill="var(--primary)" stroke="var(--primary)"></path>
									</svg>
								</div>
								<div class="chart-num">
									<h2 class="mb-0" id="h2totalassinado">0</h2>
									<p class="mb-0">
										Assinado
									</p>
								</div>
							</div>
						</div>
						</div>
					</div>
					 <div class="col-xl-9">	
						<div style="width: 284px; margin-right: 30px;" class="ml-2" role="group" aria-label="2 / 5">
						<div class="card counter">
							<div class="card-body d-flex align-items-center">
								<div class="card-box-icon">
									<svg width="22" height="22" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M26.9666 8.96667L20.3 0.633334C20.1447 0.436911 19.9473 0.277976 19.7222 0.168333C19.4972 0.0586894 19.2503 0.00115414 19 0H2.33329C1.89126 0 1.46734 0.175595 1.15478 0.488155C0.842221 0.800716 0.666626 1.22464 0.666626 1.66667V10C0.666626 10.442 0.842221 10.8659 1.15478 11.1785C1.46734 11.4911 1.89126 11.6667 2.33329 11.6667C2.77532 11.6667 3.19924 11.4911 3.5118 11.1785C3.82436 10.8659 3.99996 10.442 3.99996 10V3.33333H15.6666V10C15.6666 10.442 15.8422 10.8659 16.1548 11.1785C16.4673 11.4911 16.8913 11.6667 17.3333 11.6667H24V26.6667H3.99996V18.3333C3.99996 17.8913 3.82436 17.4674 3.5118 17.1548C3.19924 16.8423 2.77532 16.6667 2.33329 16.6667C1.89126 16.6667 1.46734 16.8423 1.15478 17.1548C0.842221 17.4674 0.666626 17.8913 0.666626 18.3333V28.3333C0.666626 28.7754 0.842221 29.1993 1.15478 29.5118C1.46734 29.8244 1.89126 30 2.33329 30H25.6666C26.1086 30 26.5326 29.8244 26.8451 29.5118C27.1577 29.1993 27.3333 28.7754 27.3333 28.3333V10C27.3311 9.62406 27.2019 9.2599 26.9666 8.96667ZM19 4.33333L22.2 8.33333H19V4.33333Z" fill="#FF4646"></path>
										<path d="M26.9666 8.96667L20.3 0.633334C20.1447 0.436911 19.9473 0.277976 19.7222 0.168333C19.4972 0.0586894 19.2503 0.00115414 19 0H2.33329C1.89126 0 1.46734 0.175595 1.15478 0.488155C0.842221 0.800716 0.666626 1.22464 0.666626 1.66667V10C0.666626 10.442 0.842221 10.8659 1.15478 11.1785C1.46734 11.4911 1.89126 11.6667 2.33329 11.6667C2.77532 11.6667 3.19924 11.4911 3.5118 11.1785C3.82436 10.8659 3.99996 10.442 3.99996 10V3.33333H15.6666V10C15.6666 10.442 15.8422 10.8659 16.1548 11.1785C16.4673 11.4911 16.8913 11.6667 17.3333 11.6667H24V26.6667H3.99996V18.3333C3.99996 17.8913 3.82436 17.4674 3.5118 17.1548C3.19924 16.8423 2.77532 16.6667 2.33329 16.6667C1.89126 16.6667 1.46734 16.8423 1.15478 17.1548C0.842221 17.4674 0.666626 17.8913 0.666626 18.3333V28.3333C0.666626 28.7754 0.842221 29.1993 1.15478 29.5118C1.46734 29.8244 1.89126 30 2.33329 30H25.6666C26.1086 30 26.5326 29.8244 26.8451 29.5118C27.1577 29.1993 27.3333 28.7754 27.3333 28.3333V10C27.3311 9.62406 27.2019 9.2599 26.9666 8.96667ZM19 4.33333L22.2 8.33333H19V4.33333Z" stroke="none"></path>
										<path d="M14 13.3333C13.558 13.3333 13.134 13.5089 12.8215 13.8215C12.5089 14.1341 12.3333 14.558 12.3333 15V16.6667H10.6667C10.2246 16.6667 9.80072 16.8423 9.48816 17.1548C9.1756 17.4674 9 17.8913 9 18.3333C9 18.7754 9.1756 19.1993 9.48816 19.5118C9.80072 19.8244 10.2246 20 10.6667 20H12.3333V21.6667C12.3333 22.1087 12.5089 22.5326 12.8215 22.8452C13.134 23.1577 13.558 23.3333 14 23.3333C14.442 23.3333 14.866 23.1577 15.1785 22.8452C15.4911 22.5326 15.6667 22.1087 15.6667 21.6667V20H17.3333C17.7754 20 18.1993 19.8244 18.5118 19.5118C18.8244 19.1993 19 18.7754 19 18.3333C19 17.8913 18.8244 17.4674 18.5118 17.1548C18.1993 16.8423 17.7754 16.6667 17.3333 16.6667H15.6667V15C15.6667 14.558 15.4911 14.1341 15.1785 13.8215C14.866 13.5089 14.442 13.3333 14 13.3333Z" fill="#FF4646"></path>
										<path d="M14 13.3333C13.558 13.3333 13.134 13.5089 12.8215 13.8215C12.5089 14.1341 12.3333 14.558 12.3333 15V16.6667H10.6667C10.2246 16.6667 9.80072 16.8423 9.48816 17.1548C9.1756 17.4674 9 17.8913 9 18.3333C9 18.7754 9.1756 19.1993 9.48816 19.5118C9.80072 19.8244 10.2246 20 10.6667 20H12.3333V21.6667C12.3333 22.1087 12.5089 22.5326 12.8215 22.8452C13.134 23.1577 13.558 23.3333 14 23.3333C14.442 23.3333 14.866 23.1577 15.1785 22.8452C15.4911 22.5326 15.6667 22.1087 15.6667 21.6667V20H17.3333C17.7754 20 18.1993 19.8244 18.5118 19.5118C18.8244 19.1993 19 18.7754 19 18.3333C19 17.8913 18.8244 17.4674 18.5118 17.1548C18.1993 16.8423 17.7754 16.6667 17.3333 16.6667H15.6667V15C15.6667 14.558 15.4911 14.1341 15.1785 13.8215C14.866 13.5089 14.442 13.3333 14 13.3333Z" stroke="transparent"></path>
									</svg>
								</div>
								<div class="chart-num">
									<h2 class="mb-0" id="h2totalnassinado">0</h2>
									<p class="mb-0" >
										Não Assinado
									</p>
								</div>
							</div>
							
						</div>
						</div>
					</div>	
                </div>    
				<div class="col-xl-12 col-lg-12" id="divMsg">						
				</div>
				

				<div class="filter cm-content-box box-primary">
                    <div class="content-title">
                        <div class="cpa">
                            <i class="fa-solid fa-filter me-1"></i>Filtro      
                        </div>
                        <div class="tools">
                            <a href="javascript:void(0);" id="lnkfiltrar" class="expand SlideToolHeader"><i class="fal fa-angle-down"></i></a>
                        </div>
                    </div>
                    <div class="cm-content-body  form excerpt">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-xl-2 col-sm-4 mb-3 mb-sm-0 aguarde">
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
										<option value="">Assinado</option>
										<option value="S">SIM</option>
										<option value="N">NÃO</option>
                                    </select>
                                </div>
                                
                                <div class="col-xl-3 col-sm-6">                                    
                                    <a href="javascript:void(0);" id="lnkFiltrar" class="btn btn-primary">Filtrar <i class="fa fa-search me-1"></i></a>
                                    <a href="javascript:void(0);" id="lnkRemoverFiltro" class="btn btn-danger light">Remover Filtro</a>
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
                                <h4 class="card-title"> <span id="spantitutototal">Registro de Cards</span>									
										<span class="badge light badge-primary"><h3 id="h3totaltbacessos"></h3></span>	
								</h4>								
                            </div>
                            <div class="card-body">
                                <div class="table-responsive" id="divtbCards">
                                    <table id="tbCards" class="display table table-striped verticle-middle table-responsive-sm" style="min-width: 845px">
                                        <thead>
                                            <tr>
                                                <th>N.</th>
												<th>Id</th>
												<th>Contrato</th>
                                                <th>Data <br>Contrato</th>                                  
								                <th>Empresa</th>                                                
												<th>Requisitante</th>                                                
                                                <th>Quantidade</th>                                                
												<th>Solicitação</th>
                                                <th >Ações</th> 												
                                            </tr>
                                        </thead>
                                        <tbody>                      
						                </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>N.</th>
												<th>Id</th>
												<th>Contrato</th>
												<th>Data Contrato</th>
                                                <th>Empresa</th>                                                
												<th>Requisitante</th>                                                
                                                <th>Qtde</th>                                                
												<th>Solicitação</th>
                                                <th>Ações</th> 
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
    
	<script src="./js/cards.js"></script>
	<script src="./js/common.js"></script>
	<script src="./js/dashboard.js"></script>
	
	</form>
</body>
</html>