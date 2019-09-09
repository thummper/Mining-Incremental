let randomWords = require('random-words');
import * as helper from "../js/helper.js";
import Vue from 'vue';
import Router from 'vue-router';

// Import templates 
import cInfo from '../vue/info.vue';
import cMap from '../vue/map.vue';
import cProsp from '../vue/prosp.vue';
import cMining from '../vue/mining.vue';
import cSmelting from '../vue/smelting.vue';
import cSales from '../vue/sales.vue';
import cComp from '../vue/competition.vue';
import cResearh from '../vue/research.vue';
import cStats from '../vue/stats.vue';
import cResDisplay from '../vue/resDisplay.vue';
import Location from "../js/location.js";
import Economy from "../js/economy.js";
// Import other stuff. 
import Toasted from 'vue-toasted';

let options = {
    duration : 1500
};
Vue.use(Toasted, options);
Vue.use(Router);



// Define Vue Components? 

class Navigation {

    constructor(navItems, navExpand) {
        this.items = navItems;
        this.expand = navExpand;
        this.collapsed = false;
    }

    init() {
        this.checkWidth();
        window.addEventListener("resize", this.checkWidth.bind(this));
        console.log(this.expand);
        this.expand.addEventListener("click", function () {
            if(this.collapsed){
                this.showItems();
                this.collapsed = false;
            } else {
                this.hideItems();
                this.collapsed = true;
            }
            console.log("clicked");
        }.bind(this), false);
    }

    checkWidth() {
        if (window.innerWidth <= 900 && this.collapsed == false) {
            // We should collapse the navbar 
            this.hideItems();
            this.collapsed = true;
            // Hide all nav items except for first, show the expand icon.
        } else if (window.innerWidth >= 900) {
            this.showItems();
            this.collapsed = false;
        }
    }

    showItems() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].style.display = "flex";
        }
    }

    hideItems() {
        for (let i = 0; i < this.items.length; i++) {
            if (i != 0) {
                this.items[i].style.display = "none";
            }
        }
    }
}


class Incremental{

    constructor(){
        // Frame information.
        this.lastTime = null;
        this.frameTime = 1; 
        this.smallCounter = 0;
        this.largeCounter = 0;


        // Company Info vars
        this.name = randomWords();
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1) + " Inc";
        this.ceo = "";

        this.netWorth = 0;
        this.revenue = 0;
        this.expenses = 0;
        this.income = 0;

        // Land vars 
        this.landSale = [];
        this.landOwned = [];
        this.images = ["far-hills", "forest-valley", "grass-hills", "hill-river", "mountains", "rocky-valley", "sand-hills", "sand-mountain", "sandy-land", "tall-mountain", "alpine", "cloudy-mountains", "dark-mountains", "grassy-mountains", "green", "ocean", "rolling", "sepia-mountains", "starry-mountains", "treeland"]; 
        this.imgBase = "static/images/"; 
        this.usedImages = [];

        // Economy vars 

        this.money = 10.5;
        this.mps = 1;

        // Mineral vars 
        this.prospectedAvail = [0, 0, 0, 0];

        this.prospected = [0, 0, 0, 0];
        this.mined      = [0, 0, 0, 0];
        this.ingots     = [0, 0, 0, 0];


        // Graph vars 
        this.netWorthTime = [];
        
        this.economy = new Economy();
        this.init();
    }

    init(){
        // Generate everything we need and start the gameloop 
       

        for(let i = 0, j = this.images.length; i < j; i++){
            let land = this.generateLand(4);
            if(i == j - 1){
                // Start with 1 piece of developed land.
                land.owned = 1;
                land.developed = 1;
                this.landOwned.push(land);
            } else {
                this.landSale.push(land);
            }
        }
        this.updateAvailiableProspecting();

        this.loop();
    }

    updateAvailiableProspecting(){
        // Update the amount of ore we have to prospect. 
        this.prospectedAvail = [0, 0, 0, 0];
        
        
        // FYI - Vue wont recognise our array changes if we do it like this, need to make a new array 
        //for(let i in this.prospectedAvail){
        //     this.prospectedAvail[i] = 0;
        // }
    
        let ownedLand = this.landOwned;
        for(let i in ownedLand){
            let ores = ownedLand[i].ores;
            for(let j in ores){
                this.prospectedAvail[j] += ores[j];
            }
        }
    }

    generateLand(){
        let land = new Location();
        this.economy.landPrice(land);

        let randomIndex = helper.randomFromArray(this.images, 1);
        let randomImage = this.images[randomIndex];

        this.images.splice(randomIndex, 1);
        this.usedImages.push(randomImage);

        land.img = this.imgBase + randomImage;
        land.image = this.randomImage;

        return land;
    }

    loop(){
        let timeNow = performance.now();
        if(this.lastTime == null){
            this.lastTime = timeNow;
        }
        let frameTime = timeNow - this.lastTime;
        this.lastTime = timeNow;
        this.frameTime = frameTime / 1000;

        this.smallCounter += this.frameTime;
        this.largeCounter += this.frameTime;

        if(this.smallCounter >= 2){

            // Update Net Worth
            this.updateNetWorth();
            let allLand = this.landOwned.concat(this.landSale);
            for(let i in allLand){
                this.economy.landUpdate(allLand[i]);
            }


            // // Update prices of all land
            // for(let i in this.landOwned){
            //     this.economy.landUpdate(this.landOwned[i]);
            // }
            // for(let i in this.landSale){
            //     this.economy.landUpdate(this.landSale[i]);
            // }


            console.log("Small Tick");
            this.smallCounter = 0;
        }
        if(this.largeCounter >= 10){
            console.log("Large Tick");
            this.largeCounter = 0;


            let date = new Date();
            let h = date.getHours();
            let m = date.getMinutes();
            let s = date.getSeconds();
            if(m < 10){
                m = "0" + m;
            }
            if(s < 10){
                s = "0" + s;
            }

            let dataPoint = [h + ":" + m + ":" + s, this.netWorth];
            console.log(dataPoint);
            this.netWorthTime.push(dataPoint);
        }


        let moneyGain = this.mps * this.frameTime;
        this.money += moneyGain;
        // Should generate more land for sale if we fall below a certain threshold 

        window.requestAnimationFrame(this.loop.bind(this));
    }

    updateNetWorth(){
        let net = 0;
        net += this.money;
        for(let i in this.landOwned){
            net += this.landOwned[i].value;
        }
        this.netWorth = net;
    }

    purchase(item, type){
        if(type == 1){ // Type 1 - Land 
            // Trying to buy land. 
            let landSale = this.landSale;
            let price = item.value;
            if(this.money >= price){
                for(let i in landSale){
                    let land = landSale[i];
                    if(land == item){
                        this.money -= price;
                        this.landSale.splice(i, 1);
                        this.landOwned.push(land);
                        land.owned = 1;
                        return "Successfully brought land for: " + helper.roundSuffix(price);
                    }
                }

            } else{
                let diff = price - this.money;
                return "Cannot Afford Land (" + helper.roundSuffix(diff) + ")";
            }
                    
        }
        
        
    }

    sell(item, type){
        if(type == 1){ // Type 1 - Land 
            /* 
            Need to remove item from landOwned array
            Need to regenerate land item and add to sales 
            */
           let landOwned = this.landOwned;
           let price = item.value;
           for(let i in landOwned){
               let landO = landOwned[i];
               if(landO == item){


                this.money += price;
                this.landOwned.splice(i, 1);
                item.generate();
                this.economy.landPrice(item);
                this.landSale.push(item);
                item.owned = 0;
                return "Successfully sold for: " + helper.roundSuffix(price);


               }
           }
  
          
        }
      
        return null;
    }
}



window.addEventListener("load", function () {
    helper.printc("Window load event", "info");
    let router = new Router({
        routes: [{
                path: '/',
                name: "Company Info",
                component: cInfo
            },
            {
                path: '/map',
                name: "Map",
                component: cMap
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