var originalSetItem = localStorage.setItem;

localStorage.setItem = function () {
    originalSetItem.apply(this, arguments);
    build();
}

var timerHandle = null;
var startTime = null;
var errors = 0;
var lastTable = 0;
var lastFactor = 0;


function rand(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function buildTables() {
    var groups = [];
    for (const [idx,table] of Object.entries(config.selectedTables)) {
        for (var i = 0; i < tablesConfig[table].prop; ++i) {
            groups.push(parseInt(table));
        }
    }
    return groups;
}

function buildFactors(table) {
    var groups = [];

    if (table == undefined) {
        return groups;
    }
    if (typeof(table) == "number") {
        table = (table < 10 ? "0" : "") + table;
    }
    if (tablesConfig[table] == undefined) {
        return groups;
    }
    for (var f = 1; f <= tablesConfig[table].maxFactor; ++f) {
        for (var i = 0; i < factorConfig[f]; ++i) {
            groups.push(f);
        }
    }
    return groups;
}

function whatToAsk() {
    return whatToAskTable[rand(0, whatToAskTable.length - 1)];
}

function whichTable(tables) {
    return tables[rand(0, tables.length - 1)];
}

function whichFactor(table) {
    const factors = buildFactors(table);
    return factors[rand(0, factors.length - 1)];
}


function buildEntry(a, b, whatToAsk, content, result) {
    const r = a * b;

    const divContent = document.createElement('div');
    const divResult = document.createElement('div');
    const spanTimes = document.createElement('span');
    const spanEquals = document.createElement('span');
    const inA = document.createElement('input');
    const inB = document.createElement('input');
    const inR = document.createElement('input');
    const resA = document.createElement('input');
    const resB = document.createElement('input');
    const resR = document.createElement('input');

    spanTimes.innerHTML = '&times;';
    spanEquals.innerHTML = '&equals;';
    resA.value = a;
    resB.value = b;
    resR.value = r;
    inA.type = 'number';
    inB.type = 'number';
    inR.type = 'number';
    resA.type = 'number';
    resA.disabled = true
    resB.type = 'number';
    resB.disabled = true
    resR.type = 'number';
    resR.disabled = true

    switch(whatToAsk) {
        case "factor":
            resA.classList.add("query");
            inB.disabled = true;
            inR.disabled = true;
            inA.setAttribute("expected-value", a);
            inB.value = b;
            inR.value = r;
            break;
        case "table":
            resB.classList.add("query");
            inA.disabled = true;
            inR.disabled = true;
            inA.value = a;
            inB.setAttribute("expected-value", b);
            inR.value = r;
            break;
        default:
            resR.classList.add("query");
            inA.disabled = true;
            inB.disabled = true;
            inA.value = a;
            inB.value = b;
            inR.setAttribute("expected-value", r);
            break;
    }

    divContent.appendChild(inA);
    divContent.appendChild(spanTimes.cloneNode(true));
    divContent.appendChild(inB);
    divContent.appendChild(spanEquals.cloneNode(true));
    divContent.appendChild(inR);

    divResult.appendChild(resA);
    divResult.appendChild(spanTimes);
    divResult.appendChild(resB);
    divResult.appendChild(spanEquals);
    divResult.appendChild(resR);

    content.appendChild(divContent);
    result.appendChild(divResult);
}


function focusNext(elem) {
    const tabbables = document.querySelectorAll('[expected-value]');
    var next = false;
    for (var i=0; i<tabbables.length; i++) {
        if (tabbables[i] == elem) {
            next = true;
            continue;
        }
        if (next) {
            next=false;
            tabbables[i].focus();
            break;
        }
    }
    if (next) {
        tabbables[0].focus();
    }
}

function build() {
    var tables = buildTables();

    document.getElementById("timer").innerHTML = '00:00';
    if (timerHandle != null) {
        clearInterval(timerHandle);
        startTime = null;
    }
    const content = document.getElementById("content");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    const result = document.getElementById("result");
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }

    if (tables.length == 0) {
        return
    }

    switch (config.order) {
        case "rnd":
            for (var curItem=0; curItem<config.numItems; ++curItem) {
                var table = 0;
                var factor = 0;
                do {
                    table = whichTable(tables);
                    factor = whichFactor(table);
                } while (table == lastTable && factor == lastFactor); // Nicht zweimal die selbe Rechnung
                lastFactor = factor;
                lastTable = table;
                buildEntry(factor, table, whatToAsk(), content, result);
            }
            break;
        default:
            var curItem=1;
            for (const [idx,table] of Object.entries(config.selectedTables)) {
                for (var f = 0; f < tablesConfig[table].maxFactor; ++f) {
                    const factor = config.order == "desc" ? tablesConfig[table].maxFactor - f : f + 1;
                    buildEntry(factor, parseInt(table), whatToAsk(), content, result);
                    if (++curItem > config.numItems) {
                        break
                    }
                }
                if (curItem > config.numItems) {
                    break
                }
        }
    }

    const nodes = document.querySelectorAll('[expected-value]');
    Array.from(nodes).map(node => {
        node.onchange = function (event) {
            if (this.value == this.getAttribute('expected-value')) {
                this.parentElement.classList.remove("incorrect");
                this.parentElement.classList.add("correct");
                if (nodes.length == document.querySelectorAll('.correct').length) {
                    clearInterval(timerHandle);
                    var time = document.getElementById("timer").innerHTML;
                    document.getElementById("timer").innerHTML = 'Fertig! (' + errors + ' Fehler) ' + time;
                } else focusNext(this);
            } else {
                this.parentElement.classList.remove("correct");
                this.parentElement.classList.add("incorrect");
                this.value = "";
                ++errors;
            }
        };

        node.addEventListener('keydown', function(event){
            if (event.keyCode == 9 && this.value != this.getAttribute('expected-value')) {
                if (this.value != "") {
                    this.parentElement.classList.remove("correct");
                    this.parentElement.classList.add("incorrect");
                    ++errors;
                    this.value = "";
                }
                event.preventDefault();
            }
        });

        node.addEventListener("focusin", function (event) {
            if (startTime == null) {
                startTime = new Date().getTime();
                document.getElementById("timer").innerHTML = '00:00';
                errors = 0;
                timerHandle = setInterval(function () {
                    const time = new Date().getTime() - startTime;
                    const minutes = Math.floor((time / (1000 * 60)));
                    const seconds = Math.floor((time % (1000 * 60)) / 1000);
                    document.getElementById("timer").innerHTML = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                }, 200);
            }
        });
    });
}



window.onload = function () {
    buildWhatToAskTable();
    updateConfigPage();
    build();
};
