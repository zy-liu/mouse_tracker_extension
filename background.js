var mouse_tracking_group_limit = 10;
var mouse_tracking_info_list = [];
var current_url = "";


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    current_url = sender.tab.url;
    var info = request.mouse_log;
    info.site = current_url;
    send_mouse_info(info);
    console.log(JSON.stringify(info));
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    
    
    if(tab.url.match(/https:\/\/s\.taobao\.com\/*/)) {
        if(changeInfo.status == "complete") {
            chrome.tabs.executeScript(null, {file: "content_link.js"});
        }
    }
    else {
        chrome.tabs.executeScript(null, {file: "content_link.js"});
    }
    
});

//chrome.tabs.onActivated.addListener(function(activeInfo){
        //chrome.tabs.query({active: true,lastFocusedWindow: true}, function(tab){
            //var active_url = tab[0].url;
        //});
    //});

function send_mouse_info(info){
    mouse_tracking_info_list.push(info);
    if(mouse_tracking_info_list.length >= mouse_tracking_group_limit){
        ajax_log_message(mouse_tracking_info_list);
        mouse_tracking_info_list = [];
    }
}

function ajax_log_message(info_list){
    
    //alert(encode_str + "\n");
    var log_url = "http://10.129.248.102:8000/log_process/";
//    $.ajax({
//        type:'POST',
//        url:log_url,
//        data:{
//            mouse_info: info_list
//        },
//        complete: function (jqXHR, textStatus) {
//            //alert(textStatus + "----" + jqXHR.status + "----" + jqXHR.readyState);
//        }
//    });

}