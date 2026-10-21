var ambiente = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "dev" : "prod";
var server = "";
var serverapi = ""
var ipserver = "gercards.easbr.com";
var urlassinar = 'https://' + ipserver + ':8000/assinar';
var urlbaixarenvelope = 'https://' + ipserver + ':8000/baixarenvelope/';
var urlvisualizarenvelope = 'https://' + ipserver + ':8000/visualizarenvelope/';

if (ambiente == "dev") {
    server = window.location.origin + "/gercards";
    serverapi = server;
}
else {
    server = 'https://gercards.easbr.com';
    serverapi = 'https://gercards.easbr.com';
}

// Verifica se a página está carregando em um dispositivo móvel
function isMobile() {
    const userAgent = navigator.userAgent;
    return /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent);
}

var url = serverapi + '/api.asp';

function definirArquivado(valor) {
    var checkbox = $('#switchArquivado');
    var label = $('label[for="switchArquivado"]');

    if (valor === 'S') {
      checkbox.prop('checked', true);
      checkbox.val('S');
      label.text('SIM');
    } else {
      checkbox.prop('checked', false);
      checkbox.val('N');
      label.text('NÃO');
    }
  }

function verificaSenha(senha) {
    var temNumero = false;
    var temLetraMinuscula = false;
    var temLetraMaiuscula = false;

    // Verifica se a senha tem pelo menos 8 caracteres
    if (senha.length < 8) {
        return false;
    }

    // Verifica cada caractere da senha
    for (var i = 0; i < senha.length; i++) {
        var caractere = senha.charAt(i);

        // Verifica se o caractere é um número
        if (!isNaN(caractere)) {
            temNumero = true;
        }

        // Verifica se o caractere é uma letra minúscula
        if (caractere >= "a" && caractere <= "z") {
            temLetraMinuscula = true;
        }

        // Verifica se o caractere é uma letra maiúscula
        if (caractere >= "A" && caractere <= "Z") {
            temLetraMaiuscula = true;
        }
    }

    // Verifica se a senha atende a todos os critérios
    if (temNumero && temLetraMinuscula && temLetraMaiuscula) {
        return true;
    } else {
        return false;
    }
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
$('.divMsg').html(alerta);

    });

}

function exibiralertadiv(tipo,mensagem,div){    

    traduzirTexto(mensagem, $('#idioma').val()).then(function(textoTraduzido) {
        // Se a tradução não for encontrada, `textoTraduzido` será o texto original
        var alerta = '<div class="alert alert-' + tipo + '  alert-dismissible fade show text-start">' +
        '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="me-2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close"><span><i class="fa-solid fa-xmark"></i></span>' +
        '</button>' +
        '<span id="msgAviso">' + textoTraduzido + '.</span>' +
      '</div>';

        $('#' + div ).html(alerta);  

        setTimeout(function() {
        $("#" + div).find('.btn-close').trigger('click');
        }, 3000)
        return false;

    });

    

    
}

function exibiralertatimer(tipo,mensagem){    
    var alerta = '<div class="alert alert-' + tipo + '  alert-dismissible fade show text-start">' +
                '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="me-2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' +
                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="btn-close"><span><i class="fa-solid fa-xmark"></i></span>' +
                '</button>' +
                '<span id="msgAviso">' + mensagem + '.</span>' +
              '</div>';
    
    $('#divMsg').html(alerta);

    setTimeout(function() {        
        $('.btn-close').trigger('click');
    }, 3000)

}

function blockid(id){

    var texto = '<div class="d-flex align-items-center flex-wrap justify-content-center">'+                
                '<div style="display:block"><img src="images/gif/aguarde.gif" width="100px" height="100px"></div>'+
                '</div>';

   $('#'+id).block({
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

    $('#'+id).css('text-align', 'center'); // adiciona a propriedade text-align:center ao elemento .block
    $('#'+id + '.blockMsg').css('text-align', 'center');
    $('#'+id + '.blockMsg').css('left', '40%');
    $('#'+id + '.blockMsg').css('width', '50%');            
    
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

function fixEncoding(str) {
    // Converte a string para uma array de bytes usando a codificação incorreta (ISO-8859-1)
    const bytes = new Uint8Array(str.split('').map(char => char.charCodeAt(0)));
    // Decodifica os bytes para uma string usando a codificação correta (UTF-8)
    return new TextDecoder('utf-8').decode(bytes);
}

function getenvelope(acao, idbotao, envelope) {
    var dados = {
        funcao: 'getenvelope',
        envelope: envelope,
        token: $('#csrf_token').val() 
    };

    var textobtn = $('#' + idbotao).text();

    $('#' + idbotao).prop("disabled", true);
    $('#' + idbotao).html('<img src="images/gif/loading.gif">&nbsp;Aguarde...');  
    
    blockid('main-wrapper');

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição            
        success: function(data) {           
            if (data.ERRO == "Token Expirado") {
                // Se o formulário não for válido, exibe as mensagens de erro
                exibiralerta('danger', 'Sessão Expirada, você será direcionado ao login.');        
                setTimeout(function() {
                    window.location.href = 'login.asp';
                    $('.btn-close').trigger('click');
                }, 3000);
                return;            
            }   
            
            $('#' + idbotao).prop("disabled", false);
            $('#' + idbotao).html(textobtn);
            if (data.ERRO === "OK") {

                var objEnvelope = JSON.parse(data.ENVELOPE);

                try {
                	                               
                   const byteCharacters = atob(objEnvelope.fileContent);
                   const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);

                    // Cria um link de download/visualização
                    const link = document.createElement('a');
                    link.href = url;
                    
                    if (acao == 'V') {
                        // Abre o PDF em uma nova aba
                        link.target = '_blank';
                    } else {
                        // Baixa o PDF
                        link.download = data.fileName; // Define o nome do arquivo para download
                    }

                    // Simula um clique no link
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Libera o URL temporário
                    URL.revokeObjectURL(url);

                    $('#main-wrapper').unblock();
                } catch (error) {
                    $('#main-wrapper').unblock();
                    exibiralerta('danger', "Problema ao baixar o arquivo, tente novamente!");
                }
            } else {
                $('#main-wrapper').unblock();
                if (data.TEMPORESTANTE === "-1") {    
                    exibiralerta('danger', "Problema de comunicação com o servidor de assinatura, tente novamente!");
                } else if (data.AUTORIZADO === "N") {
                    $('#divMsgCard').html(decodeURIComponent(data.ERRO));
                    $('#divModalTempo').modal('show');                    
                }
            }
        },
        error: function(xhr, status, error) {
            $('#main-wrapper').unblock();
            $('#' + idbotao).prop("disabled", false);
            $('#' + idbotao).html(textobtn);
            exibiralerta('danger', 'Problema de comunicação com o servidor de assinatura, tente novamente!');
        }
    });
}


function getMenuAcaoInline(item,perfil,i){
    
    var acoes = '';
    obj = JSON.stringify(item);                
    encodedObj = encodeURIComponent(obj);
    
    if (item.ENVELOPE_ID === "") {
        if (perfil === "A"){
            acoes = '<div class="d-flex">';

            if ((item.DATA_REJEICAO != "") && (item.DATA_REJEICAO != null)) {
               acoes += '<a href="#" title="Assinar PDF" class="btn btn-light shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>';                                
            }
            else {
                acoes += '<a href="assinarcards.asp?id='   + item.ID + '" title="Assinar PDF" class="btn btn-info shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>';                                
            }    
            if (item.DATA_ASSINATURA != "") {
               acoes += '<a href="#" title="Rejeitar Card" class="btn btn-light shadow btn-xs sharp me-1"><i class="fa-solid fa-ban"></i></a>';                                
            }    
            else {
                if ((item.DATA_REJEICAO != "") && (item.DATA_REJEICAO != null)) {
                    acoes += '<a href="#" title="Rejeitar Card" class="btn btn-light shadow btn-xs sharp me-1"><i class="fa-solid fa-ban"></i></a>';                                
                }
                else {
                    acoes += '<a href="#" onclick="rejeitarcard(\'' + encodedObj + '\')" title="Rejeitar Card" class="btn btn-danger shadow btn-xs sharp me-1"><i class="fa-solid fa-ban"></i></a>';                                
                }
            }    

            if ((item.DATA_REJEICAO != "") && (item.DATA_REJEICAO != null)) {
                acoes += '<a href="#" title="Editar solicitação" class="btn btn-light shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
                '<a href="#" title="Excluir solicitação" class="btn btn-light shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
                '</div>';
            }
            else {
                acoes += '<a href="atualizarcards.asp?id=' + item.ID + '" title="Editar solicitação" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
                '<a href="excluircards.asp?id='   + item.ID + '" title="Excluir solicitação" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
                '</div>';

            }  
        }
        else if (perfil === "S"){
            acoes = '<div class="d-flex">';
            if (item.DATA_ASSINATURA != "") {
                acoes += '<a href="#" title="Assinar PDF" class="btn btn-light shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>';
            }
            else {
                acoes += '<a href="assinarcards.asp?id='   + item.ID +'" title="Assinar PDF" class="btn btn-info shadow btn-xs sharp me-1"><i class="fas fa-file-signature"></i></a>';
            }
            
            if ((item.DATA_REJEICAO != "") && (item.DATA_REJEICAO != null)) {
                acoes += '<a href="#" title="Rejeitar Card" class="btn btn-light shadow btn-xs sharp me-1"><i class="fa-solid fa-ban"></i></a>' +                                
                '<a href="#" title="Editar solicitação" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
                '<a href="#" title="Excluir solicitação" class="btn btn-light  shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
                '</div>';
            }
            else {
                acoes += '<a href="#" onclick="rejeitarcard(\'' + encodedObj + '\')" title="Rejeitar Card" class="btn btn-danger shadow btn-xs sharp me-1"><i class="fa-solid fa-ban"></i></a>' +                                
                '<a href="#" title="Editar solicitação" class="btn btn-light  shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>'+
                '<a href="#" title="Excluir solicitação" class="btn btn-light  shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +								
                '</div>';
            }
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

        var acoes = '<div class="d-flex">' +
            '<a href="visualizarcards.asp?id=' + item.ID +'" title="Visualizar dados." class="btn btn-danger  shadow btn-xs sharp me-1"><i class="fas fa-file-pdf"></i></a>' +
            '<a href="#"' + "id=lnkacaovisualizar" + i + '" onclick="getenvelope(\'' + 'V' + '\',\'' + 'lnkacaovisualizar' + i + '\',\'' + item.ENVELOPE_ID + '\')" title="Visualizar documento." class="btn btn-secondary  shadow btn-xs sharp me-1"><i class="fas fa-file-pdf"></i></a>' +
            '<a href="#"' + "id=lnkacaobaixar"     + i + '" onclick="getenvelope(\'' + 'B' + '\',\'' + 'lnkacaobaixar' + i + '\',\'' + item.ENVELOPE_ID + '\')" title="Baixar documento." class="btn btn-info  shadow btn-xs sharp me-1"><i class="fas fa-download"></i></a>' +
            '</div>';

    }

    return acoes;
    
}


function getMenuAcao(item, perfil, i, idioma) {
    const traduzir = (pt, en) => idioma === 'en' ? en : pt;

    const textos = {
        assinar: traduzir('Assinar Card', 'Sign Card'),
        rejeitar: traduzir('Rejeitar Card', 'Reject Card'),
        editar: traduzir('Editar Solicitação', 'Edit Request'),
        excluir: traduzir('Excluir Solicitação', 'Delete Request'),
        visualizarDados: traduzir('Visualizar Dados', 'View Data'),
        visualizarDoc: traduzir('Visualizar Documento', 'View Document'),
        baixarDoc: traduzir('Baixar Documento', 'Download Document'),
        arquivarCard: traduzir('Arquivar Card','Archive Card'),
        desarquivarCard: traduzir('Desarquivar Card','Unarchive Card'),
    };

    var obj = JSON.stringify(item);                
    var encodedObj = encodeURIComponent(obj);
    var status = 'secondary';  

    if (item.DATA_ASSINATURA != "") status = 'success';
    if ((item.DATA_REJEICAO != "") && (item.DATA_REJEICAO != null)) status = 'danger';                     

    var menu = '<div class="dropdown">' +
        '<button type="button" class="btn btn-' + status + ' light sharp" data-bs-toggle="dropdown" aria-expanded="false">' +
        '<svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg>' +
        '</button>' +
        '<div class="dropdown-menu">';
    
    var menuitem = "";
    var menuclose = '</div></div>';

    const visualizarItem = () => {
        menuitem += `<a href="visualizarcards.asp?id=${item.ID}" title="${textos.visualizarDados}" class="dropdown-item">${textos.visualizarDados}</a>`;
        if (perfil === "A") {               
            if (item.DT_ARQUIVAMENTO != "") {
                menuitem += `<a href="#" id="lnkacaoarquivar${i}" onclick="desarquivar('${encodedObj}')" title="${textos.desarquivarCard}" class="dropdown-item"><i class="fa fa-archive"></i>${textos.desarquivarCard}</a>`;
            }
            else {
                menuitem += `<a href="#" id="lnkacaoarquivar${i}" onclick="arquivar('${encodedObj}')" title="${textos.arquivarCard}" class="dropdown-item"><i class="fa fa-archive"></i>${textos.arquivarCard}</a>`;
            }
        }
    };

    const botoesDownload = () => {
        menuitem += `<a href="#" id="lnkacaovisualizar${i}" onclick="getenvelope('V','lnkacaovisualizar${i}','${item.ENVELOPE_ID}')" title="${textos.visualizarDoc}" class="dropdown-item">${textos.visualizarDoc}</a>`;
        menuitem += `<a href="#" id="lnkacaobaixar${i}" onclick="getenvelope('B','lnkacaobaixar${i}','${item.ENVELOPE_ID}')" title="${textos.baixarDoc}" class="dropdown-item">${textos.baixarDoc}</a>`;
    };

    if (perfil === "A") {
        if (!item.DATA_ASSINATURA && !item.DATA_REJEICAO) {
            menuitem += `<a href="assinarcards.asp?id=${item.ID}" title="${textos.assinar}" class="dropdown-item"><i class="fas fa-file-signature"></i> ${textos.assinar}</a>`;
            menuitem += `<a href="#" onclick="rejeitarcard('${encodedObj}')" title="${textos.rejeitar}" class="dropdown-item"><i class="fa-solid fa-ban"></i> ${textos.rejeitar}</a>`;
            menuitem += `<a href="atualizarcards.asp?id=${item.ID}" title="${textos.editar}" class="dropdown-item"><i class="fas fa-pencil-alt"></i> ${textos.editar}</a>`;
            menuitem += `<a href="excluircards.asp?id=${item.ID}" title="${textos.excluir}" class="dropdown-item"><i class="fa fa-trash"></i> ${textos.excluir}</a>`;
            if (item.DT_ARQUIVAMENTO != "") {
                menuitem += `<a href="#" id="lnkacaoarquivar${i}" onclick="desarquivar('${encodedObj}')" title="${textos.desarquivarCard}" class="dropdown-item"><i class="fa fa-archive"></i>${textos.desarquivarCard}</a>`;
            }
            else {
                menuitem += `<a href="#" id="lnkacaoarquivar${i}" onclick="arquivar('${encodedObj}')" title="${textos.arquivarCard}" class="dropdown-item"><i class="fa fa-archive"></i>${textos.arquivarCard}</a>`;
            }
            
        } else if (item.DATA_ASSINATURA && !item.DATA_REJEICAO) {
            visualizarItem();
            botoesDownload();
        } else if (item.DATA_REJEICAO) {
            visualizarItem();
        }
    } else if (perfil === "S") {
        if (!item.DATA_ASSINATURA && !item.DATA_REJEICAO) {
            menuitem += `<a href="assinarcards.asp?id=${item.ID}" title="${textos.assinar}" class="dropdown-item"><i class="fas fa-file-signature"></i> ${textos.assinar}</a>`;
            menuitem += `<a href="#" onclick="rejeitarcard('${encodedObj}')" title="${textos.rejeitar}" class="dropdown-item"><i class="fa-solid fa-ban"></i> ${textos.rejeitar}</a>`;
        } else if (item.DATA_ASSINATURA && !item.DATA_REJEICAO) {
            visualizarItem();
            botoesDownload();
        } else if (item.DATA_REJEICAO) {
            visualizarItem();
        }
    } else if (perfil === "E") {
        if (!item.DATA_ASSINATURA && !item.DATA_REJEICAO) {
            menuitem += `<a href="atualizarcards.asp?id=${item.ID}" title="${textos.editar}" class="dropdown-item"><i class="fas fa-pencil-alt"></i> ${textos.editar}</a>`;
            menuitem += `<a href="excluircards.asp?id=${item.ID}" title="${textos.excluir}" class="dropdown-item"><i class="fa fa-trash"></i> ${textos.excluir}</a>`;
        } else {
            visualizarItem();
        }
    } else {
        visualizarItem();
    }
    
    if (item.TIPO_REQUISITANTE === "A" || item.TIPO_REQUISITANTE === "" || item.TIPO_REQUISITANTE == null) {
        return menu + menuitem + menuclose;
    }
    else {
        return "";
    }


}

function getTipoRequisitante(item) {
    const tipos = {
        E: "EAS",
        A: "ARMADOR"
    };

    return tipos[item.TIPO_REQUISITANTE] || "NÃO INFORMADO";
}


function getAssinado(item, idioma) {
    
    const traduzir = (pt, en) => idioma === 'en' ? en : pt;
    const textos = {
        ArquivadoEm: traduzir('Arquivado em', 'Archived on'),
        Por: traduzir('Por', 'By'),
        solicitadoEm: traduzir('Solicitado em', 'Requested on'),
        naoAssinado: traduzir('NÃO ASSINADO', 'NOT SIGNED'),
        assinadoPor: traduzir('Assinado por', 'Signed by'),
        rejeitadoEm: traduzir('Rejeitado em', 'Rejected on')
    };

    let assinado = `${textos.solicitadoEm} ${item.DATA_SOLICITACAO}<br> ${textos.naoAssinado}`;

    if (item.DATA_ASSINATURA) {
        assinado = `${textos.solicitadoEm} ${item.DATA_SOLICITACAO}<br><br> ${textos.assinadoPor} ${decodeURIComponent(item.NOME_ASSINANTE)}<br> em ${item.DATA_ASSINATURA}`;
    }

    if (item.DATA_REJEICAO) {
        assinado += `<br><b>${textos.rejeitadoEm} ${item.DATA_REJEICAO}</b>`;
    }

    if (item.DT_ARQUIVAMENTO) {
        assinado += `<br><b style="color:red">${textos.ArquivadoEm} ${item.DT_ARQUIVAMENTO} ${textos.Por} ${item.USUARIO_ARQUIVAMENTO}</b>`;
    }


    return assinado;
}


function getStatus(item, idioma) {
    const traduzir = (pt, en) => idioma === 'en' ? en : pt;

    const textos = {
        rejeitado: traduzir('Rejeitado', 'Rejected'),
        assinado: traduzir('Assinado', 'Signed'),
        naoAssinado: traduzir('Não Assinado', 'Not Signed')
    };

    let status = "";

    if (item.TIPO_REQUISITANTE === "A" || item.TIPO_REQUISITANTE === "" || item.TIPO_REQUISITANTE == null) {
        if (item.DATA_REJEICAO) {
            status = `<span class="badge light badge-danger">${textos.rejeitado}</span>`;
        } else if (item.DATA_ASSINATURA) {
            status = `<span class="badge light badge-success">${textos.assinado}</span>`;
        } else {
            status = `<span class="badge light badge-secondary">${textos.naoAssinado}</span>`;
        }
    }    

    return status;
}


function removerCaracteresEspeciais(str) {
    // Define uma expressão regular que mantém letras acentuadas e remove outros caracteres especiais
    const regex = /[#\$%¨&*\(\)@]/g;
    // Usa o método replace para substituir os caracteres especiais por uma string vazia
    return str.replace(regex, '');
}

function traduzirTextos(textos, idioma) {
    return new Promise((resolve, reject) => {
        $.getJSON('js/dicionario.json', function(data) {
            const translations = data[idioma];

            if (!translations) {
                console.error('Traduções não encontradas para o idioma: ' + idioma);
                const resultadoFallback = Object.assign([...textos], Object.fromEntries(textos.map(t => [t, t])));
                resolve(resultadoFallback);
                return;
            }

            const traduzidos = textos.map(texto => translations[texto.trim()] || texto);

            // Cria um array com índice + também como dicionário com chave original
            const resultado = Object.assign([...traduzidos], 
                Object.fromEntries(textos.map((texto, index) => [texto, traduzidos[index]]))
            );

            resolve(resultado);
        }).fail(function() {
            console.error('Erro ao carregar dicionario.json');
            const resultadoErro = Object.assign([...textos], Object.fromEntries(textos.map(t => [t, t])));
            resolve(resultadoErro);
        });
    });
}


function traduzirTexto(texto, idioma) {
    return new Promise((resolve, reject) => {
        $.getJSON('js/dicionario.json', function(data) {
            const translations = data[idioma]; // Pega o idioma especificado

            if (!translations) {
                console.error('Traduções não encontradas para o idioma: ' + idioma);
                resolve(texto); // Retorna o texto original no caso de erro de tradução
                return;
            }

            // Verifica se existe a tradução para o texto fornecido
            const textoTraduzido = translations[texto.trim()] || texto; // Se não houver tradução, retorna o texto original

            resolve(textoTraduzido); // Resolve a promessa com a tradução
        }).fail(function() {
            console.error('Erro ao carregar dicionario.json');
            resolve(texto); // Retorna o texto original em caso de erro
        });
    });
}


$(document).ready(function () {
    
    $.getJSON('js/dicionario.json', function(data) {
        const translations = data[$('#idioma').val()]; // Pega o idioma "en"

        $('body *').each(function() {
            // Traduz o texto visível (caso não tenha filhos)
            if ($(this).children().length === 0) {
                let text = $(this).text().trim();
                if (translations[text]) {
                    $(this).text(translations[text]);
                }
            }
    
            // Traduz atributos específicos (placeholder, title, alt)
            const attributes = ['placeholder', 'title', 'alt'];
            attributes.forEach(attr => {
                let attrValue = $(this).attr(attr);
                if (attrValue && translations[attrValue]) {
                    $(this).attr(attr, translations[attrValue]);
                }
            });
        });

        
    }).fail(function() {
        console.error('Erro ao carregar dicionario.json');
    });

       
    // Carregar o dicionário de um arquivo externo
    
    /*
    
    $.getJSON("js/dicionario.json", function (data) {
        dicionario = data;
        traduzirPagina();
    });

    function traduzirTexto(texto, idioma) {
        return dicionario[idioma] && dicionario[idioma][texto] ? dicionario[idioma][texto] : texto;
    }

    function traduzirPagina() {
        $(".traduzir").each(function () {
            let textoOriginal = $(this).text().trim();
            let idioma = $(this).data("lang");
    
            // Verifica se há tradução para o texto
            let textoTraduzido = traduzirTexto(textoOriginal, idioma);
    
            // Substitui o conteúdo apenas se o texto for diferente
            if (textoTraduzido !== textoOriginal) {
                $(this).text(textoTraduzido);
            }
        }); 
    }
    */
    

}); 


document.addEventListener("DOMContentLoaded", function () {
    const langButtons = document.querySelectorAll('.lang-btn');
    //const urlParams = new URLSearchParams(window.location.search);
    //const currentLang = urlParams.get('lang') || 'pt'; // padrão: português

    const currentLang = $('#idioma').val() || 'pt'; // padrão: português

    langButtons.forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active-lang');
        } else {
            btn.classList.remove('active-lang');
        }
    });
});

 function getUrlParameter(name) {
         name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function inicializarTabela(idioma,idtable) {
    const languageUrls = {
        pt: 'vendor/datatables/js/pt-BR.json',
        en: 'vendor/datatables/js/en-GB.json'
    };

    // Verifica se a tabela já foi inicializada
    if ($.fn.DataTable.isDataTable('#' + idtable)) {
        $('#' + idtable).DataTable().destroy();
        $('#' + idtable).empty(); // Limpa HTML gerado pela instância anterior
    }

    var table = $('#' + idtable).DataTable({
        autoWidth: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'LEGAL'
            }, 'print'
        ],
        createdRow: function (row, data, index) {
            $(row).addClass('selected');
        },
        language: {
            url: languageUrls[idioma] || languageUrls['pt'], // padrão para português
            paginate: {
                next: '<i class="fa-solid fa-angle-right"></i>',
                previous: '<i class="fa-solid fa-angle-left"></i>'
            }
        }
    });
}

function setLanguage(lang) {
		localStorage.setItem('lang', lang); // Salva no localStorage
		const url = new URL(window.location.href);
		url.searchParams.set('lang', lang); // Altera ou adiciona ?lang=...
		window.location.href = url.toString(); // Redireciona
}
