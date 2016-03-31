var mouse_tracking_count = 0;
var mouse_tracking_group_limit = 1;
var mouse_tracking_info = "";
var current_url = "";


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    current_url = sender.tab.url;
    info = request.mouse_log + '\t' + "SITE=" + current_url;
    send_mouse_info(info);

});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    
    if(tab.url.match(/https:\/\/s\.taobao\.com\/*/)){
        if(changeInfo.status == "complete") {
            chrome.tabs.executeScript(null, {file: "content_link.js"});
        }
    }
    else{
        chrome.tabs.executeScript(null, {file: "content_link.js"});
    }

});

//chrome.tabs.onActivated.addListener(function(activeInfo){
        //chrome.tabs.query({active: true,lastFocusedWindow: true}, function(tab){
            //var active_url = tab[0].url;
        //});
    //});

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