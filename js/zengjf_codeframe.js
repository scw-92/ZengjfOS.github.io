function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function clean_show_content_with_frame() {
    // pre/code element with horizontal scrollbar breaks the flex layout on Firefox
    //     https://stackoverflow.com/questions/28896807/pre-code-element-with-horizontal-scrollbar-breaks-the-flex-layout-on-firefox#comment46053387_28896807

    $('#show-content').html(
      " \
      <div id=\"code_content_container\" class=\"row clearfix\"> \
        <div class=\"col-md-4 column\"> \
          <div style=\"width:100%;height:100%;\"> \
            <h4 class=\"text-info text-center\"> \
              HTML \
            </h4> \
            <pre class=\"code_vertical_scrollbar\"> \
              <code id=\"show-content_code_html\" class=\"html code_horizontal_scrollbar\"> \
              </code> \
            </pre> \
          </div> \
        </div> \
        <div class=\"col-md-4 column\"> \
          <h4 class=\"text-center\"> \
            Javascript\
          </h4> \
          <pre class=\"code_vertical_scrollbar\"> \
            <code id=\"show-content_code_js\" class=\"html code_horizontal_scrollbar\"> \
            </code> \
          </pre> \
        </div> \
        <div class=\"col-md-4 column\"> \
          <h4 class=\"text-center\"> \
            CSS \
          </h4> \
          <pre class=\"code_vertical_scrollbar\"> \
            <code id=\"show-content_code_css\" class=\"html code_horizontal_scrollbar\"> \
            </code> \
          </pre> \
        </div> \
      </div> \
      <div class=\"row clearfix text-center\"> \
        <div id=\"show-content_render\" class=\"show_content_render_div col-md-12 column\"> \
        </div> \
      </div> \
      "
    );

    document.getElementById('code_content_container').style.height = window.screen.availHeight * 2 / 5 + "px";
    document.getElementById('show-content_render').style.height = window.screen.availHeight / 3 + "px";

    code_vertical_scrollbar = $("pre.code_vertical_scrollbar");
    for( i = 0; i < code_vertical_scrollbar.length; i++ ) {
        code_vertical_scrollbar[i].style.maxHeight = window.screen.availHeight * 2 / 5 + "px";
    }
}

function readHTML(){ 
    clean_show_content_with_frame();

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
} 

function read_home(){ 
    $.ajax({ 
        async:false, 
        url : "home.html", 
        success : function(result){ 
            // show home.html
            $('#show-content').html(result);
            console.info(configs["nav"]);
        } 
    }); 
} 

$(function(){ 
    read_home();
});

