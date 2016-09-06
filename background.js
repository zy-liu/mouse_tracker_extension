var mouse_tracking_group_limit = 100;
var mouse_tracking_info_list = [];
var current_url = "";
var user = "default_user";
var task_url = "default_task_url";

var page_actions = ['SEARCH_BEGIN', 'SEARCH_END', 'PAGE_START', 'PAGE_END', 'JUMP_IN', 'JUMP_OUT'];
var click_actions = ['CLICK', 'HOVER'];
var mouse_actions = ['MOUSE_MOVE', 'SCROLL'];
var output_actions = click_actions + mouse_actions;


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    current_url = sender.tab.url;
    var info = request.mouse_log;
    info.site = current_url;

    if (info.action == 'PAGE_START') {
        var details = {};
        details.tabId = sender.tab.id;
        chrome.pageCapture.saveAsMHTML(details, function(mhtmlData) {
            var reader = new window.FileReader();
            reader.readAsDataURL(mhtmlData);
            reader.onloadend = function() {
                info.message.mhtml = reader.result;
            }
        });
    }

    send_mouse_info(info);
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

function send_mouse_info(info) {
   
    if (info.action == 'SEARCH_BEGIN') {
        user = info.message.user;
        task_url = info.message.task_url;
    }
    info.user = user;
    info.task_url = task_url;
    
    if (output_actions.indexOf(info.action) >= 0) {
        console.log(JSON.stringify(info))
    }   
    
    if (info.action == 'SEARCH_END') {
        mouse_tracking_info_list.push(info);
        ajax_log_message(mouse_tracking_info_list);
        mouse_tracking_info_list = [];
        task_url = "default_task_url";
        return;
    }

    
    if (task_url != "default_task_url") {
        mouse_tracking_info_list.push(info);
        if (mouse_tracking_info_list.length >= mouse_tracking_group_limit) {
            ajax_log_message(mouse_tracking_info_list);
            mouse_tracking_info_list = [];
        }
    }
    
}


function ajax_log_message(info_list) {
   //alert(encode_str + "\n");
    var log_url = "http://127.0.0.1:8000/log_process/";
    $.ajax({
       type:'POST',
        url:log_url,
        data:{
            mouse_info: info_list
        },
        complete: function (jqXHR, textStatus) {
            //alert(textStatus + "----" + jqXHR.status + "----" + jqXHR.readyState);
        }
    });
}