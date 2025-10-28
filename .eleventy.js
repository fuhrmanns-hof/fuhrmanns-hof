// ===============================================
//  Eleventy Konfiguration für Fuhrmanns Hof Seite
// ===============================================

console.log("✅ Eleventy-Konfiguration wurde geladen");

// Umgebung erkennen: lokal oder GitHub Pages
const isGitHub = process.env.ELEVENTY_ENV === "github";

export default function(eleventyConfig) {
  
  // 1. Statische Dateien (werden unverändert kopiert)
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/gallery.js");
  
  // 2. BrowserSync beim Testen
  eleventyConfig.setBrowserSyncConfig({
    files: ['_site/**/*'],
    notify: true,
    open: true,
    cors: true,
    host: "0.0.0.0" // 💡 erlaubt Zugriff aus dem LAN
  });

  // 3. Logging bei Dateiänderungen
  eleventyConfig.on("watchChange", (changedFile) => {
    console.log(`[11ty Watch] Datei geändert: ${changedFile}`);
  });

  // 4. CSS-Watching
  eleventyConfig.addWatchTarget("src/style.css");

  // 5. Standard-Einstellungen (mit Umgebungslogik)
  return {
    dir: {
      input: "src",
      output: isGitHub ? "docs" : "_site"  // -> automatisch je nach Umgebung
    },
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
    templateFormats: ["html", "liquid"],
    pathPrefix: isGitHub ? "/fuhrmanns-hof/" : "/" // -> korrekt für GitHub Pages oder lokal
  };
}