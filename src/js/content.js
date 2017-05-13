function search(word, color) {
    var searchArr = [document.body],
        current;

    while (current = searchArr.pop()) {

        if (!current.textContent.match(word)) continue;

        for (var i = 0; i < current.childNodes.length; ++i) {

            switch (current.childNodes[i].nodeType) {
                case Node.TEXT_NODE : // 3
                    if (current.childNodes[i].textContent.match(word)) {
                        console.log('highlight');
                        var highlighted = '<span class="nano-list-chrome-extension-detect" style="display:inline-block;background-color:' + color +  ';">' + word + '</span>'
                        current.innerHTML = current.innerHTML.replace(word, highlighted);
                    }
                    break;
                case Node.ELEMENT_NODE : // 1
                    searchArr.push(current.childNodes[i]);
                    break;
            }

        }

    }

}

console.log(chrome);

chrome.storage.sync.get(null, function (result) {
    console.log(result);
    for(key in result) {
        var color = result[key];
        for(keys in color) {
            var word = color[keys];

            console.log(word);
            search(word, Object.keys(color));
        }
    }
});