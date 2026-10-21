
$(document).ready(function () {		

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
        data: dados, // Enviar os dados no corpo da requisição
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
                        $("#selUnidade").append('<option value="' + option.ID + '" selected>' + option.DESCRICAO + '</option>');
                    }
                    else {
                        $("#selUnidade").append('<option value="' + option.ID + '">' + option.DESCRICAO + '</option>');
                    }
                });
                if ("0" == $('#hhdunidade').val()){                    
                    $('#divUnidadeOutro').show();                                            
                }
                
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            reject(error); // Em caso de erro, rejeita a promessa
        }
    });

    $('#selUnidade').on('change', function() {
        $('#inputUnidadeOutro').val('');
        if ($(this).val() == "0") {
            $('#divUnidadeOutro').show();                        
            $('#inputUnidadeOutro').prop('required', true);                        
            $('#inputUnidadeOutro').focus(); 
        }
        else {            
            $('#inputOutro').prop('required', false);
            $('#divUnidadeOutro').hide();                        
            $('#inputQuantidade').focus();            
        }
    });

    

    $('#btnFecharSucessoCard').on('click', function() {        
        $('.btn-close').trigger('click');
    });
    
    
    $('#btnLimparFormulario').on('click', function() {
        document.getElementById("frmAtualizarCards").reset(); // Isso limpará todos os campos de entrada no formulário    
        $("#selDetalheTipoID").empty();
        $('#inputDataInicio').closest('.row').find('.invalid-feedback').text('Informe a data de início.').show();
        $('#inputDataTermino').closest('.row').find('.invalid-feedback').text('Informe a data de término.').show();        
    });
    
    $('#btnAtualizarCards').on('click', function() {

        var form = document.getElementById('frmAtualizarCards');
        var valido = form.checkValidity();
        var validadata = false;

        var inputDataInicio  = $('#inputDataInicio').val();
        var inputDataTermino = $('#inputDataTermino').val();
        // Esta função será executada quando o elemento perder o foco
        if ((validaData(inputDataInicio)) && (validaData(inputDataTermino)))  {                                                    
                var date1 = new Date(parseDataParaISO($('#inputDataInicio').val()));
                var date2 = new Date(parseDataParaISO($('#inputDataTermino').val()));                        
                validoudata = (date2 >= date1);         

                if (!validoudata){
                    var errorMessage = "A data de início não pode ser maior que a data de término.";
                    $('#inputDataInicio').closest('.row').find('.invalid-feedback').text(errorMessage).show();
                    $('#inputDataInicio').addClass('is-invalid');
                    
                    errorMessage = "A data de término não pode ser menor que a data de início.";
                    $('#inputDataTermino').closest('.row').find('.invalid-feedback').text(errorMessage).show();
                    $('#inputDataTermino').addClass('is-invalid');
                }
        }
        
        
        var camposInvalidos = [];
        $('#frmAtualizarCards').find(':input').each(function() {
            if (!this.validity.valid) {
                camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
            }
        });

        console.log(camposInvalidos); 
        $('#modalConfirmar').modal('hide');
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (form && valido && validoudata)  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'updcards',
                id:$('#inputIdAtualizar').val(),
                empresa: $('#selEmpresa').val(),
                navio: $('#selNavio').val(),
                requisitante: $('#inputRequisitante').val(),            
                contrato: $('#inputNumeroContrato').val(),
                tipoid: $('#selTipoID').val(),
                tipodetalheid: $('#selDetalheTipoID').val(),
                tipodetalheoutro:$('#inputOutro').val(),
                quantidade:$('#inputQuantidade').val(),
                unidade:$('#selUnidade').val(),
                unidadeoutro:$('#inputUnidadeOutro').val(),
                descricao: removerCaracteresEspeciais($('#txtDescricao').val()),
                datainicio: $('#inputDataInicio').val(),
                datatermino: $('#inputDataTermino').val(),
                tiporequisitante:$('#selTipoRequisitante').val(),
                token: $('#csrf_token').val() 
            };
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {            

                    if (data.ERRO == "OK") {                    
                        exibiralerta('success','Card atualizado com sucesso!');
                        $('#bidcard').html(data.ID_CARDS);
                        $('#modalSucesso').modal('show');
                    }
                    else {
                        exibiralerta('danger',data.ERRO);
                    }    
                    $('.content-body').unblock();
                },
                error: function(xhr, status, error) {
                    exibiralerta('danger','Tente novamente! - ' + error);
                    $('.content-body').unblock();
                }
            });
           
    
        } else {
            // Se o formulário não for válido, exibe as mensagens de erro
            exibiralerta('danger','Preencha todos os campos obrigatórios.');
            if (form) {
                form.classList.add('was-validated');
            }
            setTimeout(function() {
                $('.btn-close').trigger('click');
             }, 3000)
            
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
                $("#selDetalheTipoID").append('<option value=""></option>');
                $.each(data.REGISTROS, function(index, option) {
                    if ((textSelTipoID === "O-Outros") && (option.DESCRICAO === "Outros")){
                        $("#selDetalheTipoID").append('<option selected value="' + option.ID + '">' + option.DESCRICAO + '</option>');
                        $('#inputOutro').val('');                        
                        $('#divOutro').show();                        
                        $('#inputOutro').focus();
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

    
    $('#selDetalheTipoID').on('change', function() {
        
        if ($("#selTipoID option:selected").text() == "O-Outros") {
            $('#inputOutro').val('');
            if ($(this).val() != ""){            
                $('#divOutro').show();
            }
            else {
                $('#divOutro').hide();
            }
        }
        
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
                    $("#selNavio").empty();
                    $("#selNavio").append('<option value=""> </option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selNavio").append('<option value="' + option.ID + '">' + option.NOME_NAVIO + '</option>');
                    });
                    $('.content-body').unblock();
                },
                error: function(xhr, status, error) {
                    $('.content-body').unblock();
                }
            });
            
    
        } 
        else {
    
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getnavio',
                token: $('#csrf_token').val() 
            };
           
    
            $.ajax({
                url: url,
                method: "POST",
                dataType: "json",            
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {        
                    $("#selNavio").empty();
                    $("#selNavio").append('<option value=""> </option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selNavio").append('<option value="' + option.ID + '">' + option.NOME_NAVIO + '</option>');
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