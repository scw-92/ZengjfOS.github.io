function clean_show_content() {
    $('#show-content').html(
        "<div class=\"row clearfix\"> \
                <div id=\"show-content_left\" class=\"show_content_left_div col-md-6 column\"> \
                </div> \
                <div id=\"show-content_right\" class=\"show_content_right_div col-md-6 column\"> \
                  <pre> \
                    <code id=\"show-content_code\" class=\"html\"> \
                    </code> \
                  </pre> \
                </div> \
        </div>"
    );
}
function readHTML(){ 
    clean_show_content();

    $.ajax({ 
        async:false, 
        url : "svg/javascript_control_svg_elemet.html", 
        success : function(result){ 
            $('#show-content_left').html(result);
            $('#show-content_code').html(result);
            console.info(result);
            svg_javascript_control_element();
        } 
       
    }); 
} 
$(function(){ 
    console.info("zengjf_codeframe.js");
});

