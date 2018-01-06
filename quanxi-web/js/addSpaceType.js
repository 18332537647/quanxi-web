var zTreeData = {};
var zTreeObj;
var setting = {
	view: {
		selectedMulti: true, //设置是否能够同时选中多个节点
		showIcon: true, //设置是否显示节点图标
		showLine: true, //设置是否显示节点与节点之间的连线
		showTitle: true, //设置是否显示节点的title提示信息
	},
	data: {
		simpleData: {
			enable: false, //设置是否启用简单数据格式（zTree支持标准数据格式跟简单数据格式，上面例子中是标准数据格式）
			idKey: "id", //设置启用简单数据格式时id对应的属性名称
			pidKey: "pId" //设置启用简单数据格式时parentId对应的属性名称,ztree根据id及pid层级关系构建树结构
		}
	},
	check: {
		enable: true //设置是否显示checkbox复选框
	},
	callback: {
		onClick: onClick, //定义节点单击事件回调函数
	},
	async: {
		enable: true, //设置启用异步加载
		type: "get", //异步加载类型:post和get
		contentType: "application/json", //定义ajax提交参数的参数类型，一般为json格式
		url: "_URL_BASE + '/industrySpace/getAllTree", //定义数据请求路径
		autoParam: ["id=id", "name=name"] //定义提交时参数的名称，=号前面标识节点属性，后面标识提交时json数据中参数的名称
	}
};

function onClick(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("spaceTree"),
		nodes = zTree.getSelectedNodes(),
		target = "";
	nodes.sort(function compare(a, b) {
		return a.id - b.id;
	});
	for(var i = 0, l = nodes.length; i < l; i++) {
		target += nodes[i].name + ",";
		console.log(nodes[i]);
		var targetId = nodes[i].id;
		console.log(targetId);
	}
	if(target.length > 0) target = target.substring(0, target.length - 1);
	var spaceObj = $("#parentId");
	spaceObj.attr("value", targetId);
	var targetIdObj = $("#targetId");
	targetIdObj.attr("value", target);
	$("#spaceTree").hide();
	$(".close").hide();
}
//获取列表数据
function getIndustrySpaceData() {
	var data;
	$.ajax({　　　　　　　
		url: _URL_BASE + '/industrySpace/getAllTree',
		data: data,
		type: 'get',
		success: function(retData) { //成功回调函数
			console.log(retData);　　　　　　
			var dataList = retData.DataList;
			zTreeData = retData.DataTree;
			var str = "";
			for(i in dataList) {
				var getTime = new Date(dataList[i].createTime);
				Date.prototype.toLocaleString = function() {
					var date = new Date(getTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
					Y = date.getFullYear() + '/';
					M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
					D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
					H = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ' ';
					MI = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ' ';
					S = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() + ' ';
					return Y + M + D + "&nbsp;&nbsp;&nbsp;" + H + ":" + MI + ":" + S;
				};
				formatTime = getTime.toLocaleString();
				str += "<tr class='treegrid-" + (dataList[i].level + 1) + (dataList[i].level == 0 ? "" : " treegrid-parent-" + (dataList[i].level)) + "'><td>" 
				+ dataList[i].name + "</td><td>" + dataList[i].desc + "</td><td>" +"<img src="+dataList[i].imgUrl+" />" + "</td><td>" + formatTime + "</td>" +
				"<td><button type='button' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#myModal' onclick=modifyIndustrySpace('" + dataList[i].id + "','" + dataList[i].name + "')>" 
				+ "编辑" + "</button><button type='button' class='btn btn-danger btn-xs del' onclick=delIndustrySpace('" + dataList[i].id + "')>" + "删除" + "</button>" + "</td></tr>";
			}
			$("tbody").append(str);
			$('.tree').treegrid();
		},
		error: function(err) { //失败回调函数
			alert("获取数据失败");　　　　　　　
		}　　　　　　
	});
}
function clickAddButton(){
	$("#myModalLabel").html("添加空间类型");
}
//提交新增数据
function addIndustrySpace() {
	var formData = new FormData();
	formData.append("name",$("input[name='name']").val());
	alert(formData);
	formData.append("sort",$("input[name='sort']").val());
	formData.append("parentId",$("input[name='parentId']").val());
	formData.append("targetId",$("input[name='targetId']").val());
	formData.append("description",$("input[name='description']").val());
  formData.append("ImgFile",document.getElementById("ImgFile").files[0]);
  console.log(formData);
	$.ajax({
		type: 'post',
		url: _URL_BASE + '/industrySpace/addIndustrySpace',
		data: formData,
		cache: false,
		contentType: false,
	  processData: false,
		dataType: 'json',
		success: function(retData) {
			alert("成功");
		},
		error: function(retData) {
			alert("提交出错");
		}
	});
	//ReLoad();
}
//修改列表信息
function modifyIndustrySpace(id, name) {
	$("#myModalLabel").html("修改空间类型");
	var data = {};
	data.id = id;
	alert(id);
	$.ajax({　　　　　　　
		url: _URL_BASE + '/industrySpace/getIndustrySpace',
		data: data,
		type: 'post',
		success: function(retData) { //成功回调函数
			console.log(retData);
			var name=retData.Data.name;
			var description=retData.Data.description;
			var sort=retData.Data.sort;
			var parentName=retData.Data.parentName;
			$('input[name="name"]').val(name);
			$('input[name="sort"]').val(sort);
			$('input[name="targetId"]').val(parentName);
			$('input[name="description"]').val(description);
		},
		error: function(err) { //失败回调函数
			alert("获取数据失败");　　　　　　　
		}　　　　　　
	});
	//ReLoad()
}
//删除列表
function delIndustrySpace(id) {
	var data = {};
	data.id = id;
	var r = confirm("确定删除？");
	if(r == true) {
		$.ajax({　　　　　　　
			url: _URL_BASE + '/industrySpace/deleteIndustrySpace',
			data: data,
			type: 'post',
			success: function(retData) { //成功回调函数
				console.log(retData);
			},
			error: function(err) { //失败回调函数
				alert("删除失败");　　　　　　　
			}　　　　　　
		});
	}
	ReLoad();
}

function selSpaceType() {
	zTreeObj = $.fn.zTree.init($("#spaceTree"), setting, zTreeData);
	$("#spaceTree").slideDown();
	$(".close").show();
}
$(".close").click(function() {
	$("#spaceTree").hide();
	$(".close").hide();
})

function ReLoad() {
	window.location.reload();
}

$(function() {
	getIndustrySpaceData();
	$('#serchId').on('change', function() {
		$('table tbody tr').hide()
			.filter(":contains('" + ($('#serchId').val()) + "')")
			.show();
	})
});

/*layui.use('upload', function() {
	var $ = layui.jquery,
		upload = layui.upload;
	//普通图片上传
	var uploadInst = upload.render({
		elem: '#uploadImg',
		url: _URL_BASE + '/industrySpace/addIndustrySpace',
		before: function(obj) {
			//预读本地文件示例，不支持ie8
			obj.preview(function(index, file, result) {
				$('#ImgFile').attr('src', result); //图片链接（base64）
			});
		},
		done: function(res) {
			//如果上传失败
			if(res.code > 0) {
				return layer.msg('上传失败');
			} else {
				console.log(res);
			}
			//上传成功
		},
		error: function() {
			//演示失败状态，并实现重传
			var imgText = $('#imgText');
			imgText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
			imgText.find('.demo-reload').on('click', function() {
				uploadInst.upload();
			});
		}
	});
});*/