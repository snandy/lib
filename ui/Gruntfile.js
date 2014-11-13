module.exports = function(grunt) {
	"use strict";
	
	var fs = require('fs')
	var _ = require('underscore')

	var banner = function() {
		var date = new Date
		var h = date.getHours()
		var m = date.getMinutes()
		var s = date.getSeconds()
			
		h = h<10 ? '0'+h : h
		m = m<10 ? '0'+m : m
		s = s<10 ? '0'+s : s
		
		var time = h + ':' + m + ':' + s
		var str = '/*!\n'
		str += ' * <%= pkg.name %> v<%= pkg.version %>\n'
		str += ' * <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> ' + time + '\n'
		str += ' */\n'
		
		return str
	}()
	
	var ui = function() {
		var intro = ['src/util.js']
		var dir = fs.readdirSync('src')
		var other = []
		other = _.reject(dir, function(name) {
			return name === 'util.js'
		})
		other = other.map(function(fname) {
			return 'src/' + fname
		})
		return intro.concat(other)
	}()

	// 配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				banner: banner
			},
			ui: {
				src: ui,
				dest: 'popui.js'
			}
		},
		uglify: {
			options: {
				banner: banner
			},
			ui: {
				src: ui,
				dest: 'popui.js'
			}
		}
	})
	
	
	// 载入concat和uglify插件，分别对于合并和压缩
	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	
	// 注册任务
	grunt.registerTask('default', ['concat', 'uglify'])
}; 