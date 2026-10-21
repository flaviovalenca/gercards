

 (function () {
  'use strict'

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
})()  


function carregaempresa(selEmpresa) {
    
    var dados = {
        funcao: 'getempresa',        
        token: $('#csrf_token').val() 
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {

            if ((data.ERRO) == "Token Expirado") {
                window.location.href = 'login.asp';
                return;
            }

            $("#" + selEmpresa).empty();

            traduzirTexto('Empresa...', $('#idioma').val()).then(function(textoTraduzido) {
                // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                $("#" + selEmpresa).append('<option value="">' + textoTraduzido + '</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#" + selEmpresa).append('<option value="' + option.ID + '"><span>' + decodeURIComponent(option.NOME_EMPRESA) + '<span></option>');
                });
            });



            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });
    
}

function abrirModalNovo() {
    // Reseta o formulário
    document.getElementById("frmCadastrarNavio").reset();
    
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalNovo'));
    modal.show();
}


function abrirModalEditar(id,idempresa,idnavio,nome,contrato) {

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmAlterarNavio").reset();
    $('#hddidempresanavio').val(id);
    $('#hddidempresa').val(idempresa);
    $('#hddidnavio').val(idnavio);
    $('#inputNomeNavioAlterar').val(nome);
    $('#inputNumeroContratoAlterar').val(contrato);
    
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalAlterar'));
    modal.show();
}


function abrirModalExcluir(id,idempresa,idnavio,nome) {

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmExcluirNavio").reset();
    $('#hddidempresanavio').val(id);
    $('#hddidempresa').val(idempresa);
    $('#hddidnavio').val(idnavio);
    $('#inputNomeNavioExcluir').val(nome);
        
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalExcluir'));
    modal.show();
}


function atualizaTabelaNavio(){
    
    
			// Construir os dados a serem enviados no corpo da requisição
			var dados = {
				funcao: 'getnavio',
				token: $('#csrf_token').val() 
			};

			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: dados, // Enviar os dados no corpo da requisição
				success: function(data) {

                    if ((data.ERRO) == "Token Expirado") {
                        window.location.href = 'login.asp';
                        return;
                    }
                    
					// Limpar a tabela antes de adicionar os novos dados
					var tabela = $('#tbCards').DataTable();
					tabela.clear().draw();

					// Iterar sobre os registros recebidos
                    $.each(data.REGISTROS, function(i, item) {
                        var acoes = '<div class="d-flex">' +
                        '<a href="#" onclick="abrirModalEditar(\'' + item.ID  + '\',\'' + item.ID_EMPRESA + '\',\'' + item.ID_NAVIO + '\', \'' + decodeURIComponent(item.NOME_NAVIO) + '\', \'' + item.NUMERO_CONTRATO + '\')" title="Editar Navio" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\',\'' + item.ID_EMPRESA + '\',\'' + item.ID_NAVIO + '\', \'' + decodeURIComponent(item.NOME_NAVIO) + '\', \'' + item.NUMERO_CONTRATO + '\')" title="Excluir Navio" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                        '</div>';

                        // Adicionar uma nova linha à tabela com os dados do item atual
                        tabela.row.add([							
                            item.ID,
                            decodeURIComponent(item.NOME_EMPRESA),
                            decodeURIComponent(item.NOME_NAVIO),
                            item.NUMERO_CONTRATO,
                            acoes
                        ]).draw();
                    });

        
                    $('#h3totalnavio').html(data.REGISTROS.length );
                    										
				},
				error: function(xhr, status, error) {
					// Exibir um alerta de erro e desbloquear a página em caso de falha na requisição
					exibiralertadiv('error', 'Tente novamente!','divMsg');
					$('.content-body').unblock();
				}
			});
}

function validouNavio(formulario){

    var form = document.getElementById(formulario);
    var valido = form.checkValidity();
    
    var camposInvalidos = [];
    
    $('#' + formulario).find(':input, select').each(function() {
        if (!this.validity.valid || ($(this).is('select') && this.selectedIndex <= 0)) {
            camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
        }
    });
    

    console.log(camposInvalidos); 
        
    // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
    if (form && valido && (camposInvalidos.length === 0))  {
        return true;
    }
    else {
        // Se o formulário não for válido, exibe as mensagens de erro
        var divmsg = "";
        if (formulario == "frmCadastrarNavio") {
            divmsg = 'divMsgCadastrar';
        }
        else if (formulario == "frmAlterarNavio") {
            divmsg = 'divMsgAlterar';
        }
        else if (formulario == "frmExcluirNavio") {
            divmsg = 'divMsgExcluir';
        }

        exibiralertadiv('danger','Preencha todos os campos obrigatórios.',divmsg);

        var naoselecionouempresa = camposInvalidos.find(function(objeto) {
            return objeto.id === 'selEmpresaCadastrar'; // Remova as aspas extras
        });
        

        if (naoselecionouempresa) {

            traduzirTexto('Selecione a Empresa.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#selEmpresaCadastrar').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                $('#selEmpresaCadastrar').addClass('is-invalid');    
            });

        } 

        if ($('#inputNomeNavioCadastrar').val() == ""){

            traduzirTexto('Informe o Nome do Navio.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputNomeNavioCadastrar').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                $('#inputNomeNavioCadastrar').addClass('is-invalid');    
            });
            
        }

        if ($('#inputNumeroContratoCadastrar').val() == ""){

            traduzirTexto('Informe o Número do Contrato.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputNumeroContratoCadastrar').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
                $('#inputNumeroContratoCadastrar').addClass('is-invalid');
            });

        }


        if (form) {
            form.classList.add('was-validated');
        }
        
        return false;
    }
            

}



function baixardocumento(envelopeId) {  
    window.location.href = urlbaixarenvelope + envelopeId;
}

var dates = $.fn.datepicker.dates = {
pt: {
    days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
    daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    daysMin: ["Do", "Sg", "Te", "Qa", "Qi", "Sx", "Sa", "Do"],
    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    today: "Hoje",
    clear: "Limpar"
}

};

function carreganavio(idSelect) {
    // Carreganavio
    var dados = {
        funcao: 'getnavio',        
        token: $('#csrf_token').val() 
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {

            if ((data.ERRO) == "Token Expirado") {
                window.location.href = 'login.asp';
                return;
            }

            $("#" + idSelect).empty();
            
            traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                $("#" + idSelect).append('<option value="">' + textoTraduzido + '</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#" + idSelect).append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
                });
            });



            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });
    
}


//	setInterval(atualizarTempo, 1000);
$(document).ready(function () {		

    block();

    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'getnavio',
        token: $('#csrf_token').val() 
    };

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {
            // Limpar a tabela antes de adicionar os novos dados
            var tabela = $('#tbCards').DataTable();
            tabela.clear().draw();

            // Iterar sobre os registros recebidos
            $.each(data.REGISTROS, function(i, item) {
                var acoes = '<div class="d-flex">' +
                '<a href="#" onclick="abrirModalEditar(\'' + item.ID  + '\',\'' + item.ID_EMPRESA + '\',\'' + item.ID_NAVIO + '\', \'' + decodeURIComponent(item.NOME_NAVIO) + '\', \'' + item.NUMERO_CONTRATO + '\')" title="Editar Navio" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\',\'' + item.ID_EMPRESA + '\',\'' + item.ID_NAVIO + '\', \'' + decodeURIComponent(item.NOME_NAVIO) + '\', \'' + item.NUMERO_CONTRATO + '\')" title="Excluir Navio" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                '</div>';

                // Adicionar uma nova linha à tabela com os dados do item atual
                tabela.row.add([							
                    item.ID,
                    decodeURIComponent(item.NOME_EMPRESA),
                    decodeURIComponent(item.NOME_NAVIO),
                    item.NUMERO_CONTRATO,
                    acoes
                ]).draw();
            });

            $('#h3totalnavio').html(data.REGISTROS.length);

            // Desbloquear a página após o sucesso da requisição
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            // Exibir um alerta de erro e desbloquear a página em caso de falha na requisição
            exibiralerta('error', 'Tente novamente!');
            $('.content-body').unblock();
        }
    });

    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',            
        language: "pt-br",
        autoclose: true            
    });

    carregaempresa('selEmpresa');
    carregaempresa('selEmpresaCadastrar');
    
    $('#selEmpresaCadastrar').on('change', function() {
        if ($(this).val() != "") {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('');            
        }
    });
    
    $('#lnkRemoverFiltroNavio').on('click', function() {
        $('#selEmpresa option').eq(0).prop('selected', true);                    
        $("#selNavio").empty();

        traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
            // Se a tradução não for encontrada, `textoTraduzido` será o texto original
            $("#selNavio").append('<option value="">' + textoTraduzido + '</option>');            
        });

        $('#selNavio option').eq(0).prop('selected', true);            
        var tabela = $('#tbCards').DataTable();	        
        tabela.clear().draw();        
        $('#h3totalnavio').html('');
    });


    $('#btnExcluirNavio').on('click', function() {

        var palavra = $('#inputTextoPalavraExcluir').val();                
        var form = document.getElementById('frmExcluirNavio');

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
        

        var dados = {
            funcao: 'delnavio',
            id: $('#hddidempresanavio').val(),
            idnavio: $('#hddidnavio').val(),
            token: $('#csrf_token').val() 
        };

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição
            success: function(data) {            

                if ((data.ERRO) == "Token Expirado") {
                    window.location.href = 'login.asp';
                    return;
                }

                $('html, body').animate({ scrollTop: 0 }, 'slow');

                if (data.ERRO == "OK") {                    
                    $('#divModalExcluir').modal('hide');
                    carreganavio();
                    atualizaTabelaNavio();     
                    exibiralertadiv('success','Navio excluído com sucesso!','divMsg');                                                
                }
                else {
                    exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgExcluir');
                }    

            },
            error: function(xhr, status, error) {
                exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgExcluir');

                setTimeout(function() {
                    var botaoFechar = document.querySelector('.alert-danger button[data-bs-dismiss="alert"]');
                    if(botaoFechar) {            
                        botaoFechar.click();
                    }       
                    }, 3000)
                
                
            }
        });
    });
    
    $('#selEmpresa').on('change', function() {
		
        block();
    
        var valor = $(this).val();
        if (valor) {
    
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getnavio',
                empresa: valor,
                token: $('#csrf_token').val() 
            };
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {

                    if ((data.ERRO) == "Token Expirado") {
                        window.location.href = 'login.asp';
                        return;
                    }

                    $("#selNavio").empty();


                    traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                        // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                        $("#selNavio").append('<option value="">' + textoTraduzido + '</option>');
                        $.each(data.REGISTROS, function(index, option) {
                            $("#selNavio").append('<option value="' + option.ID_NAVIO + '">' + option.NOME_NAVIO + '</option>');
                        });
                    });
                    
                    $('.content-body').unblock();
                },
                error: function(xhr, status, error) {
                    $('.content-body').unblock();
                }
            });
            
    
        } 
        else {
            $('.content-body').unblock();
            $("#selNavio").empty();
            $("#selNavio").append('<option value="">Navio...</option>');
        }
    });

    $('#lnkFiltrar').on('click', function() {

        
        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'getnavio',
            empresa: $('#selEmpresa').val(),            
            navio: $('#selNavio').val(),            
            token: $('#csrf_token').val() 
        };

        $(this).prop("disabled", true);
        $(this).html('<image src="images/gif/loading.gif">&nbsp;Aguarde...');  
        
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição
            success: function(data) {            

                    if ((data.ERRO) == "Token Expirado") {
                        window.location.href = 'login.asp';
                        return;
                    }
                
                
    					// Limpar a tabela antes de adicionar os novos dados
					var tabela = $('#tbCards').DataTable();
					tabela.clear().draw();

					// Iterar sobre os registros recebidos
					$.each(data.REGISTROS, function(i, item) {
						var acoes = '<div class="d-flex">' +
                        '<a href="#" onclick="abrirModalEditar(\'' + item.ID  + '\',\'' + item.ID_EMPRESA + '\',\'' + item.ID_NAVIO + '\', \'' + decodeURIComponent(item.NOME_NAVIO) + '\', \'' + item.NUMERO_CONTRATO + '\')" title="Editar Navio" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\',\'' + item.ID_EMPRESA + '\',\'' + item.ID_NAVIO + '\', \'' + decodeURIComponent(item.NOME_NAVIO) + '\', \'' + item.NUMERO_CONTRATO + '\')" title="Excluir Navio" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                        '</div>';
						// Adicionar uma nova linha à tabela com os dados do item atual
						tabela.row.add([
							item.ID,
                            decodeURIComponent(item.NOME_EMPRESA),
							decodeURIComponent(item.NOME_NAVIO),
                            item.NUMERO_CONTRATO,
							acoes
						]).draw();
					});

					
                    $('#h3totalnavio').html(data.REGISTROS.length);

                    $('#lnkFiltrar').prop("disabled", false);

                    traduzirTexto('Filtrar', $('#idioma').val()).then(function(textoTraduzido) {
                        // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                        $('#lnkFiltrar').html(textoTraduzido + '<i class="fa fa-search me-1"></i>');                        
                    });
    

            },
            error: function(xhr, status, error) {
                $('#lnkFiltrar').prop("disabled", false);
                $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');
                $('.content-body').unblock();
            }
        });
    
        
    });


    $('#btnSalvarNavio').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouNavio('frmCadastrarNavio'))  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'insnavio',
                idempresa:$('#selEmpresaCadastrar').val(),
                nomenavio: $('#inputNomeNavioCadastrar').val(),
                numerocontrato: $('#inputNumeroContratoCadastrar').val(),
                token: $('#csrf_token').val() 
            };
            
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {            

                    if ((data.ERRO) == "Token Expirado") {
                        window.location.href = 'login.asp';
                        return;
                    }

                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    if (data.ERRO == "OK") {                    
                        $('#divModalNovo').modal('hide');
                        carreganavio();
                        atualizaTabelaNavio();     
                        exibiralertadiv('success','Navio cadastrado com sucesso!','divMsg');                                                
                    }
                    else {
                        exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgCadastrar');
                    }    
                                        
                },
                error: function(xhr, status, error) {
                    exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgCadastrar');
                    
                }
            });
           
    
        } 
     
    });

    $('#btnAtualizarNavio').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouNavio('frmAlterarNavio'))  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'updnavio', 
                idempresa:$('#hddidempresa').val(),                
                idnavio: $('#hddidnavio').val(),
                nomenavio: $('#inputNomeNavioAlterar').val(),
                numerocontrato:$('#inputNumeroContratoAlterar').val(),
                token: $('#csrf_token').val() 
            };
    
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: dados, // Enviar os dados no corpo da requisição
                success: function(data) {            

                    if ((data.ERRO) == "Token Expirado") {
                        window.location.href = 'login.asp';
                        return;
                    }

                    $('html, body').animate({ scrollTop: 0 }, 'slow');


                    if (data.ERRO == "OK") {                    
                        $('#divModalAlterar').modal('hide');
                        carreganavio(); 
                        atualizaTabelaNavio();     
                        exibiralertadiv('success','Navio atualizado com sucesso!','divMsg');                                                                                        
                    }
                    else {
                        exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgAlterar');
                    }    
                                        
                },
                error: function(xhr, status, error) {
                    exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgAlterar');
                    
                }
            });
           
    
        } 
     
    });



});