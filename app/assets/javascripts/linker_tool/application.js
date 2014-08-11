// // This is a manifest file that'll be compiled into application.js, which will include all the files
// // listed below.
// //
// // Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// // or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
// //
// // It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// // compiled file.
// //
// // Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// // about supported directives.
// //
// //= require jquery
// //= require jquery_ujs
// //= require_tree .


//$(document).ready(function() {
//	var token = "#{@main_form_token}";
//	var form = '<form accept-charset="UTF-8" action="" id="main_linker_form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&amp;#x2713;" /><input name="authenticity_token" type="hidden" value="' + token + '" /></div></form>';
//	console.log("Loading form...");
//	reinit();
//	
//});
$(document).ready(function() {
	var token = "#{@main_form_token}";
	var form = '<form accept-charset="UTF-8" action="" id="main_linker_form" method="post"><div style="margin:0;padding:0;display:inline"><input name="utf8" type="hidden" value="&amp;#x2713;" /><input name="authenticity_token" type="hidden" value="' + token + '" /></div></form>';
	reinit_form();
	var main_form = $("div#linker_form_gem form#main_linker_form");
	var main_form_div = $("div#linker_form_gem form#main_linker_form div");
	var edit_form = $("div#linker_form_gem pre#edit_input_form");
	var last_form_html = localStorage.getItem("linker_form_gem_html");
	if (last_form_html !== "") {
		main_form.replaceWith(last_form_html);
		main_form = $("div#linker_form_gem form#main_linker_form");
		main_form_div = $("div#linker_form_gem form#main_linker_form div");
	}
	var authenticity_token = '<input name="authenticity_token" type="hidden" value="' + token + '">';
	var num = 1;
	$("div#linker_form_gem input[name='authenticity_token']").remove();
	main_form.attr("method","get");
	$("div#linker_form_gem #link").change(function(){
			main_form.attr("action",$("div#linker_form_gem #link").val());
			show_full_form_html(false);
	});
	$("div#linker_form_gem #mtd").change(function(){
		change_method();
		show_full_form_html(false);
	});
	change_method();
	$("div#linker_form_gem input#main_linker_form_submit").click(function(){
		main_form.submit();
	});
	$("div#linker_form_gem #new_input_submit").click(function(){
		check_num();
		var name = $("div#linker_form_gem input#new_input_name").val();
		var type = $("div#linker_form_gem select#new_input_type").val();
		var this_input;
		if (type == "select"){
		  this_input = '<select id="' + name + '" name="' + name + '"></select>';
		} else {
		  this_input = '<input id="' + name + '" name="' + name + '" type="' + type + '">';
		}
		var str = '<span id="input_name">' + name + '</span> ' + this_input + '<input id="' + num + '" name="edit_input" value="edit" type="button">'+ '<input id="' + num + '" name="delete_input" value="delete" type="button">';
		if (main_form.children().length > 1) {
			str = '<hr>' + str;
		}
		str = '<div id="' + num + '">' + str + "</div";
		main_form.append(str);
		set_edit_delete_listener();
		show_full_form_html(false);
	});
	set_edit_delete_listener();
	$("div#linker_form_gem #new_input_clear").click(function(){
		$("div#linker_form_gem input#new_input_name").val("");
		$("div#linker_form_gem select#new_input_type").val("text");
	});
	$("div#linker_form_gem #new_input_delete_all").click(function(){
		var block_html = $("div#linker_form_gem form#main_linker_form div").clone().wrap('<p>').parent().html();
		main_form.empty();
		main_form.append(block_html);
		main_form_div = $("div#linker_form_gem form#main_linker_form div");
		edit_form.hide();
		show_full_form_html(false);
	});
	$("div#linker_form_gem #full_form_html").click(function(){
		show_full_form_html(true);
	});
	$("div#linker_form_gem #full_routes_button").click(function(){
		$("div#linker_form_gem #full_routes").toggle();
	});
	$("div#linker_form_gem #delete_form_cookie").click(function(){
		localStorage.setItem("linker_form_gem_html","");
	});
	$("div#linker_form_gem #save_form_cookie").click(function(){
		localStorage.setItem("linker_form_gem_html",main_form.clone().wrap('<p>').parent().html());
	});
	$("div#linker_form_gem input[type='text']").change(function(){
		$(this).attr("value",$(this).val());
	});
	$("div#linker_form_gem #show_all_linker_components").click(function(){
		$("div#linker_form_gem #linker_form_gem_main_panel").toggle();
		reinit_form();
	});
	
	function set_post_method(method_name){
		main_form.attr("method","post");
		if (method_name == "post"){
			$("div#linker_form_gem input[name='_method']").remove();
		} else {
			if (!$("div#linker_form_gem input[name='_method']").length) {
					main_form_div.append('<input name="_method" type="hidden" value="' + method_name + '">');
			} else {
					$("div#linker_form_gem input[name='_method']").val(method_name);
			}
		}
		if (!$("div#linker_form_gem input[name='authenticity_token']").length) {
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
		var el = $("div#linker_form_gem div#" + input_id).children().first().next();
		if (el.is("span")) {
			el = el.next();
		}
		return el;
	}
	
	function set_edit_delete_listener(){
		$("div#linker_form_gem input[name='delete_input']").unbind("click").click(function(){
			if ($(this).attr("id") === main_form.children().first().next().attr("id")) {
				$(this).parent().next().find("hr").remove();
			}
			if ($(this).parent().attr("id") === edit_form.val()){
				edit_form.hide();
			}
			$(this).parent().remove();
			show_full_form_html(false);
		});
		$("div#linker_form_gem input[name='edit_input']").unbind("click").click(function(){
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
			show_full_form_html(false);
		});
	}
	
	function set_update_input_listener(){
		$("div#linker_form_gem input#update_input").unbind("click").click(function(){
			var el = find_my(edit_form.val());
			el.attr($("div#linker_form_gem #edit_form_attr").val(),$("div#linker_form_gem #edit_form_val").val());
			if ($("div#linker_form_gem #edit_form_attr").val() == "name"){
				el.prev().html($("div#linker_form_gem #edit_form_val").val());
			}
			edit_form_method(edit_form.val());
			set_update_input_listener();
			show_full_form_html(false);
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
	
	function change_method(){
		if ($("div#linker_form_gem #mtd").val() === "get") { 
				main_form.attr("method","get");
				$("div#linker_form_gem input[name='_method']").remove();
				$("div#linker_form_gem input[name='authenticity_token']").remove();
		} else {
				set_post_method($("div#linker_form_gem #mtd").val());
		}
	}
	
	function check_num(){
		if (main_form.children().length > 1) {
			num = parseInt(main_form.children().last().attr("id")) + 1;
			//console.log(num);
		}
	}
	
	function show_full_form_html(tgl){
		var txta = $("div#linker_form_gem #full_form_html_textarea");
		if (tgl){
			txta.toggle();
		}
		var need_text = main_form.clone().wrap('<p>').parent().html();
		txta.val(need_text);
		var txtaLineHeight = 20;
		var txtaHeight = txta.get(0).scrollHeight;
		var numberOfLines = Math.ceil(txtaHeight/txtaLineHeight - 1);
		txta.css({"height":"","width":"100%"});
		txta.attr("rows",numberOfLines);
	}
	
	function reinit_form(){
		if ($("div#linker_form_gem pre#put_main_form_here").children().length < 1){
			$("div#linker_form_gem pre#put_main_form_here").append(form);
			main_form = $("div#linker_form_gem form#main_linker_form");
			main_form_div = $("div#linker_form_gem form#main_linker_form div");
			change_method();
			console.log("Form with token successfully loaded");
			if ($("div#linker_form_gem pre#put_main_form_here").children().length < 1){
				reinit();
			}
		}
	}
	// localStorage.setItem("key", "value");
	// var value = localStorage.getItem("key");
});