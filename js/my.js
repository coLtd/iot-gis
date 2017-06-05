function load(){
    var sate = new CTileLayer(2, 16, 'SATE',null, null);
    var satelabel = new CTileLayer(2, 16, 'LABEL',  null, null);
    var MIXMAP = new CMapType([sate,satelabel], '影像');  
    var mapLayers;
    var overlay = null;
    $(function(){
    var opts = {mapTypes:[MIXMAP],center:new CLatLng(35,106),zoom:12};
        mapLayers = new CMapLayers('map',opts);  
    });
    var orgID;
    var str=location.href;
    var num=str.indexOf("orgID=")
    var orgID = '100029';
    $.ajax({
    type: "GET",
    url: "http://10.88.20.89:7010/acp-web-monitor/deviceinfoatorg/getdevices/gstar/1000029?Access-Token=data.token",
    data: '',
    dataType: "json",
    success: function(data){
            console.log(data);
            if(data.flag===0){
                $.alert(data.message, "数据异常");
                return;
            }
            mapLayers.setCenter(new CLatLng(data.data.latitude,data.data.longitude),12)
            var overlay = new CMarkerCluster();
            for (var i in data.data.devices) {
                var x = data.data.devices[i].latitude;
                var y = data.data.devices[i].longitude;
                if(x != null&&y != null){
                    var point = new CLatLng(x,y);
                    var opts;
                    var status = data.data.devices[i].status;
                    var Nan = data.data.devices[i].deviceName;
                    if(data.data.devices[i].categoryId == 3||data.data.devices[i].categoryId == 8){
                        if(status==0){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/1.png")};
                        }else if(status== -1||status== -2){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/3.png")};
                        }else if(status == 128||status == 129||status == 130||status == 131){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/4.png")};
                        }else if(status == 256||status == 257||status == 258){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/2.png")};
                        }else{
                            opts = null;
                        }
                    }else if(data.data.devices[i].categoryId==6){
                        if(status== 0){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/5.png")};
                        }else if(status== -1||status== -2){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/7.png")};
                        }else if(status == 128||status == 129||status == 130||status == 131){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/8.png")};
                        }else if(status == 256||status == 257||status == 258){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/6.png")};
                        }else{
                            opts = null;
                        }
                    }else if(data.data.devices[i].categoryId==7){
                        if(status== 0){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/9.png")};
                        }else if(status == -1||status== -2){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/11.png")};
                        }else if(status == 128||status == 129||status == 130||status == 131){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/12.png")};
                        }else if(status == 256||status == 257||status == 258){
                            opts = {title:Nan,draggable:false,icon:createIcon("./img/10.png")};
                        }else{
                            opts = null;
                        }
                    }
                    if(opts == null){
                        continue;
                    }
                    var m = new CMarker(point, opts);
                    overlay.addLayer(m,point);
                    CMarker.prototype.markLandId = function (id) {
                        this.markLandId = id;
                    }
                    m.markLandId(data.data.devices[i]);
                    CEvent.addListener(m, 'click', function (point) { 
                    	console.log("1111111111111222222222223333333334444444");
                        if(point.target.markLandId.categoryId==3||point.target.markLandId.categoryId==8){
                            $("#popx1").popup();
                            _html="";
                            //采集器
                            collectorLst = point.target.markLandId;
                            var htmlcontainer="";
                            for(var i=0;i<collectorLst.sensors.length;i++){
                                // categoryId
                                var label='';
                                var value = '';
                                var unit = '';
                                if(collectorLst.sensors[i].categoryId == 5){
                                    label = collectorLst.sensors[i].deviceName;
                                    if(collectorLst.sensors[i].status<0){
                                        value = '未知';
                                    }else if(collectorLst.sensors[i].status == 0){
                                        value = '关';
                                    }else if(collectorLst.sensors[i].status>0){
                                        value = '开';
                                    }
                                    unit = ''
                                }else{
                                    label = collectorLst.sensors[i].reportParam;
                                    value = collectorLst.sensors[i].lastvalue;
                                    unit = collectorLst.sensors[i].unit
                                }
                                if(value==null){
                                    value="--";
                                }
                                var tmp='';
                                var tip1='&nbsp;&nbsp;&nbsp;<span style="background-color:#27a9e3;padding:0 5px;border-radius:25px;font-size:12px;color:#fff">正常</span>';
                                var tip2='&nbsp;&nbsp;&nbsp;<span style="background-color:#ccc;padding:0 5px;border-radius:25px;font-size:12px;color:#fff">断开</span>';
                                var tip3='&nbsp;&nbsp;&nbsp;<span style="background-color:#ffdb69;padding:0 5px;border-radius:25px;font-size:12px;color:#fff">异常</span>';
                                var tip4='&nbsp;&nbsp;&nbsp;<span style="background-color:#f5585b;padding:0 5px;border-radius:25px;font-size:12px;color:#fff">告警</span>';
                                var iStatus = collectorLst.sensors[i].status;
                                if(iStatus == 0){
                                    tmp = '<div class="weui-cell" style="color:#27a9e3"><div class="weui-cell__bd"><p>'+label+'</p></div><div class="weui-cell__ft" style="color:#27a9e3">'+value+unit+tip1+'</div></div>'
                                }else if(iStatus == -1|| iStatus==-2){
                                    tmp = '<div class="weui-cell" style="color:#ccc"><div class="weui-cell__bd"><p>'+label+'</p></div><div class="weui-cell__ft" style="color:#ccc">'+value+unit+tip2+'</div></div>' 
                                }else if(iStatus == 128|| iStatus==129|| iStatus==130|| iStatus==131){
                                    tmp = '<div class="weui-cell" style="color:#ffdb69"><div class="weui-cell__bd"><p>'+label+'</p></div><div class="weui-cell__ft" style="color:#ffdb69">'+value+unit+tip2+'</div></div>'  
                                }else if(iStatus == 256|| iStatus==257|| iStatus==258){
                                    tmp = '<div class="weui-cell" style="color:#f5585b"><div class="weui-cell__bd"><p>'+label+'</p></div><div class="weui-cell__ft" style="color:#f5585b">'+value+unit+tip2+'</div></div>'  
                                }
                                htmlcontainer=htmlcontainer+tmp;
                            }
                            var cellHtml;
                            if(htmlcontainer==''){
                                cellHtml='<p style="color:#ccc;text-align:center">该采集器下暂无设备！</p>'
                            }else{
                                cellHtml = '<div class="weui-cells" style="margin-top:5px;">'+htmlcontainer+'</div>'  
                            }

                            var top = '<div style="background-color:#fff;padding-top:5px; color:#ccc">'+
                            '<div style="padding:10px;">设备ID：'+point.target.markLandId.id+'</div>'+
                            '<div style="padding:10px;">类型：'+point.target.markLandId.deviceType+'</div>'+
                            '<div style="padding:10px;">场景：'+point.target.markLandId.scenceName+'</div>'+
                            '<div style="padding:10px;">网关编号：'+point.target.markLandId.deviceNo+'</div>'+
                            '<div style="padding:10px;">电压(V)：'+point.target.markLandId.Voltage+'</div>'+
                            '</div>'


                            // console.log(cellHtml);
                            var html=top+cellHtml;
                            $("#wca1").html(html);
                        }else if(point.target.markLandId.categoryId==6){
                            //视频
                    
                        }else if(point.target.markLandId.categoryId==7){
                            //相机
                            console.log("fuck");
                            // http://10.88.20.89:7010/acp-web-report/reportData/queryImgReportData
                            var params = {};
                            params.orgId = 100029;
                            params.deviceLstStr = 27150;
                            params.deviceTypeId = 8;
                            params.fastDateType = 1;
                            $.ajax({
                                type: "GET",
                                url: "http://10.88.20.89:7010/acp-web-report/reportData/queryImgReportData",
                                data: params,
                                dataType: "json",
                                success: function(data){
                                    console.log(data);
                                    if(data.flag === 0){
                                        $.alert(data.message, "异常");
                                        return;
                                    }else{
                                        var todyHtml="";
                                        if(data.data != null){
                                            // #tabx1
                                            var imgl = "";
                                            for(var i in data.data.deviceLst[0].imgGroupLst[0].dataLst){
                                               console.log(data.data.deviceLst[0].imgGroupLst[0].dataLst[i].minImg) 
                                               imgl=imgl+'<li class="imgLst">'+
                                                            '<div style="text-align:center">'+
                                                                '<img src="http://10.88.20.89:7010/'+data.data.deviceLst[0].imgGroupLst[0].dataLst[i].midImg+'" class="imgsrc"/>'+
                                                                '<p>2014.1.20</p>'+
                                                            '</div>'+
                                                        '</li>'
                                            }
                                            
                                            todyHtml = '<ul>'+imgl+'</ul>'
                                            $("#wca3").html(todyHtml);
                                        }else{
                                             $("#wca3").html('<p style="color:#ccc;text-align:center">该采集器下暂无设备！</p>');
                                        }

                                    }

                                }
                            });
                            
                        }   
                    });
                }
            }
            mapLayers.addOverlay(overlay);
            // mapLayers.setCenter(new CLatLng(data.data.latitude,data.data.longitude),12);
        },
    error:function (request, status, error) {
        $.alert('服务未响应！', "服务异常");
    }
    });
   
}

function createIcon(imageUrl) {
    var opts ={};
    opts.image = imageUrl; //图标位置
    opts.iconSize = new CSize(42, 42); //Icon的尺寸
    opts.iconAnchor = new CPoint(21,0); //锚点位置,相对于左上角
    opts.shadowSize = new CSize(16, 16);
    opts.infoWindowAnchor = new CPoint(8, 0);
    opts.infoShadowAnchor = new CPoint(0, 0);   
    /* 图标参数设置方法*/
    var icon = new CIcon(opts); //点图标 
    return icon;
}