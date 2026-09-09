module.exports = function (eleventyConfig) {
  // Existing root-level static assets (images, config files) stay where they are.
  ["jpg", "jpeg", "png", "svg", "gif", "webp"].forEach((ext) => {
    eleventyConfig.addPassthroughCopy(`*.${ext}`);
  });
  eleventyConfig.addPassthroughCopy("output.css");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("llms.txt");
  eleventyConfig.addPassthroughCopy("google520c1c43f185e4b8.html");
  eleventyConfig.addPassthroughCopy("wbop_3fe45cd0cbbe12c2e65519741e561117.html");

  // Out-of-scope pages: pass through untouched, not templated.
  eleventyConfig.addPassthroughCopy("catalog.html");
  eleventyConfig.addPassthroughCopy("catalog-workplace.html");
  eleventyConfig.addPassthroughCopy("lms.html");
  eleventyConfig.addPassthroughCopy("itstuff.js");

  // Decap CMS admin UI + shared client JS.
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
