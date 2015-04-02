// LICENSE : MIT
"use strict";
// MIT
var SyncPromise = require('sync-promise');
var getSelectedRadios = require("./utils/radio-util").getSelectedRadios;
function getRadioState() {
    var selected = getSelectedRadios();
    if (selected.length === 0) {
        return new SyncPromise(function (resolve, reject) {
            reject(new Error("選択されてない"));
        });
    }
    var s = selected[0];
    return new SyncPromise(function (resolve) {
        resolve(s);
    });
}


document.getElementById("js-output").addEventListener("click", function () {
    var promise = getRadioState().then(function (value) {
        console.log(value);
    }).catch(function (error) {
        console.error(error);
    });
});