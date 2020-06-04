export default class SmeltingOp{
    constructor(){
        // Instantiated with a type.
        this.types = {
            "basic" : {
                basePrice: 5000,
                annualPrice: 8000,
                costReduction: 0,
                baseEfficiency: 0.4,
                salaryReduction: 0,
                salaryInflation: 0,
                boostedEfficiency: 0,
            },

        };
        // Todo, inherit this.
        let type = this.types["basic"];
        this.basePrice = type.basePrice;
        this.annualPrice = type.annualPrice;
        this.costReduction = type.costReduction;
        this.baseEfficiency = type.baseEfficiency;
        this.salaryReduction = type.salaryReduction;
        this.salaryInflation = type.salaryInflation;
        this.boostedEfficiency = type.boostedEfficiency;

    }
}