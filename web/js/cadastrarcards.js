function validouCard(){
    var form = document.getElementById('frmCadastrarCards');
    var valido = form.checkValidity();
    var validoudata = false;

    var inputDataInicio  = $('#inputDataInicio').val();
    var inputDataTermino = $('#inputDataTermino').val();
    // Esta função será executada quando o elemento perder o foco
    if ((validaData(inputDataInicio)) && (validaData(inputDataTermino)))  {                                                    
            var date1 = new Date(parseDataParaISO($('#inputDataInicio').val()));
            var date2 = new Date(parseDataParaISO($('#inputDataTermino').val()));                        
            validoudata = (date2 >= date1);         

            if (!validoudata){
                var errorMessage = "A data de início não pode ser maior que a data de término.";
                
                traduzirTexto('A data de início não pode ser maior que a data de término.', $('#idioma').val()).then(function(textoTraduzido) {
                    $('#inputDataInicio').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                    $('#inputDataInicio').addClass('is-invalid');    
                });
    
                traduzirTexto('A data de término não pode ser menor que a data de início.', $('#idioma').val()).then(function(textoTraduzido) {
                    $('#inputDataTermino').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                    $('#inputDataTermino').addClass('is-invalid');
                });
                
            }
            else {
                $('#inputDataInicio').closest('.row').find('.invalid-feedback').text(errorMessage).hide();
                $('#inputDataInicio').removeClass('is-invalid');
            }
    }
    
    
    var camposInvalidos = [];
    $('#frmCadastrarCards').find(':input').each(function() {
        if (!this.validity.valid) {
            
            
            var inputId = $(this).attr('id');
            var inputName = $(this).attr('name');
            
            if (inputId !== "inputUnidadeOutro") {
                camposInvalidos.push({ id: inputId, name: inputName });
            } else {
                var inputUnidadeOutroVal = $('#inputUnidadeOutro').val();
                var selUnidadeVal = $("#selUnidade").val();
                
                if (!(selUnidadeVal != "0" && (inputUnidadeOutroVal === "" || inputUnidadeOutroVal === null || typeof inputUnidadeOutroVal === 'undefined'))) {
                    camposInvalidos.push({ id: inputId, name: inputName });
                }
            }
            /*
            if (!(($("#selUnidade").val() != "0") && (($('#inputUnidadeOutro').val() === "") ||  (typeof $('#inputUnidadeOutro').val() === 'undefined') || ($('#inputUnidadeOutro').val() === null) || ($('#inputUnidadeOutro').val() === null)))) {
                camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
            }*/
        }
    });

    console.log(camposInvalidos); 
    $('#modalConfirmar').modal('hide');

    if (camposInvalidos.length ===0) {
        valido = true;
    }
    
    // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
    if (form && valido && validoudata)  {
        return true;
    }
    else {
        // Se o formulário não for válido, exibe as mensagens de erro
        exibiralerta('danger','Preencha todos os campos obrigatórios.');
        if (form) {
            form.classList.add('was-validated');
        }
        setTimeout(function() {
            $('.btn-close').trigger('click');
         }, 3000)
        return false;
    }
    
            

}

$(document).ready(function () {		

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
                $("#selUnidade").append('<option value="' + option.ID + '">' + decodeURIComponent(option.DESCRICAO) + '</option>');
            });
            
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            reject(error); // Em caso de erro, rejeita a promessa
        }
    });

  
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
            $("#selTipoID").append('<option value=""></option>');
            $.each(data.REGISTROS, function(index, option) {
                $("#selTipoID").append('<option value="' + option.ID + '">' + option.SIGLA + '-' + decodeURIComponent(option.DESCRICAO) + '</option>');
            });
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });

    $('#selUnidade').on('change', function() {
        $('#inputUnidadeOutro').val('');
        if ($(this).val() === "0") {
            $('#divUnidadeOutro').show();                        
            $('#inputUnidadeOutro').prop('required', true);                        
            $('#inputUnidadeOutro').focus(); 
        }
        else {            
            $('#inputOutro').prop('required', false);
            $('#inputUnidadeOutro').removeClass('is-invalid'); 
            $('#inputQuantidade').removeClass('is-invalid');             
            $('#divUnidadeOutro').hide();                        
            $('#inputQuantidade').val('');
            $('#inputQuantidade').focus();            
        }
    });

    

    $('#btnFecharSucessoCard').on('click', function() {
        document.getElementById("frmCadastrarCards").reset(); // Isso limpará todos os campos de entrada no formulário    
        $("#selDetalheTipoID").empty();        
        $('.btn-close').trigger('click');
    });
    
    
    $('#btnLimparFormulario').on('click', function() {
        document.getElementById("frmCadastrarCards").reset(); // Isso limpará todos os campos de entrada no formulário    
        $("#selDetalheTipoID").empty();
        
        traduzirTexto('Informe a data de início.', $('#idioma').val()).then(function(textoTraduzido) {            
            $('#inputDataInicio').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();            
        });

        traduzirTexto('Informe a data de término.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputDataTermino').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();            
        });

    });
    

    
    $('#btnConfirmarSolicitar').on('click', function() {
        if (validouCard())  {        
            $('#modalConfirmar').modal('show');
        }
    });

    $('#btnSolicitarCards').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouCard())  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'inscards',
                tiporequisitante:$('#selTipoRequisitante').val(),
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
                token: $('#csrf_token').val() 
            };
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {            

                    if (data.ERRO == "OK") {                    
                        exibiralerta('success','Card solicitado com sucesso!');
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
                        $("#selDetalheTipoID").append('<option selected value="' + option.ID + '">' + decodeURIComponent(option.DESCRICAO) + '</option>');
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

                    traduzirTexto('A data de início não pode ser maior que a data de término.', $('#idioma').val()).then(function(textoTraduzido) {
                        $(this).closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                        $(this).addClass('is-invalid');
                    });
        

                }
                else {
                    $(this).removeClass('is-invalid');    
                }

            }
        } else if (inputData.trim() != "") { 
            if (inputData.length != 10)  {   
                $(this).val();
                $(this).focus();                
                traduzirTexto('Informe uma data de início válida.', $('#idioma').val()).then(function(textoTraduzido) {                    
                    $(this).closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                    $(this).addClass('is-invalid');    
                });

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

                traduzirTexto('Informe uma data de início válida.', $('#idioma').val()).then(function(textoTraduzido) {                    
                    $(this).val('');
                    $(this).closest('.row').find('.invalid-feedback').text(textoTraduzido).show();                    
                });                
                
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
                    traduzirTexto('A data de término não pode ser menor que a data de início.', $('#idioma').val()).then(function(textoTraduzido) {                    
                        $(this).closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                        $(this).addClass('is-invalid');
                    });
                }
                else {
                    $(this).removeClass('is-invalid');    
                }

            }
        } else if (inputData.trim() != "") { 
            if (inputData.length != 10)  {                   
                
                traduzirTexto('Informe uma data de término válida.', $('#idioma').val()).then(function(textoTraduzido) {                    
                    $(this).closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                    $(this).addClass('is-invalid');
                    $(this).val();
                    $(this).focus();    
                });

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
                traduzirTexto('Informe uma data de início válida.', $('#idioma').val()).then(function(textoTraduzido) {                                        
                    $(this).closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                    $(this).val('');
                    });
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
                    if (data.ERRO == "Token Expirado"){
                        // Se o formulário não for válido, exibe as mensagens de erro
                        exibiralerta('danger','Sessão Expirada, você será direcionado ao login.');        
                        setTimeout(function() {
                            window.location.href = 'login.asp';
                            $('.btn-close').trigger('click');
                        }, 3000)

                    }    
                    $("#selNavio").empty();
                    $("#selNavio").append('<option value=""> </option>');
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

    $('#selNavio').on('change', function() {
		
        block();
    
        var valor = $(this).val();
        if (valor) {
    
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getcontrato',
                empresa: $('#selEmpresa').val(),
                navio: valor,
                token: $('#csrf_token').val() 
            };
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {
                    $('.content-body').unblock();
                    if (data.ERRO == "Token Expirado"){
                        // Se o formulário não for válido, exibe as mensagens de erro
                        exibiralerta('danger','Sessão Expirada, você será direcionado ao login.');        
                        setTimeout(function() {
                            window.location.href = 'login.asp';
                            $('.btn-close').trigger('click');
                        }, 3000)

                    }    

                    $('#inputNumeroContrato').val(data.REGISTROS[0].NUMERO_CONTRATO);
                },
                error: function(xhr, status, error) {
                    $('.content-body').unblock();
                }
                
            });
            
    
        } 
        else {
    
        }
    });

    $('#txtDescricao')
    .on('keydown', function(event) {
        // Bloqueia aspas duplas (") e simples (')
        if (event.key === '"' || event.key === "'" || event.keyCode === 34 || event.keyCode === 39) {
            event.preventDefault();
        }
    })
    .on('paste', function(event) {
        event.preventDefault(); // Impede a ação padrão de colar

        // Obtém o texto da área de transferência
        const textoColado = (event.originalEvent || event).clipboardData.getData('text');

        // Remove aspas simples e duplas
        const textoLimpo = textoColado.replace(/['"]/g, '');

        // Insere o texto limpo manualmente
        const input = $(this);
        const start = input[0].selectionStart;
        const end = input[0].selectionEnd;
        const valorAtual = input.val();
        const novoValor = valorAtual.substring(0, start) + textoLimpo + valorAtual.substring(end);

        input.val(novoValor);
    });


});