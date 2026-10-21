
// Verifica se a página está carregando em um dispositivo móvel
function isMobile() {
    const userAgent = navigator.userAgent;
    return /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent);
}

var url = serverapi + '/api.asp';

function utf8Decode(utf8String) {
    if (typeof utf8String != 'string') 
    throw new TypeError('parameter ‘utf8String’ is not a string');

    const unicodeString = utf8String
    .replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,(c) => {
      return String.fromCharCode(((c.charCodeAt(0)&0x0f)<<12) 
      | ((c.charCodeAt(1)&0x3f)<<6) 
      | ( c.charCodeAt(2)&0x3f)); })
    .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, (c) => {
      return String.fromCharCode((c.charCodeAt(0)&0x1f)<<6 
      | c.charCodeAt(1)&0x3f); 
    });
    return unicodeString;
}

function exibiralerta(tipo,mensagem){    

    traduzirTexto(mensagem, $('#idioma').val()).then(function(textoTraduzido) {            
        var alerta = '<div class="alert alert-' + tipo + '  alert-dismissible fade show text-start">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="me-2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close"><span><i class="fa-solid fa-xmark"></i></span>' +
        '</button>' +
        '<span id="msgAviso">' + textoTraduzido + '.</span>' +
      '</div>';
        $('#divMsg').html(alerta);

    });


}


function block(){

    var texto = '<div class="d-flex align-items-center flex-wrap justify-content-center">'+                
                '<div style="display:block"><img src="images/gif/aguarde.gif" width="100px" height="100px"></div>'+
                '</div>';

   $('.block').block({
        message: texto,         
        overlayCSS: {
           backgroundColor: '#01A3FF', // cor do background
            opacity: 0.2 // opacidade do background
        },
        css: {
           border: 'none',
           backgroundColor: 'transparent'           
        }                
    });

    $('.block').css('text-align', 'center'); // adiciona a propriedade text-align:center ao elemento .block
    $('.block .blockMsg').css('text-align', 'center');
    $('.block .blockMsg').css('left', '40%');
    $('.block .blockMsg').css('width', '50%');            
    
}


$(document).ready(function () {

    
    $('#inputSenha').blur(function(){
        if (verificaSenha($('#inputSenha').val()) && ($('#inputSenha').val() != "")){            
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
    });  
    
    $('#inputConfirmarSenha').blur(function(){
        
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
    });  

    $('#btnAlterarSenha').on('click', function() {	

        var form = document.getElementById('frmAlterarSenha');
        var valido = form.checkValidity();

        var camposInvalidos = [];
        $('#frmAlterarSenha').find(':input').each(function() {
            if (!this.validity.valid) {
                camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
            }
        });

        console.log(camposInvalidos); 

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
    
        if (valido && validousenha && validouconfirmarsenha) {                    
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'updsenha',
                id: $('#hddidusuario').val(),           
                key: $('#hddkey').val(),           
                s : $('#inputSenha').val(),           
                cs : $('#inputConfirmarSenha').val(),
                token: $('#csrf_token').val() 
            };
                    
            block();
           
            $.ajax({
                url: url ,
                type: 'POST',
                data: dados,
                dataType: 'json',
                success: function (data) {

                    $('.block').unblock();

                    if (data.ERRO != "OK" ){
                        if ((data.ERRO) == "Token Expirado") {
                            window.location.href = 'esqueceusenha.asp';
                        }
                        else {
                            exibiralerta('danger',decodeURIComponent(data.ERRO));
                        }
                    }
                    else {
                        exibiralerta('success',"Senha alterada com sucesso.");    
                        setTimeout(function() {
                            window.location.href = 'logoff.asp';
                            $('.btn-close').trigger('click');
                        }, 3000)
    
                    }
                    
                },
                error: function (xhr, status, error) {
                    $('.block').unblock();
                }
            });
            
        }
        
    });

   
    $('#btnPassword').focus();


}); 

