var ambiente = "prod";
var server = "";
var serverapi = ""

if (ambiente == "dev") {
    server = "http://localhost:81/easbr";    
    serverapi = "http://localhost:81/apieasbr"
    //serverapi = 'http://cliente.easbr.com:8080/apimonitoramento';
}
else {
    server = 'http://cliente.easbr.com:8080/monitoramento';
    serverapi = 'http://cliente.easbr.com:8080/apimonitoramento';
}

// Verifica se a página está carregando em um dispositivo móvel
function isMobile() {
    const userAgent = navigator.userAgent;
    return /iPhone|iPad|iPod|Android|Mobile/i.test(userAgent);
}

function unloading(){
    $('body').unblock();
}

function loading() {

    //var aguarde = '<div class="alert alert-primary  fade show"> <strong style="font-size:20px;color:#FFFFFF;">Atualizando...</strong> </div>';
    var aguarde = '<div class="widget-stat card" style="opacity:0.7">' +
    '<div class="card-body p-4">'+
        '<h4 class="card-title" id="divMsgStatus">Carregando...</h4>'+														
    '</div>'+
    '</div>';

    if (isMobile()) {
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
