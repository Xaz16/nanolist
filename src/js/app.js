function Item(color) {

    function prepend($container, id, val) {
        var block = document.createElement('p');
        block.dataset.id = id;
        block.className = 'item mui--text-body1';
        block.innerHTML = val;

        var removeBtn = document.createElement('span');
        removeBtn.innerText = 'delete';
        removeBtn.className = 'remove-btn mui-btn mui-btn--raised mui-btn--danger';


        removeBtn.onclick = function () {
            chrome.storage.sync.remove(block.dataset.id, function () {
                console.log('removed');
            });
            this.parentElement.remove();
        };

        block.appendChild(removeBtn);

        $container.insertBefore(block, $container.firstChild);
    }

    this.add = function(color) {

        var itemsCount = document.querySelectorAll('.item');
        (itemsCount == null) ? itemsCount = 0 : itemsCount = itemsCount.length;

        var $container = document.querySelector("#" + color + '-list .item-container'),
            val = document.getElementById('form__input--' + color).value,
            id = itemsCount + 1,
            data = {};

        if(!val) {
            return;
        }

        data[id] = {};
        data[id][color] = val;

        chrome.storage.sync.set(data, function () {});

        prepend($container, id, val);

        document.getElementById('form__input--' + color).value = '';
    };

    this.getAllItems = function () {
        chrome.storage.sync.get(null, function (integer) {
            for(keys in integer) {
                for(key in integer[keys]) {
                    var color = key;
                    var $container = document.querySelector("#" + color + '-list .item-container');
                    prepend($container, keys, integer[keys][key]);
                }
            }
        });
    }

}

var item = new Item();

document.addEventListener("DOMContentLoaded", function() {
    var $inputs = document.getElementsByClassName('form__input');

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

    for(key in $inputs) {
        $inputs[key].onkeydown = function (event) {
            var color;
            color = (this.classList.contains('green-form__input')) ? 'green' : 'red';
            if (event.which === 13) {
                item.add(color);
            }
        }
    }

});
