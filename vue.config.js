module.exports = {
    publicPath: 'https://arnemileswinter.github.io/graph-jiz/',
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.txt$/i,
                    use: 'raw-loader',
                }
            ]
        }
    }
};
