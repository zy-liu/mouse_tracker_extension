var mouse_tracking_group_limit = 1;
var mouse_tracking_info_list = [];
var current_url = "";
var user = "default_user";
var task_url = "default_task_url";

var page_actions = ['SEARCH_BEGIN', 'SEARCH_END', 'PAGE_START', 'PAGE_END', 'JUMP_IN', 'JUMP_OUT'];
var click_actions = ['CLICK', 'HOVER'];
var mouse_actions = ['MOUSE_MOVE', 'SCROLL'];
var annotation_actions = ['USEFULNESS_ANNOTATION'];
var output_actions = annotation_actions;

/*
Context Menu
 */
function radioOnClick(c_info, tab) {
    var usefulness_score = 1;
    switch (c_info.menuItemId) {
        case l_1: usefulness_score = 1; break;
        case l_2: usefulness_score = 2; break;
        case l_3: usefulness_score = 3; break;
        case l_4: usefulness_score = 4; break;
        default: usefulness_score = 1;
    }
    
    var info = formInfo(
        "USEFULNESS_ANNOTATION",
        {
            checked_item: c_info.menuItemId,
            usefulness_score: usefulness_score,
            previous_checked_item: c_info.wasChecked,
        });
    info.site = tab.url;
    send_mouse_info(info)
}
var parent = chrome.contextMenus.create({"title": "Usefulness Annotation"});
var l_1 = chrome.contextMenus.create({
    "title": "Not useful at all",
    "type": "radio",
    "parentId": parent,
    "onclick": radioOnClick,
});
var l_2 = chrome.contextMenus.create({
    "title": "Somewhat useful",
    "type": "radio",
    "parentId": parent,
    "onclick": radioOnClick,
});
var l_3 = chrome.contextMenus.create({
    "title": "Fairly useful",
    "type": "radio",
    "parentId": parent,
    "onclick": radioOnClick,
});
var l_4 = chrome.contextMenus.create({
    "title": "Very useful",
    "type": "radio",
    "parentId": parent,
    "onclick": radioOnClick,
});
/*
Select Not useful at all for new web page
 */
var ctx_menu_cur_url = "";
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (tab.url != ctx_menu_cur_url) {
        ctx_menu_cur_url = tab.url;
        chrome.contextMenus.update(l_2, {"checked": false});
        chrome.contextMenus.update(l_3, {"checked": false});
        chrome.contextMenus.update(l_4, {"checked": false});
        chrome.contextMenus.update(l_1, {"checked": true});
    }
});

/*
Receive Message from content scripts
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    current_url = sender.tab.url;
    var info = request.mouse_log;
    info.site = current_url;

    /*
    Process different actions
     */
    if (info.action == 'PAGE_START') {
        var details = {};
        details.tabId = sender.tab.id;
        chrome.pageCapture.saveAsMHTML(details, function(mhtmlData) {
            var reader = new window.FileReader();
            reader.onloadend = function() {
                info.message.mhtml = reader.result;
            };
            reader.readAsDataURL(mhtmlData);
        });
    }

    /*
    Add to sending queue
     */
    send_mouse_info(info);
});


/*
Execute click recording when page is updated
 */
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

/*
Add info object to sending queue
 */
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


/*
Send sending queue to server
 */
function ajax_log_message(info_list) {
   //alert(encode_str + "\n");
    var log_url = "http://127.0.0.1:8000/extension_log/log/";
    var log_url = "http://10.129.248.120:8000/extension_log/log/";
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: log_url,
        data: {
            mouse_info: JSON.stringify(info_list)
        },
        complete: function (jqXHR, textStatus) {
            //alert(textStatus + "----" + jqXHR.status + "----" + jqXHR.readyState);
        }
    });
}