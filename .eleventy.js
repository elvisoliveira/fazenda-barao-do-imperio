const path = require("path");

const production = (process.env.ELEVENTY_MODE || "development") === "production";

const Image = require("@11ty/eleventy-img")

const minifyOptions = {
    collapseWhitespace: true,
    decodeEntities: true,
    removeComments: true,
};

const beautifyOptions = {
    indent_with_tabs: true,
    preserve_newlines: false,
    inline: []
};

const sassOptions = {
    outDir: path.normalize(path.join(__dirname, "./_site")),
    outFileName: "styles",
    outPath: "/stylesheets/",
    outputStyle: production ? "compressed" : "expanded",
    sassIndexFile: "styles.scss",
    sassLocation: path.normalize(path.join(__dirname, "./stylesheets/")),
};

module.exports = function (eleventyConfig) {
    eleventyConfig.addGlobalData("timestamp", Date.now());
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addNunjucksShortcode("galleryImage", function (src, alt, sizes) {
        let options = {
            widths: [1280],
            formats: ["avif", "jpeg"],
            urlPath: "/galery/",
            outputDir: "./_site/galery/",
            sharpJpegOptions: {
                quality: 80
            }
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
        const fs = require("fs");
        return fs.readdirSync("gallery");
    });
    eleventyConfig.addPlugin(require("eleventy-favicon"));
    eleventyConfig.addPlugin(require("eleventy-plugin-svg-contents"));
    eleventyConfig.addPlugin(require("eleventy-plugin-dart-sass"), sassOptions);
    eleventyConfig.addTransform("html", function (content, path) {
        return path.endsWith(".html")
            ? production ? require("html-minifier").minify(content, minifyOptions) : require("js-beautify").html(content, beautifyOptions)
            : content;
    });
};