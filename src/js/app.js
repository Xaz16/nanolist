function Item() {

    function prepend($container, id, val) {
        var block = document.createElement('p');
        block.dataset.id = id;
        block.className = 'item mui--text-body1';
        block.innerText = val;

        var removeBtn = document.createElement('span');
        removeBtn.innerHTML = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        removeBtn.className = 'remove-btn';


        removeBtn.onclick = function () {
            chrome.storage.sync.remove(block.dataset.id, function () {});
            this.parentElement.remove();
        };

        block.appendChild(removeBtn);

        if($container == null) {
            $container.appendChild(block);
        } else {
            $container.insertBefore(block, $container.firstChild);
        }
    }

    this.add = function(elm, isInput) {

        var itemsCount = document.querySelectorAll('.item');
        (itemsCount == null) ? itemsCount = 0 : itemsCount = itemsCount.length;

        var listId;

        if(isInput) {
            listId = elm.parentElement.parentElement.parentElement.dataset.id;
        } else {
            listId = elm.parentElement.parentElement.dataset.id
        }

        var $container = document.querySelector('.list[data-id="'+ listId + '"] .item-container'),
            val = document.querySelector('.list[data-id="' + listId + '"] input').value,
            color = document.querySelector('.list[data-id="'+ listId + '"]').dataset.color,
            id = itemsCount + 1,
            data = {};

        if(!val) {
            return;
        }

        data[id] = {};
        data[id].color = color;
        data[id].text = val;
        data[id].listId = listId;

        chrome.storage.sync.set(data, function () {});

        prepend($container, id, val);

        document.querySelector('.list[data-id="'+ listId + '"] input').value = '';
    };

    this.getAllItems = function () {
        chrome.storage.sync.get(null, function (result) {
            for(data in result) {
                if(data !== 'lists') {
                    var listId = result[data].listId,
                        $container = document.querySelector('.list[data-id="' + listId + '"] .item-container');

                    prepend($container, data, result[data].text);
                }
            }
        });
    }

}

function List() {

    this.init = function() {
        var listsArr = [],
            $lists = document.querySelectorAll('.list');
        console.log($lists);
        var data = {};
        for(var i = 0; i < $lists.length; i++) {
            listsArr.push($lists[i]);
            var id = $lists[i].dataset.id = i;
            data[i] = $lists[i].dataset.color;
            getColor($lists[i], id);
        }
        chrome.storage.sync.set({'lists': data}, function () {});
        return listsArr;
    };

    this.setColor = function(list, color) {
        list.dataset.color = color;

        chrome.storage.sync.set({})
    };

    function getColor(list, id) {
        chrome.storage.sync.get('lists', function (result) {
            list.dataset.color = result.lists[id];
        });
    }

}

function initOptions() {
    chrome.storage.sync.get('lists', function (result) {
        for (id in result.lists) {
            console.log(result, id, result[id]);
            document.querySelector('.options__color-input[data-id="' + id + '"]').value = result.lists[id];
        }
    });

}

function validTextColour(stringToTest) {

    if (stringToTest === "") { return false; }
    if (stringToTest === "inherit") { return false; }
    if (stringToTest === "transparent") { return false; }

    var image = document.createElement("img");
    image.style.color = "rgb(0, 0, 0)";
    image.style.color = stringToTest;
    if (image.style.color !== "rgb(0, 0, 0)") { return true; }
    image.style.color = "rgb(255, 255, 255)";
    image.style.color = stringToTest;
    return image.style.color !== "rgb(255, 255, 255)";
}

// document.getElementById("testField").addEventListener("input", function() {
//     document.getElementById("result").textContent = validTextColour(this.value);
// });

var item = new Item(),
    list = new List(),
    $options = document.getElementsByClassName('options');

document.addEventListener("DOMContentLoaded", function() {
    if($options.length ) {
        initOptions();
    } else {

        var $inputs = document.getElementsByClassName('form__input');

        list.init();
        item.getAllItems();


        document.getElementById('green-form__submit').onclick = function () {
            item.add(this);
        };

        document.getElementById('red-form__submit').onclick = function () {
            item.add(this);
        };

        for (key in $inputs) {
            $inputs[key].onkeydown = function (event) {
                if (event.which === 13) {
                    item.add(this, true);
                }
            }
        }

    }

});


chrome.storage.onChanged.addListener(function(changes, namespace) {

});