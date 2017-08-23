function readHTML(){ 
    $.ajax({ 
        async:false, 
        url : "index.html", 
        success : function(result){ 
            //$('#show-content').html(result);
            console.info(result);
        } 
       
    }); 
} 
$(function(){ 
    console.info("zengjf_codeframe.js");
});

