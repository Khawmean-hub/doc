// onload
$(document).ready(function () {
    $(".page-login").hide();
    $(".my_body").hide();
    // build Deparment combo box
    // check user
    var user = window.localStorage.getItem('b2b_user');
        
    if(isNull(user)){
        buildLogin();
        $("#loginForm").show();
    }else{
        buldHome();
        
    }
})


