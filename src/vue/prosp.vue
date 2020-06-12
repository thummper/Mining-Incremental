<template>
<div class="sectionWrapper prospWrapper">
    <section class="mapWrapper">
        <div class="mapTop">
            <div class="map">
                <div class="defaultSlider">
                    <span> Default Land </span>
                    <label class="slider">
                        <input id="defaultSlider" type="checkbox" >
                        <span class="slider round"></span>
                    </label>
                </div>
                <canvas class="mapCanvas" id="mapDisplay"></canvas>
            </div>
        </div>
        <div class="split">
            <div class="splitTitle"> Land Queue </div>
        </div>
        <div class="mapBottom">
           <draggable class="dragWrapper" v-model="inc.landOwned">
                <land-card-small class="list-group-item" v-for="land in inc.landOwned" :land="land" :key="land.name" />
            </draggable>
        </div>
    </section>


    <section class="borderSection">
        <div class="title center">
            Prospectors (Global)
        </div>
        <div class="content">
            <prospecting-staff />
        </div>
    </section>
    
    <section class="prospInfo">
        <div class="prospPrevent" v-bind:class="{hide: this.activeLand !== null}">
            <div class="prospText">
                Select a Land card to view this information
            </div>
        </div>
        <tabs>
            <tab title="Iron">
              Iron Mine Info
            </tab>
            <tab title="Copper">
              Copper Mine Info
            </tab>
            <tab title="Silver">
              Silver Mine Info
            </tab>
            <tab title="Gold">
                Gold Mine Info
              </tab>
          </tabs>
    </section>
</div>
</template>
<script>

import draggable from 'vuedraggable';
import rawDist from './rawdisplay.vue';
import {Tabs, Tab} from 'vue-slim-tabs';
import prospectStaff from "../vue/prospectorsStaff.vue";
import ProspCanvas from "../js/ProspectCanvas.js";
import landCardSmall from '../vue/landCardSmall.vue';
import * as Helper from "../js/Helper.js";

export default {
    data () {
        return {
            inc: this.$parent.inc,
            canvas: null,
            scaling: 1,
            activeLand: null,
            slider: null,
        }
    },
    mounted: function(){
        this.inc.prospCanvas = new ProspCanvas(document.getElementById("mapDisplay"));
        this.slider = document.getElementById("defaultSlider");
        this.slider.addEventListener("change", function(event){
    
            if(this.activeLand){
                    let value = event.target.checked;
                    this.activeLand.default = event.target.checked;
                    if(value){
                        // Set it to true
                        if(this.defaultLand){
                            this.inc.defaultLand.default = false;
                        }
                    }
                    this.inc.defaultLand = this.activeLand;
                    //TODO: When land is sold, need to check if it is default or this will break.
            }
        }.bind(this));
        if(this.inc.defaultLand){
            this.draw(this.inc.defaultLand);
        }

    },
    destroyed: function(){
        this.inc.prospCanvas = null;
        if(this.activeLand){
            this.activeLand.displaying = false;
            this.activeLand = null;
        }

    },
    components: {
        'land-card-small': landCardSmall,
        Tabs, 
        Tab,
        'prospecting-staff': prospectStaff,
        'raw-displayer': rawDist,
        draggable,
    },
    methods: {
        draw: function(land){
            // Called when land card clicked. 
            if(this.activeLand !== null){
                this.activeLand.displaying = false;
            }
            this.activeLand = land;
      
            this.slider.checked = land.default;
            this.activeLand.displaying = true;
            this.inc.prospCanvas.setIsland(land.island);
        },
    },

}
</script>
