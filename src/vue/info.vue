<template>
    <div class="infoWrapper shadow">
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
                <td> £ 0 </td>
            </tr>
            <tr>
                <td> Net Profit </td>
                <td> £ 0 </td>
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
            }
        }
    }
</script>