

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
    document.getElementById("frmCadastrarEmpresa").reset();
    
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalNovo'));
    modal.show();
}


function abrirModalEditar(id,nome) {

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmAlterarEmpresa").reset();
    $('#hddidempresa').val(id);
    $('#inputNomeEmpresaAlterar').val(nome);
    
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalAlterar'));
    modal.show();
}


function abrirModalExcluir(id,nome) {

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmExcluirEmpresa").reset();
    $('#hddidempresa').val(id);
    $('#inputNomeEmpresaExcluir').val(nome);
        
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalExcluir'));
    modal.show();
}


function atualizaTabelaEmpresa(){
    
    
			// Construir os dados a serem enviados no corpo da requisição
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

                    // Limpar a tabela antes de adicionar os novos dados
					var tabela = $('#tbCards').DataTable();
					tabela.clear().draw();

					// Iterar sobre os registros recebidos
					$.each(data.REGISTROS, function(i, item) {
                        var acoes = '<div class="d-flex">' +
                        '<a href="#" onclick="abrirModalEditar(\'' + item.ID + '\', \'' + decodeURIComponent(item.NOME_EMPRESA) + '\')" title="Editar Empresa" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\', \'' + decodeURIComponent(item.NOME_EMPRESA) + '\')" title="Excluir Empresa" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                        '</div>';

						// Adicionar uma nova linha à tabela com os dados do item atual
						tabela.row.add([
							item.ID,
							decodeURIComponent(item.NOME_EMPRESA),
							acoes
						]).draw();
					});

                    $('#h3totalempresas').html(data.REGISTROS.length);
                    
					// Desbloquear a página após o sucesso da requisição
					$('.content-body').unblock();
				},
				error: function(xhr, status, error) {
					// Exibir um alerta de erro e desbloquear a página em caso de falha na requisição
					exibiralertadiv('error', 'Tente novamente!','divMsg');
					$('.content-body').unblock();
				}
			});
}

function validouEmpresa(formulario){

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

        var divmsg = "";
        if (formulario == "frmCadastrarEmpresa") {
            divmsg = 'divMsgCadastrar';
        }
        else if (formulario == "frmAlterarEmpresa") {
            divmsg = 'divMsgAlterar';
        }
        else if (formulario == "frmExcluirEmpresa") {
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

function carregaempresa() {
    
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

            $("#selEmpresa").empty();
            //$("#selEmpresa").append('<option value="">' + traduzirTexto('Empresa...','en') + '</option>');
            traduzirTexto('Empresa...', $('#idioma').val()).then(function(textoTraduzido) {
                // Se a tradução não for encontrada, `textoTraduzido` será o texto original
                $("#selEmpresa").append('<option value="">' + textoTraduzido + '</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#selEmpresa").append('<option value="' + option.ID + '"><span>' + decodeURIComponent(option.NOME_EMPRESA) + '<span></option>');
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

    carregaempresa();

    $('#lnkRemoverFiltroEmpresa').on('click', function() {
        $('#selEmpresa option').eq(0).prop('selected', true);            
        var tabela = $('#tbCards').DataTable();	        
        tabela.clear().draw();        
        $('#h3totalempresas').html('');
    });

    

    $('#btnExcluirEmpresa').on('click', function() {

        var palavra = $('#inputTextoPalavraExcluir').val();                
        var form = document.getElementById('frmExcluirEmpresa');

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
            funcao: 'delempresa',
            id: $('#hddidempresa').val(),
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

                $('#divModalExcluir').modal('hide');
                $('html, body').animate({ scrollTop: 0 }, 'slow');

                if (data.ERRO == "OK") {                    
                    carregaempresa();
                    atualizaTabelaEmpresa();     
                    exibiralertadiv('success','Empresa excluída com sucesso!','divMsg');                                                
                }
                else {
                    exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsg');
                }    


            },
            error: function(xhr, status, error) {
                exibiralertadiv('danger','Tente novamente! - ' + error,'divMsg');
            }
        });
    });
   


    $('#lnkFiltrar').on('click', function() {
        

        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'getempresaporid',
            id: $('#selEmpresa').val(),            
            token: $('#csrf_token').val() 
        };

        $('#lnkFiltrar').prop("disabled", true);
        $('#lnkFiltrar').html('<image src="images/gif/loading.gif">&nbsp;Aguarde...');  
        
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
						    '<a href="#" onclick="abrirModalEditar(\'' + item.ID + '\', \'' + decodeURIComponent(item.NOME_EMPRESA) + '\')" title="Editar Empresa" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
    						'<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\', \'' + decodeURIComponent(item.NOME_EMPRESA) + '\')" title="Excluir Empresa" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
    						'</div>';

						// Adicionar uma nova linha à tabela com os dados do item atual
						tabela.row.add([
							item.ID,
							decodeURIComponent(item.NOME_EMPRESA),
							acoes
						]).draw();
					});

                    $('#h3totalempresas').html(data.REGISTROS.length);

                    $('#lnkFiltrar').prop("disabled", false);
                    $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');  

            },
            error: function(xhr, status, error) {
                $('#lnkFiltrar').prop("disabled", false);
                $('#lnkFiltrar').html('Filtrar <i class="fa fa-search me-1"></i>');
                exibiralertadiv('danger','Tente novamente!','divMsg');

            }
        });
    
        
    });


    $('#btnSalvarEmpresa').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouEmpresa('frmCadastrarEmpresa'))  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'insempresa',
                nomeempresa:$('#inputNomeEmpresaCadastrar').val(),
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

                    $('#divModalNovo').modal('hide');
                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    if (data.ERRO == "OK") {                    
                        carregaempresa();
                        atualizaTabelaEmpresa();     
                        exibiralertadiv('success','Empresa cadastrada com sucesso!','divMsg');                                                
                    }
                    else {
                        exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsg');
                    }    
                                        
                },
                error: function(xhr, status, error) {
                    $('#divModalNovo').modal('hide');
                    exibiralertadiv('danger','Tente novamente! - ' + error,'divMsg');
                }
            });
           
    
        } 
     
    });

    $('#btnAtualizarEmpresa').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouEmpresa('frmAlterarEmpresa'))  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'updempresa',
                id: $('#hddidempresa').val(),
                nomeempresa: $('#inputNomeEmpresaAlterar').val(),
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

                    $('#divModalAlterar').modal('hide');
                    $('html, body').animate({ scrollTop: 0 }, 'slow');


                    if (data.ERRO == "OK") {                    
                        carregaempresa();   
                        atualizaTabelaEmpresa();     
                        exibiralertadiv('success','Empresa atualizada com sucesso!','divMsg');                                                                                        
                    }
                    else {
                        exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsg');
                    }    

                                        
                },
                error: function(xhr, status, error) {
                    exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgAlterarEmpresa');
                    $('#divModalAlterar').modal('hide');
                    
                }
            });
           
    
        } 
     
    });



});