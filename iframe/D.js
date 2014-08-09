window.onload = function() {
    var doc = document
    // var height = Math.max(document.documentElement.clientHeight, document.body.clientHeight)
    var height = Math.max(doc.documentElement.clientHeight, doc.body.clientHeight, doc.documentElement.scrollHeight, doc.body.scrollHeight)
    var myifr = document.getElementById('myifr')
    if (myifr) {
        myifr.src = 'http://snandy.github.io/lib/iframe/B.html?height=' + height
        console.log(doc.documentElement.scrollHeight)      
    }
};
