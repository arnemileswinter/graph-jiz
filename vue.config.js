module.exports = {
    publicPath: '',
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
