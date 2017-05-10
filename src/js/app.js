function Item(color) {
    var contentForStorage = {
        red: {

        },
        green: {

        }
    };

    function append($container, id, val) {
        var block = document.createElement('p');
        block.dataset.id = id;
        block.className = 'item mui--text-body1';
        block.innerHTML = val;

        var removeBtn = document.createElement('span');
        removeBtn.innerText = 'delete';
        removeBtn.className = 'remove-btn mui-btn mui-btn--raised mui-btn--danger';


        removeBtn.onclick = function () {
            chrome.storage.sync.remove(block.dataset.id, function () {

            });
            this.parentElement.remove();
        };

        block.appendChild(removeBtn);

        $container.appendChild(block);
    }

    this.add = function(color) {

        var $container = document.querySelector("#" + color + '-list .item-container'),
            val = document.getElementById('form__input--' + color).value,
            id = $container.children.length;

        if(!val) {
            return;
        }

        append($container, id, val);

        document.getElementById('form__input--' + color).value = '';
    };

    this.getAllItems = function () {
        chrome.storage.sync.get(null, function (integer) {
            for(keys in integer) {

                var color = integer[keys];
                var $container = document.querySelector("#" + color + '-list .item-container');
                console.log(color);

                for(key in color) {

                    append($container, key, color[key]);
                }
            }
        });
    }

}

var item = new Item();

document.addEventListener("DOMContentLoaded", function() {
    item.getAllItems();

    console.log(chrome.storage.sync.get(null, function (integer) {
        console.log(integer);
    }));

    document.getElementById('green-form__submit').onclick = function () {
        item.add('green');
    };

    document.getElementById('red-form__submit').onclick = function () {
        item.add('red');
    };
});
