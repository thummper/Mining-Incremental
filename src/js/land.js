import * as Helper from "./Helper.js";
import Island from './Island.js';

export default class Land {
    constructor(tier = 4, genArgs = [1.1, 1.1, 1.1, 1.1]) {
        this.name;

        this.genArgs = genArgs;
        this.tier    = tier;
        


        this.basePrice = 0;
        this.oreWorth  = 0;
        this.previousValue = 0;
        this.value = 0;
        this.ore           = [0, 0, 0, 0];
        this.baseOre       = [0, 0, 0, 0];
        this.prospectedOre = [0, 0, 0, 0];

        this.developmentTime = 0;
        this.developed  = false;
        this.developing = false;
        this.imagePath;
        this.image;
        this.owned = 0;

        this.developed    = false;
        this.developing   = false;
        this.developPrice = 0;
        this.timePass     = 0;
        this.developedModifier = 2;
        this.displaying   = false;

        
        this.bases = [
            [500000, 400000, 250000, 100000], // Tier 0
            [300000, 200000, 100000, 50000], // Tier 1
            [150000, 100000, 50000,  25000], //Tier 2
            [90000,  70000, 30000,   10000], // Tier 3
            [30000,  25000, 10000,   5000], //Tier 4
        ];
        this.suffixs = ["Hills", "Fields", "Meadows", "Quarry", "Mine"];
        this.island = null;
        this.generate();
    }

    generate() {
        this.name = Helper.generateName();
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1) + " " + Helper.randomFromArray(this.suffixs);

        this.developmentTime = Math.floor(Helper.randomNumber(2, 8, 0) / (this.tier + 1));


        this.developed  = false;
        this.developing = false;

        let randFactor = Helper.randomNumber(0.5, 1.2, 0);
        let baseOres   = this.bases[this.tier];

        for (let i in this.genArgs) {
            if (this.genArgs[i] != 0) {
                baseOres[i] *= Math.round(this.genArgs[i]);
            }

            baseOres[i] *= randFactor;
            baseOres[i] = Math.round(baseOres[i]);
        }

        this.ore = baseOres;
        this.baseOre = baseOres;

        this.island = new Island({xl: 0, xr: 1000, yt: 0, yb: 600}, Helper.randomNumber(1, 6000));
        this.island.generate(this.ore);
    }


    updateProspected(ores){
        // Take ores away from ores add to prospected
        let newOres  = [0, 0, 0, 0];
        let newProsp = [0, 0, 0, 0];
        for(let i in this.ore){
            newOres[i]  = this.ore[i] - ores[i];
            newProsp[i] = this.prospectedOre[i] + ores[i];
        }
        this.ore           = newOres;
        this.prospectedOre = newProsp;
    }

}