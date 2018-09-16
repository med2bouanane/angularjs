$(function () {
    $('.CaseCocheHistorique input:checkbox').click(function () {
        if ($(this).is(':checked')) {
            $('.CaseCocheHistorique input:checkbox').prop('checked', false);
            $(this).prop('checked', true);
        }
    });
});
