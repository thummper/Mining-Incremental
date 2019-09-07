<template>
<div class="resourceWrapper shadow">
    <div class="moneyDisplay">{{roundedMoney}}</div>
    <div class="flex-row">
        <table class="oreDisplay">
            <tr>
                <th></th>
                <th> Iron </th>
                <th> Copper </th>
                <th> Silver </th>
                <th> Gold </th>
            </tr>
            <tr id="prospectOre">
                <td class="tableTitle">Prospected</td>
                <td class="block iron"> 0t ({{getPIron}})</td>
                <td class="block copper"> 0t ({{getPCopper}})</td>
                <td class="block silver"> 0t ({{getPSilver}})</td>
                <td class="block gold"> 0t ({{getPGold}})</td>
            </tr>
            <tr id="minedOre">
                 <td class="tableTitle">Raw</td>
                <td class="block iron"> 0t </td>
                <td class="block copper"> 0t </td>
                <td class="block silver"> 0t </td>
                <td class="block gold"> 0t </td>
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
import * as helper from "../js/helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
            mined: [20, 50, 30, 20],
            ingots: [500, 200, 100]
        }
    },
    computed: {
        roundedMoney: function(){
            return "£" + helper.roundSuffix(this.inc.money);
        },
        getPIron: function(){
            return helper.roundSuffix(this.inc.prospectedAvail[0], 0);
        },
        getPCopper: function(){
             return helper.roundSuffix(this.inc.prospectedAvail[1], 0);   
        },
        getPSilver: function(){
             return helper.roundSuffix(this.inc.prospectedAvail[2], 0);   
        },
        getPGold: function(){
             return helper.roundSuffix(this.inc.prospectedAvail[3], 0);   
        }
   


    },


}
</script>