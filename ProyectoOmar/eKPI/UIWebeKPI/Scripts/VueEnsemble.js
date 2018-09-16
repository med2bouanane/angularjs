$(function () {
    $('input[name$="rblTypeCommande"]:radio').change(function () {
        if ($(this).val() == 1) {
            $('table[id$="rblIndicateurStandart"]').show();
            $('table[id$="rblIndicateursStock"]').hide();
        } else {
            $('table[id$="rblIndicateurStandart"]').hide();
            $('table[id$="rblIndicateursStock"]').show();
        }
    });
    if ($('input[name$="rblTypeCommande"]:radio:checked').val() == 1) {
        $('table[id$="rblIndicateurStandart"]').show();
        $('table[id$="rblIndicateursStock"]').hide();
    } else {
        $('table[id$="rblIndicateurStandart"]').hide();
        $('table[id$="rblIndicateursStock"]').show();
    }

    $('#btnRechercher').click(function () {
        //Récuprération des informations introduites dans le filtre
        var aIdSite = $('input[name$="rblSite"]:checked').val();
        var aTypeCommande = $('input[name$="rblTypeCommande"]:radio:checked').val();
        var aBlocageClient = $('input[name$="rblBlocageClient"]:radio').val();
        var aIndicateurInferieur, aIndicateurSuperieur;
        var aIndicateur;

        if (aTypeCommande == 1) {
            aIndicateur = $('input[name$="rblIndicateurStandart"]:radio:checked').next().text();
        }
        else {
            aIndicateur = $('input[name$="rblIndicateursStock"]:radio:checked').next().text();
        }

        aIndicateurInferieur = aIndicateur.split(";")[0].substr(1);
        aIndicateurSuperieur = aIndicateur.split(";")[1].substring(0, aIndicateur.split(";")[1].length - 1);

        //Création de l'url avec les paramètres récupérés depuis le filtre
        var aUrl = "../WebServices/eKPI.ashx?Mode=VueEnsemble&IDSite=" + aIdSite
                    + "&TypeCommande=" + aTypeCommande
                    + "&BlocageClient=" + aBlocageClient
                    + "&IndicateurInferieur=" + aIndicateurInferieur
                    + "&IndicateurSuperieur=" + aIndicateurSuperieur;

        var parametres = {};
        parametres.theIdSite = aIdSite;
        parametres.theTypeCommade = aTypeCommande;
        parametres.theInfoBlocageClient = aBlocageClient

        //Appel ajax
        $.ajax({
            type: "POST",
            url: "../WebServices/eKPI.asmx/ObtenirInfoVueEnsemble",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(parametres),
            dataType: 'json'
        })
        .done(function (data) {
            var aAccusesOK = {}, base, key;
            var aAccusesNOK = {}, base, key;
            var aObjectifsDeLivraison = {}, base, key;
            var aPourcentOK = {}, base, key;
            $.each(data.d, function (index, accuse) {
                key = accuse.DateSortieMoisAnnee;
                if (!aAccusesOK[key]) {
                    aAccusesOK[key] = 0;
                }
                if (!aAccusesNOK[key]) {
                    aAccusesNOK[key] = 0;
                }
                if (!aObjectifsDeLivraison[key]) {
                    aObjectifsDeLivraison[key] = 0;
                }

                if (accuse.IndicePerformance >= aIndicateurInferieur && accuse.IndicePerformance <= aIndicateurSuperieur) {
                    aAccusesOK[key] += 1;
                } else {
                    aAccusesNOK[key] += 1;
                }
            });

            var aLabels = [];
            var aOK = [];
            $.each(aAccusesOK, function (key, val) {
                //var aAccuse = {y: val, label: key};
                aOK.push(val);
                aLabels.push(key);
            });

            var aNOK = [];
            $.each(aAccusesNOK, function (key, val) {
                aNOK.push(val);
            });

            var aPourcentOK = [];
            $.each(aAccusesOK, function (key, val) {
                var aPourcent = (val / (val + aAccusesNOK[key])) * 100;
                aPourcentOK.push(parseFloat(aPourcent.toFixed(2)));
            });

            var aObjectifs = [];

            $.each(aNOK, function (index, val) {
                aObjectifs.push(null);
            });

            $.ajax({
                type: 'POST',
                async: false,
                url: '../WebServices/eKPI.asmx/ObtenirObjectifsLivraison',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(parametres),
                dataType: 'json'
            })
            .done(function (data) {
                if (aTypeCommande == 1) {
                    if (aIndicateur == "[-2;+0]") {
                        $.each(data.d, function (aIndex, aObjectif) {
                            $.each(aLabels, function (index, val) {
                                if (val == aObjectif.SemaineCreation) {
                                    for (i = index; i < aObjectifs.length; i++) {
                                        aObjectifs[i] = aObjectif.CommandeStandardMoinsDeuxPlusZero;
                                    }
                                }
                            });
                        });
                    }
                    else {
                        $.each(data.d, function (aIndex, aObjectif) {
                            $.each(data.d, function (aIndex, aObjectif) {
                                $.each(aLabels, function (index, val) {
                                    if (val == aObjectif.SemaineCreation) {
                                        for (i = index; i < aObjectifs.length; i++) {
                                            aObjectifs[i] = aObjectif.CommandeStandardMoinsDeuxPlusDeux;
                                        }
                                    }
                                });
                            });
                        });
                    }
                }
                else {
                    if (aIndicateur == "[-0;+0]") {
                        $.each(data.d, function (aIndex, aObjectif) {
                            $.each(data.d, function (aIndex, aObjectif) {
                                $.each(aLabels, function (index, val) {
                                    if (val == aObjectif.SemaineCreation) {
                                        for (i = index; i < aObjectifs.length; i++) {
                                            aObjectifs[i] = aObjectif.CommandePackMoinsZeroPlusZero;
                                        }
                                    }
                                });
                            });
                            aObjectifs.push(aObjectif.CommandePackMoinsZeroPlusZero);
                        });
                    }
                    else {
                        $.each(data.d, function (aIndex, aObjectif) {
                            $.each(data.d, function (aIndex, aObjectif) {
                                $.each(aLabels, function (index, val) {
                                    if (val == aObjectif.SemaineCreation) {
                                        for (i = index; i < aObjectifs.length; i++) {
                                            aObjectifs[i] = aObjectif.CommandePackMoinsZeroPlusUn;
                                        }
                                    }
                                });
                            });
                        });
                    }
                }
            })
            .fail(function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            });

            ChargerGraphique(aLabels, aOK, aNOK, aPourcentOK, aObjectifs);
        })
        .fail(function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        });
    });
});
			
function ChargerGraphique(labels ,accuseOK, accuseNOK, pourcentageOK, objectifsLivraison) {
	Highcharts.dateFormats = {
		W: function (timestamp) {
			var date = new Date(timestamp);
			var onejan = new Date(date.getFullYear(), 0, 1);
			var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

			var dayOfYear = ((today - onejan + 86400000) / 86400000);

			return Math.ceil(dayOfYear / 7);

		}
	};

	Highcharts.setOptions({
		colors: ["#ff3700", "#42A07B", "#9B5E4A", "#72727F", "#82914E", "#12E3f0", "#fcf645", "#c8e3b9", "#a498d6", "#cd3773", "#595fd5", "#1F949A", "#c393d6", "#964d8a", "#964d8a", "#eebe62", "#0bd2be", "#86777F", "#fc4f1a", "#e75532", "#cf0f4c", "#de4069", "#df7fa8", "#bf112f", "#110263", "#d7fa7a", "#48307d", "#48307d", "#65b294", "#2b5f0a", "#073baa", "#f4ef76", "#c6a0b1", "#af6131", "#2f32e9", "#42cd0a", "#6d3a6d", "#ba68ee", "#839396", "#dff4ad", "#1b1372", "#acab8e", "#93fd48", "#22a265", "#e76ae2", "#e69a42", "#6b58d2", "#c3906a", "#4070f0", "#38cc5c", "#c6daef", "#b468ec", "#9c3e69", "#60cb39", "#e6be7e", "#62d8e5", "#25712b", "#503804", "#6752c5", "#9d9706", "#7f9f9c", "#a9edb3", "#ce0f46", "#07828d", "#ababde", "#718de1", "#7d348e", "#fdc2a6", "#fdc2a6", "#4b08d2"]
	});

	$('#graphique').highcharts( {
		exporting: {
			enabled: false
		},
		chart: {
			type: 'column',
			zoomType: 'x'
		},
        title: {
            text: ''
        },
		credits: {
			enabled: false
		},
		xAxis: {
			categories: labels,
			labels: {
			    align: 'right',
			    rotation: -45,
			    y: 35,
			    align: 'center'
			}
		},
		yAxis: [{
				gridLineWidth: 0,
				opposite: false,
				title: {
					x:15,
					rotation: -90,
					text: 'Nombre de commandes'
				},
				labels: {
					x: 10,
					y: 5,
					format: '{value:.,0f}'
				},
				showFirstLabel: false
			},{
				gridLineWidth: 1,
				opposite: true,
				title: {
					text: 'Pourcentage OK'
				},
				labels: {
					x: 0,
					y: 5,
					format: '{value:.,0f}'
				},
				showFirstLabel: false
			}],
		tooltip: {
			crosshairs: true,
			formatter: function() {
				return this.series.name + ' : <b>' + this.y + '</b>';
			}
		},
		labels: {
			items: [{
				html: '',
				style: {
					left: '50px',
					top: '18px',
					color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
				}
			}]
		},
		plotOptions: {
			column: {
				stacking: 'normal'
			}
		},
		series: [{
			type: 'column',
			name: 'NOK [-2;+0]',
			data: accuseNOK
		}, {
			type: 'column',
			name: 'OK [-2;+0]',
			data: accuseOK
		}, {
			type: 'line',
			yAxis: 1,
			name: 'Objectif',
			data: objectifsLivraison,
			marker: {
				enabled: false
			}
		}, {
			type: 'spline',
			yAxis: 1,
			name: '% OK',
			data: pourcentageOK,
			marker: {
				enabled: false
			}
		}]
	});
}