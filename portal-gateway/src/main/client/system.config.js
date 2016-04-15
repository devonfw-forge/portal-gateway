System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "npm:*": "node_modules/*",
    "tmp/*": "./.tmp/*",
    "bower:*": "bower_components/*"
  },

  packages: {
    "app": {
      "defaultExtension": "ts"
    }
  },

  meta: {
    'bower:angular-mocks/angular-mocks.js': {
      format: 'global'
    }
  },

  map: {
    "typescript": "npm:typescript/lib/typescript.js",
    "angular": "bower:angular/index.js",
    "angular-mocks": "bower:angular-mocks/angular-mocks.js",
    "angular-ui-router": "bower:angular-ui-router/release/angular-ui-router.js"
  }
});
