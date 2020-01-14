export default class Prospector{
    constructor(type){
        // Instantiated with a type.

        this.types = {
            "Basic" : {
                basePrice: 10000,
                annualPrice: 20000,
                costReduction: 0,
                baseEfficiency: 0.4,
                salaryReduction: 0,
                boostedEfficiency: 0,
            },
            "Advanced" : {
                basePrice: 20000,
                annualPrice: 50000,
                costReduction: 0,
                baseEfficiency: 0.7,
                salaryReduction: 0,
                boostedEfficiency: 0,
            },
            "Superior" : {
                basePrice: 1000000,
                annualPrice: 750000,
                costReduction: 0,
                baseEfficiency: 1.2,
                salaryReduction: 0,
                boostedEfficiency: 0,
            }
        };
        this.hire(type);
    }

    hire(type){
        // A type of prospector is hired. 
    }
}