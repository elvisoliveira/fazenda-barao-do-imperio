const Image = require('@11ty/eleventy-img')
const svgContents = require("eleventy-plugin-svg-contents");
const fs = require('fs');
const dir = 'galery'

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addNunjucksShortcode("galleryImage", function (src, alt, sizes) {
        let options = {
            widths: [300, 600],
            formats: ["avif", "jpeg"],
            urlPath: `/${dir}/`,
            outputDir: `./_site/${dir}/`
        };
        Image(src, options);
        return Image.generateHTML(Image.statsSync(src, options), {
            alt,
            sizes,
            loading: "lazy",
            decoding: "async",
        });
    });
    eleventyConfig.addNunjucksGlobal("galleryFiles", function () {
        return fs.readdirSync('gallery');;
    });
    eleventyConfig.addPlugin(svgContents);
};