var es = require('event-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var fs = require('fs');
var proxy = require('http-proxy-middleware');
var _ = require('lodash');


var scripts = require('./app.scripts.json');

var source = {
    js: {
        main: 'app/main.js',
        src: [
            // application config
            'app.config.js',

            // application bootstrap file
            'app/main.js',

            // main module
            'app/app.js',

            // module files
            'app/**/module.js',

            // other js files [controllers, services, etc.]
            'app/**/!(module)*.js'
        ],
        tpl: 'app/**/*.tpl.html'
    }
};

var destinations = {
    js: 'build'
};


gulp.task('build', function(){
    return es.merge(gulp.src(source.js.src) , getTemplateStream())
         .pipe(ngAnnotate())
         .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('js', function(){
    return es.merge(gulp.src(source.js.src) , getTemplateStream())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js));
});

gulp.task('watch', function(){
    gulp.watch(source.js.src, ['js']);
    gulp.watch(source.js.tpl, ['js']);
});

gulp.task('connect', function() {
    connect.server({
        port: 8888,
        middleware: function(connect, opt) {
            return [
                proxy('/app/weixin/**', {
                    target: 'https://min.jiushang.cn',
                    changeOrigin:true,
                    pathRewrite: {'^/app/weixin' : ''}
                }),
                proxy('/tjh/**', {
                    target: 'http://tjh.xtype.cn',
                    changeOrigin:true,
                    onProxyReq: onProxyReq,
                    pathRewrite: {'^/tjh' : ''}
                }),
                proxy('/api/upload/signature.json', {
                    target: 'https://api.jiushang.cn/',
                    changeOrigin:true,
                    onProxyReq: onProxyReq
                })
            ]
        }
    });
});
function onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('authorization', 'bearer fee4b731-f022-49a5-a4e9-7c5a76ad3e26');
    console.info("path" + "->" + proxyReq["path"])
}
gulp.task('vendor', function(){
    _.forIn(scripts.chunks, function(chunkScripts, chunkName){
        var paths = [];
        chunkScripts.forEach(function(script){
            var scriptFileName = scripts.paths[script];

            if (!fs.existsSync(__dirname + '/' + scriptFileName)) {

                throw console.error('Required path doesn\'t exist: ' + __dirname + '/' + scriptFileName, script)
            }
            paths.push(scriptFileName);
        });
        gulp.src(paths)
            .pipe(concat(chunkName + '.js'))
            //.on('error', swallowError)
            .pipe(gulp.dest(destinations.js))
    })

});

gulp.task('prod', ['vendor', 'build']);
gulp.task('dev', ['vendor', 'js', 'watch', 'connect']);
gulp.task('default', ['dev']);

var swallowError = function(error){
    console.log(error.toString());
    this.emit('end')
};

var getTemplateStream = function () {
    return gulp.src(source.js.tpl)
        .pipe(templateCache({
            root: 'app/',
            module: 'app'
        }))
};
gulp.task('tpl',function () {
    return es.merge(getTemplateStream())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(destinations.js));
});