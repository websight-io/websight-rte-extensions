const rollupPluginPostcss = require('rollup-plugin-postcss');
const rollupPluginNodePolyfills = require('rollup-plugin-node-polyfills');

module.exports = {
    webDependencies: [
        'linkifyjs',
        'prosemirror-state',
        'prosemirror-model',
    ],
    rollup: {
        plugins: [rollupPluginPostcss(), rollupPluginNodePolyfills()]
    }
};