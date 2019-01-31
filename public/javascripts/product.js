$(function() {

    /*$(document).on('copy', '.container', function(e) { copyToClipboard(); return false; });
    $(document).on('cut', '.container', function(e) { copyToClipboard(); return false; });*/

    document.addEventListener('copy', addLink);

    $(document).on('click', '.img_small_list', function() {
        $('.img_small_list.active').removeClass('active');
        $(this).addClass('active');
        $('#img_main').attr('src', $(this).attr('src').replace('100x100', '500x500'));
    });
    $('.numberFormat').each(function() {
        var number = $(this).attr('data-value');
        $(this).html(numberWithCommas(number));
    });
    $(window).scroll(function() {
        var a = $('#scroll-top').find('a');
        if ($(this).scrollTop() > 250) {
            a.fadeIn(200);
        } else {
            a.fadeOut(200);
        }
    });
    $('#scroll-top').click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 1000);
        return false;
    });
});
