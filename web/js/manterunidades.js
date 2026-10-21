

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


function abrirModalNovo() {
    // Reseta o formulário
    document.getElementById("frmCadastrarUnidade").reset();
    
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalNovo'));
    modal.show();
}


function abrirModalEditar(id,nome,sigla) {

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmAlterarUnidade").reset();
    $('#hddidunidade').val(id);
    $('#inputNomeUnidadeAlterar').val(nome);
    $('#inputSiglaUnidadeAlterar').val(sigla);
    
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalAlterar'));
    modal.show();
}


function abrirModalExcluir(id,unidade,sigla) {

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmExcluirUnidade").reset();
    $('#hddidunidade').val(id);
    $('#inputNomeUnidadeExcluir').val(unidade);
    $('#inputSiglaUnidadeExcluir').val(sigla);
        
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalExcluir'));
    modal.show();
}


function atualizaTabelaUnidade(){
    
    
			// Construir os dados a serem enviados no corpo da requisição
			var dados = {
				funcao: 'getunidade',
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
                        '<a href="#" onclick="abrirModalEditar(\''  + item.ID + '\', \'' + decodeURIComponent(item.DESCRICAO) + '\',' + '\'' + decodeURIComponent(item.SIGLA) + '\')" title="Editar Unidade" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\', \'' + decodeURIComponent(item.DESCRICAO) + '\',' + '\'' + decodeURIComponent(item.SIGLA) + '\')" title="Excluir Unidade" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                        '</div>';

						// Adicionar uma nova linha à tabela com os dados do item atual
						tabela.row.add([
							item.ID,
							decodeURIComponent(item.DESCRICAO),
                            decodeURIComponent(item.SIGLA),
							acoes
						]).draw();
					});

                    $('#h3totalunidade').html(data.REGISTROS.length );
                    					
				},
				error: function(xhr, status, error) {
					// Exibir um alerta de erro e desbloquear a página em caso de falha na requisição
					exibiralertadiv('error', 'Tente novamente!','divMsg');
					
				}
			});
}

function validouUnidade(formulario){

    var form = document.getElementById(formulario);
    var valido = form.checkValidity();
    
    var camposInvalidos = [];
    $('#' + formulario).find(':input').each(function() {
        if (!this.validity.valid) {
            camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
        }
    });

    console.log(camposInvalidos); 
        
    // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
    if (form && valido)  {
        return true;
    }
    else {

        // Se o formulário não for válido, exibe as mensagens de erro
        var divmsg = "";
        if (formulario == "frmCadastrarUnidade") {
            divmsg = 'divMsgCadastrar';
        }
        else if (formulario == "frmAlterarUnidade") {
            divmsg = 'divMsgAlterar';
        }
        else if (formulario == "frmExcluirUnidade") {
            divmsg = 'divMsgExcluir';
        }
        // Se o formulário não for válido, exibe as mensagens de erro
        exibiralertadiv('danger','Preencha todos os campos obrigatórios.',divmsg);
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

function carregaunidade() {
    
    var dados = {
        funcao: 'getunidade',        
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

            traduzirTexto('Unidade...', $('#idioma').val()).then(function(textoTraduzido) {
                $("#selUnidade").empty();
                // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                $("#selUnidade").append('<option value="">' + textoTraduzido + '</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#selUnidade").append('<option value="' + option.ID + '">' + decodeURIComponent(option.DESCRICAO) + '</option>');
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

    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',            
        language: "pt-br",
        autoclose: true            
    });

    $('#lnkRemoverFiltroUnidade').on('click', function() {
        $('#selUnidade option').eq(0).prop('selected', true);            
        var tabela = $('#tbCards').DataTable();	        
        tabela.clear().draw();        
        $('#h3totalunidade').html('');
    });

     carregaunidade();

    $('#btnExcluirUnidade').on('click', function() {

        var palavra = $('#inputTextoPalavraExcluir').val();                
        var form = document.getElementById('frmExcluirUnidade');

        if ((palavra == '') || (palavra != 'EXCLUIR')){
            var errorMessage = "Palavra informada errada";

            traduzirTexto(errorMessage, $('#idioma').val()).then(function(textoTraduzido) {                
                $('#msgExcluir').text(textoTraduzido).show();
                $('#inputTextoPalavraExcluir').addClass('is-invalid');                
                exibiralertadiv('danger','Preencha todos os campos obrigatórios.','divMsgExcluir');
                return;
            });

                
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
      

        var dados = {
            funcao: 'delunidade',
            id: $('#hddidunidade').val(),
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
                    carregaunidade(); 
                    atualizaTabelaUnidade();     
                    exibiralertadiv('success','Unidade excluída com sucesso!','divMsg');                                                
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
                funcao: 'getunidadeporempresaid',
                id: valor,
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

                    traduzirTexto('Unidade...', $('#idioma').val()).then(function(textoTraduzido) {
                        // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                        $("#selUnidade").empty();
                        $("selUnidade").append('<option value="">' + textoTraduzido + '</option>');
                        $.each(data.REGISTROS, function(index, option) {
                            $("#selUnidade").append('<option value="' + option.ID + '">' + decodeURIComponent(option.DESCRICAO) + '</option>');
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
            traduzirTexto('Unidade...', $('#idioma').val()).then(function(textoTraduzido) {
                $("#selUnidade").empty();
                // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                $("selUnidade").append('<option value="">' + textoTraduzido + '</option>');

            });

        }
    });

    $('#lnkFiltrar').on('click', function() {

        
        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'getunidadeporid',
            id: $('#selUnidade').val(),            
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
                        '<a href="#" onclick="abrirModalEditar(\''  + item.ID + '\', \'' + decodeURIComponent(item.DESCRICAO) + '\',' + '\'' + decodeURIComponent(item.SIGLA) + '\')" title="Editar Unidade" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\', \'' + decodeURIComponent(item.DESCRICAO) + '\',' + '\'' + decodeURIComponent(item.SIGLA) + '\')" title="Excluir Unidade" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                        '</div>';

						// Adicionar uma nova linha à tabela com os dados do item atual
						tabela.row.add([
							item.ID,
							decodeURIComponent(item.DESCRICAO),
                            decodeURIComponent(item.SIGLA),
							acoes
						]).draw();
					});

					
                    $('#h3totalunidade').html(data.REGISTROS.length);

                    $('#lnkFiltrar').prop("disabled", false);
                    $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');
    

            },
            error: function(xhr, status, error) {
                $('#lnkFiltrar').prop("disabled", false);
                $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');
                $('.content-body').unblock();
            }
        });
    
        
    });


    $('#btnSalvarUnidade').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouUnidade('frmCadastrarUnidade'))  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'insunidade',                
                nomeunidade: $('#inputNomeUnidadeCadastrar').val(),
                siglaunidade: $('#inputSiglaUnidadeCadastrar').val(),
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
                        carregaunidade(); 
                        atualizaTabelaUnidade();     
                        exibiralertadiv('success','Unidade cadastrada com sucesso!','divMsg');                                                
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

    $('#btnAtualizarUnidade').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouUnidade('frmAlterarUnidade'))  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'updunidade',                
                id: $('#hddidunidade').val(),
                nomeunidade: $('#inputNomeUnidadeAlterar').val(),
                siglaunidade: $('#inputSiglaUnidadeAlterar').val(),
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
                        carregaunidade(); 
                        atualizaTabelaUnidade();     
                        exibiralertadiv('success','Unidade atualizada com sucesso!','divMsg');                                                                                        
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