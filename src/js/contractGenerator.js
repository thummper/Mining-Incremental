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
        this.defaultTimes = [
            1,
            16,
            32
        ];
    }

    getIngots(){
        // How should we generate ingots?
        // Perhaps some percentage of overall income?
    }

    generateContract(){
        // Generate a new contract.

        // Get ID
        let id = makeid(4);
        // Get Name
        let name = Helper.randomFromArray(this.companyNames);
        // Work out timeframe
        let timeframe = Helper.randomFromArray(this.defaultTimes);
        // Work out ore (probably based on company production)
        let ingots = this.getIngots();
        let contract = new Contract();
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