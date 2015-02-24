//notification nav bar
$(document).ready(function () {
    $("#notificationLink").click(function () {
        $("#notificationContainer").fadeToggle(300);
        $("#notification_count").fadeOut("slow");
        return false;
    });


    $(document).click(function () {
        $("#notificationContainer").hide();
    });


    $("#notificationContainer").click(function () {
        return false;
    });

});
//header panel
var header = $('[data-role=header]').outerHeight();
var panel = $('.ui-panel').height();
var panelheight = panel - header;
$('.ui-panel').css({
    'top': header,
    'min-height': panelheight
});