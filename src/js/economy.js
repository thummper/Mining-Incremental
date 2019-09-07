import * as helper from "../js/helper.js";
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
        this.ingotPrices  = [50, 100, 200, 500];
        this.ingotTargets = [50, 100, 200, 500];
        this.outlook = 0.8;
    }

  
    landPrice(land){
        let basePrice = helper.randomNumber(500000, 2000000, 0);
        this.landUpdate(land);
        land.basePrice = basePrice;
    }

    landUpdate(land){

        if(this.outlook >= 0){
            let add = (land.basePrice * 0.2) * helper.randomNumber(0.008, 0.015, 0);
            console.log("Appreciation: ", add);
            land.basePrice += add;
        }


        //Update price of land based on ores.
        let orePrice = 0;
        let ores = land.ores;
        for(let i = 0; i < ores.length; i++){
            let oreAmount = ores[i];
            let oreValue = this.ingotPrices[i] * 0.03;
            let oreWorth = oreAmount * oreValue;
            orePrice += oreWorth;
        }
        land.oreWorth = orePrice;
    }
}