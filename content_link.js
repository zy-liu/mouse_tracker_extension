$(function(){
    $('a')
        .hover(function(){
            base_link_message($(this).get(0), "HOVER");
        })
        
});

$(function(){
    $('a')
        .click(function(){
            base_link_message($(this).get(0), "CLICK");
        })
        
});



function base_link_message(link_obj, action_info){
    var message = "";
    var cur_pos = getMousePos();
    if(link_obj.childNodes.length > 1 && link_obj.childNodes[1].tagName == "IMG")
    {
            message = "type=image";
    }
    else
        message = "type=anchor";
    message = message + "\tx=" + cur_pos.x + "\ty=" + cur_pos.y;
    if(link_obj.href != undefined){
        message = message + "\thref=" + link_obj.href;
    }
    send_mouse_info(formInfo(action_info, message));
}
