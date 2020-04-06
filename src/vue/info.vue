<template>
    <div class="sectionWrapper shadow">
        <table class="infoTable">
            <tr>
                <td> Company Name </td>
                <td> <input v-model="inc.name" placeholder="Rio Tinto"> </td>
            </tr>
            <tr>
                <td> Company CEO </td>
                <td> <input v-model="inc.ceo" placeholder="Sam Walsh"></td>
            </tr>
            <tr>
                <td> Share Price </td>
                <td> Not Listed </td>
            </tr>
            <tr>
                <td style="text-align:center; padding-top: 10px; padding-bottom: 10px;" colspan="2"> Net Worth </td>
            </tr>
            <tr>
                <td> Cash </td>
                <td> {{cash}} </td>
            </tr>
            <tr>
                <td> Land Value </td>
                <td> {{landValue}}</td>
            </tr>
            <tr>
                <td> Total Worth</td>
                <td> {{netWorth}}</td>
            </tr>

            <tr>
                <td style="text-align:center; padding-top: 10px; padding-bottom: 10px;" colspan="2"> Income / Expenses </td>
            </tr>
            <tr>
                <td> Revenue </td>
                <td> £ 0 </td>
            </tr>
            <tr>
                <td> Asset Appreciation </td>
                <td> {{appreciation}}</td>
            </tr>
            <tr>
                <td> Operating Expenses </td>
                <td> {{operatingExpenses}} </td>
            </tr>
            <tr>
                <td> Prospector Expenses </td>
                <td> {{totalProspectorExpenses}} </td>
            </tr>
            <tr>
                <td > Basic </td>
                <td> {{basicProspectorExpenses}} </td>
            </tr>
            <tr>
                <td> Advanced </td>
                <td> {{advancedProspectorExpenses}} </td>
            </tr>
            <tr>
            <td> Superior </td>
                <td> {{superiorProspectorExpenses}} </td>
            </tr>
            <tr>
                <td> Net Profit </td>
                <td> {{netProfit}} </td>
            </tr>

        </table>



    </div>
</template>
<script>
    import * as Helper from "../js/Helper.js";
    export default {
        data() {
            return {
                inc: this.$parent.inc,
            }
        },
        computed: {
            netWorth: function () {
                return "£ " + Helper.roundSuffix(this.inc.netWorth);
            },
            cash: function () {
                return "£ " + Helper.roundSuffix(this.inc.money);

            },
            landValue: function () {
                return "£ " + Helper.roundSuffix(this.inc.landValue);
            },
            appreciation: function(){
                return "£ " + Helper.roundSuffix(this.inc.landAppreciation);
            },
            basicProspectorExpenses: function(){
                return "£ " + Helper.roundSuffix(this.inc.prospectorExpenses[0]);
            },
            advancedProspectorExpenses: function(){
                return "£ " + Helper.roundSuffix(this.inc.prospectorExpenses[1]);
            },
            superiorProspectorExpenses: function(){
                return "£ " + Helper.roundSuffix(this.inc.prospectorExpenses[2]);
            },
            totalProspectorExpenses: function(){
                 return "£ " + Helper.roundSuffix(this.inc.prospectorExpenses[0] + this.inc.prospectorExpenses[1] + this.inc.prospectorExpenses[2]);  
            },
            operatingExpenses: function(){
                return "£ " + Helper.roundSuffix(this.inc.expenses);
            },
            netProfit: function(){
                return "£ " + Helper.roundSuffix(this.inc.netProfit);
            }
        }
    }
</script>