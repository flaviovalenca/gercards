var ambiente = "dev";
var server = "";
var serverapi = ""

if (ambiente == "dev") {
    //server = "http://localhost:81/easbr";    
    //serverapi = "http://localhost:81/apieasbr"
    server = "http://localhost/gercards";
    serverapi = "http://localhost/gercards";
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

function unloading(){
    $('body').unblock();
}

function loading(exibemsg) {
    
    var aguarde = '<div class="widget-stat card" style="opacity:0.7">' +
    '<div class="card-body p-4">'+
        '<h4 class="card-title" id="divMsgStatus">Carregando...</h4>'+														
    '</div>'+
    '</div>';

    if (isMobile()) {
       aguarde = '';
    }                    

    if (!exibemsg) {
        aguarde = '';
    }

    $('body').block({
        message: '<img src="images/gif/aguarde.gif" width="100px" height="100px" />' + aguarde,         
        overlayCSS: {
        backgroundColor: '#01A3FF', // cor do background
        opacity: 0.2 // opacidade do background
    },
        css: {
        border: 'none',
        backgroundColor: 'transparent'
    }                
    });

}


function exportDatatableToPdf(selector, filename) {
    /*
    Exporta uma datatable jQuery em formato HTML para um arquivo PDF.

    Args:
        selector (string): O seletor jQuery da datatable.
        filename (string): O nome do arquivo PDF de saída.
    */

    // Converte a datatable em um formato HTML
    var table = $(selector).DataTable();
    var html = table.buttons.exportHtml5({ format: 'html', customize: function(doc) {
        // Remove o cabeçalho padrão do jsPDF
        doc.content.splice(0, 1);
    } });

    // Cria o objeto jsPDF e adiciona o conteúdo HTML
    var doc = new jsPDF('l', 'pt');
    doc.html(html, {
        callback: function(doc) {
            // Salva o arquivo PDF
            doc.save(filename);
        }
    });
}

function utf8Encode(unicodeString) {
    if (typeof unicodeString != 'string') 
    throw new TypeError('parameter ‘unicodeString’ is not a string');

    const utf8String = unicodeString
    .replace(/[\u0080-\u07ff]/g,(c) => {
      let cc = c.charCodeAt(0);
      return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); })
    .replace(/[\u0800-\uffff]/g,(c) => {
      let cc = c.charCodeAt(0);
      return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); 
    });
    return utf8String;
}

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