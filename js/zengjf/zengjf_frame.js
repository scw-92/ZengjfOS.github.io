function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function show_nav_frame() {
    $.get('templates/nav.html', function(src) {
        Handlebars.registerHelper('getFunctionName', function(object, options) {
            return configs["nav"][options.substr(0, options.lastIndexOf("_"))]["function_name"];
        });

        Handlebars.registerHelper('getObjectValue', function(object, options) {
            return options.fn(object[object["parts"][options.data.index]]);
        });

        var template = Handlebars.compile(src);
        $('#bs-example-navbar-collapse-1').html(template(configs["nav"]));

    });
}

function clean_show_content_with_frame(frame_type, demo_name, path_name) {
    // pre/code element with horizontal scrollbar breaks the flex layout on Firefox
    //     https://stackoverflow.com/questions/28896807/pre-code-element-with-horizontal-scrollbar-breaks-the-flex-layout-on-firefox#comment46053387_28896807
    if (frame_type == "SVG") {

        dynamic_get_CSS('src/' + frame_type + '/' + path_name + '/demo.css');
        dynamic_get_CSS('templates/' + frame_type + '/svg_frame.css');

        $.get('templates/' + frame_type + '/svg_frame.html', function(src) {
            var template = Handlebars.compile(src);
            $('#show-content').html(template());

            code_content_container = $(".code_content_container");
            for( i = 0; i < code_content_container.length; i++ ) {
                code_content_container[i].style.maxHeight = window.screen.availHeight * 4 / 9 + "px";
            }

            code_vertical_scrollbar = $("pre.code_vertical_scrollbar");
            for( i = 0; i < code_vertical_scrollbar.length; i++ ) {
                code_vertical_scrollbar[i].style.maxHeight = window.screen.availHeight * 1 / 3 + "px";
            }

            $.get("src/" + frame_type + "/" + path_name + "/demo.html", function(result) {
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
                dynamic_get_script(frame_type, demo_name, path_name, "demo.js");
            }); 
        });
    } else if (frame_type == "Show_Time") {

        dynamic_get_CSS('src/' + frame_type + '/' + path_name + '/demo.css');

        $.get("src/" + frame_type + "/" + path_name + "/demo.html", function(result) {
            // show html
            $('#show-content').html(result);

            // finish html and get javascript to execute
            dynamic_get_script(frame_type, demo_name, path_name, "demo.js");
        }); 
    }
}

function SVG_frame_with_content(obj){ 
    // path_name = type + index + demo_name;
    demo_name = obj.innerHTML;
    path_name = configs["nav"]["SVG"]["pages"][obj.innerHTML] + "_" + obj.innerHTML;

    clean_show_content_with_frame("SVG", demo_name, path_name);
}

function Show_Time_frame_with_content(obj){ 
    // path_name = type + index + demo_name;
    demo_name = obj.innerHTML;
    path_name = configs["nav"]["Show_Time"]["pages"][obj.innerHTML] + "_" + obj.innerHTML;

    clean_show_content_with_frame("Show_Time", demo_name, path_name);
}

function show_home_page(){ 
    $.ajax({ 
        async:false, 
        url : "home_page.html", 
        success : function(src){ 
            // show home.html
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

function call_string_function(function_name) {
    // string as a function call
    var fn = window[function_name]; 
    if(typeof fn === 'function') {
        fn();
    }
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
function dynamic_get_script(type, demo_name, path_name, file_name) {
    if (typeof someObject == 'undefined') $.loadScript("src/" + type + "/" + path_name + '/' + file_name, function(){
        //Stuff to do after someScript has loaded
        call_string_function(demo_name);
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

