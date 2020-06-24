// Contract
export default class Contract{
    constructor(id, name, timeframe, ingots, duration){
        this.id = id;
        this.companyName = name;
        this.ingots = ingots;
        this.timeframe = timeframe;
        this.breakcost = 0;
        this.duration = duration;
        this.accepted = false;
    }
}