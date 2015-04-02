// MIT
var OptionT = require('option-t');
var getSelectedRadios = relquire("./utils/radio-util").getSelectedRadios;
function getRadioState() {
    var selected = getSelectedRadios();
    if (selected.length === 0) {
        return new OptionT.None();
    }
    var s = selected[0];
    return new OptionT.Some(s.value);
}


document.getElementById("js-output").addEventListener("click", function () {
    var option = getRadioState();
    if (option.isSome) {
        console.log(option.unwrap())
    } else {
        console.log("選択されてない");
    }
});