<template>
<div class="sectionWrapper">
    <h1> Sales </h1>
    <metal-prices></metal-prices>

    <section class="borderSection">
        <div class="title center">
            Active Contracts (0)
        </div>
        <div class="content">
            <!-- Active contract section -->
            <contract-item v-for="contract in inc.acceptedContracts" v-bind:key="contract.id"  :contract="contract" />
        </div>
    </section>

    <section class="borderSection">
        <div class="title center">
            Offered Contracts (0)
        </div>
        <div class="content">
            <!-- Offered contracts -->
            <contract-item v-for="contract in inc.contracts" v-bind:key="contract.id"  :contract="contract" />



        </div>
    </section>

</div>
</template>
<script>
import metalPrice from "../vue/metalPrice.vue";
import contract from "../vue/contract.vue";
export default{
    data () {
        return {
            inc: this.$parent.inc,
        }
    },
    components: {
        'metal-prices': metalPrice,
        'contract-item': contract
    },

    mounted: function(){

    },
    destroyed: function(){

    }
}


</script>