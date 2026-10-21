
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


function carregaempresa(idSelect) {
    
    var dados = {
        funcao: 'getempresa',        
        token: $('#csrf_token').val() 
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {

            if ((data.ERRO) == "Token Expirado") {
                window.location.reload();
                return;
            }

            $("#" + idSelect).empty();
            $("#" + idSelect).append('<option value="">Empresa...</option>');
            $.each(data.REGISTROS, function(index, option) {
                $("#" + idSelect).append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_EMPRESA) + '</option>');
            });
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });
    
}

function carreganavio(idSelect) {
    // Carreganavio
    var dados = {
        funcao: 'getnavio',        
        token: $('#csrf_token').val() 
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {

            if ((data.ERRO) == "Token Expirado") {
                window.location.reload();
                return;
            }

            $("#" + idSelect).empty();
            $("#" + idSelect).append('<option value="">Navio...</option>');
            $.each(data.REGISTROS, function(index, option) {
                $("#" + idSelect).append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
            });
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });
    
}



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

function gettotalrejeitado(){
    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'gettotalcardsrejeitado',        
        token: $('#csrf_token').val() 
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {
            $('#h2totalrejeitado').html(data.REGISTROS[0].TOTAL);
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

    // carrega tipo_id
    var dados = {
        funcao: 'gettipoid',            
        token: $('#csrf_token').val() 
    };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {
            $("#selTipoID").empty();
            $("#selTipoID").append('<option value="">Tipo Id...</option>');
            $.each(data.REGISTROS, function(index, option) {
                $("#selTipoID").append('<option value="' + option.ID + '">' + option.SIGLA + '-' + encodeURIComponent(option.DESCRICAO) + '</option>');
            });
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });

    $('#selTipoID').on('change', function() {

        var id = $(this).val();
        var textSelTipoID = $("#selTipoID option:selected").text();
        if (id == ""){
            id = 0;
        }

        $('#inputOutro').val('');                        
        $('#divOutro').hide();

        // carrega tipo_id
        var dados = {
            id:id,
            funcao: 'gettipodetalheidporid',            
            token: $('#csrf_token').val() 
        };

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição
            success: function(data) {
                $("#selDetalheTipoID").empty();
                $("#selDetalheTipoID").append('<option value="">Tipo Detalhe Id...</option>');
                $.each(data.REGISTROS, function(index, option) {
                    if ((textSelTipoID === "O-Outros") && (option.DESCRICAO === "Outros")){
                        $("#selDetalheTipoID").append('<option selected value="' + option.ID + '">' + decodeURIComponent(option.DESCRICAO) + '</option>');
                        $('#inputOutro').val('');                        
                        $('#divOutro').show();                        
                        $('#inputOutro').focus();
                    }
                    else {
                        $("#selDetalheTipoID").append('<option value="' + option.ID + '">' + decodeURIComponent(option.DESCRICAO) + '</option>');
                    }
                });
                if (textSelTipoID === "O-Outros") {
                    $('#inputOutro').prop('required', true);
                }
                else {
                    $('#inputOutro').prop('required', false);
                }
                $('.content-body').unblock();
            },
            error: function(xhr, status, error) {
                $('.content-body').unblock();
            }
        });

    });


    $('#lnkImprimir').on('click', function() {
        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'a4'
        });
        
        doc.addHTML($('#divPrint'), function() {
        doc.save('doc' + $('#id').val() + '.pdf');
        });
    });

    $('#lnkRemoverConsolidadeFiltro').on('click', function() {
        $('#selEmpresa option').eq(0).prop('selected', true);    
        $('#selTipoID option').eq(0).prop('selected', true);  
        $('#selDetalheTipoID').html('<option value="">Tipo Detalhe Id...</option>');          
        $('#selNavio').html('<option value="">Navio...</option>');
        $('#selNavio option').eq(0).prop('selected', true);    
        $('#inputDataInicio').val('');
        $('#inputDataTermino').val('');
        $('#h2totalassinado').html('');
        $('#h2totalnassinado').html('');
        $('#h2totalrejeitado').html('');        
        $('#h3titulorel').removeClass('cardsfiltro');
        $('#h3titulorel').html('');
        $('#divitemassinado').html('');
        $('#divitemnaoassinado').html('');
        $('#divitemrejeitado').html('');
        
    });

    
    $('#lnkFiltrarConsolidado').on('click', function() {

        if (($('#inputDataInicio').val() != '') && ($('#inputDataTermino').val() == '')){
            exibiralertadiv('danger','Informe a data de término.','divMsg');                        
            return;
        }

        if (($('#inputDataInicio').val() == '') && ($('#inputDataTermino').val() != '')){
            exibiralertadiv('danger','Informe a data de início.','divMsg');                                                
            return;
        }

        if (($('#selTipoID').val() != '') && ($('#selDetalheTipoID').val() == '')){
            exibiralertadiv('danger','Informe tipo detalhe.','divMsg');                                                
            return;
        }
        
        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'getcardsconsolidado',
            empresa: $('#selEmpresa').val(),
            navio: $('#selNavio').val(),                        
            tipoid: $('#selTipoID option:selected').text(),
            tipodetalheid: $('#selDetalheTipoID option:selected').text(),
            datainicio: $('#inputDataInicio').val(),
            datatermino: $('#inputDataTermino').val(),            
            token: $('#csrf_token').val() 
        };

        $(this).prop("disabled", true);
        $(this).html('<image src="images/gif/loading.gif">&nbsp;Aguarde...');  
		
		blockid('divGraficoAssinado');
        blockid('divGraficoNaoAssinado');
        blockid('divGraficoRejeitado');
        blockid('divtbCards');


        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição
            success: function(data) {            

                if ((data.ERRO) == "Token Expirado") {
                    window.location.reload();
                    return;
                }

                var registros = JSON.parse(data.REGISTROS);
                
                var tabela = $('#tbCards').DataTable();
                var linhas = [];
    
                $.each(registros.REGISTROS, function (i, item) {
                    
                    var empresa = decodeURIComponent(item.NOME_EMPRESA) + '<br>' + decodeURIComponent(item.NOME_NAVIO);  
                    var qtde =  item.QUANTIDADE ;                
                    var status = getStatus(item);                                    
                    var assinado = getAssinado(item);
                    var tiporequisitante = getTipoRequisitante(item);
                    
                    var idcards = "";
                    if (item.TIPO_OUTRO != null && item.TIPO_OUTRO != ""){
                        idcards = item.ID_CARDS + "<br>(" + item.TIPO_OUTRO + ')'; 
                    }
                    else {
                        idcards = item.ID_CARDS;
                    }
                
                    linhas.push([
                        item.ID,
                        idcards,
                        item.NUMERO_CONTRATO + '<br>' + item.DATA_INICIO + '<BR>' + item.DATA_TERMINO,                    
                        empresa,
                        decodeURIComponent(item.NOME_REQUISITANTE),
                        tiporequisitante,
                        item.DATA_SOLICITACAO,							
                        qtde,	
                        decodeURIComponent(item.UNIDADE),													
                        assinado,
                        item.DESCRICAO,
                        status                        
                    ]);
                });

                tabela.clear();
                tabela.rows.add(linhas).draw();

                $('#h2totalassinado').html(data.TOTALASSINADO);
                $('#h2totalnassinado').html(data.TOTALNAOASSINADO);
                $('#h2totalrejeitado').html(data.TOTALREJEITADO);

                var filtro = '';

                if ($('#selEmpresa').val() != ''){                    
                    filtro += '<div class="bgl-primary light rounded p-2 mleft">';					
					filtro += '		<small> <b>EMPRESA</b>: '+ $('#selEmpresa option:selected').text()+ '</small>';										
					filtro += '	</div>';
                }

                if ($('#selNavio').val() != ''){
                    filtro += '<div class="bgl-primary light rounded p-2 mleft">';					
					filtro += '		<small> <b>NAVIO</b>: '+ $('#selNavio option:selected').text()+ '</small>';										
					filtro += '	</div>';
                }

                if ($('#selTipoID').val() != ''){
                    filtro += '<div class="bgl-primary light rounded p-2 mleft">';					
					filtro += '		<small> <b>TIPO ID</b>: '+ $('#selTipoID option:selected').text()+ '</small>';										
					filtro += '	</div>';
                }
                if ($('#selDetalheTipoID').val() != ''){
                    filtro += '<div class="bgl-primary light rounded p-2 mleft">';					
					filtro += '		<small> <b>TIPO DETALHE ID</b>: '+ $('#selDetalheTipoID option:selected').text()+ '</small>';										
					filtro += '	</div>';
                }

                if (($('#inputDataInicio').val() != '') && ($('#inputDataTermino').val() == '')){
                    filtro += '<div class="bgl-primary light rounded p-2 mleft">';					
					filtro += '		<small> <b>DATA DE</b>: '+ $('#inputDataInicio').val()+ '</small>';										
					filtro += '	</div>';
                }

                if (($('#inputDataInicio').val() == '') && ($('#inputDataTermino').val() != '')){
                    filtro += '<div class="bgl-primary light rounded p-2 mleft">';					
					filtro += '		<small> <b>DATA DE</b>: '+ $('#inputDataTermino').va()+ '</small>';										
					filtro += '	</div>';
                }

                if (($('#inputDataInicio').val() != '') && ($('#inputDataTermino').val() != '')){
                    filtro += '<div class="bgl-primary light rounded p-2 mleft">';					
					filtro += '		<small> <b>PERÍODO DE</b>: '+ $('#inputDataInicio').val() + ' ATÉ ' + $('#inputDataTermino').val() + '</small>';										
					filtro += '	</div>';
                }

                $('#h3titulorel').html(filtro);
                if (filtro != ''){
                    $('#h3titulorel').addClass('cardsfiltro');
                }    
                else{
                    $('#h3titulorel').removeClass('cardsfiltro');
                }            

                dlabChartlist.load();
                
                $('#lnkFiltrarConsolidado').prop("disabled", false);
                $('#lnkFiltrarConsolidado').html('Filtrar <i class="fa fa-search me-1"></i>');

                $('#lnkfiltrar').trigger('click');
				
				$('#divGraficoAssinado').unblock();
                $('#divGraficoNaoAssinado').unblock();
                $('#divGraficoRejeitado').unblock();
                $('#divtbCards').unblock();

                                
            },
            error: function(xhr, status, error) {
                $('#lnkFiltrarConsolidado').prop("disabled", false);
                $('#lnkFiltrarConsolidado').html('Filtrar <i class="fa fa-search me-1"></i>');
				
				$('#divGraficoAssinado').unblock();
                $('#divGraficoNaoAssinado').unblock();
                $('#divGraficoRejeitado').unblock();
                $('#divtbCards').unblock();
				
                exibiralerta('danger','Tente novamente!');         
            }
        });

        
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
                        window.location.reload();
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
            
            traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                $('.content-body').unblock();
                $("#selNavio").empty();
                $("#selNavio").append('<option value="">' + textoTraduzido +'</option>');            
            });

        }
    });
    
    $('#lnkFiltrarConsolidado').trigger('click');
    
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',            
        language: "pt-br",
        autoclose: true            
    });



});
