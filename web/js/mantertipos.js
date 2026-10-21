

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
  
  
  
  function carregatiposdetalhesid(selTiposDetalhesId) {
      
      var dados = {
          funcao: 'gettiposdetalhesid',        
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
  
              $("#" + selTiposDetalhesId).empty();
              if ($('#idioma').val() === "en") {
                $("#" + selTiposDetalhesId).append('<option value="">Detail Types...</option>');
              }
              else {
                $("#" + selTiposDetalhesId).append('<option value="">Tipos Detalhes...</option>');
              }
              $.each(data.REGISTROS, function(index, option) {
                  $("#" + selTiposDetalhesId).append('<option value="' + option.ID + '">' + option.ID + '-' + decodeURIComponent(option.DESCRICAO) + '</option>');
              });
              $('.content-body').unblock();
          },
          error: function(xhr, status, error) {
              $('.content-body').unblock();
          }
      });
      
  }

  function carregatiposidsel(selTipos,id) {
      
    var dados = {
        funcao: 'gettiposid',        
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

            $("#" + selTipos).empty();
            if ($('#idioma').val() === "en") {
                $("#" + selTipos).append('<option value="">Type...</option>');    
            }
            else {
                $("#" + selTipos).append('<option value="">Tipos...</option>');
            }
            $.each(data.REGISTROS, function(index, option) {
                if (option.ID === id){
                    $("#" + selTipos).append('<option value="' + option.ID + '" selected>' + decodeURIComponent(option.SIGLA) + '-' + decodeURIComponent(option.DESCRICAO) + '</option>');
                }   
                else {
                    $("#" + selTipos).append('<option value="' + option.ID + '">' + decodeURIComponent(option.SIGLA) + '-' + decodeURIComponent(option.DESCRICAO) + '</option>');
                }
            });
            $('.content-body').unblock();
        },
        error: function(xhr, status, error) {
            $('.content-body').unblock();
        }
    });
    
}
  
  function carregatiposid(selTipos) {
      
      var dados = {
          funcao: 'gettiposid',        
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
  
              $("#" + selTipos).empty();
              $("#" + selTipos).append('<option value="">Tipos...</option>');
              $.each(data.REGISTROS, function(index, option) {
                  $("#" + selTipos).append('<option value="' + option.ID + '">' + decodeURIComponent(option.SIGLA) + '-' + decodeURIComponent(option.DESCRICAO) + '</option>');
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
      document.getElementById("frmCadastrarTipo").reset();
      
      // Encontra o modal pelo ID e ativa-o
      var modal = new bootstrap.Modal(document.getElementById('divModalNovo'));
      modal.show();
  }
  
  function abrirModalAdicionar(id,tipoid,tipodetalheid,tipodescricao,sigla,tipodetalhedescricao) {
  
    var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
    if(botaoFechar) {            
        botaoFechar.click();
    }                             

    // Reseta o formulário
    document.getElementById("frmAdicionarTipoDetalhe").reset();
    $('#hddidadicionar').val(id);
    $('#hddidtipoadicionar').val(tipoid);
    $('#hddidtipodetalheadicionar').val(tipodetalheid);
    $('#hddtipodescricaoadicionar').val(tipodescricao);
    $('#hddtipodetalhedescricaoadicionar').val('');
    $('#inputTipoIdAdicionar').val(tipodescricao);
    $('#inputSiglaAdicionar').val(sigla);
    $('#inputTipoDetalheIdAdicionar').val('');
    
    // Encontra o modal pelo ID e ativa-o
    var modal = new bootstrap.Modal(document.getElementById('divModalAdicionar'));
    modal.show();
}


  function abrirModalEditar(id,tipoid,tipodetalheid,tipodescricao,sigla,tipodetalhedescricao) {
  
      var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
      if(botaoFechar) {            
          botaoFechar.click();
      }                             
  
      // Reseta o formulário
      document.getElementById("frmAlterarTipo").reset();
      $('#hddid').val(id);
      $('#hddidtipo').val(tipoid);
      $('#hddidtipodetalhe').val(tipodetalheid);
      $('#hddtipodescricao').val(tipodescricao);
      $('#hddtipodetalhedescricao').val(tipodetalhedescricao);
      $('#inputTipoIdAlterar').val(tipodescricao);
      $('#inputSiglaAlterar').val(sigla);
      $('#inputTipoDetalheIdAlterar').val(tipodetalhedescricao);
      
      // Encontra o modal pelo ID e ativa-o
      var modal = new bootstrap.Modal(document.getElementById('divModalAlterar'));
      modal.show();
  }
  
    
  function abrirModalExcluir(id,tipoid,tipodetalheid,tipodescricao,tipodetalhedescricao) {
  
      var botaoFechar = document.querySelector('.alert button[data-bs-dismiss="alert"]');
      if(botaoFechar) {            
          botaoFechar.click();
      }                             
  
      // Reseta o formulário
      document.getElementById("frmExcluirTipoDetalhe").reset();

      $('#hddid').val(id);
      $('#hddidtipo').val(tipoid);
      $('#hddidtipodetalhe').val(tipodetalheid);
      $('#hddtipodescricao').val(tipodescricao);
      $('#hddtipodetalhedescricao').val(tipodetalhedescricao);
      $('#inputTipoExcluir').val(tipodescricao);
      $('#inputTipoDetalheExcluir').val(tipodetalhedescricao);      
          
      // Encontra o modal pelo ID e ativa-o
      var modal = new bootstrap.Modal(document.getElementById('divModalExcluir'));
      modal.show();
  }
  
  
  function atualizaTabelaTipo(){
        
    // Construir os dados a serem enviados no corpo da requisição
    var dados = {
        funcao: 'gettiposdetalhesporparametro',
        tipoid: $('#selTiposId').val(),            
        tipoiddetalhe: $('#selTiposDetalhesId').val(),            
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
                    '<a href="#" onclick="abrirModalAdicionar(\'' + item.ID + '\', \'' + item.ID_CARDS_TIPO_ID + '\', \'' + item.ID_CARDS_TIPO_DETALHE_ID + '\', \'' + decodeURIComponent(item.TIPO_DESCRICAO1) + '\', \'' + decodeURIComponent(item.SIGLA) + '\', \'' + decodeURIComponent(item.TIPO_DETALHE_DESCRICAO) + '\')" title="Adicionar Tipo Detalhe" class="btn btn-success shadow btn-xs sharp me-1"><i class="fas fa-plus"></i></a>' +
                    '<a href="#" onclick="abrirModalEditar(\'' + item.ID + '\', \'' + item.ID_CARDS_TIPO_ID + '\', \'' + item.ID_CARDS_TIPO_DETALHE_ID + '\', \'' + decodeURIComponent(item.TIPO_DESCRICAO1) + '\', \'' + decodeURIComponent(item.SIGLA) + '\', \'' + decodeURIComponent(item.TIPO_DETALHE_DESCRICAO) + '\')" title="Editar Tipo Detalhe" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                    '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\',\'' + item.ID_CARDS_TIPO_ID + '\',\'' + item.ID_CARDS_TIPO_DETALHE_ID + '\', \'' + decodeURIComponent(item.TIPO_DESCRICAO) + '\', \'' + item.TIPO_DETALHE_DESCRICAO + '\')" title="Excluir Tipo Detalhe" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                    '</div>';
                    // Adicionar uma nova linha à tabela com os dados do item atual
                    tabela.row.add([
                        item.ID,
                        decodeURIComponent(item.TIPO_DESCRICAO),
                        decodeURIComponent(item.TIPO_DETALHE_DESCRICAO),                            
                        acoes
                    ]).draw();
                });

                
                $('#h3totalnavio').html(data.REGISTROS.length);

                $('#lnkFiltrar').prop("disabled", false);

                traduzirTexto('Filtrar', $('#idioma').val()).then(function(textoTraduzido) {
                    $('#lnkFiltrar').html(textoTraduzido +' <i class="fa fa-search me-1"></i>');
                });
    



        },
        error: function(xhr, status, error) {
            $('#lnkFiltrar').prop("disabled", false);
            traduzirTexto('Filtrar', $('#idioma').val()).then(function(textoTraduzido) {
                $('#lnkFiltrar').html(textoTraduzido +' <i class="fa fa-search me-1"></i>');
            });

            $('.content-body').unblock();
        }
    });

  }
  
  function validouTipo(formulario){
  
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
          if (formulario === "frmCadastrarTipo") {
              divmsg = 'divMsgCadastrar';
          }
          else if (formulario === "frmAlterarTipo") {
              divmsg = 'divMsgAlterar';
          }
          else if (formulario === "frmExcluirTipo") {
              divmsg = 'divMsgExcluir';
              
          }
          else if (formulario === "frmAdicionarTipoDetalhe") {
            divmsg = 'divMsgAlterar';
        } 
  
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
              $("#" + idSelect).append('<option value="">Navio...</option>');
              $.each(data.REGISTROS, function(index, option) {
                  $("#" + idSelect).append('<option value="' + option.ID + '">' + decodeURIComponent(option.NOME_NAVIO) + '</option>');
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
        
      $('.datepicker').datepicker({
          format: 'dd/mm/yyyy',            
          language: "pt-br",
          autoclose: true            
      });
  
      carregatiposid('selTiposId');
                        
      $('#selEmpresaCadastrar').on('change', function() {
          if ($(this).val() != "") {
              $(this).removeClass('is-invalid');
              $(this).siblings('.invalid-feedback').text('');            
          }
      });
      
      $('#lnkRemoverFiltroTipo').on('click', function() {
          $('#selTiposId option').eq(0).prop('selected', true);                    
          $('#selTiposDetalhesId option').eq(0).prop('selected', true);                    
          $("#selTiposDetalhesId").empty();
          if ($('#idioma').val() === "en") {
            $("#selTiposDetalhesId").append('<option value="">Detail Types...</option>');
          }
          else{
            $("#selTiposDetalhesId").append('<option value="">Tipos Detalhes...</option>');
          }
          
          $('#selTiposDetalhesId option').eq(0).prop('selected', true);            
          var tabela = $('#tbCards').DataTable();	        
          tabela.clear().draw();        
          $('#h3totalnavio').html('');
          $( "#lnkFiltrar" ).trigger( "click" );
      });
  
  
      $('#btnExcluirTipo').on('click', function() {
  
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
              funcao: 'deltipoidtipodetalhe',
              id: $('#hddid').val(),
              tipoid: $('#hddidtipo').val(),
              tipodetalheid: $('#hddidtipodetalhe').val(),
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
                      carregatiposidsel('selTiposId',$('#hddidtipo').val());                       
                      atualizaTabelaTipo();     
                      $('#selTiposId').trigger('change');
                      exibiralertadiv('success','Tipo/Tipo Detalhe excluído com sucesso!','divMsg');                                                
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
  
      
      
      $('#selTiposId').on('change', function() {
          
          block();
      
          var valor = $(this).val();
          if (valor) {
      
              // Construir os dados a serem enviados no corpo da requisição
              var dados = {
                  funcao: 'gettiposdetalhesidportipoid',
                  tipoid: valor,
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
  
                      $("#selTiposDetalhesId").empty();
                      
                      if ($('#idioma').val() === "en") {
                        $("#selTiposDetalhesId").append('<option value="">Detail Types...</option>');
                      }
                      else{
                        $("#selTiposDetalhesId").append('<option value="">Tipos Detalhes...</option>');
                      }
          
                      $.each(data.REGISTROS, function(index, option) {
                          $("#selTiposDetalhesId").append('<option value="' + option.ID + '">' + option.DESCRICAO + '</option>');
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
  
          var tipoid = $('#selTiposId').val();
          var tipodetalheid =$('#selTiposDetalhesId').val();

          // Construir os dados a serem enviados no corpo da requisição
          var dados = {
              funcao: 'gettiposdetalhesporparametro',
              tipoid: tipoid,            
              tipoiddetalhe: tipodetalheid,            
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
                          '<a href="#" onclick="abrirModalAdicionar(\'' + item.ID + '\', \'' + item.ID_CARDS_TIPO_ID + '\', \'' + item.ID_CARDS_TIPO_DETALHE_ID + '\', \'' + decodeURIComponent(item.TIPO_DESCRICAO1) + '\', \'' + decodeURIComponent(item.SIGLA) + '\', \'' + decodeURIComponent(item.TIPO_DETALHE_DESCRICAO) + '\')" title="Adicionar Tipo Detalhe" class="btn btn-success shadow btn-xs sharp me-1"><i class="fas fa-plus"></i></a>' +
                          '<a href="#" onclick="abrirModalEditar(\'' + item.ID + '\', \'' + item.ID_CARDS_TIPO_ID + '\', \'' + item.ID_CARDS_TIPO_DETALHE_ID + '\', \'' + decodeURIComponent(item.TIPO_DESCRICAO1) + '\', \'' + decodeURIComponent(item.SIGLA) + '\', \'' + decodeURIComponent(item.TIPO_DETALHE_DESCRICAO) + '\')" title="Editar Tipo Detalhe" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-pencil-alt"></i></a>' +
                          '<a href="#" onclick="abrirModalExcluir(\'' + item.ID + '\',\'' + item.ID_CARDS_TIPO_ID + '\',\'' + item.ID_CARDS_TIPO_DETALHE_ID + '\', \'' + decodeURIComponent(item.TIPO_DESCRICAO) + '\', \'' + item.TIPO_DETALHE_DESCRICAO + '\')" title="Excluir Tipo Detalhe" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>' +
                          '</div>';
                          // Adicionar uma nova linha à tabela com os dados do item atual
                          tabela.row.add([
                              item.ID,
                              decodeURIComponent(item.TIPO_DESCRICAO),
                              decodeURIComponent(item.TIPO_DETALHE_DESCRICAO),                            
                              acoes
                          ]).draw();
                      });
  
                      
                      $('#h3totalnavio').html(data.REGISTROS.length);
  
                      carregatiposidsel('selTiposId',tipoid);
                      $("#selTiposId").val(tipoid);

                      $('#lnkFiltrar').prop("disabled", false);
                      
                      traduzirTexto('Filtrar', $('#idioma').val()).then(function(textoTraduzido) {
                        $('#lnkFiltrar').html(textoTraduzido +' <i class="fa fa-search me-1"></i>');
                    });
      
  
              },
              error: function(xhr, status, error) {
                  $('#lnkFiltrar').prop("disabled", false);
                  
                  traduzirTexto('Filtrar', $('#idioma').val()).then(function(textoTraduzido) {
                    $('#lnkFiltrar').html(textoTraduzido +' <i class="fa fa-search me-1"></i>');
                    });

                  $('.content-body').unblock();
              }
          });
      
          
      });
  
  
      $('#btnSalvarTipo').on('click', function() {
          
          // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
          if (validouTipo('frmCadastrarTipo'))  {
                  
              block();
          
              // Construir os dados a serem enviados no corpo da requisição
              var dados = {
                  funcao: 'instipo',
                  tipoid:$('#inputTipoIdCadastrar').val(),
                  tiposigla: $('#inputSiglaCadastrar').val(),
                  tipodetalheid: $('#inputTipoDetalheIdCadastrar').val(),
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
                          carregatiposid('selTiposId');
                          atualizaTabelaTipo();     
                          exibiralertadiv('success','Tipo cadastrado com sucesso!','divMsg');                                                
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
  
      $('#btnAdicionarTipoDetalhe').on('click', function() {
          
        // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
        if (validouTipo('frmAdicionarTipoDetalhe'))  {
                
            block();
        
            // Construir os dados a serem enviados no corpo da requisição
            var dados = {
                funcao: 'instipodetalhe', 
                id:$('#hddidadicionar').val(),
                tipoid:$('#hddidtipoadicionar').val(),
                tipoiddetalhe:$('#hddidtipodetalhe').val(),                      
                tipoiddetalhedescricao:$('#inputTipoDetalheIdAdicionar').val(),
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
                        $('#divModalAdicionar').modal('hide');                        
                        carregatiposidsel('selTiposId',$('#hddidtipoadicionar').val()); 
                        atualizaTabelaTipo();     
                        exibiralertadiv('success','Tipo detalhe inserido com sucesso!','divMsg');                                                                                        
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

      $('#btnAtualizarTipo').on('click', function() {
          
          // Verifica se o formulário é válido antes de prosseguir com o envio dos dados
          if (validouTipo('frmAlterarTipo'))  {
                  
              block();
          
              // Construir os dados a serem enviados no corpo da requisição
              var dados = {
                  funcao: 'updtipo', 
                  id:$('#hddid').val(),
                  tipoid:$('#hddidtipo').val(),
                  tipoiddetalhe:$('#hddidtipodetalhe').val(),      
                  tipoidsigla: $('#inputSiglaAlterar').val(),
                  tipoiddescricao: $('#inputTipoIdAlterar').val(),
                  tipoiddetalhedescricao:$('#inputTipoDetalheIdAlterar').val(),
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
                          carregatiposidsel('selTiposId',$('#hddidtipo').val()); 
                          atualizaTabelaTipo();     
                          exibiralertadiv('success','Tipo atualizado com sucesso!','divMsg');                                                                                        
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
  
      $( "#lnkFiltrar" ).trigger( "click" );
  
  });
  