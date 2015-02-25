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
