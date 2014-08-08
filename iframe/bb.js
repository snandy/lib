window.onload = function() {
    var height = Math.max(document.documentElement.clientHeight, document.body.clientHeight)
    var myifr = document.getElementById('myifr')
    if (myifr) {
        myifr.src = 'http://zgit.com/lib/i.html?height=' + height
        console.log(height)        
    }
};
