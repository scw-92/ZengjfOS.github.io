/*
	本套os操作流程：
	1：index.html---> js/zengjf/zengjf_config.js（加载json数据）---> js/zengjf/zengjf_frame.js --->show_nav_frame函数（加载nav.html文件数据）-
	-->设置点击事件（onclock）--->跳转到js/zengjf/zengjf_frame.js执行nav_click_search_content函数或者执行nav_language_change函数
	
    2：nav_click_search_content函数 ---> 首先判断是哪个菜单按钮触发了该事件--->其次获取该按钮绑定的文件信息--->调用show_content_with_frame（拼接处理函数名）--->最后调用相应处理函数（
	，deal_with_Show_Time_job等）
	
	3：相应处理函数 --->根据参数拼接文件的url和相应的样式表--->调用dynamic_get_CSS函数加载相应的样式 --->调用$.get向拼接文件发送请求 ---> 将接受的数据解析为html类型显示当前标签元素内

	4：超链接与请求的区别：超链接会跳转到另一个页面，请求是当前页面会获取另一个页面的数据并对这些数据进行处理
*/


var current_language ="";

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace); //正则表达式RegExp，new RegExp(find, 'g')等价于/find/g,g表示全局匹配，
	//本函数的功能是将str中的所有find替换为replace
}

function show_nav_frame() {
    $.get('templates/nav.html', function(src) { //$.get(URL,data,function(data,status,xhr),dataType),字符串src 保存的是templates/nav.html（asp处理后返回的）的文档内容
        var template = _.template(src);
        $('#bs-example-navbar-collapse-1').html(template({"nav":configs["nav"]}));//html（参数） 设置该元素的新值
    });
}


//本函数为响应模式，由nav_click_search_content调用触发）
function deal_with_Demo_Analysis_job (frame_type, demo_name, path_name) { //从外部加载样式，然后向外发送请求并加载相应数据，本函数是加载 src文件夹内容与templates文件夹内容
    demo_css  = 'src/' + frame_type + '/' + path_name + '/demo.css';
    demo_js   = 'src/' + frame_type + '/' + path_name + '/demo.js'; //demo_name对应的函数名在demo.js中被定义
    demo_html = 'src/' + frame_type + '/' + path_name + '/demo.html';

    template_css  = 'templates/' + frame_type + '/svg_frame.css';
    template_html = 'templates/' + frame_type + '/svg_frame.html';

    dynamic_get_CSS(demo_css);//将该样式加载到head（从尾部添加）标签中
    dynamic_get_CSS(template_css);
	//首先加载样式
	

    $.get(template_html, function(src) {//向template_html文件发送请求，将请求结果保存在src中
        var template = _.template(src);
        $('#show-content').html(template());//修改id是show-content的元素的内容

        code_content_container = $(".code_content_container");//获取class是code_content_container的元素
        for( i = 0; i < code_content_container.length; i++ ) 
            code_content_container[i].style.maxHeight = window.screen.availHeight * 4 / 9 + "px";

        code_vertical_scrollbar = $("pre.code_vertical_scrollbar");
        for( i = 0; i < code_vertical_scrollbar.length; i++ ) 
            code_vertical_scrollbar[i].style.maxHeight = window.screen.availHeight * 1 / 3 + "px";

        $.get(demo_css, function(result) {
            // show source code, replace '<' and '>'
            result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");//将代码区的<替换为&lt，将>替换为&gt,浏览器会把&lt与&gt解释为<,>
            $('#show-content_code_css').html(result);
        }); 

        $.get(demo_html, function(result) {
            // show html
            $('#show-content_render').html(result);

            // show source code, replace '<' and '>'
            result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");
            $('#show-content_code_html').html(result);

            // finish html and get javascript to execute
            dynamic_get_script(demo_name, demo_js, {"type" : frame_type});
        }); 
    });
}

function deal_with_Show_Time_job (frame_type, demo_name, path_name) {//本函数为响应模式，由nav_click_search_content调用触发
    demo_css  = 'src/' + frame_type + '/' + path_name + '/demo.css';
    demo_js   = 'src/' + frame_type + '/' + path_name + '/demo.js';
    demo_html = 'src/' + frame_type + '/' + path_name + '/demo.html';
	//设置文件路劲
	

    dynamic_get_CSS(demo_css);
	//加载样式表
	

	//设置元素(DIV)内容
    $.get(demo_html, function(result) {
        // show html
        $('#show-content').html(result);

        // finish html and get javascript to execute
        dynamic_get_script(demo_name, demo_js, {"type" : frame_type});
    }); 
}

function deal_with_About_job (frame_type, demo_name, path_name) {
    console.info(arguments.callee.name);

    if (IsURL(current_page['url'])) {
        readme_md = path_name;
    } else {
        readme_md  = 'src/' + frame_type + '/' + path_name + '/README.md';
    }

    template_css  = 'templates/' + frame_type + '/about_frame.css';
    template_html = 'templates/' + frame_type + '/about_frame.html';

    dynamic_get_CSS(template_css);

    $.get(template_html, function(src) {
        var template = _.template(src);
        $('#show-content').html(template({"title" : demo_name}));

        $.get(readme_md, function(result) {
            subfix = readme_md.split('.').pop();

            if (subfix == "md") {
                $("#markdown-body_content").html(marked(result));
            } else if (subfix == "html") {
                $("#markdown-body_content").html(result);
            }

            // high light source code
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
                hljs.lineNumbersBlock(block);
            });
        });
    }); 
}

function deal_with_Keep_Walk_job (frame_type, demo_name, path_name) {
    console.info(arguments.callee.name);

    readme_md  = 'src/' + frame_type + '/' + path_name + '/README.md';

    template_css  = 'templates/' + frame_type + '/keep_walk_frame.css';
    template_html = 'templates/' + frame_type + '/keep_walk_frame.html';

    dynamic_get_CSS(template_css);

    $.get(template_html, function(src) {
        var template = _.template(src);
        $('#show-content').html(template({"title" : demo_name}));

        $.get(readme_md, function(result) {
            subfix = readme_md.split('.').pop();

            if (subfix == "md") {
                $("#markdown-body_content").html(marked(result));
            } else if (subfix == "html") {
                $("#markdown-body_content").html(result);
            }

            // high light source code
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
                hljs.lineNumbersBlock(block);
            });
        });
    }); 
}

function show_content_with_frame(frame_type, demo_name, path_name) //frame_type（导航栏的选项）, demo_name（超链接的名字，也就是菜单选项）, path_name（超链接地址）
    // pre/code element with horizontal scrollbar breaks the flex layout on Firefox
    //     https://stackoverflow.com/questions/28896807/pre-code-element-with-horizontal-scrollbar-breaks-the-flex-layout-on-firefox#comment46053387_28896807

    function_name = "deal_with_" + frame_type + "_job";
    var fn = window[function_name]; 
    if(typeof fn === 'function') 
        fn(frame_type, demo_name, path_name);
}

function IsURL(str_url){
    var strRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

    var re=new RegExp(strRegex); 
    if (re.test(str_url))
        return (true); 
    else
        return (false); 
}

function getNavigationMapsValue(map_key) {//根据nav.map的key获取nav.map的值
    var value = "";
    if (current_language.indexOf("en") != -1) {
        return map_key;
    } else {
        _.each(configs.nav.maps, (item, key, list) => {
            if (_.keys(item)[0] == map_key) {
                value = (item[map_key]);
            }
        });
    }

    return value;
}

function nav_click_search_content(obj){ //点击事件,跟换主页面的显示内容，obj是导航栏中的菜单按钮

    frame_type = getNavigationMapsValue(obj.parentNode.parentNode.parentNode.getElementsByTagName("a")[0].text);//获取相应的导航栏的内容（比如 Demo_Analysis，Keep_Walk等）
	//getElementsByTagName() 方法可返回带有指定标签名的对象的集合
    demo_name  = obj.innerHTML;//获取超链接的显示内容
    current_page = configs["nav"][frame_type]["pages"][obj.innerHTML];//obj.innerHTML,标签<a>的内容
//获取文件对象
	
	
	//判断文件对像的类型
    if (current_page.hasOwnProperty('markdown') //hasOwnProperty()函数的返回值为Boolean类型。如果对象object具有名称为propertyName的属性，则返回true，否则返回false。
            && current_page['markdown'] == "url") {
        show_content_with_frame(frame_type, demo_name, current_page['url']);//在当前页面显示current_page文件对象的内容
    } else {
        // path_name = type + index + demo_name;
        path_name  = current_page["index"] + "_" + obj.innerHTML;
        show_content_with_frame(frame_type, demo_name, path_name);
    }
}

function show_home_page(obj){ //点击事件 对应  zengjf (ZengjfOS) 

    if (configs.hasOwnProperty('home_page')
            && configs['home_page'].hasOwnProperty('show')
            && configs['home_page']['show']) {

        _.each(configs['home_page'], (val_e, key_e) => {
            frame_type = key_e;
            _.each(val_e["pages"], (val_i, key_i) => {
                demo_name = key_i;
                path_name = val_i["index"] + "_" + demo_name;
                show_content_with_frame(frame_type, demo_name, path_name);
            });
        });

        // just show a time
        configs['home_page']['show'] = false;
    } else {
        $.ajax({ 
            async:false, 
            url : "templates/home_page.html", 
            success : function(src){ 
                // show home_page.html
                var template = _.template(src);
                $('#show-content').html(template({"title" : configs["title"]}));
            } 
        }); 
    }
} 


function footer_position(){//设置footer标签位置
    $("footer").removeClass("fixed-bottom");

    var contentHeight = document.body.scrollHeight, //网页正文全文高度
        winHeight = window.innerHeight;             //可视窗口高度，不包括浏览器顶部工具栏
    if(!(contentHeight > winHeight)){
        //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
        $("footer").addClass("fixed-bottom");
    }
}

function call_string_function(function_name, json_data) { // 将json_data传递给function_name函数
    // string as a function call
    var fn = window[function_name]; //window也是一个对象。所以可以用[]存取对象里的属性,一般属性名不是固定的时候用[]获取
    if(typeof fn === 'function') 
        fn(json_data);
}

// dynamic get javascript and run the demo_name function in script file.
jQuery.loadScript = function (url, callback) {//加载成功后利用ajax进行通信请求
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}
function dynamic_get_script(demo_name, demo_js, json_data) {//自动获取脚本

    if (typeof someObject == 'undefined') 
		
		{
			$.loadScript(demo_js, function(result){//加载脚本后执行会掉函数(通过ajax技术在后台获取该脚本数据，保存在result变量中)
        // check for show js code
        show_code_js = $('#show-content_code_js');
        if (show_code_js) {//判断show_code_js元素是否存在
            show_code_js.html(result);

            // show source code, replace '<' and '>'
            result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");
            $('#show-content_code_js').html(result);

            // high light source code
            $('pre code').each(function(i, block) {//设置所有pre_code元素，i表示查询到的pre_code元素的下标，block表示查询到的元素
                hljs.highlightBlock(block);//使代码高亮
                hljs.lineNumbersBlock(block);
            });
        }

        //Stuff to do after someScript has loaded
        call_string_function(demo_name, json_data);
    }
		});
}

function dynamic_get_CSS (file_path) {//动态加载样式
    $('head').append('<link rel="stylesheet" type="text/css" href="' + file_path + '">');
}//在head标签中动态插入<link rel="stylesheet" type="text/css" href="' + file_path + '">样式

function nav_language_change(obj) {//设置nav导航栏语言类型（本函数为响应模式，点击触发该函数）
    var language = "";
    if (obj == undefined ) {
        language = $.i18n.normaliseLanguageCode({"language" : ""});
    } else {
        language = obj.innerHTML.toString();
        $.i18n.normaliseLanguageCode({"language": language});
    }

    current_language = language;

    // This will initialize the plugin 
    // and show two dialog boxes: one with the text "Olá World"
    // and other with the text "Good morning John!" 
    // How to dynamically change language using jquery-i18n-properties and JavaScript?
    //    https://stackoverflow.com/questions/15637059/how-to-dynamically-change-language-using-jquery-i18n-properties-and-javascript
    jQuery.i18n.properties({
        name:'lang', 
        path:'language/', 
        mode:'both',
        language: language,
        async: true,
        callback: function() {//设置语言类型
            // We specified mode: 'both' so translated values will be
            // available as JS vars/functions and as a map

            // Accessing a simple value through the map
            $('.lang_Demo_Analysis')[0].childNodes[0].nodeValue = jQuery.i18n.prop("lang_Demo_Analysis");
            $(".lang_Show_Time")[0].childNodes[0].nodeValue = jQuery.i18n.prop("lang_Show_Time");
            $(".lang_Keep_Walk")[0].childNodes[0].nodeValue = jQuery.i18n.prop("lang_Keep_Walk");
            $(".lang_About")[0].childNodes[0].nodeValue = jQuery.i18n.prop("lang_About");
            console.info(jQuery.i18n.prop("lang_language"));
            $(".lang_language")[0].childNodes[0].nodeValue = jQuery.i18n.prop("lang_language");
        }
    });
}

class Zengjf_utils {//此处未开发
    constructor() {
        console.info("Zengjf_utils constructor");
    }

}

class ZengjfOS extends Zengjf_utils{ //此处未开发

    constructor(options) {
        var defaults = { validate: false, limit: 5, name: "foo" };
 
        // Merge defaults and options, without modifying defaults
        var settings = $.extend({}, defaults, options ||{});

        super()
    }

}



$(function(){ //文字加载完后要执行的函数
    show_nav_frame(); //解析templates/nav.html文件，设置nav导航栏

    // demo string as a function call
    // show_home_page();
   
   
   ("show_home_page");

    footer_position(); //设置footer标签的位置
    $(window).resize(footer_position);//根据窗口调整footer标签的位置

    marked.setOptions({  //设置文本内容的，比如设置语法高亮，渲染等，此处为开发  格式：marked(markdownString [,options] [,callback])
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });

    zengjfos = new ZengjfOS();//此处未开发

    nav_language_change();
});

