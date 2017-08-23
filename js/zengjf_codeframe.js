function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function clean_show_content_with_frame() {
    // pre/code element with horizontal scrollbar breaks the flex layout on Firefox
    //     https://stackoverflow.com/questions/28896807/pre-code-element-with-horizontal-scrollbar-breaks-the-flex-layout-on-firefox#comment46053387_28896807

    $('#show-content').html(
        "<div class=\"row clearfix\"> \
          <div id=\"show-content_left\" class=\"show_content_left_div col-md-6 column\"> \
          </div> \
          <div id=\"show-content_right\" class=\"show_content_right_div col-md-6 column\"> \
            <pre> \
              <code id=\"show-content_code\" class=\"html horizontal_scrollbar\"> \
              </code> \
            </pre> \
          </div> \
        </div>"
    );
}

function readHTML(){ 
    clean_show_content_with_frame();

    $.ajax({ 
        async:false, 
        url : "svg/javascript_control_svg_elemet.html", 
        success : function(result){ 
            // show html
            $('#show-content_left').html(result);

            // show source code, replace '<' and '>'
            result = replaceAll(replaceAll(result, "<", "&lt;"), ">", "&gt;");
            $('#show-content_code').html(result);
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
$(function(){ 
    console.info("zengjf_codeframe.js");
});

