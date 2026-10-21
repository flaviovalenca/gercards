function AtualizaStatusCatracas() {

    //Resgata os Equipamentos
    $.ajax({
    url: serverapi + "/easbr.asp?funcao=getMonitoramentoEquipamentos&token=" + $('#token').val(),
    method: "GET",
    dataType: "json",            
    beforeSend : function(){                
        $('#btnAtualizarStatus').html('Atualizar Status <img src="images/gif/aguarde.gif" width="50px" height="50px" style="margin-top:-10px;" />');
    },
    success: function(data) {    
    
    var body = '';
    var status = '';

    var tabela = $('#tbMonitoramentoEquipamentos').DataTable();
    tabela.clear().draw();

    $.each(data.REGISTROS, function (i, item) {

        if ((item.ESTADO == 1) && (item.MODO == 0)) {                      
            status = '<span class="badge light badge-success"><i class="fa fa-circle text-success me-1"></i>  Catraca operacional</span>';
        }
        else if ((item.ESTADO == 1) && (item.MODO == 1)) {                      
            status ='<span class="badge light badge-warning"><i class="fa fa-circle text-warning me-1"></i> Modo ' + utf8Decode(item.MODO_DESCRICAO) +  ' | ' +  utf8Decode(item.ESTADO_DESCRICAO) + '</span>';
        }                        
        else {
            status ='<span class="badge light badge-danger"><i class="fa fa-circle text-danger me-1"></i> Modo ' + utf8Decode(item.MODO_DESCRICAO) +  ' | ' +  utf8Decode(item.ESTADO_DESCRICAO) + '</span>';
        }

        $('#tbMonitoramentoEquipamentos').DataTable().row.add([
            item.ID,
            item.EST_DESCRICAO,
            item.NOME_NAVIO,
            item.EQPI_NUMERO,
            item.EQPI_DESCRICAO,
            item.EQPI_DESCRICAO_APLICACAO,                        
            item.EQPI_IP,
            status,
            item.EQPI_CODATAHORA                        
        ]).draw();

        $('#btnAtualizarStatus').html('Atualizar Status');

    });
                            
    },
    error: function() {                                
    }
    })

}


$(document).ready(function () {

var segundosRestantes = 30;

    AtualizaStatusCatracas();

    $( "#btnAtualizarStatus" ).on( "click", function() {    
        AtualizaStatusCatracas();
    });

    function atualizarContagemRegressiva() {
        $('#btnAtualizarStatus').text('Atualizar Status (' + segundosRestantes + ')');
    }

    var intervalo = setInterval(function() {
        segundosRestantes--;
        atualizarContagemRegressiva();

        if (segundosRestantes <= 0) {
            AtualizaStatusCatracas(); // Execute o seu script
            segundosRestantes = 30; // Redefina a contagem regressiva
        }
    }, 1000); // Chama a função a cada 1 segundo (1000 milissegundos)
    

} );