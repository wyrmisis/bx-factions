module.exports = {
    "plugins": [
        require('postcss-import'),
        // require('stylelint'),
        require("autoprefixer"),
        require('postcss-nested'),
        require('postcss-inherit'),
        require('cssnano'),
        require('postcss-reporter'),
    ]
}