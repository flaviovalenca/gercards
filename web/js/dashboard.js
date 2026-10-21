
 (function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()  

function baixardocumento(envelopeId) {  
    window.location.href = urlbaixarenvelope + envelopeId;
}

var dates = $.fn.datepicker.dates = {
pt: {
    days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
    daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    daysMin: ["Do", "Sg", "Te", "Qa", "Qi", "Sx", "Sa", "Do"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    today: "Hoje",
    clear: "Limpar"
}

};

function gettotalassinado(){
    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'gettotalcardsassinado',        
        token: $('#csrf_token').val() 
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {
            $('#h2totalassinado').html(data.REGISTROS[0].TOTAL);
        },
        error: function(xhr, status, error) {
 
        }
    });
}

function gettotalnassinado(){
    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'gettotalcardnsassinado',        
        token: $('#csrf_token').val() 
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {
            $('#h2totalnassinado').html(data.REGISTROS[0].TOTAL);
        },
        error: function(xhr, status, error) {
 
        }
    });
}

//	setInterval(atualizarTempo, 1000);
$(document).ready(function () {		

    
    block();    

    gettotalassinado();
    gettotalnassinado();

    $('#lnkfiltrar').trigger('click');

    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'getcards',
        empresa: $('#selEmpresa').val(),
        navio: $('#selNavio').val(),
        contrato: $('#inputContrato').val(),
        id: $('#inputId').val(),
        datainicio: $('#inputDataInicio').val(),
        datatermino: $('#inputDataTermino').val(),
        token: $('#csrf_token').val() 
    };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {       
            
            if ((data.ERRO) == "Token Expirado") {
                window.location.href = 'login.asp';
                return;
            }


            var tabela = $('#tbCards').DataTable();	        
            tabela.clear().draw();

            
            var tabela = $('#tbCards').DataTable();
            tabela.clear().draw();

            $.each(data.REGISTROS, function (i, item) {

                var acoes = '';
                
                if (item.ENVELOPE_ID == "") {
                    if ($('#perfil').val() === "A"){
                        acoes = '<div class="d-flex">' +
                        '<a href="assinarcards.asp?id=' + item.ID +'" title="Assinar PDF" class="btn btn-info shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>' +                                
                        '<a href="atualizarcards.asp?id=' + item.ID +'" title="Editar solicitação" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
                        '<a href="excluircards.asp?id=' + item.ID +'" title="Excluir solicitação" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
                        '</div>';
                    }
                    else if ($('#perfil').val() === "S"){
                        acoes = '<div class="d-flex">' +
                        '<a href="assinarcards.asp?id=' + item.ID +'" title="Assinar PDF" class="btn btn-info shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>' +                                
                        '<a href="#" title="Editar solicitação" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
                        '<a href="#" title="Excluir solicitação" class="btn btn-light  shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
                        '</div>';
                    }                                                
                    else{
                        acoes = '<div class="d-flex">' +
                        '<a href="#" title="Assinar PDF" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>' +                                
                        '<a href="#" title="Editar solicitação" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
                        '<a href="#" title="Excluir solicitação" class="btn btn-light  shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
                        '</div>';
                    }

                }								
                else {

                    var largura = window.screen.width;
                    var altura = window.screen.height;
                    
                    var acoes = '<div class="d-flex">' +
                        
                        '<a href="visualizarcards.asp?id=' + item.ID +'" title="Visualizar dados." class="btn btn-danger  shadow btn-xs sharp me-1"><i class="fas fa-file-pdf"></i></a>' +
                        '<a href="#" onclick="window.open(\'' + urlvisualizarenvelope  + item.ENVELOPE_ID + '\', \'_blank\', \'width=' + largura + ',height=' + altura + '\')" title="Visualizar documento." class="btn btn-secondary  shadow btn-xs sharp me-1"><i class="fas fa-file-pdf"></i></a>' +
                        '<a href="#" onclick="baixardocumento(\'' + item.ENVELOPE_ID + '\')" title="Baixar documento." class="btn btn-info  shadow btn-xs sharp me-1"><i class="fas fa-download"></i></a>' +
                        '</div>';

                }
                
                var assinado = 'Solicitado em ' + item.DATA_SOLICITACAO + '<br><br> NÃO ASSINADO';  

                if (item.DATA_ASSINATURA != "") {
                    assinado = 'Solicitado em ' + item.DATA_SOLICITACAO + "<br><br> Assinado por " + decodeURIComponent(item.NOME_ASSINANTE) + '<br>' + ' em ' + item.DATA_ASSINATURA;	
                }

                var empresa = decodeURIComponent(item.NOME_EMPRESA) + '<br>' + decodeURIComponent(item.NOME_NAVIO);  
                var qtde =  item.QUANTIDADE + ' ' +  item.DESCRICAO_UNIDADE ;

                $('#tbCards').DataTable().row.add([
                    item.ID,
                    item.ID_CARDS,
                    item.NUMERO_CONTRATO,
                    item.DATA_INICIO + '<BR>' + item.DATA_TERMINO,
                    empresa,
                    decodeURIComponent(item.NOME_REQUISITANTE),							
                    qtde,							
                    assinado,		
                    acoes,
                ]).draw();
                
            });

            $('#spantitutototal').html('Registro de Cards (' + data.REGISTROS.length + ')');
            $('html, body').animate({ scrollTop: $(document).height() - $(window).height() }, 'slow');

            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            exibiralerta('error','Tente novamente!');
            $('.content-body').unblock();
        }
    });

    
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',            
        language: "pt-br",
        autoclose: true            
    });

    $('#selEmpresa').on('change', function() {
		
        block();
    
        var valor = $(this).val();
        if (valor) {
    
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getnavioporempresa',
                id: valor,
                token: $('#csrf_token').val() 
            };
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {

                    if ((data.ERRO) == "Token Expirado") {
                        window.location.href = 'login.asp';
                        return;
                    }

                    $("#selNavio").empty();
                    $("#selNavio").append('<option value="">Navio...</option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selNavio").append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
                    });
                    $('.content-body').unblock();
                },
                error: function(xhr, status, error) {
                    $('.content-body').unblock();
                }
            });
            
    
        } 
        else {
            $('.content-body').unblock();
            $("#selNavio").empty();
            $("#selNavio").append('<option value="">Navio...</option>');
        }
    });

    $('#lnkFiltrar').on('click', function() {

        if (($('#inputDataInicio').val() != '') && ($('#inputDataTermino').val() == '')){
            exibiralerta('danger','Informe a data de término.');                        
            return;
        }

        if (($('#inputDataInicio').val() == '') && ($('#inputDataTermino').val() != '')){
            exibiralerta('danger','Informe a data de início.');                        
            return;
        }
                
        block();

        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'getcards',
            empresa: $('#selEmpresa').val(),
            navio: $('#selNavio').val(),
            contrato: $('#inputContrato').val(),
            id: $('#inputId').val(),
            datainicio: $('#inputDataInicio').val(),
            datatermino: $('#inputDataTermino').val(),
            assinado: $('#selAssinado').val(),
            token: $('#csrf_token').val() 
        };

        $(this).prop("disabled", true);
        $(this).html('<image src="images/gif/loading.gif">&nbsp;Aguarde...');  
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição
            success: function(data) {            

                if ((data.ERRO) == "Token Expirado") {
                    window.location.href = 'login.asp';
                    return;
                }

                var tabela = $('#tbCards').DataTable();	        
                tabela.clear().draw();
      
                var tabela = $('#tbCards').DataTable();
                tabela.clear().draw();

                $.each(data.REGISTROS, function (i, item) {

                    var acoes = '';
						
						if (item.ENVELOPE_ID == "") {
							
                            if ($('#perfil').val() === "A"){
                                acoes = '<div class="d-flex">' +
								'<a href="assinarcards.asp?id=' + item.ID +'" title="Assinar PDF" class="btn btn-info shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>' +                                
								'<a href="atualizarcards.asp?id=' + item.ID +'" title="Editar solicitação" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
								'<a href="excluircards.asp?id=' + item.ID +'" title="Excluir solicitação" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
								'</div>';
                            }
                            else if ($('#perfil').val() === "S"){
                                acoes = '<div class="d-flex">' +
								'<a href="assinarcards.asp?id=' + item.ID +'" title="Assinar PDF" class="btn btn-info shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>' +                                
								'<a href="#" title="Editar solicitação" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
								'<a href="#" title="Excluir solicitação" class="btn btn-light  shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
								'</div>';
                            }                            
                            else {
                                acoes = '<div class="d-flex">' +
								'<a href="#" title="Assinar PDF" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>' +                                
								'<a href="#" title="Editar solicitação" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
								'<a href="#" title="Excluir solicitação" class="btn btn-light  shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
								'</div>';
                            }
                            
						}								
						else {

							var largura = window.screen.width;
							var altura = window.screen.height;
							
							var acoes = '<div class="d-flex">' +
								
							    '<a href="#" onclick="window.open(\'' + urlvisualizarenvelope  + item.ENVELOPE_ID + '\', \'_blank\', \'width=' + largura + ',height=' + altura + '\')" title="Visualizar documento." class="btn btn-secondary  shadow btn-xs sharp me-1"><i class="fas fa-file-pdf"></i></a>' +
								'<a href="#" onclick="baixardocumento(\'' + item.ENVELOPE_ID + '\')" title="Baixar documento." class="btn btn-info  shadow btn-xs sharp me-1"><i class="fas fa-download"></i></a>' +
    							'</div>';


						}
						
						var assinado = 'Solicitado em ' + item.DATA_SOLICITACAO + '<br><br> NÃO ASSINADO';  

						if (item.DATA_ASSINATURA != "") {
							assinado = 'Solicitado em ' + item.DATA_SOLICITACAO + "<br><br> Assinado e Autorizado por " + decodeURIComponent(item.NOME_ASSINANTE) + '<br>' + ' em ' + item.DATA_ASSINATURA;	
						}

						var empresa = decodeURIComponent(item.NOME_EMPRESA) + '<br>' + decodeURIComponent(item.NOME_NAVIO);  
						var qtde =  item.QUANTIDADE + ' ' +  item.DESCRICAO_UNIDADE ;

                        $('#tbCards').DataTable().row.add([
							item.ID,
							item.ID_CARDS,
							item.NUMERO_CONTRATO,
							item.DATA_INICIO + '<BR>' + item.DATA_TERMINO,
							empresa,
							decodeURIComponent(item.NOME_REQUISITANTE),							
							qtde,							
							assinado,		
							acoes,
						]).draw();
                });
        
                $('#lnkFiltrar').prop("disabled", false);
                $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');

                $('#spantitutototal').html('Registro de Cards (' + data.REGISTROS.length + ')');

                //$('.cm-content-body').slideToggle();
                
                $('.content-body').unblock();
            },
            error: function(xhr, status, error) {
                $('#lnkFiltrar').prop("disabled", false);
                $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');
                exibiralerta('danger','Tente novamente!');
                $('.content-body').unblock();
            }
        });
    
        
    });



});