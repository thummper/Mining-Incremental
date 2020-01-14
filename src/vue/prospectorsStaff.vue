<template>
    <section class="prospectStaffWrapper">
        <table class="oreDisplay">
            <tr>
                <th> Type </th>
                <th> Quantitiy </th>
                <th> Yearly Expenses </th>             
            </tr>
            <tr>
                <td class="tableTitle"> Basic </td>
                <td> 0 </td>
                <td> 0 </td>
     
            </tr>
            <tr>
                <td class="tableTitle"> Advanced </td>
                <td> 0 </td>
                <td> 0 </td>
            
            </tr>
            <tr>
                <td class="tableTitle"> Vasly Superior </td>
                <td> 0 </td>
                <td> 0 </td>
             
            </tr>

    
        </table>


    </section>
</template>
<script>

import * as helper from "../js/helper.js";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    methods:{
    },
    computed:{
    }
}
</script>