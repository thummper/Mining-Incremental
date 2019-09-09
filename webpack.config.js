const path = require("path");
const HTMLPack = require("html-webpack-plugin");
const VueLoader = require("vue-loader/lib/plugin");


module.exports = {
    module:{
        rules: [
            {
                test: /\.css$/,
                loader: "css-loader"
            },
        {
            test: /\.scss$/,
            use: [
                "style-loader", //Creates style nodes from JS Strings
                "css-loader", // translates css into commonjs
                "sass-loader" // compiles sass to css
            ]
        },
        {
            test: /\.vue$/,
            loader: "vue-loader"
        },
        {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
            name: '[name].[ext]',
            outputPath: '../fonts/',  
            publicPath: '../static/fonts' 
            }
        }]
    }

    ],
    },
    plugins: [
        new HTMLPack({
            hash: true,
            template: './src/html/index.html'
        }),
        new VueLoader() 
    ],
    entry: "./src/js/index.js",
    output: {
        
        path: path.resolve(__dirname, 'dist'),
        filename: "main.js"
    },
    resolve:{
        alias:{
            'vue': 'vue/dist/vue.js'
        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        port: 3000
      },
};