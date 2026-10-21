/* ----------------------------------------------------------------------------------------------------------
|  Rotina....: validaEmail_possuiCarateresInvalidos                                                         |
|  Objetivo..: Funçãoo que verifica se o usuário criou caracteres estranhos no e-mail                        |
-----------------------------------------------------------------------------------------------------------*/
function validaEmail_possuiCarateresInvalidos(string){
	var exChar="*"+unescape("%7E%5E%B4%60%27%22%21%24%25%23%26%28%29%3C%3E%2C%3B%3A%3F%5C%5D%5B%7B%7D ");
	var c;
	for(var i=0; i<exChar.length; i++){
		c=exChar.charAt(i);
		if(!(string.indexOf(c)==-1))
			return true;
	}
	return false;
}


/* ----------------------------------------------------------------------------------------------------------
|  Rotina....: validaEmail                                                                                  |
|  Objetivo..: Verifica se o usuário digitou um e-mail válido                                               |
-----------------------------------------------------------------------------------------------------------*/
function validaEmail (email){
	if(validaEmail_possuiCarateresInvalidos(email)) // verificar caracteres nao validos
		return false;

	var i=email.indexOf("@");                   // posicao de @ no email fornecido
	var sLength=email.length - 1;               // comprimento do valor do campo
	if((i>0)&&(i<sLength)){                     // se i<0 ou i==sLengt=> ERRO!
		email=email.substring(i+1, sLength+1);  // substring depois de @
		i=email.indexOf(".");                   // posicao do . na substring
		sLength=email.length - 1;
		if((!(email.charAt(sLength)=="."))&&(email.indexOf("@")==-1))
		if(i>0 && i<sLength)                    // se i>0 e i<Length=> OK!
			return true;
	}
	return false;
}



/* ----------------------------------------------------------------------------------------------------------
|  Rotina....: DaysArray                                                                                    |
|  Objetivo..: Verifica se o usuário digitou um e-mail válido                                               |
-----------------------------------------------------------------------------------------------------------*/
function DaysArray(n,year) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
	}
	// February has 29 days in any year evenly divisible by four,
	// EXCEPT for centurial years which are not also divisible by 400.
	this[2] = (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );

	return this
}

	function isDate(dtStr){
		var dtCh= "/";
		var minYear=1900;
		var maxYear=2100;


		var pos1=dtStr.indexOf(dtCh)
		var pos2=dtStr.indexOf(dtCh,pos1+1)
		var strDay=dtStr.substring(0,pos1)
		var strMonth=dtStr.substring(pos1+1,pos2)
		var strYear=dtStr.substring(pos2+1)

		if (eval(strMonth) < 1 || eval(strMonth) > 12){
			return false
		}
		if (eval(strDay)<1 || eval(strDay) > DaysArray(12,parseInt(strYear))[parseInt(strMonth)]){
			return false
		}
		if (eval(strYear)<minYear || eval(strYear)>maxYear){
			return false
		}
	return true
	}

	function formataSoNumeros(s) {
		var res = "";
		for (var i = 0; i < s.length; i++) {
			if (((s.charAt(i) >= "0") && (s.charAt(i) <= "9")) || (s.charAt(i) < " ")) {
				res += s.charAt(i);
			}
		}
		return res;
	}

	function validaCPF(s){ 
	
		var d1 = 0; var d2 = 0; var i;

		if (!s) return false;
		if (s.length != 11) return false;
		for (i = 0; i < 11; i++) {if (s.substring(0,1) != s.substring(i,i+1)) {i = 100;}}
		if (i < 20) return false;

		for (i = 0; i < 9; i++) {
			d1 += s.charAt(i)*(10-i); d2 += s.charAt(i)*(11-i);}

		if ((d1 == 0)||(s.length != 11)){return false;}

		d1 = 11 - (d1        % 11); if (d1 > 9) d1 = 0; 
		d2 = 11 - ((d2+d1*2) % 11); if (d2 > 9) d2 = 0; 

		return (s.charAt(9) == d1) && (s.charAt(10) == d2);
	}


	function validaCNPJ(s){ 
		var d1 = 0; var d2 = 0;
		var i; var k;

		if (!s) return false;
		if (s.length != 14) return false;

		for (i = 0, k = 5; i < 12; i++) {
			d1 += s.charAt(i)*(k--);
			if (k == 1) {k = 9;}
		}

		for (i = 0, k = 6; i < 12; i++) {
			d2 += s.charAt(i)*(k--);
			if (k == 1) {k = 9;}
		}

		if ((d1 == 0)||(s.length != 14)){return false;}

		d1 = (d1%11 < 2) ? 0 : 11 - (d1%11);
		d2 = (d2 + d1*2) % 11;
		d2 = (d2 < 2) ? 0 : 11 - d2;


		return (s.charAt(12) == d1) && (s.charAt(13) == d2);
	}

	function formataCPF(s,f) {

		if (!f) {
			while (s.indexOf(".") >=0) {s = s.replace(".","");}
			while (s.indexOf("-") >=0) {s = s.replace("-","");}
			while (s.indexOf("/") >=0) {s = s.replace("/","");}
			while (s.length < 11) {s = "0" + s;}
			if (s == "00000000000") {s = ""};
			return s;
		} else {
			s = formataCPF (s,false);
			if (s != '') s = s.substr(0,3) + '.' + s.substr(3,3) + '.' + s.substr(6,3) + '-' + s.substr(9,2);
			return s
		}
	}

	function formataCNPJ(s,f) {

		if (!f) {
			while (s.indexOf(".") >=0) {s = s.replace(".","");}
			while (s.indexOf("-") >=0) {s = s.replace("-","");}
			while (s.indexOf("/") >=0) {s = s.replace("/","");}
			while (s.length < 14) {s = "0" + s;}
			if (s == "00000000000000") {s = ""};
			return s;
		} else {
			s = formataCNPJ (s,false);
			if (s != '') s = s.substr(0,2) + '.' + s.substr(2,3) + '.' + s.substr(5,3) + '/' + s.substr(8,4) + '-' + s.substr(12,2);
			return s
		}
	}


	function formataCpfCnpj(s) {
		if (validaCPF(s)) {

			return formataCPF (s,true);

		} else if (validaCNPJ(s)) {

			return formataCNPJ (s,true);

		} else {

			return s;

		}
	}


	function formataIE(s,f) {

		if (!f) {
			while (s.indexOf(".") >=0) {s = s.replace(".","");}
			while (s.indexOf("-") >=0) {s = s.replace("-","");}
			while (s.length < 14) {s = "0" + s;}
			if (s == "00000000000000") {s = ""};
			return s;
		} else {
			s = formataIE (s,false);
			if (s != '') s = s.substr(0,2) + '.' + s.substr(2,1) + '.' + s.substr(3,3) + '.' + s.substr(6,7) + '-' + s.substr(13,1);
			return s
		}
	}

	function formataCEP(s,f) {

		if (!f) {
			while (s.indexOf("-") >=0) {s = s.replace("-","");}
			while (s.length < 8) {s = "0" + s;}
			if (s == "00000000") {s = ""};
			return s;
		} else {
			s = formataCEP (s,false);
			if (s != '') s = s.substr(0,5) + '-' + s.substr(5,3);
			return s
		}
	}


	function formataData(s,f) {

		if (!f) {
			while (s.indexOf("/") >=0) {s = s.replace("/","");}
			while (s.length < 8) {s = "0" + s;}
			if (s == "00000000") {s = ""};
			return s;
		} else {
			s = formataData (s,false);
			if (s != '') s = s.substr(0,2) + '/' + s.substr(2,2) + '/' + s.substr(4,4);
			return s
		}
	}


	/******************************************************************************
	 * Autor : Leandro Ferreira
	 * �ltima modifica��o :	29/08/2007
	 *
	 * Verifica a validade da data enquanto � digitada, insere as barras 
	 * automaticamente e, se for o caso, passa para o pr�ximo campo quando de uma
	 * data v�lida completamente preenchida
	 *
	 * Par�metros :
	 *      evento: evento, para se obter a tecla pressionada (sempre event)
	 *      obj:    campo a ser formatado (sempre this)
	 *      prox:   caso deseje um "autotab", indica o pr�ximo campo. Caso
	 *              contr�rio, passar null
	 *
	 * Exemplo : OnKeyUp="verificaData(event,this,document.financas.vardatafinal);"
	 ******************************************************************************/
	function verificaData (evento,obj,prox)
	{
		var c, res='';

		//Remove caracteres n�o num�ricos e n�o barra
		//Verifica o tamanho da string
		//Verifica o posicionamento das barras
		for (var i=0; i < obj.value.length; i++) {
			c = obj.value.charCodeAt(i);
			if ((c >= 48 && c <= 57) || (c == 47)) {
				if (!((c == 47) && ((i != 2) && (i != 5))) &&
					!((c != 47) && ((i == 2) || (i == 5)))) {

						if (res.length < 10) {
							res += String.fromCharCode(c);
						}
				}
			}
		}
		obj.value = res;

		//Insere as barras automaticamente
		if ((obj.value.length == 2 || obj.value.length == 5) && evento.keyCode != 8) {
			obj.value += '/';
		}

		//Verifica a validade da data...
		if (obj.value.length == 10) {
			if (isDate (obj.value)) {
				//...e, se for o caso, automaticamente
				//   vai para o pr�ximo campo
				if (prox) {
					prox.focus();
					return true;
				}
			} else {
				//Sen�o, informa que a data est� errada				
				//obj.select();
				return false;
			}
		}
	}

	function verEnter (frm) {
		return (window.event && window.event.keyCode == 13);
	}


	function soNumeros(campo) {
		var txt = campo.value;
		var s = "";

		for (var i = 0 ; i < txt.length ; i++) {
			if (txt.charAt(i) >= '0' && txt.charAt(i) <= '9') {
				s += txt.charAt(i);
			}
		}

		if (txt.length != s) {campo.value = s;}
	}



	//Fun��o que identifica se um campo que est� sendo digitado � CPF ou CNPJ
	function idCpfCnpj(valor) {

		if (validaCPF (formataCPF(valor,false))) {
			return 'CPF';
		} else if (validaCNPJ (formataCNPJ(valor,false))) {
			return 'CNPJ';
		}

		return '';
	}


	function getElementsByStyleClass (className) {

		var all = document.all ? document.all : document.getElementsByTagName('*');
		var elements = new Array();

		for (var e = 0; e < all.length; e++) {
			if (all[e].className.indexOf(className) >= 0) {
				elements[elements.length] = all[e];
			}
		}
		return elements;
}

function formatarMoeda(input) {
	let valor = input.value;

	// Remove todos os caracteres que não sejam dígitos ou vírgulas
	valor = valor.replace(/[^\d,]/g, '');

	// Se houver mais de uma vírgula, mantemos apenas a primeira e removemos as demais
	let partes = valor.split(',');
	if (partes.length > 2) {
		valor = partes[0] + ',' + partes.slice(1).join('');
	}

	// Atualiza o valor do input (sem completar a parte decimal durante a edição)
	input.value = valor;
}

function completarMoeda(input) {
	let valor = input.value;

	// Completa com zeros à direita se necessário
	if (valor.includes(',')) {
		let [inteiro, decimal] = valor.split(',');
		while (decimal.length < 3) {
			decimal += '0';
		}
		valor = inteiro + ',' + decimal.substring(0, 3);
	} else {
		valor += ',000';
	}

	// Atualiza o valor do input
	input.value = valor;
}

	function formataMoeda(objTextBox, SeparadorMilesimo, SeparadorDecimal, e) {
		//http://blog.zuntto.com/javascript-formatando-moeda-com-mascara/
		var sep = 0;
		var key = '';
		var i = j = 0;
		var len = len2 = 0;
		var strCheck = '0123456789';
		var aux = aux2 = '';
		var whichCode = (window.Event) ? e.which : e.keyCode;
		// 13=enter, 8=backspace as demais retornam 0(zero)
		// whichCode==0 faz com que seja possivel usar todas as teclas como delete, setas, etc

		if ((whichCode == 13) || (whichCode == 0) || (whichCode == 8))
			return true;
		key = String.fromCharCode(whichCode); // Valor para o c�digo da Chave

		if (strCheck.indexOf(key) == -1) 
			return false; // Chave inv�lida
		len = objTextBox.value.length;
		for(i = 0; i < len; i++)
			if ((objTextBox.value.charAt(i) != '0') && (objTextBox.value.charAt(i) != SeparadorDecimal)) 
				break;
		aux = '';
		for(; i < len; i++)
			if (strCheck.indexOf(objTextBox.value.charAt(i))!=-1) 
				aux += objTextBox.value.charAt(i);
		aux += key;
		len = aux.length;
		if (len == 0) 
			objTextBox.value = '';
		if (len == 1) 
			objTextBox.value = '0'+ SeparadorDecimal + '0' + aux;
		if (len == 2) 
			objTextBox.value = '0'+ SeparadorDecimal + aux;
		if (len > 2) {
			aux2 = '';
			for (j = 0, i = len - 3; i >= 0; i--) {
				if (j == 3) {
					aux2 += SeparadorMilesimo;
					j = 0;
				}
				aux2 += aux.charAt(i);
				j++;
			}
			objTextBox.value = '';
			len2 = aux2.length;
			for (i = len2 - 1; i >= 0; i--)
				objTextBox.value += aux2.charAt(i);
			objTextBox.value += SeparadorDecimal + aux.substr(len - 2, len);
		}
		return false;
	}

	function validaData (valor) {
		// Verifica se a entrada é uma string
		if (typeof valor !== 'string') {
		  return false
		}
	  
		// Verifica formado da data
		if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
		  return false
		}
	  
		// Divide a data para o objeto "data"
		const partesData = valor.split('/')
		const data = { 
		  dia: partesData[0], 
		  mes: partesData[1], 
		  ano: partesData[2] 
		}
		
		// Converte strings em número
		const dia = parseInt(data.dia)
		const mes = parseInt(data.mes)
		const ano = parseInt(data.ano)
		
		// Dias de cada mês, incluindo ajuste para ano bissexto
		const diasNoMes = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
	  
		// Atualiza os dias do mês de fevereiro para ano bisexto
		if (ano % 400 === 0 || ano % 4 === 0 && ano % 100 !== 0) {
		  diasNoMes[2] = 29
		}
		
		// Regras de validação:
		// Mês deve estar entre 1 e 12, e o dia deve ser maior que zero
		if (mes < 1 || mes > 12 || dia < 1) {
		  return false
		}
		// Valida número de dias do mês
		else if (dia > diasNoMes[mes]) {
		  return false
		}
		
		// Passou nas validações
		return true
	  }

	  function parseDataParaISO(data) {
		var partes = data.split('/');
		if (partes.length === 3) {
			// Verifica se há 3 partes (dia, mês, ano)
			var ano = partes[2];
			var mes = partes[1];
			var dia = partes[0];
			// Formata a data como "YYYY-MM-DD"
			return ano + '-' + mes + '-' + dia;
		} else {
			throw new Error('Formato de data inválido');
		}
	}