// LICENSE : MIT
"use strict";
function getSelectedRadios() {
    var results = [];
    var radios = document.querySelectorAll('#js-radio-fieldset input[name="judge"]');
    for (var i = 0; i < radios.length; i++) {
        var radio = radios[i];
        if (radio.checked) {
            results.push(radio);
        }
    }
    return results;
}
module.exports = {
    getSelectedRadios: getSelectedRadios
};