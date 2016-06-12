// fail/reject 示例
function cb() {
    alert('fail')
}
var deferred = $.Deferred()
deferred.fail(cb)
setTimeout(function() {
    deferred.reject()
}, 3000)


// done/resolve 示例
function cb() {
    alert('success')
}
var deferred = $.Deferred()
deferred.done(cb)
setTimeout(function() {
    deferred.resolve()
}, 3000)


