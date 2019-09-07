
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
             <td> Net Worth  </td>
             <td> {{netWorth}}</td>
        </tr>
        <tr>
             <td> Share Price </td>
             <td> Not Listed </td>
        </tr>
        <tr>
             <td> Revenue </td>
             <td>£0 </td>
        </tr>
        <tr>
             <td> Operating Expenses </td>
             <td> £0 </td>
        </tr>
        <tr>
             <td> Net Income  </td>
             <td> £0 </td>
        </tr>

        </table>



    </div>
</template>
<script>
import * as helper from "../js/helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    computed: {
         netWorth: function(){
              return "£ " + helper.roundSuffix(this.inc.netWorth);
         }
    }
}
</script>