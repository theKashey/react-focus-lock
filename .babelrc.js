// modified Babel's default to account for __PURE__ annotations
// https://babeljs.io/docs/options#shouldprintcomment
const shouldPrintComment = (val) => /@license|@preserve|[#@]__PURE__/.test(val);

// export default {
module.exports = {
  env: {
    cjs: {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
        [
          "transform-react-remove-prop-types",
          {
            mode: "wrap",
          },
        ],
      ],
      generatorOpts: {
        shouldPrintComment,
      },
    },
    es2015: {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            loose: true,
          },
        ],
        "@babel/preset-react",
      ],
      plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-class-properties",
        ["@babel/plugin-transform-runtime", { useESModules: true }],
        [
          "transform-react-remove-prop-types",
          {
            mode: "wrap",
          },
        ],
      ],
      generatorOpts: {
        shouldPrintComment,
      },
    },
  },
};
