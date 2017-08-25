function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function show_nav_frame() {
    $.get('templates/nav.html', function(src) {
        Handlebars.registerHelper('getObjectValue', function(object, options) {
            return options.fn(object[object["parts"][options.data.index]]);
        });

        var template = Handlebars.compile(src);
        $('#bs-example-navbar-collapse-1').html(template(configs["nav"]));

    });
}

function deal_with_SVG_job (frame_type, demo_name, path_name) {
    demo_css  = 'src/' + frame_type + '/' + path_name + '/demo.css';
    demo_js   = 'src/' + frame_type + '/' + path_name + '/demo.js';
    demo_html = 'src/' + frame_type + '/' + path_name + '/demo.html';

    template_css  = 'templates/' + frame_type + '/svg_frame.css';
    template_html = 'templates/' + frame_type + '/svg_frame.html';

    dynamic_get_CSS(demo_css);
    dynamic_get_CSS(template_css);

    $.get(template_html, function(src) {
        var template = Handlebars.compile(src);
        $('#show-content').html(template());

        code_content_container = $(".code_content_container");
        for( i = 0; i < code_content_container.length; i++ ) 
            code_content_container[i].style.maxHeight = window.screen.availHeight * 4 / 9 + "px";

        code_vertical_scrollbar = $("pre.code_vertical_scrollbar");
        for( i = 0; i < code_vertical_scrollbar.length; i++ ) 
            code_vertical_scrollbar[i].style.maxHeight = window.screen.availHeight * 1 / 3 + "px";

        $.get(demo_css, function(result) {

            // show source code, replace '<' and '>'
            result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");
            $('#show-content_code_css').html(result);

            // high light source code
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        }); 

        $.get(demo_html, function(result) {
            // show html
            $('#show-content_render').html(result);

            // show source code, replace '<' and '>'
            result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");
            $('#show-content_code_html').html(result);

            // high light source code
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });

            // finish html and get javascript to execute
            dynamic_get_script(demo_name, demo_js, {"type" : frame_type});
        }); 
    });
}

function deal_with_Show_Time_job (frame_type, demo_name, path_name) {
    demo_css  = 'src/' + frame_type + '/' + path_name + '/demo.css';
    demo_js   = 'src/' + frame_type + '/' + path_name + '/demo.js';
    demo_html = 'src/' + frame_type + '/' + path_name + '/demo.html';

    dynamic_get_CSS(demo_css);

    $.get(demo_html, function(result) {
        // show html
        $('#show-content').html(result);

        // finish html and get javascript to execute
        dynamic_get_script(demo_name, demo_js, {"type" : frame_type});
    }); 
}

function deal_with_About_job (frame_type, demo_name, path_name) {
    console.info(arguments.callee.name);
}

function show_content_with_frame(frame_type, demo_name, path_name) {
    // pre/code element with horizontal scrollbar breaks the flex layout on Firefox
    //     https://stackoverflow.com/questions/28896807/pre-code-element-with-horizontal-scrollbar-breaks-the-flex-layout-on-firefox#comment46053387_28896807
    function_name = "deal_with_" + frame_type + "_job";
    var fn = window[function_name]; 
    if(typeof fn === 'function') 
        fn(frame_type, demo_name, path_name);
}

function nav_click_search_content(obj){ 
    frame_type = obj.parentNode.parentNode.parentNode.getElementsByTagName("a")[0].text;
    demo_name  = obj.innerHTML;
    // path_name = type + index + demo_name;
    path_name  = configs["nav"][frame_type]["pages"][obj.innerHTML] + "_" + obj.innerHTML;

    show_content_with_frame(frame_type, demo_name, path_name);
}

function show_home_page(){ 
    $.ajax({ 
        async:false, 
        url : "home_page.html", 
        success : function(src){ 
            // show home_page.html
            var template = Handlebars.compile(src);
            $('#show-content').html(template({"title" : configs["title"]}));
        } 
    }); 
} 

function footer_position(){
    $("footer").removeClass("fixed-bottom");

    var contentHeight = document.body.scrollHeight, //网页正文全文高度
        winHeight = window.innerHeight;             //可视窗口高度，不包括浏览器顶部工具栏
    if(!(contentHeight > winHeight)){
        //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
        $("footer").addClass("fixed-bottom");
    }
}

function call_string_function(function_name, json_data) {
    // string as a function call
    var fn = window[function_name]; 
    if(typeof fn === 'function') 
        fn(json_data);
}

// dynamic get javascript and run the demo_name function in script file.
jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}
function dynamic_get_script(demo_name, demo_js, json_data) {

    if (typeof someObject == 'undefined') $.loadScript(demo_js, function(result){
        // check for show js code
        show_code_js = $('#show-content_code_js');
        if (show_code_js) {
            show_code_js.html(result);

            // show source code, replace '<' and '>'
            result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");
            $('#show-content_code_js').html(result);

            // high light source code
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        }

        //Stuff to do after someScript has loaded
        call_string_function(demo_name, json_data);
    });
}

function dynamic_get_CSS (file_path) {
    $('head').append('<link rel="stylesheet" type="text/css" href="' + file_path + '">');
}

$(function(){ 
    show_nav_frame();

    // demo string as a function call
    // show_home_page();
    call_string_function("show_home_page");

    footer_position();
    $(window).resize(footer_position);

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });
    console.log(marked('I am using __markdown__.'));
});

