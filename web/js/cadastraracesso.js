function validouRegistro() {

    var form = document.getElementById('frmRegistrarAcesso');
    var valido = form.checkValidity();

    var camposInvalidos = [];
    $('#frmRegistrarAcesso').find(':input').each(function() {
        if (!this.validity.valid) {
            camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
        }
    });

    console.log(camposInvalidos); 

    var validoumatricula = false;
    var Matricula = formataSoNumeros($('#inputMatricula').val());
    if (Matricula == ""){
        traduzirTexto('Informe a Matricula.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputMatricula').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputMatricula').addClass('is-invalid');            
        });
        
    }
    else {
        validoumatricula = true;
        $('#inputMatricula').removeClass('is-invalid');            
    }

    var validounome = false;
    if ($('#inputNome').val() == "") {
     
        traduzirTexto('Informe o nome.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputNome').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputNome').addClass('is-invalid');                            
        });
        
    }
    else {
        validounome = true;
        $('#inputNome').removeClass('is-invalid');            
    }

    var validoemail = false;
    if ($('#inputEmail').val() == "") {

        traduzirTexto('Informe o email.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputEmail').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputEmail').addClass('is-invalid');            
        });
        
    }
    else if (!validaEmail($('#inputEmail').val())) {
        traduzirTexto('Email inválido. Por favor, Informe um email válido.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputEmail').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputEmail').addClass('is-invalid');            
        });
        
    }
    else {
        validouemail = true;
        $('#inputEmail').removeClass('is-invalid');            
    }

    var validousenha = false;
    if (verificaSenha($('#inputSenha').val()) && ($('#inputSenha').val() != "")){
        validousenha = true;
        $('#inputSenha').removeClass('is-invalid');            
    }
    else if ($('#inputSenha').val() == "") {
        traduzirTexto('Informe a senha.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputSenha').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputSenha').addClass('is-invalid');            
        });
        
    }
    else {
        traduzirTexto('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputSenha').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputSenha').addClass('is-invalid');            
        });        
    }

    
    var validouconfirmarsenha = false;
    if (verificaSenha($('#inputConfirmarSenha').val()) && ($('#inputConfirmarSenha').val() != "") && ($('#inputConfirmarSenha').val() == $('#inputSenha').val() )){
        validouconfirmarsenha = true;
        $('#inputConfirmarSenha').removeClass('is-invalid');            
    }
    else if ($('#inputConfirmarSenha').val() == "") {
        traduzirTexto('Confirme a senha.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputConfirmarSenha').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputConfirmarSenha').addClass('is-invalid');            
        });

    }
    else if (($('#inputConfirmarSenha').val() != $('#inputSenha').val() )){
        traduzirTexto('A senha não confere.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputConfirmarSenha').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputConfirmarSenha').addClass('is-invalid');            
        });
        
    }
    else {
        traduzirTexto('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputConfirmarSenha').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputConfirmarSenha').addClass('is-invalid');            
        });
        
    }

    if (form && valido && validousenha && validouconfirmarsenha && validoumatricula && validounome) {
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
    

};


$(document).ready(function () {		


    $('#inputMatricula').on('input', function() {
        var matricula = formataSoNumeros($(this).val());

        // Verifica se a Matrícula tem entre 4 e 1 dígitos
        if (matricula.length >= 4 && matricula.length <= 15) {
            // Matrícula válida: remove a classe de inválido e a mensagem de erro
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('');            
        } else {
            // Matrícula inválida: adiciona a classe de inválido e exibe a mensagem de erro
            $(this).addClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('Matrícula inválida. Por favor, informe uma Matrícula de no mínino 4 dígitos.');            
        }
    });

    $('#inputNome').on('input', function() {
        var nome = $(this).val();
        
        if (nome.length > 0) {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('');        
        }
    });
    
    $('#inputEmail').keypress(function(event) {
        // Obtém o código da tecla digitada
        var charCode = event.which || event.keyCode;

        // Verifica se a tecla digitada é uma letra maiúscula
        if (charCode >= 65 && charCode <= 90) {
            // Converte a letra maiúscula para minúscula
            var lowercaseChar = String.fromCharCode(charCode).toLowerCase();
            
            // Insere a letra minúscula no campo de e-mail
            $(this).val($(this).val() + lowercaseChar);
            
            return false; // Impede a digitação da letra maiúscula original
        }

        var email = $(this).val();
        
        if (validaEmail(email)) {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('');        
        }
    });

    $('#inputSenha').blur(function(){    
        if (verificaSenha($(this).val()) && ($(this).val() != "")){            
            $(this).removeClass('is-invalid');            
        }
        else if ($(this).val() == "") {
            traduzirTexto('Informe a senha.', $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });            
        }
        else {
            traduzirTexto('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.', $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });        

        }
    });

    $('#inputConfirmarSenha').blur(function(){    
        if (verificaSenha($(this).val()) && ($(this).val() != "") && ($(this).val() == $('#inputSenha').val() )){            
            $(this).removeClass('is-invalid');            
        }
        else if ($('#inputConfirmarSenha').val() == "") {            
            traduzirTexto('Confirme a senha.', $('#idioma').val()).then(function(textoTraduzido) {
                 $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });
        }
        else if (($(this).val() != $('#inputSenha').val() )){
            traduzirTexto('A senha não confere.', $('#idioma').val()).then(function(textoTraduzido) {
                 $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });            
        }
        else {
            traduzirTexto('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.', $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });                    
        }    
    
    });

    $('#btnConfirmarRegistrar').on('click', function() {
        if (validouRegistro())  {        
            $('#modalConfirmar').modal('show');
        }
    });

    $('#btnRegistrarAcesso').on('click', function() {

        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouRegistro())  {        

            $('#modalConfirmar').modal('hide');
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'insregistroacesso',
                matricula: $('#inputMatricula').val(),
                nome: $('#inputNome').val(),
                e: $('#inputEmail').val(),            
                s: $('#inputSenha').val(),
                token: $('#csrf_token').val() 
            };
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {            

                    if ((data.ERRO) == "Token Inv%C3%A1ido") {
                        window.location.href = 'login.asp';
                    }
                    else if (data.ERRO == "OK") {                    
                        document.getElementById("frmRegistrarAcesso").reset(); // Isso limpará todos os campos de entrada no formulário                            
                        exibiralerta('success','Registro de acesso realizado com sucesso!');  
                        setTimeout(function() {
                            $('.btn-close').trigger('click');
                         }, 3000)
                                                                      
                    }
                    else {
                        exibiralerta('danger',decodeURIComponent(data.ERRO));
                    }    
                    $('.block').unblock();
                },
                error: function(xhr, status, error) {
                    exibiralerta('danger','Tente novamente! - ' + error);
                    $('.block').unblock();
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

  
});