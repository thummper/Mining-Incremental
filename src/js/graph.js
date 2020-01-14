import * as helper from "../js/helper.js";
export default class Graph {
    constructor(type) {
        this.type = type;
        this.options = {
            "area": {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return helper.roundSuffix(params.data)
                    }
                },
                xAxis: [{}],
                yAxis: [{
                    type: 'value'
                }],
                dataZoom: [
                    {
                        type: 'inside',

                    },
                    {
                        show: true,
                        type: 'slider',
                        y: '90%',

                    },
                ],
            },
            "line": {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return helper.roundSuffix(params.data)
                    }
                },
                xAxis: {
                    type: 'category',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                },
                series: [],
            }
        };
        this.chart = null; 
        this.resizeListener = null;
        this.option = this.options[type];
    }

    init(element){
        this.chart = echarts.init(element);
        this.chart.setOption(this.option);
        this.resizeListener = window.addEventListener("resize", function() {
            this.chart.resize();
        }.bind(this));
        
    
    }

    stop(){
        this.chart = null;
        if(this.resizeListener !== null){
            window.removeEventListener("resize", this.resizeListener);
            this.resizeListener = null;
        }
    }

    updateLine(data){
        let labels = [];
        let series = [];
        for(let i = 0; i < data.length; i++){
            let item = data[i];
            labels.push(item[0]);
            series.push(item[1]);
        }
        this.option.xAxis.data = labels;
        this.option.series = [
            {

                type: 'line',
                data: series,
            }
        ];
        this.option.formatter = helper.roundSuffix;
        if(this.chart !== null){
            this.chart.setOption(this.option);
        }
    }

    updateArea(data){
        // Generally x axis needs to be time? 
        let labels   = [];
        let series   = [];
        for(let i = 0; i < data.length; i++){
            let item = data[i];
            labels.push(item[0]);
            series.push(item[1]);
        }
        this.option.xAxis = [
            {
                type: 'category',
                boundaryGap: false,
                data: labels,
            }
        ];
        this.option.yAxis = [{
            type: 'value',
            axisLabel: {
                formatter: helper.roundSuffix
            }
        }];
        
        this.option.series = [
            {
                name: "Land Index",
                type: 'line',
                data: series,
                areaStyle: {}
            }
        ];
        this.option.formatter = helper.roundSuffix;
        if(this.chart !== null){
            this.chart.setOption(this.option);
        }
    }

    update(data){
        if(this.type == "area"){
            this.updateArea(data);
        }
        if(this.type == "line"){
            this.updateLine(data);
        }
    }

}