function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function show_nav_frame() {
    $.get('templates/nav.tmpl', function(src) {
        Handlebars.registerHelper('getFunctionName', function(object, options) {
            return object[options.substr(0, options.lastIndexOf('_'))]["function_name"];  
        });

        var template = Handlebars.compile(src);
        $('#bs-example-navbar-collapse-1').html(template(configs["nav"]));

    });
}

function clean_show_content_with_frame() {
    // pre/code element with horizontal scrollbar breaks the flex layout on Firefox
    //     https://stackoverflow.com/questions/28896807/pre-code-element-with-horizontal-scrollbar-breaks-the-flex-layout-on-firefox#comment46053387_28896807
    $.get('templates/svg/svg_frame.tmpl', function(src) {
        var template = Handlebars.compile(src);
        // var context = { name: "zhaoshuai", content: "learn Handlebars"};
        // var html = template(context);
        // $('#show-content').html(html);
        $('#show-content').html(template());

        document.getElementById('code_content_container').style.height = window.screen.availHeight * 2 / 5 + "px";
        document.getElementById('show-content_render').style.height = window.screen.availHeight / 3 + "px";

        code_vertical_scrollbar = $("pre.code_vertical_scrollbar");
        for( i = 0; i < code_vertical_scrollbar.length; i++ ) {
            code_vertical_scrollbar[i].style.maxHeight = window.screen.availHeight * 2 / 5 + "px";
        }

        $.ajax({ 
            async:false, 
            url : "svg/javascript_control_svg_elemet.html", 
            success : function(result){ 
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
            } 
        }); 
    });
}

function SVG_frame_with_content(obj){ 
    console.info(configs["nav"]["SVG"]["pages"][obj.innerHTML]);
    clean_show_content_with_frame();
} 

function show_home_page(){ 
    $.ajax({ 
        async:false, 
        url : "home.html", 
        success : function(result){ 
            // show home.html
            $('#show-content').html(result);
        } 
    }); 
} 

$(function(){ 
    show_nav_frame();
});

