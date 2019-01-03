class Company {
    //A fake company that sells ingots to the market

    /* TODO: Note that companies with very larger cash / income will end up gowing exponentially */
    constructor(econ) {
        this.id = randomRange(0, 100, 0);

        let wordGen = new WordGen();
        this.networth = 0;
        this.name = wordGen.getWord();
        this.controller = econ;
        this.ingotsSold = [0, 0, 0, 0];
        this.productionRates = [];
        this.constant = 0;
        this.growthRates = [0, 0, 0, 0];
        this.rnd = null;
        this.cash = 0;
        this.expenses = 0;
        this.expenseGrowth = 0;
        this.lastProfit = 0;
        this.resets = -1;
        this.lastMine = [0, 0, 0, 0];
        this.restart();
    }


    /* TODO: trends and rallies in prices - prices tend to follow this pattern - ^v^v^v - perhaps the economy should have more of a factor, but sudden changed in this factor should be limited / offset*/
    restart() {
        this.cash = this.randomRange(9000, 21000);
        this.expenses = this.randomRange(1000, 26000);
        this.expenseGrowth = this.randomRange(9, 12);
        this.productionRates = [this.randomRange(0, 1.9, 0), this.randomRange(0, 1, 0), this.randomRange(0, 0.4, 0), this.randomRange(0, 0.2, 0)];
        this.constant = this.randomRange(200, 400, 0);
        this.rnd = randomRange(0.1, 0.89, 0);
        this.resets++;
    }

    mine() {
        for (let i = 0; i < this.ingotsSold.length; i++) {
            this.lastMine[i] = 0;
            let rate = 0;
            if (this.outlook > 0) {
                rate = this.productionRates[i] * this.controller.outlook;
            } else {
                rate = this.productionRates[i] * 0.09;
            }
            if (rate > 0) {
                this.ingotsSold[i] += rate * this.constant;
                this.lastMine[i] += rate * this.constant;
            } else {
                this.ingotsSold[i] += 0;

            }
        }
        return this.ingotsSold;
    }

    balanceSheet() {
        let profit = 0;
        for (let i = 0; i < this.ingotsSold.length; i++) {
            let sold = this.ingotsSold[i];
            let price = this.controller.ingotPrices[i];
            profit = (sold * price);
            this.lastProfit = profit;
        }
        let net = profit - this.expenses;
        this.cash += (profit - this.expenses);
        this.expenses += this.expenses * (this.expenseGrowth / 100);

        if (this.cash < -10000) {
            this.restart();
        } else {
            this.grow(net);
            this.value();
        }
    }

    value(){
        //Work out the net worth of the company. 
        this.networth = 0;
        this.networth += this.cash;
        for(let i in this.productionRates){
            let rate = this.productionRates[i];
            this.networth += (rate * this.controller.ingotPrices[i]);
        }
        

    }

    grow(net) {
        let potentialRates = [0.12, 0.08, 0.05, 0.03];
        if (net > 0) {
            //Company will use net profits to grow.
            //Company will use up to 30% of cash to upgrade facilities
            let budget = net * this.rnd;
            this.cash -= budget;
            for (let i = 0; i < this.productionRates.length; i++) {
                this.productionRates[i] += this.randomRange(0.001, potentialRates[i], 0) + (budget / 10000000);
            }
            this.expenseGrowth += this.randomRange(0.008, 0.1, 0);
        } else {
            //Company is running at a loss - try and cut expenses? 
            this.expenseGrowth -= this.randomRange(0.1, 0.3);
            //Company will dice roll - should we expand while running at a loss? 
            let roll = randomRange(0, 10, 0);
            if (roll < 7) { //Probably perfer to grow - once a company starts losing money it dies quickly.
                //Grow
                let budget = this.cash * (this.rnd / 2); //Grow at reduced rate.
                this.cash -= budget;
                for (let i = 0; i < this.productionRates.length; i++) {
                    this.productionRates[i] += this.randomRange(0.001, potentialRates[i] / 1.2, 0) + (budget / 1000000);
                    // (Also grow at a reduced rate)
                }
            }
        }

        //Net is operating

        if (this.cash >= this.expenses * 10 && this.net >= 0) {
            //Can cover expenses for awhile and net is positive - enter rapid growth phase 
            //Note that we've already grown using some of the net income.
            let largeBudget = this.cash * 0.75;
            console.log("Rapidly expanding with budget of: ", largeBudget);
            this.cash -= largeBudget;

            for (let i = 0; i < this.productionRates.length; i++) {
                this.productionRates[i] += largeBudget / 10000000;
            }

        }

    }


    randomRange(min, max, signed) {
        let num = Math.random() * (max - min) + min;
        if (signed) {
            num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        }
        return num;
    }


}



class Economy {

    /* 
    So it turns out simulating an economy is difficult.
    1 - Generate overall economic sentiment ( this affects ALL prices / demands ) - probably a very small number
    2 - The market sells ingots and we sell ingots 
    3 - Determine if the market is over or undersupplied for each ingot type. 
    4 - In oversupplied sectors, the target prices should fall,
    in undersupplied sectors, the target prices should raise
    5 - Generate ingot prices in ranges to the target prices 
    */

    constructor(inc) {
        this.inc = inc;
        this.outlook = this.changeOutlook();
        this.ingotPrices = [30, 300, 1400, 3000];
        this.ingotPriceTargets = [30, 300, 1400, 3000];
        this.counter = 0;
        this.companies = this.makeCompanies(20);
        this.defaultGrowth = [0.05, 0.04, 0.03, 0.02];
        this.demandFactor = [0, 0, 0, 0];
        this.growthController = [0, 0, 0, 0];


        this.ingotsSold = [0, 0, 0, 0];
        this.soldIngots = [0, 0, 0, 0];


        this.ingotDemands = [5000, 4500, 2000, 1000];
        this.demandModifiers = [0, 0, 0, 0];
        this.ingotFactors = [0.02, 0.1, 0.2, 0.3];
        //Holds the most recent price change.
        this.ingotPriceChange = [0, 0, 0, 0];

        this.trend = [0, 0, 0, 0];
        this.additionalFactor = [0, 0, 0, 0];


    }

    getName() {
        this.counter++
        return this.counter;

    }

    makeCompanies(amount) {
        let comp = [];
        for (let i = 0; i < amount; i++) {
            let company = new Company(this);
            comp.push(company);
        }
        return comp;
    }

    companiesMine() {

        let mined = [0, 0, 0, 0];

        for (let i = 0; i < this.companies.length; i++) {
            let company = this.companies[i];
            let companyMined = company.mine();
            company.balanceSheet();
            company.ingotsSold = [0, 0, 0, 0];
            for (let j in companyMined) {
                mined[j] += companyMined[j];
            }
        }
        return mined;

    }

    randomRange(min, max, signed) {
        let num = Math.random() * (max - min) + min;
        if (signed) {
            num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
        }
        return num;
    }

    changeOutlook() {
        this.outlook = this.randomRange(0, 1, 1);
        console.log(" %c New Economy Outlook: " + this.outlook, "color: white; background: black;");
    }


    updateMine() {
        //Every turn work out ingots sold. 
        let companyIngots = this.companiesMine();
        let playerSold = this.inc.oreManager.ingotsSold;
        for (let i = 0; i < playerSold.length; i++) {
            companyIngots[i] += playerSold[i];
            playerSold[i] = 0;
        }
        //Ok so ingotssold is ingots sold this turn, sold ingots is ingot sold in the month ( / economy turn)
        this.ingotsSold = companyIngots;
        for (let i in this.soldIngots) {
            this.soldIngots[i] += this.ingotsSold[i];
        }
        this.inc.updater.updateTargets();



    }

    changeEconomy() {
        console.log("Economy is updating");

        this.changeOutlook();
        this.updateMine();

        let priceFactors = [0, 0, 0, 0];


        let demand = this.ingotDemands;
        let supply = this.soldIngots;

        for (let i = 0; i < demand.length; i++) {

            let dem = demand[i];
            let sup = supply[i];
            let difference = dem - sup;

            if (difference > 0) {
                //Not met demand
                priceFactors[i] = (this.randomRange(0, 0.02, 0)) + (this.outlook / 45);
                demand[i] += (demand[i] * this.defaultGrowth[i] + (this.outlook / 80));
            } else {
                //Met demand
                //Price of ingots should decrease
                priceFactors[i] = -1 * this.randomRange(0, 0.14, 0) + (this.outlook / 35);
                demand[i] += demand[i] * this.defaultGrowth[i] - randomRange(0, 0.05, 0) + (this.outlook / 35);
            }
        }
        this.inc.updater.updateTargets();
        this.soldIngots = [0, 0, 0, 0];
        for (let i = 0; i < priceFactors.length; i++) {
            this.ingotPriceTargets[i] += this.ingotPriceTargets[i] * priceFactors[i];
            if(this.ingotPriceTargets[i] <= 0){
                this.ingotPriceTargets[i] += 40;
            }
        }
    }

    changePrices() {

        for (let i = 0; i < this.ingotPrices.length; i++) {
            let price = this.ingotPrices[i];
            let target = this.ingotPriceTargets[i];
            //console.log("Target: ", target);   
            let diff = target - price;
            //console.log("Difference: ", diff);
            //Difference between target and current price. 
            if (diff < 0) {
                //TODO: THE GREATER THE DIFFERENCE, THE GREATER THE VARIANCE 
                //Price is bigger than target
                if (this.growthController[i] > 0) {
                    this.growthController[i] /= 2;
                }
                this.growthController[i] -= this.randomRange(0, 0.12, 0);
            }
            if (diff > 0) {
                //Price is smaller than target
                if (this.growthController[i] < 0) {
                    this.growthController[i] /= 2;
                }
                this.growthController[i] += this.randomRange(0, 0.12, 0);
            }
            let random = this.randomRange(0, 0.2, 1);
            if (!this.outlook) {
                this.changeOutlook();
            }
            let factor = (this.outlook / 80) + random + this.growthController[i] + (this.additionalFactor[i] / 10);
            let change = price * factor;
            let percent = change / price;
            this.ingotPrices[i] += change;
            if (this.ingotPrices[i] < 0) {
                this.ingotPrices[i] = 1;
            }
            this.ingotPriceChange[i] = [change, percent * 100];
            if (change > 0) {
                this.trend[i] += 3;
            } else {
                this.trend[i] -= 3;
            }
        }


        //We have a certain percent change to enter a rally or rut - this should 
        //increase / decrease based on how many turns the price has increase / decreased

        let rand = Math.floor(randomRange(0, 100, 1)); //Number between -100 and 100.
        console.log("Additional factors: ", this.additionalFactor);
        for (let i = 0; i < this.additionalFactor.length; i++) {

            let fac = this.additionalFactor[i];
            console.log("Factor: ", fac);
            if (fac > 0) {
                this.additionalFactor[i] -= 1;
            }
            if (fac < 0) {
                this.additionalFactor[i] += 1;
            }
        }

        for (let i in this.trend) {
            let trend = this.trend[i];
            if (trend < 0) {
                if (trend < rand && rand < 0) {
                    this.trend[i] = 0;
                    console.log("Rut for: ", i);
                    this.additionalFactor[i] = -4;
                }
            } else if(trend > 0) {
                if (trend > rand && rand > 0) {
                    console.log("Rally for: ", i);
                    this.trend[i] = 0;
                    this.additionalFactor[i] = 4;
                }
            }
        }
    }
}