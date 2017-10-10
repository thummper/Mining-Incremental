//Main Object with juicy variable 
var game = {
    //Stuff here :^)
    money: 0,
    moneyIncrement: 50
};

var copper = {
    minePrice: 500,
    mineAmount: 0,
    mineProduction: 5,
    oreAmout: 0,
    oreMax: 1000,
    ingotAmount: 0,
    ingotMax: 1000,
    storagePrice: 10000,
    ingotStoragePrice: 10000,

}
var refinary = {
    slotPrice: 1,
    copperRefinaries: 0,
    ironRefinaries: 0

};
var allSliders = document.getElementsByTagName("input");
var numSliders = allSliders.length;
var sliderInfo = {
    maxTotal: 0,
    activeValue: 0,
    idleValue: 0
};
var sliderVals = [];
var hovered = false;
var bonus = 0;
var bonusInc = 0.0001;



//Event Listners when window has loaded.
window.addEventListener("load", function () {
    //Money Button
    $(".moneyButton").mouseenter(function () {
        hovered = true;


    });
    $(".moneyButton").mouseleave(function () {
        hovered = false;
        bonus = 0;
        bonusInc = 0.001;
        updateBonus();
    });
    $(".moneyButton").mousemove(function () {
        if (hovered && bonus < 5) {
            bonus += bonusInc;
            bonusInc += 0.00001;
        }


        var bonusMoney = (game.moneyIncrement * bonus);
        game.money = Math.floor(game.money + game.moneyIncrement + bonusMoney);
        Update();
        updateBonus();


    });

    //Copper Mine Button
    document.getElementById("copperMine").addEventListener("click", function (e) {
        buy(copper, 0);
    });
    //Copper Storage
    document.getElementById("upgradeCopperStorage").addEventListener("click", function (e) {
        buy(copper, 1);
    });
    //Buy Ref Slot 
    document.getElementById("refSlotButton").addEventListener("click", function (e) {
        buy("refSlot", 0);
    });

    //Set up sliders. 
    for (i = 0; i < numSliders; i++) {
        //Get a slider from the weird object
        var slider = allSliders.item(i);
        console.log("set up slider max: " + sliderInfo.maxTotal);
        slider.max = sliderInfo.maxTotal;
        slider.value = 0;
    }
    updateSliders();
    Update();
});

//Game tick
setInterval(function () {
    doMine();
    doRefine();
    Update();
}, 1000);
//Functions

function updateSliders() {
    for (i = 0; i < numSliders; i++) {
        var slider = allSliders.item(i);
        document.getElementById(slider.id + "value").innerHTML = slider.value;
        document.getElementById(slider.id + "max").innerHTML = slider.max;
    }
}

function sliderUsed() {
    console.log("Slider Used");
    //When a slider is used, the max value should be updated - the max value of a slider is the max allowed - the value of all other sliders.
    for (i = 0; i < numSliders; i++) {
        //Get one of the sliders 
        var settingFor = allSliders.item(i);
        var total = 0;
        for (j = 0; j < numSliders; j++) {
            var currentSlider = allSliders.item(j);
            if (settingFor != currentSlider) {
                total += parseInt(currentSlider.value);
            }
        }
        settingFor.max = sliderInfo.maxTotal - total;
    }

    updateSliders();
    getSliderTotal();
    console.log(sliderVals);
}

function getSliderTotal() {
    sliderInfo.activeValue = 0;
    for (i = 0; i < numSliders; i++) {
        var slider = allSliders.item(i);
        sliderVals[i] = parseInt(slider.value);
        sliderInfo.activeValue += parseInt(slider.value);


    }
    Update();
}



function doRefine() {
    for (i in sliderVals) {
        if (sliderVals[i] > 0) {
            if (i == 0) {
                //Refine Copper Ore
                var RefineAmount = sliderVals[i];
                if(copper.oreAmout >= RefineAmount*2 && copper.ingotAmount <= copper.ingotMax - RefineAmount)
                    {
                        console.log("Refining " + RefineAmount + " copper ingots for " + RefineAmount*2 + " copper ore");
                        copper.oreAmout -= RefineAmount*2; 
                        

                        copper.ingotAmount += sliderVals[i];
                    }
            }
        }
    }

 Update();
}

function refine(ore) {
    //    if (ore == "copper") {
    //        if (mine.copperOreAmount >= sliderVals[0]) {
    //            mine.copperOreAmount -= sliderVals[0];
    //            mine.copperIngotAmount += sliderVals[0];
    //
    //        }
    //    }
    //    console.log("ingots : " + mine.copperIngotAmount);
}



function doMine() {
    var copperOPS = (copper.mineAmount * copper.mineProduction);
    if (copper.oreAmout + copperOPS >= copper.oreMax) {
        copper.oreAmout = copper.oreMax;
    } else {

        copper.oreAmout += copperOPS;


    }
    Update();

}




function buy(item, storage) {
    if (item == "refSlot") {
        //Buy refSlot
        if (game.money >= refinary.slotPrice) {
            game.money -= refinary.slotPrice;
            sliderInfo.maxTotal++;
            sliderUsed();
            updateSliders();
            Update();
        }

    } else if (storage) {
        //Upgrade Storage 
        if (game.money >= item.storagePrice) {
            game.money -= item.storagePrice;
            item.storagePrice += 1000;
            item.oreMax = Math.floor(item.oreMax * 1.25);
        }

    } else {
        //Buy Mine
        if (game.money >= item.minePrice) {
            //Can buy mine 
            game.money -= item.minePrice;
            item.mineAmount++;
            //TODO BETTER PRICE INC 
            item.minePrice += 500;

        }

    }
    Update();
}

function buyMine(item) {

    Update();
};

function buyStorage(type) {
    if (type == "refSlot") {
        //Buy Ref Slot


    } else {
        //Upgrade storage

    }
    Update();
}





//Formats whatever is input
function Format(input) {
    if (input < 1000) {
        return (input);
    }
    if (input >= 1000000) {
        return (input / 1000000).toFixed(2) + " M";
    }
    if (input >= 1000) {
        return (input / 1000).toFixed(2) + " K";
    }
};
//Updates the screen.

function Update() {
    document.getElementById("currentMoney").innerHTML = "£" + Format(game.money);
    document.getElementById("copperMinePrice").innerHTML = "£" + Format(copper.minePrice);
    document.getElementById("copperMineAmount").innerHTML = Format(copper.mineAmount);
    document.getElementById("copperMineProduction").innerHTML = Format(copper.mineAmount * copper.mineProduction);
    var cOreSection = document.getElementsByClassName("copperOre");
    for (i in cOreSection) {
        cOreSection[i].innerHTML = Format(copper.oreAmout);
    }
    var cOreMax = document.getElementsByClassName("copperOreMax");
    for(i in cOreMax) {
        cOreMax[i].innerHTML = Format(copper.oreMax);
        
    }
    var copperProgress = document.getElementsByClassName("copperProgress");
    for(i in copperProgress) {
        copperProgress[i].value = copper.oreAmout;
        copperProgress[i].max = copper.oreMax;
    }
    var copperIngots = document.getElementsByClassName("copperIngotsAmount");
    for(i in copperIngots) {
        copperIngots[i].innerHTML = copper.ingotAmount;
    }
    var copperIngotsMax = document.getElementsByClassName("copperIngotsMax");
    for(i in copperIngotsMax) {
        copperIngotsMax[i].innerHTML = Format(copper.ingotMax);
    }
    var copperIngotSlider = document.getElementsByClassName("copperIngotStorage");
    for(i in copperIngotSlider) {
        copperIngotSlider[i].max = copper.ingotMax;
        copperIngotSlider[i].value = copper.ingotAmount;
    }
    

    document.getElementById("maxCopperOre").innerHTML = Format(copper.oreMax);
    document.getElementById("copperStorageCost").innerHTML = "£" + Format(copper.storagePrice);
    document.getElementById("refinarySlotPrice").innerHTML = "£" + Format(refinary.slotPrice);
    document.getElementById("refinaryActiveSlots").innerHTML = sliderInfo.activeValue;
    document.getElementById("refinaryTotalSlots").innerHTML = sliderInfo.maxTotal;





};

function updateBonus() {
    document.getElementById("bonusBarz").value = bonus;
}






//Handles tabbed panes 
function Tabs(a) {
    var numberElements = document.getElementsByClassName('nav')[0].childElementCount;
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
