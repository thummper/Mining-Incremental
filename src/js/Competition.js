import * as Helper from "./Helper.js";
export default class Competition{
    // Fake companies own land and mine directly from that land for less complexity
    /* 

    Every quarter / year, they should review their operations and choose goals based on how well the company is doing:
    Growth: Increase mining capabilities
    Upgrade: Increase mining success / reduce production costs
    Cut Costs: Temp reduce costs by X percent, increase over time based on competence

    If a company has nothing to mine and no land, it must take out debt in order to purchase new land
    Once debt reaches a certain limit (X % of companies value, the company will file for bankruptcy and liquidate its assets)

    In order to takeover a company, you must pay at least the net worth of the company plus some bonus based on competence of management
    They may not want to sell to you which will lead to a hostile takeover that will cost more money (plus larger bonus)

    */
    constructor(){
        this.name;
        this.expenses = 0;
        this.debt = 0;
        this.income   = 0;
        // Current company action
        this.target   = 0;

        // Competence of management
        this.competence;
        // Land owned by company
        this.land;

         // Salary for staff
        this.staffBaseExpense = 1000;
        this.minesOwned = [0, 0, 0, 0];
        this.mineGrowthRate = [0.1, 0.01, 0.001, 0.0001];
        this.baseEff = [1, 1, 1, 1];
        // Cost to run a mine
        this.minesRunningCost = [100, 500, 1000, 2000];
        // Staff required to operate each mine.
        this.mineStaff = [100, 200, 300, 400];
        
    }

    initCompany(minFunds){
        /* 
        Init company: 
        - Name
        - Money
        - Starting Mines
        - Competence
        
        */
       this.name = Helper.generateName();
       this.money = Helper.randomNumber(minFunds, minFunds * 2, 0);
       this.competence = Helper.randomNumber(0, 1, 0);
       
    }

    cutCosts(){
        // Temp reduce running costs and salary
        
    }

    upgradeCompany(){
        // Improve running cost perm, increase efficiency also?

    }

    operateCompany(){
        // Mine and sell ores
    }

    reviewOperations(){
        // Review every quarter? 
        // Compare exp to income and adjust operations.
    }
}