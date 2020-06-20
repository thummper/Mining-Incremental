<template src="./html/contract.html"></template>

<script>
import * as Helper from "../js/Helper.js";
export default{
    data () {
        return {
       

        }
    },
    methods:{
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