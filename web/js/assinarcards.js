function checkURLParameter(parameterName) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(parameterName);
}
$(document).ready(function () {		

    if (checkURLParameter('code')){
        $('#modalConsentimento').modal('show');        
    }
    // carrega navio
    var dados = {
        funcao: 'getnavioporempresa',
        id: $('#selEmpresa').val(),
        token: $('#csrf_token').val() 
    };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da rquisição
        success: function(data) {
            $("#selNavio").empty();
            $("#selNavio").append('<option value=""> </option>');
            $.each(data.REGISTROS, function(index, option) {    
                if (($('#idnavio').val() == option.ID)) {
                    $("#selNavio").append('<option value="' + option.ID + '" selected>' + option.NOME_NAVIO + '</option>');
                }   
                else {
                    $("#selNavio").append('<option value="' + option.ID + '">' + option.NOME_NAVIO + '</option>');
                }             
                
            });
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });


    // carrega tipo_id
    
    dados = {
        funcao: 'gettipoid',                    
        token: $('#csrf_token').val() 
    };

    var textSelTipoID = "";

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {
            $("#selTipoID").empty();
            $("#selTipoID").append('<option value=""></option>');
            $.each(data.REGISTROS, function(index, option) {
                if ($('#hhdtipoid').val() == option.ID) {
                    $("#selTipoID").append('<option value="' + option.ID + '" selected>' + option.SIGLA + '-' + option.DESCRICAO + '</option>');
                    textSelTipoID = option.SIGLA + '-' + option.DESCRICAO;
                }
                else {
                    $("#selTipoID").append('<option value="' + option.ID + '">' + option.SIGLA + '-' + option.DESCRICAO + '</option>');
                }
                
            });

            // carrega tipo_detatlhe_id
            var dados = {
                id:$('#hhdtipoid').val(),
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
                    $("#selDetalheTipoID").append('<option value=""></option>');
                    $.each(data.REGISTROS, function(index, option) {
                        if ((textSelTipoID === "O-Outros") && (option.DESCRICAO === "Outros")){
                            $('#inputOutro').val('');                        
                            $('#divOutro').show();                                                    
                        }
                        
                        if ($('#hhdtipodetalhoid').val() == option.ID){
                            $("#selDetalheTipoID").append('<option selected value="' + option.ID + '">' + option.DESCRICAO + '</option>');
                        }
                        else {
                            $("#selDetalheTipoID").append('<option value="' + option.ID + '">' + option.DESCRICAO + '</option>');
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

        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    }); 

    // carrega unidades
    var dados = {
        funcao: 'getunidade',            
        token: $('#csrf_token').val() 
    };

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {                
            $("#selUnidade").empty();
            $("#selUnidade").append('<option value=""></option>');
                $.each(data.REGISTROS, function(index, option) {
                    if (option.ID == $('#hhdunidade').val()){    
                        $("#selUnidade").append('<option value="' + option.SIGLA + '" selected>' + option.DESCRICAO + '</option>');
                    }
                    else {
                        $("#selUnidade").append('<option value="' + option.SIGLA + '">' + option.DESCRICAO + '</option>');
                    }
                });
                if ("0" === $('#hhdunidade').val()){                    
                    $('#divUnidadeOutro').show();                                        
                }
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            reject(error); // Em caso de erro, rejeita a promessa
        }
    });
    

    $('#btnFecharSucessoCard').on('click', function() {        
        $('.btn-close').trigger('click');
        window.location.href = 'mantercards.asp';
    });
    
    
    $('#btnLimparFormulario').on('click', function() {
        document.getElementById("frmAtualizarCards").reset(); // Isso limpará todos os campos de entrada no formulário    
        $("#selDetalheTipoID").empty();
        $('#inputDataInicio').closest('.row').find('.invalid-feedback').text('Informe a data de início.').show();
        $('#inputDataTermino').closest('.row').find('.invalid-feedback').text('Informe a data de término.').show();        
    });



    $('#btnBaixarDocumento').on('click', function() {    
        getenvelope('B','btnBaixarDocumento',$('#envelopeid').val());        
    });
    
    $('#btnVisualizarDocumento').on('click', function() {        
        getenvelope('V','btnVisualizarDocumento',$('#envelopeid').val());        
    });
    

    
    $('#btnAssinarCards').on('click', function() {

        $('#modalConfirmar').modal('hide');
        $('#btnConfirmarAssinar').prop("disabled", true);
        $('#btnConfirmarAssinar').html('<image src="images/gif/loading.gif">&nbsp;Aguarde...');  
        
        block();
        
        var unidade = "";
        unidade = $('#selUnidade').val();
        
        var navio = $('#selNavio option:selected').text();
        var dados = {
            funcao: 'getsessao',
            token: $('#csrf_token').val() 
        }

        $(this).prop("disabled", false);
        $(this).html('Assinar');
                
        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'assinarcards',
            id:$('#inputIdAssinar').val(),
            idcard: $('#idcard').val(),
            empresa: $('#selEmpresa').val(),
            navio: navio,
            requisitante: $('#inputRequisitante').val(),            
            contrato: $('#inputNumeroContrato').val(),
            quantidade:$('#inputQuantidade').val(),
            unidade:unidade,            
            descricao: $('#txtDescricao').val(),
            datainicio: $('#inputDataInicio').val(),
            datatermino: $('#inputDataTermino').val(),
            nomeassinante: $('#nomeassinante').val(),
            emailassinante: encodeURIComponent($('#emailassinante').val()),
            token: $('#csrf_token').val() 
        };

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição            
            success: function(data) {           

                if (data.ERRO == "Token Expirado"){
                    // Se o formulário não for válido, exibe as mensagens de erro
                    exibiralerta('danger','Sessão Expirada, você será direcionado ao login.');        
                    setTimeout(function() {
                        window.location.href = 'login.asp';
                        $('.btn-close').trigger('click');
                    }, 3000);
                    return;            
                }   
                
                $('.content-body').unblock(); 
                $('#btnConfirmarAssinar').prop("disabled", false);
                $('#btnConfirmarAssinar').html('Assinar');
                if (data.ERRO === "OK") {
                    var sign = JSON.parse(data.URL);
                    window.location.href = sign.url;
                }
                else {
                    exibiralerta('danger',"Problema de comunicação com o servidor de assinatura, tente novamente!");
                }
                
            },
            error: function(xhr, status, error) {
                $('#btnConfirmarAssinar').prop("disabled", false);
                $('#btnConfirmarAssinar').html('Assinar');
                exibiralerta('danger','Problema de comunicação com o servidor de assinatura, tente novamente!');
                $('.content-body').unblock();

            }
        });   
    });

       
    $('#inputDataInicio').blur(function(){    
        var inputData = $(this).val();
        // Esta função será executada quando o elemento perder o foco
        if (validaData(inputData)) {                                        
            $(this).closest('.row').find('.invalid-feedback').hide();

            if ($('#inputDataTemino').val() != "") {
                var date1 = new Date($('#inputDataInicio').val());
                var date2 = new Date($('#inputDataTermino').val());                        
                if (date1 > date2) {
                    var errorMessage = "A data de início não pode ser maior que a data de término.";
                    $(this).closest('.row').find('.invalid-feedback').text(errorMessage).show();
                    $(this).addClass('is-invalid');
                }
                else {
                    $(this).removeClass('is-invalid');    
                }

            }
        } else if (inputData.trim() != "") { 
            if (inputData.length != 10)  {                   
                var errorMessage = "Informe uma data de início válida.";
                $(this).closest('.row').find('.invalid-feedback').text(errorMessage).show();
                $(this).addClass('is-invalid');
            }
            else {
                $(this).closest('.row').find('.invalid-feedback').hide();
                $(this).removeClass('is-invalid');
            }
        }     
    });

    
    $('#inputDataInicio').on('input', function() {
        var inputData = $(this).val();
        // Verifica se a data é válida

        if (inputData.length == 10)  {                   
            if (validaData(inputData)) {                    
                $(this).closest('.row').find('.invalid-feedback').hide();
            } else { 
                var errorMessage = "Informe uma data de início válida.";
                $(this).closest('.row').find('.invalid-feedback').text(errorMessage).show();
            }
        }                  
    });


    $('#inputDataTermino').blur(function(){    
        var inputData = $(this).val();
        // Esta função será executada quando o elemento perder o foco
        if (validaData(inputData)) {                                        
            $(this).closest('.row').find('.invalid-feedback').hide();

            if ($('#inputDataInicio').val() != "") {
                var date1 = new Date($('#inputDataInicio').val());
                var date2 = new Date($('#inputDataTermino').val());                        
                if (date1 > date2) {
                    var errorMessage = "A data de término não pode ser menor que a data de início.";
                    $(this).closest('.row').find('.invalid-feedback').text(errorMessage).show();
                    $(this).addClass('is-invalid');
                }
                else {
                    $(this).removeClass('is-invalid');    
                }

            }
        } else if (inputData.trim() != "") { 
            if (inputData.length != 10)  {                   
                var errorMessage = "Informe uma data de término válida.";
                $(this).closest('.row').find('.invalid-feedback').text(errorMessage).show();
                $(this).addClass('is-invalid');
            }
            else {
                $(this).closest('.row').find('.invalid-feedback').hide();
                $(this).removeClass('is-invalid');
            }
        }     
    });

    
    $('#inputDataTermino').on('input', function() {
        var inputData = $(this).val();
        // Verifica se a data é válida
        if (inputData.length == 10)  {                   
            if (validaData(inputData)) {                    
                $(this).closest('.row').find('.invalid-feedback').hide();
            } else { 
                var errorMessage = "Informe uma data de início válida.";
                $(this).closest('.row').find('.invalid-feedback').text(errorMessage).show();
            }
        }                  
    });


});