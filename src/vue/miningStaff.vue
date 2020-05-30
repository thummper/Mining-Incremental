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
        buyProspector: function(type){
            this.inc.purchase(null, 2, type);
        },
        tallyExpenses: function(prospectors){
            let expenses = 0;
            for(let i = 0; i < prospectors.length; i++){
                expenses += prospectors[i].annualPrice;
            }
            return expenses;
        }
    },
    computed:{
        basicProspectors: function(){
            return Helper.roundSuffix(this.inc.basicProspectors.length);
        },
        advancedProspectors: function(){
            return Helper.roundSuffix(this.inc.advancedProspectors.length);
        },
        superiorProspectors: function(){
            return Helper.roundSuffix(this.inc.superiorProspectors.length);
        },
        basicExpenses: function(){
            let expenses = this.tallyExpenses(this.inc.basicProspectors);
            return "£" + Helper.roundSuffix(expenses);
        },
        advancedExpenses: function(){
            let expenses = this.tallyExpenses(this.inc.advancedProspectors);
            return "£" + Helper.roundSuffix(expenses);
        },
        superiorExpenses: function(){
            let expenses = this.tallyExpenses(this.inc.superiorProspectors);
            return "£" + Helper.roundSuffix(expenses);
        }

    }
}
</script>