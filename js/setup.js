const tablesConfig = {
    "01": { "prop": 1, "maxFactor": 10 },
    "02": { "prop": 3, "maxFactor": 10 },
    "03": { "prop": 3, "maxFactor": 10 },
    "04": { "prop": 3, "maxFactor": 10 },
    "05": { "prop": 3, "maxFactor": 10 },
    "06": { "prop": 5, "maxFactor": 10 },
    "07": { "prop": 5, "maxFactor": 10 },
    "08": { "prop": 3, "maxFactor": 10 },
    "09": { "prop": 5, "maxFactor": 10 },
    "10": { "prop": 1, "maxFactor": 10 },
    "11": { "prop": 5, "maxFactor": 11 },
    "12": { "prop": 5, "maxFactor": 12 },
    "13": { "prop": 3, "maxFactor": 13 },
    "14": { "prop": 2, "maxFactor": 14 },
    "15": { "prop": 5, "maxFactor": 15 },
    "25": { "prop": 2, "maxFactor": 10 },
};

const factorConfig = [ 0, 1, 2, 2, 2, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1 ];

const askAllConfig = {
    "factor": 2,
    "table": 1,
    "result": 4,
};

const askResultOnlyConfig = {
    "factor": 0,
    "table": 0,
    "result": 1,
};

const defaultNumItems = 24;
const defaultSelectedTables = [ "02", "05", "10" ];

var whatToAskTable = [];



var config = JSON.parse(localStorage.getItem("config"));
if (config == null) {
    config = {
        "numItems": defaultNumItems,
        "selectedTables": defaultSelectedTables,
        "resultOnly": true,
        "inSaetze": false,
        "order": "asc",
    }
    storeConfig();
}

function storeConfig() {
    console.log("Store config: " + JSON.stringify(config));
    localStorage.setItem("config", JSON.stringify(config));
}

function updateConfigPage() {
    document.getElementById("numItems").value = config.numItems;
    document.getElementById("chkTask").checked = config.resultOnly;
    document.getElementById("chkInSaetze").checked = config.inSaetze;
    document.getElementById("sort_" + config.order).checked = true;

    for (let k in tablesConfig) {
        var i = parseInt(k);
        document.getElementById("tab" + i).checked = config.selectedTables.includes(k);
    }

    document.getElementById("selBasic").checked = isAllSmallTables();
    document.getElementById("selToT").checked = isAllLargeTables();
}

function setSort(value) {
    console.log("Set Sort: " + value);
    config.order = value;
    storeConfig();
}

function setNumItemsConfig(value) {
    console.log("Set Num Items: " + value);
    config.numItems = value;
    storeConfig();
}

function setTabConfig(tab, checked) {
    console.log("Set Tab " + tab + " Config: " + checked);
    var i = parseInt(tab);
    if (checked) {
        addToSelTabs(i);
    } else {
        remFromSelTabs(i);
    }
    document.getElementById("selBasic").checked = isAllSmallTables();
    document.getElementById("selToT").checked = isAllLargeTables();
    storeConfig();

}

function setSmallTabs(checked) {
    console.log("Set Small Tabs: " + checked);
    for (var i = 1; i <= 10; ++i) {
        if (checked) {
            addToSelTabs(i);
        } else {
            remFromSelTabs(i);
        }
    }
    updateConfigPage();
    storeConfig();
}

function setLargeTabs(checked) {
    console.log("Set Large Tabs: " + checked);
    for (let k in tablesConfig) {
        var i = parseInt(k);
        if (i <= 10) {
            continue
        }
        if (checked) {
            addToSelTabs(i);
        } else {
            remFromSelTabs(i);
        }
    }
    updateConfigPage();
    storeConfig();
}

function setResultOnly(checked) {
    console.log("Set Result Only: " + checked);
    config.resultOnly = checked;
    buildWhatToAskTable();
    updateConfigPage();
    storeConfig();
}

function setInSaetze(checked) {
    console.log("Set In Saetze: " + checked);
    config.inSaetze = checked;
    buildWhatToAskTable();
    updateConfigPage();
    storeConfig();
}

function addToSelTabs(value) {
    var k = value < 10 ? "0" + value : "" + value;
    if (!config.selectedTables.includes(k)) {
        config.selectedTables.push(k)
        config.selectedTables.sort()
    }
}

function remFromSelTabs(value) {
    var k = value < 10 ? "0" + value : "" + value;
    if (config.selectedTables.includes(k)) {
        config.selectedTables.splice(config.selectedTables.indexOf(k), 1);
    }
}

function isAllSmallTables() {
    for (var i=1; i<=10; ++i) {
        var k = i < 10 ? "0" + i : "" + i;
        if (!config.selectedTables.includes(k)) {
            return false;
        }
    }
    return true;
}

function isAllLargeTables() {
    for (let k in tablesConfig) {
        var i = parseInt(k);
        if (i <= 10) {
            continue
        }
        if (!config.selectedTables.includes(k)) {
            return false;
        }
    }
    return true;
}

function buildWhatToAskTable() {
    whatToAskTable = [];

    for (const [key, numEntries] of Object.entries(config.resultOnly ? askResultOnlyConfig : askAllConfig)) {
        for (var i = 0; i < numEntries; ++i) {
            whatToAskTable.push(config.inSaetze && key == "result" ? "inSaetze" : key);
        }
    }
}
