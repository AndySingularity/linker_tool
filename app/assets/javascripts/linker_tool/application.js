// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$(document).ready(function() {
	var main_form = $("form#main_linker_form");
	var main_form_div = $("form#main_linker_form div");
	var edit_form = $("pre#edit_input_form");
	var last_form_html = localStorage.getItem("linker_form_gem_html");
	console.log(last_form_html);
	if (last_form_html !== "") {
		main_form.replaceWith(last_form_html);
		main_form = $("form#main_linker_form");
		main_form_div = $("form#main_linker_form div");
	}
	var authenticity_token = $("input[name='authenticity_token']").clone().wrap('<p>').parent().html();
	var num = 1;
	$("input[name='authenticity_token']").remove();
	main_form.attr("method","get");
	$("#link").change(function(){
			main_form.attr("action",$("#link").val());
	});
	$("#mtd").change(function(){
		if ($("#mtd").val() === "get") { 
				main_form.attr("method","get");
				$("input[name='_method']").remove();
				$("input[name='authenticity_token']").remove();
		} else {
				set_post_method($("#mtd").val());
		}
	});
	$("input#main_linker_form_submit").click(function(){
		main_form.submit();
	});
	$("input#new_input_submit").click(function(){
		var name = $("input#new_input_name").val();
		var type = $("select#new_input_type").val();
		var str = '<span id="input_name">' + name + '</span> ' + '<input id="' + name + '" name="' + name + '" type="' + type + '">' + '<input id="' + num + '" name="edit_input" value="edit" type="button">'+ '<input id="' + num + '" name="delete_input" value="delete" type="button">';
		if (main_form.children().length > 1) {
			str = '<hr>' + str;
		}
		str = '<div id="' + num + '">' + str + "</div";
		main_form.append(str);
		num = num + 1;
		set_edit_delete_listener();
	});
	set_edit_delete_listener();
	$("input#new_input_clear").click(function(){
		$("input#new_input_name").val("");
		$("select#new_input_type").val("text");
	});
	$("input#new_input_delete_all").click(function(){
		var block_html = $("form#main_linker_form div").clone().wrap('<p>').parent().html();
		main_form.empty();
		main_form.append(block_html);
		main_form_div = $("form#main_linker_form div");
	});
	$("#full_form_html").click(function(){
		var txta = $("#full_form_html_textarea");
		txta.toggle();
		var need_text = main_form.clone().wrap('<p>').parent().html();
		txta.val(need_text);
		var txtaLineHeight = 20;
		var txtaHeight = txta.get(0).scrollHeight;
		var numberOfLines = Math.ceil(txtaHeight/txtaLineHeight - 1);
		txta.css({"height":"","width":"100%"});
		txta.attr("rows",numberOfLines);
	});
	$("#full_routes_button").click(function(){
		$("#full_routes").toggle();
	});
	$("#delete_form_cookie").click(function(){
		localStorage.setItem("linker_form_gem_html","");
	});
	$("#save_form_cookie").click(function(){
		localStorage.setItem("linker_form_gem_html",main_form.clone().wrap('<p>').parent().html());
	});
	$("input[type='text'").change(function(){
		$(this).attr("value",$(this).val());
	});
	
	function set_post_method(method_name){
		main_form.attr("method","post");
		if (method_name == "post"){
			$("input[name='_method']").remove();
		} else {
			if (!$("input[name='_method']").length) {
					main_form_div.append('<input name="_method" type="hidden" value="' + method_name + '">');
			} else {
					$("input[name='_method']").val(method_name);
			}
		}
		if (!$("input[name='authenticity_token']").length) {
			main_form_div.append(authenticity_token);
		}
	}
	
	function edit_form_method(input_id){
		edit_form.empty();
		var el = find_my(input_id);
		var nodes=[], values=[];
		
		for (var attr, i=0, attrs=el[0].attributes, l=attrs.length; i<l; i++){
				attr = attrs.item(i);
				nodes.push(attr.nodeName);
				values.push(attr.nodeValue);
		}
		var str = "<table border='1' class='table'><tr>";
		nodes.forEach(function(entry) {
			str = str + "<th>" + entry + "</th>";
		});
		str = str + "</tr><tr>";
		values.forEach(function(entry) {
			str = str + "<td>" + entry + "</td>";
		});
		str = str + "</tr></table>";
		str = str + 'Атрибут : Значение<br><input id="edit_form_attr" type="text"> : <input id="edit_form_val" type="text">';
		edit_form.append(str + '<input id="update_input" type="button" value="Обновить">');
		edit_form.val(input_id);
	}
	
	function find_my(input_id){
		var el = $("div#" + input_id).children().first().next();
		if (el.is("span")) {
			el = el.next();
		}
		return el;
	}
	
	function set_edit_delete_listener(){
		$("input[name='delete_input'").unbind("click").click(function(){
			if ($(this).attr("id") === main_form.children().first().next().attr("id")) {
				$(this).parent().next().find("hr").remove();
			}
			if ($(this).parent().attr("id") === edit_form.val()){
				edit_form.hide();
			}
			$(this).parent().remove();
		});
		$("input[name='edit_input'").unbind("click").click(function(){
			if( edit_form.css("display") == "none" ) {
				edit_form.show();
				edit_form_method($(this).attr("id"));
			} else {
				if (edit_form.val() != $(this).attr("id")){
					edit_form_method($(this).attr("id"));
				} else {
					edit_form.hide();
				}
			}
			set_update_input_listener();
		});
	}
	
	function set_update_input_listener(){
		$("input#update_input").unbind("click").click(function(){
			var el = find_my(edit_form.val());
			el.attr($("#edit_form_attr").val(),$("#edit_form_val").val());
			if ($("#edit_form_attr").val() == "name"){
				el.prev().html($("#edit_form_val").val());
			}
			edit_form_method(edit_form.val());
			set_update_input_listener();
		});
	}
	function writeCookie(name,value,days) {
		var date, expires;
		if (days) {
			date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}
	function readCookie(name) {
		var i, c, ca, nameEQ = name + "=";
		ca = document.cookie.split(';');
		for(i=0;i < ca.length;i++) {
			c = ca[i];
			while (c.charAt(0)==' ') {
				c = c.substring(1,c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length,c.length);
			}
		}
		return '';
	}
	localStorage.setItem("key", "value");
	var value = localStorage.getItem("key");
});