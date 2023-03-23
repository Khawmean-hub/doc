//onload
$(document).ready(function () {
    $('.login_form').css("display", "none");
    //build Deparment combo box
    //check user
    var user = window.localStorage.getItem('b2b_user')
    
    if(isNull(user)){
        buildLogin()
    }else{
        buldHome()
    }

    // for test
    // if (getToken().role == 2) {
    //     buldHome();
    // } else if (isNull(user)) {
    //     buildLogin();
    // } else {
    //     // buldHome();
    // }
})


