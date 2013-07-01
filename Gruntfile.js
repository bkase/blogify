module.exports = function(grunt) {

  grunt.initConfig({
    // CSS
    sass: {
      dist: {
        files: {
          'stubs/css/style.css': 'stubs/scss/main.scss',
        }
      }
    },
    watch: {
      files: 'stubs/scss/**/*',
      tasks: ['sass']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('default', ['sass']);
};
