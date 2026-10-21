function resizeDiv(divgrafico) {
    var $content = $('#' + divgrafico);
    var originalWidth = $content.width(); // Largura original em pixels
    var newWidth = originalWidth * 0.99; // Diminuir 1%

    $content.width(newWidth); // Aplicar nova largura

    // Restaurar o tamanho original após 1 segundo (1000 ms)
    setTimeout(function() {
        $content.width(originalWidth);
    }, 1000);
}

function hslToHex(h, s, l) {
    // Converte HSL para RGB
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // Cinza quando a saturação é 0
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    // Converte RGB para hexadecimal
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return hexColor.toUpperCase();
}

function getSeries(REGISTROS) {

	var array = [];
	$.each(REGISTROS, function(index, item) {
		array.push(parseInt(item.TOTAL, 10));
	});

    return array;

}

function getItensSeries(REGISTROS,cores,total){
	var itemserie = "";
	var i = 0;
	$.each(REGISTROS, function(index, item) {
		itemserie += '<div class="color-picker">';
		itemserie += ' <p class="mb-0  text-gray">';
		itemserie += '  <svg class="me-2" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">';
		itemserie += '  <rect width="14" height="14" rx="4" fill="' + cores[i] +'"></rect>';
		itemserie += '  </svg><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">';

		if (total > 0){
			percentassinado = Math.round((item.TOTAL / total) * 100);
		}

		itemserie += '  ' + item.DESCRICAO + ' (' + percentassinado + '%)';
		itemserie += '  </font></font></p>';
		itemserie += ' <h6 class="mb-0"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">'+ item.TOTAL +'</font></font></h6>';
		itemserie += '</div>';
		i++;
	});
	
	return '<h6><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Grupo Detalhe</font></font></h6>' + itemserie;
}

function getTotal(REGISTROS) {

	var total = 0;
	$.each(REGISTROS, function(index, item) {
		total += parseInt(item.TOTAL, 10);
	});

    return total;

}


function generateColorArray(numOfRecords) {
    let colorArray = [];
    const hueStep = 360 / numOfRecords;

    for (let i = 0; i < numOfRecords; i++) {
        const hue = (i * hueStep) % 360;
        const saturation = 70 + (i % 2) * 15; // Alterna entre 70% e 85% de saturação
        const lightness = 50 + (i % 2) * 10; // Alterna entre 50% e 60% de luminosidade
        const hexColor = hslToHex(hue / 360, saturation / 100, lightness / 100);
        colorArray.push(hexColor);
    }

    return colorArray;
}


var dlabChartlist = function() {
    var pieChartAssinado = function(seriesassinados, coresassinados) {
        var options = {
            redrawOnParentResize: true,
            series: seriesassinados,
            chart: {
                type: 'donut',
                height: 200,
                innerRadius: 50,
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 0,
            },
            plotOptions: {
                pie: {
                    startAngle: 0,
                    endAngle: 360,
                    donut: {
                        size: '80%',
                    },
                },
            },
            colors: coresassinados,
            legend: {
                position: 'bottom',
                show: false
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        width: 200
                    },
                }
            }]
        };

        var renderPieChartAssinado = new ApexCharts(document.querySelector("#pieChartAssinado"), options);        
        renderPieChartAssinado.render();
        resizeDiv('divGraficoAssinado');
    }

    var pieChartNaoAssinado = function(seriesnaoassinados, coresnaoassinados) {
        var options = {
            redrawOnParentResize: true,
            series: seriesnaoassinados,
            chart: {
                type: 'donut',
                height: 200,
                innerRadius: 50,
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 0,
            },
            plotOptions: {
                pie: {
                    startAngle: 0,
                    endAngle: 360,
                    donut: {
                        size: '80%',
                    },
                },
            },
            colors: coresnaoassinados,
            legend: {
                position: 'bottom',
                show: false
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        width: 200
                    },
                }
            }]
        };

        var renderPieChartNaoAssinado = new ApexCharts(document.querySelector("#pieChartNaoAssinado"), options);        
        renderPieChartNaoAssinado.render();
        resizeDiv('divGraficoNaoAssinado');
    }

    var pieChartRejeitado = function(seriesrejeitados, coresrejeitados) {
        var options = {
            series: seriesrejeitados,
            redrawOnParentResize: true,
            chart: {
                type: 'donut',
                height: 200,
                innerRadius: 50,
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 0,
            },
            plotOptions: {
                pie: {
                    startAngle: 0,
                    endAngle: 360,
                    donut: {
                        size: '80%',
                    },
                },
            },
            colors: coresrejeitados,
            legend: {
                position: 'bottom',
                show: false
            },
            responsive: [{
                breakpoint: 768,
                options: {
                    chart: {
                        width: 200
                    },
                }
            }]
        };

        var renderPieChartRejeitado = new ApexCharts(document.querySelector("#pieChartRejeitado"), options);        
        renderPieChartRejeitado.render();
        resizeDiv('divGraficoRejeitado');
    }

    var ConsultaDadosConsolidados = function() {
        // Construir os dados a serem enviados no corpo da requisição
        var dados = {
            funcao: 'getcardsgraficoconsolidado',
            empresa: $('#selEmpresa').val(),
            navio: $('#selNavio').val(),
            tipoid: $('#selTipoID option:selected').text(),
            tipodetalheid: $('#selDetalheTipoID option:selected').text(),
            datainicio: $('#inputDataInicio').val(),
            datatermino: $('#inputDataTermino').val(),
            token: $('#csrf_token').val()
        };

        blockid('divGraficoAssinado');
        blockid('divGraficoNaoAssinado');
        blockid('divGraficoRejeitado');

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: dados, // Enviar os dados no corpo da requisição
            success: function(data) {

                if (data.ERRO === "Token Expirado") {
                    window.location.href = 'login.asp';
                    return;
                }

                try {

                var registrosassinados = JSON.parse(data.REGISTROASSINADO);
                var registrosnaoassinados = JSON.parse(data.REGISTRONAOASSINADO);
                var registrosrejeitados = JSON.parse(data.REGISTROREJEITADO);
                var registrositensassinados = JSON.parse(data.REGISTROITEMASSINADO);
                var registrositensnaoassinados = JSON.parse(data.REGISTROITEMNAOASSINADO);
                var registrositensrejeitados = JSON.parse(data.REGISTROITEMREJEITADO);

                var seriesassinados = getSeries(registrosassinados.REGISTROS);
                var seriesnaoassinados = getSeries(registrosnaoassinados.REGISTROS);
                var seriesrejeitados = getSeries(registrosrejeitados.REGISTROS);
                var coresassinados = generateColorArray(registrosassinados.REGISTROS.length);
                var coresnaoassinados = generateColorArray(registrosnaoassinados.REGISTROS.length);
                var coresrejeitados = generateColorArray(registrosrejeitados.REGISTROS.length);
                var totalassinado = getTotal(registrosassinados.REGISTROS);
                var totalnaoassinado = getTotal(registrosnaoassinados.REGISTROS);
                var totalrejeitado = getTotal(registrosrejeitados.REGISTROS);

                pieChartAssinado(seriesassinados, coresassinados);
                pieChartNaoAssinado(seriesnaoassinados, coresnaoassinados);
                pieChartRejeitado(seriesrejeitados, coresrejeitados);
                
                $('#divitemassinado').html(getItensSeries(registrositensassinados.REGISTROS, coresassinados, totalassinado));
                $('#divitemnaoassinado').html(getItensSeries(registrositensnaoassinados.REGISTROS, coresnaoassinados, totalnaoassinado));
                $('#divitemrejeitado').html(getItensSeries(registrositensrejeitados.REGISTROS, coresrejeitados, totalrejeitado));

                $('#divGraficoAssinado').unblock();
                $('#divGraficoNaoAssinado').unblock();
                $('#divGraficoRejeitado').unblock();
                }
                catch{
                    $('#divGraficoAssinado').unblock();
                    $('#divGraficoNaoAssinado').unblock();
                    $('#divGraficoRejeitado').unblock();
                }

            },
            error: function(xhr, status, error) {
                // Tratar erros de requisição
            }
        });
    }

    // Retornar métodos públicos
    return {
        load: ConsultaDadosConsolidados
    };

}();

