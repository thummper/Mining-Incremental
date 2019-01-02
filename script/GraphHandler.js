class GraphHandler {
    constructor(graphs, inc) {
        //Passed an array of canvasas on creation
        this.inc = inc;
        this.graphs = graphs;
        this.baseOptions = {
            grid: {
                left: 40,
                top: 40,
                right: 0,
                bottom: 70
              },

            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                },
                {
                    type: 'slider',
                    handleSize: 16,
                    start: 0,
                    end: 100,
                }
            ],
            xAxis: {
                type: 'category',
                minInterval: 5,
                scale: true,

            },
            yAxis: {
                type: 'value',
                minInterval: 0,
                scale: true
            },
            series: [{
                data: [ ['00:00', 100]],
                type: 'line'
            }]
        };;
        this.charts = [];


    }
    makeGraphs() {
        //Initialises graphs with default data
        for (let i = 0; i < this.graphs.length; i++) {
            let titles = ['Iron Price', 'Copper Price', 'Gold Price', 'Silver Price'];
            let colours = ['#3a3c40', '#b4745e', '#c0c0c0', '#e7bd42'];
            let options = this.baseOptions;
            options.color = [colours[i]];
            //options.title = { text: titles[i] };
            let graph = this.graphs[i];
            //Initiate echart 
            let chart = echarts.init(graph);
            chart.setOption(this.baseOptions);
            window.addEventListener('resize', function(){
                console.log("Resizing");
                chart.resize();
            });


            this.charts.push(
                [chart, [["0", this.inc.economy.ingotPrices[i]]]]
            );
        }
        this.addListeners();
    }


    addListeners() {
        // window.addEventListener("resize", function () {
        //     for (let i in this.charts) {
        //         this.charts[i].resize();
        //     }
        // }.bind(this));
    }


    updateGraphs(data) {
        //Updates graphs with data 
        for (let i = 0; i < data.length; i++) {

            let info = this.charts[i];
            let chart = info[0];
            let oldData = info[1];
            let newData = data[i];
            oldData.push(newData);
            
            let options = {
				series: [{
					data: oldData,
					type: 'line'
				}]
            };
            chart.setOption(options);

        }
    }
}