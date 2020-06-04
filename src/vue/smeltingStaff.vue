<template src="./html/smelting-staff.html"></template>
<script>
import * as Helper from "../js/Helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    methods:{
        buySmeltOp: function(){
           console.log("Benis");
           this.inc.purchase(null, 4, null);
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
        smeltingOperators: function(){
            return Helper.roundSuffix(this.inc.smeltingOperators.length);
        },
        smeltingOpExpenses: function(){
            let expenses = this.tallyExpenses(this.inc.smeltingOperators);
            return "£" + Helper.roundSuffix(expenses);
        },


    },
}
</script>