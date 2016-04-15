/*global config*/
'use strict';

var httpProxy = require('http-proxy');
var chalk = require('chalk');
/**
 * Additional logging for 500
 */
var onError = function (error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  console.error(chalk.red('[Proxy]'), error);
};
/**
 * Update cookie to allow app be served on /.
 */
var onProxyRes = function (proxyRes) {
  if (proxyRes.headers['set-cookie']) {
    proxyRes.headers['set-cookie'][0] = proxyRes.headers['set-cookie'][0].replace(config.proxy.context(), '');
  }
};
/**
 * Support Websockets.
 */
var onUpgrade = function (req, socket, head) {
  proxy.ws(req, socket, head);
};
var proxy = httpProxy.createProxyServer({
  target: config.proxy.url(),
  ws: true
});
var keysProxy = httpProxy.createProxyServer({
  target: config.keysProxy.url(),
  ws: true
});
var infowasProxy = httpProxy.createProxyServer({
  target: config.infowasProxy.url(),
  ws: true
});

proxy.on('error', onError);
proxy.on('proxyRes', onProxyRes);
proxy.on('upgrade', onUpgrade);

keysProxy.on('error', onError);
keysProxy.on('proxyRes', onProxyRes);
keysProxy.on('upgrade', onUpgrade);

infowasProxy.on('error', onError);
infowasProxy.on('proxyRes', onProxyRes);
infowasProxy.on('upgrade', onUpgrade);

/**
 * Create middleware and define routing
 */
function proxyMiddleware(req, res, next) {
  if (/\/keys\/services\//.test(req.url)) {
    keysProxy.web(req, res);
  } else if (/\/keys\/websocket\//.test(req.url)) {
    keysProxy.web(req, res);
  } else if (/\/infowas\/services\//.test(req.url)) {
    infowasProxy.web(req, res);
  } else if (/\/infowas\/websocket\//.test(req.url)) {
    infowasProxy.web(req, res);
  } else if (/\/services\//.test(req.url)) {
    proxy.web(req, res);
  } else if (/\/websocket\//.test(req.url)) {
    proxy.web(req, res);
  } else {
    next();
  }
}
module.exports = [proxyMiddleware];
