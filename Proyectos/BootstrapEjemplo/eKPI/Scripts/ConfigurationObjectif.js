$(function () {
    $('#btnAfficherDetailHistorique').click(function () {
        if ($('.CaseCocheHistorique input:checkbox:checked').length = 1) {
            var url = "../Administration/AfficherHistoriqueObjectifLivraison.aspx?IdConfigurationObjectifLivraison=" + $('.CaseCocheHistorique input:checkbox:checked').parent().parent().find('input:hidden').val();
            jQuery().colorbox({ iframe: true, width: "1100px", height: "90%", href: url, fastIframe: false });
        }
    });
}); 