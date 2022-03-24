const path = require('path');

const production = (process.env.ELEVENTY_MODE || 'development') === 'production';

const Image = require('@11ty/eleventy-img')

const htmlOptions = {
    collapseWhitespace: true,
    decodeEntities: true,
    removeComments: true,
};

const sassOptions = {
    outDir: path.normalize(path.join(__dirname, './_site')),
    outFileName: 'styles',
    outPath: '/stylesheets/',
    outputStyle: production ? 'compressed' : 'expanded',
    sassIndexFile: 'styles.scss',
    sassLocation: path.normalize(path.join(__dirname, './stylesheets/')),
};

module.exports = function (eleventyConfig) {
    eleventyConfig.addGlobalData('timestamp', Date.now());
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addNunjucksShortcode("galleryImage", function (src, alt, sizes) {
        let options = {
            widths: [300, 600],
            formats: ["avif", "jpeg"],
            urlPath: "/galery/",
            outputDir: "./_site/galery/"
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
        const fs = require('fs');
        return fs.readdirSync('gallery');;
    });
    eleventyConfig.addPlugin(require("eleventy-plugin-svg-contents"));
    eleventyConfig.addPlugin(require('eleventy-plugin-dart-sass'), sassOptions);
    if (production) {
        const html = require('html-minifier');
        eleventyConfig.addTransform('html', function (content, path) {
            return path.endsWith('.html')
                ? html.minify(content, htmlOptions)
                : content;
        });
    }
};