var port = chrome.runtime.connect(),
$search = document.forms['search'];

window.addEventListener("message", function (event) {

    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        port.postMessage(event.data.text);
    }
}, false);

$search.elements['search_submit'].addEventListener("click", function() {
    console.log('post' + $search.elements['search_input'].val);
    window.postMessage({ type: "FROM_PAGE", text: $search.elements['search_input'].val }, "*");
}, false);

