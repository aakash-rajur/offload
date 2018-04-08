import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'

export default [{
	input: 'src/index.js',
	output: [
		{
			file: 'dist/index.js',
			intro: "var regeneratorRuntime = require('regenerator-runtime');",
			format: 'cjs'
		},
		{
			file: 'dist/index.es.js',
			intro: "var regeneratorRuntime = require('regenerator-runtime');",
			format: 'es'
		}
	],
	plugins: [
		external(),
		url(),
		babel({
			exclude: 'node_modules/**'
		}),
		resolve(),
		commonjs()
	]
}, {
	input: 'src/initialize.js',
	output: [
		{
			file: 'dist/initialize.js',
			intro: "var regeneratorRuntime = require('regenerator-runtime');",
			format: 'cjs'
		},
		{
			file: 'dist/initialize.es.js',
			intro: "var regeneratorRuntime = require('regenerator-runtime');",
			format: 'es'
		}
	],
	plugins: [
		external(),
		url(),
		babel({
			exclude: 'node_modules/**'
		}),
		resolve(),
		commonjs()
	]
}]
