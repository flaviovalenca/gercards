function arquivar(obj) {
    var scrollY = window.scrollY; // salva a posição atual

    var card = JSON.parse(decodeURIComponent(obj));
    document.getElementById("frmArquivarCards").reset();
    $('#hddidarquivar').val(card.ID);
    $('#inputIdCardsArquivar').val(card.ID_CARDS);

    $("#selEmpresaArquivar option").filter(function() {
        return $(this).text() === card.NOME_EMPRESA;
    }).prop("selected", true);

    $("#selNavioArquivar option").filter(function() {
        return $(this).text() === card.NOME_NAVIO;
    }).prop("selected", true);

    $('#inputRequisitanteArquivar').val(card.NOME_REQUISITANTE);
    $('#inputDataSolicitacaoArquivar').val(card.DATA_SOLICITACAO);

    var modal = new bootstrap.Modal(document.getElementById('divModalArquivar'), {
        focus: false
    });
    modal.show();

    // Reaplica o scroll original após exibir o modal
    setTimeout(() => window.scrollTo(0, scrollY), 0);
}

function desarquivar(obj) {
    var scrollY = window.scrollY; // salva a posição atual

    var card = JSON.parse(decodeURIComponent(obj));
    document.getElementById("frmDesarquivarCards").reset();
    $('#hddiddesarquivar').val(card.ID);
    $('#inputIdCardsDesarquivar').val(card.ID_CARDS);

    $("#selEmpresaDesarquivar option").filter(function() {
        return $(this).text() === card.NOME_EMPRESA;
    }).prop("selected", true);

    $("#selNavioDesarquivar option").filter(function() {
        return $(this).text() === card.NOME_NAVIO;
    }).prop("selected", true);

    $('#inputRequisitanteDesarquivar').val(card.NOME_REQUISITANTE);
    $('#inputDataSolicitacaoDesarquivar').val(card.DATA_SOLICITACAO);

    var modal = new bootstrap.Modal(document.getElementById('divModalDesarquivar'), {
        focus: false
    });
    modal.show();

    // Reaplica o scroll original após exibir o modal
    setTimeout(() => window.scrollTo(0, scrollY), 0);
}


function montarLinhasCards(registros) {
    return registros.map(function(item, index) {
        var empresa = decodeURIComponent(item.NOME_EMPRESA) + '<br>' + decodeURIComponent(item.NOME_NAVIO);
        var idcards = item.ID_CARDS;

        if (item.TIPO_OUTRO != null && item.TIPO_OUTRO != "") {
            idcards += "<br>(" + item.TIPO_OUTRO + ")";
        }

        return [
            getMenuAcao(item, $('#perfil').val(), index, $('#idioma').val()),
            getStatus(item, $('#idioma').val()),
            item.ID,
            idcards,
            item.NUMERO_CONTRATO + '<br>' + item.DATA_INICIO + '<BR>' + item.DATA_TERMINO,
            empresa,
            decodeURIComponent(item.NOME_REQUISITANTE),
            getTipoRequisitante(item),
            item.QUANTIDADE,
            decodeURIComponent(item.DESCRICAO_UNIDADE),
            getAssinado(item, $('#idioma').val()),
            item.DESCRICAO
        ];
    });
}

function ativarHeaderFixoCards() {
    var tabela = $('#tbCards');
    if (!tabela.length || !$.fn.DataTable.isDataTable(tabela[0])) return;

    var dataTable = tabela.DataTable();
    var cabecalhoFixo = $('<div id="tbCardsFixedHeader"><table></table></div>');
    var tabelaFixa = cabecalhoFixo.find('table');
    var cabecalhoOriginal = tabela.find('thead');

    cabecalhoFixo.on('click', 'th', function() {
        cabecalhoOriginal.find('th').eq($(this).index()).trigger('click');
    });
    $('body').append(cabecalhoFixo);

    function sincronizarCabecalho() {
        var clone = cabecalhoOriginal.clone(false);
        var colunasOriginais = cabecalhoOriginal.find('th');

        clone.find('th').each(function(index) {
            var coluna = colunasOriginais.eq(index);
            var estilo = window.getComputedStyle(coluna[0]);
            $(this).css({
                width: coluna.outerWidth() + 'px',
                color: estilo.color,
                backgroundColor: estilo.backgroundColor,
                font: estilo.font,
                padding: estilo.padding,
                border: estilo.border,
                textAlign: estilo.textAlign,
                verticalAlign: estilo.verticalAlign,
                whiteSpace: estilo.whiteSpace
            });
        });

        tabelaFixa.empty().append(clone);
    }

    function atualizarPosicao() {
        var elementoTabela = tabela[0];
        var retangulo = elementoTabela.getBoundingClientRect();
        var alturaCabecalho = cabecalhoOriginal.outerHeight();
        var deveExibir = retangulo.top < 0 && retangulo.bottom > alturaCabecalho;

        if (!deveExibir) {
            cabecalhoFixo.hide();
            return;
        }

        cabecalhoFixo.css({
            left: retangulo.left + 'px',
            width: retangulo.width + 'px',
            height: alturaCabecalho + 'px'
        }).show();
        tabelaFixa.css('width', retangulo.width + 'px');
    }

    sincronizarCabecalho();
    atualizarPosicao();
    dataTable.on('draw', function() {
        sincronizarCabecalho();
        atualizarPosicao();
    });
    $(window).on('scroll.tbCardsFixedHeader', atualizarPosicao);
    $(window).on('resize.tbCardsFixedHeader', function() {
        sincronizarCabecalho();
        atualizarPosicao();
    });
}

function filtrar(){
    
    if (($('#inputDataInicio').val() != '') && ($('#inputDataTermino').val() == '')){
        exibiralerta('danger','Informe a data de término.');                        
        return;
    }

    if (($('#inputDataInicio').val() == '') && ($('#inputDataTermino').val() != '')){
        exibiralerta('danger','Informe a data de início.');                        
        return;
    }
            
    block();

    carregaempresa('selEmpresaRejeitar');
    carreganavio('selNavioRejeitar');
    gettotalcards();

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
        arquivar:$('#switchArquivado').val(),
        tiporequisitante: $('#selTipoRequisitante').val(),
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
            var linhas = montarLinhasCards(data.REGISTROS);
            tabela.clear();
            tabela.rows.add(linhas).draw();
    
            $('#lnkFiltrar').prop("disabled", false);
            $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');

            $('#spantitutototal').html('Registro de Cards (' + data.REGISTROS.length + ')');

            if (data.REGISTROS.length > 0) {
                // Adiciona a classe à última linha
                $('#tbCards tbody tr:last').addClass('last-row-height');
            }
            
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('#lnkFiltrar').prop("disabled", false);
            $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');
            exibiralerta('danger','Tente novamente!');
            $('.content-body').unblock();
        }
    });


}
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

function gettotalcards(){

    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'getcardstotal',
        empresa: $('#selEmpresa').val(),
        navio: $('#selNavio').val(),
        contrato: $('#inputContrato').val(),
        id: $('#inputId').val(),
        datainicio: $('#inputDataInicio').val(),
        datatermino: $('#inputDataTermino').val(),
        assinado: $('#selAssinado').val(),
        arquivar:$('#switchArquivado').val(),
        tiporequisitante:$('#selTipoRequisitante').val(),
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

            $('#h2totalassinado').html(data.TOTALASSINADO);
            $('#h2totalnassinado').html(data.TOTALNAOASSINADO);
            $('#h2totalrejeitado').html(data.TOTALREJEITADO);
            
        },
        error: function(xhr, status, error) {            
        }
    });

    
}

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
                window.location.href = 'login.asp';
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
                window.location.href = 'login.asp';
                return;
            }

            $("#" + idSelect).empty();
            

            traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                $("#" + idSelect).append('<option value="">' + textoTraduzido + '</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#" + idSelect).append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
                });
            });
            

            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });
    
}


function rejeitarcard(obj) {
    
    var card = JSON.parse(decodeURIComponent(obj));
    document.getElementById("frmRejeitarCards").reset();
    
    // Reseta o formulário                    
    $('#hddidrejeitar').val(card.ID);
    $('#inputIdCardsRejeitar').val(card.ID_CARDS);
    
    $("#selEmpresaRejeitar option").filter(function() {
        return $(this).text() === card.NOME_EMPRESA;
    }).prop("selected", true);

    $("#selNavioRejeitar option").filter(function() {
        return $(this).text() === card.NOME_NAVIO;
    }).prop("selected", true);

    
    $('#inputRequisitanteRejeitar').val(card.NOME_REQUISITANTE);
    $('#inputDataSolicitacaoRejeitar').val(card.DATA_SOLICITACAO);
    
    var modal = new bootstrap.Modal(document.getElementById('divModalRejeitar'));
    modal.show();
    
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
    ativarHeaderFixoCards();

    $('#switchArquivado').on('change', function () {
            if ($(this).is(':checked')) {
                $(this).val('S');
                $('.text-status').text('SIM');
            } else {
                $(this).val('N');
                $('.text-status').text('NÃO');
            }
    });
    
    $('.dropdown').on('show.bs.dropdown', function () {
        $('.dropdown-menu').addClass('adjusted');
    });

    $('.dropdown').on('hide.bs.dropdown', function () {
        $('.dropdown-menu').removeClass('adjusted');
    });



    block();    

    gettotalassinado();
    gettotalnassinado();
    gettotalrejeitado();
    carregaempresa('selEmpresaArquivar');
    carreganavio('selNavioArquivar');    
    carregaempresa('selEmpresaDesarquivar');
    carreganavio('selNavioDesarquivar');
    carregaempresa('selEmpresaRejeitar');
    carreganavio('selNavioRejeitar');

    $('#btnArquivarCard').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
            
            blockid('main-wrapper');
        
            // Construir os dados a serem enviados no corpo da requisição        
            var dados = {
                funcao: 'updcardsarquivar',
                id:$('#hddidarquivar').val(),                
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

                    gettotalassinado();
                    gettotalnassinado();
                    gettotalrejeitado();    

                    $('#lnkfiltrar').trigger('click');
                    
                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    $('#main-wrapper').unblock();

                    if (data.ERRO == "OK") {                    
                        $('#divModalArquivar').modal('hide');                        
                        filtrar();
                        exibiralertadiv('success','Card arquivado com sucesso!','divMsg');                                                                                        
                    }
                    else {
                        exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgArquivar');
                    }    
                                        
                },
                error: function(xhr, status, error) {
                    $('#main-wrapper').unblock();
                    exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgArquivar');
                    
                }
            });
            
    
        

    }); 

    
    $('#btnDesarquivarCard').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
            
            blockid('main-wrapper');
        
            // Construir os dados a serem enviados no corpo da requisição        
            var dados = {
                funcao: 'updcardsdesarquivar',
                id:$('#hddiddesarquivar').val(),                
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

                    gettotalassinado();
                    gettotalnassinado();
                    gettotalrejeitado();    

                    $('#lnkfiltrar').trigger('click');
                    
                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    $('#main-wrapper').unblock();

                    if (data.ERRO == "OK") {                    
                        $('#divModalDesarquivar').modal('hide');                        
                        filtrar();
                        exibiralertadiv('success','Card dearquivado com sucesso!','divMsg');                                                                                        
                    }
                    else {
                        exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgDesarquivar');
                    }    
                                        
                },
                error: function(xhr, status, error) {
                    $('#main-wrapper').unblock();
                    exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgDesarquivar');
                    
                }
            });
            
    
        

    }); 

    $('#txtDescricaoMotivoRejeitar').on('change keyup', function() {        
        if ($(this).val()) {
            $('#txtDescricaoMotivoRejeitar').removeClass('is-invalid');            
        }        
        else{
            traduzirTexto('Informe o motivo da rejeição.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#txtDescricaoMotivoRejeitar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#txtDescricaoMotivoRejeitar').addClass('is-invalid');            
    
            });

        }    
    });


    $('#btnCancelarRejeitar').on('click', function() {
        $('#ModalCenterConfirmarRejeitar').modal('hide');    
        $('#divModalRejeitar').modal('show');        
    }); 

    $('#btnConfirmarRejeitar').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (ValidarRejeitar())  {
            
            $('#ModalCenterConfirmarRejeitar').modal('hide');    
            blockid('main-wrapper');
        
            // Construir os dados a serem enviados no corpo da requisição        
            var dados = {
                funcao: 'updcardsrejeitar',
                id:$('#hddidrejeitar').val(),
                movitorejeicao:removerCaracteresEspeciais($('#txtDescricaoMotivoRejeitar').val()),                
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

                    gettotalassinado();
                    gettotalnassinado();
                    gettotalrejeitado();

                    $('#lnkfiltrar').trigger('click');
                    
                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    $('#main-wrapper').unblock();

                    if (data.ERRO == "OK") {                    
                        $('#ModalCenterConfirmarRejeitar').modal('hide');                        
                        filtrar();
                        exibiralertadiv('success','Card rejeitado com sucesso!','divMsg');                                                                                        
                    }
                    else {
                        exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgRejeitar');
                    }    
                                        
                },
                error: function(xhr, status, error) {
                    $('#main-wrapper').unblock();
                    exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgAlterar');
                    
                }
            });
            
    
        } 

    }); 
    
    function ValidarRejeitar(){
        var form = document.getElementById('frmRejeitarCards');
        var valido = form.checkValidity();
    
        var camposInvalidos = [];
        $('#frmRejeitarCards').find(':input').each(function() {
            if (!this.validity.valid) {
                camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
            }
        });
    
        var validouMotivoRejeitar = false;
        if ($('#txtDescricaoMotivoRejeitar').val() === null || $('#txtDescricaoMotivoRejeitar').val() === "") {        
            
            traduzirTexto('Informe o motivo da rejeição.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#txtDescricaoMotivoRejeitar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#txtDescricaoMotivoRejeitar').addClass('is-invalid');                
            });
            
        }
        else {
            validouMotivoRejeitar = true;
            $('#txtDescricaoMotivoRejeitar').removeClass('is-invalid');            
        }
    
        if (form && valido && validouMotivoRejeitar) {

            return true;
        }
        else {
            // Se o formulário não for válido, exibe as mensagens de erro        
            exibiralertadiv('danger','Preencha todos os campos obrigatórios.', 'divMsgRejeitar');
            if (form) {
                form.classList.add('was-validated');
            }
            return false;
        }

    }
    
    $('#btnRejeitarCard').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if ($('#txtDescricaoMotivoRejeitar').val() != "")  {
            $('#divModalRejeitar').modal('hide');
            $('#ModalCenterConfirmarRejeitar').modal('show');    
        } 
        else {
            ValidarRejeitar();
        }
     
    });

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
        arquivar:$('#switchArquivado').val(),
        tiporequisitante:$('#selTipoRequisitante').val(),
        token: $('#csrf_token').val() 
    };

    blockid('divtbCards');

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
            tabela.clear();

            if (data && Array.isArray(data.REGISTROS)) {
                tabela.rows.add(montarLinhasCards(data.REGISTROS)).draw();
                if (data.REGISTROS.length > 0) {
                    // Adiciona a classe à última linha
                    $('#tbCards tbody tr:last').addClass('last-row-height');
                }

                $('#spantitutototal').html('Registro de Cards (' + data.REGISTROS.length + ')');
            }
            else {
                tabela.draw();
                $('#spantitutototal').html('Registro de Cards (0)');
            }

            //$('.content-body').unblock();
            $('#divtbCards').unblock();
        },
        error: function(xhr, status, error) {
            exibiralerta('error','Tente novamente!');
            //$('.content-body').unblock();
            $('#divtbCards').unblock();
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

                    traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                        $("#selNavio").append('<option value="">' + textoTraduzido + '</option>');
                        $.each(data.REGISTROS, function(index, option) {
                            $("#selNavio").append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
                        });
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
            traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                $("#selNavio").append('<option value="">' + textoTraduzido +'</option>');
            });
        }
    });

    $('#lnkFiltrar').on('click', function() {
        filtrar();        
    });



});
