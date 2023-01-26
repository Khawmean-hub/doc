function isNull(str){
    if(str === null || str === undefined || str === ''){
       return true;
    }else {
        return false;
    }
}

function defaulEmpty(str){
    if(str != null && str != undefined && str != ''){
        return str;
     }else {
         return '';
     }
}

function defaultPageInput(req){
    if(isNull(req.body.OFFSET)){
        req.body.OFFSET = 1;
    }
    if(isNull(req.body.LIMIT)){
        req.body.LIMIT = 10;
    }
}




var strUtils = {defaulEmpty, isNull, defaultPageInput}

module.exports = strUtils;