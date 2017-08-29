function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function show_nav_frame() {
    $.get('templates/nav.html', function(src) {
        var template = _.template(src);
        $('#bs-example-navbar-collapse-1').html(template({"nav":configs["nav"]}));
    });
}

function deal_with_Demo_Analysis_job (frame_type, demo_name, path_name) {
    demo_css  = 'src/' + frame_type + '/' + path_name + '/demo.css';
    demo_js   = 'src/' + frame_type + '/' + path_name + '/demo.js';
    demo_html = 'src/' + frame_type + '/' + path_name + '/demo.html';

    template_css  = 'templates/' + frame_type + '/svg_frame.css';
    template_html = 'templates/' + frame_type + '/svg_frame.html';

    dynamic_get_CSS(demo_css);
    dynamic_get_CSS(template_css);

    $.get(template_html, function(src) {
        var template = _.template(src);
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

function show_content_with_frame(frame_type, demo_name, path_name) {
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

function getNavigationMapsValue(map_key) {
    var value = "";

    _.each(configs.nav.maps, (item, key, list) => {
        if (_.keys(item)[0] == map_key) {
            value = (item[map_key]);
        }
    });

    return value;
}

function nav_click_search_content(obj){ 
    frame_type = getNavigationMapsValue(obj.parentNode.parentNode.parentNode.getElementsByTagName("a")[0].text);
    demo_name  = obj.innerHTML;
    current_page = configs["nav"][frame_type]["pages"][obj.innerHTML];

    console.info(current_page);
    if (current_page.hasOwnProperty('markdown') 
            && current_page['markdown'] == "url") {
        show_content_with_frame(frame_type, demo_name, current_page['url']);
    } else {
        // path_name = type + index + demo_name;
        path_name  = current_page["index"] + "_" + obj.innerHTML;
        show_content_with_frame(frame_type, demo_name, path_name);
    }
}

function show_home_page(){ 
    
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
                hljs.lineNumbersBlock(block);
            });
        }

        //Stuff to do after someScript has loaded
        call_string_function(demo_name, json_data);
    });
}

function dynamic_get_CSS (file_path) {
    $('head').append('<link rel="stylesheet" type="text/css" href="' + file_path + '">');
}

class Zengjf_utils {
    constructor() {
        console.info("Zengjf_utils constructor");
    }

}

class ZengjfOS extends Zengjf_utils{

    constructor(options) {
        var defaults = { validate: false, limit: 5, name: "foo" };
 
        // Merge defaults and options, without modifying defaults
        var settings = $.extend({}, defaults, options ||{});

        super()
    }

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

    zengjfos = new ZengjfOS();
});

