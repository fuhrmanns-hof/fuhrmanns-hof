// ===============================================
//  Eleventy Konfiguration für Fuhrmanns Hof Seite
// ===============================================
console.log("✅ Eleventy-Konfiguration wurde geladen");

export default function(eleventyConfig) {
  
  // 1. Statische Dateien (werden unverändert kopiert)
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/scriptA.js");
  eleventyConfig.addPassthroughCopy("src/scriptB.js");

  // 2. Browser-Cache beim Testen etwas umgehen
  eleventyConfig.setBrowserSyncConfig({
    files: ['_site/**/*'],
    notify: true,
    open: true,
    cors: true
  });

  // 🪄 2.5. Sichtbares Logging bei jeder Dateiänderung
  eleventyConfig.on("watchChange", (changedFile) => {
    console.log(`[11ty Watch] Datei geändert: ${changedFile}`);

  // Erzwingt das Beobachten von style.css
  eleventyConfig.addWatchTarget("src/style.css");
  });

  // 3. Standard-Einstellungen
  return {
    dir: {
      input: "src",      // Quelldateien
      includes: "_includes", // enthält base.liquid, nav.html, footer.html
      output: "_site"    // Zielverzeichnis (wird automatisch generiert)
    },
    htmlTemplateEngine: "liquid", // einfache Template-Syntax
    markdownTemplateEngine: "liquid",
    templateFormats: ["html", "liquid"]
  };
}