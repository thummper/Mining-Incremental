//Main Object with juicy variable 
var main = {
    //Stuff here :^)
    money: 0,
    moneyIncrement: 15
};
var mine = {
    copperMinePrice: 500,
    copperMineAmount: 0, 
    copperMineProduction: 5
};
//Event Listners when window has loaded.
window.addEventListener("load", function () {
    document.getElementById("moneyButton").addEventListener("mousemove", function () {
        //Mouse is moving over money button
        console.log("mousemove on moneyButton");
        main.money += main.moneyIncrement;
        Update();
    });
    document.getElementById("copperMine").addEventListener("click", function (e) {
        //Copper Mine Button Pressed
        console.log(e.altKey);
        if (e.altKey) {
            for (i = 0; i < 10; i++) {
                Buy("CopperMine");
            }
        }
        Buy("CopperMine");
    });
});
//Functions 
function Buy(item) {
    if (item == "CopperMine") {
        console.log("going to buy");
        //Going to buy a copper mine
        if (main.money >= mine.copperMinePrice) {
            //Can afford mine
            main.money -= mine.copperMinePrice;
            mine.copperMineAmount++;
            mine.copperMinePrice += 550;
            Update();
        }
    }
};
//Formats whatever is input
function Format(input) {
    if (input < 1000) {
        return (input);
    }
    if (input >= 1000000) {
        return (parseFloat((input / 1000000).toFixed(3)) + " M");
    }
    if (input >= 1000) {
        return (parseFloat((input / 1000).toFixed(3)) + "K");
    }
};
//Handles tabbed panes 
function Tabs(a) {
    console.log(a);
    console.log(a.parentNode.children == Array);
    var numberElements = document.getElementsByClassName('nav')[0].childElementCount;
    console.log("There are: " + numberElements + " Child Elements");
    for (i = 1; i <= numberElements; i++) {
        //Make all invis
        document.getElementsByClassName(i)[0].style.display = "none";
    }
    document.getElementsByClassName(a.id)[0].style.display = "block";
    //Also do active classes 
    for (i = 0; i < a.parentNode.children.length; i++) {
        a.parentNode.children.item(i).classList.remove("actv");
    }
    a.classList.add("actv");
};
//Updates the screen.
function Update() {
    document.getElementById("currentMoney").innerHTML = "£" + Format(main.money);
    document.getElementById("copperMinePrice").innerHTML = "£" + Format(mine.copperMinePrice);
    document.getElementById("copperMineAmount").innerHTML = Format(mine.copperMineAmount);
    document.getElementById("copperMineProduction").innerHTML = Format(mine.copperMineAmount * mine.copperMineProduction);
};