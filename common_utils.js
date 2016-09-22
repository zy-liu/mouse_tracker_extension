/**
 * Code shared by content scripts and background scripts 
 * Created by defaultstr on 9/22/16.
 */
var mouse_tracking_baseline_stamp = (new Date()).getTime();

function time_info(){
    var new_time_stamp = (new Date()).getTime();
    var time_point = new_time_stamp - mouse_tracking_baseline_stamp;
    return time_point;
}

function formInfo(action_info, log_obj){
    var obj = {};
    obj.action = action_info;
    obj.message = log_obj;
    
    var time_str = time_info();
    obj.time = time_str;
    var abs_time_str = (new Date()).getTime();
    obj.abs_time = abs_time_str;
    //console.log(info);
    return obj;
}
