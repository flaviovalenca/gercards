
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
                        $("#selUnidade").append('<option value="' + option.ID + '" selected>' + option.DESCRICAO + '</option>');
                    }
                    else {
                        $("#selUnidade").append('<option value="' + option.ID + '">' + option.DESCRICAO + '</option>');
                    }
                });
                if ("Outras" == $('#hhdunidade').val()){                    
                    $('#divUnidadeOutro').show();                        
                    $("#selUnidade").append('<option value="Outras" selected><b>Outras</b></option>');
                }
                else {
                    $("#selUnidade").append('<option value="Outras"><b>Outras</b></option>');
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
    
    $('#btnExcluirCards').on('click', function() {

        var palavra = $('#inputTextoPalavraExcluir').val();                
        var form = document.getElementById('frmExcluirCards');

        if ((palavra == '') || (palavra != 'EXCLUIR')){
            var errorMessage = "Palavra informada errada";
                $('#msgExcluir').text(errorMessage).show();
                $('#inputTextoPalavraExcluir').addClass('is-invalid');                
                exibiralertadiv('danger','Preencha todos os campos obrigatórios.','divMsgExcluir');
                return;
        }        


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
      
        if ((palavra == '') || (palavra != 'EXCLUIR')){
            form.classList.add('was-validated');
            return;
        }
        
        $('#modalConfirmar').modal('hide');

        block();
        
        var dados = {
            funcao: 'delcards',
            id:$('#inputIdExcluir').val(),
            token: $('#csrf_token').val() 
        };
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição
            success: function(data) {            

                if (data.ERRO == "OK") {                    
                    exibiralerta('success','Card excluído com sucesso!');                    
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