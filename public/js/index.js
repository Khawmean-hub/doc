//onload
$(document).ready(function () {
   
    //build Deparment combo box
    //check user
    var user = window.localStorage.getItem('b2b_user');
    

    
    if(isNull(user)){
        buildLogin()
    }else{
        buldHome()
    }

    
})


