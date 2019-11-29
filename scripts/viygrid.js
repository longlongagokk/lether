
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

function getContentWidth(ori){
    var countSpan = $("#countSpan");
    if(countSpan.length == 0){
        countSpan = $("<span id='countSpan'></span>");
        countSpan.appendTo("body");
    }
    countSpan.css({"visibility":"hidden","white-space":"nowrap","font-size":+$(ori).css("font-size")});
    countSpan.html(ori.html());
    return countSpan.visibleWidth();
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


function ViyGrid(){
    this.p = {
        scrollWidth:17,
        box:"",
        action:"",
        form:"",
        queryParams:{},
        pageInfo:{
            page:1,
            pageSize:10,
            recordCount:0,
            maxpage:1,
            sortField:"",
            sortDistanct:""
        },
        insteadName:{
            list:"list",
            page:"page",
            pageSize:"pageSize",
            recordCount:"recordCount",
            sortField:"sortField",
            sortDistanct:"sortDistanct",
        },
        sync:false,
        selected:true,
        theads:[],
        dataList:[],
        success:null,
        pager:true,
        rowTag:"tr",
        treeFields:false,
        inited : false
    };
    if (typeof ViyGrid.init == "undefined"){
        ViyGrid.prototype.init = function(box,_p){
            this.p["box"] = box;
            if(_p.treeFields){
                this.p.treeFields = $.extend({},ViyGrid.defaultTreeFields);
            }
            $.extend(true,this.p,_p);
            //这是初始化
            if(LE.isEmpty(this.p.action)){
                this.p.action = $(this.p.form).attr("action");
            }
            $(this.p.box).html("<div class='viy-ui-thead-box'></div><div class='viy-ui-tbody-box'></div><div class='viy-ui-tpager-box'></div>");
        };
        ViyGrid.prototype.bindThead = function(){
            var p = this.p;
            p.bw=$(p.box).closest(".viy-ui-table").width();
            var hw = 0;
            var noWidth;
            var noFixedTheads = [],leftFixedTheads = [],rightFixedTheads=[];
            var wleft = 0,wright = 0;
            var paddingAndBorderMargin = 3*2+1;
            for(var i = 0,j=p.theads.length;i<j;++i){
                var th = p.theads[i];
                var w = th["rowWidth"];
                if(th["fixed"] == "left"){
                    leftFixedTheads.push(th);
                    wleft +=w;
                    continue;
                }else if(th["fixed"] == "right"){
                    rightFixedTheads.push(th);
                    wright +=w;
                    continue;
                }else{
                    noFixedTheads.push(th);
                }
                if(w == null || w == 0){
                    noWidth = th;
                    w = 0;
                }
                hw +=w;
            }
            if(wleft > 0 || p.selected){
                hw += 26+paddingAndBorderMargin;
                hw += paddingAndBorderMargin*leftFixedTheads.length;
            }
            if(wright > 0){
                hw += paddingAndBorderMargin*rightFixedTheads.length;
            }
            hw += paddingAndBorderMargin*(noFixedTheads.length);
            if(null == noWidth){
                noWidth = noFixedTheads[noFixedTheads.length-1];
                hw -=noWidth["rowWidth"];
            }
            noWidth["rowWidth"] = p.bw-hw;
            noWidth["dynamic"] = true;

            noWidth["rowWidth"] = noWidth["rowWidth"] - (wleft+wright);
            //算出左边总共padding等的宽度

            if(noWidth["rowWidth"]<130){
                noWidth["rowWidth"] = 130;//最低130；
                wright += paddingAndBorderMargin;
            }
            var sb = new StrBuf("");
            //select选择框永远在左边fixed固定
            if(p.selected){
                sb.append("<div class='viy-table-box viy-table-left-fixed'><table cellpadding='0' cellspacing='1'>");
                sb.concat(ViyGrid.loadTheadItem(p,leftFixedTheads,"<th><div style='width:26px;'><label class='viyui-checkbox select-all'><input type='checkbox'></label></div></th>",""));
                sb.append("</table></div>");
            }
            //加载无固定项目
            sb.append("<div class='viy-table-box viy-table-no-fixed'><table cellpadding='0' cellspacing='1'>");
            sb.concat(ViyGrid.loadTheadItem(p,noFixedTheads,"",""));
            sb.append("</table></div>");
            //加载右边fixed
            if(rightFixedTheads.length > 0){
                sb.append("<div class='viy-table-box viy-table-right-fixed'><table cellpadding='0' cellspacing='1'>");
                sb.concat(ViyGrid.loadTheadItem(p,rightFixedTheads,"",""));
                sb.append("</table></div>");
            }

            var thtablebox = $(p.box).children(".viy-ui-thead-box");
            thtablebox.append(sb.toNString(""));
            //
            p["noFixedTheads"] = noFixedTheads;
            p["leftFixedTheads"] = leftFixedTheads;
            p["rightFixedTheads"] = rightFixedTheads;
            //计算margin-left长度
            var cw = p.bw;
            var lw = thtablebox.children(".viy-table-left-fixed").width();
            if(lw != null){
                p.lw=lw;
                cw -=lw;
            }
            //计算margin-right长度
            var rw = thtablebox.children(".viy-table-right-fixed").width();
            if(rw != null){
                //thtablebox.children(".viy-table-no-fixed").css("margin-right",rw);
                p.rw=rw;
                cw -=rw;
            }
            thtablebox.children(".viy-table-no-fixed").css("max-width",cw);
            p.cw=cw;

        };
        ViyGrid.prototype.bindTbody = function(){
            var p = this.p;
            if(p.dataList.length == 0){
                $(p.box).children(".viy-ui-tbody-box").html("<div class='no-data'>无数据</div>");
                $(p.box).children(".viy-ui-thead-box").addClass("no-data");
                return;
            }
            $(p.box).children(".viy-ui-thead-box").removeClass("no-data");
            var sb = new StrBuf("");
            //加载左边固定项目
            if (p.selected) {
                sb.append("<div class='viy-table-box viy-table-left-fixed'><table cellpadding='0' cellspacing='1'><tbody>");
                ViyGrid.getTrListStrbuf(p.dataList,p,p.treeFields,sb,[],"<td><div style='width:26px;'><label class='viyui-checkbox list-ckb' title='全选'><input type='checkbox' /></label></div></td>",p.leftFixedTheads,"");
                sb.append("</tbody></table></div>");
            }

            //加载无固定项目
            sb.append("<div class='viy-table-box viy-table-no-fixed' style='max-width:"+p.cw+"px;' onscroll='ViyGrid.copyScrollLeft(this)'><table cellpadding='0' cellspacing='1'><tbody>");
            p.dataList = ViyGrid.getTrListStrbuf(p.dataList,p,p.treeFields,sb,[],"",p.noFixedTheads,"");
            sb.append("</tbody></table></div>");
            //加载右边固定项目
            if(p.rightFixedTheads.length > 0){
                sb.append("<div class='viy-table-box viy-table-right-fixed'><table cellpadding='0' cellspacing='1'><tbody>");
                ViyGrid.getTrListStrbuf(p.dataList,p,p.treeFields,sb,[],"",p.rightFixedTheads,"");
                sb.append("</tbody></table></div>");
            }

            var tbbox = $(p.box).children(".viy-ui-tbody-box");
            tbbox.html(sb.toNString(""));
            var nf = tbbox.children(".viy-table-no-fixed");
            var nftrs = nf.find("tr");
            if(p.lw){
                //左边的每一行高度需要与中间的一致
                tbbox.find(".viy-table-left-fixed tr").css("height",function(){
                    var index = $(this).index();
                    return nftrs.eq(index).height();
                });
            }
            if(p.rw){
                //nf.css("margin-right",p.rw);
                tbbox.find(".viy-table-right-fixed tr").css("height",function(){
                    var index = $(this).index();
                    return nftrs.eq(index).height();
                });
            }

            if(null != p.success){
                p.success(p.dataList);
            }
            // if(p.dataList.length > 0) {
            //     //行分组(左)：
            //     this.group(p.leftFixedTheads);
            //     //行分组（右）：
            //     this.group(p.rightFixedTheads);
            //     //行分组（中）：
            //     this.group(p.noFixedTheads);
            // }
            this.resize();
        };
        ViyGrid.prototype.group = function(heads){
            var _p = this.p;
            for (var i = 0; i < heads.length; ++i) {
                if (heads[i]["rowGroup"]) {
                    var pro = heads[i]["fieldProperName"];
                    var begin = _p.dataList[0][pro],same = 1;
                    var tl=  $(_p.box).children(".viy-ui-tbody-box").find(".viy-table-"+heads[i]["fixed"]+"-fixed tr");
                    var be = tl.eq(0),eqr=new Array();
                    for (var j = 1; j < _p.dataList.length; ++j) {
                        if(begin != _p.dataList[j][pro]){//不一样，已经划好一组了
                            //tr.filter(":eq("+(j-same)+")").children("td:eq("+i+")").attr("rowspan",same);
                            //tr.filter(":gt("+(j-same)+"):lt("+(same-1)+")").each(function(e){$(this).children("td:eq(0)").remove();});
                            be.children("td:eq("+i+")").attr("rowspan",same);
                            $(eqr).each(function(e){$(this).children("td:eq("+i+")").addClass("hide");});
                            //er=[];
                            eqr = new Array();
                            begin = _p.dataList[j][pro];
                            be = tl.eq(j);
                            same = 1;
                            continue;
                        }
                        eqr.push(tl.eq(j));
                        ++same;
                    }
                    if(eqr.length > 0){//处理最后一个
                        be.children("td:eq("+i+")").attr("rowspan",same);
                        $(eqr).each(function(e){$(this).children("td:eq("+i+")").addClass("hide");});
                    }
                }
            }
        };
        ViyGrid.prototype.bindPager = function(){
            if(!this.p.pager){
                return;
            }
            $(this.p.box).children(".viy-ui-tpager-box").html(ViyGrid.page(this.p.pageInfo));
        };
        ViyGrid.prototype.bindEvts = function(){
            var _this=this;
            var p = _this.p;
            $(p.box).on("mouseover",".viy-ui-thead-box th,.viy-ui-tbody-box tr",function(ee){
                var $this = $(this);
                $this.addClass("hover");
                if($this.is("tr")){
                    $this.siblings().not(".selected").removeClass("hover");
                    var index = $this.index();
                    var tbs = $this.closest(".viy-table-box").siblings();
                    tbs.each(function(){
                        var _tr = $(this).find("tr");
                        _tr.not(".selected").removeClass("hover");
                        _tr.eq(index).addClass("hover");
                    });
                }else{
                    var index =$this.index();
                    $this.siblings().removeClass("hover");
                    var ttb = $this.closest(".viy-table-box");
                    var tbody = ttb.closest(".viy-ui-thead-box").siblings(".viy-ui-tbody-box").children().eq(ttb.index());
                    tbody.find("td.hover").removeClass("hover");
                    tbody.find("tr").find("td:eq("+index+")").addClass("hover");
                }
            }).on("mouseout",".viy-ui-thead-box th,.viy-ui-tbody-box tr",function(){
                var $this = $(this);
                if($this.is("tr")){
                    if(!$this.is(".selected")){
                        $this.removeClass("hover");
                        var index = $this.index();
                        var tbs = $this.closest(".viy-table-box").siblings();
                        tbs.each(function(){
                            var _tr = $(this).find("tr");
                            _tr.eq(index).removeClass("hover");
                        });
                    }
                }else{
                    $this.removeClass("hover");
                    var index =$this.index();
                    var ttb = $this.closest(".viy-table-box");
                    var tbody = ttb.closest(".viy-ui-thead-box").siblings(".viy-ui-tbody-box").children().eq(ttb.index());
                    tbody.find("tr").find("td:eq("+index+")").removeClass("hover");
                }
            }).on("click",".list-ckb,.sortable,.viy-ui-tpager-box a:not(.disabledlink),.viy-ui-tpager-box .btn-refresh,.tree-icon:not(.no-children),.select-all",function(){
                var $this = $(this);
                if($this.is(".list-ckb")){
                    ViyGrid.setListCkbEvent($this,p);
                }else if($this.is("a")){
                    //set page
                    var _page;
                    if($this.is(".btn-page-post")){
                        _page = $this.siblings("input").val();
                        if(!LE.isNonNegativeNum(_page)){
                            lBox.alert({content:"请输入正确的非负整数"});
                            return;
                        }
                    }else{
                        _page = $(this).attr("data-page");
                    }
                    if(_page == p.pageInfo.page){
                        return;
                    }
                    p.pageInfo.page = _page;
                    if(p.pageInfo.page > p.pageInfo.maxpage){
                        p.pageInfo.page = p.pageInfo.maxpage;
                    }
                    //gotoPage
                    _this.reload(p);
                }else if($this.is(".sortable")){
                    var th = $this.closest("th");
                    if($this.hasClass(th.attr("data-sort-dis"))){
                        return;
                    }
                    var sd = $this.hasClass("desc")?"desc":"asc";
                    th.siblings().removeAttr("data-sort-dis");
                    var sf = th.attr("data-sort-dis",sd).attr("data-sort-field");
                    p.pageInfo.sortField = sf;
                    p.pageInfo.sortDistanct = sd;
                    _this.reload(p);
                }else if($this.is(".tree-icon")){
                    //tree expand or close;
                    ViyGrid.setListExpandTreeEvent.call($this,p.dataList,p.treeFields,p,function(){
                        //resize
                        _this.resize();
                    });
                }else if($this.is(".icon-refresh")){
                    _this.reload();
                }else if($this.is(".select-all")){
                    var ckb = $this.find("input:checkbox");
                    if(ckb.is(":checked")){
                        $(".viy-ui-tbody-box .list-ckb",viyGrid.selector).children("input").prop("checked",true);
                        $(".viy-ui-tbody-box tr",viyGrid.selector).addClass("hover selected");
                    }else{
                        $(".viy-ui-tbody-box .list-ckb",viyGrid.selector).children("input").prop("checked",false);
                        $(".viy-ui-tbody-box tr",viyGrid.selector).removeClass("hover selected");
                    }
                }
            }).on("change",".exchange-pagesize",function(){
                p.pageInfo.pageSize = $(this).val();
                //gotoPage
                _this.reload(p);
            });

            //拖动列宽度
            var ttrs = ".viy-table-no-fixed tr";
            $(p.box).on("mousedown",ttrs,function(e) {
                $(this).attr("data-begin",e.pageX);
                var th = $(e.target).closest("th,td");
                var moveObj = th.children();
                if(th.css("cursor") == "w-resize"){
                    p.wresize = true;
                }
                $(this).data("move-obj",moveObj);
                $(this).attr("data-ori-width",moveObj.width());
                var index = $(moveObj).closest("th,td").index();
                if(p.noFixedTheads[index]["minWidth"] == null){
                    var ori = $(this).closest(".viy-ui-table").find(".viy-ui-thead-box .viy-table-no-fixed th:eq("+index+")").children();
                    p.noFixedTheads[index]["minWidth"] = getContentWidth(ori) + 10;
                }
            }).on("mousemove",ttrs,function(e){
                var th = $(e.target).closest("th,td");
                var left = $(th).offset().left;
                var wd = $(th).visibleWidth();
                var px = e.pageX;
                var dist = 8;
                if((left + wd - px) <= dist){
                    $(th).css("cursor","w-resize");
                }else{
                    $(th).css("cursor","default");
                }
                if(!p.wresize){
                    return;
                }
                var begin = parseInt($(this).attr("data-begin"));
                var oriWidth = parseInt($(this).attr("data-ori-width"));
                var px = e.pageX;
                var moveObj = $(this).data("move-obj");
                if(moveObj == null){
                    return;
                }
                var index = moveObj.closest("th,td").index();
                var minWidth = p.noFixedTheads[index]["minWidth"];

                var nowWidth = oriWidth + (px - begin);
                if(nowWidth <=minWidth){
                    nowWidth = minWidth;
                }

                p.noFixedTheads[index].rowWidth = nowWidth;
                var tbr = $(this).closest(".viy-ui-table").find(".viy-table-no-fixed tr");
                if(tbr.length == 0){
                    return;
                }
                tbr.find("th:eq("+index+"),td:eq("+index+")").children().width(nowWidth);
            }).on("mouseup",function(){
                p.wresize = false;
            });
        };
        ViyGrid.prototype.reload = function(_p){
            var _this = this;
            $.extend(true,_this.p,_p);
            var p = _this.p;
            if(!LE.isEmpty(p.form)){
                var rs = $(p.form).serializeArray();
                $("input,select",p.form).each(function(){
                    var fc = LE.getFuncByName($(this).attr("data-post-fmt-func"));
                    var v = LE.getFormVal(this);
                    p.queryParams[$(this).attr("name")] = null == fc ? v : fc(v);
                });
            }
            //var m = lBox.wait({content:"正在加载，请稍后..."});
            p.queryParams["pageInfo." + p.insteadName["page"]] = p.pageInfo.page;
            p.queryParams["pageInfo." + p.insteadName["pageSize"]] = p.pageInfo.pageSize;
            p.queryParams["pageInfo." + p.insteadName["sortField"]] = p.pageInfo.sortField;
            p.queryParams["pageInfo." + p.insteadName["sortDistanct"]] = p.pageInfo.sortDistanct;
			var method = $.post;
			if("get" == $(p.form).prop("method")){
				method = $.get;
			}
            $.get(p.action,p.queryParams,function(_data){
               if(_data.code == "200") {
                    var data = _data.content;
                    p.dataList = data[p.insteadName["list"]];
                    if (null != data["pageInfo"]) {
                        p.pageInfo.page = data["pageInfo"][p.insteadName["page"]];
                        p.pageInfo.pageSize = data["pageInfo"][p.insteadName["pageSize"]];
                        p.pageInfo.recordCount = data["pageInfo"][p.insteadName["recordCount"]];
                    }
                    _this.bindTbody();
                    _this.bindPager();
                    if(typeof p["backfc"] == "function"){
                        p["backfc"].call(_this);
                    }
                }else{
					alert("返回错误！");
				}
                //m.close();
            },"json");
        };
        ViyGrid.prototype.getSelecteds = function(){
            var _this = this;
            return $(".viy-ui-tbody-box .viy-table-no-fixed .selected",this.p.box).map(function(){
                return _this.p.dataList[$(this).index()];
            }).get();
        };
        ViyGrid.prototype.resize = function(){
            var p = this.p;
            var tbody = $(p.box).children(".viy-ui-tbody-box");
            var maxHeight = parseFloat(tbody.css("max-height"));
            var ws=[false,false,false];
            var hasWidthScroll = false;
            $(".viy-table-box",tbody).each(function(i,v){
                if(parseInt($(this).width()) < parseInt($(this).children().width())){
                    ws[i] = true;
                    hasWidthScroll = true;
                }
            });
            $(".viy-table-box",tbody).each(function(i,v){
                $(this).css("max-height",(hasWidthScroll && !ws[i])?maxHeight-p.scrollWidth:maxHeight);
            });
            var noFix = $(tbody).children(".viy-table-no-fixed").children("table");
            var contentHeight = parseFloat(noFix.height());
            var diff = contentHeight - maxHeight;
            if(diff > 0){//加个滚动条
                var scrollBar = tbody.find(".viy-table-scroll-bar");
                if(scrollBar.length == 0){
                    scrollBar = $("<div class='viy-table-scroll-bar' onscroll='ViyGrid.copyScrollTop(this)'><div class='scroll-bar'></div></div>");
                    tbody.append(scrollBar);
                }
                var _sh = parseFloat(tbody.height());
                scrollBar.css("height",(hasWidthScroll ? _sh-p.scrollWidth:_sh)).children().height(contentHeight);
                tbody.unmousewheel().mousewheel(function(event, delta) {
                    var len = -event.deltaFactor;
                    if(event.deltaY < 0){
                        len = -len;
                    }
                    $(".viy-table-scroll-bar",this).scrollTop(function(){
                        return $(this).scrollTop() + len/2;
                    });
                    return false;
                });
            }else{
                tbody.find(".viy-table-scroll-bar").remove();
            }
        };
        ViyGrid.prototype.resizeWin = function(){
            var _p = this.p;
            var nf = $(".viy-table-no-fixed",_p.box);
            var aw = _p.box.width();
            var bw = 0;
            $(".viy-ui-thead-box",_p.box).children().each(function(){
                bw +=$(this).width();
            });
            var suf = aw-bw;
            nf.width(nf.width() + suf);
            var _dy = $(".dynamic",nf);
            if(_dy.length == 0){
                _dy = $(".list-row :last-child",nf);
            }
            _dy.children().width(function(){
                return $(this).width() + suf;
            });
            this.resize();
        };
    }
}
ViyGrid.defaultTreeFields = {
    expand:true,
    show:true,
    sortField:"sort",
    idField:"id",
    valueField:"id",
    parentField:"parentId",
    textField:"name",
    parentId:0,
    topLevel:0
};
ViyGrid.loadTheadItem = function(p,theads,pre,suffix){
    var sb = new StrBuf("<thead><tr>"+pre);
    for(var i = 0,j=theads.length;i<j;++i){
        var th = theads[i];
        sb.append("<th class='"+(th["dynamic"]?"dynamic":"")+"' ");
        var w = th["rowWidth"];
        if(th["sortable"] == "1"){
            if(th["fieldName"] == p.pageInfo.sortField){
                sb.append(" data-sort-dis='").append(p.pageInfo.sortDistanct).append("'");
            }
            sb.append(" data-sort-field='");
            sb.append(th["fieldName"]).append("' ");
            sb.append(" ><div style='width:").append(w).append("px'><span>").append(th["fieldShowName"]).append("</span><i class='sortable asc icon icon-sort-up'></i><i class='sortable desc icon icon-sort-down'></i></div></th>");
        }else{
            sb.append(" ><div style='width:").append(w).append("px'>").append(th["fieldShowName"]).append("</div></th>");
        }
    }
    sb.append(suffix);
    sb.append("</tr></thead>");
    return sb;
};
ViyGrid.getLinkDiv = function(page,title,aclass,txt){
    var strB = new StrBuf("<a title='");
    strB.append(title).append("' data-page='");
    strB.append(page).append("' class='");
    strB.append(aclass).append("'>");
    strB.append(txt).append("</a>");
    return strB.toNString("");
};
ViyGrid.getLinkList = function(len,cp){
    var strB = new StrBuf("");
    for (var i = 1; i <= len; ++i){
        if (i != cp){
            strB.append(ViyGrid.getLinkDiv(i, "第" + i + "页","", i+""));
        }else{
            strB.append("<a data-page='").append(cp).append("' class='currentAhur'>").append(cp).append("</a>");
        }
    }
    return strB.toNString("");
};
ViyGrid.getDlListStrbuf = function(priList,treeFields,sb){
    var list = [];
    listForTreeArray(priList,treeFields,list);
    var pidex;
    for(var i = 0,l=list.length;i<l;++i){
        var it = list[i];
        sb.append("<dd class='list-row ");
        pidex = it["parentIndex"];
        if(pidex > -1 && !list[pidex].expand){
            sb.append("tree-close");
        }
        sb.append("' data-index='").append(i).append("'>");
        sb.concat(ViyGrid.getListDivValue(it, it[treeFields.textField], i, {},treeFields.textField,treeFields)).append("</dd>");
    }
    return list;
};
ViyGrid.getTrListStrbuf = function(priList,p,treeFields,sb,preList,selectContent,fmtTheads,suffix){
    var j = fmtTheads.length;
    var list,pidex,begin = preList.length;
    if(!treeFields) {
        list = priList;
    }else{
        list = preList;
        listForTreeArray(priList, treeFields,list);
    }
    for(var i = begin,k=list.length;i<k;++i) {
        var it = list[i];
        sb.append("<tr class='list-row ");
        pidex = it["parentIndex"];
        if(treeFields){
            pidex = it["parentIndex"];
            if(pidex > -1 && !list[pidex].expand){
                sb.append("tree-close");
            }
        }
        for(var f=0;f<j;++f){
            var cv = fmtTheads[f]["rowClassValue"];
            if(null == cv){
                continue;
            }
            sb.append(" ").append(cv).append("-").append(it[cv]);
        }
        sb.append("'>");
        sb.append(selectContent);
        for (var f = 0; f < j; ++f) {
            var td = fmtTheads[f];
            var fn = td["fieldProperName"];
            var v = it[fn];
            var w = td["rowWidth"];
            sb.append("<td class='"+(td["dynamic"]?"dynamic":"")+"' >");
            if (fn != "sort") {
                sb.append("<div style='");
                if (td["align"] != null) {
                    sb.append("text-align:").append(td["align"]);
                }
                sb.append(";width:").append(w).append("px'>");
                sb.concat(ViyGrid.getListDivValue(it, v, i, td, fn, treeFields));
                sb.append("</div></td>");
            } else {
                sb.append("<div style='width:").append(w).append("px' class='list-sort'><input autocomplete='off' type='text' data-tip='' data-tip-type='1' data-rules='decimal_2' class='validator' name='listsort' maxlength='10' value='")
                    .append(it["sort"]).append("' /></div></td>")
            }
        }
        sb.append(suffix);
        sb.append("</tr>");
    }
    return list;
}
ViyGrid.getListDivValue = function(tr,v,i,td,fn,treeFields){
    var sb = new StrBuf("");
    var tpl = td["visibleTemplate"];
    if(null == tpl || typeof tpl == "string"){
        if(LE.isEmpty(tpl)){
            if(!treeFields || fn != treeFields.textField){
                sb.append(v);
            }else{
                //tree
                var per = tr["level"];
                sb.append("<div class='tree-item-box' style='padding-left:"+(10+3*per)+"px'><span class='tree-item tree-line' style='margin-left:").append(4+14*per).append("px;'>&nbsp;</span>");
                sb.append("<i class='tree-item tree-icon ");
                if(tr["hasChildren"]){
                    if(treeFields.expand){
                        sb.append("icon-collapse-alt");
                    }else{
                        sb.append("icon-expand-alt");
                    }
                }else{
                    sb.append("no-children");
                }
                sb.append("'></i><i class='tree-item select-tree-state icon-stack'></i>");
                sb.append("<span data-value='").append(tr[treeFields.valueField]).append("' data-id='").append(tr[treeFields.idField]).append("' class='tree-item tree-text'>").append(v).append("</span></div>");
            }
        }else if(tpl.charAt(0) == '#'){
            //tmp
            sb.append($(tpl).html().replace(repeater.reg,function(match,key){
                var v = tr[key];
                if(null == v){
                    v = '';
                }
                return v;
            }));
        }else{
            //fc
            sb.append(window[tpl](tr,v,i,td["fieldProperName"]));//
        }
    }else if(typeof tpl == "function"){
        sb.append(tpl(tr,v,i,td["fieldProperName"]));//
    }
    return sb;
};
ViyGrid.checkOffspringOrSelf = function(p,begin,cit,vit){//p:参数,pit:上级ID,cit:当前it，vit：要检查的it,需要知道pit在p.dataList中的index
    if(!p.treeFields){
        return false;
    }
    if(cit[p.treeFields.idField] == vit[p.treeFields.idField]){
        return true;//self
    }
    var len = p.dataList.length;
    if(begin < -1 || begin >= len){
        console.error("index区间有误,index:"+begin+",len:"+len);
        return false;
    }
    var f = p.treeFields.idField;
    var selfIndex = 0;
    var checkIndex = vit["dataIndex"];
    var selfIndex = len -1,nextInex = len;
    var thisLev = 0;
    for(var i = begin+1;i<len;++i){
        var it = p.dataList[i];
        if(cit[f] == it[f]){//先找到自己的位置self
            selfIndex = i;
            thisLev = it["level"];
        }else if((it["level"] <=thisLev) && i > selfIndex){//到了下一级且下一级比自己还大，肯定不是
            nextInex = i;
            break;
        }
    }
    return checkIndex >=selfIndex && checkIndex < nextInex;
}
ViyGrid.setListExpandTreeEvent = function(list,treeFields,p,bf){//bf:操作成功后执行的函数
    var _this =$(this);
    var row = _this.closest(".list-row");
    var index = row.index();
    var it = list[index];
    var last = index+1;
    var ttb = row.closest(".viy-table-box");
    var rs = row.parent().children(".list-row");
    var lrs = ttb.siblings(".viy-table-left-fixed").find("tbody").children(".list-row");
    var rrs = ttb.siblings(".viy-table-right-fixed").find("tbody").children(".list-row");
    if(_this.hasClass("icon-spin")){
        return;//loading 中的不可点击.
    }
    if(it.expand){//关闭子节点
        it.expand = false;
        _this.removeClass("icon-collapse-alt").addClass("icon-expand-alt");
        for(;last<list.length;++last){
            if(list[last]["level"] <= it["level"]){
                break;
            }
        }
        rs.filter(":gt("+index+"):lt("+(last-index-1)+")").addClass("tree-close");
        lrs.filter(":gt("+index+"):lt("+(last-index-1)+")").addClass("tree-close");
        rrs.filter(":gt("+index+"):lt("+(last-index-1)+")").addClass("tree-close");
    }else{//展开子节点
        it.expand = true;
        _this.removeClass("icon-expand-alt");
        if(null != p && p.sync && !_this.hasClass("icon-spin") && !_this.hasClass("loaded")){
            _this.addClass("icon-spin icon-spinner-indicator");
            var parentId = it[treeFields.idField];
            p.queryParams[treeFields.parentField] = parentId;
            $.post(p.action,p.queryParams,function(_data){
                if(checkResultIsOk(_data)) {
                    _this.removeClass("icon-spin icon-spinner-indicator").addClass("loaded");
                    var data = _data.content;
                    var lst = data[p.insteadName["list"]];
                    if(lst == null || lst.length == 0){
                        _this.addClass("no-children");
                        return;
                    }
                    delete p.queryParams[treeFields.parentField];
                    var  tf = $.extend({},treeFields);
                    tf.topLevel = it["level"] + 1;
                    tf.parentId = parentId;
                    var sb = new StrBuf("");
                    var preList = p.dataList.slice(0,index+1);


                    //加载左边固定项目
                    if (p.selected) {
                        var lsb = new StrBuf("");
                        ViyGrid.getTrListStrbuf(lst,p,false,lsb,[],"<td><div style='width:26px;'><label class='viyui-checkbox list-ckb'><input type='checkbox' /></label></div></td>",p.leftFixedTheads,"");
                        $(lsb.toNString("")).insertAfter(row.closest(".viy-table-box").siblings(".viy-table-left-fixed").find("tbody").children("tr:eq("+index+")"));
                    }
                    //加载右边固定项目
                    var bu = "";
                    if(p.rightFixedTheads.length > 0){
                        bu = "<td><div style='width:"+p.rw+"px'>&nbsp;</div></td>";
                        var rsb = new StrBuf("");
                        ViyGrid.getTrListStrbuf(lst,p,false,rsb,[],"",p.rightFixedTheads,"");
                        $(rsb.toNString("")).insertAfter(row.closest(".viy-table-box").siblings(".viy-table-right-fixed").find("tbody").children("tr:eq("+index+")"));
                    }

                    lst = ViyGrid.getTrListStrbuf(lst,p,tf,sb,preList,"",p.noFixedTheads,bu);
                    $(sb.toNString("")).insertAfter(row);

                    p.dataList = lst.concat(p.dataList.slice(index+1));
                    _this.addClass("icon-collapse-alt");
                    if(null != bf){
                        bf();
                    }
                    return;
                }
            },"json");
            return;
        }
        _this.addClass("icon-collapse-alt");
        for (; last < list.length; ++last) {
            var lt = list[last];
            if (lt["level"] <= it["level"]) {//同级或上级
                break;
            } else if (list[lt["parentIndex"]].expand && !rs.eq(lt["parentIndex"]).hasClass("tree-close")) {//后代，如果他的上级expand，就不管
                rs.eq(last).removeClass("tree-close");
                lrs.eq(last).removeClass("tree-close");
                rrs.eq(last).removeClass("tree-close");
            }
        }
    }
    if(null != bf){
        bf();
    }
    return;
};
ViyGrid.setListCkbEvent = function($this,p){
    var row = $this.closest(".list-row").toggleClass("selected");
    //right/nofixed too
    var ttb = row.closest(".viy-table-box");
    var ntb = ttb.siblings(".viy-table-no-fixed"),rtb = ttb.siblings(".viy-table-right-fixed");
    if(row.hasClass("selected")){
        ntb.find("tbody").children("tr:eq("+row.index()+")").addClass("selected hover");
        rtb.find("tbody").children("tr:eq("+row.index()+")").addClass("selected hover");
    }else{
        ntb.find("tbody").children("tr:eq("+row.index()+")").removeClass("selected hover");
        rtb.find("tbody").children("tr:eq("+row.index()+")").removeClass("selected hover");
    }
    //如果是tree
    if(p.treeFields){
        //查出子项以及后代
        var index = row.index();
        var tr = p.dataList[index];
        var last = index+1;
        for(;last<p.dataList.length;++last){
            if(p.dataList[last]["level"] <= tr["level"]) {
                break;
            }
        }
        var trs = row.parent().children(".list-row");
        var atrs = trs.filter(":gt("+index+")").filter(":lt("+(last-index-1)+")");
        if($this.children("input").is(":checked")){
            atrs.addClass("selected hover").find(".list-ckb").children("input").prop("checked",true);
        }else{
            //自己不勾选，上级也不能勾选
            var btrs = trs.filter(":lt("+index+")");
            var lv = tr["level"]-1;
            for(var i = index-1;i>=0;--i){
                if(lv == p.dataList[i]["level"]){
                    --lv;
                    atrs = atrs.add(btrs[i]);
                }
            }
            atrs.removeClass("selected hover").find(".list-ckb").children("input").prop("checked",false);
        }
    }
};
ViyGrid.copyScrollLeft = function(prim){
    //right
    // var r = $(prim).children(".viy-table-right-fixed").width();
    // var l = $(prim).children(".viy-table-left-fixed").width();
    // var tb = $(prim).children(".viy-table-no-fixed");
    var sf = $(prim).scrollLeft();
    // $(tb).css("margin-left",l-r);
    var index = $(prim).index();
    $(prim).parent().siblings(".viy-ui-thead-box").children().eq(index).scrollLeft(sf);
};
ViyGrid.copyScrollTop = function(prim){
    var sf = $(prim).scrollTop();
    $(prim).siblings().scrollTop(sf);
}
ViyGrid.page = function(pageInfo){
    var strB = new StrBuf("<div class='page_pri_div'>");
    var maxpage = Math.ceil(pageInfo.recordCount / pageInfo.pageSize);
    pageInfo.maxpage = maxpage;
    pageInfo.page = pageInfo.page > maxpage ? maxpage : pageInfo.page;

    if(pageInfo.page<=1){
        strB.append("<a class='disabledlink' title='已经是第一页' >首页</a><a class='disabledlink' title='已经是第一页' >上一页</a>");
    }else{
        strB.append(ViyGrid.getLinkDiv(1, "首页","", "首页"));//首页
        strB.append(ViyGrid.getLinkDiv(pageInfo.page - 1, "上一页", "lastPage", "上一页"));//上一页
    }
    if(pageInfo["renderType"] != 1) {
        if (maxpage > 5) {
            //如果当前页>3;
            var afTen = pageInfo.page + 10 < maxpage ? (pageInfo.page + 10) : maxpage;
            if (pageInfo.page > 3) {
                var preTen = pageInfo.page - 10 > 0 ? (pageInfo.page - 10) : 1;
                strB.append(ViyGrid.getLinkDiv(preTen, "前十页", "", "···"));
                if (pageInfo.page <= maxpage - 3) {//若为<倒数第三页
                    strB.append(ViyGrid.getLinkDiv(pageInfo.page - 2, "第" + (pageInfo.page - 2) + "页", "", (pageInfo.page - 2) + ""));//当前页-2
                    strB.append(ViyGrid.getLinkDiv(pageInfo.page - 1, "第" + (pageInfo.page - 1) + "页", "", (pageInfo.page - 1) + ""));//当前页-1
                    //当前页
                    strB.append("<a data-page='").append(pageInfo.page).append("' class='currentAhur'>");
                    strB.append(pageInfo.page);
                    strB.append("</a>");

                    strB.append(ViyGrid.getLinkDiv(pageInfo.page + 1, "第" + (pageInfo.page + 1) + "页", "", (pageInfo.page + 1) + ""));//当前页+1
                    strB.append(ViyGrid.getLinkDiv(pageInfo.page + 2, "第" + (pageInfo.page + 2) + "页", "", (pageInfo.page + 2) + ""));//当前页+2

                    strB.append(ViyGrid.getLinkDiv(afTen, "后十页", "", "···"));
                } else {
                    //显示前面的
                    for (var i = 5 - (maxpage - pageInfo.page) - 1; i > 0; i--) {
                        strB.append(ViyGrid.getLinkDiv((pageInfo.page - i), "", "", (pageInfo.page - i) + ""));
                    }
                    //显示后面的；!
                    for (var i = 0; i <= maxpage - pageInfo.page; i++) {
                        if (pageInfo.page != pageInfo.page + i) {
                            strB.append(ViyGrid.getLinkDiv((pageInfo.page + i), "", "", (pageInfo.page + i) + ""));
                        }
                        else {
                            strB.append("<a data-page='").append(pageInfo.page).append("' class='currentAhur'>").append(pageInfo.page).append("</a>");
                        }
                    }
                }
            }
            else {//当前页小于3
                strB.append(ViyGrid.getLinkList(5, pageInfo.page));
                strB.append(ViyGrid.getLinkDiv(afTen, "后十页", "", "···"));
            }
        } else {
            strB.append(ViyGrid.getLinkList(maxpage, pageInfo.page));
        }
    }
    if (pageInfo.page != maxpage)
    {
        strB.append(ViyGrid.getLinkDiv((pageInfo.page + 1) < maxpage ? (pageInfo.page + 1) : maxpage,  "下一页","nextPage", "下一页"));//下一页
        strB.append(ViyGrid.getLinkDiv(maxpage, "尾页", "", "尾页"));//尾页
    }
    else
    {
        strB.append("<a class='disabledlink' title='已经是最后一页' >下一页</a><a class='disabledlink' title='已经是最后一页' >尾页</a>");
    }
    if (maxpage>1)
    {
        strB.append("<input value='").append(pageInfo.page).append("' type='text' class='input checkIsFloat' style='height:22px;line-height:22px;width:40px;margin:0px 3px;' /><a class='btn-page-post'>GO</a>");
    }
    strB.append("<span>");
    strB.append(pageInfo.page);
    strB.append("</span>/<span>");
    strB.append(maxpage);
    strB.append("</span>　共<span>");
    strB.append(pageInfo.recordCount);
    strB.append("</span>条");

    strB.append("<select class='exchange-pagesize no-render' style='height:26px;margin:0px 3px;'>");
    strB.append("<option value='10' "+(pageInfo.pageSize == 10 ?"selected='true'":"")+">10</option>");
    strB.append("<option value='20' "+(pageInfo.pageSize == 20 ?"selected='true'":"")+">20</option>");
    strB.append("<option value='50' "+(pageInfo.pageSize == 50 ?"selected='true'":"")+">50</option>");
    strB.append("<option value='100' "+(pageInfo.pageSize == 100 ?"selected='true'":"")+">100</option>");
    strB.append("</select>");

    strB.append("<a class='btn-refresh'><i class='icon icon-refresh'></i></a></div>");
    return strB.toNString("");
};
ViyGrid.pageEvent = function(box,pageInfo,pageFunc,refreshFunc){
    $(box).on("click","a:not(.disabledlink),.btn-refresh",function(){
        var $this = $(this);
        if(!$this.is(".btn-refresh")){
            //set page
            var _page;
            if($this.is(".btn-page-post")){
                _page = $this.siblings("input").val();
                if(!LE.isNonNegativeNum(_page)){
                    lBox.alert({content:"请输入正确的非负整数"});
                    return;
                }
            }else{
                _page = $(this).attr("data-page");
            }
            if(_page == pageInfo.page){
                //return;
            }
            pageInfo.page = _page;
            if(pageInfo.page > pageInfo.maxpage){
                pageInfo.page = pageInfo.maxpage;
            }
            //gotoPage
            pageFunc(pageInfo);
        }else{
            refreshFunc();
        }
    });
};
$.fn.extend({
    dataGrid:function(p){
        var _s = new ViyGrid();
        _s.init(this,p);
        _s.bindThead();
        //如果有数据，绑定数据
        _s.bindPager();
        if(!_s.p.inited){
            //初始化高度
            $(_s.p.box).children(".viy-ui-tbody-box").css("max-height",function(){
                var mp = 0,$p = $(this).parent();
                var p = $(this).parent().height();
                var th = $(this).prev().visibleHeight();
                var pageBox = $(this).siblings(".viy-ui-tpager-box");
                //如果有分页
                var ph = 0;
                if(pageBox.length > 0){
                    ph = pageBox.height()*pageBox.length;
                }
                return p - th - ph;
            });
            _s.p.inited = true;
        }
        _s.bindTbody();
        _s.bindEvts();
        _s.selector = this;
        return _s;
    },
    treeGrid:function(p){
        var _s = new ViyGrid();
        _s.init(this,p);
        _s.bindThead();
        //如果有数据，绑定数据
        if(!_s.p.inited){
            //初始化高度
            $(_s.p.box).children(".viy-ui-tbody-box").css("max-height",function(){
                var p = $(this).parent().height();
                var th = $(this).prev().height();
                var pageBox = $(this).siblings(".viy-ui-tpager-box");
                //如果有分页
                var ph = 0;
                if(pageBox.length > 0){
                    ph = pageBox.height()*pageBox.length;
                }
                return p - th - ph;
            });
            _s.p.inited = true;
        }
        _s.bindTbody();
        _s.bindEvts();
        _s.selector = this;
        return _s;
    },
});