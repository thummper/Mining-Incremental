import * as helper from "./Helper.js";
import Island from './Island.js';

export default class Location {
    constructor(tier = 0, genArgs = [1.1, 1.1, 1.1, 1.1]) {
        this.previousValue = 0;
        this.value = 0;

        this.basePrice = 0;
        this.oreWorth = 0;

        this.name, this.estimate, this.ores;
        this.img;
        this.image;
        this.owned = 0;
        this.tier = tier;
        this.genArgs = genArgs;
        this.developing = false;
        this.developed = false;
        this.developedModifier = 2;
        this.developPrice = 0;
        this.developTime = 0;
        this.timePass = 0;
        this.displaying = false;

        this.bases = [
            [500000, 400000, 250000, 100000], // Tier 0
            [300000, 200000, 100000, 50000], // Tier 1
            [150000, 100000, 50000, 25000], //Tier 2
            [90000, 70000, 30000, 10000], // Tier 3
            [30000, 25000, 10000, 5000], //Tier 4
        ];
        this.suffixs = ["Hills", "Fields", "Meadows", "Quarry", "Mine"];

        this.island = null;

        this.generate();
    }

    generate() {
        this.name = helper.generateName();
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1) + " " + helper.randomFromArray(this.suffixs);
        this.developTime = Math.floor(helper.randomNumber(2, 8, 0) / (this.tier + 1));
        this.developed = false;
        this.developing = false;
        this.estimate = helper.randomNumber(0.67, 0.98, 0);

        let randFactor = helper.randomNumber(0.5, 1.2, 0);
        let baseOres = this.bases[this.tier];
        for (let i in this.genArgs) {
            if (this.genArgs[i] != 0) {
                baseOres[i] *= Math.round(this.genArgs[i]);

            }
            baseOres[i] *= randFactor;
            baseOres[i] = Math.round(baseOres[i]);
        }
        
        this.ores = baseOres;
        this.island = new Island({xl: 0, xr: 1000, yt: 0, yb: 600}, helper.randomNumber(1, 6000));
        this.island.generate();
    }
}