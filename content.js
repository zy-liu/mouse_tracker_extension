var current_page_url = window.location.href;
var mouse_tracking_info = "";
//var mouse_tracking_count = 0;
//var mouse_tracking_group_limit = 100;
var mouse_tracking_baseline_stamp = (new Date()).getTime();
var mouse_tracking_time_stamp = mouse_tracking_baseline_stamp;
var mouse_tracking_pos_stamp = { 'x': 0, 'y': 0 };
var mouse_tracking_scroll_stamp = {'scrollX':0, 'scrollY':0};
var mouse_tracking_least_move_interval = 20;//ms
var mouse_tracking_least_move_distance = 20;//px


document.onmousemove = log_mouse_tracking;
send_mouse_info(formInfo("PAGE_START", {}));

var isTargetWindow = true;
$(window).focus(function() {
   isTargetWindow = true;
   send_mouse_info(formInfo("JUMP_IN", {}));
   mouse_tracking_time_stamp = (new Date()).getTime();
});

$(window).blur(function() {
   if(isTargetWindow)
   {
        send_mouse_info(formInfo("JUMP_OUT", {}));
        isTargetWindow = false;
   }
});

window.onbeforeunload = function (e){
    
    send_mouse_info(formInfo("PAGE_END", {}));
    //return '';
};


$(window).scroll(function () {
    var c_left = $(this).scrollLeft();
    var c_top = $(this).scrollTop();
    var new_x = mouse_tracking_pos_stamp.x + c_left - mouse_tracking_scroll_stamp.scrollX;
    var new_y = mouse_tracking_pos_stamp.y + c_top - mouse_tracking_scroll_stamp.scrollY;
    var message = {};
    message.from = {x: mouse_tracking_pos_stamp.x, y: mouse_tracking_pos_stamp.y};
    message.to = {x: new_x, y: new_y};

    mouse_tracking_scroll_stamp.scrollX = c_left;
    mouse_tracking_scroll_stamp.scrollY = c_top;
    mouse_tracking_pos_stamp.x = new_x;
    mouse_tracking_pos_stamp.y = new_y;
    send_mouse_info(formInfo("SCROLL", message));
});



function log_mouse_tracking(ev){
    
    var new_time_stamp = (new Date()).getTime();
    var cur_pos = getMousePos(ev);
    var time_interval = new_time_stamp - mouse_tracking_time_stamp;
    var time_start = mouse_tracking_time_stamp - mouse_tracking_baseline_stamp;
    var time_end = new_time_stamp - mouse_tracking_baseline_stamp;
    var abs_pos_distance = Math.abs(cur_pos.x - mouse_tracking_pos_stamp.x) + Math.abs(cur_pos.y - mouse_tracking_pos_stamp.y);
    if(time_interval < mouse_tracking_least_move_interval || abs_pos_distance < mouse_tracking_least_move_distance){
        return;
    }
    
    var info = {}
    info.from = {x: mouse_tracking_pos_stamp.x, y: mouse_tracking_pos_stamp.y}
    info.to = {x: cur_pos.x, y: cur_pos.y};
    info.time = time_interval;
    info.start_time = time_start;
    info.end_time = time_end;
    //"FROM\tx=" +  + "\ty=" +  + "\tTO\tx=" +cur_pos.x + "\ty=" + cur_pos.y + "\ttime=" + time_interval + "\tstart=" + time_start + "\tend="+ time_end;
    
    send_mouse_info(formInfo("MOUSE_MOVE", info));
    mouse_tracking_time_stamp = new_time_stamp;
    mouse_tracking_pos_stamp = cur_pos;
}

function time_info(){
    var new_time_stamp = (new Date()).getTime();
    var time_point = new_time_stamp - mouse_tracking_baseline_stamp;
    return time_point;
}

function send_mouse_info(info){
    chrome.runtime.sendMessage({mouse_log: info});
    //mouse_tracking_info = mouse_tracking_info + info;
    //mouse_tracking_count ++;
    //if(mouse_tracking_count >= mouse_tracking_group_limit){
        //ajax_log_message(mouse_tracking_info);
        //mouse_tracking_count = 0;
        //mouse_tracking_info = "";
    //}
}

function getMousePos(ev) {
    //alert("get mouse");
    var e = ev || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var clientLeft = document.body.clientLeft;
    var clientTop = document.body.clientTop;
    var x = e.pageX || e.clientX + scrollX - clientLeft;
    //alert("x:" + x);
    var y = e.pageY || e.clientY + scrollY - clientTop;
    //alert('x: ' + x + '\ny: ' + y);
    return { 'x': x, 'y': y };
}

function formInfo(action_info, log_obj){
    var obj = {};
    obj.action = action_info;
    obj.info = log_obj;
    
    var time_str = time_info();
    var abs_time_str = (new Date()).getTime();
    obj.time = time_str;
    obj.abs_time = abs_time_str;
    //console.log(info);
    return obj;
}
