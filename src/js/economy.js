import * as helper from "../js/helper.js";
import Graph from "../js/graph.js";
/* 
    Economy class should observe supply and control ingot demand with simple factors
    The Economy class will also house the competition companies 


    Normal Tick: 
        Ingot prices should update,
        Competition companies should operate

    Special Tick:
        Ingot price targets should change based on supply / demand
        Condition of the economy should change 
        Supply & Demand should change
        Companies may pay dividends / Release sales figures

*/
export default class Economy{
    constructor(){

        this.lastOrePrices = [20, 45, 90, 220];
        this.orePrices     = [25, 50, 100, 250];

        this.oreTargets = [40, 100, 200, 800];

        this.lastIngotPrices = [50, 100, 200, 500];
        this.ingotPrices     = [50, 100, 200, 500];

        this.lastIngotTargets = [50, 100, 200, 500];
        this.ingotTargets     = [50, 100, 200, 500];


        this.outlook = 0.8;
        // Graphs
        this.landIndGraph     = new Graph("area");
        this.ironPriceGraph   = new Graph("line");
        this.copperPriceGraph = new Graph("line");
        this.silverPriceGraph = new Graph("line");
        this.goldPriceGraph   = new Graph("line");
        this.historicIronPrice   = [["00:00", 0]];
        this.historicCopperPrice = [["00:00", 0]];
        this.historicSilverPrice = [["00:00", 0]];
        this.historicGoldPrice   = [["00:00", 0]];




        this.currentLandIndex = 0;
        this.historicLandIndex = [];
    }

    updateOrePrices(){
        this.lastOrePrices = this.orePrices;
        this.orePrices = [0, 0, 0, 0];


        // Simple Update Logic
        for(let i = 0; i < this.orePrices.length; i++){
            let price = this.lastOrePrices[i];
            let target = this.oreTargets[i];
            if(price < target){
                price += helper.randomNumber(0, target * 1.25, 0);
            } else {
                price -= helper.randomNumber(0, target * 1.25, 0);
            }
            this.orePrices[i] = price;
        }
    }

    updateOreData(time){
        // Given time, update historic data for all ore prices.
        let orePrices = this.lastOrePrices;
        let historics = [this.historicIronPrice, this.historicCopperPrice, this.historicSilverPrice, this.historicGoldPrice];


        for(let i = 0; i < orePrices.length; i++){
            let price = orePrices[i];
            historics[i].push([time, price]);
        }

        for(let i = 0; i < historics.price; i++){
            while(historics[i].length > 100){
                historics[i].shift();
            }
        }
        this.updateOreGraphs();
    }

    updateOreGraphs(){
        let graphs = [this.ironPriceGraph, this.copperPriceGraph, this.silverPriceGraph, this.goldPriceGraph];
        let data   = [this.historicIronPrice, this.historicCopperPrice, this.historicSilverPrice, this.historicGoldPrice];
        for(let i = 0; i < graphs.length; i++){
        
            let graph = graphs[i];
            graph.update(data[i]);
        }
    }



    updateLandIndex(land, time){
        let counter = 0;
        for(let i = 0; i < land.length; i++){
            counter += land[i].value;
        }
        // Index counts average land price. 
        counter = Math.round(counter / land.length);
        // Counter is current land index
        this.currentLandIndex = counter; 
        // Push counter and data to historic for graphing
        this.historicLandIndex.push([time, counter]);

        while(this.historicLandIndex.length > 100){
            this.historicLandIndex.shift();
        }
        // Cant call this
        this.landIndGraph.update(this.historicLandIndex);
    }

  
    landPrice(land){
        let basePrice = helper.randomNumber(500000, 2000000, 0);
        land.basePrice = basePrice;
        land.developPrice = Math.floor(basePrice / (land.tier + 1));
        this.landUpdate(land);
        land.previousValue = land.value;
  
    }



    landUpdate(land){
        // Given a piece of land, adjust price based on economy, and work out its value.
        land.previousValue = land.value;
        

        if(this.outlook >= 0){
            let economyFactor = (land.basePrice * 0.2) * helper.randomNumber(0.008, 0.015, 0);
            land.basePrice += economyFactor;
            // If we own the land, this value needs to be added to accounting info (appreciation    )
        }
        //Update price of land based on ores.
        let oreValue = 0;
        let ores = land.ores;
        let orePrices = this.orePrices;
        
        for(let i = 0; i < ores.length; i++){
            let amount = ores[i];
            let value  = orePrices[i] * 0.03;
            let worth = amount * value;
            oreValue += worth;
        }
        land.oreWorth = oreValue;
        land.value = land.basePrice + land.oreWorth;

        if(land.developed){
            land.value =  land.value * land.developedModifier;
        }
    }


}