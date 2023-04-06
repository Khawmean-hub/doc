function isNull(str) {
    if(str == null || str == "" || str ==undefined)
        return true
    else
        return false
}


function hidelightCode() {
    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
}