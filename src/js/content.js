function search(word) {
    var searchArr = [document.body],
        current;

    while (current = searchArr.pop()) {

        if (!current.textContent.match(word)) continue;

        for (var i = 0; i < current.childNodes.length; ++i) {

            switch (current.childNodes[i].nodeType) {
                case Node.TEXT_NODE : // 3
                    if (current.childNodes[i].textContent.match(word)) {

                    }
                    break;
                case Node.ELEMENT_NODE : // 1
                    searchArr.push(current.childNodes[i]);
                    break;
            }

        }

    }

}