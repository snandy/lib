window.onload = function() {
    var doc = document
    // var height = Math.max(document.documentElement.clientHeight, document.body.clientHeight)
    var height = Math.max(doc.documentElement.clientHeight, doc.body.clientHeight) +  Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
    var myifr = document.getElementById('myifr')
    if (myifr) {
        myifr.src = 'http://snandy.github.io/lib/iframe/B.html?height=' + height
        console.log(height)      
    }
};
