const Image = require('@11ty/eleventy-img')
const fs = require('fs');
const dir = 'images/galery'

module.exports = function (eleventyConfig) {
    // eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addNunjucksShortcode("galleryImage", (src, alt, sizes) => {
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
    eleventyConfig.addNunjucksGlobal("galleryFiles", function() {
        return fs.readdirSync('images/gallery');;
    });
};