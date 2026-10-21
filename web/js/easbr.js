let executandoAtualizacao = false;
  
function renderizaSituacao(data){

    // Iterar sobre as chaves usando um loop for
    for (let i = 0; i < data.REGISTROS.length; i++) {
                        
        if ((data.REGISTROS[i].ESTADO == 1) && (data.REGISTROS[i].MODO == 0)) {                      
            $('#div_equipamento_' + data.REGISTROS[i].NUMERO).removeClass("bg-dark");  
            $('#div_equipamento_' + data.REGISTROS[i].NUMERO).removeClass("bg-danger");
            $('#div_equipamento_' + data.REGISTROS[i].NUMERO).addClass("bg-success");
            $('#msg_equipamento_' + data.REGISTROS[i].NUMERO).html('Catraca operacional');
            $('#pgb_equipamento_' + data.REGISTROS[i].NUMERO).css('width','100%');
            $('#h2_equipamento_' + data.REGISTROS[i].NUMERO).html('ON');
        }
        else {
            $('#div_equipamento_' + data.REGISTROS[i].NUMERO).removeClass("bg-dark");
            $('#div_equipamento_' + data.REGISTROS[i].NUMERO).removeClass("bg-success");
            $('#div_equipamento_' + data.REGISTROS[i].NUMERO).addClass("bg-danger");                
            $('#msg_equipamento_' + data.REGISTROS[i].NUMERO).html('Catraca em modo ' + data.REGISTROS[i].MODO_DESCRICAO + ' e estado ' +   data.REGISTROS[i].ESTADO_DESCRICAO);
            $('#pgb_equipamento_' + data.REGISTROS[i].NUMERO).css('width','0%');
            $('#h2_equipamento_' + data.REGISTROS[i].NUMERO).html('OFF');
        }
    
    }

    $('#spandiqueseco').html(data.REGISTROS[0].DIQUE_SECO);                    
                        

}

// Verifica se a página está carregando em um dispositivo móvel
function isMobile() {
    const userAgent = navigator.userAgent;
    return /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent);
}

function atualizarSituacao(reinicia) {
    
    var id = ($('#idnavio').val());

    if (executandoAtualizacao) {
        return;
    }

    if ($('#divStatus').hasClass('blockUI')){        
        return;
    }

    executandoAtualizacao = true;
    
    //var aguarde = '<div class="alert alert-primary  fade show"> <strong style="font-size:20px;color:#FFFFFF;">Atualizando...</strong> </div>';
    var aguarde = '<div class="widget-stat card" style="opacity:0.7">' +
                        '<div class="card-body p-4">'+
                            '<h4 class="card-title" id="divMsgStatus">Atualizando...</h4>'+														
                        '</div>'+
                    '</div>';

    if (isMobile()) {
        aguarde = '';
    }                    

    $('#divStatus').block({
        message: '<img src="images/gif/aguarde.gif" width="100px" height="100px" />' + aguarde,         
        overlayCSS: {
           backgroundColor: '#01A3FF', // cor do background
            opacity: 0.2 // opacidade do background
        },
        css: {
           border: 'none',
           backgroundColor: 'transparent'
        }                
    });

    $('#divStatus').css('text-align', 'center'); // adiciona a propriedade text-align:center ao elemento .content-body
    
    
    atualizacaoConcluida = false;

    $.when(
              
       
        $.ajax({
            url: serverapi + '/easbr.asp?funcao=getstatuscatraca',
            type: 'GET',
            dataType: 'json',        
            beforeSend: function(){
                $('#divMsgStatus').html('Atualizando status...');
            },
            success: function (data) {
                renderizaSituacao(data);
            },
            error: function (xhr, status, error) {                                        
                $('#divStatus').unblock();
            }
        }),
        
        $.ajax({
            url:serverapi+ '/easbr.asp?funcao=getacessostotalcais&id=' + id,
            type: 'GET',
            dataType: 'json',
            beforeSend: function(){                
            },
            success: function (data) {
                $('#spancais').html(data.REGISTROS[0].CAIS);                    
            },
            error: function (xhr, status, error) {        
                $('#divStatus').unblock();
            }
        }),		
        
        $.ajax({
            url:serverapi+ '/easbr.asp?funcao=getacessostotaldiqueseco&id=' + id,
            type: 'GET',
            dataType: 'json',
            beforeSend: function(){                
            },
            success: function (data) {
                $('#spandiqueseco').html(data.REGISTROS[0].DIQUE_SECO);                    
            },
            error: function (xhr, status, error) {        
                $('#divStatus').unblock();
            }
        }),
        
        $.ajax({
            url:serverapi+ '/easbr.asp?funcao=getacessostotaldiquenavio&id=' + id,
            type: 'GET',
            dataType: 'json',            
            beforeSend: function(){                
            },
            success: function (data) {
                $('#spandiquenavio').html(data.REGISTROS[0].DIQUE_NAVIO);                                    
            },
            error: function (xhr, status, error) {
                $('#divStatus').unblock();
            }
        })

    ).done(function() {
        $('#divStatus').unblock();                
        executandoAtualizacao = false;
    });
}

function paraContagem() {
    clearInterval(interval); // cancela a execução do intervalo
    const countdownDiv = document.getElementById('spanatualizacao');
    countdownDiv.textContent = ''; // limpa a div com a contagem regressiva
    count = 120; // reinicia a contagem
  }

function reiniciaContagem(){
    paraContagem();     
    startApiCall();        
}

function startApiCall() {
    //setInterval(callApi, 120000); // chama a função callApi() a cada 2 minutos (120000 s)
}

function chamapisessao(){
    $.ajax({
        url: serverapi +'easbr.asp?funcao=getsessao',
        type: 'GET',
        dataType: 'json',
        success: function (data) {            
        },
        error: function (xhr, status, error) {            
        }
    });
}


function callApi() {

    atualizarSituacao();
    
    let count = 120; // inicia a contagem em 2 minutos (120 segundos)
      
    const interval = setInterval(() => {
      if (count <= 0) {
            // se o tempo acabou, chama a API
            clearInterval(interval);
      } else {

          
        // se ainda não acabou o tempo, atualiza a div com a contagem regressiva
        const countdownDiv = document.getElementById('spanatualizacao');
        countdownDiv.textContent = '(Atualização automática em ' + count + 's)'; // atualiza a div com o tempo restante
        count--;
      }
    }, 1000); // chama a função a cada 1 segundo

}

function CarregarPessoas(tipo){

    var tabela = $('#tbAcessos').DataTable();
	var id = ($('#idnavio').val());
    tabela.clear().draw();
    $('#h3totaltbacessos').html('');    
    block('Consultando registros...');
	
    var url = serverapi+ '/easbr.asp?funcao=getacessosporgrupo&grupo=' + tipo + '&entradasaida=1&id=' + id
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            var tabela = $('#tbAcessos').DataTable();
            tabela.clear().draw();

            $.each(data.REGISTROS, function (i, item) {
                $('#tbAcessos').DataTable().row.add([
                    item.SEQUENCIAL,
                    item.CREDENCIAL,
                    item.MATRICULA,
                    item.NOME,
                    item.ESTRUTURA,
                    item.GRUPO,
                    item.EQUIPAMENTO,
                    item.DATA_HORA
                ]).draw();
            });

            $('#h3totaltbacessos').html(data.REGISTROS.length);

            if ($('#selEntradaSaida').val() == "1"){
                $('#spantitutoacessos').html('Registro De Entrada dos Colaboradores');
                $('.entradasaida').html('DATA ENTRADA');                    
            }
            else {
                $('#spantitutoacessos').html('Registro De Saída dos Colaboradores');
                $('.entradasaida').html('DATA SAÍDA');
            }

            $('#titlepage').html($('#spantitutoacessos').html() + ' - ' + data.REGISTROS.length);

            if ($('#lnkFiltrar').hasClass('btn-primary')) {
                $('#lnkFiltrar').removeClass('btn-primary');
                $('#lnkFiltrar').addClass('btn-success');
                //$('#lnkFiltrar').html('Filtrar <i class="fa fa-arrow-up color-warning"></i>');
            }
            
            $('.content-body').unblock();
            $('html, body').animate({scrollTop: $(document).height()}, 'slow');
        },
        error: function (xhr, status, error) {
            $('.content-body').unblock();
            console.log(error);
        }
    });

}

function logar() {

    var form = document.getElementById('formLogin');
    $('#msgErroLoginDesativado').hide();

    // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
    if (form && form.checkValidity()) {
        // Aqui você pode adicionar a lógica para enviar os dados do formulário
        console.log('Formulário válido. Enviando os dados...');
    } else {
        // Se o formulário não for válido, exibe as mensagens de erro
        if (form) {
        form.classList.add('was-validated');
        }
    }
    
    
    if (($('#btnPassword').val() == '')  || ($('#selLoginNavio').val()  == '') ){
        return;
    }
    

    if ($('#btnPassword').val() != ''){
		
                
        $('.authincation').block({
            message: '<img src="images/gif/aguarde.gif" width="100px" height="100px" />',         
            overlayCSS: {
               backgroundColor: '#01A3FF', // cor do background
                opacity: 0.2 // opacidade do background
            },
            css: {
               border: 'none',
               backgroundColor: 'transparent'
            }                
        });
        
        
        $.ajax({
            url: server + '/easbr.asp?funcao=getlogin&id=' + $('#selLoginNavio').val() + '&q=' + $('#btnPassword').val() + '&login=' +  $("#selLoginNavio option:selected").text() ,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.LOGADO) {

                    $.ajax({
                        url: serverapi + '/easbr.asp?funcao=StatusLogin&id=' + $('#selLoginNavio').val()  ,
                        type: 'GET',
                        dataType: 'json',
                        success: function (data1) {

                            if (data1.REGISTROS[0].ATIVO == 'S') {
                                if ($('#selLoginNavio').val() == 0) {
                                    window.location.href = 'admin.asp';    
                                }
                                else {
                                    window.location.href = 'index.asp';    
                                }            
                                $('#msgErroLoginDesativado').hide();

                            }
                            else {
                                $('#msgErroLoginDesativado').show();
                            }

                       
                        },
                        error: function (xhr, status, error) {
                            $('.authincation').unblock();
                        }
                    });


                    
                }
                else {
                    $('#msgErro').show();
                }
                $('.authincation').unblock();
            },
            error: function (xhr, status, error) {
                $('.authincation').unblock();
            }
        });
        
    }
    else {
        $('#msgErro').show();
    }
}


function block(mensagem){

    if (mensagem === undefined) {
        mensagem = 'Consultando...';
    }

    //var aguarde = '<div class="alert alert-primary fade show"> <strong style="font-size:20px;color:#ffffff;" class="msgaguarde">Aguarde...</strong> </div>';
    //var aguarde = '<h1 class="msgaguarde" style="background-color:#ffffff">Aguarde...</h1';
    
    var aguarde = '<div class="widget-stat card" style="opacity:0.7">' +
							'<div class="card-body p-4">'+
								'<h4 class="card-title msgaguarde">' + mensagem +'</h4>'+														
							'</div>'+
						'</div>';

    if (isMobile()) {
        aguarde = '';
    }                                        
 
/*
    $('.content-body').block({ 
        message: '<img src="images/gif/aguarde.gif" width="100px" height="100px" />' + aguarde ,
        css: {
            border: 'none',            
            backgroundColor: 'transparent' 
         }   
    }); */
    
    $('.content-body').block({
        message: '<img src="images/gif/aguarde.gif" width="100px" height="100px" />' + aguarde,         
        overlayCSS: {
           backgroundColor: '#01A3FF', // cor do background
            opacity: 0.2 // opacidade do background
        },
        css: {
           border: 'none',
           backgroundColor: 'transparent'           
        }                
    });

    $('.content-body').css('text-align', 'center'); // adiciona a propriedade text-align:center ao elemento .content-body
    $('.content-body .blockMsg').css('text-align', 'center');
    $('.content-body .blockMsg').css('left', '40%');
    $('.content-body .blockMsg').css('width', '50%');            

    
    
}


function totalCais() {
    var id = ($('#idnavio').val());
    if (id !== null && id !== '') {
        // Verifica se o ID é um valor numérico
        if (!isNaN(id)) {
            if ($('#spancais').length > 0) {
                $.ajax({
                    url:serverapi+ '/easbr.asp?funcao=getacessostotalcais&id=' + id,
                    type: 'GET',
                    dataType: 'json',
                    beforeSend: function(){                
                    },
                    success: function (data) {
                        $('#spancais').html(data.REGISTROS[0].CAIS);                    
                    },
                    error: function (xhr, status, error) {        
                        $('#spancais').html('');
                        $('#divStatus').unblock();
                    }
                })
            }
        }
    }     
}

function totalDiqueSeco() {
    var id = ($('#idnavio').val());
    if (id !== null && id !== '') {
        // Verifica se o ID é um valor numérico
        if (!isNaN(id)) {    
            if ($('#spandiqueseco').length > 0) {
                $.ajax({
                    url:serverapi+ '/easbr.asp?funcao=getacessostotaldiqueseco&id=' + id,
                    type: 'GET',
                    dataType: 'json',
                    beforeSend: function(){                
                    },
                    success: function (data) {
                        $('#spandiqueseco').html(data.REGISTROS[0].DIQUE_SECO);                    
                    },
                    error: function (xhr, status, error) {        
                        $('#spandiqueseco').html('');
                        $('#divStatus').unblock();
                    }
                })
            }
        }
    }
}

function totalDiqueNavio() {
    var id = ($('#idnavio').val());
    if (id !== null && id !== '') {
        // Verifica se o ID é um valor numérico
        if (!isNaN(id)) {        
            if ($('#spandiqueseco').length > 0) {
                $.ajax({
                    url:serverapi+ '/easbr.asp?funcao=getacessostotaldiquenavio&id=' + id,
                    type: 'GET',
                    dataType: 'json',            
                    beforeSend: function(){                
                    },
                    success: function (data) {
                        $('#spandiquenavio').html(data.REGISTROS[0].DIQUE_NAVIO);                                    
                    },
                    error: function (xhr, status, error) {
                        $('#spandiquenavio').html('');
                        $('#divStatus').unblock();
                    }
                })
            }
        }
    }
}

function carregaTotais() {
    $.when(        
        totalCais(),	
        totalDiqueSeco(),
        totalDiqueNavio()

    ).done(function() {
        $('#divStatus').unblock();                
        executandoAtualizacao = false;
    });
}



function iniciaAplicacao(parametro){

    var id = ($('#idnavio').val());

    block();

    if (parametro == 'REMOVEFILTRO'){
        var tabela = $('#tbAcessos').DataTable();
        tabela.clear().draw();
        $('#h3totaltbacessos').html('');

        $('.msgaguarde').html('Consultando equipamentos...')

        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getequipamento&id=" + id,
            method: "GET",
            dataType: "json",            
            success: function(data) {        
                $("#selEquipamento").empty();
                $("#selEquipamento").append('<option value="">Equipamento...</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#selEquipamento").append('<option value="' + option.EQUIPAMENTO + '">' + option.EQPI_DESCRICAO_APLICACAO + '</option>');
                });                                
                $('.content-body').unblock();
            },
            error: function() {                
                $('.content-body').unblock();
            }
        })
        
    }
    else{

        $.when(
                
            $.ajax({
                url: serverapi + '/easbr.asp?funcao=getstatuscatraca',
                type: 'GET',
                dataType: 'json',        
                beforeSend : function(){
                    $('.msgaguarde').html('Consultando status das catracas...');
               },
                success: function (data) {

                    renderizaSituacao(data);            
                                
                },
                error: function (xhr, status, error) {                                        
                    $('.content-body').unblock();
                }
            }),
			
            
            $.ajax({
                url: serverapi + "/easbr.asp?funcao=getestrutura&id=" + id ,
                method: "GET",
                dataType: "json",
                beforeSend : function(){
                    $('.msgaguarde').html('Consultando estrutura...');
               },
                success: function(data) {
                    $("#selEstrutura").empty();
                    $("#selEstrutura").append('<option value="">Empresa...</option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selEstrutura").append('<option value="' + option.ESTRUTURA + '">' + option.ESTRUTURA + '</option>');
                    });
                },
                error: function() {
                    $('.content-body').unblock();
                }
            }),

            $.ajax({
                url: serverapi + "/easbr.asp?funcao=getgrupo&id=" + id,
                method: "GET",
                dataType: "json",
                beforeSend : function(){
                    $('.msgaguarde').html('Consultando grupo...');
               },
                success: function(data) {        
                    $("#selGrupo").empty();
                    $("#selGrupo").append('<option value="">Grupo...</option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selGrupo").append('<option value="' + option.GRUPO + '">' + option.GRUPO + '</option>');
                    });
                },
                error: function() {
                    $('.content-body').unblock();
                }
            }),

            $.ajax({
                url: serverapi + "/easbr.asp?funcao=getequipamento&id=" + id,
                method: "GET",
                dataType: "json",            
                beforeSend : function(){
                    $('.msgaguarde').html('Consultando equipamento...');
               },
                success: function(data) {        
                    $("#selEquipamento").empty();
                    $("#selEquipamento").append('<option value="">Equipamento...</option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selEquipamento").append('<option value="' + option.EQUIPAMENTO + '">' + option.EQPI_DESCRICAO_APLICACAO + '</option>');
                    });                                
                },
                error: function() {                
                    $('.content-body').unblock();
                }
            }),
			
            setTimeout(function() {
               carregaTotais(); 
            }, 5000)


        ).done(function() {            
            $('.content-body').unblock();            
        });
    }    
}

function carregaPainel(){
    
    var id = $('#idnavio').val();
    var painel = '';
    var xl = 6;       
    
    // Carrega os paines
    $.ajax({
        url: serverapi + "/easbr.asp?funcao=getpainel&id=" + id,
        method: "GET",
        dataType: "json",            
        beforeSend : function(){
            $('.msgaguarde').html('Consultando navio...');
    },
        success: function(dataPainel) {   

        //resgata os Equipamentos
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getequipamentoporidnavio&id=" + id,
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                    
        },
            success: function(dataCatracas) {        

                    $.each(dataPainel.REGISTROS, function(index, option) {
                        if (dataPainel.REGISTROS.length == 1) {
                            xl = 12;                
                        }
                        else if (dataPainel.REGISTROS.length == 2) {
                            xl = 6;                    
                        }
                        else if (dataPainel.REGISTROS.length == 3) { 
                            xl = 4;                    
                        }
                    
                        var bgColors = ['bg-primary', 'bg-secondary', 'bg-info'];
                        var bgIndex = index % bgColors.length;
                    
                        painel += '<div class="col-xl-' + xl + ' col-xxl-6 col-lg-6 col-sm-6 consulta" onclick="CarregarPessoas(\'' + option.GRP_DESCRICAO + '\');" style="cursor: pointer;"> ';
                        painel += '<div class="widget-stat card ' + bgColors[bgIndex] + '">';
                        painel += '<div class="card-body  p-4">';
                        painel += '<div class="media">';
                        painel += '<span class="me-3">';
                        painel += '<i class="flaticon-381-user-7"></i>';
                        painel += '</span>';
                        painel += '<div class="media-body text-white text-end">';
                        painel += '<p class="mb-1 text-white fs-3">' + option.GRP_TEXTO_PAINEL + '</p>';

                        if ((option.GRP_DESCRICAO_SELECT == 'ACESSO CAIS') ||   (option.GRP_DESCRICAO_SELECT == 'ACESSO CAIS 2')){
                            painel += '<h3 id="spancais" class="text-white"></h3>';
                        }
                        if (option.GRP_DESCRICAO_SELECT == 'DIQUE SECO') {
                            painel += '<h3 id="spandiqueseco" class="text-white"></h3>';
                        }
                        if (option.GRP_DESCRICAO_SELECT == 'NAVIO') {
                            painel += '<h3 id="spandiquenavio" class="text-white"></h3>';
                        } 
                        
                        painel += '</div>';
                        painel += '</div>';
                        painel += '</div>';
                        painel += '</div>';
                        painel += '</div>';
                    });


                    $.each(dataCatracas.REGISTROS, function(index, option) {
                        
                        painel += '<div class="col-xl-6 col-xxl-6 col-lg-6 col-sm-6">';
                        
                        if ((option.ESTADO == 1) && (option.MODO == 0)) {                      
                            painel += '<div id="div_equipamento_' + option.EQPI_NUMERO + '" class="widget-stat card bg-success">';
                        }
                        else {
                            painel += '<div id="div_equipamento_' + option.EQPI_NUMERO + '" class="widget-stat card bg-danger">';
                        }

                        painel += '<div class="card-body p-4">';
                        painel += '<div class="media">';
                        painel += '<span class="me-3">';
                        painel += '      <i class="flaticon-381-calendar-1"></i>';
                        painel += '  </span>';
                        painel += '  <div class="media-body text-white">';
                        painel += '     <p class="mb-1 text-white fs-3">' + option.EQPI_DESCRICAO_APLICACAO;

                        if ((option.ESTADO == 1) && (option.MODO == 0)) {                      
                            painel += '      <h3 class="text-white" id="h2_equipamento_'  + option.EQPI_NUMERO + '" >ON</h3>';
                        }
                        else {
                            painel += '      <h3 class="text-white" id="h2_equipamento_'  + option.EQPI_NUMERO + '" >OFF</h3>';
                        }
                        
                        painel += '      <div class="progress mb-2 bg-secondary">';
                        
                        if ((option.ESTADO == 1) && (option.MODO == 0)) {                      
                            painel += '          <div class="progress-bar progress-animated bg-white" id="pgb_equipamento_' + option.EQPI_NUMERO + '" style="width: 100%"></div>';
                        }
                        else {
                            painel += '          <div class="progress-bar progress-animated bg-white" id="pgb_equipamento_' + option.EQPI_NUMERO + '" style="width: 0%"></div>';                                  
                        }
                        
                        painel += '      </div>';
                        
                        if ((option.ESTADO == 1) && (option.MODO == 0)) {                      
                            painel += '      <small id="msg_equipamento_' + option.EQPI_NUMERO + '" class="fs-4">Catraca operacional</small>';                                
                        }                            
                        else {
                            painel += '      <small id="msg_equipamento_' + option.EQPI_NUMERO + '" class="fs-4">Catraca desligada ou sem comunicação</small>';
                        }
                        
                        painel += '  </div>';
                        painel += '</div>';
                        painel += '</div>';
                        painel += '</div>';
                        painel += '</div>';
                    
                    }); 
                    
                    $('.content-body').unblock();
                    
                    $('#divConteudo').prepend(painel);                      

                    $('#spancais').append('<img src="images/gif/aguarde.gif" width="100px" height="100px" style="margin-top:-20px;" />');
					$('#spandiqueseco').append('<img src="images/gif/aguarde.gif" width="100px" height="100px" style="margin-top:-20px;" />');
                    $('#spandiquenavio').append('<img src="images/gif/aguarde.gif" width="100px" height="100px" style="margin-top:-20px;" />');
                                        
                    setTimeout(function() {
                        carregaTotais(); 
                    }, 15000); 

                },
                error: function() {                
                    $('.content-body').unblock();
                }
            });

                                
            },
            error: function() {                
                $('.content-body').unblock();
            }
        });
    

    

}

function mostrarloginSenha() {
    var senhaInput = document.getElementById("btnPassword");
    var tipoAtual = senhaInput.getAttribute("type");

    if (tipoAtual === "password") {
        senhaInput.setAttribute("type", "text");
    } else {
        senhaInput.setAttribute("type", "password");
    }
}


$(document).ready(function () {

    
    $(window).resize(function() {
        
        var block = $('.blockUI');
        
        if (block) {
            $('.blockMsg').css('text-align', 'center');
            //$('.blockMsg').css('left', '40%');
            $('.blockMsg').css('top', '20%');                        
        }
        
    });

    
    var div = $('.consulta');

    // adiciona o efeito de mouse over à div
    div.hover(
    function() { $(this).css('cursor', 'pointer'); }, // função executada quando o mouse entra na div
    function() { $(this).css('cursor', 'default'); } // função executada quando o mouse sai da div
    );

    $('#formLogin').on('submit', function() {
        // Aqui você coloca o código que deseja executar ao enviar o formulário
        logar();
    });


    iniciaAplicacao();
    
    $( "#lnkFiltrar" ).on( "click", function() {

        var url = '';
                            
        if ( ($('#selEstrutura').val() != '') && ($('#selGrupo').val() == '') && ($('#selEquipamento').val() == '')) {
            url =  serverapi + '/easbr.asp?funcao=getacessosporestrutura&estrutura=' + $('#selEstrutura').val();
        }
        else if (($('#selEstrutura').val() != '') && ($('#selGrupo').val() != '') && ($('#selEquipamento').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporestrutura&estrutura=' + $('#selEstrutura').val() + '&grupo=' + $('#selGrupo').val();
        }
        else if (($('#selEstrutura').val() != '') && ($('#selGrupo').val() == '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporestrutura&estrutura=' + $('#selEstrutura').val() + '&equipamento=' + $('#selEquipamento').val();
        }
        else if (($('#selEstrutura').val() != '') && ($('#selGrupo').val() != '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporestrutura&estrutura=' + $('#selEstrutura').val() + '&equipamento=' + $('#selEquipamento').val() + '&grupo=' + $('#selGrupo').val();
        }
        
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() == '') && ($('#selEquipamento').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporgrupo&grupo=' + $('#selGrupo').val();
        }
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() != '') && ($('#selEquipamento').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporgrupo&grupo=' + $('#selGrupo').val() + '&estrutura=' + $('#selEstrutura').val();
        }
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() == '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporgrupo&grupo=' + $('#selGrupo').val() + '&equipamento=' + $('#selEquipamento').val();
        }
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() != '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporgrupo&grupo=' + $('#selGrupo').val() + '&estrutura=' + $('#selEstrutura').val() + '&equipamento=' + $('#selEquipamento').val();
        }

        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() == '') && ($('#selGrupo').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporequipamento&equipamento=' + $('#selEquipamento').val();
        }
        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() != '') && ($('#selGrupo').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporequipamento&equipamento=' + $('#selEquipamento').val() + '&estrutura=' + $('#selEstrutura').val();
        }
        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() == '') && ($('#selGrupo').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporequipamento&equipamento=' + $('#selEquipamento').val() + '&grupo=' + $('#selGrupo').val();
        }
        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() != '') && ($('#selGrupo').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getacessosporequipamento&equipamento=' + $('#selEquipamento').val() + '&estrutura=' + $('#selEstrutura').val() + '&grupo=' + $('#selGrupo').val();
        }
        else {
            url = serverapi + '/easbr.asp?funcao=getacessos';
        }

        url += '&entradasaida=' + $('#selEntradaSaida').val();

        block();

        $('#h3totaltbacessos').html('');

        $.ajax({
            url: url + '&id=' + $('#idnavio').val(),
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                var tabela = $('#tbAcessos').DataTable();
                tabela.clear().draw();
				
				var datahora = "";
				var entrada = "";

                $.each(data.REGISTROS, function (i, item) {
					
					if ($('#selEntradaSaida').val() == "2"){
						if ((isNaN(item.DATA_ENTRADA)) || (item.DATA_ENTRADA == "")){
							entrada = "<span style='color:#FF5733;'>E-SEM DATA DE ENTRADA</span>";
						}
						else {
							entrada = item.DATA_ENTRADA;
						}
						datahora =   entrada + '<br>' + 'S-' + item.DATA_HORA;
					}
					else {

						datahora = item.DATA_HORA;
					}

					
                    $('#tbAcessos').DataTable().row.add([
                        item.SEQUENCIAL,
                        item.CREDENCIAL,
                        item.MATRICULA,
                        item.NOME,
                        item.ESTRUTURA,
                        item.GRUPO,
                        item.EQUIPAMENTO,
                        datahora
                    ]).draw();
                });

                $('#h3totaltbacessos').html(data.REGISTROS.length);

                if ($('#selEntradaSaida').val() == "1"){
                    $('#spantitutoacessos').html('Registro De Entrada dos Colaboradores');
                    $('.entradasaida').html('DATA ENTRADA');                    
                }
                else {
                    $('#spantitutoacessos').html('Registro De Saída dos Colaboradores');
                    $('.entradasaida').html('DATA ENTRADA <br> DATA SAÍDA');
                }

                $('#titlepage').html($('#spantitutoacessos').html() + ' - ' + data.REGISTROS.length);

                if ($('#lnkFiltrar').hasClass('btn-primary')) {
                    $('#lnkFiltrar').removeClass('btn-primary');
                    $('#lnkFiltrar').addClass('btn-success');                    
                }

                $('html, body').animate({scrollTop: $(document).height()}, 'slow');
                
                $('.content-body').unblock();
            },
            error: function (xhr, status, error) {
                $('.content-body').unblock();
                console.log(error);
            }
        });


      } );
    
      $( "#lnkFiltrarHistoricoAcessos" ).on( "click", function() {

        var url = '';
                            
        if ( ($('#selEstrutura').val() != '') && ($('#selGrupo').val() == '') && ($('#selEquipamento').val() == '')) {
            url =  serverapi + '/easbr.asp?funcao=getHistoricoAcesso&estrutura=' + $('#selEstrutura').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selEstrutura').val() != '') && ($('#selGrupo').val() != '') && ($('#selEquipamento').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&estrutura=' + $('#selEstrutura').val() + '&grupo=' + $('#selGrupo').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selEstrutura').val() != '') && ($('#selGrupo').val() == '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&estrutura=' + $('#selEstrutura').val() + '&equipamento=' + $('#selEquipamento').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selEstrutura').val() != '') && ($('#selGrupo').val() != '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&estrutura=' + $('#selEstrutura').val() + '&equipamento=' + $('#selEquipamento').val() + '&grupo=' + $('#selGrupo').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() == '') && ($('#selEquipamento').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&grupo=' + $('#selGrupo').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() != '') && ($('#selEquipamento').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&grupo=' + $('#selGrupo').val() + '&estrutura=' + $('#selEstrutura').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() == '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&grupo=' + $('#selGrupo').val() + '&equipamento=' + $('#selEquipamento').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selGrupo').val() != '') && ($('#selEstrutura').val() != '') && ($('#selEquipamento').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&grupo=' + $('#selGrupo').val() + '&estrutura=' + $('#selEstrutura').val() + '&equipamento=' + $('#selEquipamento').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }

        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() == '') && ($('#selGrupo').val() == '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&equipamento=' + $('#selEquipamento').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() != '') && ($('#selGrupo').val() == '')) {
            url = server+ '/easbr.asp?funcao=getHistoricoAcesso&equipamento=' + $('#selEquipamento').val() + '&estrutura=' + $('#selEstrutura').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() == '') && ($('#selGrupo').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&equipamento=' + $('#selEquipamento').val() + '&grupo=' + $('#selGrupo').val()+ '&datahistorico=' + $('#selDataHistorico').val();
        }
        else if (($('#selEquipamento').val() != '') && ($('#selEstrutura').val() != '') && ($('#selGrupo').val() != '')) {
            url = serverapi + '/easbr.asp?funcao=getHistoricoAcesso&equipamento=' + $('#selEquipamento').val() + '&estrutura=' + $('#selEstrutura').val() + '&grupo=' + $('#selGrupo').val() + '&datahistorico=' + $('#selDataHistorico').val();
        }
        else {
            url =  serverapi + '/easbr.asp?funcao=getHistoricoAcesso&datahistorico=' + $('#selDataHistorico').val();
        }

        var id = ($('#idnavio').val());

        url += '&entradasaida=' + $('#selEntradaSaida').val() + '&id=' + id ;        


        block();

        $('#h3totaltbacessos').html('');

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {

                var tabela = $('#tbAcessos').DataTable();
                tabela.clear().draw();
				var sq = 0;
                $.each(data.REGISTROS, function (i, item) {
                    sq++;
                    $('#tbAcessos').DataTable().row.add([
                        sq,
                        item.CREDENCIAL,
                        item.MATRICULA,
                        item.NOME,
                        item.ESTRUTURA,
                        item.GRUPO,
                        item.EQUIPAMENTO,
                        item.DATA_HORA,
                        item.TIPO
                    ]).draw();
                });

                $('#h3totaltbacessos').html(data.REGISTROS.length);

                if ($('#selEntradaSaida').val() == "1"){
                    $('#spantitutoacessos').html('Registro De Entrada dos Colaboradores');
                    $('.entradasaida').html('DATA ENTRADA');                    
                }
                else if ($('#selEntradaSaida').val() == "2"){
                    $('#spantitutoacessos').html('Registro De Saída dos Colaboradores');
                    $('.entradasaida').html('DATA ENTRADA');                    
                }                
                else {
                    $('#spantitutoacessos').html('Registro De Entrada/Saída dos Colaboradores');
                    $('.entradasaida').html('DATA ENTRADA <br> DATA SAÍDA');
                }

                $('#titlepage').html($('#spantitutoacessos').html() + ' - ' + data.REGISTROS.length);

                if ($('#lnkFiltrar').hasClass('btn-primary')) {
                    $('#lnkFiltrar').removeClass('btn-primary');
                    $('#lnkFiltrar').addClass('btn-success');                    
                }

                $('html, body').animate({scrollTop: $(document).height()}, 'slow');
                
                $('.content-body').unblock();
            },
            error: function (xhr, status, error) {
                $('.content-body').unblock();
                console.log(error);
            }
        });


      } );
    
      
      $( "#lnkRemoverFiltroHistoricoAcessos" ).on( "click", function() {
        $('#selEstrutura').val($('#selEstrutura option:first').val());
        $('#selGrupo').val($('#selGrupo option:first').val());
        $('#selEquipamento').val($('#selEquipamento option:first').val());
        $('#h3totaltbacessos').html('');
        $('#titlepage').html($('#spantitutoacessos').html());
        iniciaAplicacao('REMOVEFILTRO');
        
        if ($('#lnkFiltrar').hasClass('btn-success')) {
            $('#lnkFiltrar').removeClass('btn-success');
            $('#lnkFiltrar').addClass('btn-primary');            
        }
      } );


      $( "#lnkRemoverFiltro" ).on( "click", function() {
        $('#selEstrutura').val($('#selEstrutura option:first').val());
        $('#selGrupo').val($('#selGrupo option:first').val());
        $('#selEquipamento').val($('#selEquipamento option:first').val());
        $('#h3totaltbacessos').html('');
        $('#titlepage').html($('#spantitutoacessos').html());
        iniciaAplicacao('REMOVEFILTRO');
        
        if ($('#lnkFiltrar').hasClass('btn-success')) {
            $('#lnkFiltrar').removeClass('btn-success');
            $('#lnkFiltrar').addClass('btn-primary');            
        }
      } );

    $('#selGrupo').on('change', function() {
		
		var id = ($('#idnavio').val());

        block();

        var valor = $(this).val();
        if (valor) {

            var url = '';
            
            url = serverapi + '/easbr.asp?funcao=getequipamentoporgrupo&grupo=' + valor + '&id=' + id;
      
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    $("#selEquipamento").empty();
                    $("#selEquipamento").append('<option value="">Equipamento...</option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selEquipamento").append('<option value="' + option.EQUIPAMENTO + '">' + option.EQPI_DESCRICAO_APLICACAO + '</option>');
                    });
                    $('.content-body').unblock(); 
                },
                error: function (xhr, status, error) {
                    $('.content-body').unblock(); 
                }
            });

        } 
        else {
            $.ajax({
                url: serverapi + "/easbr.asp?funcao=getequipamento&" + '&id=' + id,
                method: "GET",
                dataType: "json",            
                success: function(data) {        
                    $("#selEquipamento").empty();
                    $("#selEquipamento").append('<option value="">Equipamento...</option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selEquipamento").append('<option value="' + option.EQUIPAMENTO + '">' + option.EQPI_DESCRICAO_APLICACAO + '</option>');
                    });                                
                    $('.content-body').unblock();
                },
                error: function() {                
                    $('.content-body').unblock();
                }
            })
        }
    });

    
}); 

// função