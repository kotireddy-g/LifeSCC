module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            [
                'babel-preset-expo',
                {
                    // Disable reanimated plugin to avoid dependency issues
                    reanimated: false
                }
            ]
        ],
        plugins: []
    };
};
