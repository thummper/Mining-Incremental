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

                    }

                ]
            }
        };
        this.chart = null; 
        this.option = this.options[type];
    }

    init(element){
        this.chart = echarts.init(element);
        this.chart.setOption(this.option);
        
    }
    stop(){
        this.chart = null;
    }




    update(data){
        // Generally x axis needs to be time? 
        let labels = [];
        let series   = [];

        for(let i = 0; i < data.length; i++){
            let item = data[i];
            console.log("Item", item);
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
        }]


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
}