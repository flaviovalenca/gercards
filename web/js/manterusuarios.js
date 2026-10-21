

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


function removerempnav(id){
    
    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'delempnaviousuariotmpporid',
        id: id,
        token: $('#csrf_token').val() 
    };

    blockid('tbitemempnav');
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {   

            $('#tbitemempnav').unblock();
            
            if ((data.ERRO) == "Token Expirado") {
                window.location.href = 'login.asp';
                return;
            }

            $('#divmsgempnav').hide();

            if (data.ERRO == "OK") { 
                    $('#tbitemempnav').html(data.TABELA);                   
            }
            else {
                exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgCadastrar');
            }    
                                
        },
        error: function(xhr, status, error) {
            $('#tbitemempnav').unblock();
            exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgCadastrar');                
        }
    });

      
}

function removerempnavalterar(id){
    
    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'delempnaviousuariotmpalterarporid',
        id: id,
        token: $('#csrf_token').val() 
    };

    blockid('tbitemempnavalterar');
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: dados, // Enviar os dados no corpo da requisição
        success: function(data) {   

            $('#tbitemempnavalterar').unblock();
            
            if ((data.ERRO) == "Token Expirado") {
                window.location.href = 'login.asp';
                return;
            }

            $('#divmsgempnavalterar').hide();

            if (data.ERRO == "OK") { 
                    $('#tbitemempnavalterar').html(data.TABELA);                   
            }
            else {
                exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgAlterar');
            }    
                                
        },
        error: function(xhr, status, error) {
            $('#tbitemempnavalterar').unblock();
            exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgAlterar');                
        }
    });

}


function abrirModalNovo() {
    // Reseta o formulário
    document.getElementById("frmCadastrarUsuario").reset();
    

     // Construir os dados a serem enviados no corpo da requisição
     var dados = {
        funcao: 'delempnaviousuariotmp',                          
        token: $('#csrf_token').val() 
    };

    $('#btnModalNovo').prop("disabled", true);
    $('#btnModalNovo').html('<image src="images/gif/loading.gif">&nbsp;Aguarde...');  
        
    
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

            traduzirTexto('Novo', $('#idioma').val()).then(function(textoTraduzido) {
                $('#btnModalNovo').prop("disabled", false);
                $('#btnModalNovo').html(textoTraduzido);

                if (data.ERRO == "OK") { 
                    $('#tbitemempnav').html('');
                    // Encontra o modal pelo ID e ativa-o
                    var modal = new bootstrap.Modal(document.getElementById('divModalNovo'));
                    modal.show();
                }
                else {
                    exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsg');
                }    
            
            });


                                
        },
        error: function(xhr, status, error) {
            exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgCadastrar');                
        }
    });



}

function abrirModalEditar(obj) {
    
    var usuario = JSON.parse(decodeURIComponent(obj));
    document.getElementById("frmAlterarUsuario").reset();

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }             
    
    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'getempnaviosporidusuario',
        id: usuario.ID,
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

            // Reseta o formulário                
            $('#hddidusuario').val(usuario.ID);
            $('#inputIdAlterar').val(usuario.ID);            
            $('#selAtivoAlterar').val(usuario.ATIVO);
            $('#selTipoAlterar').val(usuario.TIPO);
            $('#inputMatriculaAlterar').val(usuario.MATRICULA);
            $('#inputEmailAlterar').val(usuario.EMAIL);
            $('#inputNomeAlterar').val(decodeURIComponent(usuario.NOME));

            $('#tbitemempnavalterar').html(data.TABELA);                   
            $('#divtbempnavalterar').css('border','1px solid #D5DFE7');                        
            $('#divmsgempnavalterar').hide();

            var form = document.getElementById('frmAlterarUsuario');
            var valido = form.checkValidity();

            $('#selEmpresaAlterar').removeClass('is-invalid');            
            $('#selEmpresaAlterar').removeClass('required');
            $('#selNavioAlterar').removeClass('is-invalid');            
            $('#selNavioAlterar').removeClass('required');

            // Encontra o modal pelo ID e ativa-o
            var modal = new bootstrap.Modal(document.getElementById('divModalAlterar'));
            modal.show();

        },
        error: function(xhr, status, error) {
        }
    });
    


    
}


function abrirModalExcluir(obj) {

    var obj = JSON.parse(decodeURIComponent(obj));

    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmExcluirUsuario").reset();
    $('#hddidusuario').val(obj.ID);
    $('#inputNomeExcluir').val(obj.NOME);
        
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalExcluir'));
    modal.show();
}


function atualizaTabelaUsuario(){
    
			// Construir os dados a serem enviados no corpo da requisição
			var dados = {
				funcao: 'getusuario',
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

                    var obj = "";
                    var encodedObj = "";
                    var acoes = "";
                    var status = ""; 

					// Iterar sobre os registros recebidos
                    $.each(data.REGISTROS, function(i, item) {

                        obj = JSON.stringify(item);
                        encodedObj = encodeURIComponent(obj);
                        acoes = '<div class="d-flex">' +
                            '<a href="#" onclick="abrirModalEditar(\'' + encodedObj + '\')" title="Editar Usuário" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                            '<a href="#" onclick="abrirModalExcluir(\'' + encodedObj + '\')" title="Excluir Usuário" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                            '</div>';

                            if (item.ATIVO === "S"){
                                status = '<span class="badge light badge-success">Ativo</span>';
                            }    
                            else {
                                status = '<span class="badge light badge-danger">Não Ativado</span>';
                            }
            

						// Adicionar uma nova linha à tabela com os dados do item atual
						tabela.row.add([
							item.INDICE,
							item.MATRICULA,
							decodeURIComponent(item.NOME),
                            item.PERFIL,
							item.EMAIL,
                            status,
							acoes
						]).draw();
					});

                    $('#h3totalusuarios').html(data.REGISTROS.length);
                    
					
				},
				error: function(xhr, status, error) {
					// Exibir um alerta de erro e desbloquear a página em caso de falha na requisição
					exibiralertadiv('error', 'Tente novamente!','divMsg');					
				}
			});
}

function validouUsuarioCadastrar() {

    var form = document.getElementById('frmCadastrarUsuario');
    var valido = form.checkValidity();

    var camposInvalidos = [];
    $('#frmCadastrarUsuario').find(':input').each(function() {
        if (!this.validity.valid) {
            camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
        }
    });

    var validounome = false;
    if ($('#inputNomeCadastrar').val() === null || $('#inputNomeCadastrar').val() === "") {        
        traduzirTexto('Informe o nome.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputNomeCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputNomeCadastrar').addClass('is-invalid');            
        });

    }
    else {
        validounome = true;
        $('#inputNomeCadastrar').removeClass('is-invalid');            
    }

    var validouempresa = false;
    if ($('#selEmpresaCadastrar').val() === null || $('#selEmpresaCadastrar').val() === "") {    
        traduzirTexto('Informe a empresa.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#selEmpresaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#selEmpresaCadastrar').addClass('is-invalid');            
            $('#selEmpresaCadastrar').addClass('required');
    
        });

    }
    else {
        validouempresa = true;
        $('#selEmpresaCadastrar').removeClass('is-invalid');            
        $('#selEmpresaCadastrar').removeClass('required');
    }

    var validounavio = false;
    if ($('#selNavioCadastrar').val() === null || $('#selNavioCadastrar').val() === "") {
        traduzirTexto('Informe o navio.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#selNavioCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#selNavioCadastrar').addClass('is-invalid');            
        });

        
    }
    else {
        validounavio = true;
        $('#selNavioCadastrar').removeClass('is-invalid');            
    }
    
    var validoumatricula = false;
    var Matricula = formataSoNumeros($('#inputMatriculaCadastrar').val());    
    if (Matricula === ""){
        traduzirTexto('Informe a Matricula.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputMatriculaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputMatriculaCadastrar').addClass('is-invalid');            
        });

    }
    else {
        validoumatricula = true;
        $('#inputMatriculaCadastrar').removeClass('is-invalid');            
    }

    var validouemail = false;
    if ($('#inputEmailCadastrar').val() === null || $('#inputEmailCadastrar').val() === "") {
        
        traduzirTexto('Informe o email.', $('#idioma').val()).then(function(textoTraduzido) {
//            $('#inputEmailCadastrar').closest('.row').find('.invalid-feedback').text(textoTraduzido).show();
            //$('#inputEmailCadastrar').addClass('is-invalid');
        });

        
    }
    else if (!validaEmail($('#inputEmailCadastrar').val())) {

        traduzirTexto('Email inválido.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputEmailCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputEmailCadastrar').addClass('is-invalid');            
            });


    }
    else {
        validouemail = true;
        $('#inputEmailCadastrar').removeClass('is-invalid');            
    }
    
    var validoutipo = false;
    var Tipo = $('#selTipoCadastrar').val();        
    if (Tipo === null || Tipo === "") {

        traduzirTexto('Informe o perfil.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#selTipoCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#selTipoCadastrar').addClass('is-invalid');            
        });

    }
    else {
        validoutipo = true;
        $('#selTipoCadastrar').removeClass('is-invalid');            
    }

    var validouativo = false;
    var Ativo = $('#selAtivoCadastrar').val();    
    if (Ativo === null || Ativo === "") {

        traduzirTexto('Informe se o usuário será ativado.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#selAtivoCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#selAtivoCadastrar').addClass('is-invalid');            
        });
        
    }
    else {
        validouativo = true;
        $('#selAtivoCadastrar').removeClass('is-invalid');            
    }

    let valiodouempresanavio = ($('#tbempnav tbody tr').length > 0);
    
    if (!valiodouempresanavio) {
        $('#divtbempnav').css('border','1px solid #fd5353');
        $('#divmsgempnav').show();        
    }   
    else {
        $('#divtbempnav').css('border','1px solid #D5DFE7');
        $('#divmsgempnav').hide();
    }     

    var validousenha = false;
    if (($('#inputSenhaCadastrar').val() === "") || ($('#inputSenhaCadastrar').val() === null)) {
        traduzirTexto('Informe a senha.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputSenhaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputSenhaCadastrar').addClass('is-invalid');                    
        });
        
    }        
    if ($('#inputSenhaCadastrar').val() != "") {
        if (!verificaSenha($('#inputSenhaCadastrar').val())){                
            traduzirTexto('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputSenhaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#inputSenhaCadastrar').addClass('is-invalid');    
                    });
            
        
        }
        else {
            $('#inputSenhaCadastrar').removeClass('is-invalid');         
            validousenha = true;   
        }
    }
    var validouconfirmasenha = false;
    if (($('#inputConfirmarSenhaCadastrar').val() === "") || ($('#inputConfirmarSenhaCadastrar').val() === null))  {
        traduzirTexto('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputConfirmarSenhaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputConfirmarSenhaCadastrar').addClass('is-invalid');            
                    });

    }

    if (($('#inputConfirmarSenhaCadastrar').val() != "") && ($('#inputConfirmarSenhaCadastrar').val() != null)) {
        if (!(verificaSenha($('#inputConfirmarSenhaCadastrar').val()) && ($('#inputConfirmarSenhaCadastrar').val() == $('#inputSenhaCadastrar').val()))){            
            traduzirTexto('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputConfirmarSenhaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#inputConfirmarSenhaCadastrar').addClass('is-invalid');            
                        });
            
        }
        else if (($('#inputConfirmarSenhaCadastrar').val() != $('#inputSenhaCadastrar').val() )){
            traduzirTexto('A senha não confere.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputConfirmarSenhaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#inputConfirmarSenhaCadastrar').addClass('is-invalid');            
                            });

        }
        else {
            $('#inputConfirmarSenhaCadastrar').removeClass('is-invalid'); 
            validouconfirmasenha = true;                   
        }
    }
    
    if (form && valido && validouempresa && validounavio &&  validoumatricula && validounome && validouemail && validoutipo && validouativo && valiodouempresanavio && validousenha && validouconfirmasenha) {
        return true;
    }
    else {
        
        // Se o formulário não for válido, exibe as mensagens de erro        
        exibiralertadiv('danger','Preencha todos os campos obrigatórios.', 'divMsgCadastrar');
        if (form) {
            form.classList.add('was-validated');
        }

    }
    

};

function validouUsuarioAlterar() {

    var form = document.getElementById('frmAlterarUsuario');
    var valido = form.checkValidity();

    var camposInvalidos = [];
    $('#frmAlterarUsuario').find(':input').each(function() {
        if (!this.validity.valid) {
            camposInvalidos.push({ id: $(this).attr('id'), name: $(this).attr('name') });
        }
    });

    var validounome = false;
    if ($('#inputNomeAlterar').val() === null || $('#inputNomeAlterar').val() === "") {        
        traduzirTexto('Informe o nome.', $('#idioma').val()).then(function(textoTraduzido) {            
            $('#inputNomeAlterar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputNomeAlterar').addClass('is-invalid');            });
        
    }
    else {
        validounome = true;
        $('#inputNomeAlterar').removeClass('is-invalid');            
    }

    var validouempresa = false;
    var validounavio = false;
    if ($('#tbempnavalterar tbody tr').length > 0) {
        $('#selEmpresaAlterar').removeClass('is-invalid');            
        $('#selEmpresaAlterar').removeClass('required');
        $('#selNavioAlterar').removeClass('is-invalid');
        $('#selNavioAlterar').removeClass('required'); 
        validouempresa = true; 
        validounavio = true;          
    }
    else {        
        if ($('#selEmpresaAlterar').val() === null || $('#selEmpresaAlterar').val() === "") {    
            traduzirTexto('Informe a empresa.', $('#idioma').val()).then(function(textoTraduzido) {            
                $('#selEmpresaAlterar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#selEmpresaAlterar').addClass('is-invalid');            
                $('#selEmpresaAlterar').addClass('required');
            });
            }
        else {
            validouempresa = true;
            $('#selEmpresaAlterar').removeClass('is-invalid');            
            $('#selEmpresaAlterar').removeClass('required');
        }
        
        if ($('#selNavioAlterar').val() === null || $('#selNavioAlterar').val() === "") {
            
            traduzirTexto('Informe o navio.', $('#idioma').val()).then(function(textoTraduzido) {            
                $('#selNavioAlterar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#selNavioAlterar').addClass('is-invalid');            
            });

            
        }
        else {
            validounavio = true;
            $('#selNavioAlterar').removeClass('is-invalid');            
        }
    }
    
    var validoumatricula = false;
    var Matricula = formataSoNumeros($('#inputMatriculaAlterar').val());    
    if (Matricula === ""){
        $('#inputMatriculaAlterar').siblings('.invalid-feedback').text('Informe a Matricula.');
        $('#inputMatriculaAlterar').addClass('is-invalid');            
    }
    else {
        validoumatricula = true;
        $('#inputMatriculaAlterar').removeClass('is-invalid');            
    }

    var validouemail = false;
    if ($('#inputEmailAlterar').val() === null || $('#inputEmailAlterar').val() === "") {
        traduzirTexto('Informe o email.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputEmailAlterar').siblings('.invalid-feedback').text(textoTraduzido);
        $('#inputEmailAlterar').addClass('is-invalid');            
        });

    }
    else if (!validaEmail($('#inputEmailAlterar').val())) {
        traduzirTexto('Email inválido.', $('#idioma').val()).then(function(textoTraduzido) {
            $('#inputEmailAlterar').siblings('.invalid-feedback').text(textoTraduzido);
            $('#inputEmailAlterar').addClass('is-invalid');            
        });
    }
    else {
        validouemail = true;
        $('#inputEmailAlterar').removeClass('is-invalid');            
    }
    
    var validoutipo = false;
    var Tipo = $('#selTipoAlterar').val();        
    if (Tipo === null || Tipo === "") {
        $('#selTipoAlterar').siblings('.invalid-feedback').text('Informe o perfil.');
        $('#selTipoAlterar').addClass('is-invalid');            
    }
    else {
        validoutipo = true;
        $('#selTipoAlterar').removeClass('is-invalid');            
    }

    var validouativo = false;
    var Ativo = $('#selAtivoAlterar').val();    
    if (Ativo === null || Ativo === "") {
        $('#selAtivoAlterar').siblings('.invalid-feedback').text('Informe se o usuário será ativado.');
        $('#selAtivoAlterar').addClass('is-invalid');            
    }
    else {
        validouativo = true;
        $('#selAtivoAlterar').removeClass('is-invalid');            
    }

    let valiodouempresanavio = ($('#tbempnavalterar tbody tr').length > 0);
    
    if (!valiodouempresanavio) {
        $('#divtbempnavalterar').css('border','1px solid #fd5353');
        $('#divmsgempnavalterar').show();        
    }   
    else {
        $('#divtbempnavalterar').css('border','1px solid #D5DFE7');
        $('#divmsgempnavalterar').hide();
    }     

    
    if (form && valido && validouempresa && validounavio &&  validoumatricula && validounome && validouemail && validoutipo && validouativo && valiodouempresanavio) {
        return true;
    }
    else {
        
        // Se o formulário não for válido, exibe as mensagens de erro        
        exibiralertadiv('danger','Preencha todos os campos obrigatórios.', 'divMsgAlterar');
        if (form) {
            form.classList.add('was-validated');
        }

    }
    

};


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

function carreganavio(selNavio) {
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

            $("#" + selNavio).empty();
            

            traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                $("#" + selNavio).append('<option value="">' + textoTraduzido+ '</option>');
                $.each(data.REGISTROS, function(index, option) {
                    $("#" + selNavio).append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
                });
                $('.content-body').unblock();    
            });

            
            
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });
    
}

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

            
            $("#selNavio").empty();

            traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {

                var existe = $("#selNavio option").filter(function () {
                    return $(this).text() === textoTraduzido;
                }).length > 0;
                if (!existe) {
                   $("#selNavio").append('<option value="">' + textoTraduzido + '</option>');
                }

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

    $('#inputMatricula').on('input', function() {
        var matricula = formataSoNumeros($(this).val());

        // Verifica se a Matrícula tem entre 4 e 1 dígitos
        if (matricula.length >= 4 && matricula.length <= 15) {
            // Matrícula válida: remove a classe de inválido e a mensagem de erro
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('');            
        } else {
            // Matrícula inválida: adiciona a classe de inválido e exibe a mensagem de erro
            $(this).addClass('is-invalid');

            traduzirTexto('Matrícula inválida. Por favor, informe uma Matrícula de no mínino 4 dígitos.', $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings(textoTraduzido);            
            });
            
        }
    });

    $('#inputNome').on('input', function() {
        var nome = $(this).val();
        
        if (nome.length > 0) {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('');        
        }
    });
    
    $('.tolower').keypress(function(event) {
        // Obtém o código da tecla digitada
        var charCode = event.which || event.keyCode;

        // Verifica se a tecla digitada é uma letra maiúscula
        if (charCode >= 65 && charCode <= 90) {
            // Converte a letra maiúscula para minúscula
            var lowercaseChar = String.fromCharCode(charCode).toLowerCase();
            
            // Insere a letra minúscula no campo de e-mail
            $(this).val($(this).val() + lowercaseChar);
            
            return false; // Impede a digitação da letra maiúscula original
        }

        var email = $(this).val();
        
        if (validaEmail(email)) {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').text('');        
        }
    });

    $('#inputSenha').blur(function(){    
        if (verificaSenha($(this).val()) && ($(this).val() != "")){            
            $(this).removeClass('is-invalid');            
        }
        else if ($(this).val() == "") {
            $(this).siblings('.invalid-feedback').text('Informe a senha.');
            $(this).addClass('is-invalid');            
        }
        else {
            $(this).siblings('.invalid-feedback').text('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.');
            $(this).addClass('is-invalid');            
        }
    });

    $('#inputConfirmarSenha').blur(function(){    
        if (verificaSenha($(this).val()) && ($(this).val() != "") && ($(this).val() == $('#inputSenha').val() )){            
            $(this).removeClass('is-invalid');            
        }
        else if ($('#inputConfirmarSenha').val() == "") {
            $(this).siblings('.invalid-feedback').text('Confirme a senha.');
            $(this).addClass('is-invalid');            
        }
        else if (($(this).val() != $('#inputSenha').val() )){
            $(this).siblings('.invalid-feedback').text('A senha não confere.');
            $(this).addClass('is-invalid');            
        }
        else {
            $(this).siblings('.invalid-feedback').text('A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.');
            $(this).addClass('is-invalid');            
        }    
    
    });

    block();

    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'getusuario',
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
            
            var obj = "";
            var encodedObj = "";
            var acoes = "";
            var status = "";

            // Iterar sobre os registros recebidos
            $.each(data.REGISTROS, function(i, item) {

                obj = JSON.stringify(item);                
                encodedObj = encodeURIComponent(obj);
                acoes = '<div class="d-flex">' +
                        '<a href="#" onclick="abrirModalEditar(\'' + encodedObj + '\')" title="Editar Usuário" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                        '<a href="#" onclick="abrirModalExcluir(\'' + encodedObj + '\')" title="Excluir Usuário" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                        '</div>';

                if (item.ATIVO === "S"){
                    status = '<span class="badge light badge-success">Ativo</span>';
                }    
                else {
                    status = '<span class="badge light badge-danger">Não Ativado</span>';
                }

                // Adicionar uma nova linha à tabela com os dados do item atual
                tabela.row.add([
                    item.INDICE,
                    item.MATRICULA,
                    decodeURIComponent(item.NOME),
                    item.PERFIL,
                    item.EMAIL,
                    status,
                    acoes
                ]).draw();
            });
            
            $('#h3totalusuarios').html(data.REGISTROS.length);

        },
        error: function(xhr, status, error) {
            // Exibir um alerta de erro e desbloquear a página em caso de falha na requisição
            exibiralertadiv('error', 'Tente novamente!','divMsg');
            
        }
    });

    carregaempresa('selEmpresa');
    carregaempresa('selEmpresaCadastrar');
    carregaempresa('selEmpresaAlterar');
    carreganavio('selNavioAlterar');

    $('#selEmpresa').on('change', function() {
		
        block();
    
        var valor = $(this).val();
        if (valor) {
    
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getnavioporempresa',
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

                    $("#selNavio").empty();

                    traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
                        $("#selNavio").append('<option value="">' + textoTraduzido + '</option>');
                        $.each(data.REGISTROS, function(index, option) {
                            $("#selNavio").append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
                        });
                        $('.content-body').unblock();
                
                    });
        
                },
                error: function(xhr, status, error) {
                    $('.content-body').unblock();
                }
            });
            
    
        } 
        else {
            $('.content-body').unblock();
            $("#selNavio").empty();
            $("#selNavio").append('<option value=""></option>');
        }
    });

    
    $('#selTipoCadastrar').on('change', function() {
        var Tipo = $('#selTipoCadastrar').val();        
        if (Tipo === null || Tipo === "") {
            $('#selTipoCadastrar').siblings('.invalid-feedback').text('Informe o perfil.');
            $('#selTipoCadastrar').addClass('is-invalid');            
        }
        else {    
            $('#selTipoCadastrar').removeClass('is-invalid');            
        }
    });

    $('#selAtivoCadastrar').on('change', function() {    
        var Ativo = $('#selAtivoCadastrar').val();    
        if (Ativo === null || Ativo === "") {
            $('#selAtivoCadastrar').siblings('.invalid-feedback').text('Informe se o usuário será ativado.');
            $('#selAtivoCadastrar').addClass('is-invalid');            
        }
        else {    
            $('#selAtivoCadastrar').removeClass('is-invalid');            
        }
    });
    
    $('#selNavioAlterar').on('change', function() {
        $('#selNavioAlterar').removeClass('is-invalid');            
        $('#selNavioAlterar').removeClass('required');
    });

    $('#selEmpresaAlterar').on('change', function() {
		
        block();
    
        var valor = $(this).val();
        if (valor) {

            $('#selEmpresaAlterar').removeClass('is-invalid');            
            $('#selEmpresaAlterar').removeClass('required');
    
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getnavioporempresa',
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

                    $("#selNavioAlterar").empty();
                    $("#selNavioAlterar").append('<option value=""></option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selNavioAlterar").append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
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
            $("#selNavioAlterar").empty();
            $("#selNavioAlterar").append('<option value=""></option>');
        }
    });

    $('#inputMatriculaCadastrar').on('change keyup', function() {        
        if ($(this).val()) {
            $('#inputMatriculaCadastrar').removeClass('is-invalid');            
        }        
        else{
            traduzirTexto('Informe a matrícula.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputMatriculaCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#inputMatriculaCadastrar').addClass('is-invalid');            
            });            
        }    
    });

    $('#inputNomeCadastrar').on('change keyup', function() {        
        if ($(this).val()) {
            $('#inputNomeCadastrar').removeClass('is-invalid');            
        }        
        else{
            traduzirTexto('Informe o nome.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputNomeCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#inputNomeCadastrar').addClass('is-invalid');            
            });            
            
        }    
    });

    $('#selNavioCadastrar').on('change', function() {
        if ($(this).val()) {
            $('#selNavioCadastrar').removeClass('is-invalid');            
        }        
        else{
            traduzirTexto('Informe o navio.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#selNavioCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#selNavioCadastrar').addClass('is-invalid');           
            });            

        }    
    });

    $('#inputEmailCadastrar').on('change keyup', function() {        
        if ($('#inputEmailCadastrar').val() === null || $('#inputEmailCadastrar').val() === "") {
            traduzirTexto('Informe o email.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputEmailCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#inputEmailCadastrar').addClass('is-invalid');            
            });
            
        }
        else if (!validaEmail($('#inputEmailCadastrar').val())) {
            traduzirTexto('Email inválido.', $('#idioma').val()).then(function(textoTraduzido) {
                $('#inputEmailCadastrar').siblings('.invalid-feedback').text(textoTraduzido);
                $('#inputEmailCadastrar').addClass('is-invalid');            
            });
            
        }
        else {            
            $('#inputEmailCadastrar').removeClass('is-invalid');            
        }
    });

    $('.to-lowercase').on('input', function() {
        var valorMinusculo = $(this).val().toLowerCase();
        $(this).val(valorMinusculo);
    });

    $('#inputSenhaCadastrar').blur(function(){    
        if (verificaSenha($(this).val()) && ($(this).val() != "")){            
            $(this).removeClass('is-invalid');            
        }
        else if ($(this).val() == "") {
            traduzirTexto('Informe a senha.', $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });            
        }
        else {            
            var texto = "A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.";
            traduzirTexto(texto, $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });             
            
        }
    });

    $('#inputConfirmarSenhaCadastrar').blur(function(){    
        if (verificaSenha($(this).val()) && ($(this).val() != "") && ($(this).val() == $('#inputSenhaCadastrar').val() )){            
            $(this).removeClass('is-invalid');            
        }
        else if ($('#inputConfirmarSenhaCadastrar').val() == "") {
            traduzirTexto("Confirme a senha.", $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });
        }
        else if (($(this).val() != $('#inputSenhaCadastrar').val() )){
            traduzirTexto("A senha não confere.", $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });            
        }
        else {
            traduzirTexto("A senha não obedece aos critérios de segurança.Crie uma senha forte de 8 caracteres com uma combinação de letras, números e símbolos.", $('#idioma').val()).then(function(textoTraduzido) {
                $(this).siblings('.invalid-feedback').text(textoTraduzido);
                $(this).addClass('is-invalid');            
            });           
            
        }    
    
    });


    $('#selEmpresaCadastrar').on('change', function() {
		
        block();

        var valor = $(this).val();
        if (valor) {

            $('#selEmpresaCadastrar').removeClass('is-invalid');            
            $('#selEmpresaCadastrar').removeClass('required');
            
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'getnavioporempresa',
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

                    $("#selNavioCadastrar").empty();
                    $("#selNavioCadastrar").append('<option value=""></option>');
                    $.each(data.REGISTROS, function(index, option) {
                        $("#selNavioCadastrar").append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
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
            $("#selNavioCadastrar").empty();
            $("#selNavioCadastrar").append('<option value=""></option>');
            $('#selEmpresaCadastrar').siblings('.invalid-feedback').text('Informe a empresa.');
            $('#selEmpresaCadastrar').addClass('is-invalid'); 
            $('#selEmpresaCadastrar').addClass('required');           
        }
    });


    $('#lnkRemoverFiltroUsuario').on('click', function() {

        traduzirTexto('Navio...', $('#idioma').val()).then(function(textoTraduzido) {
            $('#selEmpresa option').eq(0).prop('selected', true);            
            $("#selNavio").empty();
            $("#selNavio").append('<option value="">' + textoTraduzido +'</option>');
            $('#selNavio option').eq(0).prop('selected', true);  
            $('#inputMatricula').val('');
            var tabela = $('#tbCards').DataTable();	        
            tabela.clear().draw();        
            $('#h3totalusuarios').html('');    
        });


    });

    $('#btnExcluirUsuario').on('click', function() {

        var palavra = $('#inputTextoPalavraExcluir').val();                
        var form = document.getElementById('frmExcluirUsuario');

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
            funcao: 'delusuario',
            id: $('#hddidusuario').val(),
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
                    atualizaTabelaUsuario();     
                    $('#divModalExcluir').modal('hide');
                    exibiralertadiv('success','Usuário excluído com sucesso!','divMsg');                                                
                }
                else {
                    exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgExcluir');
                }    


            },
            error: function(xhr, status, error) {
                exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgExcluir');
            }
        });
    });
   

    $('#lnkFiltrar').on('click', function() {
        

        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'getusuario',
            empresa: $('#selEmpresa').val(),            
            navio: $('#selNavio').val(),            
            matricula: $('#inputMatricula').val(),            
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

                    var obj = "";
                    var encodedObj = "";
                    var acoes = "";
                    var status = "";

					// Iterar sobre os registros recebidos                    
					$.each(data.REGISTROS, function(i, item) {

                        obj = JSON.stringify(item);                
                        encodedObj = encodeURIComponent(obj);
                        acoes = '<div class="d-flex">' +
                                '<a href="#" onclick="abrirModalEditar(\'' + encodedObj + '\')" title="Editar Usuário" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                                '<a href="#" onclick="abrirModalExcluir(\'' + encodedObj + '\')" title="Excluir Usuário" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                                '</div>';


                        if (item.ATIVO === "S"){
                            status = '<span class="badge light badge-success">Ativo</span>';
                        }    
                        else {
                            status = '<span class="badge light badge-danger">Não Ativado</span>';
                        }


						// Adicionar uma nova linha à tabela com os dados do item atual
						tabela.row.add([
							item.INDICE,							
							item.MATRICULA,
							decodeURIComponent(item.NOME),
                            item.PERFIL,
							item.EMAIL,
                            status,
							acoes
						]).draw();
					});
                    $('#h3totalusuarios').html(data.REGISTROS.length);

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

    $('#btnAtualizarUsuario').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouUsuarioAlterar())  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição        
            var dados = {
                funcao: 'updusuario',
                id:$('#inputIdAlterar').val(),
                empresa:$('#selEmpresaAlterar').val(),
                navio:$('#selNavioAlterar').val(),
                matricula: $('#inputMatriculaAlterar').val(),
                nome:$('#inputNomeAlterar').val(),
                email:$('#inputEmailAlterar').val(),
                ativo:$('#selAtivoAlterar').val(),
                tipo:$('#selTipoAlterar').val(),            
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
                        atualizaTabelaUsuario();     
                        exibiralertadiv('success','Usuário atualizado com sucesso!','divMsg');                                                                                        
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
    
    
    $('#btnCancelarCadastrarUsuario').on('click', function() {
        $('#ModalCenterConfirmarCadastrar').modal('hide');    
        $('#divModalNovo').modal('show');        
    }); 

    $('#btnConfirmarCadastrarUsuario').on('click', function() {
                        
        block();
        
        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'insusuario',
            empresa:$('#selEmpresaCadastrar').val(),
            navio:$('#selNavioCadastrar').val(),
            matricula: $('#inputMatriculaCadastrar').val(),
            nome:$('#inputNomeCadastrar').val(),
            email:$('#inputEmailCadastrar').val(),
            ativo:$('#selAtivoCadastrar').val(),
            tipo:$('#selTipoCadastrar').val(),
            senha:$('#inputSenhaCadastrar').val(),                
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
                    $('#ModalCenterConfirmarCadastrar').modal('hide');    
                    atualizaTabelaUsuario();     
                    exibiralertadiv('success','Usuário cadastrado com sucesso!','divMsg');                                                
                }
                else {
                    $('#ModalCenterConfirmarCadastrar').modal('hide');    
                    $('#divModalNovo').modal('show');
                    exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgCadastrar');
                }    
                                    
            },
            error: function(xhr, status, error) {
                $('#ModalCenterConfirmarCadastrar').modal('hide');    
                $('#divModalNovo').modal('show');
                exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgCadastrar');
                
            }
        });
       
    });

    $('#btnSalvarUsuario').on('click', function() {
        
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouUsuarioCadastrar())  {
            $('#divModalNovo').modal('hide');
            $('#ModalCenterConfirmarCadastrar').modal('show');    
        } 
     
    });

    $('#btnSalvarEmpresaNavio').on('click', function() {
        
        var validouempresa = false;
        if ($('#selEmpresaCadastrar').val() != null && $('#selEmpresaCadastrar').val() != "") {            
            validouempresa = true;            
        }
    
        var validounavio = false;
        if ($('#selNavioCadastrar').val() != null && $('#selNavioCadastrar').val() != "") {            
            validounavio = true;            
        }

        if (!(validouempresa && validounavio)) {
            exibiralertadiv('danger','Selecione uma empresa e um navio para adicionar.','divMsgCadastrar');            
            return;
        }

        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'insempnaviousuariotmp',
            empresa:$('#selEmpresaCadastrar').val(),
            navio:$('#selNavioCadastrar').val(),                      
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

                if (data.ERRO == "OK") { 
                    $('#tbitemempnav').html(data.TABELA);                   
                    $('#divtbempnav').css('border','1px solid #D5DFE7');                        
                    $('#divmsgempnav').hide();
                }
                else {
                    exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgCadastrar');
                }    
                                    
            },
            error: function(xhr, status, error) {
                exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgCadastrar');                
            }
        });

          
    });
    
    $('#btnSalvarEmpresaNavioAlterar').on('click', function() {
        
        var validouempresa = false;
        if ($('#selEmpresaAlterar').val() != null && $('#selEmpresaAlterar').val() != "") {            
            validouempresa = true;            
        }
    
        var validounavio = false;
        if ($('#selNavioAlterar').val() != null && $('#selNavioAlterar').val() != "") {            
            validounavio = true;            
        }

        if (!(validouempresa && validounavio)) {
            exibiralertadiv('danger','Selecione uma empresa e um navio para adicionar.','divMsgAlterar');            

            if ($('#selEmpresaAlterar').val() === null || $('#selEmpresaAlterar').val() === "") {    
                $('#selEmpresaAlterar').siblings('.invalid-feedback').text('Informe a empresa.');
                $('#selEmpresaAlterar').addClass('is-invalid');            
                $('#selEmpresaAlterar').addClass('required');
            }
            else {
                $('#selEmpresaAlterar').removeClass('is-invalid');            
                $('#selEmpresaAlterar').removeClass('required');
            }

            if ($('#selNavioAlterar').val() === null || $('#selNavioAlterar').val() === "") {
                $('#selNavioAlterar').siblings('.invalid-feedback').text('Informe o navio.');
                $('#selNavioAlterar').addClass('is-invalid');            
            }
            else {
                $('#selNavioAlterar').removeClass('is-invalid');            
            }
            
            return;
        }

        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'insempnaviousuarioalterartmp',
            empresa:$('#selEmpresaAlterar').val(),
            navio:$('#selNavioAlterar').val(),                      
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

                if (data.ERRO == "OK") { 
                    $('#tbitemempnavalterar').html(data.TABELA);                   
                    $('#divtbempnavalterar').css('border','1px solid #D5DFE7');                        
                    $('#divmsgempnavalterar').hide();
                }
                else {
                    exibiralertadiv('danger',decodeURIComponent(data.ERRO),'divMsgAlterar');
                }    
                                    
            },
            error: function(xhr, status, error) {
                exibiralertadiv('danger','Tente novamente! - ' + error,'divMsgAlterar');                
            }
        });

          
    });



});