function isNull(str) {
    if(str == null || str == "" || str ==undefined)
        return true
    else
        return false
}

// Code color hidelight using https://highlightjs.org/
function hidelightCode() {
    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
}