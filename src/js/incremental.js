let randomWords = require('random-words');
import * as Helper from "./Helper.js";
import Vue from 'vue';
import Router from 'vue-router';




// Import templates 
import Navigation from "./Navigation.js";
import Land from "./Land.js";
import Economy from "./Economy.js";


import cInfo from '../vue/info.vue';
import cLand from '../vue/land.vue';
import cProsp from '../vue/prosp.vue';
import cMining from '../vue/mining.vue';
import cSmelting from '../vue/smelting.vue';
import cSales from '../vue/sales.vue';
import cComp from '../vue/competition.vue';
import cResearh from '../vue/research.vue';
import cStats from '../vue/stats.vue';
import cEconomy from '../vue/economy.vue';
import cResDisplay from '../vue/resDisplay.vue';


// Import other stuff. 
import Toasted from 'vue-toasted';


import Prospector from "./Prospector.js";
let options = {
    duration : 1500
};

Vue.use(Toasted, options);
Vue.use(Router);


// Define Vue Components
class Incremental{

    constructor(){
        // Frame information.
        this.lastTime = null;
        this.frameTime = 1; 
        this.smallCounter = 0;
        this.largeCounter = 0;


        // New Counters.
        this.dayCounter     = 0;
        this.weekCounter    = 0;
        this.monthCounter   = 0;
        this.quarterCounter = 0;
        this.yearCounter    = 0;
        
        // Company Info vars
        this.name = randomWords();
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1) + " Inc";
        this.ceo = "";

        // Net Worth Stuff
        this.netWorth  = 0;
        this.landValue = 0;

        // Income Stuff
        this.landAppreciation = 0;
        this.revenue  = 0;

        // Expenses
        this.expenses = 0; //Total
        this.prospectorExpenses = [0, 0, 0]; // Basic, Adv, Sup expenses.

  
        this.netProfit = 0;

        // Land vars 
        this.defaultLand = null;
        this.landSale = [];
        this.landDeveloping = [];
        this.landOwned = [];
        this.images = ["far-hills", "forest-valley", "grass-hills", "hill-river", "mountains", "rocky-valley", "sand-hills", "sand-mountain", "sandy-land", "tall-mountain", "alpine", "cloudy-mountains", "dark-mountains", "grassy-mountains", "green", "ocean", "rolling", "sepia-mountains", "starry-mountains", "treeland"]; 
        this.imgBase = "static/images/"; 
        this.usedImages = [];

        // Economy vars 
        this.money = 100000000000;
        this.mps = 1;

        // Mineral vars 
        this.toProspect = [0, 0, 0, 0];
    
        this.prospected = [0, 0, 0, 0];
        this.mined      = [0, 0, 0, 0];
        this.ingots     = [0, 0, 0, 0];

        // Prospectors
        // [1, 2, 10] - Array value tallys how many we own?
        // Trying to do this in a different way.
        this.totalProspectors    = [0, 0, 0];
        this.basicProspectors    = [];
        this.advancedProspectors = [];
        this.superiorProspectors = [];
        this.prospectorBaseEffort = 100;
        this.cellEffort = 10000;
        this.appliedEffort = 0;


        // Test Ore
        this.orePrices = [25, 50, 100, 200];

        // Graphs
        this.graphs = [];
        // Graph vars 
        this.netWorthTime = [];
        this.economy = new Economy();
        this.init();

        // Others
        this.year = 1990;
        this.timePass = 0;
        this.quarterTime = 5;
        this.quarter = 0;

        // Canvas 
        this.prospCanvas = null;
    }

    init(){
        // Generate everything we need and start the gameloop 
        for(let i = 0, j = this.images.length; i < j; i++){
            let land = this.generateLand(4);
            if(i % 3 == 0){
                // Start with 1 piece of developed land.
                land.owned = 1;
                land.developed = 1;
                this.economy.landUpdate(land);
                land.previousValue = land.value;
                this.landOwned.push(land);
            } else {
                this.landSale.push(land);
            }
        }
           
        this.updateProspecting();
        this.updateNetWorth();
        window.requestAnimationFrame(this.loop.bind(this));
        
    }

    developLand(land){
        let developCost = land.developPrice;
        if(this.money >= developCost){
            this.money -= developCost;
            land.developing = true;
            // Land will develop for land.developTime and then become land.developed. 
            this.landDeveloping.push(land);
        }
    }

    updateDeveloping(timePassed){
        // Runs every quarter. 
        let developing  = this.landDeveloping;
        let stillDeveloping = [];
        for(let i = 0; i < developing.length; i++){
            let land = developing[i];
            land.timePass += timePassed;
            if(land.timePass >= this.quarterTime){
                land.developTime--;
                land.timePass = 0;
                if(land.developTime <= 0){
                    land.developing = false;
                    land.developed  = true;
                    this.updateProspecting();
                } 
            }
            if(land.developing){
                stillDeveloping.push(land);
            }

        }
        this.landDeveloping = stillDeveloping;
    }

    updateProspected(additional){
        let prospectedOres = [0, 0, 0, 0];
        for(let i in this.prospected){
            prospectedOres[i] = this.prospected[i] + additional[i];
        }
        this.prospected = prospectedOres;
    }

    updateProspecting(){
        // For some reason we have to make a new array each time otherwise Vue won't update the page? 
        this.toProspect = [0, 0, 0, 0];
        for(let i in this.landOwned){
            let land = this.landOwned[i];
            if(land.developed){
                let ores = land.ore;
                for(let j in ores){
                    this.toProspect[j] += ores[j];
                }
            }
        }
    }

    generateLand(){
        let land = new Land();
        //Set Price
        this.economy.landPrice(land);
        console.log("LAND PRICE AFTER MADE: ", land.price);

        let randomIndex = Helper.randomFromArray(this.images, 1);
        let randomImage = this.images[randomIndex];
        this.images.splice(randomIndex, 1);
        this.usedImages.push(randomImage);
        land.imagePath   = this.imgBase + randomImage;
        land.image = this.randomImage;
        return land;
    }

    prospect(){
        // Given that we have some developed land in the land queue, we will prospect that land with the prospectors we have availiable.
        // Get the first piece of developed land that has ore availiable 
        /* 
        Island has X cells, ore can be distributed evenly across them, each time we prospect, we prospect a portion of a land cell
        
        Get number of cells
        Distribute ore across them
        Each cell requires X effort to prospect, 
        Get ores proportional to effort made each time 
        
        */

        // Determine Prospector Effort.
        let baseEffort = this.prospectorBaseEffort;
        let allProspectors = this.basicProspectors.concat(this.advancedProspectors, this.superiorProspectors);
        let totalEffort = 0;
        for(let p of allProspectors){
            totalEffort += (p.baseEfficiency + p.boostedEfficiency) * baseEffort;
        }



        let prospectedResources = [0, 0, 0, 0];
        let nextLand = null;


        while(totalEffort > 0){
            // The first piece of developed land that has land cells remaining
            for(let land of this.landOwned){
                if(land.developed && land.island.landCells.length > 0){ 
                    nextLand = land;   
                }
            }


            if(nextLand !== null){
                let landCells = nextLand.island.landCells;
                let firstCell = landCells[0];

                let effortRemain = firstCell.baseEffort - firstCell.currentEffort;
                let lastTick = false;
                let effChange = 0;

                if(totalEffort > effortRemain){
                    // Prospect whatever remains of this cell and reduce total
                    firstCell.currentEffort = firstCell.baseEffort;
                    totalEffort -= effortRemain;
                    effChange = effortRemain;
                    firstCell.site.type = "landdone";

                    if(nextLand.island.landCells.length == 1){
                        // The cell we are currently prospecting is the last cell the island has.
                        lastTick = true;
                    }
                    nextLand.island.landCells.shift();
             
                } else {
                    // Dont have enough effort to completely prospect cell
                    firstCell.currentEffort += totalEffort;
                    effChange = totalEffort;
                    totalEffort = 0;
                }
         
                let percentChange = (effChange / firstCell.baseEffort);
                let orePerCell = nextLand.island.orePerCell;  

                for(let i in orePerCell){
                    let oreGain = orePerCell[i] * percentChange;
                    prospectedResources[i] += oreGain;
                }

                if(lastTick){
                    console.log("This Islands Last Tick");
                    totalEffort = 0;
                    prospectedResources = nextLand.ores;
  
                    lastTick = false;
                }

            }
        }

        if(nextLand){
            nextLand.updateOres(prospectedResources);
        }
        this.updateProspected(prospectedResources);

    }

    appreciateLand(){
        // Update the value of land so consistent with ore prices and economy 
        let allLand = this.landOwned.concat(this.landSale);
        for(let i = 0; i < allLand.length; i++){
            let land = allLand[i];
            this.economy.landUpdate(land);
            if(land.owned){
                let valueIncrease = land.value - land.previousValue;
                this.landAppreciation += valueIncrease;
            }
        }
    }

    

    updateGraphs(){
        let time = Helper.getTime();
        let worthDataPoint = [time, this.netWorth];
        this.economy.updateLandIndex(this.landOwned.concat(this.landSale), time);
        this.economy.updateOreData(time);
        this.economy.updateEconGraphs(time);
     
    }

    addProspectorExpenses(prospectors){
        // This is monthly. 
        let expenses = 0;
        for(let prosp of prospectors){
            let base = prosp.annualPrice;
            let inflation = prosp.salaryInflation;
            let reduction = prosp.salaryReduction; 
            let totalDiscount = inflation - reduction;

            let additional = base * totalDiscount;
            base = base + additional;
            expenses += base / 12;
        }
        return expenses;

    }

    getNetProfit(){
        // Net profit is revenue - expenses.
        

        // Update revenue
        
    }


    doDayCounter(){
        this.updateNetWorth();
        this.appreciateLand();
        this.prospect();
       
        
        this.timePass = 0;
        this.dayCounter++;
    }

    doWeekCounter(){
        
        // A week has passed
       
        console.log("Week has passed");
        this.updateGraphs();
        this.updateProspecting();
        this.economy.updateOrePrices();
        this.economy.getOutlook();
        let time = Helper.getTime();
        this.economy.updateEconGraphs(time);
        this.weekCounter++;
        this.dayCounter = 0;
        
    }

    doMonthCounter(){
        this.weekCounter = 0;
        this.monthCounter++;
        this.economy.updateEconomy();
        
        // Pay employee wages.. 
        let expenses = [0, 0, 0];
        let bps = this.basicProspectors;
        let aps = this.advancedProspectors; 
        let sps = this.superiorProspectors;
        expenses[0] = this.addProspectorExpenses(bps);
        expenses[1] = this.addProspectorExpenses(aps);
        expenses[2] = this.addProspectorExpenses(sps);

        // Now update 
        let totalProspectorExpenses = expenses[0] + expenses[1] + expenses[2];
        this.expenses += totalProspectorExpenses;
        this.spend(totalProspectorExpenses);

        let lastProsp = this.prospectorExpenses;
        // Think we have to make a new array so vue updates?
        let newProsp = [lastProsp[0] + expenses[0], lastProsp[1] + expenses[1], lastProsp[2] + expenses[2]];
        this.prospectorExpenses = newProsp;
        console.log("Prospector Expenses: ", this.prospectorExpenses);

    
    }

    doQuarterCounter(){
        console.log("Quarter has passed");
        this.monthCounter = 0;
        this.quarterCounter++;       
    }
    doYearCounter(){
        this.quarterCounter = 0;
        this.year++;

        //Reset annual varaibles
        this.landAppreciation = 0;
        this.expenses = 0;
        this.prospectorExpenses = [0, 0, 0];

    }





    getFrameTime(){
        let timeNow = performance.now();
        if(this.lastTime == null){
            this.lastTime = timeNow;
        }
        let frameTime = timeNow - this.lastTime;
        this.lastTime = timeNow;
        this.frameTime = frameTime / 1000;
        this.timePass += this.frameTime;
    }


    loop(){
        // Frame time is time in seconds since last frame.
        this.getFrameTime();
        // Update Development Progress on Land
        // TODO: this needs to use new counter.
        this.updateDeveloping(this.frameTime);


        if(this.timePass >= 0.5){
            this.doDayCounter();
        }
        if(this.dayCounter >= 7){
            this.doWeekCounter();
        }
        if(this.weekCounter >= 4){
            this.doMonthCounter();
        }
        if(this.monthCounter >= 4){
            this.doQuarterCounter();
        }
        if(this.quarterCounter >= 4){
            this.doYearCounter();
        }

        let moneyGain = this.mps * this.frameTime;
        this.money += moneyGain;
        // Should generate more land for sale if we fall below a certain threshold 
        window.requestAnimationFrame(this.loop.bind(this));
       
    }

    updateNetWorth(){
        let net = 0;
        let landValue = 0;
        net += this.money;
        for(let i in this.landOwned){
            landValue += this.landOwned[i].value;
        }
        this.landValue = landValue;
        this.netWorth = landValue + net;
    }

    purchase(item, type, subtype = null){
        if(type == 1){ 
            // Type 1 - Land 
            // Trying to buy land. 
            let landSale = this.landSale;
            let price = item.value;
            if(this.money >= price){
                for(let i in landSale) {
                    let land = landSale[i];
                    if(land == item) {
                        this.money -= price;
                        this.landSale.splice(i, 1);
                        // Push places land at the end of an array.
                        this.landOwned.push(land);
                        land.owned = 1;
                        return "Successfully brought land for: " + Helper.roundSuffix(price);
                    }
                }
            } else {
                let diff = price - this.money;
                return "Cannot Afford Land (" + Helper.roundSuffix(diff) + ")";
            }           
        }
        if(type == 2){
            // Type 2 - Prospector.
            
            // For simplicity sake, subtype is going to be "basic", "advanced", or, "superior".
            if(subtype !== null){
                let prospector = new Prospector(subtype);
                let price      = prospector.basePrice;
                if(this.canAfford(price)){
                    this.spend(price);
                }
                if(subtype == "basic"){
                    this.basicProspectors.push(prospector);
                }
                if(subtype == "advanced"){
                    this.advancedProspectors.push(prospector);
                }
                if(subtype == "superior"){
                    this.superiorProspectors.push(prospector);
                }
                
                let toNumber = {
                    "basic" : 0,
                    "advanced": 1,
                    "superior": 2,
                };
                this.totalProspectors[toNumber[subtype]]++;
                console.log("TOTAL: ", this.totalProspectors);
            }
        }
    }

    canAfford(price){
        if(this.money >= price){
            return true;
        }
        return false;
    }

    spend(price){
        this.money -= price;
    }

    sell(item, type){
        if(type == 1){
            // Type 1 - Land 
            /* 
            Need to remove item from landOwned array
            Need to regenerate land item and add to sales 
            */
           let landOwned = this.landOwned;
           for(let i = 0; i < landOwned.length; i++){
               let land = landOwned[i];
               if(land == item){
                   landOwned.splice(i, 1);
                   let price = item.value;
                   this.money += price;
                   item.owned = 0;
                   item.generate();
                   this.economy.landPrice(item);
                   this.landSale.push(item);
                   return "Successfully sold for: " + Helper.roundSuffix(price);  

               }
           }
        }
        return null;
    }
}



window.addEventListener("load", function () {
    Helper.printc("Window load event", "info");
    let router = new Router({
        routes: [{
                path: '/',
                name: "Company Info",
                component: cInfo
            },
            {
                path: '/land',
                name: "Land",
                component: cLand
            },
            {
                path: "/prospecting",
                name: "Prospecting",
                component: cProsp
            },
            {
                path: "/mining",
                name: "Mining",
                component: cMining
            },
            {
                path: "/smelting",
                name: "Smelting",
                component: cSmelting
            },
            {
                path: "/sales",
                name: "Sales",
                component: cSales
            },
            {
                path: "/competition",
                name: "Competition",
                component: cComp
            },
            {
                path: "/research",
                name: "Research",
                component: cResearh
            },
            {
                path: "/statistics",
                name: "Statistics",
                component: cStats
            },
            {
                path: "/economy",
                name: "Economy",
                component: cEconomy
            }
        ]
    });
    let miningIncremental = new Vue({
        el: "#mining",
        components:{
            resdisplay: cResDisplay
        },
        router: router,
        data: {
            inc: new Incremental()
        },

    });

    // Handle navbar collapse.
    let navitems = document.getElementsByClassName("nav-li");
    let navcollapse = document.getElementById("navbar-expand");
    let nav = new Navigation(navitems, navcollapse);
    nav.init();



});