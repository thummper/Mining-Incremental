class MoneyManager{
    //Handles all of our money.
    constructor(){
        this.money = 100000;
        this.moneyGain = 0; //Money gained this tick
        this.moneyChange = [0];
    }

    removeMoney(amount){
        this.moneyGain += amount;
        this.money -= amount;
    }
    addMoney(amount){
        this.moneyGain += amount;
        this.money += amount;
    }

    tickMoney(){
        this.moneyChange.push(this.moneyGain);
        if(this.moneyChange.length > 4){
            this.moneyChange.splice(0, 1);
        }
        this.moneyGain = 0;
    }

}