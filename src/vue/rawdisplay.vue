<template>
  <div>
    <h3>{{ title }}</h3>
    <pre>{{ valueString }}</pre>
  </div>
</template>
<script>
const props = {
  name: "raw-displayer",
  title: {
    required: true,
    type: String
  },
  value: {
    required: true
  }
};
export default {
  props,
  computed: {
    valueString() {
        console.log("VAL: ", this.value);
        let ret = "";
        for(let item of this.value){
            console.log("ITEM: ", item);
            
            ret += item.name + "\n";
        }


      return ret;
    }
  }
};
</script>
<style scoped>
pre {
  text-align: start;
}
</style>