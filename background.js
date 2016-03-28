var mouse_tracking_count = 0;
var mouse_tracking_group_limit = 1;
var mouse_tracking_info = "";


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    info = request.mouse_log;
    send_mouse_info(info);

});

function send_mouse_info(info){
    mouse_tracking_info = mouse_tracking_info + info;
    mouse_tracking_count ++;
    if(mouse_tracking_count >= mouse_tracking_group_limit){
        ajax_log_message(mouse_tracking_info);
        mouse_tracking_count = 0;
        mouse_tracking_info = "";
    }
}

function ajax_log_message(log_str){
	console.log(log_str);

}