const esbuild = require("esbuild");

const isProduction = process.env.NODE_ENV === "production";

const options = {
    entryPoints: ["./tlox/index.ts"],
    outfile: "./build/tlox.js",
    bundle: true,
    minify: isProduction,
    sourcemap: !isProduction,
    external: ["fs/promises", "readline/promises"],
};

esbuild.build(options).catch((err) => {
    console.error(err);
    process.exit(1);
});
