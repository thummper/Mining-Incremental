// Generate contracts
import * as Helper from "./Helper.js";
import Contract from "./contract.js";
export default class contractGenerator{
    constructor(){
        // Make generic company names for offering companies
        this.companyNames = [
            "Applied Forging",
            "Material Magics",
            "Glenpour",
            "Gold Extrusions",
            "Valuable Platings"
        ];
        // Time frame in weeks?
        this.timeIndex = 0;
        this.defaultTimes = [
            1,
            16,
            32
        ];
        this.baseAmounts = [
            [20, 10, 5 , 3],
            [320, 160, 80, 48],
            [640, 320, 160, 96]


        ]
    }

    getIngots(ingotDifference){
        // How should we generate ingots?
        // Perhaps some percentage of overall income?
        let totalDifference = ingotDifference.reduce((a, b) => {
            return a + b;
        });
        console.log("Total: ", totalDifference);

        let ingots = this.baseAmounts[this.timeIndex];
        
        for(let i in ingots){
            ingots[i] += 0.8 * ingotDifference[i] / (this.defaultTimes[this.timeIndex]);
        }
        return ingots;
    }

    generateContract(ingotDifference){
        // Generate a new contract.

        // Get ID
        let id = makeid(4);
        // Get Name
        let name = Helper.randomFromArray(this.companyNames);
        // Work out timeframe
        this.timeIndex = Helper.randomint(this.defaultTimes.length);
        console.log("index: ", this.timeIndex);
        let timeframe = this.defaultTimes[this.timeIndex];
        // Work out ore (probably based on company production)
        let ingots = this.getIngots(ingotDifference);
        let contract = new Contract(id, name, timeframe, ingots);
        
        return contract;
    }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }