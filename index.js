let input = document.getElementById('commandField');
let storage = JSON.parse(localStorage.getItem("storage"));
const collection = storage ? storage : [];

const access_key = '05296a8368a96ad97a06162848c34962';
const endpoint = 'http://data.fixer.io/api/latest';
const base = "EUR";

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    let inputStr = input.value;
    let newStr = inputStr.split(' ');


    if (newStr[0] === 'add') {
        addRecord(newStr);
    }

    if (newStr[0] === 'list') {
        let items = localStorage.getItem("storage");
        console.log(items);
    }

    if (newStr[0] === 'clear') {
        clearData(newStr);
        document.getElementById('infoField').innerHTML = JSON.stringify(collection);
    }

    let rateString;
    let sum = 0;

    function getRates() {
        $.ajax({
            url: endpoint + '?access_key=' + access_key + '&base=' + base,
            dataType: 'json',
            success: function (json) {
                let rates = json.rates;
                for (let key in rates) {
                    if (newStr[1] === key) {
                        rateString = JSON.stringify(rates[key]);
                        console.log(rateString);
                    }
                }
                const finalValue = sum * rateString;
                console.log(finalValue);
            }
        });
    }

    function sumAmount() {
        for (let i = 0; i < collection.length; i++) {
            const items = collection[i].items;
            for (let j = 0; j < items.length; j++) {
                sum += +items[j].amount;
            }
        }
    }

    function totalSpent() {
        getRates(newStr);
        sumAmount();
    }

    if (newStr[0] === 'total') {
        totalSpent();
    }

});

function addRecord(data) {
    let newRecord = {
        date: data[1],
        items: [{
            amount: data[2],
            currency: data[3],
            productName: data[4]
        }]
    };

    let isExist = false;
    for (let i = 0; i < collection.length; i++) {
        if (newRecord.date === collection[i].date) {
            collection[i].items.push(newRecord.items[0]);
            isExist = true;
        }
    }
    if (!isExist) {
        collection.push(newRecord);
    }

    let collection_serialized = JSON.stringify(collection);
    localStorage.setItem('storage', collection_serialized);

    document.getElementById('infoField').innerHTML = JSON.stringify(collection);
}

function clearData(data) {
    const date = data[1];
    for (let i = 0; i < collection.length; i++) {
        if (date === collection[i].date) {
            collection.splice(i, 1);
        }
    }
    let collection_serialized = JSON.stringify(collection);
    localStorage.setItem('storage', collection_serialized);
}