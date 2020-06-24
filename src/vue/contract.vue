<template src="./html/contract.html"></template>

<script>
import * as Helper from "../js/Helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc
       

        }
    },
    methods:{
        acceptContract: function (event) {
            this.inc.acceptContract(this.contract);
            this.$toasted.show("Successfully accepted contract");
        },

        declineContract: function(event){
            this.inc.declineContract(this.contract);
            this.$toasted.show("Successfully declined contract");

        },
        breakContract: function(event){

        },
    },
    props:{
        contract: Object
    },
    computed:{
        iron: function(){
            return Helper.roundSuffix(this.contract.ingots[0]);
        },
        copper: function(){
            return Helper.roundSuffix(this.contract.ingots[1]);
        },
        silver: function(){
            return Helper.roundSuffix(this.contract.ingots[2]);
        },
        gold: function(){
            return Helper.roundSuffix(this.contract.ingots[3]);

        }
    },

}
</script>