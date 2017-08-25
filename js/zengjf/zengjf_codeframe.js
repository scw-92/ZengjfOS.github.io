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

function clean_show_content_with_frame(frame_type, path_name) {
    // pre/code element with horizontal scrollbar breaks the flex layout on Firefox
    //     https://stackoverflow.com/questions/28896807/pre-code-element-with-horizontal-scrollbar-breaks-the-flex-layout-on-firefox#comment46053387_28896807
    if (frame_type == "SVG") {
        $.get('templates/svg/svg_frame.html', function(src) {
            var template = Handlebars.compile(src);
            // var context = { name: "zhaoshuai", content: "learn Handlebars"};
            // var html = template(context);
            // $('#show-content').html(html);
            $('#show-content').html(template());

            // document.getElementById('code_content_container').style.height = window.screen.availHeight * 2 / 5 + "px";
            code_content_container = $(".code_content_container");
            for( i = 0; i < code_content_container.length; i++ ) {
                code_content_container[i].style.maxHeight = window.screen.availHeight * 4 / 9 + "px";
            }

            code_vertical_scrollbar = $("pre.code_vertical_scrollbar");
            for( i = 0; i < code_vertical_scrollbar.length; i++ ) {
                code_vertical_scrollbar[i].style.maxHeight = window.screen.availHeight * 1 / 3 + "px";
            }

            $.get("src/svg/" + path_name + "/html/index.html", function(result) {
                // show html
                $('#show-content_render').html(result);

                // show source code, replace '<' and '>'
                result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");
                $('#show-content_code_html').html(result);
                console.info(result);

                // do javascript
                svg_javascript_control_element();

                // high light source code
                $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                });
            }); 
        });
    }
}

function SVG_frame_with_content(obj){ 
    clean_show_content_with_frame("SVG", configs["nav"]["SVG"]["pages"][obj.innerHTML] + "_" + obj.innerHTML);
} 

function show_home_page(){ 
    $.ajax({ 
        async:false, 
        url : "home.html", 
        success : function(src){ 
            // show home.html
            var template = Handlebars.compile(src);
            $('#show-content').html(template({"title" : configs["title"]}));
        } 
    }); 
} 

function footerPosition(){
    $("footer").removeClass("fixed-bottom");
    var contentHeight = document.body.scrollHeight, //网页正文全文高度
        winHeight = window.innerHeight;             //可视窗口高度，不包括浏览器顶部工具栏
    if(!(contentHeight > winHeight)){
        //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
        $("footer").addClass("fixed-bottom");
    }
}

$(function(){ 
    show_nav_frame();
    show_home_page();

    footerPosition();
    $(window).resize(footerPosition);

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

