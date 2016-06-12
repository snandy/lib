// 示例4：链式调用
function status(response) {  
  if (response.status >= 200 && response.status < 300) {  
    return Promise.resolve(response)  
  } else {  
    return Promise.reject(new Error(response.statusText))  
  }  
}

function json(response) {  
  return response.json()  
}

fetch('doAct.action')  
  .then(status)  
  .then(json)  
  .then(function(data) {  
    console.log('Request succeeded with JSON response', data);  
  }).catch(function(error) {  
    console.log('Request failed', error);  
  });


// 示例3 取HTTP头信息
fetch('doAct.action').then(function(response) {  
    console.log(response.headers.get('Content-Type'));  
    console.log(response.headers.get('Date'));

    console.log(response.status);  
    console.log(response.statusText);  
    console.log(response.type);  
    console.log(response.url);  
});

// 示例2 fetch 第二个参数有更多可选配置
fetch("doAct.action", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "keyword=荣耀7i&enc=utf-8&pvid=0v3w1kii.bf1ela"
}).then(function(res) {
    if (res.ok) {
        // To do with res
    } else if (res.status == 401) {
        // To do with res
    }
}, function(e) {
    // Handling errors
});

// fetch API 最简单示例
fetch('doAct.action').then(function(res) {
    if (res.ok) {
        res.text().then(function(obj) {
            // Get the plain text
        });
    }
}, function(ex) {
    console.log(ex);
});

// 方式1
$.ajax(url, {
    data: {},
    dataType: 'jsonp',
    success: function() {
        //...
    }
});

// 方式2
$.getJSON(url + '&callback=?', data, function(json) {
    // todo with json
});


var script = document.createElement('script');

script.src = url + 'callback=xxx';

script.onload = function() {
    success();
};

script.onerror = function() {
    failure();
};

document.head.appendChilid(script);





$.ajax(url, {
    accepts:
    async:
    beforeSend:
    cache:
    complete:
    contents:
    contentType:
    context:
    converters:
    crossDomain:
    data:
    dataFilter:
    dataType:
    error:
    global:
    headers:
    ifModified:
    isLocal:
    jsonp:
    jsonpCallback:
    method:
    mimeType:
    password:
    processData:
    scriptCharset:
    statusCode:
    success:
    timeout:
    traditional:
    type:
    username:
    xhr:
    xhrFields:
});