/**
 * 后台返回JSON格式
 * 需严格遵循
 */
var jsonObj = {
    goods: {
        name: '短袖T恤 男\n2013...',
		goods_src: 'goods.jpg',
		goods_pic_src:'http://baidu.com'
    },
    origin: [{
        name: '直通车 PV:2032',
        percent: '50.84%',
        where: [{
            name: '退出本店 PV：75',
            percent: '78.12%'
        }, {
            name: '到本店其它页面 PV：13',
            percent: '13.54%'
        }, {
            name: '到收藏页 PV：8',
            percent: '13.54%'
        }]
    }, {
        name: '直接访问 PV:20',
        percent: '13.41%',
        where: [{
            name: '退出本店 PV：85',
            percent: '91.2%'
        }, {
            name: '到本店其它页面 PV：15',
            percent: '13.54%'
        }]
    }, {
        name: '首页 PV:20',
        percent: '6.15%',
        where: [{
            name: '退出本店 PV：75',
            percent: '78.12%'
        }, {
            name: '到本店其它页面 PV：13',
            percent: '13.54%'
        }, {
            name: '到收藏页 PV：8',
            percent: '13.54%'
        }, {
            name: '到人民网 PV: 3',
            percent: '4.3%'
        }]
    }, {
        name: '店铺收藏 PV:20',
        percent: '4.47%',
        where: [{
            name: '到收藏页 PV：89',
            percent: '87.4%'
        }]
    }, {
        name: '淘宝站内其它 PV:20',
        percent: '4.47%',
        where: [{
            name: '到本店其它页面 PV：13',
            percent: '23.54%'
        }]
    }, {
        name: '宝贝收藏 PV:20',
        percent: '3.91%',
        where: [{
            name: '退出本店 PV：95',
            percent: '88.12%'
        }]
    }]
}

~function(window) {

/**
 * imgLine.origin: 10个来源线
 * imgLine.where: 5个去向线
 */
var imgLine = {
    origin: [{
        x: 241,
        y: 100,
        w: 235,
        h: 23,
        trans: 'r55,t0,40'
    }, {
        x: 210,
        y: 140,
        w: 235,
        h: 23,
        trans: 'r35,t0,30'     
    }, {
        x: 170,
        y: 168,
        w: 235,
        h: 23,
        trans: 'r15,t0,30'     
    }, {
        x: 170,
        y: 188,
        w: 235,
        h: 23,
        trans: 'r-3,t-15,40'     
    }, {
        x: 172,
        y: 210,
        w: 235,
        h: 23,
        trans: 'r-15,t-15,60'     
    }, {
        x: 180,
        y: 230,
        w: 235,
        h: 23,
        trans: 'r-30,t-30,60'     
    }, {
        x: 185,
        y: 250,
        w: 235,
        h: 23,
        trans: 'r-40,t-30,60'     
    }, {
        x: 170,
        y: 280,
        w: 235,
        h: 23,
        trans: 'r-60,t-30,60'     
    }, {
        x: 175,
        y: 285,
        w: 235,
        h: 23,
        trans: 'r-73,t-40,70'     
    }, {
        x: 205,
        y: 295,
        w: 235,
        h: 23,
        trans: 'r-80,t-40,60'     
    }],
    where: [{
        x: 450,
        y: 190,
        w: 197,
        h: 20,
        trans: 'r-30,t-5,-55'
    }, {
        x: 420,
        y: 200,
        w: 197,
        h: 20,
        trans: 'r-15,t20,-10'       
    }, {
        x: 420,
        y: 240,
        w: 197,
        h: 20,
        trans: 'r0,t20,-10'    
    }, {
        x: 420,
        y: 270,
        w: 197,
        h: 20,
        trans: 'r10,t15,-10'    
    }, {
        x: 410,
        y: 305,
        w: 197,
        h: 20,
        trans: 'r28,t10,-8'    
    }]
}



/**
 * 商品图（中心圆）1个
 *
 */
var staticDoods = {
    x: 400,
    y: 230,
    r: 55,
    option: {
        fill: '#bfdcf7'
    },
    textOption: {
        fill: '#000', 
        'font-size': 12
    }
}

/**
 * 来源图（圆形） 共计10个
 *
 */
var staticOriginData = [{
    circleX: 254,
    circleY: 41,
    radius: 37,
    nameX: 155,
    nameY: 41,
    percentX: 254,
    percentY: 41,
    option: {
        fill: '#9edffc'
    }
}, {
    circleX: 200,
    circleY: 105,
    radius: 35,
    nameX: 109,
    nameY: 105,
    percentX: 200,
    percentY: 105,
    option: {
        fill: '#ff9291'
    }
}, {
    circleX: 168,
    circleY: 177,
    radius: 29,
    nameX: 78,
    nameY: 177,
    percentX: 168,
    percentY: 177,
    option: {
        fill: '#c8e274'
    }
}, {
    circleX: 165,
    circleY: 248,
    radius: 26,
    nameX: 72,
    nameY: 248,
    percentX: 165,
    percentY: 248,
    option: {
        fill: '#fdeb86',
    }
}, {
    circleX: 181,
    circleY: 310,
    radius: 25,
    nameX: 95,
    nameY: 310,
    percentX: 181,
    percentY: 310,
    option: {
        fill: '#ff9291'
    }
}, {
    circleX: 204,
    circleY: 360,
    radius: 23,
    nameX: 123,
    nameY: 360,
    percentX: 204,
    percentY: 360,
    option: {
        fill: '#9dddfb'
    }
}, {
    circleX: 239,
    circleY: 400,
    radius: 19,
    nameX: 154,
    nameY: 400,
    percentX: 239,
    percentY: 400,
    option: {
        fill: '#c8e274'
    }
}, {
    circleX: 277,
    circleY: 431,
    radius: 18,
    nameX: 196,
    nameY: 429,
    percentX: 277,
    percentY: 431,
    option: {
        fill: '#fbe985'
    }
}, {
    circleX: 316,
    circleY: 449,
    radius: 16,
    nameX: 245,
    nameY: 466,
    percentX: 316,
    percentY: 449,
    option: {
        fill: '#fe9190'
    }
}, {
    circleX: 356,
    circleY: 459,
    radius: 13,
    nameX: 360,
    nameY: 481,
    percentX: 356,
    percentY: 459,
    option: {
        fill: '#c5df71'
    }
}]


/**
 * 去向图（圆形） 共计5个
 *
 */
var staticWhereData = [{
    circleX: 590,
    circleY: 110,
    radius: 29,
    nameX: 679,
    nameY: 110,
    percentX: 590,
    percentY: 110,
    option: {
        fill: '#c3dffb'
    }    
}, {
    circleX: 611,
    circleY: 176,
    radius: 27,
    nameX: 707,
    nameY: 176,
    percentX: 611,
    percentY: 176,
    option: {
        fill: '#c3dffb'
    }    
}, {
    circleX: 623,
    circleY: 237,
    radius: 24,
    nameX: 712,
    nameY: 237,
    percentX: 623,
    percentY: 237,
    option: {
        fill: '#c3dffb'
    }    
}, {
    circleX: 620,
    circleY: 295,
    radius: 23,
    nameX: 711,
    nameY: 295,
    percentX: 620,
    percentY: 295,
    option: {
        fill: '#c3dffb'
    }    
}, {
    circleX: 600,
    circleY: 349,
    radius: 20,
    nameX: 684,
    nameY: 349,
    percentX: 600,
    percentY: 349,
    option: {
        fill: '#c3dffb'
    }    
}]

var rad = Math.PI / 180
var originLine = 'arrow-come.gif'
var whereLine = 'arrow-go.gif'

var dataOrigin = mixArray(staticOriginData, jsonObj.origin)
var dataWhere = staticWhereData

/**
 * 将from数组中元素的属性都拷贝到对应的dest里去
 * var dest = [{name: "John"}, {name: "Backus"}]
 * var from = [{age: 30}, {age: 99}]
 * mixArray(dest, from) // [{name: 'John', age: 30}, {name: 'Backus', age: 99}]
 */
function mixArray(dest, from) {
    for (var i = 0; i < dest.length; i++) {
        var otherObj = from[i]
        for (var attr in otherObj) {
            dest[i][attr] = otherObj[attr]
        }
    }
    return dest
}

// Iterator
function forEach(obj, iterator, context) {
    if (obj == null) return
    if (obj.length === +obj.length) {
        for (var i = 0; i < obj.length; i++) {
            if (iterator.call(context||obj[i] , obj[i], i, obj) === true) return
        }
    } else {
        for (var k in obj) {
            if (iterator.call(context||obj[k], obj[k], k, obj) === true) return
        }
    }
}

// Return the results of applying the iterator to each element
function map(obj, iterator, context) {
    var results = []
    if (obj == null) return results    
    forEach(obj, function(val, i, coll) {
        results[i] = iterator.call(context, val, i, coll)
    })
    return results
}

/**
 * @class GoodsGraph
 * @param {Object} option
 */
function GoodsGraph(option) {
	// 画图参数
    this.paperWidth = option.paperWidth || 940
    this.paperHeight = option.paperHeight || 587
    
    // 底图参数
    this.bottomMapRadius = option.bottomMapRadisu || 230
    this.bottomMapFill = option.bottomMapFill || '#f0f0f0'
	this.bottomMapCenter = option.bottomMapCenter || {x: 400, y: 230}
	
	// 后台数据
    this.data = option.data || {}
    
    // 图容器
    this.elem = option.elem || document.body
    
    // 画布对象
    this.paper = Raphael(this.elem, this.paperWidth, this.paperHeight)

    // 来源线 10条
    this.lineOrigin = []
    // 去向线 5条
    this.lineWhere = []
    // 去向对象，包含文字，百分比对象
    this.circleWhere = []

    // 初始化函数
    this.init()
}
GoodsGraph.prototype = {
    init: function() {
        // 底图
        this.renderBottomMap()

        // 连接线
        this.renderConnectLine()

        // 来源
        this.renderOrigin()

        // 去向
        this.renderWhere()

        // 商品
        this.renderGoods()
		  // 默认显示第一条
        this._show(0)
    },
    
    /**
     * 底图 渲染函数
     * 中心点、半径，填充可在new时配置
     */
    renderBottomMap: function() {
        var x = this.bottomMapCenter.x
        var y = this.bottomMapCenter.y
       	var fill = this.bottomMapFill
        var radius = this.bottomMapRadius
        this.circle(x, y, radius, {fill: fill, stroke: 'none'})
    },
    
    /**
     * 商品 渲染函数
     * 1) 中心点与底图一致
     * 2) 半径，填充可在new时配置
     */
    renderGoods: function() {
        var x = staticDoods.x
        var y = staticDoods.y
        var goods = this.circle(x, y, staticDoods.r, staticDoods.option)

        // 商品描述
        var txt = this.paper.text(x, y+35, jsonObj.goods.name)
        txt.attr(staticDoods.textOption)
		txt.attr('cursor','pointer');
		txt.click(function (e) 
				{
					window.open(jsonObj.goods.goods_pic_src, "_blank" )
				});				
		var renderGoods_image = this.paper.image(jsonObj.goods.goods_src,x-25, y-35, 50,50)	
		renderGoods_image.attr('cursor','pointer');
		renderGoods_image.click(function (e) 
				{
					 window.open(jsonObj.goods.goods_pic_src, "_blank" )
				});
        
    },
    
    /**
     * 连接线 渲染函数
     *  
     */
    renderConnectLine: function() {
        // 画来源线
        forEach(imgLine.origin, function(obj, i) {
            var originImg = this.image(originLine, obj.x, obj.y, obj.w, obj.h, obj.option, obj.trans)
            originImg.hide()
            this.lineOrigin[i] = originImg
        }, this)

        // 画去向线
        forEach(imgLine.where, function(obj, i) {
            var whereImg = this.image(whereLine, obj.x, obj.y, obj.w, obj.h, obj.option, obj.trans)
            whereImg.show()
            this.lineWhere[i] = whereImg
        }, this)
		 
    },

    /**
     * 渲染商品来源(10个圆)
     */
    renderOrigin: function() {
        forEach(dataOrigin, function(obj, i) {
            this._origin(obj, i)
        }, this)
    },
    
    _origin: function(obj, i) {
        obj.option.cursor = 'pointer'
        var origin = this.circle(obj.circleX, obj.circleY, obj.radius, obj.option)

        // 名称
        var name = this.paper.text(obj.nameX, obj.nameY, obj.name)
        name.attr({'font-size': 12})

        // 百分比
        var percent = this.paper.text(obj.percentX, obj.percentY, obj.percent)

        // 点击事件
        var self = this
        var clickHandler = function(i) {
            return function() {
                self._show(i)
            }
        }(i)
        origin.click(clickHandler)
    },

    /**
     * 渲染商品去向（5个圆）
     * 圆的文字及百分比暂时默认，点击后填充
     */
    renderWhere: function() {
        forEach(dataWhere, function(obj) {
            this._where(obj)
        }, this)
    },
    
    _where: function(obj) {
        var whereObj = this.circle(obj.circleX, obj.circleY, obj.radius, obj.option)

        // 名称
        var nameObj = this.paper.text(obj.nameX, obj.nameY, 'name')
        nameObj.attr({'font-size': 12})
        
        // 百分比
        var percentObj = this.paper.text(obj.percentX, obj.percentY, 'percent')
        percentObj.attr({fill: '#000'})

        this.circleWhere.push({
            where: whereObj,
            name: nameObj,
            percent: percentObj
        })

        whereObj.show()
        nameObj.hide()
        percentObj.hide()

        // var node = nameObj.node;
        // var tspan = node.getElementsByTagName('tspan')
        // console.log(node.getElementsByTagName('textpath')[0].string)
    },

    /**
     * 设置文本内容
     * svg 是tspan, vml 是textpath
     */
    _setText: function(textObj, str) {
        var elems = null
        var node = textObj.node
        var arr = str.split('\n')

        // FF/Chrome/Safari/IE9+
        if (Raphael.svg) {
            elems = node.getElementsByTagName('tspan')
            forEach(arr, function(s, i) {
                var tspan = elems[i]
                while (tspan.firstChild) {
                    tspan.removeChild(tspan.firstChild)
                }
                var txt = document.createTextNode(s)
                tspan.appendChild(txt)
            })
        // IE9-
        } else {
            elems = node.getElementsByTagName('textpath')
            elems[0].string = str
        }

        // console.log('----------------------')
    },

    showFirst: function() {
        this._show(0)
    },

    /**
     * 显示连接线，根据来源的索引 （共计10个来源）
     *
     */
    _show: function(index) {
        this._hide()

        var obj = jsonObj.origin[index]
        var whereNum = obj.where.length
        this.lineOrigin[index].show()

        // 连接线
        var lineWhere = this.lineWhere.slice(0, whereNum)
        forEach(lineWhere, function(obj, i) {
            obj.show()
            this.lineWhere[i].show()
        }, this)

        // 去向
        var dataWhere = obj.where
        forEach(dataWhere, function(obj, i) {
            var cw = this.circleWhere[i]
            cw.where.show()
            cw.name.show()
            cw.percent.show()
            this._setText(cw.name, obj.name)
            this._setText(cw.percent, obj.percent)
        }, this)

    },

    /**
     * 隐藏所有的连接线，包括10条来源线，5条去向线
     *
     */
    _hide: function() {
        forEach(this.lineOrigin, function(obj) {
            obj.hide()
        })
        forEach(this.lineWhere, function(obj) {
            obj.hide()
        })
        forEach(this.circleWhere, function(obj) {
            obj.where.hide()
            obj.name.hide()
            obj.percent.hide()
        })
    },

    /**
     * 画圆接口
	 * @param {Number} cx 坐标 x
	 * @param {Number} cy 坐标 y
	 * @param {Number} r 扇形半径
	 * @param {Object} 配置参数 {fill: '#d8d8d8', stroke: 'none'}
	 * 
     */
    circle: function(x, y, r, option) {
        if (!option.stroke) {
            option.stroke = 'none'
        }
        var c = this.paper.circle(x, y, r)
        c.attr(option)
        return c
    },
    
    /**
     * 画矩形 
	 * @param {Number} cx 坐标 x
	 * @param {Number} cy 坐标 y
	 * @param {Number} w 宽度
	 * @param {Number} h 高度
	 * @param {Object} 配置参数 {fill: '#d8d8d8', stroke: 'none'}
	 * @param {String} 变换  'r40,t0,10'
     */
    rect: function(x, y, w, h, option, trans) {
        var r = this.paper.rect(x, y, w, h)
        r.attr(option)
        r.transform(trans)
        return r
    },

	/**
	 * 画扇形
	 * @param {Number} cx 坐标 x
	 * @param {Number} cy 坐标 y
	 * @param {Number} r 扇形半径
	 * @param {Number} startAngle 开始弧度 
	 * @param {Number} endAngle 结束弧度
	 * @param {Object} params 配置参数  {fill: '#d8d8d8', stroke: 'none'}
	 */
    sector: function(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad)
        var x2 = cx + r * Math.cos(-endAngle * rad)
        var y1 = cy + r * Math.sin(-startAngle * rad)
        var y2 = cy + r * Math.sin(-endAngle * rad)
        var obj = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]
        return this.paper.path(obj).attr(params)
    },

    /**
     * 载入图片
     * @param {Number} src 图片src
     * @param {Number} x 坐标 y
     * @param {Number} y 扇形半径
     * @param {Number} w 开始弧度 
     * @param {Number} h 结束弧度
     * @param {Object} params 配置参数  {fill: '#d8d8d8', stroke: 'none'}
     * @param {Number} trans 变换  如'r40,t0,10'
     */
    image: function(src, x, y, w, h, option, trans) {
        var img = this.paper.image(src, x, y, w, h)
        img.attr(option)
        img.transform(trans)
        return img
    }
}

// exports
window.GoodsGraph = GoodsGraph
}(this);
