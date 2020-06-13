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
        </div>
    </section>

    <section class="borderSection">
        <div class="title center">
            Offered Contracts (0)
        </div>
        <div class="content">
            <!-- Offered contracts -->
        </div>
    </section>

</div>
</template>
<script>
import metalPrice from "../vue/metalPrice.vue";
export default{
    data () {
        return {
            inc: this.$parent.inc,
          
        }
    },
    components: {
        'metal-prices': metalPrice
    },

    mounted: function(){

    },
    destroyed: function(){

    }
}


</script>