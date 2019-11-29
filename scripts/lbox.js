
var LE = {
    D: document,
    SUA: new String(navigator.userAgent),
    $: function (id) { return this.D.getElementById(id); },
    isEmpty:function(s){
    	return null == s || s.length == 0;
    },
    trim: function (v, c) {
        var r = /(^\s+)|(\s+$)/g;
        if (typeof c == "string") {
            r = new RegExp("(^(" + c + "|\\s)+)|((" + c + "|\\s)+$)", "g");
        }
        return v.replace(r, '');
    },
    ranStr: function () {
        var x = "123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
        var tmp = "";
        var l = 20;
        for (var i = 0; i < l; i++) {
            tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
        }
        return tmp;
    },
    isIE: function () {
        return LE.SUA.indexOf("compatible") > -1 &&
            LE.SUA.indexOf("MSIE") > -1 &&
            LE.SUA.indexOf("Opera") == -1;
    },
    getFuncByName:function(name){
        return LE.isEmpty(name) ? null : new Function("return " + name)();
    },
    //复制左边的数据到右方
    copySelection : function(leftSelector,rightSelector,isall){
    	//所有
    	var selOption = "option:selected";
    	if(isall){
    		selOption = "option";
    	}
    	
    	$(selOption,leftSelector).each(function(i,v){
    		var lpar = $(v).parent();
    		var rpar = $(rightSelector);//默认是select标签
    		//这里是有optgroup情况下
    		if(lpar.is("optgroup")){
    			lpar = lpar.clone().empty();
    			var _index = parseInt(lpar.attr("data-index"));
    			rpar = $("optgroup[data-index="+_index+"]",rightSelector);
    			//没有要加上一个
    			if(rpar.length == 0){
    				//如果right select 下无optgroup
    				var glist = $("optgroup",rightSelector);
    				var hasBigerIndex = false;//默认没有
   					//从头循环：知道有一个大于自己
   					var last;
   					glist.each(function(gi,gv){
   						var index = parseInt($(gv).attr("data-index"));
   						if(index >= _index){
   							last = gv;
   							hasBigerIndex = true;
   							return false;
   						}
   					});
   					if(hasBigerIndex){
   						rpar = $(lpar).insertBefore(last);
   					}else{
    					rpar = $(lpar).appendTo(rightSelector);
   					}
    			}
    		}
    		var hasOpBingerIndex = false;//默认没有
    		var _oIndex = parseInt($(v).attr("data-index"));
    		var oLast;
    		$("option",rpar).each(function(oi,ov){
    			var oIndex = parseInt($(ov).attr("data-index"));
    			if(oIndex >= _oIndex){
    				oLast = ov;
    				hasOpBingerIndex = true;
    				return false;
    			}
    		});
    		if(hasOpBingerIndex){
    			$(this).insertBefore(oLast);
    		}else{
        		$(this).appendTo(rpar).attr("selected",false);
    		}
    	});
    }
};

var EventUtil = {
    addHandler: function (oTarget, type, handler) {
        if (oTarget.addEventListener) {
            oTarget.addEventListener(type, handler, false);
        } else if (oTarget.attachEvent) {
            oTarget.attachEvent("on" + type, handler);
        } else { oTarget["on" + type] = handler; }
    },
    removeHandler: function (oTarget, type, handler) {
        if (oTarget.removeEventListener) {
            oTarget.removeEventListener(type, handler, false);
        } else if (oTarget.detachEvent) { oTarget.detachEvent("on" + type, handler); }
        else { oTarget["on" + type] = null; }
    },
    getEvent: function (e) { return (e ? e : (LE.isIE() ? window.event : EventUtil.getEvent.caller.arguments[0])); },
    getTarget: function (event) { return event.target || event.srcElement; }
};

function StrBuf(str) {
    this._string_ = new Array();
    if (str != null) {
         this._string_[0] = str;
    }
    if (typeof this.append != "function") {
        StrBuf.prototype.append = function(inStr) {
             this._string_.push(inStr);
             return this;
        };
        StrBuf.prototype.concat = function(sb) {
            this._string_ =this._string_.concat(sb._string_);
            return this;
        };
        StrBuf.prototype.toString = function() {
             return this._string_.join(",");
        };
        StrBuf.prototype.toNString = function(c) {
            return this._string_.join(c);
        };
    }
}


$.fn.extend({
    visibleWidth:function(){
        var w = $(this).width();
        var borderWidth = parseInt($(this).css("border-left-width"))+parseInt($(this).css("border-right-width"));
        var marginWidth = parseInt($(this).css("margin-left"))+parseInt($(this).css("margin-right"));
        var paddingWidth = parseInt($(this).css("padding-left"))+parseInt($(this).css("padding-right"));
        return w + borderWidth + marginWidth + paddingWidth;
    },
    visibleHeight:function(){
        var h = $(this).height();
        var bh = parseInt($(this).css("border-top-width"))+parseInt($(this).css("border-bottom-width"));
        var mh = parseInt($(this).css("margin-top"))+parseInt($(this).css("margin-bottom"));
        var ph = parseInt($(this).css("padding-top"))+parseInt($(this).css("padding-bottom"));
        var t = h + bh + mh + ph;
        return isNaN(t) ? 0 : t;
    },
});

var lBox = {
    iDiffx: 0,
    iDiffy: 0,
    isDown: false,
    zIndex: 100000, //10W开始-------------1000000~500000--每次以10的跳跃
    setTop: function (o, v, h) {//o----盒子;v--设置盒子top值;h---盒子高度
        var y = document.documentElement.clientHeight; //可视内容高度
        if (v >= (y - h) || v <= 0) {
            if ((y - h) > 0) {
                v = (y - h) / 2 + document.documentElement.scrollTop;
            } else {
                v = 0;
            }
        }
        $(o).css("top",v);
    },
    setLeft: function (o, v, w) {
        var x = document.documentElement.clientWidth;
        if (v >= (x - w) || v <= 0) {
            if ((x - w) > 0) {
                v = (x - w) / 2;
            } else {
                v = 0;
            }
        }
        $(o).css("left",v);
    },
    setMTop: function (o, v, tht) {
        var y = document.documentElement.clientHeight; //可视内容高度
        if (v <= 0) {
            v = 0;
        } else if ((y - tht) > 0 && v > (y - tht)) {
            //v = y - tht;
        }
        $(o).css("top",v);
    },
    setMLeft: function (o, v, twt) {
        var x = document.documentElement.clientWidth; //可视内容宽度
        if (v <= 0) {
            //v=0;
        } else if (v > 0 && v >= (x - twt)) {
            //v = x - twt;
        }
        $(o).css("left",v);
    },
    _createBox: function (_pm) {
        var pm = {
            topTistant:0,
            leftTinstant:0,
            className:"",
            speed:"fast",
            isLock:false,
            transeFrom:null,//转移遮罩层来源
            width:0,
            height:0,
            zIndex:0
        };
        //判断宽高
        var x = document.documentElement.clientWidth; //可视内容宽度
        var y = document.documentElement.clientHeight; //可视内容高度
        if(_pm.width >= x){
            _pm.width = x * 0.9;
        }
        if(_pm.height >= y){
            _pm.height = y * 0.9;
        }
        $.extend(pm,_pm);
        try {
            var obj={
                markifr:null,
                markObj:null,
                markUse:{count:1},
                boxDiv:null
            };
            var sb;
            var _zindex = pm.zIndex;
            if(_zindex == 0){
                _zindex = lBox.zIndex;
                lBox.zIndex +=4;
            }
            if (pm.isLock) {
                //如果没有遮罩层来源
                if(null == pm.transeFrom) {
                    sb = new StrBuf("<iframe class='ifr-mark' style='z-index:" + (_zindex + 1) + "'></iframe>");
                    obj.markifr = $(sb.toNString(""));
                    $(document.body).append(obj.markifr);
                    sb = new StrBuf("<div class='viy-box-mark '" + pm.speed + " style='z-index:" + (_zindex + 2) + "'></div>");
                    obj.markObj = $(sb.toNString(""));
                    $(document.body).append(obj.markObj);
                }else{
                    obj.markifr = pm.transeFrom.markifr;
                    obj.markObj = pm.transeFrom.markObj;
                    obj.markUse = pm.transeFrom.markUse;
                    obj.markifr.css("zIndex",(_zindex + 1));
                    obj.markObj.css("zIndex",(_zindex + 2));
                }
            }
            sb = new StrBuf("");
            sb.append("<div class='viy-lbox ").append(pm.className).append("' style='");
            if(pm.width > 0){
                sb.append("width:"+pm.width+"px;");
            }
            if(pm.height > 0){
                sb.append("height:"+pm.height+"px;");
            }
            sb.append("z-index:").append(_zindex+3).append("'></div>");
            obj.boxDiv = $(sb.toNString(""));
            $(document.body).append(obj.boxDiv);
            return obj;
        }
        finally {
        }
    },
    _littleBox: function (_pm) {
        var pm = {
            title:"",
            content:"默认提示内容",
            topTistant:0,
            leftTinstant:0,
            speed:"fast",
            delay:1000,
            success:null,
            close:true,
            isLock:false,
            transeFrom:null,//转移遮罩层来源
            btnConfirmFunc:null
        }
        $.extend(pm,_pm);
        var date = new Date().getTime();
        pm.className = pm.className+" "+pm.speed;
        var obj = lBox._createBox(pm);
        var sb = new StrBuf("");
        if(pm.title.length > 0){
            sb.append("<div class='viy-box-title'><div class='viy-box-title-text'>").append(pm.title).append("</div><a class='lbox-top-close close-lbox'><i class='icon-times'></i></a></div>");
        }
        sb.append("<div class='viy-box-content'>").append(pm.content).append("</div>");
        if(null != pm.btnConfirmFunc){
            sb.append("<div class='lbox-btn'><div class='viyui-btn viyui-btn-sm btn-cancel close-lbox'>取消</div><div class='viyui-btn viyui-btn-sm btn-ok'>确定</div></div>")
        }
        obj.boxDiv.html(sb.toNString(""));
        //set top and left
        var width = obj.boxDiv.width();
        var height = obj.boxDiv.height();
        lBox.setTop(obj.boxDiv, pm.topTistant, height);
        lBox.setLeft(obj.boxDiv, pm.leftTinstant, width);
        EventUtil.addHandler(obj.boxDiv, "contextmenu", function(){return false;});
        obj.boxDiv.removeClass(pm.speed).addClass("clear");
        if(pm.isLock){
            obj.markObj.removeClass(pm.speed).addClass("clear");
        }

        var handle = function() {
            this.obj = obj;
            this.isLock = pm.isLock;
            this.success = pm.success;
            this.immeClose = function(f) {
                var _this = this;
                _this.obj.boxDiv.addClass(pm.speed).removeClass("clear");
                if(_this.isLock) {
                    --_this.obj.markUse.count;
                    if(_this.obj.markUse.count<=0) {//没有使用了，删除遮罩层
                        _this.obj.markObj.addClass(pm.speed).removeClass("clear");
                    }
                }
                setTimeout(function(){
                    _this.obj.boxDiv.remove();
                    if(_this.isLock) {
                        if(_this.obj.markUse.count<=0) {//没有使用了，删除遮罩层
                            _this.obj.markifr.remove();
                            _this.obj.markObj.remove();
                        }
                    }
                    if(pm.success != null){
                        pm.success();
                    }
                    //还可以执行f
                    if(null != f){
                        f();
                    }
                },330);
            }
        };
        var _hd = new handle();
        _hd["close"] = function(f){
            setTimeout(function(){
                _hd.immeClose(f);
            },pm.delay);
        }

        $(obj.boxDiv).on("click",".close-lbox,.lbox-btn .btn-ok",function(){
            var _this = $(this);
            if(_this.hasClass("close-lbox")){
                _hd.immeClose(null);
                if(_hd.obj.boxDiv.hasClass("main-content-box")){
                    lBox.tmpHandles.pop();
                }
            }else if(_this.hasClass("btn-ok") && null != pm.btnConfirmFunc){
                _hd.immeClose(pm.btnConfirmFunc);
            }
        }).on("mousedown",".viy-box-title-text",function(e){
            lBox._boxDown(e,$(this).closest(".viy-lbox"));
        });
        //close event
        if(!pm.close){
            return _hd;
        }else{
            _hd.close(null);
        }
    },
    error: function (_pm) {
        var pm ={
            speed:"fast",
            className:"error-tip-box"
        }
        $.extend(pm,_pm);
        pm.content = "<i class='icon-exclamation-sign'></i>" + pm.content;
        lBox._littleBox(pm);
    },
    alert: function (_pm) {
        var pm ={
            className:"alert-tip-box",
            speed:"fast",
        }
        $.extend(pm,_pm);
        pm.content = "<i class='icon-warning-sign'></i>" + pm.content;
        lBox._littleBox(pm);
    },
    ok: function (_pm) {
        var pm ={
            className:"alert-tip-box alert-ok-box",
            speed:"fast",
        }
        $.extend(pm,_pm);
        pm.content = "<i class='icon-check-circle-o'></i>" + pm.content;
        lBox._littleBox(pm);
    },
    wait: function (_pm) {
        var pm ={
            className:"wait-ok-box",
            content:"正在加载...",
            close:false,
            speed:"fast",
            isLock:true,
            delay:100
        };
        $.extend(pm,_pm);
        pm.content="<i class='icon icon-spin icon-spinner-indicator'></i>"+pm.content;
        return lBox._littleBox(pm);
    },
    confirm:function (_pm) {
        var pm ={
            className:"confirm-ok-box",
            title:"询问框",
            close:false,
            isLock:true
        }
        $.extend(pm,_pm);
        pm.title="<i class='icon-info-sign'></i>"+pm.title;
        return lBox._littleBox(pm);
    },
    tmpHandles:[],
    closeWin:function(f){
        //取最后一个
        var h = lBox.tmpHandles.pop();
        if(null != h){
            h.immeClose(f);
            h = null;//注意f里面不能再取handle 了，否则为null
        }
    },
    newWin: function (title, url, wd, ht) {//非iframe版本的弹窗
        var m = lBox.wait({content:"正在加载...."});
        var ran = LE.ranStr() + lBox.zIndex;
        var newUrl = (url.indexOf("?") != -1) ? (url + "&ran=" + ran) : (url + "?ran=" + ran);
        $.ajax({
            url: encodeURI(newUrl),
            data: {},
            type:"get",
            success: function (content) {
                if(typeof content == "string"){
                    var pm = {
                        title:title,
                        className:"main-content-box",
                        width:wd,
                        height:ht,
                        close:false,
                        isLock:true,
                        transeFrom:{
                            markifr:m.obj.markifr,
                            markObj:m.obj.markObj,
                            markUse:m.obj.markUse,
                        }
                    };
                    ++pm.transeFrom.markUse.count;
                    m.close(function(){
                        var handle = lBox._littleBox(pm);
                        handle.obj.boxDiv.children(".viy-box-content").height(function(){
                            return $(this).parent().height() - $(this).siblings(".viy-box-title").visibleHeight();
                        }).html(content);
                        lBox.tmpHandles.push(handle);
                    });
                }else{
                    m.close(function(){
                        checkResultIsOk(content);
                    });
                }
            }, error: function () {
                m.close(function(){lBox.alert({content:'加载异常！'});});
            }
        });
    },
    newWin2: function (title, url, wd, ht) {//非iframe版本的弹窗
        var pm = {
            title:title,
            content:"<div class='nwin-loading'><i class='icon icon-spin icon-cog'></i><div>加载中...</div></div>",
            className:"main-content-box",
            width:wd,
            height:ht,
            close:false,
            isLock:true
        };
        var handle = lBox._littleBox(pm);
        var viyContent = handle.obj.boxDiv.children(".viy-box-content").height(function(){
            return $(this).parent().height() - $(this).siblings(".viy-box-title").visibleHeight();
        });
        var ran = LE.ranStr() + lBox.zIndex;
        var newUrl = (url.indexOf("?") != -1) ? (url + "&ran=" + ran) : (url + "?ran=" + ran);
        $.ajax({
            url: encodeURI(newUrl),
            data: {},
            type:"get",
            success: function (content) {
                if(typeof content == "string"){
                    viyContent.html(content);
                    lBox.tmpHandles.push(handle);
                }else{
                    handle.close(function(){
                        checkResultIsOk(content);
                    });
                }
            }, error: function () {
                m.close(function(){
                    lBox.alert({content:'加载异常！',success:function(){
                        handle.close();
                    }});
                });
            }
        });
        return handle;
    },
    iframe: function (title, url, wd, ht) {//iframe 版本的弹窗
        var pm = {
            title:title,
            className:"main-content-box",
            width:wd,
            height:ht,
            close:false,
            isLock:true
        };
        var ran = LE.ranStr() + lBox.zIndex;
        var newUrl = (url.indexOf("?") != -1) ? (url + "&ran=" + ran) : (url + "?ran=" + ran);
        pm.content = "<iframe name='lbox_iframe_"+lBox.zIndex+"' src='"+encodeURI(newUrl)+"' />";
        var handle = lBox._littleBox(pm);
        handle.obj.boxDiv.children(".viy-box-content").height(function(){
            return $(this).parent().height() - $(this).siblings(".viy-box-title").visibleHeight();
        });
        handle.obj.boxDiv.find("iframe").load(function(){
            var bd = $(this).contents().children().children("body");
            var c = bd.html();
            if(c.charAt(0) == '{'){
                bd.html("");
                handle.close(function(){
                    checkResultIsOk($.parseJSON(c));
                });
            }else{
                lBox.tmpHandles.push(handle);
            }
        });
        return handle;
    },
    parentWin: function (wn) {//iframe 获取上一级的父窗口 调用的时候：var Pwin=lBox.parentWin(window);
        var a = wn ? wn.frameElement : window.frameElement;
        var w = a ? (a._dlgargs ? (a._dlgargs.win ? a._dlgargs.win : null) : null) : null;
		if(w == null){
			return null;
		}
        w.close = function () {
            try {
                a._dlgargs._m.close();
            } catch (e) {
            }
        };
        w.m = a._dlgargs._m;
        return w;
    },
    _boxDown:function(e,target){
        var mvo = $("#topMoveDiv_");
        if(mvo.length == 0){
            var _sb = new StrBuf("<div style='z-index:");
            _sb.append(lBox.zIndex + 10+"");
            _sb.append(";display:block;' class='viy-box-move' id='topMoveDiv_'></div>");
            mvo = $(_sb.toNString(""));
            $(document.body).append(mvo);
            $(document).on("mousemove",function(e){
                var _this = $("#topMoveDiv_");
                if(_this.css("display") == "none"){
                    return;
                }
                lBox._boxMove.call(_this,e);
            }).on("mouseup",function(e){
                var _this = $("#topMoveDiv_");
                if(_this.css("display") == "none"){
                    return;
                }
                lBox._boxUp.call(_this,e);
            });
        }
        $(mvo).css({
            "z-index": lBox.zIndex + 10,
            "width": target.width(),
            "height": target.height(),
            "left": target.css("left"),
            "top": target.css("top"),
            "display": "block"
        });
        if (null == mvo) {
            return false;
        }
        if (LE.isIE()) {
            mvo.get(0).setCapture(); //ie
        }
        lBox.isDown = true;
        mvo.show();
        mvo.data("iDiffx",e.pageX-parseInt(mvo.css("left")));
        mvo.data("iDiffy",e.pageY-parseInt(mvo.css("top")));
        mvo.data("control",target);
        target.css("-moz-user-select", "none");
        return mvo;
    },
    _boxMove:function(e){
        var mvo = $(this);
        if (mvo.length > 0 && lBox.isDown) {
            var mtop = e.pageY - mvo.data("iDiffy");
            var mleft = e.pageX - mvo.data("iDiffx");
            lBox.setMTop(mvo, mtop, parseInt(mvo.height())); //框高度
            lBox.setMLeft(mvo, mleft, parseInt(mvo.width())); //框宽度
        } else {
            void (0);
        }
    },
    _boxUp:function(e){
        lBox.isDown = false;
        var mvo = $(this);
        var target = mvo.data("control");
        target.css("-moz-user-select", "");
        if (mvo.length > 0 && target.length > 0) {
            mvo.hide();
            if (LE.isIE()) {
                mvo.releaseCapture(); //ie
            }
            target.css("top",mvo.css("top"));
            target.css("left",mvo.css("left"));
        }
    },
};