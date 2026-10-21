
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

    
    $('#inputMatricula').on('change keyup', function() {                
        var Matricula = formataSoNumeros($('#inputMatricula').val());
        if (Matricula === ""){
            $('#inputMatricula').siblings('.invalid-feedback').text('Informe a Matricula.');
            $('#inputMatricula').addClass('is-invalid');            
        }
        else {            
            $('#inputMatricula').removeClass('is-invalid');            
            $('#inputMatricula').siblings('.invalid-feedback').text('');
        }
    });

    $('#inputEmail').on('change keyup', function() {        
        
        if ($('#inputEmail').val() === "") {
            $('#inputEmail').siblings('.invalid-feedback').text('Informe o email.');
            $('#inputEmail').addClass('is-invalid');            
        }
        else if (!validaEmail($('#inputEmail').val())) {
            $('#inputEmail').siblings('.invalid-feedback').text('Email inválido. Por favor, Informe um email válido.');
            $('#inputEmail').addClass('is-invalid');            
        }
        else {
            $('#inputEmail').removeClass('is-invalid');            
            $('#inputEmail').siblings('.invalid-feedback').text('');
        }

    });

    $('#btnRecuperarSenha').on('click', function() {	

        var form = document.getElementById('formRecuperarSenha');
            
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
                
        if ($('#inputMatricula').val() === '') {
            return;
        }           
        else if ($('#inputEmail').val() === '') {
            return;
        }   
        else{

            
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getsenha',
                matricula: $('#inputMatricula').val(),           
                email : $('#inputEmail').val(),           
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
                        exibiralerta('success',"Um e-mail foi enviado para que você altere sua senha.");        
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

