//notification nav bar

    
$(document).ready(function () {
    $("#notificationLink").click(function () {
        $("#notificationContainer").fadeToggle(300);
    });
    $(document).click(function () {
        $("#notificationContainer").hide();
    });
    $("#notificationContainer").click(function () {
        return false;
    });

});
$(document).ready(function () {
    $("#searchButton").click(function () {
        $("#notificationCo").fadeToggle(300);
    });
    $(document).click(function () {
        $("#notificationCo").hide();
    });
    $("#notificationCo").click(function () {
        return false;
    });

});