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
        collection.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
        // debugger
        for (let i = 0; i < collection.length; i++) {
            let element = document.getElementById("infoField");
            element.innerHTML += `<div class="infoDate">${collection[i].date}</div`;
            const items = collection[i].items;
            for (let j = 0; j < items.length; j++) {
                // console.log(items[j].amount, items[j].currency);
                    element.innerHTML += `
                                            <div class="infoField">${items[j].productName} ${items[j].amount} ${items[j].currency}</div>
                                        `;
            }
        }

    }

    if (newStr[0] === 'clear') {
        clearData(newStr);
        document.getElementById('infoField').innerHTML = JSON.stringify(collection);
    }

    if (newStr[0] === 'total') {
        totalSpent(newStr);
    }

});


let rateString;
let sum = 0;

function getRates(data) {
    $.ajax({
        url: endpoint + '?access_key=' + access_key + '&base=' + base,
        dataType: 'json',
        success: function (json) {
            let rates = json.rates;
            for (let key in rates) {
                if (data[1] === key) {
                    rateString = JSON.stringify(rates[key]);
                    console.log(rateString);
                }
            }
            const finalValue = sum * rateString;
            console.log(finalValue);
            document.getElementById('infoField').innerHTML =+ finalValue.toFixed(2) + " " + data[1];
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

function totalSpent(data) {
    getRates(data);
    sumAmount();
}

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