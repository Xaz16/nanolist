var changedElements = [];

function search(word, color, remove) {
    var searchArr = [document.body],
        current,
        regWord = new RegExp('(' + word + ')(?![^<]*>|[^<>]*<\\/)', "g"),
        highlighted = '<nanolist-highlight class="nano-list-chrome-extension-detect" style="display:inline-block;background-color:' + color +  '!important;">' + word + '</nanolist-highlight>';
    while (current = searchArr.pop()) {

        if (!current.textContent.match(regWord)) continue;

        for (var i = 0; i < current.childNodes.length; ++i) {

            switch (current.childNodes[i].nodeType ) {
                case Node.TEXT_NODE : // 3
                    if (current.childNodes[i].textContent.match(word) && current.tagName !== 'SCRIPT') {
                        if(remove) {
                            current.parentElement.innerHTML = current.parentElement.innerHTML.replace(highlighted, word);
                        } else {
                            current.innerHTML = current.innerHTML.replace(regWord, highlighted);
                            changedElements.push(current);
                        }
                    }
                    break;
                case Node.ELEMENT_NODE : // 1
                    searchArr.push(current.childNodes[i]);
                    break;
            }

        }

    }

}

chrome.runtime.onMessage.addListener(
    function(request) {
        if(request.remove === void(0)) {
            search(request.text, request.color);
        } else {
            search(request.text, request.color, true);
        }
    });

// chrome.storage.sync.get(null, function (result) {
//     console.log(result);
//     for(data in result) {
//         if(data !== 'lists') {
//             search(result[data].text, result[data].color);
//         }
//     }
// });
//
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//     for (key in changes) {
//         var storageChange = changes[key];
//         console.log(storageChange.newValue, storageChange);
//         if(storageChange.newValue == undefined && storageChange.oldValue) {
//             search(storageChange.oldValue.text, storageChange.oldValue.color, true);
//         } else {
//             search(storageChange.newValue.text, storageChange.newValue.color);
//         }
//     }
// });