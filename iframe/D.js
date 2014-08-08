window.onload = function() {
    var height = Math.max(document.documentElement.clientHeight, document.body.clientHeight)
    var myifr = document.getElementById('myifr')
    if (myifr) {
        myifr.src = 'http://snandy.github.io/lib/iframe/B.html?height=' + height
        console.log(height)      
    }
};
