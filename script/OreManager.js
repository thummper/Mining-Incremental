class OreManager{
    constructor(){
        //Manages ore.
    
        this.resTick   = [0, 0, 0, 0];
        this.unrefTick = [0, 0, 0, 0];
        this.refTick   = [0, 0, 0, 0];
        this.oreReserves  = [0, 0, 0, 0];
        this.oreUnrefined = [0, 0, 0, 0];
        this.oreRefined   = [0, 0, 0, 0];

        this.ingotsSold = [0, 0, 0, 0];

        this.reservesChange  = [[0], [0], [0], [0]];
		this.unrefinedChange = [[0], [0], [0], [0]];
		this.refinedChange   = [[0], [0], [0], [0]];
    }

    addReserves(index, amount){
        this.oreReserves[index] += amount;
        this.resTick[index] += amount;


    }
    removeReserves(index, amount){
        this.oreReserves[index] -= amount;
        this.ingotsSold[index] += amount;
        this.resTick[index] -= amount;

    }

    addUnrefined(index, amount){
        this.oreUnrefined[index] += amount; 
        this.unrefTick[index] += amount;

    }
    removeUnrefined(index, amount){
        this.oreUnrefined[index] -= amount; 
        this.unrefTick[index] -= amount;

    }

    addRefined(index, amount){
        this.oreRefined[index] += amount;
        this.refTick[index] += amount;

    }
    removeRefined(index, amount){
        this.oreRefined[index] -= amount;
        this.refTick[index] -= amount;

    }

    tickOre(){
        //Trim aswell
        for(let i in this.resTick){
            this.reservesChange[i].push(this.resTick[i]);
            this.resTick[i] = 0;
            if(this.reservesChange[i].length > 4){
                this.reservesChange[i].splice(0, 1);
            }
        }

        for(let i in this.unrefTick){
            this.unrefinedChange[i].push(this.unrefTick[i]);
            this.unrefTick[i] = 0;
            if(this.unrefinedChange[i].length > 4){
                this.unrefinedChange[i].splice(0, 1);
            }

        }
        
        for(let i in this.refTick){
            this.refinedChange[i].push(this.refTick[i]);
            this.refTick[i] = 0;
            if(this.refinedChange[i].length > 4){
                this.refinedChange[i].splice(0, 1);
            }
        }
    }

}