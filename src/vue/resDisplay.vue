<template>
<div class="resourceWrapper shadow">
    <div class="moneyDisplay">Money: {{roundedMoney}}</div>
    <div class="flex-row">
        <table class="displayTable">
            <tr>
                <th></th>
                <th> Iron </th>
                <th> Copper </th>
                <th> Silver </th>
                <th> Gold </th>
            </tr>
            <tr id="estimatedOre">
                <td class="tableTitle"> Estimated </td>
                <td class="block iron">  {{getPIron}}t</td>
                <td class="block copper">{{getPCopper}}t</td>
                <td class="block silver">{{getPSilver}}t</td>
                <td class="block gold">  {{getPGold}}t</td>
            </tr>
            <tr id="prospectOre">
                <td class="tableTitle">Prospected</td>
                <td class="block iron"> {{getPRIron}}t</td>
                <td class="block copper"> {{getPRCopper}}t</td>
                <td class="block silver"> {{getPRSilver}}t</td>
                <td class="block gold"> {{getPRGold}}t</td>
            </tr>
            <tr id="minedOre">
                 <td class="tableTitle">Raw</td>
                <td class="block iron"> {{getMIron}}t </td>
                <td class="block copper"> {{getMCopper}}t </td>
                <td class="block silver"> {{getMSilver}}t </td>
                <td class="block gold"> {{getMGold}}t </td>
            </tr>
            <tr id="processedOre">
                 <td class="tableTitle">Ingots</td>
                <td class="block iron"> 0t </td>
                <td class="block copper"> 0t </td>
                <td class="block silver"> 0t </td>
                <td class="block gold"> 0t </td>
            </tr>
        </table>





    </div>
</div>
</template>

<script>
import * as Helper from "../js/Helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    computed: {
        roundedMoney: function(){
            return "£" + Helper.roundSuffix(this.inc.money);
        },
        getPIron: function(){
           
            return Helper.roundSuffix(this.inc.toProspect[0], 0);
        },
        getPCopper: function(){
             return Helper.roundSuffix(this.inc.toProspect[1], 0);   
        },
        getPSilver: function(){
             return Helper.roundSuffix(this.inc.toProspect[2], 0);   
        },
        getPGold: function(){
             return Helper.roundSuffix(this.inc.toProspect[3], 0);   
        },
        getPRIron: function(){
            return Helper.roundSuffix(this.inc.prospected[0], 0);    
        },
        getPRCopper: function(){
            return Helper.roundSuffix(this.inc.prospected[1], 0);    
        },
        getPRSilver: function(){
            return Helper.roundSuffix(this.inc.prospected[2], 0);    
        },
        getPRGold: function(){
            return Helper.roundSuffix(this.inc.prospected[3], 0);    
        },
        getMIron: function(){
            return Helper.roundSuffix(this.inc.mined[0], 0);
        },
        getMCopper: function(){
            return Helper.roundSuffix(this.inc.mined[1], 0);
        },
        getMSilver: function(){
            return Helper.roundSuffix(this.inc.mined[2], 0);
        },
        getMGold: function(){
            return Helper.roundSuffix(this.inc.mined[3], 0);
        },
   


    },


}
</script>