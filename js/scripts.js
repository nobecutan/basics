var askResultProbability = 2;
var startTime = null;
var timerHandle = null;

var factorProbability = {
    3: 2,
    7: 2,
    11: 3,
    12: 3,
    13: 3,
    14: 3,
    15: 3,
}

const defaultNumItems = 24;
const defaultSelectedFactors = {
    1: false,
    2: true,
    3: false,
    4: false,
    5: true,
    6: false,
    7: false,
    8: false,
    9: false,
    10: true,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
    25: false,
};

var numItems = localStorage.getItem("numItems");
if (numItems == null) {
    numItems = defaultNumItems;
    localStorage.setItem("numItems", numItems);
}

var selectedFactors = JSON.parse(localStorage.getItem("selectedFactors"));
if (selectedFactors == null) {
    selectedFactors = defaultSelectedFactors;
    localStorage.setItem("selectedFactors", JSON.stringify(selectedFactors));
}
console.log(selectedFactors[2]);

function isAllBasics() {
    return selectedFactors[1] && selectedFactors[2] && selectedFactors[3] && selectedFactors[4] && selectedFactors[5] && selectedFactors[6] && selectedFactors[7] && selectedFactors[8] && selectedFactors[9] && selectedFactors[10];
}

function isAllToT() {
    return selectedFactors[11] && selectedFactors[12] && selectedFactors[13] && selectedFactors[14] && selectedFactors[15] && selectedFactors[25];
}

function selectBasics(enabled) {
    selectedFactors[1] =
    selectedFactors[2] =
    selectedFactors[3] =
    selectedFactors[4] =
    selectedFactors[5] =
    selectedFactors[6] =
    selectedFactors[7] =
    selectedFactors[8] =
    selectedFactors[9] =
    selectedFactors[10] = enabled;
    setConfig();
}

function selectToT(enabled) {
    selectedFactors[11] =
    selectedFactors[12] =
    selectedFactors[13] =
    selectedFactors[14] =
    selectedFactors[15] =
    selectedFactors[25] = enabled;
    setConfig();
}

function setConfig(item = -1, value = false) {
    console.log("item: " + item + " value: " + value);
    if (item == 0) {
        numItems = value;
    } else if (item > 0) {
        selectedFactors[item] = value;
    }

    localStorage.setItem("numItems", numItems);
    localStorage.setItem("selectedFactors", JSON.stringify(selectedFactors));

    if (document.getElementById("fac1").checked != selectedFactors[1]) document.getElementById("fac1").checked = selectedFactors[1];
    if (document.getElementById("fac2").checked != selectedFactors[2]) document.getElementById("fac2").checked = selectedFactors[2];
    if (document.getElementById("fac3").checked != selectedFactors[3]) document.getElementById("fac3").checked = selectedFactors[3];
    if (document.getElementById("fac4").checked != selectedFactors[4]) document.getElementById("fac4").checked = selectedFactors[4];
    if (document.getElementById("fac5").checked != selectedFactors[5]) document.getElementById("fac5").checked = selectedFactors[5];
    if (document.getElementById("fac6").checked != selectedFactors[6]) document.getElementById("fac6").checked = selectedFactors[6];
    if (document.getElementById("fac7").checked != selectedFactors[7]) document.getElementById("fac7").checked = selectedFactors[7];
    if (document.getElementById("fac8").checked != selectedFactors[8]) document.getElementById("fac8").checked = selectedFactors[8];
    if (document.getElementById("fac9").checked != selectedFactors[9]) document.getElementById("fac9").checked = selectedFactors[9];
    if (document.getElementById("fac10").checked != selectedFactors[10]) document.getElementById("fac10").checked = selectedFactors[10];
    if (document.getElementById("fac11").checked != selectedFactors[11]) document.getElementById("fac11").checked = selectedFactors[11];
    if (document.getElementById("fac12").checked != selectedFactors[12]) document.getElementById("fac12").checked = selectedFactors[12];
    if (document.getElementById("fac13").checked != selectedFactors[13]) document.getElementById("fac13").checked = selectedFactors[13];
    if (document.getElementById("fac14").checked != selectedFactors[14]) document.getElementById("fac14").checked = selectedFactors[14];
    if (document.getElementById("fac15").checked != selectedFactors[15]) document.getElementById("fac15").checked = selectedFactors[15];
    if (document.getElementById("fac25").checked != selectedFactors[25]) document.getElementById("fac25").checked = selectedFactors[25];

    if (document.getElementById("selBasic").checked != isAllBasics()) document.getElementById("selBasic").checked = isAllBasics();
    if (document.getElementById("selToT").checked != isAllToT()) document.getElementById("selToT").checked = isAllToT();

    if (document.getElementById("numItems").value != numItems) document.getElementById("numItems").value = numItems;

    build();
}

function rand(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function buildFactors() {
    var groups = [];
    for (const [key, value] of Object.entries(selectedFactors)) {
        if (!value) continue;
        const n = isNaN(factorProbability[key]) ? 1 : factorProbability[key];
        for (i = 0; i < n; ++i) {
            groups.push(key);
        }
    }
    return groups;
}

function buildEntry(a, b, askResult, content, result) {
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

    if (askResult) { // Ask result
        resR.classList.add("query");
        inA.disabled = true;
        inB.disabled = true;
        inA.value = a;
        inB.value = b;
        inR.setAttribute("expected-value", r);
    } else {
        if (Math.random() > 0.5) { // Ask first
            resA.classList.add("query");
            inB.disabled = true;
            inR.disabled = true;
            inA.setAttribute("expected-value", a);
            inB.value = b;
            inR.value = r;
        } else {
            resB.classList.add("query");
            inA.disabled = true;
            inR.disabled = true;
            inA.value = a;
            inB.setAttribute("expected-value", b);
            inR.value = r;
        }
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
    for(var i=0; i<tabbables.length; i++) {
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
    var groups = buildFactors();

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

    if (groups.length == 0) {
        return
    }

    for (i=0; i<numItems; ++i) {
        const groupSel = rand(0, groups.length - 1);
        var group = groups[groupSel];
        var a = 0;
        var b = 0;
        if (Math.random() > 0.5) {
            a = rand(1,Math.max(10, group));
            b = group;
        } else {
            a = group;
            b = rand(1,Math.max(10, group));
        }

        const askResult = rand(1, askResultProbability) > 1;
        buildEntry(a, b, askResult, content, result);
    }

    const nodes = document.querySelectorAll('[expected-value]');
    Array.from(nodes).map(node => {
        node.onchange = function (event) {
            if (this.value == this.getAttribute('expected-value')) {
                this.parentElement.classList.remove("incorrect");
                this.parentElement.classList.add("correct");
                if (nodes.length == document.querySelectorAll('.correct').length) {
                    clearInterval(timerHandle);
                } else focusNext(this);
            } else {
                this.parentElement.classList.remove("correct");
                this.parentElement.classList.add("incorrect");
                this.value = "";
            }
        };

        node.addEventListener("focusin", function (event) {
            if (startTime == null) {
                startTime = new Date().getTime();
                document.getElementById("timer").innerHTML = '00:00';
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

setConfig();
