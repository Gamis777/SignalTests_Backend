'use strict';

module.exports = {
    app: {
        title: 'MEAN.JS',
        description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
        keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    // The secret should be set to a non-guessable string that
    // is used to compute a session hash
    sessionSecret: 'MEAN',
    // The name of the MongoDB collection to store sessions in
    sessionCollection: 'sessions',
    // The session cookie settings
    sessionCookie: {
        path: '/',
        httpOnly: true,
        // If secure is set to true then it will cause the cookie to be set
        // only when SSL-enabled (HTTPS) is used, and otherwise it won't
        // set a cookie. 'true' is recommended yet it requires the above
        // mentioned pre-requisite.
        secure: false,
        // Only set the maxAge to null if the cookie shouldn't be expired
        // at all. The cookie will expunge when the browser is closed.
        maxAge: null
        // To set the cookie in a specific domain uncomment the following
        // setting:
        // domain: 'yourdomain.com'
    },
    // The session cookie name
    sessionName: 'connect.sid',
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'combined',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            stream: 'logs/access.log'
        }
    },
    assets: {
        lib: {
            css: [
                'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/animate.css/animate.min.css',
                'public/lib/simple-line-icons/css/simple-line-icons.css',
                'public/lib/font-awesome/css/font-awesome.css'
            ],
            js: [
                'public/lib/jquery/dist/jquery.js',
                'public/lib/angular/angular.js',
                'public/lib/angular-bootstrap/ui-bootstrap.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-resource/angular-resource.js',
                'public/lib/angular-dynamic-locale/tmhDynamicLocale.min.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-cookies/angular-cookies.js',
                'public/lib/angular-sanitize/angular-sanitize.js',
                'public/lib/angular-translate/angular-translate.js',
                'public/lib/angular-translate-loader-url/angular-translate-loader-url.js',
                'public/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
                'public/lib/angular-translate-storage-local/angular-translate-storage-local.js',
                'public/lib/angular-ui-router/release/angular-ui-router.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-file-saver/dist/angular-file-saver.js',
                'public/lib/ng-lodash/build/ng-lodash.min.js',
                'public/lib/ng-csv/build/ng-csv.min.js',
                'public/lib/oclazyload/dist/ocLazyLoad.min.js'
            ]
        },
        css: [
            'public/modules/**/css/*.css'
        ],
        js: [
            'public/config.js',
            'public/application.js',
            'public/modules/*/*.js',
            'public/modules/*/*[!tests]*/*.js'
        ],
        tests: [
            'public/lib/angular-mocks/angular-mocks.js',
            'public/modules/*/tests/unit/*.js'
        ]
    },
    digestPeriod: 60, //in sec
    free_notifications_max: 42
};
