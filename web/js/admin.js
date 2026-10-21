/*var ambiente = "dev";
var server = "";
let executandoAtualizacao = false;

if (ambiente == "dev") {
    server = "http://localhost:81/";    
}
else {
    server = 'http://cliente.easbr.com:8080/fortedesaomarcos/';
} */

function replaceInterrogationWithA(text) {
    return text.replace(/¿/g, "Ã");
}

function ocultarSuccess() {
    $("#divSuccess").fadeOut(1000);
}
    

function ocultarErro() {
    $("#divErro").fadeOut(1000);
}

function ShowMessage(mensagem,tipo) {
    if (tipo == "S") {        
        $('#msgSuccess').html(mensagem);
        $('#divSuccess').removeClass('d-none')
        $('#divSuccess').show();
        setTimeout(ocultarSuccess, 5000);
    }
    if (tipo == "E") {        
        $('#msgErro').html(mensagem);
        $('#msgErro').removeClass('d-none')
        $('#divErro').show();
        setTimeout(ocultarErro, 5000);
    }
    
}

function excluirGrupo(id,numero) {
    $('#inputTextoPalavraExcluir').val('');
    $('#inputexcluirgrupo').val(id);    
    $('#inputexcluirgruponumero').val(numero); 
    $('#gruponumeroexcluir').html(numero);
    $('#divErroExcluirGrupo').addClass('d-none');
}

function excluirEquipamento(id,numero) {    
    $('#inputTextoPalavraExcluirEquipamento').val(''); 
    $('#equipamentonumeroexcluir').html(numero);
    $('#inputexcluirequipamento').val(id);   
      
}

function mostrarSenha() {
    var senhaInput = document.getElementById("inputPasswordLogin");
    var tipoAtual = senhaInput.getAttribute("type");

    if (tipoAtual === "password") {
        senhaInput.setAttribute("type", "text");
    } else {
        senhaInput.setAttribute("type", "password");
    }
}

function mostrarSenhaAtualizar() {
    var senhaInput = document.getElementById("inputPasswordLoginAtualizar");
    var tipoAtual = senhaInput.getAttribute("type");

    if (tipoAtual === "password") {
        senhaInput.setAttribute("type", "text");
    } else {
        senhaInput.setAttribute("type", "password");
    }
}

function carregaGrupoPorIdNavio(id_navio){
    $.ajax({
        url: serverapi + "/easbr.asp?funcao=getMonitoramentoGrupoNavio&token=" + $('#token').val() + '&navio=' + id_navio,
        method: "GET",
        dataType: "json",            
        beforeSend : function(){                
       },
        success: function(data) {    
            
            var body = '';
            var acao = '';

            $.each(data.REGISTROS, function (i, item) {

                acao = '<span class="d-flex justify-content-end">' +
                '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarGrupo" onclick="atualizarGrupo(' + item.ID + ',' + item.GRP_NUMERO + ',\'' + item.GRP_DESCRICAO_SELECT + '\',\'' + item.GRP_TEXTO_PAINEL + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip"' +
                       'data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                       '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirGrupo" onclick="excluirGrupo(' + item.ID + ',' + item.GRP_NUMERO + ')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip"'+
                       'data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>'+
                       '</span>';

                       body += '<tr>';                               
                       body += '<td>' + item.GRP_NUMERO +'</td>';          
                       body += '<td>' + item.GRP_DESCRICAO +'</td>';                     
                       body += '<td>' + item.GRP_DESCRICAO_SELECT +'</td>';                               
                       body += '<td>' + item.GRP_TEXTO_PAINEL +'</td>';

                       body += '<td>' + acao +'</td>';
                       body += '</tr>';
            });

            $('#tbGruposBody').html(body);
                                      
        },
        error: function() {                                
        }
    });
}

function carregaEquipamentoPorIdNavio(id_navio){

        //Resgata os Equipamentos do Navio Selecionado
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getMonitoramentoEquipamentosNavio&token=" + $('#token').val() + '&navio=' + id_navio,
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data) {    
                
                var body = '';
                var acao = '';

                $.each(data.REGISTROS, function (i, item) {

                            acao = '<span class="d-flex justify-content-end">' +
                            '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarEquipamento" onclick="atualizarEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                            '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirEquipamento" onclick="excluirEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>' +
                            '</span>';

                           body += '<tr>';
                           body += '<td>' + item.ID +'</td>';
                           body += '<td>' + item.EQPI_NUMERO +'</td>';                               
                           body += '<td>' + item.EQPI_DESCRICAO +'</td>';
                           body += '<td>' + item.EQPI_DESCRICAO_APLICACAO +'</td>';

                           body += '<td>' + acao +'</td>';
                           body += '</tr>';
                });

                $('#tbEquipamentosBody').html(body);
                                          
            },
            error: function() {                                
            }
        })

    
}
function atualizarGrupo(id,numero,grpdescricaosel,textopainel){

    $('#idgrupoatualizar').val(id);
    $('#inputTextoFiltroSelectAtualizar').val(grpdescricaosel);
    $('#inputTextoPainelAtualizar').val(textopainel);

    $.ajax({
        url: serverapi + "/easbr.asp?funcao=getMonitoramentoDefaultAcessoGrupo&token=" + $('#token').val(),
        method: "GET",
        dataType: "json",            
        beforeSend : function(){                
    },
        success: function(data) {    
            $("#selGrupoEquipamentoAtualizar").empty();
            $("#selGrupoEquipamentoAtualizar").append('<option value="">Selecione o grupo</option>');
            $.each(data.REGISTROS, function(index, option) {
                if (option.GRP_NUMERO == numero) {
                    $("#selGrupoEquipamentoAtualizar").append('<option selected value="' + option.GRP_NUMERO + ';' + replaceInterrogationWithA(option.GRP_DESCRICAO) + '">' + option.GRP_NUMERO + '-' + replaceInterrogationWithA(option.GRP_DESCRICAO) +  '</option>');
                }
                else {
                    $("#selGrupoEquipamentoAtualizar").append('<option value="' + option.GRP_NUMERO + ';' + replaceInterrogationWithA(option.GRP_DESCRICAO) + '">' + option.GRP_NUMERO + '-' + replaceInterrogationWithA(option.GRP_DESCRICAO) +  '</option>');
                }
            });                                    
                                        
        },
        error: function() {                                
            $('#divErro').removeClass('d-none');
        }
    })

}


function atualizarEquipamento(id,numero,grpdescricaoaplicacao){

    var navio = $('#selNavio').val().split(";");
    $('#idequipamentoatualizar').val(id);
    $('#inputDescricaoEquipamentoAtualizar').val(grpdescricaoaplicacao);
    
    $.ajax({
        url: serverapi + "/easbr.asp?funcao=getMonitoramentoEquipamentosNavio&token=" + $('#token').val() + '&navio=' + navio[0] ,
        method: "GET",
        dataType: "json",            
        beforeSend : function(){                
    },
        success: function(data) {    
            $("#selEquipamentoAtualizar").empty();
            $("#selEquipamentoAtualizar").append('<option value="">Selecione o grupo</option>');
            $.each(data.REGISTROS, function(index, option) {
                if (option.EQPI_NUMERO == numero) {
                    $("#selEquipamentoAtualizar").append('<option selected value="' + option.EQPI_NUMERO + ';' + replaceInterrogationWithA(option.EQPI_DESCRICAO) + '">' + option.EQPI_NUMERO + '-' + replaceInterrogationWithA(option.EQPI_DESCRICAO) +  '</option>');
                }
                else {
                    $("#selEquipamentoAtualizar").append('<option value="' + option.EQPI_NUMERO + ';' + replaceInterrogationWithA(option.EQPI_DESCRICAO) + '">' + option.EQPI_NUMERO + '-' + replaceInterrogationWithA(option.EQPI_DESCRICAO) +  '</option>');
                }
            });                                    
                                        
        },
        error: function() {                                
            $('#divErro').removeClass('d-none');
        }
    })

}

function getGruposSelecionados() {
    // Seleciona a tabela pelo ID
    var table = document.getElementById("tbGrupos");

    // Inicializa uma variável para armazenar os valores da primeira coluna
    var grpnumero = "";

    // Percorre cada linha da tabela (ignorando o cabeçalho)
    for (var i = 1; i < table.rows.length; i++) {
        // Obtém o valor da primeira coluna da linha atual e adiciona à string
        var value = table.rows[i].cells[0].innerText;
        grpnumero += value + ",";
    }

    // Remove a última vírgula da string
    grpnumero = grpnumero.slice(0, -1);

    // Retorna a string com os valores da primeira coluna separados por vírgulas
    return grpnumero;
}

$(document).ready(function () {

        $(".uppercase").on("input", function() {
            var inputValue = $(this).val();
            $(this).val(inputValue.toUpperCase());
        });
            
 
        // Seleciona o elemento de input com o ID "meuInput"
        var inputDescricao = $('#inputEstDescricao');

        // Define a função para o evento mouseenter (quando o mouse entra no elemento)
        inputDescricao.on('mouseenter', function() {
            // Verifica se o campo está desabilitado e adiciona ou remove a classe 'cursor-disabled'
            if (inputDescricao.prop('readonly')) {
                inputDescricao.addClass('cursor-disabled');
            } else {
                inputDescricao.removeClass('cursor-disabled');
            }
        });

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
            }, false)
        })

        $("#inputTextoPalavraExcluir").keyup(function () {
            // Obtém o valor digitado no campo
            const textoDigitado = $(this).val().trim();
      
            // Verifica se o texto digitado é diferente de "EXCLUIR"
            if (textoDigitado !== "EXCLUIR") {
              // Adiciona a classe 'is-invalid' para exibir a mensagem de erro
              $(this).addClass("is-invalid");
            } else {
              // Remove a classe 'is-invalid' caso o texto seja "EXCLUIR"
              $(this).removeClass("is-invalid");
            }
          });

        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getMonitoramentoNavio&token=" + $('#token').val(),
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                
				loading(false);
        },
            success: function(data) {    
                $("#selNavio").empty();
                $("#selNavio").append('<option value="">Selecione o navio...</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#selNavio").append('<option value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO + ';' + option.LOGO + '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                });                                    
                $('#btnAtualizarNavio').addClass('disabled');
                $('#btnAtualizarNavio').removeClass('btn-primary');
                $('#btnAtualizarNavio').addClass('btn-light');
				unloading();
            },
            error: function() {                                
				unloading();
                $('#divErro').removeClass('d-none');
            }
        })

        
        $( "#btnVisualizarNavio" ).on( "click", function() {    
            var navio = $('#selNavio').val();
            if (navio != '') {
                navio = navio.split(";");
                window.location.href = "index.asp?id=" + navio[0] ;
            }
            
        })

        
        $( "#btnAtualizarEmpresa" ).on( "click", function() {    
            $('#inputNomeEmpresa').val($('#inputEstDescricao').val());
        })

        $( "#btnConfirmarNovoEquipamento" ).on( "click", function() {    

            var navio = $('#selNavio').val().split(";");
            var grupo = $('#selEquipamentoGrupo').val();
            var eqpi = $('#selEquipamento').val();    
            var eqpinumero =  '';
            var eqpidescricao = '';
            if ((eqpi != '')  && (eqpi != null)){
                eqpi =  $('#selEquipamento').val().split(';');                
                eqpinumero =  eqpi[0];
                eqpidescricao =  eqpi[1];
            }

            var grupo = $('#selEquipamentoGrupo').val();
            var idgrupo = '';
            if ((grupo != '')  && (grupo != null)){
                $('#selEquipamentoGrupo').val().split(';');
                idgrupo = grupo[0];
            }
            
            var eqpidescricaoaplicacao = $('#inputDescricaoEquipamento').val();
            var equipamentogrupo = $('#selEquipamentoGrupo').val();
            var token = $('#token').val();
            
            var form = document.getElementById('frmCadastrarEquipamento');
    
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
            
            
            if ((equipamentogrupo == '') |  (eqpinumero == '') || (eqpidescricao == '')  || (eqpidescricaoaplicacao == '') || (navio == '')){
                return;
            }
            
            var dados = 'navio =' + navio[0] + '&' + 'eqpinumero=' + eqpinumero + '&'  + 'eqpidescricao=' + encodeURIComponent(eqpidescricao) + 
                        '&' + 'idgrupo=' + idgrupo + '&' + 'eqpidescricaoaplicacao=' + encodeURIComponent(eqpidescricaoaplicacao) +  '&token=' + token;
                        
            $.ajax({
                url: serverapi + "/easbr.asp?funcao=CadastrarEquipamento",
                method: "POST",
                data: dados,
                dataType: "json",            
                beforeSend : function(){                
                },
                success: function(data1) {                    
    
                    if (data1.ERRO == "OK"){
                        $('#inputTextoFiltroSelect').val('');
                        $('#inputTextoPainel').val('');  
    
                        //Resgata os Equipamentos do Navio Selecionado
                        $.ajax({
                            url: serverapi + "/easbr.asp?funcao=getMonitoramentoEquipamentosNavio&token=" + $('#token').val() + '&navio=' + navio[0] ,
                            method: "GET",
                            dataType: "json",            
                            beforeSend : function(){                
                        },
                            success: function(data) {    
                                
                                var body = '';
                                var acao = '';
    
                                
                                $.each(data.REGISTROS, function (i, item) {
    
    
                                    acao = '<span class="d-flex justify-content-end">' +
                                           '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarEquipamento" onclick="atualizarEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                                           '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirEquipamento" onclick="excluirEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>' +
                                           '</span>';
    
                                        body += '<tr>';
                                        body += '<td>' + item.ID +'</td>';
                                        body += '<td>' + item.EQPI_NUMERO +'</td>';                               
                                        body += '<td>' + item.EQPI_DESCRICAO +'</td>';
                                        body += '<td>' + item.EQPI_DESCRICAO_APLICACAO +'</td>';
        
                                        body += '<td>' + acao +'</td>';
                                        body += '</tr>';
                                        
                                });

                                $('#tbEquipamentosBody').html(body);    
                                $("#ModalCenterCadastrarEquipamento").modal("hide");                                                            
                                ShowMessage('Equipamento <b>INSERIDO</b> com sucesso!',"S");

                                                        
                            },
                            error: function() {                                
                            }
                        }); 



                        
                        
                    }
                    else {                    
                        if ((data1.ERRO.indexOf('violada') > 0)||  (data1.ERRO.indexOf('unique') > 0)){                        
                            $('#msgErroEquipamento').html('Equipamento já incluído.');
                            $('#divErroEquipamento').removeClass('d-none');
                        }
                        else {
                            $('#msgErroEquipamento').html('Erro ao incluir equipamento. ' + data1.ERRO);
                            $('#divErroEquipamento').removeClass('d-none');
                        }
                        
                    }
                                                    
                },
                error: function() {                                
                }
            })
    
        })

    $( "#btnConfirmarNovoGrupo" ).on( "click", function() {    

        var navio = $('#selNavio').val().split(";");
        var grp = $('#selGrupoEquipamento').val().split(";");
        var grpnumero = grp[0];
        var grdescricao = grp[1];
        var grdescricaosel = $('#inputTextoFiltroSelect').val();
        var textopainel = $('#inputTextoPainel').val();
        var token = $('#token').val();
        
        var form = document.getElementById('frmCadastrarGrupo');

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
        
        if ((grpnumero == '')  || (textopainel == '') || (grdescricaosel == '')){
            return;
        }
        
        var dados = 'navio =' + navio[0] + '&' + 'grpnumero=' + grpnumero + '&'  + 'grpdescricao=' + encodeURIComponent(grdescricao) + 
                    '&' + 'grpdescricaosel=' + encodeURIComponent(grdescricaosel) + '&' + 'textopainel=' + encodeURIComponent(textopainel) + '&' + 
                    'token=' + token;
                    
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=CadastrarGrupo",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
            },
            success: function(data1) {                    

                if (data1.ERRO == "OK"){
                    $('#inputTextoFiltroSelect').val('');
                    $('#inputTextoPainel').val('');  

                    //Resgata os Grupos do Navio Selecionado
                    $.ajax({
                        url: serverapi + "/easbr.asp?funcao=getMonitoramentoGrupoNavio&token=" + $('#token').val() + '&navio=' + navio[0] ,
                        method: "GET",
                        dataType: "json",            
                        beforeSend : function(){                
                    },
                        success: function(data) {    
                            
                            var body = '';
                            var acao = '';

                            $.each(data.REGISTROS, function (i, item) {


                                acao = '<span class="d-flex justify-content-end">' +                                    
                                    '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarGrupo" onclick="atualizarGrupo(' + item.ID + ',' + item.GRP_NUMERO + ',\'' + item.GRP_DESCRICAO_SELECT + '\',\'' + item.GRP_TEXTO_PAINEL + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip"' +
                                    'data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                                    '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirGrupo" onclick="excluirGrupo(' + item.ID + ',' + item.GRP_NUMERO + ')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip"'+
                                    'data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>'+
                                    '</span>';

                                    body += '<tr>';                               
                                    body += '<td>' + item.GRP_NUMERO +'</td>';          
                                    body += '<td>' + item.GRP_DESCRICAO +'</td>';                     
                                    body += '<td>' + item.GRP_DESCRICAO_SELECT +'</td>';                               
                                    body += '<td>' + item.GRP_TEXTO_PAINEL +'</td>';

                                    body += '<td>' + acao +'</td>';
                                    body += '</tr>';

                                    
                            });

                            $("#ModalCenterCadastrarGrupo").modal("hide");                            
                            $('#tbGruposBody').html(body);
                            ShowMessage('Grupo <b>INSERIDO</b> com sucesso!',"S");
                                                    
                        },
                        error: function() {                                
                        }
                    }); 
                    
                }
                else {                    
					if ((data1.ERRO.indexOf('violada') > 0)||  (data1.ERRO.indexOf('unique') > 0)){                        
                        $('#msgErroGrupo').html('Grupo já incluído.');
                        $('#divErroGrupo').removeClass('d-none');
                    }
                    else {
                        $('#msgErroGrupo').html('Erro ao incluir grupo. ' + data1.ERRO);
                        $('#divErroGrupo').removeClass('d-none');
                    }
                    
                }
                                                
            },
            error: function() {                                
            }
        })

    })

    $( "#btnConfirmarAtualizarGrupo" ).on( "click", function() {    

        var id = $('#idgrupoatualizar').val();        
        var grdescricaosel = $('#inputTextoFiltroSelectAtualizar').val();
        var textopainel = $('#inputTextoPainelAtualizar').val();
        var token = $('#token').val();
        var navio = $('#selNavio').val().split(";");
        
        var form = document.getElementById('frmCadastrarGrupo');

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
      
        if ((id == '')  || (textopainel == '') || (grdescricaosel == '')){
            return;
        }
        
        var dados = 'id =' + id + '&' + 'grpdescricaosel=' + encodeURIComponent(grdescricaosel) + '&' + 'textopainel=' + encodeURIComponent(textopainel) + '&' + 
                    'token=' + token;
                  
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=AtualizarGrupo",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data1) {                    

                if (data1.ERRO == "OK"){

                    //Resgata os Grupos do Navio Selecionado
                    $.ajax({
                        url: serverapi + "/easbr.asp?funcao=getMonitoramentoGrupoNavio&token=" + $('#token').val() + '&navio=' + navio[0] ,
                        method: "GET",
                        dataType: "json",            
                        beforeSend : function(){                
                    },
                        success: function(data) {    
                            
                            var body = '';
                            var acao = '';

                            $.each(data.REGISTROS, function (i, item) {


                                acao = '<span class="d-flex justify-content-end">' +                                    
                                    '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarGrupo" onclick="atualizarGrupo(' + item.ID + ',' + item.GRP_NUMERO + ',\'' + item.GRP_DESCRICAO_SELECT + '\',\'' + item.GRP_TEXTO_PAINEL + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip"' +
                                    'data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                                    '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirGrupo" onclick="excluirGrupo(' + item.ID + ',' + item.GRP_NUMERO + ')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip"'+
                                    'data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>'+
                                    '</span>';

                                    body += '<tr>';                               
                                    body += '<td>' + item.GRP_NUMERO +'</td>';          
                                    body += '<td>' + item.GRP_DESCRICAO +'</td>';                     
                                    body += '<td>' + item.GRP_DESCRICAO_SELECT +'</td>';                               
                                    body += '<td>' + item.GRP_TEXTO_PAINEL +'</td>';

                                    body += '<td>' + acao +'</td>';
                                    body += '</tr>';

                                    
                            });

                            $("#ModalCenterAtualizarGrupo").modal("hide");                            
                            $('#tbGruposBody').html(body)

                            ShowMessage('Grupo <b>ATUALIZADO</b> com sucesso!',"S");
                                                    
                        },
                        error: function() {                                
                        }
                    }); 
                    
                }
                else {                    
                     $('#msgErroGrupoAtualizar').html('Erro ao incluir grupo. ' + data1.ERRO);
                     $('#divErroGrupoAtualizar').removeClass('d-none');
                    
                }
                                              
            },
            error: function() {                                
            }
        })

    })
    
    $( "#btnConfirmarExcluirGrupo" ).on( "click", function() {   
        
        var navio = $('#selNavio').val().split(";");
        var palavra = $('#inputTextoPalavraExcluir').val();
                
        var form = document.getElementById('frmCadastrarGrupo');

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
        
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=ExluirGrupo&token=" + $('#token').val(),
            method: "POST",
            data: 'id=' + $('#inputexcluirgrupo').val(),
            dataType: "json",            
            beforeSend : function(){                
        },
            success: function(data) {    
                
                if (data.ERRO == "OK"){                        
                    carregaGrupoPorIdNavio(navio[0]);
                    ShowMessage('Grupo <b>EXCLUÍDO</b> com sucesso!',"S");
                    $("#ModalCenterExcluirGrupo").modal("hide");
                }
                else if ((data.ERRO.indexOf('registro filho') > 0) || (data.ERRO.indexOf('child record') > 0)){  
                    $('#divErroExcluirGrupo').removeClass('d-none');
                    $('#msgErroExcluirGrupo').html('Exclua os equipamentos antes de excluir este grupo.');
                }
                else {
                    ShowMessage('Ocorreu um erro ao excluir o grupo.',data.ERRO);
                    $("#ModalCenterExcluirGrupo").modal("hide");
                }
                                            
            },
            error: function() {                                
                $('#divErro').removeClass('d-none');
            }
        })


    })

    $( "#btnConfirmarExcluirEquipamento" ).on( "click", function() {   
        
        var navio = $('#selNavio').val().split(";");
        var palavra = $('#inputTextoPalavraExcluirEquipamento').val();
                
        var form = document.getElementById('frmCadastrarEquipamento');

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
        
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=ExluirEquipamento&token=" + $('#token').val(),
            method: "POST",
            data: 'id=' + $('#inputexcluirequipamento').val(),
            dataType: "json",            
            beforeSend : function(){                
        },
            success: function(data) {    
                
                $("#ModalCenterExcluirEquipamento").modal("hide");
                if (data.ERRO == "OK"){                        
                    carregaEquipamentoPorIdNavio(navio[0]);
                    ShowMessage('Equipamento <b>EXCLUÍDO</b> com sucesso!',"S");
                }
                else {
                    ShowMessage('Ocorreu um erro ao excluir o equpamento.',data.ERRO);
                }
                                            
            },
            error: function() {                                
                $('#divErro').removeClass('d-none');
            }
        })


    })

    $( "#btnGrupoCadastrarNovo" ).on( "click", function() {   
                
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getMonitoramentoDefaultAcessoGrupo&token=" + $('#token').val(),
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                
        },
            success: function(data) {    
                $("#selGrupoEquipamento").empty();
                $("#selGrupoEquipamento").append('<option value="">Selecione o grupo</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#selGrupoEquipamento").append('<option value="' + option.GRP_NUMERO + ';' + replaceInterrogationWithA(option.GRP_DESCRICAO) + '">' + option.GRP_NUMERO + '-' + replaceInterrogationWithA(option.GRP_DESCRICAO) +  '</option>');
                });                                    
                                            
            },
            error: function() {                                
                $('#divErro').removeClass('d-none');
            }
        })


    });

    $( "#btnConfirmarAtualizarEquipamento" ).on( "click", function() {    

        var id = $('#idequipamentoatualizar').val();        
        var grpdescricaoaplicacao = $('#inputDescricaoEquipamentoAtualizar').val();
        var token = $('#token').val();
        var navio = $('#selNavio').val().split(";");
                
        var form = document.getElementById('frmCadastrarEquipamento');

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
      
        if ((id == '')  ||  (grpdescricaoaplicacao == '')){
            return;
        }
        
        var dados = 'id =' + id + '&' + 'grpdescricaoaplicacao=' + encodeURIComponent(grpdescricaoaplicacao) + '&' + 'token=' + token;
                  
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=AtualizarEquipamento",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data1) {                    

                if (data1.ERRO == "OK"){

                    //Resgata os Grupos do Navio Selecionado
                    $.ajax({
                        url: serverapi + "/easbr.asp?funcao=getMonitoramentoEquipamentosNavio&token=" + $('#token').val() + '&navio=' + navio[0] ,
                        method: "GET",
                        dataType: "json",            
                        beforeSend : function(){                
                    },
                        success: function(data) {    
                            
                            var body = '';
                            var acao = '';

                            $.each(data.REGISTROS, function (i, item) {

                                acao = '<span class="d-flex justify-content-end">' +
                                '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarEquipamento" onclick="atualizarEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                                '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirEquipamento" onclick="excluirEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>' +
                                '</span>';

                               body += '<tr>';
                               body += '<td>' + item.ID +'</td>';
                               body += '<td>' + item.EQPI_NUMERO +'</td>';                               
                               body += '<td>' + item.EQPI_DESCRICAO +'</td>';
                               body += '<td>' + item.EQPI_DESCRICAO_APLICACAO +'</td>';

                               body += '<td>' + acao +'</td>';
                               body += '</tr>';

                                    
                            });

                            $("#ModalCenterAtualizarEquipamento").modal("hide");                            
                            $('#tbEquipamentosBody').html(body)

                            ShowMessage('Equipamento <b>ATUALIZADO</b> com sucesso!',"S");
                                                    
                        },
                        error: function() {                                
                        }
                    }); 
                    
                }
                else {                    
                     $('#msgErroEquipamentoAtualizar').html('Erro ao atualizar equipamento. ' + data1.ERRO);
                     $('#divErroEquipamentoAtualizar').removeClass('d-none');
                    
                }
                                              
            },
            error: function() {                                
            }
        })

    });
    
    $( "#btnEquipamentoCadastrarNovo" ).on( "click", function() {   

        var navio = $('#selNavio').val().split(";");
        $('#divErroEquipamento').addClass('d-none');
        $('#inputDescricaoEquipamento').val('');
        $('#selEquipamento').empty();
        $("#selEquipamento").append('<option value="">Selecione o equipamento</option>');

        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getMonitoramentoGrupoNavio&token=" + $('#token').val() + '&navio=' + navio[0],
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                
        },
            success: function(data) {    
                $("#selEquipamentoGrupo").empty();
                $("#selEquipamentoGrupo").append('<option value="">Selecione o grupo</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#selEquipamentoGrupo").append('<option value="' + option.ID + ';' + option.GRP_NUMERO + ';' + replaceInterrogationWithA(option.GRP_DESCRICAO) + '">' + option.GRP_NUMERO + '-' + replaceInterrogationWithA(option.GRP_DESCRICAO) +  '</option>');
                });                                    
                                            
            },
            error: function() {                                
                $('#divErro').removeClass('d-none');
            }
        })
    

    })


    $( "#btnConfirmarAtualizarEmpresa" ).on( "click", function() {    

        var form = document.getElementById('frmAtualizarEmpresa');

        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (form && form.checkValidity()) {

            var empresa = $('#inputNomeEmpresa').val();
            var navio = $('#selNavio').val().split(";");
            var token = $('#token').val();
            var dados = 'navio =' + navio[0] + '&' + 'empresa=' + encodeURIComponent(empresa) + '&' + 'token=' + encodeURIComponent(token);
                  
            $.ajax({
                url: serverapi + "/easbr.asp?funcao=AtualizarNomeNavio",
                method: "POST",
                data: dados,
                dataType: "json",            
                beforeSend : function(){                
               },
                success: function(data) {    

                    $("#ModalCenterAtualizarEmpresa").modal("hide");
                    if (data.ERRO == "OK"){
                        $('#inputNomeEmpresa').val('');
                        $('#inputEstDescricao').val(empresa);
                        ShowMessage('Nome <b>ATUALIZADO</b> com sucesso!',"S");
                    }
                    else {
                        ShowMessage('Ocorreu um erro ao atualizar o nome.',data.ERRO);
                    }
                                                  
                },
                error: function() {                                
                }
            })



        } else {
          // Se o formulário não for válido, exibe as mensagens de erro
          if (form) {
            form.classList.add('was-validated');
          }
        }


    })

    $( "#btnConfirmarAtualizarLogoEmpresa" ).on( "click", function() {    

        var form = document.getElementById('frmAtualizarLogoEmpresa');

        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (form && form.checkValidity()) {
            
            var navio = $('#selNavio').val().split(";");
            var token = $('#token').val();
            var fileInput = $("#inputfileLogoEmpresa")[0];
            var file = fileInput.files[0];

            if (file) {
                
                var reader = new FileReader();

                reader.onload = function(e) {
                    
                    var base64String = e.target.result.split(',')[1]; // Remove the "data:image/jpeg;base64," part
                    var dados = "id=" + navio[0] + "&logo=" + encodeURIComponent(base64String) + "&tipo=" + encodeURIComponent(file.type) + "&token=" + encodeURIComponent(token);

                    $.ajax({
                        url: serverapi + "/easbr.asp?funcao=AtualizarLogoEmpresa",
                        method: "POST",
                        data: dados,
                        dataType: "json",            
                        beforeSend : function(){                
                       },
                        success: function(data) {    
        
                            $("#ModalCenterLogoEmpresa").modal("hide");
                            if (data.ERRO == "OK"){

                                $.ajax({
                                    url: serverapi + "/easbr.asp?funcao=getMonitoramentoNavio&token=" + $('#token').val(),
                                    method: "GET",
                                    dataType: "json",            
                                    beforeSend : function(){                
                                },
                                    success: function(data1) {    
                                        $("#selNavio").empty();
                                        $("#selNavio").append('<option value="">Selecione o navio...</option>');
                                        $.each(data1.REGISTROS, function(index, option) {
                                            $("#selNavio").append('<option value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO + ';' + option.LOGO + '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                                        });                                    
                                        $('#btnAtualizarNavio').addClass('disabled');
                                        $('#btnAtualizarNavio').removeClass('btn-primary');
                                        $('#btnAtualizarNavio').addClass('btn-light');

                                        if (data.IMAGEM  != '') {                        
                                            $('#imgLogo').attr('src',data.IMAGEM );
                                        }

                                        ShowMessage('LOGO <b>ATUALIZADA</b> com sucesso!',"S");
                                    },
                                    error: function() {                                
                                        $('#divErro').removeClass('d-none');
                                    }
                                })
                        


                            }
                            else {
                                ShowMessage('Ocorreu um erro ao atualizar a Logo.',data.ERRO);
                            }
                                                          
                        },
                        error: function() {                                
                        }
                    })
                
                };

                reader.readAsDataURL(file);
            }


        } else {
          // Se o formulário não for válido, exibe as mensagens de erro
          if (form) {
            form.classList.add('was-validated');
          }
        }


    })

    $( "#btnConfirmarNovoNavio" ).on( "click", function() {    
               
        var nomenavio = $('#inputNomeNavio').val();
        var empresa = $('#inputEmpresaEstrutura').val();
        var pass = $('#inputPasswordLogin').val();
        var ativo = $('#inputState').val().trim();

        var form = document.getElementById('formNavio');

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
      
      
        if ((nomenavio == '')  || (empresa == '') || (pass == '')){
            return;
        }

        var ativo= $('#inputState').val();
        var token = $('#token').val();
        var dados = 'nomenavio =' + nomenavio + '&' + 'empresa=' + empresa + '&' + 'pass=' + pass + '&' + 'ativo=' + ativo + '&' + 'token=' + token;
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=NovoNavio",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data) {   
                
                if (data.ERRO == "OK") {

                    $('#inputNomeNavio').val('');
                    $('#inputEmpresaEstrutura').val('');
                    $('#inputPasswordLogin').val('');
                    $('#inputState').val('N');

                    $("#ModalCenterCadastrarNavio").modal("hide");

                    $("#selNavio").empty();
                    $("#selNavio").append('<option value="">Selecione o navio...</option>');
                    var navios = JSON.parse(data.NAVIOS);
                    $.each(navios.REGISTROS, function(index, option) {
                        if (index === navios.REGISTROS.length - 1)  {                           
                            $("#selNavio").append('<option selected value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO +  '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                        }
                        else {
                            $("#selNavio").append('<option value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO +  '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                        }
                    });                                    


                    if (data.ERRO == "OK"){
                        ShowMessage('Navio <b>CADASTRADO</b> com sucesso!',"S");
                    }
                    else {
                        ShowMessage('Ocorreu um erro ao cadastrar o navio',data.ERRO);
                    }
                }

                if (ativo == 'S') {
                    $('#btnDesativarNavio').removeClass('d-none');
                    $('#btnAtivarNavio').addClass('d-none');
                }
                else{
                    $('#btnDesativarNavio').addClass('d-none');
                    $('#btnAtivarNavio').removeClass('d-none');
                }
                
                $('#btnAtualizarEmpresa').removeClass('disabled');
                $('#btnAtualizarEmpresa').removeClass('btn-light');
                $('#btnAtualizarEmpresa').addClass('btn-primary');                  

                $('#btnConsultarEmpresa').removeClass('disabled');
                $('#btnConsultarEmpresa').removeClass('btn-light');
                $('#btnConsultarEmpresa').addClass('btn-succcess');                  
                
                
                                              
            },
            error: function() {                                
            }
        })        
    } );

    $( "#btnConfirmarAtualizarNavio" ).on( "click", function() {    
               
        var nomenavio = $('#inputNomeNavioAtualizar').val();
        var empresa = $('#inputEmpresaEstruturaAtualizar').val();
        var pass = $('#inputPasswordLoginAtualizar').val();
        var ativo = $('#inputStateAtualizar').val().trim();
        var navio = $('#selNavio').val();

        if (navio != '') {
            navio = navio.split(';')
        }

        var form = document.getElementById('frmAtualizarNavio');

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
      
        if ((nomenavio == '')  || (empresa == '') || (pass == '')){
            return;
        }

        var ativo= $('#inputState').val();
        var token = $('#token').val();
        var dados = 'id=' + navio[0] + '&nomenavio =' + encodeURIComponent(nomenavio) + '&' + 'empresa=' + encodeURIComponent(empresa) + '&' + 'pass=' + pass + '&' + 'ativo=' + ativo + '&' + 'token=' + token;
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=AtualizarNavio",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data) {   
                
                if (data.ERRO == "OK") {

                    $('#inputNomeNavio').val('');
                    $('#inputEmpresaEstrutura').val('');
                    $('#inputPasswordLogin').val('');
                    $('#inputState').val('N');

                    $("#ModalCenterAtualizarNavio").modal("hide");

                    $("#selNavio").empty();
                    $("#selNavio").append('<option value="">Selecione o navio...</option>');
                    var navios = JSON.parse(data.NAVIOS);
                    $.each(navios.REGISTROS, function(index, option) {
                        if (navio[0] === option.ID)  {
                            $("#selNavio").append('<option selected value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO +  '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                            
                        }
                        else {
                            $("#selNavio").append('<option value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO +  '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                        }
                    });                                    


                    if (data.ERRO == "OK"){
                        ShowMessage('Navio <b>ATUALIZADO</b> com sucesso!',"S");
                    }
                    else {
                        ShowMessage('Ocorreu um erro ao ATUALIZAR o navio',data.ERRO);
                    }
                }

                if (ativo == 'S') {
                    $('#btnDesativarNavio').removeClass('d-none');
                    $('#btnAtivarNavio').addClass('d-none');
                }
                else{
                    $('#btnDesativarNavio').addClass('d-none');
                    $('#btnAtivarNavio').removeClass('d-none');
                }
                
                $('#btnAtualizarEmpresa').removeClass('disabled');
                $('#btnAtualizarEmpresa').removeClass('btn-light');
                $('#btnAtualizarEmpresa').addClass('btn-primary');                  

                $('#btnConsultarEmpresa').removeClass('disabled');
                $('#btnConsultarEmpresa').removeClass('btn-light');
                $('#btnConsultarEmpresa').addClass('btn-succcess');                  
                
                
                                              
            },
            error: function() {                                
            }
        })        
    } );

    $( "#btnConfirmarAtivarNavio" ).on( "click", function() {    
        var arrayNavio = $('#selNavio').val().split(";");
        var dados = 'token=' + $('#token').val() + "&navio=" +  arrayNavio[0];
        var navio = arrayNavio[0];
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=AtivaNavio",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data1) {    

                $.ajax({
                    url: serverapi + "/easbr.asp?funcao=getMonitoramentoNavio&token=" + $('#token').val(),
                    method: "GET",
                    dataType: "json",            
                    beforeSend : function(){                
                   },
                    success: function(data) {    
                        $("#selNavio").empty();
                        $("#selNavio").append('<option value="">Selecione o navio...</option>');
                        $.each(data.REGISTROS, function(index, option) {
                            if (option.ID == navio) {
                                $("#selNavio").append('<option selected value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO +  '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                            }
                            else {
                                $("#selNavio").append('<option value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + ';' + option.NOME_NAVIO +  '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                            }
                        });                                    

                        $("#ModalCenterAtivarNavio").modal("hide");
                        if (data1.ERRO == "OK"){
                            ShowMessage('Navio <b>ATIVADO</b> com sucesso!',"S");
                        }
                        else {
                            ShowMessage('Ocorreu um erro ao ativar o navio',data1.ERRO);
                        }

                        $('#btnDesativarNavio').removeClass('d-none');
                        $('#btnAtivarNavio').addClass('d-none');
                        $('#btnAtualizarEmpresa').removeClass('disabled');
                        $('#btnAtualizarEmpresa').removeClass('btn-light');
                        $('#btnAtualizarEmpresa').addClass('btn-primary');                
                        $('#btnConsultarEmpresa').removeClass('disabled');
                        $('#btnConsultarEmpresa').removeClass('btn-light');
                        $('#btnConsultarEmpresa').addClass('btn-success');
                        
                        
                        
                    },
                    error: function() {                                
                        $('#divErro').removeClass('d-none');
                    }
                })

                
                                              
            },
            error: function() {                                
            }
        })        
    } );
    
    $( "#btnConsultarEmpresa" ).on( "click", function() { 
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getMonitoramentoEstruturaPorNome&token=" + encodeURIComponent($('#token').val()) + '&empresa=' + encodeURIComponent($('#inputEstDescricao').val()),
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data) {    

                var tabela = $('#tbConsultarEmpresa').DataTable();
                tabela.clear().draw();
    
                $.each(data.REGISTROS, function (i, item) {
                    $('#tbConsultarEmpresa').DataTable().row.add([
                        item.EST_NUMERO,
                        item.EST_DESCRICAO
                    ]).draw();
                });
    

                                          
            },
            error: function() {                                
            }
        });   

    } );

    $( "#btnLogoEmpresa" ).on( "click", function() { 
        var arrayNavio = $('#selNavio').val().split(";");
        var dados = 'token=' + $('#token').val() + "&id=" +  arrayNavio[0];
        var navio = arrayNavio[0];
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=getMonitoramentoLogoPorId&" + dados,
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data) {    

                var url = $('#inputcaminhoaplicacao').val() + data.REGISTROS[0].LOGO.replace("./","");
                 
                var canvas = document.getElementById('canvasLogo');
                var context = canvas.getContext('2d');

                var image = new Image();
                image.src = url;

                image.onload = function() {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(image, 0, 0, 200, 72); // Definindo o tamanho desejado
                };
                                          
            },
            error: function() {                                
            }
        });   

    } );


    $( "#btnConfirmarDesativarNavio" ).on( "click", function() {    
        var arrayNavio = $('#selNavio').val().split(";");
        var dados = 'token=' + $('#token').val() + "&navio=" +  arrayNavio[0];
        var navio = arrayNavio[0];
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=DesativaNavio",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data1) {    

                $.ajax({
                    url: serverapi + "/easbr.asp?funcao=getMonitoramentoNavio&token=" + $('#token').val(),
                    method: "GET",
                    dataType: "json",            
                    beforeSend : function(){                
                   },
                    success: function(data) {    
                        $("#selNavio").empty();
                        $("#selNavio").append('<option value="">Selecione o navio...</option>');
                        $.each(data.REGISTROS, function(index, option) {
                            if (option.ID == navio) {
                                $("#selNavio").append('<option selected value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                            }
                            else {
                                $("#selNavio").append('<option value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                            }
                        });                                    

                        $("#ModalCenterDesativarNavio").modal("hide");
                        if (data1.ERRO == "OK"){
                            ShowMessage('Navio <b> DESATIVADO </b> com sucesso!',"S");
                        }
                        else {
                            ShowMessage('Ocorreu um erro ao desativar o navio',data1.ERRO);
                        }

                        $('#btnDesativarNavio').addClass('d-none');
                        $('#btnAtivarNavio').removeClass('d-none');
                        $('#btnAtualizarEmpresa').addClass('disabled');
                        $('#btnAtualizarEmpresa').addClass('btn-light');
                        $('#btnAtualizarEmpresa').removeClass('btn-primary');
                        $('#btnConsultarEmpresa').addClass('disabled');
                        $('#btnConsultarEmpresa').addClass('btn-light');
                        $('#btnConsultarEmpresa').removeClass('btn-success');
                        
                        
                        
                    },
                    error: function() {                                
                        $('#divErro').removeClass('d-none');
                    }
                })

                
                                              
            },
            error: function() {                                
            }
        })        
    } );

    $( "#btnConfirmarDesativarNavio" ).on( "click", function() {    
        var arrayNavio = $('#selNavio').val().split(";");
        var dados = 'token=' + $('#token').val() + "&navio=" +  arrayNavio[0];
        var navio = arrayNavio[0];
        
        $.ajax({
            url: serverapi + "/easbr.asp?funcao=DesativaNavio",
            method: "POST",
            data: dados,
            dataType: "json",            
            beforeSend : function(){                
           },
            success: function(data1) {    

                $.ajax({
                    url: serverapi + "/easbr.asp?funcao=getMonitoramentoNavio&token=" + $('#token').val(),
                    method: "GET",
                    dataType: "json",            
                    beforeSend : function(){                
                   },
                    success: function(data) {    
                        $("#selNavio").empty();
                        $("#selNavio").append('<option value="">Selecione o navio...</option>');
                        $.each(data.REGISTROS, function(index, option) {
                            if (option.ID == navio) {
                                $("#selNavio").append('<option selected value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                            }
                            else {
                                $("#selNavio").append('<option value="' + option.ID + ';' + option.EST_DESCRICAO + ';' + option.ATIVO + '" >' + replaceInterrogationWithA(option.NOME_NAVIO) +  '</option>');
                            }
                        });                                    

                        $("#ModalCenterDesativarNavio").modal("hide");
                        if (data1.ERRO == "OK"){
                            ShowMessage('Navio <b> DESATIVADO </b> com sucesso!',"S");
                        }
                        else {
                            ShowMessage('Ocorreu um erro ao desativar o navio',data1.ERRO);
                        }

                        $('#btnDesativarNavio').addClass('d-none');
                        $('#btnAtivarNavio').removeClass('d-none');
                        $('#btnAtualizarEmpresa').addClass('disabled');
                        $('#btnAtualizarEmpresa').addClass('btn-light');
                        $('#btnAtualizarEmpresa').removeClass('btn-primary');
                        $('#btnConsultarEmpresa').addClass('disabled');
                        $('#btnConsultarEmpresa').addClass('btn-light');
                        $('#btnConsultarEmpresa').removeClass('btn-success');
                        
                        
                        
                    },
                    error: function() {                                
                        $('#divErro').removeClass('d-none');
                    }
                })

                
                                              
            },
            error: function() {                                
            }
        })        
    } );
    

    $( "#btnDesativarNavio" ).on( "click", function() {        
        $('#inputNavioDesativado').val($('#selNavio').find("option:selected").text());      
    } );

    $( "#btnAtivarNavio" ).on( "click", function() {        
        $('#inputNavioAtivado').val($('#selNavio').find("option:selected").text());      
    } );
    
    $( "#btnCadastrarNavio" ).on( "click", function() {        
        $('#selNavio').val('');      
        $('#selNavio').trigger('change');        
    } );

    $( "#btnAtualizarNavio" ).on( "click", function() {        

        if ($("#selNavio").val() != ''){
            var navio = $("#selNavio").val().split(";");
            $('#inputEmpresaEstruturaAtualizar').val(navio[1]);
            $('#inputNomeNavioAtualizar').val(navio[3]);            
            $('#inputStateAtualizar').val(navio[2].trim());  
            $('#inputPasswordLoginAtualizar').val('');          
        }
        else {
            $('#inputNomeNavioAtualizar').val();
            $('#inputEmpresaEstruturaAtualizar').val('');
            $('#inputStateAtualizar').val('');         
            $('#inputPasswordLoginAtualizar').val('');
        }
             
    } );


    
    $( "#selEquipamentoGrupo" ).on( "change", function() {

        if (this.value == '') {
            $("#selEquipamento").empty();
            return;
        }

        var equipamento = this.value.split(';');
        var numero = equipamento[1];
        var url = serverapi + "/easbr.asp?funcao=getMonitoramentoDefaultAcessoEquipamento&token=" + $('#token').val() + "&grpnumero=" + numero;
        
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",            
            beforeSend : function(){                
        },
            success: function(data) {    
                $("#selEquipamento").empty();
                $("#selEquipamento").append('<option value="">Selecione o equipamento</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#selEquipamento").append('<option value="' + option.EQPI_NUMERO + ';' + replaceInterrogationWithA(option.EQPI_DESCRICAO) + '">' + option.EQPI_NUMERO + '-' + replaceInterrogationWithA(option.EQPI_DESCRICAO) +  '</option>');
                });                                    

                $('#divErroEquipamento').addClass('d-none');
                $('#inputDescricaoEquipamento').val('');
                                            
            },
            error: function() {                                
                $('#divErro').removeClass('d-none');
            }
        })
    } );


    $('#inputfileLogoEmpresa').on('change', function(event) {
        var selectedFile = event.target.files[0];


        if (selectedFile) {
            var reader = new FileReader();

            reader.onload = function(e) {
                var imageDataURL = e.target.result;

                var canvas = document.getElementById('canvasLogo');
                var context = canvas.getContext('2d');

                var image = new Image();
                image.src = imageDataURL;

                image.onload = function() {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(image, 0, 0, 200, 72); // Definindo o tamanho desejado
                };
            }

            reader.readAsDataURL(selectedFile);
        }
    });
    
    $( "#selNavio" ).on( "change", function() {

        if (this.value != "") {

            var arraynavio = this.value.split(";");
            var id_navio = arraynavio[0];
            var ativo = arraynavio[2].trim();
            var logo =  arraynavio[4];

            $('#inputEstDescricao').val(arraynavio[1]);

            $('#btnGrupoCadastrarNovo').removeClass('btn-light');
            $('#btnGrupoCadastrarNovo').addClass('btn-primary');
            $('#btnGrupoCadastrarNovo').removeClass('disabled');

            $('#btnEquipamentoCadastrarNovo').removeClass('btn-light');
            $('#btnEquipamentoCadastrarNovo').addClass('btn-primary');
            $('#btnEquipamentoCadastrarNovo').removeClass('disabled');

            $('#btnAtualizarEmpresa').removeClass('disabled');
            $('#btnAtualizarEmpresa').removeClass('btn-light');
            $('#btnAtualizarEmpresa').addClass('btn-primary');

            $('#btnConsultarEmpresa').removeClass('disabled');
            $('#btnConsultarEmpresa').removeClass('btn-light');
            $('#btnConsultarEmpresa').addClass('btn-success');

            if (ativo == 'S') {
                $('#btnDesativarNavio').removeClass('d-none');
                $('#btnAtivarNavio').addClass('d-none');
                $('#btnVisualizarNavio').removeClass('d-none');

                $('#btnVisualizarNavio').removeClass('disabled');
                $('#btnVisualizarNavio').removeClass('btn-light');
                $('#btnVisualizarNavio').addClass('btn-secondary');                

            }
            else {
                $('#btnDesativarNavio').addClass('d-none');
                $('#btnAtivarNavio').removeClass('d-none');   
                $('#btnVisualizarNavio').addClass('d-none');         
            }

            $('#btnLogoEmpresa').removeClass('disabled');
            $('#btnLogoEmpresa').removeClass('btn-light');
            $('#btnLogoEmpresa').addClass('btn-primary');            
    

            //Resgata os Grupos do Navio Selecionado
            
            $.ajax({
                url: serverapi + "/easbr.asp?funcao=getMonitoramentoGrupoNavio&token=" + $('#token').val() + '&navio=' + id_navio,
                method: "GET",
                dataType: "json",            
                beforeSend : function(){                
               },
                success: function(data) {    
                    
                    var body = '';
                    var acao = '';

                    if (logo != '') {                        
                        $('#imgLogo').attr('src',logo);
                    }
                                    
                     
                    $.each(data.REGISTROS, function (i, item) {

                        acao = '<span class="d-flex justify-content-end">' +
                        '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarGrupo" onclick="atualizarGrupo(' + item.ID + ',' + item.GRP_NUMERO + ',\'' + item.GRP_DESCRICAO_SELECT + '\',\'' + item.GRP_TEXTO_PAINEL + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip"' +
                               'data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                               '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirGrupo" onclick="excluirGrupo(' + item.ID + ',' + item.GRP_NUMERO + ')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip"'+
                               'data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>'+
                               '</span>';

                               body += '<tr>';                               
                               body += '<td>' + item.GRP_NUMERO +'</td>';          
                               body += '<td>' + item.GRP_DESCRICAO +'</td>';                     
                               body += '<td>' + item.GRP_DESCRICAO_SELECT +'</td>';                               
                               body += '<td>' + item.GRP_TEXTO_PAINEL +'</td>';

                               body += '<td>' + acao +'</td>';
                               body += '</tr>';
                    });

                    $('#btnAtualizarNavio').removeClass('disabled');
                    $('#btnAtualizarNavio').removeClass('btn-light');
                    $('#btnAtualizarNavio').addClass('btn-primary');
                    $('#tbGruposBody').html(body);
				                              
                },
                error: function() {                                
                }
            });
			
			//Resgata os Equipamentos do Navio Selecionado
            $.ajax({
                url: serverapi + "/easbr.asp?funcao=getMonitoramentoEquipamentosNavio&token=" + $('#token').val() + '&navio=' + id_navio,
                method: "GET",
                dataType: "json",            
                beforeSend : function(){                
               },
                success: function(data) {    
                    
                    var body = '';
                    var acao = '';
                    var status = '';

                    $.each(data.REGISTROS, function (i, item) {

                                if ((item.ESTADO == 1) && (item.MODO == 0)) {                      
                                        status = '<span class="badge light badge-success"> Catraca operacional</span>';
                                }
                                else {
                                        status ='<span class="badge light badge-danger"> Modo ' + utf8Decode(item.MODO_DESCRICAO) + '  <br> ' +   utf8Decode(item.ESTADO_DESCRICAO) + '</span>';
                                }    

                                acao = '<span class="d-flex justify-content-end">' +
                                '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterAtualizarEquipamento" onclick="atualizarEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="me-2 btn btn-primary shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Editar"><i class="fas fa-pencil-alt"></i> </a>' +
                                '<a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#ModalCenterExcluirEquipamento" onclick="excluirEquipamento(' + item.ID + ',' + item.EQPI_NUMERO + ',\'' + item.EQPI_DESCRICAO_APLICACAO + '\')" class="btn btn-danger shadow btn-xs sharp" data-bs-toggle="tooltip" data-placement="top" title="Excluir"><i class="fas fa-times text-white"></i></a>' +
                                '</span>';

                               body += '<tr>';
                               body += '<td>' + item.ID +'</td>';
                               body += '<td>' + item.EQPI_NUMERO +'</td>';                               
                               body += '<td>' + item.EQPI_DESCRICAO + '<br>' + status  + '</td>';
                               body += '<td>' + item.EQPI_DESCRICAO_APLICACAO +'</td>';

                               body += '<td>' + acao +'</td>';
                               body += '</tr>';
                    });

                    $('#tbEquipamentosBody').html(body);
				                              
                },
                error: function() {                                
                }
            })
        
        
        }
        else {            
            $('#btnAtualizarNavio').addClass('disabled');
            $('#btnAtualizarNavio').removeClass('btn-primary');
            $('#btnAtualizarNavio').addClass('btn-light');
            $('#btnDesativarNavio').addClass('d-none');
            $('#btnAtivarNavio').addClass('d-none');
            $('#btnAtualizarEmpresa').addClass('disabled');
            $('#btnAtualizarEmpresa').addClass('btn-light');
            $('#btnAtualizarEmpresa').removeClass('btn-primary');
            $('#btnConsultarEmpresa').addClass('disabled');
            $('#btnConsultarEmpresa').addClass('btn-light');
            $('#btnConsultarEmpresa').removeClass('btn-success');
            $('#tbGruposBody').html('');
            $('#tbEquipamentosBody').html('');
            $('#btnGrupoCadastrarNovo').removeClass('btn-primary');
            $('#btnGrupoCadastrarNovo').addClass('btn-light'); 
            $('#btnGrupoCadastrarNovo').addClass('disabled');           
            $('#btnEquipamentoCadastrarNovo').removeClass('btn-primary');
            $('#btnEquipamentoCadastrarNovo').addClass('btn-light'); 
            $('#btnEquipamentoCadastrarNovo').addClass('disabled');                        
            $('#btnLogoEmpresa').addClass('disabled');
            $('#btnLogoEmpresa').removeClass('btn-primary');
            $('#btnLogoEmpresa').addClass('btn-light');
            $('#btnVisualizarNavio').addClass('disabled');
            $('#btnVisualizarNavio').removeClass('btn-secondary');
            $('#btnVisualizarNavio').addClass('btn-light');
            $('#imgLogo').attr('src','');
        }
      
    } );
    

    
}); 