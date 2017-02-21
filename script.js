//Main Object with juicy variable 
var main = {
    //Stuff here :^)
    money: 1000000,
    moneyIncrement: 5
};
var mine = {
    copperMinePrice: 500,
    copperMineAmount: 0, 
    copperMineProduction: 5,
    copperOreAmount: 0,
    maxCopperOre: 1000,
    copperPerMine: 0, 
    copperStoragePrice: 10000, 
};
var refinary = {
    idleslots: 100, 
    activeslots: 0,
    slotPrice: 10000,
    
}
var available = refinary.idleslots;
var max = 0; 
var old = 0; 
//Event Listners when window has loaded.
window.addEventListener("load", function () {
    document.getElementById("moneyButton").addEventListener("mousemove", function () {
        //Mouse is moving over money button
        main.money += main.moneyIncrement;
        main.money = Math.floor(main.money);
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
    
    document.getElementById("upgradeCopperStorage").addEventListener("click", function (e) {
        console.log("copperstore");
        if(e.altKey) {
            for(i=0; i < 10; i++) {
                Buy("CopperStorage");
            }
            
        }
        Buy("CopperStorage");
        
    });
    document.getElementById("refSlotButton").addEventListener("click", function(e){
          if(e.altKey) {
            for(i=0; i < 10; i++) {
                Buy("RefinarySlot");
            }
            
        }
        Buy("RefinarySlot");
        
        
    });
    //Set up sliders 
     var sliders = document.getElementsByTagName("input");
            var numSliders = sliders.length;
                for (i = 0; i < numSliders; i++) {
               
                
                //Define all sliders?
                sliders.item(i).max = available;
                document.getElementById(sliders.item(i).id + "val").innerHTML = sliders.item(i).value;
                document.getElementById(sliders.item(i).id + "max").innerHTML = sliders.item(i).max;
                
                sliders.item(i).addEventListener("input", function(){
                    
                    Slider(this); 
                    updateSliders(); 
                })
                

            }

    
    
    Update(); 
});
setInterval(function() {
    doMine(); 
    Update();
   
    
}, 1000);
//Functions 
      function updateSliders() {
            var sliders = document.getElementsByTagName("input");
            var numSliders = sliders.length;
            for (i = 0; i < numSliders; i++)
                {
                    document.getElementById(sliders.item(i).id + "val").innerHTML = sliders.item(i).value;
                    document.getElementById(sliders.item(i).id + "max").innerHTML = sliders.item(i).max;
                    
                    
                   
                }
            
        };
        function Slider(active) {
            //Get weird set thingy of all sliders
            var sliderObject = document.getElementsByTagName("input");
            var numberSliders = sliderObject.length; 
            var total = 0; 
            //Work out what is being displayed
            for(i=0;i<numberSliders;i++)
                {
                    var value = sliderObject.item(i).value;
                    total += parseInt(value); 
                    
                }
            for(i=0;i<numberSliders;i++)
                {
                    var value = sliderObject.item(i).value;
                    max = available - value;
                    if(sliderObject.item(i) != active)
                        {
                            console.log("total = " + total);
                            console.log("old = " + old);
                            var difference = total - old; 
                            console.log("Difference = " + difference);
                            sliderObject.item(i).max = sliderObject.item(i).max - (total - old);
                            
                            
                            
                        }
                    
                    
                }
            old = total;
           
        }
function doMine() {
    if((mine.copperOreAmount + mine.copperPerMine) >= mine.maxCopperOre) {
        mine.copperOreAmount = mine.maxCopperOre; 
        
    } else {
        mine.copperOreAmount += mine.copperPerMine;
    }
    console.log("Mining, ore: " + mine.copperOreAmount);
    document.getElementById("copperStorageProgress").value = mine.copperOreAmount;
    document.getElementById("copperStorageProgress").max = mine.maxCopperOre;
    
}

function Buy(item) {
    if (item == "CopperMine") {
        console.log("going to buy");
        //Going to buy a copper mine
        if (main.money >= mine.copperMinePrice) {
            //Can afford mine
            main.money -= mine.copperMinePrice;
            mine.copperMineAmount++;
            mine.copperMinePrice += 550;
            mine.copperPerMine = mine.copperMineAmount * mine.copperMineProduction;
            Update();
            
        }
    }
    if(item == "CopperStorage") {
        console.log("doing buy storage");
        if(main.money >= mine.copperStoragePrice) {
            main.money -= mine.copperStoragePrice;
            mine.maxCopperOre = 2 * mine.maxCopperOre;
            mine.copperStoragePrice = 3 * mine.copperStoragePrice;
            Update(); 
        }
    }
    if(item == "RefinarySlot") {
        console.log("doing buy ref");
        if(main.money >= refinary.slotPrice) {
            //Buy slot
            main.money -= refinary.slotPrice;
            refinary.idleslots++;
            refinary.slotPrice += 2;
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
        return (input / 1000000).toFixed(2) + " M";
    }
    if (input >= 1000) {
        return (input / 1000).toFixed(2) + " K";
    }
};

//Updates the screen.
function Update() {
    document.getElementById("currentMoney").innerHTML = "£" + Format(main.money);
    document.getElementById("copperMinePrice").innerHTML = "£" + Format(mine.copperMinePrice);
    document.getElementById("copperMineAmount").innerHTML = Format(mine.copperMineAmount);
    document.getElementById("copperMineProduction").innerHTML = Format(mine.copperPerMine);
    document.getElementById("copperOre").innerHTML = Format(mine.copperOreAmount);
    document.getElementById("maxCopperOre").innerHTML = Format(mine.maxCopperOre);
    document.getElementById("copperStorageCost").innerHTML = "£" + Format(mine.copperStoragePrice);
    document.getElementById("refinarySlotPrice").innerHTML = "£" + Format(refinary.slotPrice);
    document.getElementById("refinaryIdleSlots").innerHTML = refinary.idleslots;
  
    
    
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
