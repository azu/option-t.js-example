/**
 * Created by azu on 2015/03/22.
 */
var OptionT = require('option-t');
function getRadioState() {
    var select = document.getElementById("js-select");
    if (select.selectedIndex === -1) {
        return new OptionT.None();
    }
    return new OptionT.Some(select.selectedIndex);
}


document.getElementById("js-output").addEventListener("click", function () {
    var option = getRadioState();
    if(option.isSome) {
        console.log(option.unwrap())
    }else{
        console.log("None");
    }
});