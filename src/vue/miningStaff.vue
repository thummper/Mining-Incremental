<template src="./html/mining-staff.html"></template>
<script>

import * as Helper from "../js/Helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    methods:{
        buyMiner: function(type){
            this.inc.purchase(null, 3, type);
        },
        tallyExpenses: function(miners){
            let expenses = 0;
            for(let i = 0; i < miners.length; i++){
                expenses += miners[i].annualPrice;
            }
            return expenses;
        }
    },
    computed:{
        basicMiners: function(){
            return Helper.roundSuffix(this.inc.basicMiners.length);
        },
        professionalMiners: function(){
            return Helper.roundSuffix(this.inc.professionalMiners.length);
        },
        ascendedMiners: function(){
            return Helper.roundSuffix(this.inc.ascendedMiners.length);
        },
        basicExpenses: function(){
            let expenses = this.tallyExpenses(this.inc.basicMiners);
            return "£" + Helper.roundSuffix(expenses);
        },
        professionalExpenses: function(){
            let expenses = this.tallyExpenses(this.inc.professionalMiners);
            return "£" + Helper.roundSuffix(expenses);
        },
        ascendedExpenses: function(){
            let expenses = this.tallyExpenses(this.inc.ascendedMiners);
            return "£" + Helper.roundSuffix(expenses);
        }

    }
}
</script>