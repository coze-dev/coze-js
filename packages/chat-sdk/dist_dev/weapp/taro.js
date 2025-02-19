(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["taro"],{

/***/ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/env.js":
/*!******************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/env.js ***!
  \******************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENV_TYPE: function() { return /* binding */ ENV_TYPE; },
/* harmony export */   getEnv: function() { return /* binding */ getEnv; }
/* harmony export */ });
var ENV_TYPE = {
  WEAPP: 'WEAPP',
  SWAN: 'SWAN',
  ALIPAY: 'ALIPAY',
  TT: 'TT',
  QQ: 'QQ',
  JD: 'JD',
  WEB: 'WEB',
  RN: 'RN',
  HARMONY: 'HARMONY',
  QUICKAPP: 'QUICKAPP',
  HARMONYHYBRID: 'HARMONYHYBRID'
};
function getEnv() {
  if (true) {
    return ENV_TYPE.WEAPP;
  } else {}
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/index.js":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/index.js ***!
  \********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Taro; }
/* harmony export */ });
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/options.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/next-tick.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/emitter/emitter.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./env.js */ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/env.js");
/* harmony import */ var _interceptor_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interceptor/index.js */ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/index.js");
/* harmony import */ var _interceptor_interceptors_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interceptor/interceptors.js */ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/interceptors.js");
/* harmony import */ var _tools_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tools.js */ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/tools.js");






/* eslint-disable camelcase */
var Taro = {
  Behavior: _tools_js__WEBPACK_IMPORTED_MODULE_0__.Behavior,
  getEnv: _env_js__WEBPACK_IMPORTED_MODULE_1__.getEnv,
  ENV_TYPE: _env_js__WEBPACK_IMPORTED_MODULE_1__.ENV_TYPE,
  Link: _interceptor_index_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  interceptors: _interceptor_interceptors_js__WEBPACK_IMPORTED_MODULE_3__,
  Current: _tarojs_runtime__WEBPACK_IMPORTED_MODULE_4__.Current,
  getCurrentInstance: _tarojs_runtime__WEBPACK_IMPORTED_MODULE_4__.getCurrentInstance,
  options: _tarojs_runtime__WEBPACK_IMPORTED_MODULE_5__.options,
  nextTick: _tarojs_runtime__WEBPACK_IMPORTED_MODULE_6__.nextTick,
  eventCenter: _tarojs_runtime__WEBPACK_IMPORTED_MODULE_7__.eventCenter,
  Events: _tarojs_runtime__WEBPACK_IMPORTED_MODULE_8__.Events,
  getInitPxTransform: _tools_js__WEBPACK_IMPORTED_MODULE_0__.getInitPxTransform,
  interceptorify: _interceptor_index_js__WEBPACK_IMPORTED_MODULE_2__.interceptorify
};
Taro.initPxTransform = (0,_tools_js__WEBPACK_IMPORTED_MODULE_0__.getInitPxTransform)(Taro);
Taro.preload = (0,_tools_js__WEBPACK_IMPORTED_MODULE_0__.getPreload)(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_4__.Current);
Taro.pxTransform = (0,_tools_js__WEBPACK_IMPORTED_MODULE_0__.getPxTransform)(Taro);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/chain.js":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/chain.js ***!
  \********************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Chain; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");



var Chain = /*#__PURE__*/function () {
  function Chain(requestParams, interceptors, index) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Chain);
    this.index = index || 0;
    this.requestParams = requestParams || {};
    this.interceptors = interceptors || [];
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Chain, [{
    key: "proceed",
    value: function proceed() {
      var requestParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.requestParams = requestParams;
      if (this.index >= this.interceptors.length) {
        throw new Error('chain 参数错误, 请勿直接修改 request.chain');
      }
      var nextInterceptor = this._getNextInterceptor();
      var nextChain = this._getNextChain();
      var p = nextInterceptor(nextChain);
      var res = p.catch(function (err) {
        return Promise.reject(err);
      });
      Object.keys(p).forEach(function (k) {
        return (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(p[k]) && (res[k] = p[k]);
      });
      return res;
    }
  }, {
    key: "_getNextInterceptor",
    value: function _getNextInterceptor() {
      return this.interceptors[this.index];
    }
  }, {
    key: "_getNextChain",
    value: function _getNextChain() {
      return new Chain(this.requestParams, this.interceptors, this.index + 1);
    }
  }]);
}();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/index.js":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/index.js ***!
  \********************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Link; },
/* harmony export */   interceptorify: function() { return /* binding */ interceptorify; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _chain_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chain.js */ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/chain.js");



var Link = /*#__PURE__*/function () {
  function Link(interceptor) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Link);
    this.taroInterceptor = interceptor;
    this.chain = new _chain_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__["default"])(Link, [{
    key: "request",
    value: function request(requestParams) {
      var chain = this.chain;
      var taroInterceptor = this.taroInterceptor;
      chain.interceptors = chain.interceptors.filter(function (interceptor) {
        return interceptor !== taroInterceptor;
      }).concat(taroInterceptor);
      return chain.proceed(Object.assign({}, requestParams));
    }
  }, {
    key: "addInterceptor",
    value: function addInterceptor(interceptor) {
      this.chain.interceptors.push(interceptor);
    }
  }, {
    key: "cleanInterceptors",
    value: function cleanInterceptors() {
      this.chain = new _chain_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
    }
  }]);
}();
function interceptorify(promiseifyApi) {
  return new Link(function (chain) {
    return promiseifyApi(chain.requestParams);
  });
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/interceptors.js":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/interceptor/interceptors.js ***!
  \***************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logInterceptor: function() { return /* binding */ logInterceptor; },
/* harmony export */   timeoutInterceptor: function() { return /* binding */ timeoutInterceptor; }
/* harmony export */ });
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");

function timeoutInterceptor(chain) {
  var requestParams = chain.requestParams;
  var p;
  var res = new Promise(function (resolve, reject) {
    var timeout = setTimeout(function () {
      clearTimeout(timeout);
      reject(new Error('网络链接超时,请稍后再试！'));
    }, requestParams && requestParams.timeout || 60000);
    p = chain.proceed(requestParams);
    p.then(function (res) {
      if (!timeout) return;
      clearTimeout(timeout);
      resolve(res);
    }).catch(function (err) {
      timeout && clearTimeout(timeout);
      reject(err);
    });
  });
  // @ts-ignore
  if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(p) && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(p.abort)) res.abort = p.abort;
  return res;
}
function logInterceptor(chain) {
  var requestParams = chain.requestParams;
  var method = requestParams.method,
    data = requestParams.data,
    url = requestParams.url;
  // eslint-disable-next-line no-console
  console.log("http ".concat(method || 'GET', " --> ").concat(url, " data: "), data);
  var p = chain.proceed(requestParams);
  var res = p.then(function (res) {
    // eslint-disable-next-line no-console
    console.log("http <-- ".concat(url, " result:"), res);
    return res;
  });
  // @ts-ignore
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(p.abort)) res.abort = p.abort;
  return res;
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/tools.js":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/tools.js ***!
  \********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Behavior: function() { return /* binding */ Behavior; },
/* harmony export */   getInitPxTransform: function() { return /* binding */ getInitPxTransform; },
/* harmony export */   getPreload: function() { return /* binding */ getPreload; },
/* harmony export */   getPxTransform: function() { return /* binding */ getPxTransform; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");


function Behavior(options) {
  return options;
}
function getPreload(current) {
  return function (key, val) {
    current.preloadData = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isObject)(key) ? key : (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, key, val);
  };
}
var defaultDesignWidth = 750;
var defaultDesignRatio = {
  640: 2.34 / 2,
  750: 1,
  828: 1.81 / 2
};
var defaultBaseFontSize = 20;
var defaultUnitPrecision = 5;
var defaultTargetUnit = 'rpx';
function getInitPxTransform(taro) {
  return function (config) {
    var _config$designWidth = config.designWidth,
      designWidth = _config$designWidth === void 0 ? defaultDesignWidth : _config$designWidth,
      _config$deviceRatio = config.deviceRatio,
      deviceRatio = _config$deviceRatio === void 0 ? defaultDesignRatio : _config$deviceRatio,
      _config$baseFontSize = config.baseFontSize,
      baseFontSize = _config$baseFontSize === void 0 ? defaultBaseFontSize : _config$baseFontSize,
      _config$targetUnit = config.targetUnit,
      targetUnit = _config$targetUnit === void 0 ? defaultTargetUnit : _config$targetUnit,
      _config$unitPrecision = config.unitPrecision,
      unitPrecision = _config$unitPrecision === void 0 ? defaultUnitPrecision : _config$unitPrecision;
    taro.config = taro.config || {};
    taro.config.designWidth = designWidth;
    taro.config.deviceRatio = deviceRatio;
    taro.config.baseFontSize = baseFontSize;
    taro.config.targetUnit = targetUnit;
    taro.config.unitPrecision = unitPrecision;
  };
}
function getPxTransform(taro) {
  return function (size) {
    var config = taro.config || {};
    var baseFontSize = config.baseFontSize;
    var deviceRatio = config.deviceRatio || defaultDesignRatio;
    var designWidth = function () {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(config.designWidth) ? config.designWidth(input) : config.designWidth || defaultDesignWidth;
    }(size);
    if (!(designWidth in deviceRatio)) {
      throw new Error("deviceRatio \u914D\u7F6E\u4E2D\u4E0D\u5B58\u5728 ".concat(designWidth, " \u7684\u8BBE\u7F6E\uFF01"));
    }
    var targetUnit = config.targetUnit || defaultTargetUnit;
    var unitPrecision = config.unitPrecision || defaultUnitPrecision;
    var formatSize = ~~size;
    var rootValue = 1 / deviceRatio[designWidth];
    switch (targetUnit) {
      case 'rem':
        rootValue *= baseFontSize * 2;
        break;
      case 'px':
        rootValue *= 2;
        break;
    }
    var val = formatSize / rootValue;
    if (unitPrecision >= 0 && unitPrecision <= 100) {
      val = Number(val.toFixed(unitPrecision));
    }
    return val + targetUnit;
  };
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+plugin-framework-react@4.0.8_@pmmmwh+react-refresh-webpack-plugin@0.5.15_react-_82e4b847a0db97ed100ccf380e9ea385/node_modules/@tarojs/plugin-framework-react/dist/runtime.js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+plugin-framework-react@4.0.8_@pmmmwh+react-refresh-webpack-plugin@0.5.15_react-_82e4b847a0db97ed100ccf380e9ea385/node_modules/@tarojs/plugin-framework-react/dist/runtime.js ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createReactApp: function() { return /* binding */ createReactApp; }
/* harmony export */ });
/* unused harmony exports connectReactPage, createH5NativeComponentConfig, createNativeComponentConfig, createNativePageConfig, setReconciler, useAddToFavorites, useDidHide, useDidShow, useError, useLaunch, useLoad, useOptionMenuClick, usePageNotFound, usePageScroll, usePullDownRefresh, usePullIntercept, useReachBottom, useReady, useResize, useRouter, useSaveExitState, useScope, useShareAppMessage, useShareTimeline, useTabItemTap, useTitleClick, useUnhandledRejection, useUnload */
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/document.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/perf.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/router.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/window.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/raf.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/emitter/emitter.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event.js");









var reactMeta = {
  PageContext: _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.EMPTY_OBJ,
  R: _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.EMPTY_OBJ
};
var HOOKS_APP_ID = 'taro-app';
function isClassComponent(R, component) {
  var _a;
  var prototype = component.prototype;
  // For React Redux
  if ((_a = component.displayName) === null || _a === void 0 ? void 0 : _a.includes('Connect')) return false;
  return (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(component.render) || !!(prototype === null || prototype === void 0 ? void 0 : prototype.isReactComponent) || prototype instanceof R.Component // compat for some others react-like library
  ;
}
function ensureIsArray(item) {
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(item)) {
    return item;
  } else {
    return item ? [item] : [];
  }
}
/**
 * set writable, enumerable to true
 */
function setDefaultDescriptor(obj) {
  obj.writable = true;
  obj.enumerable = true;
  return obj;
}
/**
 * 设置入口的路由参数
 * @param options 小程序传入的参数
 */
function setRouterParams(options) {
  _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router = Object.assign({
    params: options === null || options === void 0 ? void 0 : options.query
  }, options);
}
var createTaroHook = function createTaroHook(lifecycle) {
  return function (fn) {
    var React = reactMeta.R,
      PageContext = reactMeta.PageContext;
    var id = React.useContext(PageContext) || HOOKS_APP_ID;
    var instRef = React.useRef();
    // hold fn ref and keep up to date
    var fnRef = React.useRef(fn);
    if (fnRef.current !== fn) fnRef.current = fn;
    React.useLayoutEffect(function () {
      var inst = instRef.current = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getPageInstance)(id);
      var first = false;
      if (!inst) {
        first = true;
        instRef.current = Object.create(null);
        inst = instRef.current;
      }
      // callback is immutable but inner function is up to date
      var callback = function callback() {
        return fnRef.current.apply(fnRef, arguments);
      };
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isFunction)(inst[lifecycle])) {
        inst[lifecycle] = [inst[lifecycle], callback];
      } else {
        inst[lifecycle] = [].concat((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(inst[lifecycle] || []), [callback]);
      }
      if (first) {
        (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.injectPageInstance)(inst, id);
      }
      return function () {
        var inst = instRef.current;
        if (!inst) return;
        var list = inst[lifecycle];
        if (list === callback) {
          inst[lifecycle] = undefined;
        } else if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isArray)(list)) {
          inst[lifecycle] = list.filter(function (item) {
            return item !== callback;
          });
        }
        instRef.current = undefined;
      };
    }, []);
  };
};
/** LifeCycle */
var useDidHide = createTaroHook('componentDidHide');
var useDidShow = createTaroHook('componentDidShow');
/** App */
var useError = createTaroHook('onError');
var useUnhandledRejection = createTaroHook('onUnhandledRejection');
var useLaunch = createTaroHook('onLaunch');
var usePageNotFound = createTaroHook('onPageNotFound');
/** Page */
var useLoad = createTaroHook('onLoad');
var usePageScroll = createTaroHook('onPageScroll');
var usePullDownRefresh = createTaroHook('onPullDownRefresh');
var usePullIntercept = createTaroHook('onPullIntercept');
var useReachBottom = createTaroHook('onReachBottom');
var useResize = createTaroHook('onResize');
var useUnload = createTaroHook('onUnload');
/** Mini-Program */
var useAddToFavorites = createTaroHook('onAddToFavorites');
var useOptionMenuClick = createTaroHook('onOptionMenuClick');
var useSaveExitState = createTaroHook('onSaveExitState');
var useShareAppMessage = createTaroHook('onShareAppMessage');
var useShareTimeline = createTaroHook('onShareTimeline');
var useTitleClick = createTaroHook('onTitleClick');
/** Router */
var useReady = createTaroHook('onReady');
var useRouter = function useRouter() {
  var dynamic = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var React = reactMeta.R;
  return dynamic ? _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router : React.useMemo(function () {
    return _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router;
  }, []);
};
var useTabItemTap = createTaroHook('onTabItemTap');
var useScope = function useScope() {
  return undefined;
};
var taroHooks = /*#__PURE__*/Object.freeze({
  __proto__: null,
  useAddToFavorites: useAddToFavorites,
  useDidHide: useDidHide,
  useDidShow: useDidShow,
  useError: useError,
  useLaunch: useLaunch,
  useLoad: useLoad,
  useOptionMenuClick: useOptionMenuClick,
  usePageNotFound: usePageNotFound,
  usePageScroll: usePageScroll,
  usePullDownRefresh: usePullDownRefresh,
  usePullIntercept: usePullIntercept,
  useReachBottom: useReachBottom,
  useReady: useReady,
  useResize: useResize,
  useRouter: useRouter,
  useSaveExitState: useSaveExitState,
  useScope: useScope,
  useShareAppMessage: useShareAppMessage,
  useShareTimeline: useShareTimeline,
  useTabItemTap: useTabItemTap,
  useTitleClick: useTitleClick,
  useUnhandledRejection: useUnhandledRejection,
  useUnload: useUnload
});
var h$1;
var ReactDOM$1;
var Fragment;
var pageKeyId = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_5__.incrementId)();
function setReconciler(ReactDOM) {
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.tap('getLifecycle', function (instance, lifecycle) {
    lifecycle = lifecycle.replace(/^on(Show|Hide)$/, 'componentDid$1');
    return instance[lifecycle];
  });
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.tap('modifyMpEvent', function (event) {
    // Note: ohos 上事件没有设置 type 类型 setter 方法导致报错
    Object.defineProperty(event, 'type', {
      value: event.type.replace(/-/g, '')
    });
  });
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.tap('batchedEventUpdates', function (cb) {
    ReactDOM === null || ReactDOM === void 0 ? void 0 : ReactDOM.unstable_batchedUpdates(cb);
  });
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.tap('mergePageInstance', function (prev, next) {
    if (!prev || !next) return;
    // 子组件使用 lifecycle hooks 注册了生命周期后，会存在 prev，里面是注册的生命周期回调。
    // prev 使用 Object.create(null) 创建，H5 的 fast-refresh 可能也会导致存在 prev，要排除这些意外产生的 prev
    if ('constructor' in prev) return;
    Object.keys(prev).forEach(function (item) {
      var prevList = prev[item];
      var nextList = ensureIsArray(next[item]);
      next[item] = nextList.concat(prevList);
    });
  });
  if (false) {}
}
function connectReactPage(R, id) {
  return function (Page) {
    // eslint-disable-next-line dot-notation
    var isReactComponent = isClassComponent(R, Page);
    var inject = function inject(node) {
      return node && (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.injectPageInstance)(node, id);
    };
    var refs = isReactComponent ? {
      ref: inject
    } : {
      forwardedRef: inject,
      // 兼容 react-redux 7.20.1+
      reactReduxForwardedRef: inject
    };
    if (reactMeta.PageContext === _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.EMPTY_OBJ) {
      reactMeta.PageContext = R.createContext('');
    }
    return /*#__PURE__*/function (_R$Component) {
      function PageWrapper() {
        var _this;
        (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this, PageWrapper);
        _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_8__["default"])(this, PageWrapper, arguments);
        _this.state = {
          hasError: false
        };
        return _this;
      }
      (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_9__["default"])(PageWrapper, _R$Component);
      return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_10__["default"])(PageWrapper, [{
        key: "componentDidCatch",
        value:
        // React 16 uncaught error 会导致整个应用 crash，
        // 目前把错误缩小到页面
        function componentDidCatch(error, info) {
          if (true) {
            console.warn(error);
            console.error(info.componentStack);
          }
        }
      }, {
        key: "render",
        value: function render() {
          var children = this.state.hasError ? [] : h$1(reactMeta.PageContext.Provider, {
            value: id
          }, h$1(Page, Object.assign(Object.assign({}, this.props), refs)));
          if (false) {} else {
            return h$1('root', {
              id: id
            }, children);
          }
        }
      }], [{
        key: "getDerivedStateFromError",
        value: function getDerivedStateFromError(error) {
          var _a, _b;
          (_b = (_a = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app) === null || _a === void 0 ? void 0 : _a.onError) === null || _b === void 0 ? void 0 : _b.call(_a, error.message + error.stack);
          return {
            hasError: true
          };
        }
      }]);
    }(R.Component);
  };
}
/**
 * 桥接小程序 App 构造器和 React 渲染流程
 * @param App 用户编写的入口组件
 * @param react 框架
 * @param dom 框架渲染器
 * @param config 入口组件配置 app.config.js 的内容
 * @returns 传递给 App 构造器的对象 obj ：App(obj)
 */
function createReactApp(App, react, dom, config) {
  if (true) {
    (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.ensure)(!!dom, '构建 React/Preact 项目请把 process.env.FRAMEWORK 设置为 \'react\'/\'preact\' ');
  }
  reactMeta.R = react;
  h$1 = react.createElement;
  ReactDOM$1 = dom;
  Fragment = react.Fragment;
  var appInstanceRef = react.createRef();
  var isReactComponent = isClassComponent(react, App);
  var appWrapper;
  var appWrapperResolver;
  var appWrapperPromise = new Promise(function (resolve) {
    return appWrapperResolver = resolve;
  });
  setReconciler(ReactDOM$1);
  function getAppInstance() {
    return appInstanceRef.current;
  }
  function waitAppWrapper(cb) {
    /**
     * 当同个事件触发多次时，waitAppWrapper 会出现同步和异步任务的执行顺序问题，
     * 导致某些场景下 onShow 会优于 onLaunch 执行
     */
    appWrapperPromise.then(function () {
      return cb();
    });
    // appWrapper ? cb() : appWrapperPromise.then(() => cb())
  }
  function renderReactRoot() {
    var _a, _b;
    var appId = (config === null || config === void 0 ? void 0 : config.appId) || 'app';
    var container = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.getElementById(appId);
    if (container == null) {
      var appContainer = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.getElementById(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.CONTAINER);
      container = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.createElement(appId);
      container.id = appId;
      appContainer === null || appContainer === void 0 ? void 0 : appContainer.appendChild(container);
    }
    if ((react.version || '').startsWith('18')) {
      var root = ReactDOM$1.createRoot(container);
      (_a = root.render) === null || _a === void 0 ? void 0 : _a.call(root, h$1(AppWrapper));
    } else {
      // eslint-disable-next-line react/no-deprecated
      (_b = ReactDOM$1.render) === null || _b === void 0 ? void 0 : _b.call(ReactDOM$1, h$1(AppWrapper), container);
    }
  }
  var AppWrapper = /*#__PURE__*/function (_react$Component) {
    function AppWrapper(props) {
      var _this2;
      (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this, AppWrapper);
      _this2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_8__["default"])(this, AppWrapper, [props]);
      // run createElement() inside the render function to make sure that owner is right
      _this2.pages = [];
      _this2.elements = [];
      appWrapper = _this2;
      appWrapperResolver(_this2);
      return _this2;
    }
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_9__["default"])(AppWrapper, _react$Component);
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_10__["default"])(AppWrapper, [{
      key: "mount",
      value: function mount(pageComponent, id, cb) {
        var pageWrapper = connectReactPage(react, id)(pageComponent);
        var key = id + pageKeyId();
        var page = function page() {
          return h$1(pageWrapper, {
            key: key,
            tid: id
          });
        };
        this.pages.push(page);
        this.forceUpdate(function () {
          _tarojs_runtime__WEBPACK_IMPORTED_MODULE_13__.perf.stop(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.PAGE_INIT);
          return cb.apply(void 0, arguments);
        });
      }
    }, {
      key: "unmount",
      value: function unmount(id, cb) {
        var elements = this.elements;
        var idx = elements.findIndex(function (item) {
          return item.props.tid === id;
        });
        elements.splice(idx, 1);
        this.forceUpdate(cb);
      }
    }, {
      key: "render",
      value: function render() {
        var pages = this.pages,
          elements = this.elements;
        while (pages.length > 0) {
          var page = pages.pop();
          elements.push(page());
        }
        var props = null;
        if (isReactComponent) {
          props = {
            ref: appInstanceRef
          };
        }
        return h$1(App, props,  false ? 0 : elements.slice());
      }
    }]);
  }(react.Component);
  if (true) {
    renderReactRoot();
  }
  var _hooks$call$app = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('getMiniLifecycleImpl').app, 3),
    ONLAUNCH = _hooks$call$app[0],
    ONSHOW = _hooks$call$app[1],
    ONHIDE = _hooks$call$app[2];
  var appObj = Object.create({
    render: function render(cb) {
      appWrapper.forceUpdate(cb);
    },
    mount: function mount(component, id, cb) {
      if (appWrapper) {
        appWrapper.mount(component, id, cb);
      } else {
        appWrapperPromise.then(function (appWrapper) {
          return appWrapper.mount(component, id, cb);
        });
      }
    },
    unmount: function unmount(id, cb) {
      if (appWrapper) {
        appWrapper.unmount(id, cb);
      } else {
        appWrapperPromise.then(function (appWrapper) {
          return appWrapper.unmount(id, cb);
        });
      }
    }
  }, (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])({
    config: setDefaultDescriptor({
      configurable: true,
      value: config
    })
  }, ONLAUNCH, setDefaultDescriptor({
    value: function value(options) {
      var _this3 = this;
      setRouterParams(options);
      if (false) {}
      var onLaunch = function onLaunch() {
        var _a;
        // 用户编写的入口组件实例
        var app = getAppInstance();
        _this3.$app = app;
        if (app) {
          // 把 App Class 上挂载的额外属性同步到全局 app 对象中
          if (app.taroGlobalData) {
            var globalData = app.taroGlobalData;
            var keys = Object.keys(globalData);
            var descriptors = Object.getOwnPropertyDescriptors(globalData);
            keys.forEach(function (key) {
              Object.defineProperty(_this3, key, {
                configurable: true,
                enumerable: true,
                get: function get() {
                  return globalData[key];
                },
                set: function set(value) {
                  globalData[key] = value;
                }
              });
            });
            Object.defineProperties(_this3, descriptors);
          }
          (_a = app.onLaunch) === null || _a === void 0 ? void 0 : _a.call(app, options);
        }
        triggerAppHook('onLaunch', options);
      };
      waitAppWrapper(onLaunch);
    }
  })), ONSHOW, setDefaultDescriptor({
    value: function value(options) {
      setRouterParams(options);
      var onShow = function onShow() {
        var _a;
        /**
        * trigger lifecycle
        */
        var app = getAppInstance();
        // class component, componentDidShow
        (_a = app === null || app === void 0 ? void 0 : app.componentDidShow) === null || _a === void 0 ? void 0 : _a.call(app, options);
        // functional component, useDidShow
        triggerAppHook('onShow', options);
      };
      waitAppWrapper(onShow);
    }
  })), ONHIDE, setDefaultDescriptor({
    value: function value() {
      var onHide = function onHide() {
        var _a;
        /**
         * trigger lifecycle
         */
        var app = getAppInstance();
        // class component, componentDidHide
        (_a = app === null || app === void 0 ? void 0 : app.componentDidHide) === null || _a === void 0 ? void 0 : _a.call(app);
        // functional component, useDidHide
        triggerAppHook('onHide');
      };
      waitAppWrapper(onHide);
    }
  })), "onError", setDefaultDescriptor({
    value: function value(error) {
      var onError = function onError() {
        var _a;
        var app = getAppInstance();
        (_a = app === null || app === void 0 ? void 0 : app.onError) === null || _a === void 0 ? void 0 : _a.call(app, error);
        triggerAppHook('onError', error);
        if ( true && (error === null || error === void 0 ? void 0 : error.includes('Minified React error'))) {
          console.warn('React 出现报错，请打开编译配置 mini.debugReact 查看报错详情：https://docs.taro.zone/docs/config-detail#minidebugreact');
        }
      };
      waitAppWrapper(onError);
    }
  })), "onUnhandledRejection", setDefaultDescriptor({
    value: function value(res) {
      var onUnhandledRejection = function onUnhandledRejection() {
        var _a;
        var app = getAppInstance();
        (_a = app === null || app === void 0 ? void 0 : app.onUnhandledRejection) === null || _a === void 0 ? void 0 : _a.call(app, res);
        triggerAppHook('onUnhandledRejection', res);
      };
      waitAppWrapper(onUnhandledRejection);
    }
  })), "onPageNotFound", setDefaultDescriptor({
    value: function value(res) {
      var onPageNotFound = function onPageNotFound() {
        var _a;
        var app = getAppInstance();
        (_a = app === null || app === void 0 ? void 0 : app.onPageNotFound) === null || _a === void 0 ? void 0 : _a.call(app, res);
        triggerAppHook('onPageNotFound', res);
      };
      waitAppWrapper(onPageNotFound);
    }
  })));
  function triggerAppHook(lifecycle) {
    for (var _len = arguments.length, option = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      option[_key - 1] = arguments[_key];
    }
    var instance = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getPageInstance)(HOOKS_APP_ID);
    if (instance) {
      var app = getAppInstance();
      var func = _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('getLifecycle', instance, lifecycle);
      if (Array.isArray(func)) {
        func.forEach(function (cb) {
          return cb.apply(app, option);
        });
      }
    }
  }
  _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app = appObj;
  return appObj;
}
var getNativeCompId = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_5__.incrementId)();
var h;
var ReactDOM;
var nativeComponentApp;
function initNativeComponentEntry(params) {
  var _a;
  var R = params.R,
    ReactDOM = params.ReactDOM,
    cb = params.cb,
    _params$isDefaultEntr = params.isDefaultEntryDom,
    isDefaultEntryDom = _params$isDefaultEntr === void 0 ? true : _params$isDefaultEntr;
  var NativeComponentWrapper = /*#__PURE__*/function (_R$Component2) {
    function NativeComponentWrapper() {
      var _this4;
      (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this, NativeComponentWrapper);
      _this4 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_8__["default"])(this, NativeComponentWrapper, arguments);
      _this4.root = R.createRef();
      _this4.ctx = _this4.props.getCtx();
      return _this4;
    }
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_9__["default"])(NativeComponentWrapper, _R$Component2);
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_10__["default"])(NativeComponentWrapper, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.ctx.component = this;
        var rootElement = this.root.current;
        rootElement.ctx = this.ctx;
        rootElement.performUpdate(true);
      }
    }, {
      key: "render",
      value: function render() {
        return h('root', {
          ref: this.root,
          id: this.props.compId
        }, this.props.renderComponent(this.ctx));
      }
    }]);
  }(R.Component);
  var Entry = /*#__PURE__*/function (_R$Component3) {
    function Entry() {
      var _this5;
      (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this, Entry);
      _this5 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_8__["default"])(this, Entry, arguments);
      _this5.state = {
        components: []
      };
      return _this5;
    }
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_9__["default"])(Entry, _R$Component3);
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_10__["default"])(Entry, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (isDefaultEntryDom) {
          _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app = this;
        } else {
          nativeComponentApp = this;
        }
        cb && cb();
      }
    }, {
      key: "mount",
      value: function mount(Component, compId, getCtx, cb) {
        var isReactComponent = isClassComponent(R, Component);
        var inject = function inject(node) {
          return node && (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.injectPageInstance)(node, compId);
        };
        var refs = isReactComponent ? {
          ref: inject
        } : {
          forwardedRef: inject,
          reactReduxForwardedRef: inject
        };
        if (reactMeta.PageContext === _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.EMPTY_OBJ) {
          reactMeta.PageContext = R.createContext('');
        }
        var item = {
          compId: compId,
          element: h(NativeComponentWrapper, {
            key: compId,
            compId: compId,
            getCtx: getCtx,
            renderComponent: function renderComponent(ctx) {
              return h(reactMeta.PageContext.Provider, {
                value: compId
              }, h(Component, Object.assign(Object.assign(Object.assign({}, (ctx.data || (ctx.data = {})).props), refs), {
                $scope: ctx
              })));
            }
          })
        };
        this.setState({
          components: [].concat((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.state.components), [item])
        }, function () {
          return cb && cb();
        });
      }
    }, {
      key: "unmount",
      value: function unmount(compId, cb) {
        var components = this.state.components;
        var index = components.findIndex(function (item) {
          return item.compId === compId;
        });
        var next = [].concat((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(components.slice(0, index)), (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(components.slice(index + 1)));
        this.setState({
          components: next
        }, function () {
          (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.removePageInstance)(compId);
          cb && cb();
        });
      }
    }, {
      key: "render",
      value: function render() {
        var components = this.state.components;
        return components.map(function (_ref) {
          var element = _ref.element;
          return element;
        });
      }
    }]);
  }(R.Component);
  setReconciler(ReactDOM);
  var app = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.getElementById('app');
  if (!isDefaultEntryDom && !nativeComponentApp) {
    // create
    var nativeApp = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.createElement('nativeComponent');
    // insert
    (_a = app === null || app === void 0 ? void 0 : app.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(nativeApp);
    app = nativeApp;
  }
  // eslint-disable-next-line react/no-deprecated
  ReactDOM.render(h(Entry, {}), app);
}
function createNativePageConfig(Component, pageName, data, react, reactDOM, pageConfig) {
  reactMeta.R = react;
  h = react.createElement;
  ReactDOM = reactDOM;
  setReconciler(ReactDOM);
  var _hooks$call$page = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('getMiniLifecycleImpl').page, 7),
    ONLOAD = _hooks$call$page[0],
    ONUNLOAD = _hooks$call$page[1],
    ONREADY = _hooks$call$page[2],
    ONSHOW = _hooks$call$page[3],
    ONHIDE = _hooks$call$page[4],
    LIFECYCLES = _hooks$call$page[5],
    SIDE_EFFECT_LIFECYCLES = _hooks$call$page[6];
  var unmounting = false;
  var prepareMountList = [];
  var pageElement = null;
  var loadResolver;
  var hasLoaded;
  var id = pageName !== null && pageName !== void 0 ? pageName : "taro_page_".concat(getNativeCompId());
  function setCurrentRouter(page) {
    var router = page.route || page.__route__ || page.$taroPath;
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router = {
      params: page.$taroParams,
      path: (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_16__.addLeadingSlash)(router),
      $taroPath: page.$taroPath,
      onReady: (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getOnReadyEventKey)(id),
      onShow: (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getOnShowEventKey)(id),
      onHide: (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getOnHideEventKey)(id)
    };
    if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(page.exitState)) {
      _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router.exitState = page.exitState;
    }
  }
  var pageObj = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_15__["default"])({
    options: pageConfig
  }, ONLOAD, function () {
    var _this6 = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cb = arguments.length > 1 ? arguments[1] : undefined;
    hasLoaded = new Promise(function (resolve) {
      loadResolver = resolve;
    });
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page = this;
    this.config = pageConfig || {};
    // this.$taroPath 是页面唯一标识
    var uniqueOptions = Object.assign({}, options, {
      $taroTimestamp: Date.now()
    });
    var $taroPath = this.$taroPath = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getPath)(id, uniqueOptions);
    // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
    if (this.$taroParams == null) {
      this.$taroParams = uniqueOptions;
    }
    setCurrentRouter(this);
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_17__.taroWindowProvider.trigger(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.CONTEXT_ACTIONS.INIT, $taroPath);
    var mountCallback = function mountCallback() {
      pageElement = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.getElementById($taroPath);
      (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.ensure)(pageElement !== null, '没有找到页面实例。');
      (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)($taroPath, ONLOAD, _this6.$taroParams);
      loadResolver();
      pageElement.ctx = _this6;
      pageElement.performUpdate(true, cb);
    };
    var mount = function mount() {
      if (!_tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app) {
        initNativeComponentEntry({
          R: react,
          ReactDOM: ReactDOM,
          cb: function cb() {
            _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app.mount(Component, $taroPath, function () {
              return _this6;
            }, mountCallback);
          }
        });
      } else {
        _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app.mount(Component, $taroPath, function () {
          return _this6;
        }, mountCallback);
      }
    };
    if (unmounting) {
      prepareMountList.push(mount);
    } else {
      mount();
    }
  }), ONUNLOAD, function () {
    var $taroPath = this.$taroPath;
    // 销毁当前页面的上下文信息
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_17__.taroWindowProvider.trigger(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.CONTEXT_ACTIONS.DESTORY, $taroPath);
    // 触发onUnload生命周期
    (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)($taroPath, ONUNLOAD);
    resetCurrent();
    unmounting = true;
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app.unmount($taroPath, function () {
      unmounting = false;
      (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.removePageInstance)($taroPath);
      if (pageElement) {
        pageElement.ctx = null;
        pageElement = null;
      }
      if (prepareMountList.length) {
        prepareMountList.forEach(function (fn) {
          return fn();
        });
        prepareMountList = [];
      }
    });
  }), ONREADY, function () {
    var _this7 = this;
    hasLoaded.then(function () {
      // 触发生命周期
      (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(_this7.$taroPath, _tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.ON_READY);
      // 通过事件触发子组件的生命周期
      (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_18__.raf)(function () {
        return _tarojs_runtime__WEBPACK_IMPORTED_MODULE_19__.eventCenter.trigger((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getOnReadyEventKey)(id));
      });
      _this7.onReady.called = true;
    });
  }), ONSHOW, function () {
    var _this8 = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    hasLoaded.then(function () {
      // 设置 Current 的 page 和 router
      _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page = _this8;
      setCurrentRouter(_this8);
      // 恢复上下文信息
      _tarojs_runtime__WEBPACK_IMPORTED_MODULE_17__.taroWindowProvider.trigger(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.CONTEXT_ACTIONS.RECOVER, _this8.$taroPath);
      // 触发生命周期
      (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(_this8.$taroPath, _tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.ON_SHOW, options);
      // 通过事件触发子组件的生命周期
      (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_18__.raf)(function () {
        return _tarojs_runtime__WEBPACK_IMPORTED_MODULE_19__.eventCenter.trigger((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getOnShowEventKey)(id));
      });
    });
  }), ONHIDE, function () {
    // 缓存当前页面上下文信息
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_17__.taroWindowProvider.trigger(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.CONTEXT_ACTIONS.RESTORE, this.$taroPath);
    // 设置 Current 的 page 和 router
    if (_tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page === this) {
      _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page = null;
      _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router = null;
    }
    // 触发生命周期
    (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.$taroPath, _tarojs_runtime__WEBPACK_IMPORTED_MODULE_12__.ON_HIDE);
    // 通过事件触发子组件的生命周期
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_19__.eventCenter.trigger((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getOnHideEventKey)(id));
  });
  function resetCurrent() {
    // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page = null;
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router = null;
  }
  LIFECYCLES.forEach(function (lifecycle) {
    pageObj[lifecycle] = function () {
      return _tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute.apply(void 0, [this.$taroPath, lifecycle].concat(Array.prototype.slice.call(arguments)));
    };
  });
  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  SIDE_EFFECT_LIFECYCLES.forEach(function (lifecycle) {
    var _a;
    if (Component[lifecycle] || ((_a = Component.prototype) === null || _a === void 0 ? void 0 : _a[lifecycle]) || Component[lifecycle.replace(/^on/, 'enable')]) {
      pageObj[lifecycle] = function () {
        var _a;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        var target = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.target;
        if (target === null || target === void 0 ? void 0 : target.id) {
          var _id = target.id;
          var element = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.getElementById(_id);
          if (element) {
            target.dataset = element.dataset;
          }
        }
        return _tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute.apply(void 0, [this.$taroPath, lifecycle].concat(args));
      };
    }
  });
  pageObj.eh = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_20__.eventHandler;
  if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(data)) {
    pageObj.data = data;
  }
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('modifyPageObject', pageObj);
  return pageObj;
}
function createH5NativeComponentConfig(Component, react, reactdom) {
  reactMeta.R = react;
  h = react.createElement;
  ReactDOM = reactdom;
  setReconciler(ReactDOM);
  return Component;
}
function createNativeComponentConfig(Component, react, reactdom, componentConfig) {
  var _a, _b;
  reactMeta.R = react;
  h = react.createElement;
  ReactDOM = reactdom;
  setReconciler(ReactDOM);
  var isNewBlended = componentConfig.isNewBlended;
  var componentObj = {
    options: componentConfig,
    properties: {
      props: {
        type: null,
        value: null,
        observer: function observer(_newVal, oldVal) {
          var _a, _b, _c, _d;
          if (false) { var inst; }
          oldVal && ((_d = this.component) === null || _d === void 0 ? void 0 : _d.forceUpdate());
        }
      }
    },
    created: function created() {
      var _a, _b;
      if (false) { var inst; }
      var app = isNewBlended ? nativeComponentApp : _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app;
      if (!app) {
        initNativeComponentEntry({
          R: react,
          ReactDOM: ReactDOM,
          isDefaultEntryDom: !isNewBlended
        });
      }
    },
    attached: function attached() {
      var _this9 = this;
      var compId = this.compId = getNativeCompId();
      setCurrent(compId);
      this.config = componentConfig;
      var app = isNewBlended ? nativeComponentApp : _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app;
      app.mount(Component, compId, function () {
        return _this9;
      }, function () {
        var instance = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.getPageInstance)(compId);
        if (instance && instance.node) {
          var el = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.getElementById(instance.node.uid);
          if (el) {
            el.ctx = _this9;
          }
        }
      });
    },
    ready: function ready() {
      (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.compId, 'onReady');
    },
    detached: function detached() {
      resetCurrent();
      var app = isNewBlended ? nativeComponentApp : _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.app;
      app.unmount(this.compId);
    },
    pageLifetimes: {
      show: function show(options) {
        (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.compId, 'onShow', options);
      },
      hide: function hide() {
        (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.compId, 'onHide');
      }
    },
    methods: {
      eh: _tarojs_runtime__WEBPACK_IMPORTED_MODULE_20__.eventHandler,
      onLoad: function onLoad(options) {
        (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.compId, 'onLoad', options);
      },
      onUnload: function onUnload() {
        (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.compId, 'onUnload');
      }
    }
  };
  function resetCurrent() {
    // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page = null;
    _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router = null;
  }
  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  if (Component.onShareAppMessage || ((_a = Component.prototype) === null || _a === void 0 ? void 0 : _a.onShareAppMessage) || Component.enableShareAppMessage) {
    componentObj.methods.onShareAppMessage = function (options) {
      var target = options === null || options === void 0 ? void 0 : options.target;
      if (target) {
        var id = target.id;
        var element = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroDocumentProvider.getElementById(id);
        if (element) {
          target.dataset = element.dataset;
        }
      }
      return (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.compId, 'onShareAppMessage', options);
    };
  }
  if (Component.onShareTimeline || ((_b = Component.prototype) === null || _b === void 0 ? void 0 : _b.onShareTimeline) || Component.enableShareTimeline) {
    componentObj.methods.onShareTimeline = function () {
      return (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.safeExecute)(this.compId, 'onShareTimeline');
    };
  }
  if (false) {}
  return componentObj;
}
function setCurrent(compId) {
  if (!getCurrentPages || typeof getCurrentPages !== 'function') return;
  var pages = getCurrentPages();
  var currentPage = pages[pages.length - 1];
  if (_tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page === currentPage) return;
  _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.page = currentPage;
  var route = currentPage.route || currentPage.__route__;
  var router = {
    params: currentPage.options || {},
    path: (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_16__.addLeadingSlash)(route),
    $taroPath: compId,
    onReady: '',
    onHide: '',
    onShow: ''
  };
  _tarojs_runtime__WEBPACK_IMPORTED_MODULE_2__.Current.router = router;
  if (!currentPage.options) {
    // 例如在微信小程序中，页面 options 的设置时机比组件 attached 慢
    Object.defineProperty(currentPage, 'options', {
      enumerable: true,
      configurable: true,
      get: function get() {
        return this._optionsValue;
      },
      set: function set(value) {
        router.params = value;
        this._optionsValue = value;
      }
    });
  }
}
_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.tap('initNativeApi', function (taro) {
  for (var hook in taroHooks) {
    taro[hook] = taroHooks[hook];
  }
});
if (false) { var oldDiffedHook, oldVNodeHook, options; }


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+plugin-http@4.0.9_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8_@tarojs+taro@4.0.8_1f8631d5a6375706d9574d4852f9d3f0/node_modules/@tarojs/plugin-http/dist/runtime.js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+plugin-http@4.0.9_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8_@tarojs+taro@4.0.8_1f8631d5a6375706d9574d4852f9d3f0/node_modules/@tarojs/plugin-http/dist/runtime.js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XMLHttpRequest: function() { return /* binding */ XMLHttpRequest; }
/* harmony export */ });
/* unused harmony export Cookie */
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createForOfIteratorHelper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URL.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/window.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "./node_modules/.pnpm/@tarojs+taro@4.0.8_@tarojs+components@4.0.8_@tarojs+helper@4.0.8_@swc+helpers@0.5.15__@_28b4aa939e10f4882a0917541e7336fe/node_modules/@tarojs/taro/index.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");











/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
var _Cookie_map;
var STORAGE_KEY = 'PAGE_COOKIE';
var Cookie = /*#__PURE__*/function () {
  function Cookie() {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Cookie);
    _Cookie_map.set(this, void 0);
    __classPrivateFieldSet(this, _Cookie_map, {}, "f"); // 三维数组，domain - path - key
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__["default"])(Cookie, [{
    key: "$_checkDomain",
    value:
    /**
     * 判断 domain
     */
    function $_checkDomain(host, cookieDomain) {
      if (host === cookieDomain) return true;
      var index = host.indexOf(".".concat(cookieDomain));
      return index > 0 && cookieDomain.length + index + 1 === host.length;
    }
    /**
     * 判断 path
     */
  }, {
    key: "$_checkPath",
    value: function $_checkPath(path, cookiePath) {
      if (path === cookiePath) return true;
      cookiePath = cookiePath === '/' ? '' : cookiePath;
      return path.indexOf("".concat(cookiePath, "/")) === 0;
    }
    /**
     * 判断过期
     */
  }, {
    key: "$_checkExpires",
    value: function $_checkExpires(cookie) {
      var now = Date.now();
      // maxAge 优先
      if (cookie.maxAge !== null) return cookie.createTime + cookie.maxAge > now;
      // 判断 expires
      if (cookie.expires !== null) return cookie.expires > now;
      return true;
    }
    /**
     * 设置 cookie
     */
  }, {
    key: "setCookie",
    value: function setCookie(cookie, url) {
      cookie = Cookie.parse(cookie);
      if (!cookie) return;
      var _parseUrl = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.parseUrl)(url),
        hostname = _parseUrl.hostname,
        port = _parseUrl.port,
        pathname = _parseUrl.pathname;
      var host = (hostname || '') + (port ? ':' + port : '') || '';
      var path = (pathname || '')[0] === '/' ? pathname : '/';
      if (cookie.domain) {
        // 判断 domain
        if (!this.$_checkDomain(host, cookie.domain)) return;
      } else {
        // 使用 host 作为默认的 domain
        cookie.domain = host;
      }
      // 需要设置 path 字段的情况，取 url 中除去最后一节的 path
      if (!cookie.path || cookie.path[0] !== '/') {
        var lastIndex = path.lastIndexOf('/');
        cookie.path = lastIndex === 0 ? path : path.substr(0, lastIndex);
      }
      // 存入 cookie
      var map = __classPrivateFieldGet(this, _Cookie_map, "f");
      var cookieDomain = cookie.domain;
      var cookiePath = cookie.path;
      var cookieKey = cookie.key;
      if (!map[cookieDomain]) map[cookieDomain] = {};
      if (!map[cookieDomain][cookiePath]) map[cookieDomain][cookiePath] = {};
      var oldCookie = map[cookieDomain][cookiePath][cookieKey];
      cookie.createTime = oldCookie && oldCookie.createTime || Date.now();
      if (this.$_checkExpires(cookie)) {
        // 未过期
        map[cookieDomain][cookiePath][cookieKey] = cookie;
      } else if (oldCookie) {
        // 存在旧 cookie，且被设置为已过期
        delete map[cookieDomain][cookiePath][cookieKey];
      }
      // 持久化 cookie
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__.setStorage && (0,_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__.setStorage)({
        key: STORAGE_KEY,
        data: this.serialize()
      });
    }
    /**
     * 拉取 cookie
     */
  }, {
    key: "getCookie",
    value: function getCookie(url) {
      var _this = this;
      var includeHttpOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _parseUrl2 = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.parseUrl)(url),
        protocol = _parseUrl2.protocol,
        hostname = _parseUrl2.hostname,
        port = _parseUrl2.port,
        pathname = _parseUrl2.pathname;
      var host = (hostname || '') + (port ? ':' + port : '') || '';
      var path = (pathname || '')[0] === '/' ? pathname : '/';
      var res = [];
      var map = __classPrivateFieldGet(this, _Cookie_map, "f");
      var domainList = Object.keys(map);
      var _loop = function _loop() {
        var domainItem = _domainList[_i];
        // 判断 domain
        if (_this.$_checkDomain(host, domainItem)) {
          var domainMap = map[domainItem] || {};
          var pathList = Object.keys(domainMap);
          var _loop2 = function _loop2() {
            var pathItem = _pathList[_i2];
            // 判断 path
            if (_this.$_checkPath(path, pathItem)) {
              var pathMap = map[domainItem][pathItem] || {};
              Object.keys(pathMap).forEach(function (key) {
                var cookie = pathMap[key];
                if (!cookie) return;
                // 判断协议
                if (cookie.secure && protocol !== 'https:' && protocol !== 'wss:') return;
                if (!includeHttpOnly && cookie.httpOnly && protocol && protocol !== 'http:') return;
                // 判断过期
                if (_this.$_checkExpires(cookie)) {
                  res.push(cookie);
                } else {
                  // 过期，删掉
                  delete map[domainItem][pathItem][key];
                }
              });
            }
          };
          for (var _i2 = 0, _pathList = pathList; _i2 < _pathList.length; _i2++) {
            _loop2();
          }
        }
      };
      for (var _i = 0, _domainList = domainList; _i < _domainList.length; _i++) {
        _loop();
      }
      return res.sort(function (a, b) {
        var gap = a.createTime - b.createTime;
        if (!gap) {
          return a.key < b.key ? -1 : 1;
        } else {
          return gap;
        }
      }).map(function (cookie) {
        return "".concat(cookie.key, "=").concat(cookie.value);
      }).join('; ');
    }
    /**
     * 序列化
     */
  }, {
    key: "serialize",
    value: function serialize() {
      try {
        return JSON.stringify(__classPrivateFieldGet(this, _Cookie_map, "f"));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('cannot serialize the cookie');
        return '';
      }
    }
    /**
     * 反序列化
     */
  }, {
    key: "deserialize",
    value: function deserialize(str) {
      var _this2 = this;
      var map = {};
      try {
        map = JSON.parse(str);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('cannot deserialize the cookie');
        map = {};
      }
      // 合并 cookie
      var domainList = Object.keys(map);
      var _loop3 = function _loop3() {
        var domainItem = _domainList2[_i3];
        var domainMap = map[domainItem] || {};
        var pathList = Object.keys(domainMap);
        var _loop4 = function _loop4() {
          var pathItem = _pathList2[_i4];
          var pathMap = map[domainItem][pathItem] || {};
          Object.keys(pathMap).forEach(function (key) {
            var cookie = pathMap[key];
            if (!cookie) return;
            // 已存在则不覆盖
            if (!__classPrivateFieldGet(_this2, _Cookie_map, "f")[domainItem]) __classPrivateFieldGet(_this2, _Cookie_map, "f")[domainItem] = {};
            if (!__classPrivateFieldGet(_this2, _Cookie_map, "f")[domainItem][pathItem]) __classPrivateFieldGet(_this2, _Cookie_map, "f")[domainItem][pathItem] = {};
            if (!__classPrivateFieldGet(_this2, _Cookie_map, "f")[domainItem][pathItem][key]) __classPrivateFieldGet(_this2, _Cookie_map, "f")[domainItem][pathItem][key] = cookie;
          });
        };
        for (var _i4 = 0, _pathList2 = pathList; _i4 < _pathList2.length; _i4++) {
          _loop4();
        }
      };
      for (var _i3 = 0, _domainList2 = domainList; _i3 < _domainList2.length; _i3++) {
        _loop3();
      }
    }
  }], [{
    key: "parse",
    value: function parse(cookieStr) {
      if (!cookieStr && typeof cookieStr !== 'string') return null;
      var cookieStrArr = cookieStr.trim().split(';');
      // key-value
      // eslint-disable-next-line no-control-regex
      var parseKeyValue = /^([^=;\x00-\x1F]+)=([^;\n\r\0\x00-\x1F]*).*/.exec(cookieStrArr.shift());
      if (!parseKeyValue) return null;
      var key = (parseKeyValue[1] || '').trim();
      var value = (parseKeyValue[2] || '').trim();
      // 其他字段
      var path = null;
      var domain = null;
      var expires = null;
      var maxAge = null;
      var secure = false;
      var httpOnly = false;
      var _iterator = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createForOfIteratorHelper_js__WEBPACK_IMPORTED_MODULE_4__["default"])(cookieStrArr),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          item = item.trim();
          if (!item) continue;
          var _item$split = item.split('='),
            _item$split2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_5__["default"])(_item$split, 2),
            _key = _item$split2[0],
            _value = _item$split2[1];
          _key = (_key || '').trim().toLowerCase();
          _value = (_value || '').trim();
          if (!_key) continue;
          switch (_key) {
            case 'path':
              if (_value[0] === '/') path = _value;
              break;
            case 'domain':
              _value = _value.replace(/^\./, '').toLowerCase();
              if (_value) domain = _value;
              break;
            case 'expires':
              if (_value) {
                var timeStamp = Date.parse(_value);
                if (timeStamp) expires = timeStamp;
              }
              break;
            case 'max-age':
              if (/^-?[0-9]+$/.test(_value)) maxAge = +_value * 1000;
              break;
            case 'secure':
              secure = true;
              break;
            case 'httponly':
              httpOnly = true;
              break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return {
        key: key,
        value: value,
        path: path,
        domain: domain,
        expires: expires,
        maxAge: maxAge,
        secure: secure,
        httpOnly: httpOnly
      };
    }
  }]);
}();
_Cookie_map = new WeakMap();
/**
 * 创建 cookie 实例并反序列化
 * @returns
 */
function createCookieInstance() {
  var cookieInstance = new Cookie();
  try {
    var cookie = (0,_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__.getStorageSync)(STORAGE_KEY);
    if (cookie) cookieInstance.deserialize(cookie);
  } catch (err) {
    // ignore
  }
  return cookieInstance;
}
var _XMLHttpRequest_instances, _a, _XMLHttpRequest_method, _XMLHttpRequest_url, _XMLHttpRequest_data, _XMLHttpRequest_status, _XMLHttpRequest_statusText, _XMLHttpRequest_readyState, _XMLHttpRequest_header, _XMLHttpRequest_responseType, _XMLHttpRequest_resHeader, _XMLHttpRequest_response, _XMLHttpRequest_timeout, _XMLHttpRequest_withCredentials, _XMLHttpRequest_requestTask, _XMLHttpRequest_callReadyStateChange, _XMLHttpRequest_callRequest, _XMLHttpRequest_requestSuccess, _XMLHttpRequest_requestFail, _XMLHttpRequest_requestComplete;
var SUPPORT_METHOD = ['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];
var STATUS_TEXT_MAP = {
  100: 'Continue',
  101: 'Switching protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Suitable',
  417: 'Expectation Failed',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported'
};
function createXMLHttpRequestEvent(event, target, loaded) {
  var e = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_6__.createEvent)(event);
  try {
    Object.defineProperties(e, {
      currentTarget: {
        enumerable: true,
        value: target
      },
      target: {
        enumerable: true,
        value: target
      },
      loaded: {
        enumerable: true,
        value: loaded || 0
      },
      // 读 Content-Range 字段，目前来说作用不大,先和 loaded 保持一致
      total: {
        enumerable: true,
        value: loaded || 0
      }
    });
  } catch (err) {
    // no handler
  }
  return e;
}
// https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
var XMLHttpRequest = /*#__PURE__*/function (_Events) {
  function XMLHttpRequest() {
    var _this3;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, XMLHttpRequest);
    _this3 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this, XMLHttpRequest);
    _XMLHttpRequest_instances.add(_this3);
    _XMLHttpRequest_method.set(_this3, void 0);
    _XMLHttpRequest_url.set(_this3, void 0);
    _XMLHttpRequest_data.set(_this3, void 0);
    _XMLHttpRequest_status.set(_this3, void 0);
    _XMLHttpRequest_statusText.set(_this3, void 0);
    _XMLHttpRequest_readyState.set(_this3, void 0);
    _XMLHttpRequest_header.set(_this3, void 0);
    _XMLHttpRequest_responseType.set(_this3, void 0);
    _XMLHttpRequest_resHeader.set(_this3, void 0);
    _XMLHttpRequest_response.set(_this3, void 0);
    _XMLHttpRequest_timeout.set(_this3, void 0);
    _XMLHttpRequest_withCredentials.set(_this3, void 0);
    _XMLHttpRequest_requestTask.set(_this3, void 0);
    // 事件正常流转： loadstart => progress（可能多次） => load => loadend
    // error 流转： loadstart => error => loadend
    // abort 流转： loadstart => abort => loadend
    // web在线测试： https://developer.mozilla.org/zh-CN/play
    /** 当 request 被停止时触发，例如当程序调用 XMLHttpRequest.abort() 时 */
    _this3.onabort = null;
    /** 当 request 遭遇错误时触发 */
    _this3.onerror = null;
    /** 接收到响应数据时触发 */
    _this3.onloadstart = null;
    /** 请求成功完成时触发 */
    _this3.onload = null;
    /** 当请求结束时触发，无论请求成功 ( load) 还是失败 (abort 或 error)。 */
    _this3.onloadend = null;
    /** 在预设时间内没有接收到响应时触发 */
    _this3.ontimeout = null;
    /** 当 readyState 属性发生变化时，调用的事件处理器 */
    _this3.onreadystatechange = null;
    __classPrivateFieldSet(_this3, _XMLHttpRequest_method, '', "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_url, '', "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_data, null, "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_status, 0, "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_statusText, '', "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_readyState, _a.UNSENT, "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_header, {
      Accept: '*/*'
    }, "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_responseType, '', "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_resHeader, null, "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_response, null, "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_timeout, 0, "f");
    /** 向前兼容，默认为 true */
    __classPrivateFieldSet(_this3, _XMLHttpRequest_withCredentials, true, "f");
    __classPrivateFieldSet(_this3, _XMLHttpRequest_requestTask, null, "f");
    return _this3;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_8__["default"])(XMLHttpRequest, _Events);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__["default"])(XMLHttpRequest, [{
    key: "toString",
    value: function toString() {
      return '[object XMLHttpRequest]';
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(event, callback) {
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isString)(event)) return;
      this.on(event, callback, null);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(event, callback) {
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isString)(event)) return;
      this.off(event, callback, null);
    }
    /**
     * 对外属性和方法
     */
  }, {
    key: "timeout",
    get: function get() {
      return __classPrivateFieldGet(this, _XMLHttpRequest_timeout, "f");
    },
    set: function set(timeout) {
      if (typeof timeout !== 'number' || !isFinite(timeout) || timeout <= 0) return;
      __classPrivateFieldSet(this, _XMLHttpRequest_timeout, timeout, "f");
    }
  }, {
    key: "status",
    get: function get() {
      return __classPrivateFieldGet(this, _XMLHttpRequest_status, "f");
    }
  }, {
    key: "statusText",
    get: function get() {
      if (__classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f") === _a.UNSENT || __classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f") === _a.OPENED) return '';
      return STATUS_TEXT_MAP[__classPrivateFieldGet(this, _XMLHttpRequest_status, "f") + ''] || __classPrivateFieldGet(this, _XMLHttpRequest_statusText, "f") || '';
    }
  }, {
    key: "readyState",
    get: function get() {
      return __classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f");
    }
  }, {
    key: "responseType",
    get: function get() {
      return __classPrivateFieldGet(this, _XMLHttpRequest_responseType, "f");
    },
    set: function set(value) {
      if (typeof value !== 'string') return;
      __classPrivateFieldSet(this, _XMLHttpRequest_responseType, value, "f");
    }
  }, {
    key: "responseText",
    get: function get() {
      if (!__classPrivateFieldGet(this, _XMLHttpRequest_responseType, "f") || __classPrivateFieldGet(this, _XMLHttpRequest_responseType, "f") === 'text') {
        return __classPrivateFieldGet(this, _XMLHttpRequest_response, "f");
      }
      return null;
    }
  }, {
    key: "response",
    get: function get() {
      return __classPrivateFieldGet(this, _XMLHttpRequest_response, "f");
    }
  }, {
    key: "withCredentials",
    get: function get() {
      return __classPrivateFieldGet(this, _XMLHttpRequest_withCredentials, "f");
    },
    set: function set(value) {
      __classPrivateFieldSet(this, _XMLHttpRequest_withCredentials, !!value, "f");
    }
  }, {
    key: "abort",
    value: function abort() {
      if (__classPrivateFieldGet(this, _XMLHttpRequest_requestTask, "f")) {
        __classPrivateFieldGet(this, _XMLHttpRequest_requestTask, "f").abort();
        var abortEvent = createXMLHttpRequestEvent('abort', this, 0);
        this.trigger('abort', abortEvent);
        (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isFunction)(this.onabort) && this.onabort(abortEvent);
      }
    }
  }, {
    key: "getAllResponseHeaders",
    value: function getAllResponseHeaders() {
      var _this4 = this;
      if (__classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f") === _a.UNSENT || __classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f") === _a.OPENED || !__classPrivateFieldGet(this, _XMLHttpRequest_resHeader, "f")) {
        return '';
      }
      return Object.keys(__classPrivateFieldGet(this, _XMLHttpRequest_resHeader, "f")).map(function (key) {
        return "".concat(key, ": ").concat(__classPrivateFieldGet(_this4, _XMLHttpRequest_resHeader, "f")[key]);
      }).join('\r\n');
    }
  }, {
    key: "getResponseHeader",
    value: function getResponseHeader(name) {
      if (__classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f") === _a.UNSENT || __classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f") === _a.OPENED || !__classPrivateFieldGet(this, _XMLHttpRequest_resHeader, "f")) {
        return null;
      }
      // 处理大小写不敏感
      var key = Object.keys(__classPrivateFieldGet(this, _XMLHttpRequest_resHeader, "f")).find(function (item) {
        return item.toLowerCase() === name.toLowerCase();
      });
      var value = key ? __classPrivateFieldGet(this, _XMLHttpRequest_resHeader, "f")[key] : null;
      return typeof value === 'string' ? value : null;
    }
  }, {
    key: "open",
    value: function open(method, url) {
      if (typeof method === 'string') method = method.toUpperCase();
      if (SUPPORT_METHOD.indexOf(method) < 0) return;
      if (!url || typeof url !== 'string') return;
      __classPrivateFieldSet(this, _XMLHttpRequest_method, method, "f");
      __classPrivateFieldSet(this, _XMLHttpRequest_url, url, "f");
      __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_callReadyStateChange).call(this, _a.OPENED);
    }
  }, {
    key: "setRequestHeader",
    value: function setRequestHeader(header, value) {
      if (typeof header === 'string' && typeof value === 'string') {
        __classPrivateFieldGet(this, _XMLHttpRequest_header, "f")[header] = value;
      }
    }
  }, {
    key: "send",
    value: function send(data) {
      if (__classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f") !== _a.OPENED) return;
      __classPrivateFieldSet(this, _XMLHttpRequest_data, data, "f");
      __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_callRequest).call(this);
    }
  }], [{
    key: "toString",
    value:
    // 欺骗一些库让其认为是原生的xhr
    function toString() {
      return 'function XMLHttpRequest() { [native code] }';
    }
  }]);
}(_tarojs_runtime__WEBPACK_IMPORTED_MODULE_10__.Events);
_a = XMLHttpRequest, _XMLHttpRequest_method = new WeakMap(), _XMLHttpRequest_url = new WeakMap(), _XMLHttpRequest_data = new WeakMap(), _XMLHttpRequest_status = new WeakMap(), _XMLHttpRequest_statusText = new WeakMap(), _XMLHttpRequest_readyState = new WeakMap(), _XMLHttpRequest_header = new WeakMap(), _XMLHttpRequest_responseType = new WeakMap(), _XMLHttpRequest_resHeader = new WeakMap(), _XMLHttpRequest_response = new WeakMap(), _XMLHttpRequest_timeout = new WeakMap(), _XMLHttpRequest_withCredentials = new WeakMap(), _XMLHttpRequest_requestTask = new WeakMap(), _XMLHttpRequest_instances = new WeakSet(), _XMLHttpRequest_callReadyStateChange = function _XMLHttpRequest_callReadyStateChange(readyState) {
  var hasChange = readyState !== __classPrivateFieldGet(this, _XMLHttpRequest_readyState, "f");
  __classPrivateFieldSet(this, _XMLHttpRequest_readyState, readyState, "f");
  if (hasChange) {
    var readystatechangeEvent = createXMLHttpRequestEvent('readystatechange', this, 0);
    this.trigger('readystatechange', readystatechangeEvent);
    (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isFunction)(this.onreadystatechange) && this.onreadystatechange(readystatechangeEvent);
  }
}, _XMLHttpRequest_callRequest = function _XMLHttpRequest_callRequest() {
  var _this5 = this;
  if (!_tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider || !_tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider.document) {
    console.warn('this page has been unloaded, so this request will be canceled.');
    return;
  }
  if (__classPrivateFieldGet(this, _XMLHttpRequest_timeout, "f")) {
    setTimeout(function () {
      if (!__classPrivateFieldGet(_this5, _XMLHttpRequest_status, "f") && __classPrivateFieldGet(_this5, _XMLHttpRequest_readyState, "f") !== _a.DONE) {
        // 超时
        if (__classPrivateFieldGet(_this5, _XMLHttpRequest_requestTask, "f")) __classPrivateFieldGet(_this5, _XMLHttpRequest_requestTask, "f").abort();
        __classPrivateFieldGet(_this5, _XMLHttpRequest_instances, "m", _XMLHttpRequest_callReadyStateChange).call(_this5, _a.DONE);
        var timeoutEvent = createXMLHttpRequestEvent('timeout', _this5, 0);
        _this5.trigger('timeout', timeoutEvent);
        (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isFunction)(_this5.ontimeout) && _this5.ontimeout(timeoutEvent);
      }
    }, __classPrivateFieldGet(this, _XMLHttpRequest_timeout, "f"));
  }
  // 重置各种状态
  __classPrivateFieldSet(this, _XMLHttpRequest_status, 0, "f");
  __classPrivateFieldSet(this, _XMLHttpRequest_statusText, '', "f");
  __classPrivateFieldSet(this, _XMLHttpRequest_readyState, _a.OPENED, "f");
  __classPrivateFieldSet(this, _XMLHttpRequest_resHeader, null, "f");
  __classPrivateFieldSet(this, _XMLHttpRequest_response, null, "f");
  // 补完 url
  var url = __classPrivateFieldGet(this, _XMLHttpRequest_url, "f");
  url = url.indexOf('//') === -1 ? _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider.location.origin + url : url;
  // 头信息
  var header = Object.assign({}, __classPrivateFieldGet(this, _XMLHttpRequest_header, "f"));
  // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies
  // @ts-ignore
  header.cookie = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider.document.$$cookie;
  if (!this.withCredentials) {
    // 不同源，要求 withCredentials 为 true 才携带 cookie
    var _parseUrl3 = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_3__.parseUrl)(url),
      origin = _parseUrl3.origin;
    if (origin !== _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider.location.origin) delete header.cookie;
  }
  __classPrivateFieldSet(this, _XMLHttpRequest_requestTask, (0,_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__.request)({
    url: url,
    data: __classPrivateFieldGet(this, _XMLHttpRequest_data, "f") || {},
    header: header,
    // @ts-ignore
    method: __classPrivateFieldGet(this, _XMLHttpRequest_method, "f"),
    dataType: __classPrivateFieldGet(this, _XMLHttpRequest_responseType, "f") === 'json' ? 'json' : 'text',
    responseType: __classPrivateFieldGet(this, _XMLHttpRequest_responseType, "f") === 'arraybuffer' ? 'arraybuffer' : 'text',
    success: __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_requestSuccess).bind(this),
    fail: __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_requestFail).bind(this),
    complete: __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_requestComplete).bind(this)
  }), "f");
}, _XMLHttpRequest_requestSuccess = function _XMLHttpRequest_requestSuccess(_ref) {
  var data = _ref.data,
    statusCode = _ref.statusCode,
    header = _ref.header;
  if (!_tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider || !_tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider.document) {
    console.warn('this page has been unloaded, so this request will be canceled.');
    return;
  }
  __classPrivateFieldSet(this, _XMLHttpRequest_status, statusCode, "f");
  __classPrivateFieldSet(this, _XMLHttpRequest_resHeader, header, "f");
  __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_callReadyStateChange).call(this, _a.HEADERS_RECEIVED);
  if (false) { var splitStr, lastSplitStr, cookies, nextSplit, startSplit, start, setCookieStr; }
  // 处理返回数据
  if (data) {
    __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_callReadyStateChange).call(this, _a.LOADING);
    var contentLength = Number(this.getResponseHeader('content-length') || 0);
    var loadstartEvent = createXMLHttpRequestEvent('loadstart', this, contentLength);
    this.trigger('loadstart', loadstartEvent);
    (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isFunction)(this.onloadstart) && this.onloadstart(loadstartEvent);
    __classPrivateFieldSet(this, _XMLHttpRequest_response, data, "f");
    var loadEvent = createXMLHttpRequestEvent('load', this, contentLength);
    this.trigger('load', loadEvent);
    (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isFunction)(this.onload) && this.onload(loadEvent);
  }
}, _XMLHttpRequest_requestFail = function _XMLHttpRequest_requestFail(err) {
  // 微信小程序，无论接口返回200还是其他，响应无论是否有错误，都会进入 success 回调；只有类似超时这种请求错误才会进入 fail 回调
  //
  /**
   * 阿里系小程序，接口返回非200状态码，会进入 fail 回调, 此时 err 对象结构如下（当错误码为 14 或 19 时，会多返回 status、data、headers。可通过这些字段获取服务端相关错误信息）：
   {
     data: "{\"code\": 401,\"msg\":\"登录过期，请重新登录\"}"
     error: 19
     errorMessage: "http status error"
     headers: {date: 'Mon, 14 Aug 2023 08:54:58 GMT', content-type: 'application/json;charset=UTF-8', content-length: '52', connection: 'close', access-control-allow-credentials: 'true', …}
     originalData: "{\"code\": 401,\"msg\":\"登录过期，请重新登录\"}"
     status: 401
   }
   */
  // 统一行为，能正常响应的，都算 success.
  if (err.status) {
    __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_requestSuccess).call(this, {
      data: err,
      statusCode: err.status,
      header: err.headers
    });
    return;
  }
  __classPrivateFieldSet(this, _XMLHttpRequest_status, 0, "f");
  __classPrivateFieldSet(this, _XMLHttpRequest_statusText, err.errMsg || err.errorMessage, "f");
  var errorEvent = createXMLHttpRequestEvent('error', this, 0);
  this.trigger('error', errorEvent);
  (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isFunction)(this.onerror) && this.onerror(errorEvent);
}, _XMLHttpRequest_requestComplete = function _XMLHttpRequest_requestComplete() {
  __classPrivateFieldSet(this, _XMLHttpRequest_requestTask, null, "f");
  __classPrivateFieldGet(this, _XMLHttpRequest_instances, "m", _XMLHttpRequest_callReadyStateChange).call(this, _a.DONE);
  if (__classPrivateFieldGet(this, _XMLHttpRequest_status, "f")) {
    var contentLength = Number(this.getResponseHeader('content-length') || 0);
    var loadendEvent = createXMLHttpRequestEvent('loadend', this, contentLength);
    this.trigger('loadend', loadendEvent);
    (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.isFunction)(this.onloadend) && this.onloadend(loadendEvent);
  }
};
XMLHttpRequest.UNSENT = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;
if (true) {
  if (false) { var _cookie; }
  _tarojs_runtime__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider.XMLHttpRequest = XMLHttpRequest;
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js ***!
  \****************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: function() { return /* binding */ Button; },
/* harmony export */   Image: function() { return /* binding */ Image; },
/* harmony export */   Input: function() { return /* binding */ Input; },
/* harmony export */   RichText: function() { return /* binding */ RichText; },
/* harmony export */   ScrollView: function() { return /* binding */ ScrollView; },
/* harmony export */   Text: function() { return /* binding */ Text; },
/* harmony export */   View: function() { return /* binding */ View; }
/* harmony export */ });
/* unused harmony exports Ad, AdCustom, Audio, Block, Camera, Canvas, ChannelLive, ChannelVideo, Checkbox, CheckboxGroup, CoverImage, CoverView, CustomWrapper, DoubleTapGestureHandler, DraggableSheet, Editor, ForcePressGestureHandler, Form, FunctionalPageNavigator, GridBuilder, GridView, HorizontalDragGestureHandler, Icon, KeyboardAccessory, Label, ListBuilder, ListView, LivePlayer, LivePusher, LongPressGestureHandler, Map, MatchMedia, MovableArea, MovableView, NativeSlot, NavigationBar, Navigator, NestedScrollBody, NestedScrollHeader, OfficialAccount, OpenContainer, OpenData, PageContainer, PageMeta, PanGestureHandler, Picker, PickerView, PickerViewColumn, Progress, Radio, RadioGroup, RootPortal, ScaleGestureHandler, ShareElement, Slider, Slot, Snapshot, Span, StickyHeader, StickySection, Swiper, SwiperItem, Switch, TapGestureHandler, Textarea, VerticalDragGestureHandler, Video, VoipRoom, WebView */
var View = 'view';
var Icon = 'icon';
var Progress = 'progress';
var RichText = 'rich-text';
var Text = 'text';
var Button = 'button';
var Checkbox = 'checkbox';
var CheckboxGroup = 'checkbox-group';
var Form = 'form';
var Input = 'input';
var Label = 'label';
var Picker = 'picker';
var PickerView = 'picker-view';
var PickerViewColumn = 'picker-view-column';
var Radio = 'radio';
var RadioGroup = 'radio-group';
var Slider = 'slider';
var Switch = 'switch';
var CoverImage = 'cover-image';
var Textarea = 'textarea';
var CoverView = 'cover-view';
var MovableArea = 'movable-area';
var MovableView = 'movable-view';
var ScrollView = 'scroll-view';
var Swiper = 'swiper';
var SwiperItem = 'swiper-item';
var Navigator = 'navigator';
var Audio = 'audio';
var Camera = 'camera';
var Image = 'image';
var LivePlayer = 'live-player';
var Video = 'video';
var Canvas = 'canvas';
var Ad = 'ad';
var WebView = 'web-view';
var Block = 'block';
var Map = 'map';
var Slot = 'slot';
var NativeSlot = 'native-slot';
var CustomWrapper = 'custom-wrapper';

// For React.createElement's type
var Editor = 'editor';
var MatchMedia = 'match-media';
var FunctionalPageNavigator = 'functional-page-navigator';
var LivePusher = 'live-pusher';
var OfficialAccount = 'official-account';
var OpenData = 'open-data';
var NavigationBar = 'navigation-bar';
var PageMeta = 'page-meta';
var VoipRoom = 'voip-room';
var AdCustom = 'ad-custom';
var PageContainer = 'page-container';
var ShareElement = 'share-element';
var KeyboardAccessory = 'keyboard-accessory';
var RootPortal = 'root-portal';
var ChannelLive = 'channel-live';
var ChannelVideo = 'channel-video';
var ListView = 'list-view';
var ListBuilder = 'list-builder';
var GridView = 'grid-view';
var GridBuilder = 'grid-builder';
var StickyHeader = 'sticky-header';
var StickySection = 'sticky-section';
var Snapshot = 'snapshot';
var Span = 'span';
var OpenContainer = 'open-container';
var DraggableSheet = 'draggable-sheet';
var NestedScrollHeader = 'nested-scroll-header';
var NestedScrollBody = 'nested-scroll-body';
var DoubleTapGestureHandler = 'double-tap-gesture-handler';
var ForcePressGestureHandler = 'force-press-gesture-handler';
var HorizontalDragGestureHandler = 'horizontal-drag-gesture-handler';
var LongPressGestureHandler = 'long-press-gesture-handler';
var PanGestureHandler = 'pan-gesture-handler';
var ScaleGestureHandler = 'scale-gesture-handler';
var TapGestureHandler = 'tap-gesture-handler';
var VerticalDragGestureHandler = 'vertical-drag-gesture-handler';


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/runtime.js":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/runtime.js ***!
  \*******************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/native-apis.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");


var needPromiseApis = new Set(['addFileToFavorites', 'addVideoToFavorites', 'authPrivateMessage', 'checkIsAddedToMyMiniProgram', 'chooseContact', 'cropImage', 'disableAlertBeforeUnload', 'editImage', 'enableAlertBeforeUnload', 'getBackgroundFetchData', 'getChannelsLiveInfo', 'getChannelsLiveNoticeInfo', 'getFuzzyLocation', 'getGroupEnterInfo', 'getLocalIPAddress', 'getShareInfo', 'getUserProfile', 'getWeRunData', 'join1v1Chat', 'openChannelsActivity', 'openChannelsEvent', 'openChannelsLive', 'openChannelsUserProfile', 'openCustomerServiceChat', 'openVideoEditor', 'saveFileToDisk', 'scanItem', 'setEnable1v1Chat', 'setWindowSize', 'sendBizRedPacket', 'startFacialRecognitionVerify']);
function initNativeApi(taro) {
  (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.processApis)(taro, wx, {
    needPromiseApis: needPromiseApis,
    modifyApis: function modifyApis(apis) {
      // fix https://github.com/NervJS/taro/issues/9899
      apis.delete('lanDebug');
    },
    transformMeta: function transformMeta(api, options) {
      var _a;
      if (api === 'showShareMenu') {
        options.menus = (_a = options.showShareItems) === null || _a === void 0 ? void 0 : _a.map(function (item) {
          return item === 'wechatFriends' ? 'shareAppMessage' : item === 'wechatMoment' ? 'shareTimeline' : item;
        });
      }
      return {
        key: api,
        options: options
      };
    }
  });
  taro.cloud = wx.cloud;
  taro.getTabBar = function (pageCtx) {
    var _a;
    if (typeof (pageCtx === null || pageCtx === void 0 ? void 0 : pageCtx.getTabBar) === 'function') {
      return (_a = pageCtx.getTabBar()) === null || _a === void 0 ? void 0 : _a.$taroInstances;
    }
  };
  taro.getRenderer = function () {
    var _a, _b, _c;
    return (_c = (_b = (_a = taro.getCurrentInstance()) === null || _a === void 0 ? void 0 : _a.page) === null || _b === void 0 ? void 0 : _b.renderer) !== null && _c !== void 0 ? _c : 'webview';
  };
}
var _true = 'true';
var _false = 'false';
var _empty = '';
var _zero = '0';
var _object = '{}';
var components = {
  // ======== 调整属性 ========
  Progress: {
    'border-radius': _zero,
    'font-size': '16',
    duration: '30',
    bindActiveEnd: _empty
  },
  RichText: {
    space: _empty,
    'user-select': _false,
    mode: "'default'"
  },
  Text: {
    'user-select': _false,
    overflow: 'visible',
    'max-lines': ''
  },
  Map: {
    polygons: '[]',
    subkey: _empty,
    rotate: _zero,
    skew: _zero,
    'max-scale': '20',
    'min-scale': '3',
    'enable-3D': _false,
    'show-compass': _false,
    'show-scale': _false,
    'enable-overlooking': _false,
    'enable-auto-max-overlooking': _false,
    'enable-zoom': _true,
    'enable-scroll': _true,
    'enable-rotate': _false,
    'enable-satellite': _false,
    'enable-traffic': _false,
    'enable-poi': _true,
    'enable-building': _true,
    setting: _object,
    bindLabelTap: _empty,
    bindRegionChange: _empty,
    bindPoiTap: _empty,
    bindPolylineTap: _empty,
    bindAbilitySuccess: _empty,
    bindAbilityFailed: _empty,
    bindAuthSuccess: _empty,
    bindInterpolatePoint: _empty,
    bindError: _empty,
    bindAnchorPointTap: _empty
  },
  Button: {
    lang: 'en',
    'session-from': _empty,
    'send-message-title': _empty,
    'send-message-path': _empty,
    'send-message-img': _empty,
    'app-parameter': _empty,
    'show-message-card': _false,
    'business-id': _empty,
    bindGetUserInfo: _empty,
    bindContact: _empty,
    bindGetPhoneNumber: _empty,
    bindGetRealTimePhoneNumber: _empty,
    bindChooseAvatar: _empty,
    bindError: _empty,
    bindOpenSetting: _empty,
    bindLaunchApp: _empty,
    bindAgreePrivacyAuthorization: _empty
  },
  Form: {
    'report-submit-timeout': _zero
  },
  Input: {
    'always-embed': _false,
    'adjust-position': _true,
    'hold-keyboard': _false,
    'safe-password-cert-path': '',
    'safe-password-length': '',
    'safe-password-time-stamp': '',
    'safe-password-nonce': '',
    'safe-password-salt': '',
    'safe-password-custom-hash': '',
    'auto-fill': _empty,
    'cursor-color': '',
    bindKeyboardHeightChange: _empty,
    bindNicknameReview: _empty,
    bindSelectionChange: _empty,
    bindKeyboardCompositionStart: _empty,
    bindKeyboardCompositionUpdate: _empty,
    bindKeyboardCompositionEnd: _empty
  },
  Picker: {
    'header-text': _empty,
    level: 'region'
  },
  PickerView: {
    'immediate-change': _false,
    bindPickStart: _empty,
    bindPickEnd: _empty
  },
  Slider: {
    color: "'#e9e9e9'",
    'selected-color': "'#1aad19'"
  },
  Textarea: {
    'show-confirm-bar': _true,
    'adjust-position': _true,
    'hold-keyboard': _false,
    'disable-default-padding': _false,
    'confirm-type': "'return'",
    'confirm-hold': _false,
    'adjust-keyboard-to': "'cursor'",
    bindKeyboardHeightChange: _empty,
    bindSelectionChange: _empty,
    bindKeyboardCompositionStart: _empty,
    bindKeyboardCompositionUpdate: _empty,
    bindKeyboardCompositionEnd: _empty
  },
  ScrollView: {
    'enable-flex': _false,
    'scroll-anchoring': _false,
    enhanced: _false,
    'using-sticky': _false,
    'paging-enabled': _false,
    'enable-passive': _false,
    'refresher-enabled': _false,
    'refresher-threshold': '45',
    'refresher-default-style': "'black'",
    'refresher-background': "'#FFF'",
    'refresher-triggered': _false,
    bounces: _true,
    'show-scrollbar': _true,
    'fast-deceleration': _false,
    type: "'list'",
    'associative-container': "''",
    reverse: _false,
    clip: _true,
    'enable-back-to-top': _false,
    'cache-extent': _empty,
    'min-drag-distance': '18',
    'scroll-into-view-within-extent': _false,
    'scroll-into-view-alignment': "'start'",
    padding: '[0,0,0,0]',
    'refresher-two-level-enabled': _false,
    'refresher-two-level-triggered': _false,
    'refresher-two-level-threshold': '150',
    'refresher-two-level-close-threshold': '80',
    'refresher-two-level-scroll-enabled': _false,
    'refresher-ballistic-refresh-enabled': _false,
    'refresher-two-level-pinned': _false,
    bindDragStart: _empty,
    bindDragging: _empty,
    bindDragEnd: _empty,
    bindRefresherPulling: _empty,
    bindRefresherRefresh: _empty,
    bindRefresherRestore: _empty,
    bindRefresherAbort: _empty,
    bindScrollStart: _empty,
    bindScrollEnd: _empty,
    bindRefresherWillRefresh: _empty,
    bindRefresherStatusChange: _empty
  },
  StickySection: {
    'push-pinned-header': _true,
    padding: '[0, 0, 0, 0]'
  },
  GridView: {
    type: "'aligned'",
    'cross-axis-count': '2',
    'max-cross-axis-extent': _zero,
    'main-axis-gap': _zero,
    'cross-axis-gap': _zero,
    padding: '[0, 0, 0, 0]'
  },
  GridBuilder: {
    type: "'aligned'",
    list: '[]',
    'cross-axis-count': '2',
    'max-cross-axis-extent': _zero,
    'main-axis-gap': _zero,
    'cross-axis-gap': _zero,
    padding: '[0, 0, 0, 0]',
    bindItemBuild: _empty,
    bindItemDispose: _empty
  },
  ListView: {
    padding: '[0, 0, 0, 0]'
  },
  ListBuilder: {
    list: '[]',
    type: 'static',
    padding: '[0, 0, 0, 0]',
    'child-count': _empty,
    'child-height': _empty,
    bindItemBuild: _empty,
    bindItemDispose: _empty
  },
  StickyHeader: {
    'offset-top': '0',
    padding: '[0, 0, 0, 0]'
  },
  Swiper: {
    'snap-to-edge': _false,
    'easing-function': "'default'",
    'layout-type': "'normal'",
    'transformer-type': "'scaleAndFade'",
    'indicator-type': "'normal'",
    'indicator-margin': '10',
    'indicator-spacing': '4',
    'indicator-radius': '4',
    'indicator-width': '8',
    'indicator-height': '8',
    'indicator-alignment': "'auto'",
    'indicator-offset': '[0, 0]',
    'scroll-with-animation': _true,
    'cache-extent': '0'
  },
  SwiperItem: {
    'skip-hidden-item-layout': _false
  },
  Navigator: {
    target: "'self'",
    'app-id': _empty,
    path: _empty,
    'extra-data': _empty,
    version: "'version'"
  },
  Camera: {
    mode: "'normal'",
    resolution: "'medium'",
    'frame-size': "'medium'",
    bindInitDone: _empty,
    bindScanCode: _empty
  },
  Image: {
    webp: _false,
    'show-menu-by-longpress': _false,
    'fade-in': _false
  },
  LivePlayer: {
    mode: "'live'",
    'sound-mode': "'speaker'",
    'auto-pause-if-navigate': _true,
    'auto-pause-if-open-native': _true,
    'picture-in-picture-mode': '[]',
    'enable-auto-rotation': _false,
    'referrer-policy': "'no-referrer'",
    'enable-casting': _false,
    bindstatechange: _empty,
    bindfullscreenchange: _empty,
    bindnetstatus: _empty,
    bindAudioVolumeNotify: _empty,
    bindEnterPictureInPicture: _empty,
    bindLeavePictureInPicture: _empty,
    bindCastingUserSelect: _empty,
    bindCastingStateChange: _empty,
    bindCastingInterrupt: _empty
  },
  Video: {
    title: _empty,
    'play-btn-position': "'bottom'",
    'enable-play-gesture': _false,
    'auto-pause-if-navigate': _true,
    'auto-pause-if-open-native': _true,
    'vslide-gesture': _false,
    'vslide-gesture-in-fullscreen': _true,
    'show-bottom-progress': _true,
    'ad-unit-id': _empty,
    'poster-for-crawler': _empty,
    'show-casting-button': _false,
    'picture-in-picture-mode': '[]',
    // picture-in-picture-show-progress 属性先注释掉的原因如下：
    // 该属性超过了 wxml 属性的长度限制，实际无法使用且导致编译报错。可等微信官方修复后再放开。
    // 参考1：https://developers.weixin.qq.com/community/develop/doc/000a429beb87f0eac07acc0fc5b400
    // 参考2: https://developers.weixin.qq.com/community/develop/doc/0006883619c48054286a4308258c00?_at=vyxqpllafi
    // 'picture-in-picture-show-progress': 'false',
    'enable-auto-rotation': _false,
    'show-screen-lock-button': _false,
    'show-snapshot-button': _false,
    'show-background-playback-button': _false,
    'background-poster': _empty,
    'referrer-policy': "'no-referrer'",
    'is-drm': _false,
    'is-live': _false,
    'provision-url': _empty,
    'certificate-url': _empty,
    'license-url': _empty,
    'preferred-peak-bit-rate': _empty,
    bindProgress: _empty,
    bindLoadedMetadata: _empty,
    bindControlsToggle: _empty,
    bindEnterPictureInPicture: _empty,
    bindLeavePictureInPicture: _empty,
    bindSeekComplete: _empty,
    bindCastingUserSelect: _empty,
    bindCastingStateChange: _empty,
    bindCastingInterrupt: _empty,
    bindAdLoad: _empty,
    bindAdError: _empty,
    bindAdClose: _empty,
    bindAdPlay: _empty
  },
  Canvas: {
    type: _empty
  },
  Ad: {
    'ad-type': "'banner'",
    'ad-theme': "'white'"
  },
  CoverView: {
    'marker-id': _empty,
    slot: _empty
  },
  // ======== 额外组件 ========
  Editor: {
    'read-only': _false,
    placeholder: _empty,
    'show-img-size': _false,
    'show-img-toolbar': _false,
    'show-img-resize': _false,
    focus: _false,
    bindReady: _empty,
    bindFocus: _empty,
    bindBlur: _empty,
    bindInput: _empty,
    bindStatusChange: _empty,
    name: _empty
  },
  MatchMedia: {
    'min-width': _empty,
    'max-width': _empty,
    width: _empty,
    'min-height': _empty,
    'max-height': _empty,
    height: _empty,
    orientation: _empty
  },
  FunctionalPageNavigator: {
    version: "'release'",
    name: _empty,
    args: _empty,
    bindSuccess: _empty,
    bindFail: _empty,
    bindCancel: _empty
  },
  LivePusher: {
    url: _empty,
    mode: "'RTC'",
    autopush: _false,
    muted: _false,
    'enable-camera': _true,
    'auto-focus': _true,
    orientation: "'vertical'",
    beauty: _zero,
    whiteness: _zero,
    aspect: "'9:16'",
    'min-bitrate': '200',
    'max-bitrate': '1000',
    'audio-quality': "'high'",
    'waiting-image': _empty,
    'waiting-image-hash': _empty,
    zoom: _false,
    'device-position': "'front'",
    'background-mute': _false,
    mirror: _false,
    'remote-mirror': _false,
    'local-mirror': _false,
    'audio-reverb-type': _zero,
    'enable-mic': _true,
    'enable-agc': _false,
    'enable-ans': _false,
    'audio-volume-type': "'voicecall'",
    'video-width': '360',
    'video-height': '640',
    'beauty-style': "'smooth'",
    filter: "'standard'",
    'picture-in-picture-mode': '[]',
    animation: _empty,
    bindStateChange: _empty,
    bindNetStatus: _empty,
    bindBgmStart: _empty,
    bindBgmProgress: _empty,
    bindBgmComplete: _empty,
    bindAudioVolumeNotify: _empty
  },
  OfficialAccount: {
    bindLoad: _empty,
    bindError: _empty
  },
  OpenData: {
    type: _empty,
    'open-gid': _empty,
    lang: "'en'",
    'default-text': _empty,
    'default-avatar': _empty,
    bindError: _empty
  },
  NavigationBar: {
    title: _empty,
    loading: _false,
    'front-color': "'#000000'",
    'background-color': _empty,
    'color-animation-duration': _zero,
    'color-animation-timing-func': "'linear'"
  },
  PageMeta: {
    'background-text-style': _empty,
    'background-color': _empty,
    'background-color-top': _empty,
    'background-color-bottom': _empty,
    'root-background-color': _empty,
    'scroll-top': "''",
    'scroll-duration': '300',
    'page-style': "''",
    'root-font-size': "''",
    'page-orientation': "''",
    bindResize: _empty,
    bindScroll: _empty,
    bindScrollDone: _empty
  },
  VoipRoom: {
    openid: _empty,
    mode: "'camera'",
    'device-position': "'front'",
    bindError: _empty
  },
  AdCustom: {
    'unit-id': _empty,
    'ad-intervals': _empty,
    bindLoad: _empty,
    bindError: _empty
  },
  PageContainer: {
    show: _false,
    duration: '300',
    'z-index': '100',
    overlay: _true,
    position: "'bottom'",
    round: _false,
    'close-on-slide-down': _false,
    'overlay-style': _empty,
    'custom-style': _empty,
    bindBeforeEnter: _empty,
    bindEnter: _empty,
    bindAfterEnter: _empty,
    bindBeforeLeave: _empty,
    bindLeave: _empty,
    bindAfterLeave: _empty,
    bindClickOverlay: _empty
  },
  ShareElement: {
    mapkey: _empty,
    transform: _false,
    duration: '300',
    'easing-function': "'ease-out'",
    'transition-on-gesture': _false,
    'shuttle-on-push': "'to'",
    'shuttle-on-pop': "'to'",
    'rect-tween-type': "'materialRectArc'"
  },
  KeyboardAccessory: {},
  RootPortal: {
    enable: _true
  },
  ChannelLive: {
    'feed-id': _empty,
    'finder-user-name': _empty
  },
  ChannelVideo: {
    'feed-id': _empty,
    'finder-user-name': _empty,
    'feed-token': _empty,
    autoplay: _false,
    loop: _false,
    muted: _false,
    'object-fit': "'contain'",
    bindError: _empty
  },
  Snapshot: {
    mode: "'view'"
  },
  Span: {},
  OpenContainer: {
    transitionType: "'fade'",
    transitionDuration: '300',
    closedColor: "'white'",
    closedElevation: _zero,
    closeBorderRadius: _zero,
    middleColor: _empty,
    openColor: "'white'",
    openElevation: _zero,
    openBorderRadius: _zero
  },
  DraggableSheet: {
    initialChildSize: '0.5',
    minChildSize: '0.25',
    maxChildSize: '1.0',
    snap: _false,
    snapSizes: '[]'
  },
  NestedScrollHeader: {},
  NestedScrollBody: {},
  // skyline手势组件
  DoubleTapGestureHandler: {},
  ForcePressGestureHandler: {},
  HorizontalDragGestureHandler: {},
  LongPressGestureHandler: {},
  PanGestureHandler: {},
  ScaleGestureHandler: {},
  TapGestureHandler: {},
  VerticalDragGestureHandler: {}
};
var hostConfig = {
  initNativeApi: initNativeApi,
  getMiniLifecycle: function getMiniLifecycle(config) {
    var methods = config.page[5];
    if (methods.indexOf('onSaveExitState') === -1) {
      methods.push('onSaveExitState');
    }
    return config;
  },
  transferHydrateData: function transferHydrateData(data, element, componentsAlias) {
    var _a;
    if (element.isTransferElement) {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      data["nn" /* Shortcuts.NodeName */] = element.dataName;
      page.setData((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__["default"])({}, (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.toCamelCase)(data.nn), data));
      return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
        sid: element.sid
      }, "v" /* Shortcuts.Text */, ''), "nn" /* Shortcuts.NodeName */, ((_a = componentsAlias['#text']) === null || _a === void 0 ? void 0 : _a._num) || '8');
    }
  }
};
(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.mergeReconciler)(hostConfig);
(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.mergeInternalComponents)(components);

/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+react@4.0.8_react@18.3.1/node_modules/@tarojs/react/dist/react.esm.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+react@4.0.8_react@18.3.1/node_modules/@tarojs/react/dist/react.esm.js ***!
  \**********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ index; }
/* harmony export */ });
/* unused harmony exports createPortal, createRoot, findDOMNode, flushSync, internalInstanceKey, render, unmountComponentAtNode, unstable_batchedUpdates */
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/typeof.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/constants.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/components.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/form.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/document.js");
/* harmony import */ var react_reconciler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-reconciler */ "./node_modules/.pnpm/react-reconciler@0.29.0_react@18.3.1/node_modules/react-reconciler/cjs/react-reconciler.production.min.js");
/* harmony import */ var react_reconciler__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_reconciler__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_reconciler_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-reconciler/constants */ "./node_modules/.pnpm/react-reconciler@0.29.0_react@18.3.1/node_modules/react-reconciler/constants.js");









var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};
var SyncLane = 1;
var InputContinuousLane = 4;
var DefaultLane = 16;
var DiscreteEventPriority = SyncLane;
var ContinuousEventPriority = InputContinuousLane;
var DefaultEventPriority = DefaultLane;
function getEventPriority(domEventName) {
  switch (domEventName) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'input':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'reset':
    case 'resize':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'change':
    case 'blur':
    case 'focus':
    case 'select':
    case 'selectstart':
      return DiscreteEventPriority;
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'pointerenter':
    case 'pointerleave':
      return ContinuousEventPriority;
    default:
      return DefaultEventPriority;
  }
}
var randomKey = Math.random().toString(36).slice(2);
var internalPropsKey = '__reactProps$' + randomKey;
var internalInstanceKey = '__reactFiber$' + randomKey;
var internalContainerInstanceKey = '__reactContainer$' + randomKey;
// const internalEventHandlersKey = '__reactEvents$' + randomKey
// const internalEventHandlerListenersKey = '__reactListeners$' + randomKey
// const internalEventHandlesSetKey = '__reactHandles$' + randomKey

var HostRoot = 3; // Root of a host tree. Could be nested inside another node.
var HostComponent = 5;
var HostText = 6;
var SuspenseComponent = 13;

/**
 * 给 TaroElement 绑定 react fiber、react props 等属性
 * 提供 fiber -> element、element -> fiber、element -> props 的方法
*/
function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}
function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}
/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
function getInstanceFromNode(node) {
  var inst = node[internalInstanceKey] || node[internalContainerInstanceKey];
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText || inst.tag === SuspenseComponent || inst.tag === HostRoot) {
      return inst;
    } else {
      return null;
    }
  }
  return null;
}
/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
function getNodeFromInstance(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber this, is just the state node right now. We assume it will be
    // a host component or host text.
    return inst.stateNode;
  }
}
function getFiberCurrentPropsFromNode(node) {
  return node[internalPropsKey] || null;
}
function updateFiberProps(node, props) {
  node[internalPropsKey] = props;
  if (false) {}
}

// 从 props 中，更新 input 组件的 value 值
function updateInputWrapper(element, oldValue, props) {
  var node = element;
  var checked = props.checked;
  if (checked != null) {
    console.warn('updateCheck 未实现', node);
    return;
  }
  updateWrapper(element, oldValue, props);
  updateNamedCousins(element, props);
}
// react 中原本处理 type=radio 的逻辑，这里留个空，暂时不处理
function updateNamedCousins(rootNode, props) {
  var name = props.name;
  if (props.type === 'radio' && name != null) {
    console.warn('radio updateNamedCousins 未实现', rootNode, props);
  }
}
function getToStringValue(value) {
  var isEmptyType = typeof value === 'function' || (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) === 'symbol';
  return isEmptyType ? '' : value;
}
function toString(value) {
  return '' + value;
}
function updateWrapper(element, oldValue, props) {
  var node = element;
  var value = getToStringValue(props.value);
  var type = props.type;
  setNodeValue(node, oldValue, value, type);
}
// oldValue 为 event.detail.value，value 为 fiber.props.value
// 如果 oldValue 和 value 不相等，代表受控组件需要更新
// 更新的原则为，fiber.props.value 永远为用户所需要的值，因此 node.value = toString(value)
function setNodeValue(node, oldValue, value) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'string';
  if (value != null) {
    if (type === 'number') {
      if (value === 0 && node.value === ''
      // We explicitly want to coerce to number here if possible.
      // eslint-disable-next-line
      || oldValue != value) {
        node.value = toString(value);
      }
    } else if (oldValue !== toString(value)) {
      node.value = toString(value);
    }
  } else if (type === 'submit' || type === 'reset') {
    // Submit/reset inputs need the attribute removed completely to avoid
    // blank-text buttons.
    node.removeAttribute('value');
  }
}
// 判断当前 TaroElement 是否为 supportedInputTypes input 或 textarea
function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  if (nodeName === 'input') {
    var type = elem.type;
    return !type || !!supportedInputTypes[type];
  }
  if (nodeName === 'textarea') {
    return true;
  }
  return false;
}
var ReactDOMTextareaRestoreControlledState = updateWrapper;
var ReactDOMInputRestoreControlledState = updateInputWrapper;
function isCheckable(elem) {
  var type = elem.type;
  var nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
}
function getTracker(node) {
  return node._valueTracker;
}
function detachTracker(node) {
  node._valueTracker = null;
}
// 之所以单独创建一个 tacker，是为了统一监听不同 type 的 input 值
// 比如 type=checkbox 或者 type=radio，就需要监听 checked，而不是 value
// 虽然目前还未实现 checkbox 和 radio 的 finishEventHandle，但后续不好说，所以先统一和 react 一样的写法
// 需要特别注意的是，tracker 初始化时的值为 node 的初始值，但后续会变更为事件的 detail.value 值
function trackValueOnNode(node) {
  var valueField = isCheckable(node) ? 'checked' : 'value';
  var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
  var currentValue = '' + node[valueField];
  if (node.hasOwnProperty(valueField) || typeof descriptor === 'undefined' || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') {
    return;
  }
  var _get = descriptor.get,
    _set = descriptor.set;
  Object.defineProperty(node, valueField, {
    configurable: true,
    enumerable: descriptor.enumerable,
    get: function get() {
      return _get.call(this);
    },
    set: function set(value) {
      currentValue = '' + value;
      _set.call(this, value);
    }
  });
  var tracker = {
    getValue: function getValue() {
      return currentValue;
    },
    setValue: function setValue(value) {
      currentValue = '' + value;
    },
    stopTracking: function stopTracking() {
      detachTracker(node);
      delete node[valueField];
    }
  };
  return tracker;
}
function track(node) {
  if (getTracker(node)) {
    return;
  }
  node._valueTracker = trackValueOnNode(node);
}
function updateValueIfChanged(node, nextValue) {
  if (!node) {
    return false;
  }
  var tracker = getTracker(node);
  if (!tracker) {
    return true;
  }
  var lastValue = tracker.getValue();
  if (nextValue !== lastValue) {
    tracker.setValue(nextValue);
    return true;
  }
  return false;
}
var IS_NON_DIMENSIONAL = /max|aspect|acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function isEventName(s) {
  return s[0] === 'o' && s[1] === 'n';
}
function isEqual(obj1, obj2) {
  // 首先检查引用是否相同
  if (obj1 === obj2) {
    return true;
  }
  // 如果两者中有一个不是对象，或者为 null，直接返回 false
  if ((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj1) !== 'object' || obj1 === null || (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__["default"])(obj2) !== 'object' || obj2 === null) {
    return false;
  }
  // 获取两个对象键的数组
  var keys1 = Object.keys(obj1);
  var keys2 = Object.keys(obj2);
  // 如果键的数量不相同，对象显然不相等
  if (keys1.length !== keys2.length) {
    return false;
  }
  // 遍历对象的每个键，比较两个对象同一键的值
  for (var i = 0; i < keys1.length; i++) {
    var key = keys1[i];
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  // 如果所有键的值都相等，返回 true
  return true;
}
function updateProps(dom, oldProps, newProps) {
  var updatePayload = getUpdatePayload(dom, oldProps, newProps);
  if (updatePayload) {
    updatePropsByPayload(dom, oldProps, updatePayload);
  }
}
function updatePropsByPayload(dom, oldProps, updatePayload) {
  var handlers = [];
  var fixedHandler = null;
  var _loop = function _loop() {
    // key, value 成对出现
    var key = updatePayload[i];
    var newProp = updatePayload[i + 1];
    var oldProp = oldProps[key];
    if ("mini" === _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY) {
      if (key === '__fixed') {
        // hack: __fixed最先识别
        fixedHandler = function fixedHandler() {
          return setProperty(dom, key, newProp, oldProp);
        };
        return 1; // continue
      }
      // 鸿蒙样式前置插入，防止覆盖style
      if (key === '__hmStyle') {
        handlers.splice(0, 0, function () {
          return setHarmonyStyle(dom, newProp, oldProp);
        });
      } else {
        handlers.push(function () {
          return setProperty(dom, key, newProp, oldProp);
        });
      }
    } else {
      setProperty(dom, key, newProp, oldProp);
    }
  };
  for (var i = 0; i < updatePayload.length; i += 2) {
    if (_loop()) continue;
  }
  if ("mini" === _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY) {
    fixedHandler && fixedHandler();
    for (var _i = 0; _i < handlers.length; _i++) {
      handlers[_i]();
    }
  }
}
function getUpdatePayload(dom, oldProps, newProps) {
  var i;
  var updatePayload = null;
  for (i in oldProps) {
    if (!(i in newProps)) {
      (updatePayload = updatePayload || []).push(i, null);
    }
  }
  var isFormElement = dom instanceof _tarojs_runtime__WEBPACK_IMPORTED_MODULE_4__.FormElement;
  for (i in newProps) {
    if (oldProps[i] !== newProps[i] || isFormElement && i === 'value') {
      // 如果都是 style，且 style 里面的值相等，则无需记录到 payload 中
      if (i === 'style' && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isObject)(oldProps[i]) && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isObject)(newProps[i]) && isEqual(oldProps[i], newProps[i])) continue;
      (updatePayload = updatePayload || []).push(i, newProps[i]);
    }
  }
  return updatePayload;
}
// function eventProxy (e: CommonEvent) {
//   const el = document.getElementById(e.currentTarget.id)
//   const handlers = el!.__handlers[e.type]
//   handlers[0](e)
// }
function setEvent(dom, name, value, oldValue) {
  var isCapture = name.endsWith('Capture');
  var eventName = name.toLowerCase().slice(2);
  if (isCapture) {
    eventName = eventName.slice(0, -7);
  }
  var compName = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.capitalize)((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.toCamelCase)(dom.tagName.toLowerCase()));
  if (eventName === 'click' && "mini" !== _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY && compName in _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.internalComponents) {
    eventName = 'tap';
  }
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isFunction)(value)) {
    if (oldValue) {
      dom.removeEventListener(eventName, oldValue, "mini" !== _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY ? false : undefined);
      dom.addEventListener(eventName, value, "mini" !== _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY ? {
        isCapture: isCapture,
        sideEffect: false
      } : undefined);
    } else {
      dom.addEventListener(eventName, value, "mini" !== _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY ? isCapture : undefined);
    }
  } else {
    dom.removeEventListener(eventName, oldValue);
  }
}
function setStyle(style, key, value) {
  if (key[0] === '-' && "mini" !== _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY) {
    // css variables need not further judgment
    style.setProperty(key, value.toString());
    return;
  }
  style[key] = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isNumber)(value) && IS_NON_DIMENSIONAL.test(key) === false ? "mini" === _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY ? value + 'px' : (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_8__.convertNumber2PX)(value) : value === null ? '' : value;
}
// 鸿蒙样式特殊处理，需要在插入顺序中前置插入，防止覆盖了style
function setHarmonyStyle(dom, value, oldValue) {
  // @ts-ignore
  var style = dom._st.hmStyle; // __hmStyle是已经被处理过的鸿蒙样式，可以直接塞进hmStyle对象内
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isObject)(oldValue)) {
    for (var i in oldValue) {
      if (!(value && i in value)) {
        // 鸿蒙伪类特殊处理
        if ("mini" === _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY) {
          if (i === '::after' || i === '::before') {
            setPseudo(dom, i, null);
          } else if (['::first-child', '::last-child', '::empty'].includes(i) || "".concat(i).indexOf('::nth-child') === 0) {
            // @ts-ignore
            dom.set_pseudo_class(i, null);
          } else {
            if (i === 'position' && oldValue[i] === 'fixed') {
              // @ts-ignore
              dom.setLayer(0);
            } else if (i === 'animationName') {
              // @ts-ignore
              dom.setAnimation(false);
            }
            style[i] = '';
          }
        } else {
          style[i] = '';
        }
      }
    }
  }
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isObject)(value)) {
    for (var _i2 in value) {
      if (!oldValue || !isEqual(value[_i2], oldValue[_i2])) {
        // 鸿蒙伪类特殊处理
        if ("mini" === _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY) {
          if (_i2 === '::after' || _i2 === '::before') {
            setPseudo(dom, _i2, value[_i2]);
          } else if (['::first-child', '::last-child', '::empty'].includes(_i2) || _i2.startsWith('::nth-child')) {
            // @ts-ignore
            dom.set_pseudo_class(_i2, value[_i2]);
          } else {
            if (_i2 === 'position') {
              if (value[_i2] === 'fixed' || value[_i2] !== 'fixed' && (oldValue === null || oldValue === void 0 ? void 0 : oldValue[_i2])) {
                // @ts-ignore
                dom.setLayer(value[_i2] === 'fixed' ? 1 : 0);
              }
            } else if (_i2 === 'animationName') {
              // @ts-ignore
              dom.setAnimation(true);
            }
            style[_i2] = value[_i2];
          }
        } else {
          style[_i2] = value[_i2];
        }
      }
    }
  }
  dom.setAttribute('__hmStyle', value);
}
function setProperty(dom, name, value, oldValue) {
  var _a, _b;
  name = name === 'className' ? 'class' : name;
  if (name === 'key' || name === 'children' || name === 'ref') ;else if (name === 'style') {
    if (/harmony.*cpp/.test("weapp" || 0)) {
      return dom.setAttribute('_style4cpp', value);
    }
    var style = dom.style;
    if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isString)(value)) {
      style.cssText = value;
    } else {
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isString)(oldValue)) {
        style.cssText = '';
        oldValue = null;
      }
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isObject)(oldValue)) {
        for (var i in oldValue) {
          if (!(value && i in value)) {
            // Harmony特殊处理
            if ("mini" === _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY && i === 'position' && oldValue[i] === 'fixed') {
              // @ts-ignore
              dom.setLayer(0);
            }
            setStyle(style, i, '');
          }
        }
      }
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isObject)(value)) {
        for (var _i3 in value) {
          if (!oldValue || !isEqual(value[_i3], oldValue[_i3])) {
            // Harmony特殊处理
            if ("mini" === _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.PLATFORM_TYPE.HARMONY && _i3 === 'position') {
              if (value[_i3] === 'fixed' || value[_i3] !== 'fixed' && (oldValue === null || oldValue === void 0 ? void 0 : oldValue[_i3])) {
                // @ts-ignore
                dom.setLayer(value[_i3] === 'fixed' ? 1 : 0);
              }
            }
            setStyle(style, _i3, value[_i3]);
          }
        }
      }
    }
  } else if (isEventName(name)) {
    setEvent(dom, name, value, oldValue);
  } else if (name === 'dangerouslySetInnerHTML') {
    var newHtml = (_a = value === null || value === void 0 ? void 0 : value.__html) !== null && _a !== void 0 ? _a : '';
    var oldHtml = (_b = oldValue === null || oldValue === void 0 ? void 0 : oldValue.__html) !== null && _b !== void 0 ? _b : '';
    if (newHtml || oldHtml) {
      if (oldHtml !== newHtml) {
        dom.innerHTML = newHtml;
      }
    }
  } else if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isFunction)(value)) {
    if (value == null) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, value);
    }
  }
}
// 设置鸿蒙伪类属性(特殊设置)
function setPseudo(dom, name, value) {
  if (name === '::after') {
    // @ts-ignore
    dom.set_pseudo_after(value);
  } else if (name === '::before') {
    // @ts-ignore
    dom.set_pseudo_before(value);
  }
}

/* eslint-disable @typescript-eslint/indent */
var hostConfig = {
  // below keys order by {React ReactFiberHostConfig.custom.js}, convenient for comparing each other.
  // -------------------
  // required by @types/react-reconciler
  // -------------------
  getPublicInstance: function getPublicInstance(inst) {
    return inst;
  },
  getRootHostContext: function getRootHostContext() {
    return {};
  },
  getChildHostContext: function getChildHostContext(parentHostContext) {
    return parentHostContext;
  },
  prepareForCommit: function prepareForCommit() {
    return null;
  },
  resetAfterCommit: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  createInstance: function createInstance(type, props, _rootContainerInstance, _hostContext, internalInstanceHandle) {
    var element = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_9__.taroDocumentProvider.createElement(type);
    precacheFiberNode(internalInstanceHandle, element);
    updateFiberProps(element, props);
    return element;
  },
  appendInitialChild: function appendInitialChild(parent, child) {
    parent.appendChild(child);
  },
  finalizeInitialChildren: function finalizeInitialChildren(dom, type, props) {
    var newProps = props;
    if (dom instanceof _tarojs_runtime__WEBPACK_IMPORTED_MODULE_4__.FormElement) {
      var _ref = ['switch', 'checkbox', 'radio'].includes(type) ? ['checked', 'defaultChecked'] : ['value', 'defaultValue'],
        _ref2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_10__["default"])(_ref, 2),
        defaultName = _ref2[0],
        defaultKey = _ref2[1];
      if (props.hasOwnProperty(defaultKey)) {
        newProps = Object.assign(Object.assign({}, newProps), (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_11__["default"])({}, defaultName, props[defaultKey]));
        delete newProps[defaultKey];
      }
    }
    updateProps(dom, {}, newProps); // 提前执行更新属性操作，Taro 在 Page 初始化后会立即从 dom 读取必要信息
    if (type === 'input' || type === 'textarea') {
      track(dom);
    }
    return false;
  },
  prepareUpdate: function prepareUpdate(instance, _, oldProps, newProps) {
    return getUpdatePayload(instance, oldProps, newProps);
  },
  shouldSetTextContent: function shouldSetTextContent() {
    return false;
  },
  createTextInstance: function createTextInstance(text, _rootContainerInstance, _hostContext, internalInstanceHandle) {
    var textNode = _tarojs_runtime__WEBPACK_IMPORTED_MODULE_9__.taroDocumentProvider.createTextNode(text);
    precacheFiberNode(internalInstanceHandle, textNode);
    return textNode;
  },
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  isPrimaryRenderer: true,
  warnsIfNotActing: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  getInstanceFromNode: function getInstanceFromNode() {
    return null;
  },
  beforeActiveInstanceBlur: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  afterActiveInstanceBlur: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  preparePortalMount: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  prepareScopeUpdate: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  getInstanceFromScope: function getInstanceFromScope() {
    return null;
  },
  getCurrentEventPriority: function getCurrentEventPriority() {
    return react_reconciler_constants__WEBPACK_IMPORTED_MODULE_1__.DefaultEventPriority;
  },
  detachDeletedInstance: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  // -------------------
  //      Microtasks
  //     (optional)
  // -------------------
  supportsMicrotasks: true,
  scheduleMicrotask: (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isUndefined)(Promise) ? setTimeout : function (callback) {
    return Promise.resolve(null).then(callback).catch(function (error) {
      setTimeout(function () {
        throw error;
      });
    });
  },
  // -------------------
  //      Mutation
  //     (required if supportsMutation is true)
  // -------------------
  appendChild: function appendChild(parent, child) {
    parent.appendChild(child);
  },
  appendChildToContainer: function appendChildToContainer(parent, child) {
    parent.appendChild(child);
  },
  commitTextUpdate: function commitTextUpdate(textInst, _, newText) {
    textInst.nodeValue = newText;
  },
  commitMount: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  commitUpdate: function commitUpdate(dom, updatePayload, _, oldProps, newProps) {
    if (!updatePayload) return;
    // payload 只包含 children 的时候，不应该再继续触发后续的属性比较和更新的逻辑了
    if (updatePayload.length === 2 && updatePayload.includes('children')) return;
    updatePropsByPayload(dom, oldProps, updatePayload);
    updateFiberProps(dom, newProps);
  },
  insertBefore: function insertBefore(parent, child, refChild) {
    parent.insertBefore(child, refChild);
  },
  insertInContainerBefore: function insertInContainerBefore(parent, child, refChild) {
    parent.insertBefore(child, refChild);
  },
  removeChild: function removeChild(parent, child) {
    parent.removeChild(child);
  },
  removeChildFromContainer: function removeChildFromContainer(parent, child) {
    parent.removeChild(child);
  },
  resetTextContent: _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.noop,
  hideInstance: function hideInstance(instance) {
    var style = instance.style;
    style.setProperty('display', 'none');
  },
  hideTextInstance: function hideTextInstance(textInstance) {
    textInstance.nodeValue = '';
  },
  unhideInstance: function unhideInstance(instance, props) {
    var styleProp = props.style;
    var display = (styleProp === null || styleProp === void 0 ? void 0 : styleProp.hasOwnProperty('display')) ? styleProp.display : null;
    display = display == null || (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isBoolean)(display) || display === '' ? '' : ('' + display).trim();
    // eslint-disable-next-line dot-notation
    instance.style['display'] = display;
  },
  unhideTextInstance: function unhideTextInstance(textInstance, text) {
    textInstance.nodeValue = text;
  },
  clearContainer: function clearContainer(element) {
    if (element.childNodes.length > 0) {
      element.textContent = '';
    }
  }
};
var TaroReconciler = react_reconciler__WEBPACK_IMPORTED_MODULE_0___default()(hostConfig);
if (true) {
  var foundDevTools = TaroReconciler.injectIntoDevTools({
    bundleType: 1,
    version: '18.0.0',
    rendererPackageName: 'taro-react'
  });
  if (!foundDevTools) {
    // eslint-disable-next-line no-console
    console.info('%cDownload the React DevTools ' + 'for a better development experience: ' + 'https://reactjs.org/link/react-devtools', 'font-weight:bold');
  }
}
var restoreQueue = null;
// 对比 TaroElement tracker 下的 value 和事件下的 value，判断 element 的值是否存在更改
function getTargetInstForInputOrChangeEvent(e, node) {
  var _a, _b;
  var targetInst = getInstanceFromNode(node);
  var domEventName = e.type;
  if (!targetInst || !isTextInputElement(node)) return;
  if (domEventName === 'input' || domEventName === 'change') {
    var nextValue = toString((_b = (_a = e.mpEvent) === null || _a === void 0 ? void 0 : _a.detail) === null || _b === void 0 ? void 0 : _b.value);
    return getInstIfValueChanged(targetInst, nextValue);
  }
}
function getInstIfValueChanged(targetInst, nextValue) {
  var targetNode = getNodeFromInstance(targetInst);
  if (!targetNode) return false;
  if (updateValueIfChanged(targetNode, nextValue)) {
    return targetInst;
  }
}
// 把 target 塞入更新队列中
function enqueueStateRestore(target) {
  if (restoreQueue) {
    restoreQueue.push(target);
  } else {
    restoreQueue = [target];
  }
}
// 判断是否需要恢复 target（input、textarea） 的状态
function needsStateRestore() {
  return restoreQueue !== null;
}
function finishEventHandler() {
  var controlledComponentsHavePendingUpdates = needsStateRestore();
  if (controlledComponentsHavePendingUpdates) {
    TaroReconciler.flushSync();
    restoreStateIfNeeded();
  }
}
// 遍历 restoreQueue、restoreTarget，恢复其状态
function restoreStateIfNeeded() {
  if (!restoreQueue) {
    return;
  }
  var queuedTargets = restoreQueue;
  restoreQueue = null;
  for (var i = 0; i < queuedTargets.length; i++) {
    restoreStateOfTarget(queuedTargets[i]);
  }
}
function restoreImpl(domElement, tag, oldValue, props) {
  switch (tag) {
    case 'input':
      ReactDOMInputRestoreControlledState(domElement, oldValue, props);
      break;
    case 'textarea':
      ReactDOMTextareaRestoreControlledState(domElement, oldValue, props);
      break;
  }
}
function restoreStateOfTarget(item) {
  var internalInstance = getInstanceFromNode(item.target);
  if (!internalInstance) return;
  var stateNode = internalInstance.stateNode,
    type = internalInstance.type;
  if (stateNode) {
    var props = getFiberCurrentPropsFromNode(stateNode);
    restoreImpl(stateNode, type, item.value, props);
  }
}
var ContainerMap = new WeakMap();
var Root = /*#__PURE__*/function () {
  function Root(renderer, domContainer, options) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_12__["default"])(this, Root);
    this.renderer = renderer;
    this.initInternalRoot(renderer, domContainer, options);
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_13__["default"])(Root, [{
    key: "initInternalRoot",
    value: function initInternalRoot(renderer, domContainer, options) {
      // Since react-reconciler v0.27, createContainer need more parameters
      // @see:https://github.com/facebook/react/blob/0b974418c9a56f6c560298560265dcf4b65784bc/packages/react-reconciler/src/ReactFiberReconciler.js#L248
      var containerInfo = domContainer;
      if (options) {
        var tag = 1; // ConcurrentRoot
        var concurrentUpdatesByDefaultOverride = false;
        var isStrictMode = false;
        var identifierPrefix = '';
        var onRecoverableError = function onRecoverableError(error) {
          return console.error(error);
        };
        var transitionCallbacks = null;
        if (options.unstable_strictMode === true) {
          isStrictMode = true;
        }
        if (options.identifierPrefix !== undefined) {
          identifierPrefix = options.identifierPrefix;
        }
        if (options.onRecoverableError !== undefined) {
          onRecoverableError = options.onRecoverableError;
        }
        if (options.unstable_transitionCallbacks !== undefined) {
          transitionCallbacks = options.unstable_transitionCallbacks;
        }
        this.internalRoot = renderer.createContainer(containerInfo, tag, null,
        // hydrationCallbacks
        isStrictMode, concurrentUpdatesByDefaultOverride, identifierPrefix, onRecoverableError, transitionCallbacks);
      } else {
        var _tag = 0; // LegacyRoot
        this.internalRoot = renderer.createContainer(containerInfo, _tag, null,
        // hydrationCallbacks
        false,
        // isStrictMode
        false,
        // concurrentUpdatesByDefaultOverride,
        '',
        // identifierPrefix
        function () {},
        // onRecoverableError, this isn't reachable because onRecoverableError isn't called in the legacy API.
        null // transitionCallbacks
        );
      }
    }
  }, {
    key: "render",
    value: function render(children, cb) {
      var renderer = this.renderer,
        internalRoot = this.internalRoot;
      renderer.updateContainer(children, internalRoot, null, cb);
      return renderer.getPublicRootInstance(internalRoot);
    }
  }, {
    key: "unmount",
    value: function unmount(cb) {
      this.renderer.updateContainer(null, this.internalRoot, null, cb);
    }
  }]);
}();
function render(element, domContainer, cb) {
  var oldRoot = ContainerMap.get(domContainer);
  if (oldRoot != null) {
    return oldRoot.render(element, cb);
  }
  var root = new Root(TaroReconciler, domContainer);
  ContainerMap.set(domContainer, root);
  return root.render(element, cb);
}
function createRoot(domContainer) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _a;
  var oldRoot = ContainerMap.get(domContainer);
  if (oldRoot != null) {
    return oldRoot;
  }
  // options should be an object
  var root = new Root(TaroReconciler, domContainer, options);
  ContainerMap.set(domContainer, root);
  markContainerAsRoot((_a = root === null || root === void 0 ? void 0 : root.internalRoot) === null || _a === void 0 ? void 0 : _a.current, domContainer);
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_14__.hooks.tap('dispatchTaroEvent', function (e, node) {
    var eventPriority = getEventPriority(e.type);
    TaroReconciler.runWithPriority(eventPriority, function () {
      node.dispatchEvent(e);
    });
  });
  // 对比 event.detail.value 和 node.tracker.value，判断 value 值是否有变动，存在变动则塞入队列中
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_14__.hooks.tap('modifyTaroEvent', function (e, node) {
    var _a, _b;
    var inst = getTargetInstForInputOrChangeEvent(e, node);
    if (!inst) return;
    // 这里塞入的是 event.detail.value，也就是事件的值，在受控组件中，你可以理解为需要被变更的值
    // 后续会在 finishEventHandler 中，使用最新的 fiber.props.value 来与其比较
    // 如果不一致，则表示需要更新，会执行 node.value = fiber.props.value 的更新操作
    var nextValue = (_b = (_a = e.mpEvent) === null || _a === void 0 ? void 0 : _a.detail) === null || _b === void 0 ? void 0 : _b.value;
    enqueueStateRestore({
      target: node,
      value: nextValue
    });
  });
  return root;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
var isInsideEventHandler = false;
// 重新包裹 batchedUpdates，使其可以在触发事件后执行 finishEventHandler
var unstable_batchedUpdates = function unstable_batchedUpdates(fn, a) {
  if (isInsideEventHandler) {
    return fn(a);
  }
  isInsideEventHandler = true;
  try {
    return TaroReconciler.batchedUpdates(fn, a);
  } finally {
    isInsideEventHandler = false;
    finishEventHandler();
  }
};
function unmountComponentAtNode(dom) {
  (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.ensure)(dom && [1, 8, 9, 11].includes(dom.nodeType), 'unmountComponentAtNode(...): Target container is not a DOM element.');
  var root = ContainerMap.get(dom);
  if (!root) return false;
  unstable_batchedUpdates(function () {
    root.unmount(function () {
      ContainerMap.delete(dom);
    });
  }, null);
  return true;
}
function findDOMNode(comp) {
  if (comp == null) {
    return null;
  }
  var nodeType = comp.nodeType;
  if (nodeType === 1 || nodeType === 3) {
    return comp;
  }
  return TaroReconciler.findHostInstance(comp);
}
var portalType = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isFunction)(Symbol) && Symbol.for ? Symbol.for('react.portal') : 0xeaca;
function createPortal(children, containerInfo, key) {
  return {
    $$typeof: portalType,
    key: key == null ? null : String(key),
    children: children,
    containerInfo: containerInfo,
    implementation: null
  };
}
var flushSync = TaroReconciler.flushSync;
var index = {
  render: render,
  flushSync: flushSync,
  createRoot: createRoot,
  unstable_batchedUpdates: unstable_batchedUpdates,
  unmountComponentAtNode: unmountComponentAtNode,
  findDOMNode: findDOMNode,
  createPortal: createPortal,
  internalInstanceKey: internalInstanceKey
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URL.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URL.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroURLProvider: function() { return /* binding */ TaroURLProvider; },
/* harmony export */   parseUrl: function() { return /* binding */ parseUrl; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _URLSearchParams_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./URLSearchParams.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URLSearchParams.js");






var _TaroURL_hash, _TaroURL_hostname, _TaroURL_pathname, _TaroURL_port, _TaroURL_protocol, _TaroURL_search;
var TaroURL = /*#__PURE__*/function () {
  function TaroURL(url, base) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroURL);
    /* private property */
    _TaroURL_hash.set(this, '');
    _TaroURL_hostname.set(this, '');
    _TaroURL_pathname.set(this, '');
    _TaroURL_port.set(this, '');
    _TaroURL_protocol.set(this, '');
    _TaroURL_search.set(this, void 0);
    if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(url)) url = String(url);
    var parseResult = parseUrlBase(url, base);
    var hash = parseResult.hash,
      hostname = parseResult.hostname,
      pathname = parseResult.pathname,
      port = parseResult.port,
      protocol = parseResult.protocol,
      search = parseResult.search;
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_hash, hash, "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_hostname, hostname, "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_pathname, pathname || '/', "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_port, port, "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_protocol, protocol, "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_search, new _URLSearchParams_js__WEBPACK_IMPORTED_MODULE_3__.URLSearchParams(search), "f");
  }
  /* public property */
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_4__["default"])(TaroURL, [{
    key: "protocol",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _TaroURL_protocol, "f");
    },
    set: function set(val) {
      (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val) && (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_protocol, val.trim(), "f");
    }
  }, {
    key: "host",
    get: function get() {
      return this.hostname + (this.port ? ':' + this.port : '');
    },
    set: function set(val) {
      if (val && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val)) {
        val = val.trim();
        var _parseUrl = parseUrl("//".concat(val)),
          hostname = _parseUrl.hostname,
          port = _parseUrl.port;
        this.hostname = hostname;
        this.port = port;
      }
    }
  }, {
    key: "hostname",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _TaroURL_hostname, "f");
    },
    set: function set(val) {
      val && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val) && (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_hostname, val.trim(), "f");
    }
  }, {
    key: "port",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _TaroURL_port, "f");
    },
    set: function set(val) {
      (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val) && (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_port, val.trim(), "f");
    }
  }, {
    key: "pathname",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _TaroURL_pathname, "f");
    },
    set: function set(val) {
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val)) {
        val = val.trim();
        var HEAD_REG = /^(\/|\.\/|\.\.\/)/;
        var temp = val;
        while (HEAD_REG.test(temp)) {
          temp = temp.replace(HEAD_REG, '');
        }
        if (temp) (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_pathname, '/' + temp, "f");else (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_pathname, '/', "f");
      }
    }
  }, {
    key: "search",
    get: function get() {
      var val = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _TaroURL_search, "f").toString();
      return val.length === 0 || val.startsWith('?') ? val : "?".concat(val);
    },
    set: function set(val) {
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val)) {
        val = val.trim();
        (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_search, new _URLSearchParams_js__WEBPACK_IMPORTED_MODULE_3__.URLSearchParams(val), "f");
      }
    }
  }, {
    key: "hash",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _TaroURL_hash, "f");
    },
    set: function set(val) {
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val)) {
        val = val.trim();
        if (val) (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_hash, val.startsWith('#') ? val : "#".concat(val), "f");else (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldSet)(this, _TaroURL_hash, '', "f");
      }
    }
  }, {
    key: "href",
    get: function get() {
      return "".concat(this.protocol, "//").concat(this.host).concat(this.pathname).concat(this.search).concat(this.hash);
    },
    set: function set(val) {
      if (val && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val)) {
        val = val.trim();
        var _parseUrl2 = parseUrl(val),
          protocol = _parseUrl2.protocol,
          hostname = _parseUrl2.hostname,
          port = _parseUrl2.port,
          hash = _parseUrl2.hash,
          search = _parseUrl2.search,
          pathname = _parseUrl2.pathname;
        this.protocol = protocol;
        this.hostname = hostname;
        this.pathname = pathname;
        this.port = port;
        this.hash = hash;
        this.search = search;
      }
    }
  }, {
    key: "origin",
    get: function get() {
      return "".concat(this.protocol, "//").concat(this.host);
    },
    set: function set(val) {
      if (val && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(val)) {
        val = val.trim();
        var _parseUrl3 = parseUrl(val),
          protocol = _parseUrl3.protocol,
          hostname = _parseUrl3.hostname,
          port = _parseUrl3.port;
        this.protocol = protocol;
        this.hostname = hostname;
        this.port = port;
      }
    }
  }, {
    key: "searchParams",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _TaroURL_search, "f");
    }
    // public method
  }, {
    key: "toString",
    value: function toString() {
      return this.href;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString();
    }
    // convenient for deconstructor
  }, {
    key: "_toRaw",
    value: function _toRaw() {
      return {
        protocol: this.protocol,
        port: this.port,
        host: this.host,
        hostname: this.hostname,
        pathname: this.pathname,
        hash: this.hash,
        search: this.search,
        origin: this.origin,
        href: this.href
      };
    }
  }], [{
    key: "createObjectURL",
    value: function createObjectURL() {
      throw new Error('Oops, not support URL.createObjectURL() in miniprogram.');
    }
  }, {
    key: "revokeObjectURL",
    value: function revokeObjectURL() {
      throw new Error('Oops, not support URL.revokeObjectURL() in miniprogram.');
    }
  }]);
}();
_TaroURL_hash = new WeakMap(), _TaroURL_hostname = new WeakMap(), _TaroURL_pathname = new WeakMap(), _TaroURL_port = new WeakMap(), _TaroURL_protocol = new WeakMap(), _TaroURL_search = new WeakMap();
// Note: 小程序端 vite 打包成 commonjs，const URL = xxx 会报错，所以把 URL 改为 TaroURLProvider
var TaroURLProvider =  false ? 0 : TaroURL;
function parseUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var result = {
    href: '',
    origin: '',
    protocol: '',
    hostname: '',
    host: '',
    port: '',
    pathname: '',
    search: '',
    hash: ''
  };
  if (!url || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isString)(url)) return result;
  url = url.trim();
  var PATTERN = /^(([^:/?#]+):)?\/\/(([^/?#]+):(.+)@)?([^/?#:]*)(:(\d+))?([^?#]*)(\?([^#]*))?(#(.*))?/;
  var matches = url.match(PATTERN);
  if (!matches) return result;
  // TODO: username & password ?
  result.protocol = matches[1] || 'https:';
  result.hostname = matches[6] || 'taro.com';
  result.port = matches[8] || '';
  result.pathname = matches[9] || '/';
  result.search = matches[10] || '';
  result.hash = matches[12] || '';
  result.href = url;
  result.origin = result.protocol + '//' + result.hostname;
  result.host = result.hostname + (result.port ? ":".concat(result.port) : '');
  return result;
}
function parseUrlBase(url, base) {
  var VALID_URL = /^(https?:)\/\//i;
  var fullUrl = '';
  var parsedBase = null;
  if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(base)) {
    base = String(base).trim();
    if (!VALID_URL.test(base)) throw new TypeError("Failed to construct 'URL': Invalid base URL");
    parsedBase = parseUrl(base);
  }
  url = String(url).trim();
  if (VALID_URL.test(url)) {
    fullUrl = url;
  } else if (parsedBase) {
    if (url) {
      if (url.startsWith('//')) {
        fullUrl = parsedBase.protocol + url;
      } else {
        fullUrl = parsedBase.origin + (url.startsWith('/') ? url : "/".concat(url));
      }
    } else {
      fullUrl = parsedBase.href;
    }
  } else {
    throw new TypeError("Failed to construct 'URL': Invalid URL");
  }
  return parseUrl(fullUrl);
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URLSearchParams.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URLSearchParams.js ***!
  \***********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   URLSearchParams: function() { return /* binding */ URLSearchParams; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ "./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");





var _dict, _a;
var findReg = /[!'()~]|%20|%00/g;
var plusReg = /\+/g;
var replaceCharMap = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+',
  '%00': '\x00'
};
function replacer(match) {
  return replaceCharMap[match];
}
function appendTo(dict, name, value) {
  var res = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(value) ? value.join(',') : value;
  if (name in dict) dict[name].push(res);else dict[name] = [res];
}
function addEach(value, key) {
  appendTo(this, key, value);
}
function decode(str) {
  return decodeURIComponent(str.replace(plusReg, ' '));
}
function encode(str) {
  return encodeURIComponent(str).replace(findReg, replacer);
}
var URLSearchParams =  false ? 0 : (_a = /*#__PURE__*/function () {
  function _a(query) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, _a);
    _dict.set(this, Object.create(null));
    query !== null && query !== void 0 ? query : query = '';
    var dict = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f");
    if (typeof query === 'string') {
      if (query.charAt(0) === '?') {
        query = query.slice(1);
      }
      for (var pairs = query.split('&'), i = 0, length = pairs.length; i < length; i++) {
        var value = pairs[i];
        var index = value.indexOf('=');
        // 针对不规范的 url 参数做容错处理，如：word=你%好
        try {
          if (index > -1) {
            appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));
          } else if (value.length) {
            appendTo(dict, decode(value), '');
          }
        } catch (err) {
          if (true) {
            console.warn("[Taro warn] URL \u53C2\u6570 ".concat(value, " decode \u5F02\u5E38"));
          }
        }
      }
    } else {
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(query)) {
        for (var _i = 0, _length = query.length; _i < _length; _i++) {
          var _value = query[_i];
          appendTo(dict, _value[0], _value[1]);
        }
      } else if (query.forEach) {
        query.forEach(addEach, dict);
      } else {
        for (var key in query) {
          appendTo(dict, key, query[key]);
        }
      }
    }
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__["default"])(_a, [{
    key: "append",
    value: function append(name, value) {
      appendTo((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f"), name, value);
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      delete (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f")[name];
    }
  }, {
    key: "get",
    value: function get(name) {
      var dict = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f");
      return name in dict ? dict[name][0] : null;
    }
  }, {
    key: "getAll",
    value: function getAll(name) {
      var dict = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f");
      return name in dict ? dict[name].slice(0) : [];
    }
  }, {
    key: "has",
    value: function has(name) {
      return name in (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f");
    }
  }, {
    key: "keys",
    value: function keys() {
      return Object.keys((0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f"));
    }
  }, {
    key: "set",
    value: function set(name, value) {
      (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f")[name] = ['' + value];
    }
  }, {
    key: "forEach",
    value: function forEach(callback, thisArg) {
      var dict = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f");
      Object.getOwnPropertyNames(dict).forEach(function (name) {
        dict[name].forEach(function (value) {
          callback.call(thisArg, value, name, this);
        }, this);
      }, this);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {};
    }
  }, {
    key: "toString",
    value: function toString() {
      var dict = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__classPrivateFieldGet)(this, _dict, "f");
      var query = [];
      for (var key in dict) {
        var name = encode(key);
        for (var i = 0, value = dict[key]; i < value.length; i++) {
          query.push(name + '=' + encode(value[i]));
        }
      }
      return query.join('&');
    }
  }]);
}(), _dict = new WeakMap(), _a);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/document.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/document.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   taroDocumentProvider: function() { return /* binding */ taroDocumentProvider; }
/* harmony export */ });
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _dom_document_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/document.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/document.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");



function createDocument() {
  /**
     * <document>
     *   <html>
     *     <head></head>
     *     <body>
     *       <container>
     *         <app id="app" />
     *       </container>
     *     </body>
     *   </html>
     * </document>
     */
  var doc = new _dom_document_js__WEBPACK_IMPORTED_MODULE_0__.TaroDocument();
  var documentCreateElement = doc.createElement.bind(doc);
  var html = documentCreateElement(_constants_index_js__WEBPACK_IMPORTED_MODULE_1__.HTML);
  var head = documentCreateElement(_constants_index_js__WEBPACK_IMPORTED_MODULE_1__.HEAD);
  var body = documentCreateElement(_constants_index_js__WEBPACK_IMPORTED_MODULE_1__.BODY);
  var app = documentCreateElement(_constants_index_js__WEBPACK_IMPORTED_MODULE_1__.APP);
  app.id = _constants_index_js__WEBPACK_IMPORTED_MODULE_1__.APP;
  var container = documentCreateElement(_constants_index_js__WEBPACK_IMPORTED_MODULE_1__.CONTAINER); // 多包一层主要为了兼容 vue
  doc.appendChild(html);
  html.appendChild(head);
  html.appendChild(body);
  body.appendChild(container);
  container.appendChild(app);
  doc.documentElement = html;
  doc.head = head;
  doc.body = body;
  return doc;
}
// Note: 小程序端 vite 打包成 commonjs，const document = xxx 会报错，所以把 document 改为 taroDocumentProvider
var taroDocumentProvider =  false ? 0 : _env_js__WEBPACK_IMPORTED_MODULE_2__["default"].document = createDocument();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/getComputedStyle.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/getComputedStyle.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   taroGetComputedStyleProvider: function() { return /* binding */ taroGetComputedStyleProvider; }
/* harmony export */ });


// Note: 小程序端 vite 打包成 commonjs，const getComputedStyle = xxx 会报错，所以把 GetComputedStyle 改为 taroGetComputedStyleProvider
var taroGetComputedStyleProvider =  false ? 0 : function (element) {
  return element.style;
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/history.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/history.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   History: function() { return /* binding */ History; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ "./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _utils_cache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/cache.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/cache.js");










var _TaroHistory_instances, _TaroHistory_location, _TaroHistory_stack, _TaroHistory_cur, _TaroHistory_window, _TaroHistory_reset;
var cache = new _utils_cache_js__WEBPACK_IMPORTED_MODULE_0__.RuntimeCache('history');
var TaroHistory = /*#__PURE__*/function (_Events) {
  function TaroHistory(location, options) {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroHistory);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this, TaroHistory);
    _TaroHistory_instances.add(_this);
    /* private property */
    _TaroHistory_location.set(_this, void 0);
    _TaroHistory_stack.set(_this, []);
    _TaroHistory_cur.set(_this, 0);
    _TaroHistory_window.set(_this, void 0);
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(_this, _TaroHistory_window, options.window, "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(_this, _TaroHistory_location, location, "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_location, "f").on('__record_history__', function (href) {
      var _a;
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(_this, _TaroHistory_cur, (_a = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_cur, "f"), _a++, _a), "f");
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(_this, _TaroHistory_stack, (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_stack, "f").slice(0, (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_cur, "f")), "f");
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_stack, "f").push({
        state: null,
        title: '',
        url: href
      });
    }, null);
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_location, "f").on('__reset_history__', function (href) {
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_instances, "m", _TaroHistory_reset).call(_this, href);
    }, null);
    // 切换上下文行为
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_ACTIONS.INIT, function () {
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_instances, "m", _TaroHistory_reset).call(_this);
    }, null);
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_ACTIONS.RESTORE, function (pageId) {
      cache.set(pageId, {
        location: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_location, "f"),
        stack: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_stack, "f").slice(),
        cur: (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_cur, "f")
      });
    }, null);
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_ACTIONS.RECOVER, function (pageId) {
      if (cache.has(pageId)) {
        var ctx = cache.get(pageId);
        (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(_this, _TaroHistory_location, ctx.location, "f");
        (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(_this, _TaroHistory_stack, ctx.stack, "f");
        (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(_this, _TaroHistory_cur, ctx.cur, "f");
      }
    }, null);
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.CONTEXT_ACTIONS.DESTORY, function (pageId) {
      cache.delete(pageId);
    }, null);
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(_this, _TaroHistory_instances, "m", _TaroHistory_reset).call(_this);
    return _this;
  }
  /* public property */
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__["default"])(TaroHistory, _Events);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__["default"])(TaroHistory, [{
    key: "length",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_stack, "f").length;
    }
  }, {
    key: "state",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_stack, "f")[(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_cur, "f")].state;
    }
    /* public method */
  }, {
    key: "go",
    value: function go(delta) {
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isNumber)(delta) || isNaN(delta)) return;
      var targetIdx = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_cur, "f") + delta;
      targetIdx = Math.min(Math.max(targetIdx, 0), this.length - 1);
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(this, _TaroHistory_cur, targetIdx, "f");
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_location, "f").trigger('__set_href_without_history__', (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_stack, "f")[(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_cur, "f")].url);
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_window, "f").trigger('popstate', (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_stack, "f")[(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_cur, "f")]);
    }
  }, {
    key: "back",
    value: function back() {
      this.go(-1);
    }
  }, {
    key: "forward",
    value: function forward() {
      this.go(1);
    }
  }, {
    key: "pushState",
    value: function pushState(state, title, url) {
      if (!url || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isString)(url)) return;
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(this, _TaroHistory_stack, (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_stack, "f").slice(0, (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_cur, "f") + 1), "f");
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_stack, "f").push({
        state: state,
        title: title,
        url: url
      });
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(this, _TaroHistory_cur, this.length - 1, "f");
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_location, "f").trigger('__set_href_without_history__', url);
    }
  }, {
    key: "replaceState",
    value: function replaceState(state, title, url) {
      if (!url || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isString)(url)) return;
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_stack, "f")[(0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_cur, "f")] = {
        state: state,
        title: title,
        url: url
      };
      (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_location, "f").trigger('__set_href_without_history__', url);
    }
    // For debug
  }, {
    key: "cache",
    get: function get() {
      return cache;
    }
  }]);
}(_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.Events);
_TaroHistory_location = new WeakMap(), _TaroHistory_stack = new WeakMap(), _TaroHistory_cur = new WeakMap(), _TaroHistory_window = new WeakMap(), _TaroHistory_instances = new WeakSet(), _TaroHistory_reset = function _TaroHistory_reset() {
  var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(this, _TaroHistory_stack, [{
    state: null,
    title: '',
    url: href || (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _TaroHistory_location, "f").href
  }], "f");
  (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldSet)(this, _TaroHistory_cur, 0, "f");
};
var History =  false ? 0 : TaroHistory;


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/location.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/location.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Location: function() { return /* binding */ Location; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ "./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _current_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../current.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js");
/* harmony import */ var _utils_cache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/cache.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/cache.js");
/* harmony import */ var _URL_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./URL.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URL.js");












var _TaroLocation_instances, _TaroLocation_url, _TaroLocation_noCheckUrl, _TaroLocation_window, _TaroLocation_reset, _TaroLocation_getPreValue, _TaroLocation_rollBack, _TaroLocation_recordHistory, _TaroLocation_checkUrlChange;
var INIT_URL = 'https://taro.com';
var cache = new _utils_cache_js__WEBPACK_IMPORTED_MODULE_0__.RuntimeCache('location');
var TaroLocation = /*#__PURE__*/function (_Events) {
  function TaroLocation(options) {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroLocation);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this, TaroLocation);
    _TaroLocation_instances.add(_this);
    /* private property */
    _TaroLocation_url.set(_this, new _URL_js__WEBPACK_IMPORTED_MODULE_3__.TaroURLProvider(INIT_URL));
    _TaroLocation_noCheckUrl.set(_this, false);
    _TaroLocation_window.set(_this, void 0);
    (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldSet)(_this, _TaroLocation_window, options.window, "f");
    (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(_this, _TaroLocation_instances, "m", _TaroLocation_reset).call(_this);
    _this.on('__set_href_without_history__', function (href) {
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldSet)(_this, _TaroLocation_noCheckUrl, true, "f");
      var lastHash = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(_this, _TaroLocation_url, "f").hash;
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(_this, _TaroLocation_url, "f").href = generateFullUrl(href);
      if (lastHash !== (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(_this, _TaroLocation_url, "f").hash) {
        (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(_this, _TaroLocation_window, "f").trigger('hashchange');
      }
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldSet)(_this, _TaroLocation_noCheckUrl, false, "f");
    }, null);
    // 切换上下文行为
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_5__.CONTEXT_ACTIONS.INIT, function () {
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(_this, _TaroLocation_instances, "m", _TaroLocation_reset).call(_this);
    }, null);
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_5__.CONTEXT_ACTIONS.RESTORE, function (pageId) {
      cache.set(pageId, {
        lastHref: _this.href
      });
    }, null);
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_5__.CONTEXT_ACTIONS.RECOVER, function (pageId) {
      // 数据恢复时，不需要执行跳转
      if (cache.has(pageId)) {
        var ctx = cache.get(pageId);
        (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldSet)(_this, _TaroLocation_noCheckUrl, true, "f");
        (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(_this, _TaroLocation_url, "f").href = ctx.lastHref;
        (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldSet)(_this, _TaroLocation_noCheckUrl, false, "f");
      }
    }, null);
    _this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_5__.CONTEXT_ACTIONS.DESTORY, function (pageId) {
      cache.delete(pageId);
    }, null);
    return _this;
  }
  /* public property */
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_6__["default"])(TaroLocation, _Events);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_7__["default"])(TaroLocation, [{
    key: "protocol",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").protocol;
    },
    set: function set(val) {
      var REG = /^(http|https):$/i;
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val) || !REG.test(val.trim())) return;
      val = val.trim();
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").protocol = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "host",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").host;
    },
    set: function set(val) {
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val)) return;
      val = val.trim();
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").host = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "hostname",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").hostname;
    },
    set: function set(val) {
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val)) return;
      val = val.trim();
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").hostname = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "port",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").port;
    },
    set: function set(val) {
      var xVal = Number(val = val.trim());
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isNumber)(xVal) || xVal <= 0) return;
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").port = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "pathname",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").pathname;
    },
    set: function set(val) {
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val)) return;
      val = val.trim();
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").pathname = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "search",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").search;
    },
    set: function set(val) {
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val)) return;
      val = val.trim();
      val = val.startsWith('?') ? val : "?".concat(val);
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").search = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "hash",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").hash;
    }
    // 小程序的navigateTo存在截断hash字符串的问题
    ,

    set: function set(val) {
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val)) return;
      val = val.trim();
      val = val.startsWith('#') ? val : "#".concat(val);
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").hash = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "href",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").href;
    },
    set: function set(val) {
      var REG = /^(http:|https:)?\/\/.+/;
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val) || !REG.test(val = val.trim())) return;
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").href = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
  }, {
    key: "origin",
    get: function get() {
      return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").origin;
    },
    set: function set(val) {
      var REG = /^(http:|https:)?\/\/.+/;
      if (!val || !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.isString)(val) || !REG.test(val = val.trim())) return;
      var preValue = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_getPreValue).call(this);
      (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").origin = val;
      if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_checkUrlChange).call(this, preValue)) (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_recordHistory).call(this);
    }
    /* public method */
  }, {
    key: "assign",
    value: function assign() {
      (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.warn)(true, '小程序环境中调用location.assign()无效.');
    }
  }, {
    key: "reload",
    value: function reload() {
      (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_9__.warn)(true, '小程序环境中调用location.reload()无效.');
    }
  }, {
    key: "replace",
    value: function replace(url) {
      this.trigger('__set_href_without_history__', url);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.href;
    }
    // For debug
  }, {
    key: "cache",
    get: function get() {
      return cache;
    }
  }]);
}(_tarojs_shared__WEBPACK_IMPORTED_MODULE_10__.Events);
_TaroLocation_url = new WeakMap(), _TaroLocation_noCheckUrl = new WeakMap(), _TaroLocation_window = new WeakMap(), _TaroLocation_instances = new WeakSet(), _TaroLocation_reset = function _TaroLocation_reset() {
  var Current = (0,_current_js__WEBPACK_IMPORTED_MODULE_11__.getCurrentInstance)();
  var router = Current.router;
  if (router) {
    var path = router.path,
      params = router.params;
    var searchArr = Object.keys(params).map(function (key) {
      return "".concat(key, "=").concat(params[key]);
    });
    var searchStr = searchArr.length > 0 ? '?' + searchArr.join('&') : '';
    var url = "".concat(INIT_URL).concat(path.startsWith('/') ? path : '/' + path).concat(searchStr);
    (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldSet)(this, _TaroLocation_url, new _URL_js__WEBPACK_IMPORTED_MODULE_3__.TaroURLProvider(url), "f");
    this.trigger('__reset_history__', this.href);
  }
}, _TaroLocation_getPreValue = function _TaroLocation_getPreValue() {
  return (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f")._toRaw();
}, _TaroLocation_rollBack = function _TaroLocation_rollBack(href) {
  (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f").href = href;
}, _TaroLocation_recordHistory = function _TaroLocation_recordHistory() {
  this.trigger('__record_history__', this.href);
}, _TaroLocation_checkUrlChange = function _TaroLocation_checkUrlChange(preValue) {
  if ((0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_noCheckUrl, "f")) {
    return false;
  }
  var _classPrivateFieldGe = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_url, "f")._toRaw(),
    protocol = _classPrivateFieldGe.protocol,
    hostname = _classPrivateFieldGe.hostname,
    port = _classPrivateFieldGe.port,
    pathname = _classPrivateFieldGe.pathname,
    search = _classPrivateFieldGe.search,
    hash = _classPrivateFieldGe.hash;
  // 跨域三要素不允许修改
  if (protocol !== preValue.protocol || hostname !== preValue.hostname || port !== preValue.port) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_rollBack).call(this, preValue.href);
    return false;
  }
  // pathname
  if (pathname !== preValue.pathname) {
    return true;
  }
  // search
  if (search !== preValue.search) {
    return true;
  }
  // hashchange
  if (hash !== preValue.hash) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_window, "f").trigger('hashchange');
    return true;
  }
  (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__classPrivateFieldGet)(this, _TaroLocation_instances, "m", _TaroLocation_rollBack).call(this, preValue.href);
  return false;
};
var Location =  false ? 0 : TaroLocation;
function generateFullUrl() {
  var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var origin = INIT_URL;
  if (/^[/?#]/.test(val)) {
    return origin + val;
  }
  return val;
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/navigator.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/navigator.js ***!
  \*****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nav: function() { return /* binding */ nav; }
/* harmony export */ });

var machine = 'Macintosh';
var arch = 'Intel Mac OS X 10_14_5';
var engine = 'AppleWebKit/534.36 (KHTML, like Gecko) NodeJS/v4.1.0 Chrome/76.0.3809.132 Safari/534.36';
var msg = '(' + machine + '; ' + arch + ') ' + engine;
var nav =  false ? 0 : {
  appCodeName: 'Mozilla',
  appName: 'Netscape',
  appVersion: '5.0 ' + msg,
  cookieEnabled: true,
  mimeTypes: [],
  onLine: true,
  platform: 'MacIntel',
  plugins: [],
  product: 'Taro',
  productSub: '20030107',
  userAgent: 'Mozilla/5.0 ' + msg,
  vendor: 'Joyent',
  vendorSub: ''
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/raf.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/raf.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   caf: function() { return /* binding */ _caf; },
/* harmony export */   now: function() { return /* binding */ now; },
/* harmony export */   raf: function() { return /* binding */ _raf; }
/* harmony export */ });
// https://github.com/myrne/performance-now
var now;
(function () {
  var loadTime;
  if (typeof performance !== 'undefined' && performance !== null && performance.now) {
    now = function now() {
      return performance.now();
    };
  } else if (Date.now) {
    loadTime = Date.now();
    now = function now() {
      return Date.now() - loadTime;
    };
  } else {
    loadTime = new Date().getTime();
    now = function now() {
      return new Date().getTime() - loadTime;
    };
  }
})();
var lastTime = 0;
// https://gist.github.com/paulirish/1579671
// https://gist.github.com/jalbam/5fe05443270fa6d8136238ec72accbc0
var _raf =  false ? 0 : function (callback) {
  var _now = now();
  var nextTime = Math.max(lastTime + 16, _now); // First time will execute it immediately but barely noticeable and performance is gained.
  return setTimeout(function () {
    callback(lastTime = nextTime);
  }, nextTime - _now);
};
var _caf =  false ? 0 : function (seed) {
  // fix https://github.com/NervJS/taro/issues/7749
  clearTimeout(seed);
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/window.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/window.js ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   taroHistoryProvider: function() { return /* binding */ taroHistoryProvider; },
/* harmony export */   taroLocationProvider: function() { return /* binding */ taroLocationProvider; },
/* harmony export */   taroWindowProvider: function() { return /* binding */ taroWindowProvider; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/getComputedStyle.js");
/* harmony import */ var _history_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./history.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/history.js");
/* harmony import */ var _location_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./location.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/location.js");
/* harmony import */ var _navigator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigator.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/navigator.js");
/* harmony import */ var _raf_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./raf.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/raf.js");














var TaroWindow = /*#__PURE__*/function (_Events) {
  function TaroWindow() {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroWindow);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroWindow);
    _this.navigator = _navigator_js__WEBPACK_IMPORTED_MODULE_2__.nav;
    _this.requestAnimationFrame = _raf_js__WEBPACK_IMPORTED_MODULE_3__.raf;
    _this.cancelAnimationFrame = _raf_js__WEBPACK_IMPORTED_MODULE_3__.caf;
    _this.getComputedStyle = _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__.taroGetComputedStyleProvider;
    var globalProperties = [].concat((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_5__["default"])(Object.getOwnPropertyNames(__webpack_require__.g || {})), (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_5__["default"])(Object.getOwnPropertySymbols(__webpack_require__.g || {})));
    globalProperties.forEach(function (property) {
      if (property === 'atob' || property === 'document') return;
      if (!Object.prototype.hasOwnProperty.call(_this, property)) {
        // 防止小程序环境下，window 上的某些 get 属性在赋值时报错
        try {
          _this[property] = __webpack_require__.g[property];
        } catch (e) {
          if (true) {
            console.warn("[Taro warn] window.".concat(String(property), " \u5728\u8D4B\u503C\u5230 window \u65F6\u62A5\u9519"));
          }
        }
      }
    });
    _this.Date || (_this.Date = Date);
    // 应用启动时，提供给需要读取历史信息的库使用
    _this.location = new _location_js__WEBPACK_IMPORTED_MODULE_6__.Location({
      window: _this
    });
    // @ts-ignore
    _this.history = new _history_js__WEBPACK_IMPORTED_MODULE_7__.History(_this.location, {
      window: _this
    });
    _this.initEvent();
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_8__["default"])(TaroWindow, _Events);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_9__["default"])(TaroWindow, [{
    key: "initEvent",
    value: function initEvent() {
      var _location = this.location;
      var _history = this.history;
      this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.INIT, function (pageId) {
        // 页面onload，为该页面建立新的上下文信息
        _location.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.INIT, pageId);
      }, null);
      this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.RECOVER, function (pageId) {
        // 页面onshow，恢复当前页面的上下文信息
        _location.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.RECOVER, pageId);
        _history.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.RECOVER, pageId);
      }, null);
      this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.RESTORE, function (pageId) {
        // 页面onhide，缓存当前页面的上下文信息
        _location.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.RESTORE, pageId);
        _history.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.RESTORE, pageId);
      }, null);
      this.on(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.DESTORY, function (pageId) {
        // 页面onunload，清除当前页面的上下文信息
        _location.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.DESTORY, pageId);
        _history.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_10__.CONTEXT_ACTIONS.DESTORY, pageId);
      }, null);
    }
  }, {
    key: "document",
    get: function get() {
      return _env_js__WEBPACK_IMPORTED_MODULE_11__["default"].document;
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(event, callback) {
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_12__.isString)(event)) return;
      this.on(event, callback, null);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(event, callback) {
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_12__.isString)(event)) return;
      this.off(event, callback, null);
    }
  }, {
    key: "setTimeout",
    value: function (_setTimeout) {
      function setTimeout() {
        return _setTimeout.apply(this, arguments);
      }
      setTimeout.toString = function () {
        return _setTimeout.toString();
      };
      return setTimeout;
    }(function () {
      return setTimeout.apply(void 0, arguments);
    })
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }
      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };
      return clearTimeout;
    }(function () {
      return clearTimeout.apply(void 0, arguments);
    })
  }]);
}(_tarojs_shared__WEBPACK_IMPORTED_MODULE_13__.Events); // Note: 小程序端 vite 打包成 commonjs，const window = xxx 会报错，所以把 window 改为 taroWindowProvider，location 和 history 同理
var taroWindowProvider =  false ? 0 : _env_js__WEBPACK_IMPORTED_MODULE_11__["default"].window = new TaroWindow();
var taroLocationProvider = taroWindowProvider.location;
var taroHistoryProvider = taroWindowProvider.history;


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js ***!
  \*******************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: function() { return /* binding */ A; },
/* harmony export */   APP: function() { return /* binding */ APP; },
/* harmony export */   BEHAVIORS: function() { return /* binding */ BEHAVIORS; },
/* harmony export */   BODY: function() { return /* binding */ BODY; },
/* harmony export */   CATCHMOVE: function() { return /* binding */ CATCHMOVE; },
/* harmony export */   CATCH_VIEW: function() { return /* binding */ CATCH_VIEW; },
/* harmony export */   CHANGE: function() { return /* binding */ CHANGE; },
/* harmony export */   CLASS: function() { return /* binding */ CLASS; },
/* harmony export */   CLICK_VIEW: function() { return /* binding */ CLICK_VIEW; },
/* harmony export */   COMMENT: function() { return /* binding */ COMMENT; },
/* harmony export */   COMPILE_MODE: function() { return /* binding */ COMPILE_MODE; },
/* harmony export */   CONFIRM: function() { return /* binding */ CONFIRM; },
/* harmony export */   CONTAINER: function() { return /* binding */ CONTAINER; },
/* harmony export */   CONTEXT_ACTIONS: function() { return /* binding */ CONTEXT_ACTIONS; },
/* harmony export */   CURRENT_TARGET: function() { return /* binding */ CURRENT_TARGET; },
/* harmony export */   CUSTOM_WRAPPER: function() { return /* binding */ CUSTOM_WRAPPER; },
/* harmony export */   DATASET: function() { return /* binding */ DATASET; },
/* harmony export */   DATE: function() { return /* binding */ DATE; },
/* harmony export */   DOCUMENT_ELEMENT_NAME: function() { return /* binding */ DOCUMENT_ELEMENT_NAME; },
/* harmony export */   DOCUMENT_FRAGMENT: function() { return /* binding */ DOCUMENT_FRAGMENT; },
/* harmony export */   EVENT_CALLBACK_RESULT: function() { return /* binding */ EVENT_CALLBACK_RESULT; },
/* harmony export */   EXTERNAL_CLASSES: function() { return /* binding */ EXTERNAL_CLASSES; },
/* harmony export */   FOCUS: function() { return /* binding */ FOCUS; },
/* harmony export */   HEAD: function() { return /* binding */ HEAD; },
/* harmony export */   HOOKS_APP_ID: function() { return /* binding */ HOOKS_APP_ID; },
/* harmony export */   HTML: function() { return /* binding */ HTML; },
/* harmony export */   ID: function() { return /* binding */ ID; },
/* harmony export */   INPUT: function() { return /* binding */ INPUT; },
/* harmony export */   KEY_CODE: function() { return /* binding */ KEY_CODE; },
/* harmony export */   OBJECT: function() { return /* binding */ OBJECT; },
/* harmony export */   ON_HIDE: function() { return /* binding */ ON_HIDE; },
/* harmony export */   ON_LOAD: function() { return /* binding */ ON_LOAD; },
/* harmony export */   ON_READY: function() { return /* binding */ ON_READY; },
/* harmony export */   ON_SHOW: function() { return /* binding */ ON_SHOW; },
/* harmony export */   OPTIONS: function() { return /* binding */ OPTIONS; },
/* harmony export */   PAGE_INIT: function() { return /* binding */ PAGE_INIT; },
/* harmony export */   PROPERTY_THRESHOLD: function() { return /* binding */ PROPERTY_THRESHOLD; },
/* harmony export */   PROPS: function() { return /* binding */ PROPS; },
/* harmony export */   PURE_VIEW: function() { return /* binding */ PURE_VIEW; },
/* harmony export */   ROOT_STR: function() { return /* binding */ ROOT_STR; },
/* harmony export */   SET_DATA: function() { return /* binding */ SET_DATA; },
/* harmony export */   SET_TIMEOUT: function() { return /* binding */ SET_TIMEOUT; },
/* harmony export */   STATIC_VIEW: function() { return /* binding */ STATIC_VIEW; },
/* harmony export */   STYLE: function() { return /* binding */ STYLE; },
/* harmony export */   TARGET: function() { return /* binding */ TARGET; },
/* harmony export */   TARO_RUNTIME: function() { return /* binding */ TARO_RUNTIME; },
/* harmony export */   TIME_STAMP: function() { return /* binding */ TIME_STAMP; },
/* harmony export */   TOUCHMOVE: function() { return /* binding */ TOUCHMOVE; },
/* harmony export */   TYPE: function() { return /* binding */ TYPE; },
/* harmony export */   UID: function() { return /* binding */ UID; },
/* harmony export */   VALUE: function() { return /* binding */ VALUE; },
/* harmony export */   VIEW: function() { return /* binding */ VIEW; }
/* harmony export */ });
var PROPERTY_THRESHOLD = 2046;
var TARO_RUNTIME = 'Taro runtime';
var HOOKS_APP_ID = 'taro-app';
var SET_DATA = '小程序 setData';
var PAGE_INIT = '页面初始化';
var ROOT_STR = 'root';
var HTML = 'html';
var HEAD = 'head';
var BODY = 'body';
var APP = 'app';
var CONTAINER = 'container';
var DOCUMENT_ELEMENT_NAME = '#document';
var DOCUMENT_FRAGMENT = 'document-fragment';
var ID = 'id';
var UID = 'uid';
var CLASS = 'class';
var STYLE = 'style';
var FOCUS = 'focus';
var VIEW = 'view';
var STATIC_VIEW = 'static-view';
var PURE_VIEW = 'pure-view';
var CLICK_VIEW = 'click-view';
var PROPS = 'props';
var DATASET = 'dataset';
var OBJECT = 'object';
var VALUE = 'value';
var INPUT = 'input';
var CHANGE = 'change';
var CUSTOM_WRAPPER = 'custom-wrapper';
var TARGET = 'target';
var CURRENT_TARGET = 'currentTarget';
var TYPE = 'type';
var CONFIRM = 'confirm';
var TIME_STAMP = 'timeStamp';
var KEY_CODE = 'keyCode';
var TOUCHMOVE = 'touchmove';
var DATE = 'Date';
var SET_TIMEOUT = 'setTimeout';
var COMPILE_MODE = 'compileMode';
var CATCHMOVE = 'catchMove';
var CATCH_VIEW = 'catch-view';
var COMMENT = 'comment';
var ON_LOAD = 'onLoad';
var ON_READY = 'onReady';
var ON_SHOW = 'onShow';
var ON_HIDE = 'onHide';
var OPTIONS = 'options';
var EXTERNAL_CLASSES = 'externalClasses';
var EVENT_CALLBACK_RESULT = 'e_result';
var BEHAVIORS = 'behaviors';
var A = 'a';
/**
 * 页面上下文切换时的行为
 */
var CONTEXT_ACTIONS;
(function (CONTEXT_ACTIONS) {
  CONTEXT_ACTIONS["INIT"] = "0";
  CONTEXT_ACTIONS["RESTORE"] = "1";
  CONTEXT_ACTIONS["RECOVER"] = "2";
  CONTEXT_ACTIONS["DESTORY"] = "3";
})(CONTEXT_ACTIONS || (CONTEXT_ACTIONS = {}));


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Current: function() { return /* binding */ Current; },
/* harmony export */   getCurrentInstance: function() { return /* binding */ getCurrentInstance; }
/* harmony export */ });
var Current = {
  app: null,
  router: null,
  page: null
};
var getCurrentInstance = function getCurrentInstance() {
  return Current;
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/implements.js":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/implements.js ***!
  \*********************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   recordMutation: function() { return /* binding */ recordMutation; }
/* harmony export */ });
/* unused harmony export MutationObserverImpl */
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");


var observers = [];
/**
 * The MutationObserver provides the ability
 * to watch for changes being made to the DOM tree.
 * It will invoke a specified callback function
 * when DOM changes occur.
 * @see https://dom.spec.whatwg.org/#mutationobserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
var MutationObserverImpl = /*#__PURE__*/function () {
  function MutationObserverImpl(callback) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, MutationObserverImpl);
    this.records = [];
    this.callback = callback;
  }
  /**
   * Configures the MutationObserver
   * to begin receiving notifications
   * through its callback function
   * when DOM changes matching the given options occur.
   *
   * Options matching is to be implemented.
   */
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(MutationObserverImpl, [{
    key: "observe",
    value: function observe(target, options) {
      this.disconnect();
      this.target = target;
      this.options = options || {};
      observers.push(this);
    }
    /**
     * Stop the MutationObserver instance
     * from receiving further notifications
     * until and unless observe() is called again.
     */
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.target = null;
      var index = observers.indexOf(this);
      if (index >= 0) {
        observers.splice(index, 1);
      }
    }
    /**
     * Removes all pending notifications
     * from the MutationObserver's notification queue
     * and returns them in a new Array of MutationRecord objects.
     */
  }, {
    key: "takeRecords",
    value: function takeRecords() {
      return this.records.splice(0, this.records.length);
    }
  }]);
}();
/** Match two TaroNodes by sid. */
var sidMatches = function sidMatches(observerTarget, target) {
  return !!observerTarget && observerTarget.sid === (target === null || target === void 0 ? void 0 : target.sid);
};
var isConcerned = function isConcerned(record, options) {
  var characterData = options.characterData,
    characterDataOldValue = options.characterDataOldValue,
    attributes = options.attributes,
    attributeOldValue = options.attributeOldValue,
    childList = options.childList;
  switch (record.type) {
    case "characterData" /* MutationRecordType.CHARACTER_DATA */:
      if (characterData) {
        if (!characterDataOldValue) record.oldValue = null;
        return true;
      }
      return false;
    case "attributes" /* MutationRecordType.ATTRIBUTES */:
      if (attributes) {
        if (!attributeOldValue) record.oldValue = null;
        return true;
      }
      return false;
    case "childList" /* MutationRecordType.CHILD_LIST */:
      if (childList) {
        return true;
      }
      return false;
  }
};
var pendingMuatations = false;
function logMutation(observer, record) {
  observer.records.push(record);
  if (!pendingMuatations) {
    pendingMuatations = true;
    Promise.resolve().then(function () {
      pendingMuatations = false;
      observers.forEach(function (observer) {
        return observer.callback(observer.takeRecords());
      });
    });
  }
}
function recordMutation(record) {
  observers.forEach(function (observer) {
    var options = observer.options;
    for (var t = record.target; t; t = t.parentNode) {
      if (sidMatches(observer.target, t) && isConcerned(record, options)) {
        logMutation(observer, record);
        break;
      }
      if (!options.subtree) break;
    }
  });
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/index.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/index.js ***!
  \****************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MutationObserver: function() { return /* binding */ MutationObserver; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _implements_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./implements.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/implements.js");




var MutationObserver = /*#__PURE__*/function () {
  function MutationObserver(callback) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, MutationObserver);
    if (false) {} else {
      if (true) {
        console.warn('[Taro Warning] 若要使用 MutationObserver，请在 Taro 编译配置中设置 \'mini.runtime.enableMutationObserver: true\'');
      }
      this.core = {
        observe: _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.noop,
        disconnect: _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.noop,
        takeRecords: _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.noop
      };
    }
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_2__["default"])(MutationObserver, [{
    key: "observe",
    value: function observe() {
      var _this$core;
      (_this$core = this.core).observe.apply(_this$core, arguments);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.core.disconnect();
    }
  }, {
    key: "takeRecords",
    value: function takeRecords() {
      return this.core.takeRecords();
    }
  }], [{
    key: "record",
    value: function record(_record) {
      (0,_implements_js__WEBPACK_IMPORTED_MODULE_3__.recordMutation)(_record);
    }
  }]);
}();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/anchor-element.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/anchor-element.js ***!
  \**********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnchorElement: function() { return /* binding */ AnchorElement; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropGet.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropGet.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _bom_URL_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../bom/URL.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URL.js");
/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js");







var AnchorElement = /*#__PURE__*/function (_TaroElement) {
  function AnchorElement() {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, AnchorElement);
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, AnchorElement, arguments);
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__["default"])(AnchorElement, _TaroElement);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__["default"])(AnchorElement, [{
    key: "href",
    get: function get() {
      var _a;
      return (_a = this.props["href" /* AnchorElementAttrs.HREF */]) !== null && _a !== void 0 ? _a : '';
    },
    set: function set(val) {
      this.setAttribute("href" /* AnchorElementAttrs.HREF */, val);
    }
  }, {
    key: "protocol",
    get: function get() {
      var _a;
      return (_a = this.props["protocol" /* AnchorElementAttrs.PROTOCOL */]) !== null && _a !== void 0 ? _a : '';
    }
  }, {
    key: "host",
    get: function get() {
      var _a;
      return (_a = this.props["host" /* AnchorElementAttrs.HOST */]) !== null && _a !== void 0 ? _a : '';
    }
  }, {
    key: "search",
    get: function get() {
      var _a;
      return (_a = this.props["search" /* AnchorElementAttrs.SEARCH */]) !== null && _a !== void 0 ? _a : '';
    }
  }, {
    key: "hash",
    get: function get() {
      var _a;
      return (_a = this.props["hash" /* AnchorElementAttrs.HASH */]) !== null && _a !== void 0 ? _a : '';
    }
  }, {
    key: "hostname",
    get: function get() {
      var _a;
      return (_a = this.props["hostname" /* AnchorElementAttrs.HOSTNAME */]) !== null && _a !== void 0 ? _a : '';
    }
  }, {
    key: "port",
    get: function get() {
      var _a;
      return (_a = this.props["port" /* AnchorElementAttrs.PORT */]) !== null && _a !== void 0 ? _a : '';
    }
  }, {
    key: "pathname",
    get: function get() {
      var _a;
      return (_a = this.props["pathname" /* AnchorElementAttrs.PATHNAME */]) !== null && _a !== void 0 ? _a : '';
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(qualifiedName, value) {
      if (qualifiedName === "href" /* AnchorElementAttrs.HREF */) {
        var willSetAttr = (0,_bom_URL_js__WEBPACK_IMPORTED_MODULE_4__.parseUrl)(value);
        for (var k in willSetAttr) {
          (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_5__["default"])(AnchorElement, "setAttribute", this, 3)([k, willSetAttr[k]]);
        }
      } else {
        (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_5__["default"])(AnchorElement, "setAttribute", this, 3)([qualifiedName, value]);
      }
    }
  }]);
}(_element_js__WEBPACK_IMPORTED_MODULE_6__.TaroElement);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/class-list.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/class-list.js ***!
  \******************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClassList: function() { return /* binding */ ClassList; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");


var ClassList = /*#__PURE__*/function () {
  function ClassList(className, el) {
    var _this = this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, ClassList);
    this.tokenList = [];
    this.el = el;
    className.trim().split(/\s+/).forEach(function (token) {
      return _this.tokenList.push(token);
    });
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ClassList, [{
    key: "value",
    get: function get() {
      return this.toString();
    }
  }, {
    key: "length",
    get: function get() {
      return this.tokenList.length;
    }
  }, {
    key: "add",
    value: function add() {
      var index = 0;
      var updated = false;
      var tokens = arguments;
      var length = tokens.length;
      var tokenList = this.tokenList;
      do {
        var token = tokens[index];
        if (this.checkTokenIsValid(token) && !~tokenList.indexOf(token)) {
          tokenList.push(token);
          updated = true;
        }
      } while (++index < length);
      if (updated) {
        this._update();
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      var i = 0;
      var updated = false;
      var tokens = arguments;
      var length = tokens.length;
      var tokenList = this.tokenList;
      do {
        var token = tokens[i] + '';
        if (!this.checkTokenIsValid(token)) continue;
        var index = tokenList.indexOf(token);
        if (~tokenList.indexOf(token)) {
          tokenList.splice(index, 1);
          updated = true;
        }
      } while (++i < length);
      if (updated) {
        this._update();
      }
    }
  }, {
    key: "contains",
    value: function contains(token) {
      if (!this.checkTokenIsValid(token)) return false;
      return !!~this.tokenList.indexOf(token);
    }
  }, {
    key: "toggle",
    value: function toggle(token, force) {
      var result = this.contains(token);
      var method = result ? force !== true && 'remove' : force !== false && 'add';
      if (method) {
        // @ts-ignore
        this[method](token);
      }
      if (force === true || force === false) {
        return force;
      } else {
        return !result;
      }
    }
  }, {
    key: "replace",
    value: function replace(token, replacement_token) {
      if (!this.checkTokenIsValid(token) || !this.checkTokenIsValid(replacement_token)) return;
      var index = this.tokenList.indexOf(token);
      if (~index) {
        this.tokenList.splice(index, 1, replacement_token);
        this._update();
      }
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.tokenList.filter(function (v) {
        return v !== '';
      }).join(' ');
    }
  }, {
    key: "checkTokenIsValid",
    value: function checkTokenIsValid(token) {
      if (token === '' || /\s/.test(token)) return false;
      return true;
    }
  }, {
    key: "_update",
    value: function _update() {
      this.el.className = this.value;
    }
  }]);
}();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/document.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/document.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroDocument: function() { return /* binding */ TaroDocument; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/components.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js");
/* harmony import */ var _event_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event.js");
/* harmony import */ var _event_source_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./event-source.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-source.js");
/* harmony import */ var _form_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./form.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/form.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./root.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/root.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./text.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/text.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");
/* harmony import */ var _anchor_element_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./anchor-element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/anchor-element.js");
/* harmony import */ var _transfer_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./transfer.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/transfer.js");















var TaroDocument = /*#__PURE__*/function (_TaroElement) {
  function TaroDocument() {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroDocument);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroDocument);
    _this.createEvent = _event_js__WEBPACK_IMPORTED_MODULE_2__.createEvent;
    _this.nodeType = 9 /* NodeType.DOCUMENT_NODE */;
    _this.nodeName = _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.DOCUMENT_ELEMENT_NAME;
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_4__["default"])(TaroDocument, _TaroElement);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_5__["default"])(TaroDocument, [{
    key: "createElement",
    value: function createElement(type) {
      var nodeName = type.toLowerCase();
      var element;
      switch (true) {
        case nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ROOT_STR:
          element = new _root_js__WEBPACK_IMPORTED_MODULE_6__.TaroRootElement();
          return element;
        case _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.controlledComponent.has(nodeName):
          element = new _form_js__WEBPACK_IMPORTED_MODULE_8__.FormElement();
          break;
        case nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.A:
          element = new _anchor_element_js__WEBPACK_IMPORTED_MODULE_9__.AnchorElement();
          break;
        case nodeName === 'page-meta':
        case nodeName === 'navigation-bar':
          element = new _transfer_js__WEBPACK_IMPORTED_MODULE_10__.TransferElement((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_11__.toCamelCase)(nodeName));
          break;
        default:
          element = new _element_js__WEBPACK_IMPORTED_MODULE_12__.TaroElement();
          break;
      }
      element.nodeName = nodeName;
      element.tagName = type.toUpperCase();
      return element;
    }
    // an ugly fake createElementNS to deal with @vue/runtime-dom's
    // support mounting app to svg container since vue@3.0.8
  }, {
    key: "createElementNS",
    value: function createElementNS(_svgNS, type) {
      return this.createElement(type);
    }
  }, {
    key: "createTextNode",
    value: function createTextNode(text) {
      return new _text_js__WEBPACK_IMPORTED_MODULE_13__.TaroText(text);
    }
  }, {
    key: "getElementById",
    value: function getElementById(id) {
      var el = _event_source_js__WEBPACK_IMPORTED_MODULE_14__.eventSource.get(id);
      return (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_15__.isUndefined)(el) ? null : el;
    }
  }, {
    key: "querySelector",
    value: function querySelector(query) {
      // 为了 Vue3 的乞丐版实现
      if (/^#/.test(query)) {
        return this.getElementById(query.slice(1));
      }
      return null;
    }
  }, {
    key: "querySelectorAll",
    value: function querySelectorAll() {
      // fake hack
      return [];
    }
    // @TODO: @PERF: 在 hydrate 移除掉空的 node
  }, {
    key: "createComment",
    value: function createComment() {
      var textnode = new _text_js__WEBPACK_IMPORTED_MODULE_13__.TaroText('');
      textnode.nodeName = _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.COMMENT;
      return textnode;
    }
  }, {
    key: "defaultView",
    get: function get() {
      return _env_js__WEBPACK_IMPORTED_MODULE_16__["default"].window;
    }
  }]);
}(_element_js__WEBPACK_IMPORTED_MODULE_12__.TaroElement);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroElement: function() { return /* binding */ TaroElement; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropGet.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropGet.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropSet_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropSet.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropSet.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../dom-external/mutation-observer/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/index.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");
/* harmony import */ var _class_list_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./class-list.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/class-list.js");
/* harmony import */ var _event_source_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./event-source.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-source.js");
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./node.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/node.js");
/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./style.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/style.js");
/* harmony import */ var _tree_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./tree.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/tree.js");















var TaroElement = /*#__PURE__*/function (_TaroNode) {
  function TaroElement() {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroElement);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroElement);
    _this.props = {};
    _this.dataset = _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ;
    _this.nodeType = 1 /* NodeType.ELEMENT_NODE */;
    _this.style = new _style_js__WEBPACK_IMPORTED_MODULE_3__.Style(_this);
    _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('patchElement', _this);
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__["default"])(TaroElement, _TaroNode);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__["default"])(TaroElement, [{
    key: "_stopPropagation",
    value: function _stopPropagation(event) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var target = this;
      // eslint-disable-next-line no-cond-assign
      while (target = target.parentNode) {
        var listeners = target.__handlers[event.type];
        if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isArray)(listeners)) {
          continue;
        }
        for (var i = listeners.length; i--;) {
          var l = listeners[i];
          l._stop = true;
        }
      }
    }
  }, {
    key: "id",
    get: function get() {
      return this.getAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.ID);
    },
    set: function set(val) {
      this.setAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.ID, val);
    }
  }, {
    key: "className",
    get: function get() {
      return this.getAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.CLASS) || '';
    },
    set: function set(val) {
      this.setAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.CLASS, val);
    }
  }, {
    key: "cssText",
    get: function get() {
      return this.getAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STYLE) || '';
    }
  }, {
    key: "classList",
    get: function get() {
      return new _class_list_js__WEBPACK_IMPORTED_MODULE_9__.ClassList(this.className, this);
    }
  }, {
    key: "children",
    get: function get() {
      return this.childNodes.filter(_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.isElement);
    }
  }, {
    key: "attributes",
    get: function get() {
      var props = this.props;
      var propKeys = Object.keys(props);
      var style = this.style.cssText;
      var attrs = propKeys.map(function (key) {
        return {
          name: key,
          value: props[key]
        };
      });
      return attrs.concat(style ? {
        name: _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STYLE,
        value: style
      } : []);
    }
  }, {
    key: "textContent",
    get: function get() {
      var text = '';
      var childNodes = this.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        text += childNodes[i].textContent;
      }
      return text;
    },
    set: function set(text) {
      (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropSet_js__WEBPACK_IMPORTED_MODULE_11__["default"])(TaroElement, "textContent", text, this, 1, 1);
    }
  }, {
    key: "hasAttribute",
    value: function hasAttribute(qualifiedName) {
      return !(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isUndefined)(this.props[qualifiedName]);
    }
  }, {
    key: "hasAttributes",
    value: function hasAttributes() {
      return this.attributes.length > 0;
    }
  }, {
    key: "focus",
    get: function get() {
      return function () {
        this.setAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.FOCUS, true);
      };
    }
    // 兼容 Vue3，详情请见：https://github.com/NervJS/taro/issues/10579
    ,

    set: function set(value) {
      this.setAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.FOCUS, value);
    }
  }, {
    key: "blur",
    value: function blur() {
      this.setAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.FOCUS, false);
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(qualifiedName, value) {
       true && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.warn)((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isString)(value) && value.length > _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.PROPERTY_THRESHOLD, "\u5143\u7D20 ".concat(this.nodeName, " \u7684 ").concat(qualifiedName, " \u5C5E\u6027\u503C\u6570\u636E\u91CF\u8FC7\u5927\uFF0C\u53EF\u80FD\u4F1A\u5F71\u54CD\u6E32\u67D3\u6027\u80FD\u3002\u8003\u8651\u964D\u4F4E\u56FE\u7247\u8F6C\u4E3A base64 \u7684\u9608\u503C\u6216\u5728 CSS \u4E2D\u4F7F\u7528 base64\u3002"));
      var isPureView = this.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.VIEW && !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.isHasExtractProp)(this) && !this.isAnyEventBinded();
      if (qualifiedName !== _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STYLE) {
        _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_12__.MutationObserver.record({
          target: this,
          type: "attributes" /* MutationRecordType.ATTRIBUTES */,
          attributeName: qualifiedName,
          oldValue: this.getAttribute(qualifiedName)
        });
      }
      switch (qualifiedName) {
        case _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STYLE:
          this.style.cssText = value;
          break;
        case _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.ID:
          if (this.uid !== this.sid) {
            // eventSource[sid] 永远保留，直到组件卸载
            // eventSource[uid] 可变
            _event_source_js__WEBPACK_IMPORTED_MODULE_13__.eventSource.delete(this.uid);
          }
          value = String(value);
          this.props[qualifiedName] = this.uid = value;
          _event_source_js__WEBPACK_IMPORTED_MODULE_13__.eventSource.set(value, this);
          break;
        default:
          this.props[qualifiedName] = value;
          if (qualifiedName.startsWith('data-')) {
            if (this.dataset === _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.EMPTY_OBJ) {
              this.dataset = Object.create(null);
            }
            this.dataset[(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.toCamelCase)(qualifiedName.replace(/^data-/, ''))] = value;
          }
          break;
      }
      // Serialization
      if (!this._root) return;
      var componentsAlias = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.getComponentsAlias)();
      var _alias = componentsAlias[this.nodeName];
      var viewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.VIEW]._num;
      var clickViewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.CLICK_VIEW]._num;
      var staticViewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STATIC_VIEW]._num;
      var catchViewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.CATCH_VIEW]._num;
      var _path = this._path;
      qualifiedName = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.shortcutAttr)(qualifiedName);
      var qualifiedNameInCamelCase = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.toCamelCase)(qualifiedName);
      var payload = {
        path: "".concat(_path, ".").concat(qualifiedNameInCamelCase),
        value: (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isFunction)(value) ? function () {
          return value;
        } : value
      };
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('modifySetAttrPayload', this, qualifiedName, payload, componentsAlias);
      if (_alias) {
        var qualifiedNameAlias = _alias[qualifiedNameInCamelCase] || qualifiedName;
        payload.path = "".concat(_path, ".").concat((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.toCamelCase)(qualifiedNameAlias));
      }
      this.enqueueUpdate(payload);
      if (this.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.VIEW) {
        if (qualifiedNameInCamelCase === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.CATCHMOVE) {
          // catchMove = true: catch-view
          // catchMove = false: view or click-view or static-view
          this.enqueueUpdate({
            path: "".concat(_path, ".", "nn" /* Shortcuts.NodeName */),
            value: value ? catchViewAlias : this.isOnlyClickBinded() ? clickViewAlias : this.isAnyEventBinded() ? viewAlias : staticViewAlias
          });
        } else if (isPureView && (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.isHasExtractProp)(this)) {
          // pure-view => static-view
          this.enqueueUpdate({
            path: "".concat(_path, ".", "nn" /* Shortcuts.NodeName */),
            value: staticViewAlias
          });
        }
      }
    }
  }, {
    key: "removeAttribute",
    value: function removeAttribute(qualifiedName) {
      var isStaticView = this.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.VIEW && (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.isHasExtractProp)(this) && !this.isAnyEventBinded();
      _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_12__.MutationObserver.record({
        target: this,
        type: "attributes" /* MutationRecordType.ATTRIBUTES */,
        attributeName: qualifiedName,
        oldValue: this.getAttribute(qualifiedName)
      });
      if (qualifiedName === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STYLE) {
        this.style.cssText = '';
      } else {
        var isInterrupt = _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('onRemoveAttribute', this, qualifiedName);
        if (isInterrupt) {
          return;
        }
        if (!this.props.hasOwnProperty(qualifiedName)) {
          return;
        }
        delete this.props[qualifiedName];
      }
      // Serialization
      if (!this._root) return;
      var componentsAlias = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.getComponentsAlias)();
      var _alias = componentsAlias[this.nodeName];
      var viewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.VIEW]._num;
      var staticViewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STATIC_VIEW]._num;
      var pureViewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.PURE_VIEW]._num;
      var clickViewAlias = componentsAlias[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.CLICK_VIEW]._num;
      var _path = this._path;
      qualifiedName = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.shortcutAttr)(qualifiedName);
      var qualifiedNameInCamelCase = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.toCamelCase)(qualifiedName);
      var payload = {
        path: "".concat(_path, ".").concat(qualifiedNameInCamelCase),
        value: ''
      };
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('modifyRmAttrPayload', this, qualifiedName, payload, componentsAlias);
      if (_alias) {
        var qualifiedNameAlias = _alias[qualifiedNameInCamelCase] || qualifiedName;
        payload.path = "".concat(_path, ".").concat((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.toCamelCase)(qualifiedNameAlias));
      }
      this.enqueueUpdate(payload);
      if (this.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.VIEW) {
        if (qualifiedNameInCamelCase === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.CATCHMOVE) {
          // catch-view => view or click-view or static-view or pure-view
          this.enqueueUpdate({
            path: "".concat(_path, ".", "nn" /* Shortcuts.NodeName */),
            value: this.isOnlyClickBinded() ? clickViewAlias : this.isAnyEventBinded() ? viewAlias : (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.isHasExtractProp)(this) ? staticViewAlias : pureViewAlias
          });
        } else if (isStaticView && !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.isHasExtractProp)(this)) {
          // static-view => pure-view
          this.enqueueUpdate({
            path: "".concat(_path, ".", "nn" /* Shortcuts.NodeName */),
            value: pureViewAlias
          });
        }
      }
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(qualifiedName) {
      var attr = qualifiedName === _constants_index_js__WEBPACK_IMPORTED_MODULE_8__.STYLE ? this.style.cssText : this.props[qualifiedName];
      return attr !== null && attr !== void 0 ? attr : '';
    }
  }, {
    key: "getElementsByTagName",
    value: function getElementsByTagName(tagName) {
      var _this2 = this;
      return (0,_tree_js__WEBPACK_IMPORTED_MODULE_14__.treeToArray)(this, function (el) {
        return el.nodeName === tagName || tagName === '*' && _this2 !== el;
      });
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(className) {
      var classNames = className.trim().split(/\s+/);
      return (0,_tree_js__WEBPACK_IMPORTED_MODULE_14__.treeToArray)(this, function (el) {
        var classList = el.classList;
        return classNames.every(function (c) {
          return classList.contains(c);
        });
      });
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var cancelable = event.cancelable;
      var listeners = this.__handlers[event.type];
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isArray)(listeners)) {
        return false;
      }
      for (var i = listeners.length; i--;) {
        var listener = listeners[i];
        var result = void 0;
        if (listener._stop) {
          listener._stop = false;
        } else {
          _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('modifyDispatchEvent', event, this);
          result = listener.call(this, event);
        }
        if ((result === false || event._end) && cancelable) {
          event.defaultPrevented = true;
        }
        if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isUndefined)(result) && event.mpEvent) {
          var res = _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('modifyTaroEventReturn', this, event, result);
          if (res) {
            event.mpEvent[_constants_index_js__WEBPACK_IMPORTED_MODULE_8__.EVENT_CALLBACK_RESULT] = result;
          }
        }
        if (event._end && event._stop) {
          break;
        }
      }
      if (event._stop) {
        this._stopPropagation(event);
      }
      return listeners != null;
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, handler, options) {
      var name = this.nodeName;
      var SPECIAL_NODES = _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('getSpecialNodes');
      var sideEffect = true;
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.isObject)(options) && options.sideEffect === false) {
        sideEffect = false;
        delete options.sideEffect;
      }
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('modifyAddEventListener', this, sideEffect, _utils_index_js__WEBPACK_IMPORTED_MODULE_10__.getComponentsAlias);
      if (sideEffect !== false && !this.isAnyEventBinded() && SPECIAL_NODES.indexOf(name) > -1) {
        var componentsAlias = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.getComponentsAlias)();
        var alias = componentsAlias[name]._num;
        this.enqueueUpdate({
          path: "".concat(this._path, ".", "nn" /* Shortcuts.NodeName */),
          value: alias
        });
      }
      (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_15__["default"])(TaroElement, "addEventListener", this, 3)([type, handler, options]);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, handler) {
      var sideEffect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_15__["default"])(TaroElement, "removeEventListener", this, 3)([type, handler]);
      var name = this.nodeName;
      var SPECIAL_NODES = _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('getSpecialNodes');
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.hooks.call('modifyRemoveEventListener', this, sideEffect, _utils_index_js__WEBPACK_IMPORTED_MODULE_10__.getComponentsAlias);
      if (sideEffect !== false && !this.isAnyEventBinded() && SPECIAL_NODES.indexOf(name) > -1) {
        var componentsAlias = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.getComponentsAlias)();
        var value = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.isHasExtractProp)(this) ? "static-".concat(name) : "pure-".concat(name);
        var valueAlias = componentsAlias[value]._num;
        this.enqueueUpdate({
          path: "".concat(this._path, ".", "nn" /* Shortcuts.NodeName */),
          value: valueAlias
        });
      }
    }
  }], [{
    key: "extend",
    value: function extend(methodName, options) {
      (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_10__.extend)(TaroElement, methodName, options);
    }
  }]);
}(_node_js__WEBPACK_IMPORTED_MODULE_16__.TaroNode);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-source.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-source.js ***!
  \********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   eventSource: function() { return /* binding */ eventSource; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_wrapNativeSuper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js");





var EventSource = /*#__PURE__*/function (_Map) {
  function EventSource() {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, EventSource);
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, EventSource, arguments);
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__["default"])(EventSource, _Map);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__["default"])(EventSource, [{
    key: "removeNode",
    value: function removeNode(child) {
      var sid = child.sid,
        uid = child.uid;
      this.delete(sid);
      if (uid !== sid && uid) this.delete(uid);
    }
  }, {
    key: "removeNodeTree",
    value: function removeNodeTree(child) {
      var _this = this;
      this.removeNode(child);
      var childNodes = child.childNodes;
      childNodes.forEach(function (node) {
        return _this.removeNodeTree(node);
      });
    }
  }]);
}(/*#__PURE__*/(0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_wrapNativeSuper_js__WEBPACK_IMPORTED_MODULE_4__["default"])(Map));
var eventSource = new EventSource();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-target.js":
/*!********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-target.js ***!
  \********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroEventTarget: function() { return /* binding */ TaroEventTarget; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");




var TaroEventTarget = /*#__PURE__*/function () {
  function TaroEventTarget() {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroEventTarget);
    this.__handlers = {};
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(TaroEventTarget, [{
    key: "addEventListener",
    value: function addEventListener(type, handler, options) {
      type = type.toLowerCase();
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.hooks.call('onAddEvent', type, handler, options, this);
      if (type === 'regionchange') {
        // map 组件的 regionchange 事件非常特殊，详情：https://github.com/NervJS/taro/issues/5766
        this.addEventListener('begin', handler, options);
        this.addEventListener('end', handler, options);
        return;
      }
      var isCapture = Boolean(options);
      var isOnce = false;
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.isObject)(options)) {
        isCapture = Boolean(options.capture);
        isOnce = Boolean(options.once);
      }
      if (isOnce) {
        var _wrapper = function wrapper() {
          handler.apply(this, arguments); // this 指向 Element
          this.removeEventListener(type, _wrapper);
        };
        this.addEventListener(type, _wrapper, Object.assign(Object.assign({}, options), {
          once: false
        }));
        return;
      }
       true && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.warn)(isCapture, 'Taro 暂未实现 event 的 capture 特性。');
      // 某些框架，如 PReact 有委托的机制，handler 始终是同一个函数
      // 这会导致多层停止冒泡失败：view -> view(handler.stop = false) -> view(handler.stop = true)
      // 这样解决：view -> view(handlerA.stop = false) -> view(handlerB.stop = false)
      // 因此每次绑定事件都新建一个函数，如果带来了性能问题，可以把这段逻辑抽取到 PReact 插件中。
      var oldHandler = handler;
      handler = function handler() {
        return oldHandler.apply(this, arguments); // this 指向 Element
      };
      handler.oldHandler = oldHandler;
      var handlers = this.__handlers[type];
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.isArray)(handlers)) {
        handlers.push(handler);
      } else {
        this.__handlers[type] = [handler];
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, handler) {
      type = type.toLowerCase();
      if (type === 'regionchange') {
        // map 组件的 regionchange 事件非常特殊，详情：https://github.com/NervJS/taro/issues/5766
        this.removeEventListener('begin', handler);
        this.removeEventListener('end', handler);
        return;
      }
      if (!handler) {
        return;
      }
      var handlers = this.__handlers[type];
      if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.isArray)(handlers)) {
        return;
      }
      var index = handlers.findIndex(function (item) {
        if (item === handler || item.oldHandler === handler) return true;
      });
       true && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.warn)(index === -1, "\u4E8B\u4EF6: '".concat(type, "' \u6CA1\u6709\u6CE8\u518C\u5728 DOM \u4E2D\uFF0C\u56E0\u6B64\u4E0D\u4F1A\u88AB\u79FB\u9664\u3002"));
      handlers.splice(index, 1);
    }
  }, {
    key: "isAnyEventBinded",
    value: function isAnyEventBinded() {
      var handlers = this.__handlers;
      var isAnyEventBinded = Object.keys(handlers).find(function (key) {
        return handlers[key].length;
      });
      return Boolean(isAnyEventBinded);
    }
  }, {
    key: "isOnlyClickBinded",
    value: function isOnlyClickBinded() {
      var handlers = this.__handlers;
      var isOnlyClickBinded = handlers.tap && Object.keys(handlers).length === 1;
      return Boolean(isOnlyClickBinded);
    }
  }]);
}();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroEvent: function() { return /* binding */ TaroEvent; },
/* harmony export */   createEvent: function() { return /* binding */ createEvent; },
/* harmony export */   eventHandler: function() { return /* binding */ eventHandler; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");







// Taro 事件对象。以 Web 标准的事件对象为基础，加入小程序事件对象中携带的部分信息，并模拟实现事件冒泡。
var TaroEvent = /*#__PURE__*/function () {
  function TaroEvent(type, opts, event) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroEvent);
    this._stop = false;
    this._end = false;
    this.defaultPrevented = false;
    // Mouse Event botton property, it's used in 3rd lib, like react-router. default 0 in general
    this.button = 0;
    // timestamp can either be hi-res ( relative to page load) or low-res (relative to UNIX epoch)
    // here use hi-res timestamp
    this.timeStamp = Date.now();
    this.type = type.toLowerCase();
    this.mpEvent = event;
    this.bubbles = Boolean(opts && opts.bubbles);
    this.cancelable = Boolean(opts && opts.cancelable);
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(TaroEvent, [{
    key: "stopPropagation",
    value: function stopPropagation() {
      this._stop = true;
    }
  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this._end = this._stop = true;
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {
      this.defaultPrevented = true;
    }
  }, {
    key: "target",
    get: function get() {
      var _a, _b, _c, _d, _e;
      var cacheTarget = this.cacheTarget;
      if (!cacheTarget) {
        var target = Object.create(((_a = this.mpEvent) === null || _a === void 0 ? void 0 : _a.target) || null);
        var currentEle = _env_js__WEBPACK_IMPORTED_MODULE_2__["default"].document.getElementById(((_b = target.dataset) === null || _b === void 0 ? void 0 : _b.sid) || target.id || null);
        // Note：优先判断冒泡场景alipay的targetDataset的sid, 不然冒泡场景target属性吐出不对，其余拿取当前绑定id
        var element = _env_js__WEBPACK_IMPORTED_MODULE_2__["default"].document.getElementById(((_c = target.targetDataset) === null || _c === void 0 ? void 0 : _c.sid) || ((_d = target.dataset) === null || _d === void 0 ? void 0 : _d.sid) || target.id || null);
        target.dataset = Object.assign(Object.assign({}, currentEle !== null ? currentEle.dataset : _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.EMPTY_OBJ), element !== null ? element.dataset : _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.EMPTY_OBJ);
        for (var key in (_e = this.mpEvent) === null || _e === void 0 ? void 0 : _e.detail) {
          target[key] = this.mpEvent.detail[key];
        }
        this.cacheTarget = target;
        return target;
      } else {
        return cacheTarget;
      }
    }
  }, {
    key: "currentTarget",
    get: function get() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      var cacheCurrentTarget = this.cacheCurrentTarget;
      if (!cacheCurrentTarget) {
        var doc = _env_js__WEBPACK_IMPORTED_MODULE_2__["default"].document;
        var currentTarget = Object.create(((_a = this.mpEvent) === null || _a === void 0 ? void 0 : _a.currentTarget) || null);
        var element = doc.getElementById(((_b = currentTarget.dataset) === null || _b === void 0 ? void 0 : _b.sid) || currentTarget.id || null);
        var targetElement = doc.getElementById(((_e = (_d = (_c = this.mpEvent) === null || _c === void 0 ? void 0 : _c.target) === null || _d === void 0 ? void 0 : _d.dataset) === null || _e === void 0 ? void 0 : _e.sid) || ((_g = (_f = this.mpEvent) === null || _f === void 0 ? void 0 : _f.target) === null || _g === void 0 ? void 0 : _g.id) || null);
        if (element === null || element && element === targetElement) {
          this.cacheCurrentTarget = this.target;
          return this.target;
        }
        currentTarget.dataset = element.dataset;
        for (var key in (_h = this.mpEvent) === null || _h === void 0 ? void 0 : _h.detail) {
          currentTarget[key] = this.mpEvent.detail[key];
        }
        this.cacheCurrentTarget = currentTarget;
        return currentTarget;
      } else {
        return cacheCurrentTarget;
      }
    }
  }]);
}();
function createEvent(event, node) {
  if (typeof event === 'string') {
    // For Vue3 using document.createEvent
    return new TaroEvent(event, {
      bubbles: true,
      cancelable: true
    });
  }
  var domEv = new TaroEvent(event.type, {
    bubbles: true,
    cancelable: true
  }, event);
  for (var key in event) {
    if (key === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.CURRENT_TARGET || key === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.TARGET || key === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.TYPE || key === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.TIME_STAMP) {
      continue;
    } else {
      domEv[key] = event[key];
    }
  }
  if (domEv.type === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.CONFIRM && (node === null || node === void 0 ? void 0 : node.nodeName) === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.INPUT) {
    // eslint-disable-next-line dot-notation
    domEv[_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.KEY_CODE] = 13;
  }
  return domEv;
}
var eventsBatch = {};
function getEventCBResult(event) {
  var result = event[_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.EVENT_CALLBACK_RESULT];
  if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_5__.isUndefined)(result)) {
    delete event[_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.EVENT_CALLBACK_RESULT];
  }
  return result;
}
// 小程序的事件代理回调函数
function eventHandler(event) {
  var _a, _b;
  // Note: ohos 上事件没有设置 type、detail 类型 setter 方法，且部分事件（例如 load 等）缺失 target 导致事件错误
  event.type === undefined && Object.defineProperty(event, 'type', {
    value: event._type // ohos only
  });
  event.detail === undefined && Object.defineProperty(event, 'detail', {
    value: event._detail || Object.assign({}, event) // ohos only
  });
  event.currentTarget = event.currentTarget || event.target || Object.assign({}, event);
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('modifyMpEventImpl', event);
  var currentTarget = event.currentTarget;
  var id = ((_a = currentTarget.dataset) === null || _a === void 0 ? void 0 : _a.sid /** sid */) || currentTarget.id /** uid */ || ((_b = event.detail) === null || _b === void 0 ? void 0 : _b.id) || '';
  var node = _env_js__WEBPACK_IMPORTED_MODULE_2__["default"].document.getElementById(id);
  if (node) {
    var dispatch = function dispatch() {
      var e = createEvent(event, node);
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('modifyTaroEvent', e, node);
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('dispatchTaroEvent', e, node);
      _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('dispatchTaroEventFinish', e, node);
    };
    if (_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.isExist('batchedEventUpdates')) {
      var type = event.type;
      if (!_tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('isBubbleEvents', type) || !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_7__.isParentBinded)(node, type) || type === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.TOUCHMOVE && !!node.props.catchMove) {
        // 最上层组件统一 batchUpdate
        _tarojs_shared__WEBPACK_IMPORTED_MODULE_6__.hooks.call('batchedEventUpdates', function () {
          if (eventsBatch[type]) {
            eventsBatch[type].forEach(function (fn) {
              return fn();
            });
            delete eventsBatch[type];
          }
          dispatch();
        });
        return getEventCBResult(event);
      } else {
        // 如果上层组件也有绑定同类型的组件，委托给上层组件调用事件回调
        (eventsBatch[type] || (eventsBatch[type] = [])).push(dispatch);
      }
    } else {
      dispatch();
      return getEventCBResult(event);
    }
  }
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/form.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/form.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormElement: function() { return /* binding */ FormElement; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropGet.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/superPropGet.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js");







var FormElement = /*#__PURE__*/function (_TaroElement) {
  function FormElement() {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, FormElement);
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, FormElement, arguments);
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__["default"])(FormElement, _TaroElement);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__["default"])(FormElement, [{
    key: "type",
    get: function get() {
      var _a;
      return (_a = this.props[_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.TYPE]) !== null && _a !== void 0 ? _a : '';
    },
    set: function set(val) {
      this.setAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.TYPE, val);
    }
  }, {
    key: "value",
    get: function get() {
      // eslint-disable-next-line dot-notation
      var val = this.props[_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.VALUE];
      return val == null ? '' : val;
    },
    set: function set(val) {
      this.setAttribute(_constants_index_js__WEBPACK_IMPORTED_MODULE_4__.VALUE, val);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      if (event.mpEvent) {
        var val = event.mpEvent.detail.value;
        if (event.type === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.CHANGE) {
          this.props.value = val;
        } else if (event.type === _constants_index_js__WEBPACK_IMPORTED_MODULE_4__.INPUT) {
          // Web 规范中表单组件的 value 应该跟着输入改变
          // 只是改 this.props.value 的话不会进行 setData，因此这里修改 this.value。
          // 只测试了 React、Vue3 input 组件的 onInput 事件，onChange 事件不确定有没有副作用，所以暂不修改。
          this.value = val;
        }
      }
      return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_superPropGet_js__WEBPACK_IMPORTED_MODULE_5__["default"])(FormElement, "dispatchEvent", this, 3)([event]);
    }
  }]);
}(_element_js__WEBPACK_IMPORTED_MODULE_6__.TaroElement);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/node.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/node.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroNode: function() { return /* binding */ TaroNode; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../dom-external/mutation-observer/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/index.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");
/* harmony import */ var _hydrate_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hydrate.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/hydrate.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");
/* harmony import */ var _event_source_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./event-source.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-source.js");
/* harmony import */ var _event_target_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./event-target.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-target.js");












var CHILDNODES = "cn" /* Shortcuts.Childnodes */;
var nodeId = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.incrementId)();
var TaroNode = /*#__PURE__*/function (_TaroEventTarget) {
  function TaroNode() {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroNode);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this, TaroNode);
    _this.parentNode = null;
    _this.childNodes = [];
    _this.hydrate = function (node) {
      return function () {
        return (0,_hydrate_js__WEBPACK_IMPORTED_MODULE_3__.hydrate)(node);
      };
    };
    _this.uid = '_' + nodeId(); // dom 节点 id，开发者可修改
    _this.sid = _this.uid; // dom 节点全局唯一 id，不可被修改
    _event_source_js__WEBPACK_IMPORTED_MODULE_4__.eventSource.set(_this.sid, _this);
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__["default"])(TaroNode, _TaroEventTarget);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__["default"])(TaroNode, [{
    key: "updateChildNodes",
    value: function updateChildNodes(isClean) {
      var _this2 = this;
      var cleanChildNodes = function cleanChildNodes() {
        return [];
      };
      var rerenderChildNodes = function rerenderChildNodes() {
        var childNodes = _this2.childNodes.filter(function (node) {
          return !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.isComment)(node);
        });
        return childNodes.map(_hydrate_js__WEBPACK_IMPORTED_MODULE_3__.hydrate);
      };
      this.enqueueUpdate({
        path: "".concat(this._path, ".").concat(CHILDNODES),
        value: isClean ? cleanChildNodes : rerenderChildNodes
      });
    }
  }, {
    key: "updateSingleChild",
    value: function updateSingleChild(index) {
      var _this3 = this;
      this.childNodes.forEach(function (child, childIndex) {
        if ((0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.isComment)(child)) return;
        if (index && childIndex < index) return;
        _this3.enqueueUpdate({
          path: child._path,
          value: _this3.hydrate(child)
        });
      });
    }
  }, {
    key: "_root",
    get: function get() {
      var _a;
      return ((_a = this.parentNode) === null || _a === void 0 ? void 0 : _a._root) || null;
    }
  }, {
    key: "findIndex",
    value: function findIndex(refChild) {
      var index = this.childNodes.indexOf(refChild);
      (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.ensure)(index !== -1, 'The node to be replaced is not a child of this node.');
      return index;
    }
  }, {
    key: "_path",
    get: function get() {
      var parentNode = this.parentNode;
      if (parentNode) {
        // 计算路径时，先过滤掉 comment 节点
        var list = parentNode.childNodes.filter(function (node) {
          return !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.isComment)(node);
        });
        var indexOfNode = list.indexOf(this);
        var index = _tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.hooks.call('getPathIndex', indexOfNode);
        return "".concat(parentNode._path, ".").concat(CHILDNODES, ".").concat(index);
      }
      return '';
    }
  }, {
    key: "nextSibling",
    get: function get() {
      var parentNode = this.parentNode;
      return (parentNode === null || parentNode === void 0 ? void 0 : parentNode.childNodes[parentNode.findIndex(this) + 1]) || null;
    }
  }, {
    key: "previousSibling",
    get: function get() {
      var parentNode = this.parentNode;
      return (parentNode === null || parentNode === void 0 ? void 0 : parentNode.childNodes[parentNode.findIndex(this) - 1]) || null;
    }
  }, {
    key: "parentElement",
    get: function get() {
      var parentNode = this.parentNode;
      if ((parentNode === null || parentNode === void 0 ? void 0 : parentNode.nodeType) === 1 /* NodeType.ELEMENT_NODE */) {
        return parentNode;
      }
      return null;
    }
  }, {
    key: "firstChild",
    get: function get() {
      return this.childNodes[0] || null;
    }
  }, {
    key: "lastChild",
    get: function get() {
      var childNodes = this.childNodes;
      return childNodes[childNodes.length - 1] || null;
    }
    /**
     * @textContent 目前只能置空子元素
     * @TODO 等待完整 innerHTML 实现
     */
    // eslint-disable-next-line accessor-pairs
  }, {
    key: "textContent",
    set: function set(text) {
      var removedNodes = this.childNodes.slice();
      var addedNodes = [];
      // Handle old children' data structure & ref
      while (this.firstChild) {
        this.removeChild(this.firstChild, {
          doUpdate: false
        });
      }
      if (text === '') {
        this.updateChildNodes(true);
      } else {
        var newText = _env_js__WEBPACK_IMPORTED_MODULE_9__["default"].document.createTextNode(text);
        addedNodes.push(newText);
        this.appendChild(newText);
        this.updateChildNodes();
      }
      // @Todo: appendChild 会多触发一次
      _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_10__.MutationObserver.record({
        type: "childList" /* MutationRecordType.CHILD_LIST */,
        target: this,
        removedNodes: removedNodes,
        addedNodes: addedNodes
      });
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
     * @scenario
     * [A,B,C]
     *   1. insert D before C, D has no parent
     *   2. insert D before C, D has the same parent of C
     *   3. insert D before C, D has the different parent of C
     */
  }, {
    key: "insertBefore",
    value: function insertBefore(newChild, refChild, isReplace) {
      var _this4 = this;
      if (newChild.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_11__.DOCUMENT_FRAGMENT) {
        newChild.childNodes.reduceRight(function (previousValue, currentValue) {
          _this4.insertBefore(currentValue, previousValue);
          return currentValue;
        }, refChild);
        return newChild;
      }
      // Parent release newChild
      //   - cleanRef: false (No need to clean eventSource, because newChild is about to be inserted)
      //   - update: true (Need to update parent.childNodes, because parent.childNodes is reordered)
      newChild.remove({
        cleanRef: false
      });
      var index = 0;
      // Data structure
      newChild.parentNode = this;
      if (refChild) {
        // insertBefore & replaceChild
        index = this.findIndex(refChild);
        this.childNodes.splice(index, 0, newChild);
      } else {
        // appendChild
        this.childNodes.push(newChild);
      }
      var childNodesLength = this.childNodes.length;
      // Serialization
      if (this._root) {
        if (!refChild) {
          // appendChild
          var isOnlyChild = childNodesLength === 1;
          if (isOnlyChild) {
            this.updateChildNodes();
          } else {
            this.enqueueUpdate({
              path: newChild._path,
              value: this.hydrate(newChild)
            });
          }
        } else if (isReplace) {
          // replaceChild
          this.enqueueUpdate({
            path: newChild._path,
            value: this.hydrate(newChild)
          });
        } else {
          // insertBefore 有两种更新模式
          // 比方说有 A B C 三个节点，现在要在 C 前插入 D
          // 1. 插入 D，然后更新整个父节点的 childNodes 数组
          // setData({ cn: [A, B, D, C] })
          // 2. 插入 D，然后更新 D 以及 D 之后每个节点的数据
          // setData ({
          //   cn.[2]: D,
          //   cn.[3]: C,
          // })
          // 由于微信解析 ’cn.[2]‘ 这些路径的时候也需要消耗时间，
          // 所以根据 insertBefore 插入的位置来做不同的处理
          var mark = childNodesLength * 2 / 3;
          if (mark > index) {
            // 如果 insertBefore 的位置在 childNodes 的 2/3 前，则为了避免解析路径消耗过多的时间，采用第一种方式
            this.updateChildNodes();
          } else {
            // 如果 insertBefore 的位置在 childNodes 的 2/3 之后，则采用第二种方式，避免 childNodes 的全量更新
            this.updateSingleChild(index);
          }
        }
      }
      _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_10__.MutationObserver.record({
        type: "childList" /* MutationRecordType.CHILD_LIST */,
        target: this,
        addedNodes: [newChild],
        removedNodes: isReplace ? [refChild] /** replaceChild */ : [],
        nextSibling: isReplace ? refChild.nextSibling /** replaceChild */ : refChild || null,
        /** insertBefore & appendChild */
        previousSibling: newChild.previousSibling
      });
      return newChild;
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild
     * @scenario
     * [A,B,C]
     *   1. append C, C has no parent
     *   2. append C, C has the same parent of B
     *   3. append C, C has the different parent of B
     */
  }, {
    key: "appendChild",
    value: function appendChild(newChild) {
      return this.insertBefore(newChild);
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/replaceChild
     * @scenario
     * [A,B,C]
     *   1. replace B with C, C has no parent
     *   2. replace B with C, C has no parent, C has the same parent of B
     *   3. replace B with C, C has no parent, C has the different parent of B
     */
  }, {
    key: "replaceChild",
    value: function replaceChild(newChild, oldChild) {
      if (oldChild.parentNode !== this) return;
      // Insert the newChild
      this.insertBefore(newChild, oldChild, true);
      // Destroy the oldChild
      //   - cleanRef: true (Need to clean eventSource, because the oldChild was detached from the DOM tree)
      //   - update: false (No need to update parent.childNodes, because replace will not cause the parent.childNodes being reordered)
      oldChild.remove({
        doUpdate: false
      });
      return oldChild;
    }
    /**
     * @doc https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild
     * @scenario
     * [A,B,C]
     *   1. remove A or B
     *   2. remove C
     */
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cleanRef = options.cleanRef,
        doUpdate = options.doUpdate;
      if (cleanRef !== false && doUpdate !== false) {
        // appendChild/replaceChild/insertBefore 不应该触发
        // @Todo: 但其实如果 newChild 的父节点是另一颗子树的节点，应该是要触发的
        _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_10__.MutationObserver.record({
          type: "childList" /* MutationRecordType.CHILD_LIST */,
          target: this,
          removedNodes: [child],
          nextSibling: child.nextSibling,
          previousSibling: child.previousSibling
        });
      }
      // Data Structure
      var index = this.findIndex(child);
      this.childNodes.splice(index, 1);
      child.parentNode = null;
      // Set eventSource
      if (cleanRef !== false) {
        _event_source_js__WEBPACK_IMPORTED_MODULE_4__.eventSource.removeNodeTree(child);
      }
      // Serialization
      if (this._root && doUpdate !== false) {
        this.updateChildNodes();
      }
      return child;
    }
  }, {
    key: "remove",
    value: function remove(options) {
      var _a;
      (_a = this.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(this, options);
    }
  }, {
    key: "hasChildNodes",
    value: function hasChildNodes() {
      return this.childNodes.length > 0;
    }
  }, {
    key: "enqueueUpdate",
    value: function enqueueUpdate(payload) {
      var _a;
      (_a = this._root) === null || _a === void 0 ? void 0 : _a.enqueueUpdate(payload);
    }
  }, {
    key: "ownerDocument",
    get: function get() {
      return _env_js__WEBPACK_IMPORTED_MODULE_9__["default"].document;
    }
  }], [{
    key: "extend",
    value: function extend(methodName, options) {
      (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.extend)(TaroNode, methodName, options);
    }
  }]);
}(_event_target_js__WEBPACK_IMPORTED_MODULE_12__.TaroEventTarget);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/root.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/root.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroRootElement: function() { return /* binding */ TaroRootElement; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../options.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/options.js");
/* harmony import */ var _perf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../perf.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/perf.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");
/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js");











function findCustomWrapper(root, dataPathArr) {
  // ['root', 'cn', '[0]'] remove 'root' => ['cn', '[0]']
  var list = dataPathArr.slice(1);
  var currentData = root;
  var customWrapper;
  var splitedPath = '';
  list.some(function (item, i) {
    var key = item
    // '[0]' => '0'
    .replace(/^\[(.+)\]$/, '$1')
    // 'cn' => 'childNodes'
    .replace(/\bcn\b/g, 'childNodes');
    currentData = currentData[key];
    if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isArray)(currentData)) {
      currentData = currentData.filter(function (el) {
        return !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_1__.isComment)(el);
      });
    }
    if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(currentData)) return true;
    if (currentData.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_2__.CUSTOM_WRAPPER) {
      var res = _utils_index_js__WEBPACK_IMPORTED_MODULE_1__.customWrapperCache.get(currentData.sid);
      if (res) {
        customWrapper = res;
        splitedPath = dataPathArr.slice(i + 2).join('.');
      }
    }
  });
  if (customWrapper) {
    return {
      customWrapper: customWrapper,
      splitedPath: splitedPath
    };
  }
}
var TaroRootElement = /*#__PURE__*/function (_TaroElement) {
  function TaroRootElement() {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_3__["default"])(this, TaroRootElement);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this, TaroRootElement);
    _this.updatePayloads = [];
    _this.updateCallbacks = [];
    _this.pendingUpdate = false;
    _this.ctx = null;
    _this.nodeName = _constants_index_js__WEBPACK_IMPORTED_MODULE_2__.ROOT_STR;
    _this.tagName = _constants_index_js__WEBPACK_IMPORTED_MODULE_2__.ROOT_STR.toUpperCase();
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_5__["default"])(TaroRootElement, _TaroElement);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_6__["default"])(TaroRootElement, [{
    key: "_path",
    get: function get() {
      return _constants_index_js__WEBPACK_IMPORTED_MODULE_2__.ROOT_STR;
    }
  }, {
    key: "_root",
    get: function get() {
      return this;
    }
  }, {
    key: "scheduleTask",
    value: function scheduleTask(fn) {
      // 这里若使用微任务可略微提前setData的执行时机，但在部分场景下可能会出现连续setData两次，造成更大的性能问题
      setTimeout(fn);
    }
  }, {
    key: "enqueueUpdate",
    value: function enqueueUpdate(payload) {
      this.updatePayloads.push(payload);
      if (!this.pendingUpdate && this.ctx) {
        this.performUpdate();
      }
    }
  }, {
    key: "performUpdate",
    value: function performUpdate() {
      var _this2 = this;
      var initRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var prerender = arguments.length > 1 ? arguments[1] : undefined;
      this.pendingUpdate = true;
      var ctx = _tarojs_shared__WEBPACK_IMPORTED_MODULE_7__.hooks.call('proxyToRaw', this.ctx);
      this.scheduleTask(function () {
        var setDataMark = "".concat(_constants_index_js__WEBPACK_IMPORTED_MODULE_2__.SET_DATA, " \u5F00\u59CB\u65F6\u95F4\u6233 ").concat(Date.now());
        _perf_js__WEBPACK_IMPORTED_MODULE_8__.perf.start(setDataMark);
        var data = Object.create(null);
        var resetPaths = new Set(initRender ? ['root.cn.[0]', 'root.cn[0]'] : []);
        while (_this2.updatePayloads.length > 0) {
          var _this2$updatePayloads = _this2.updatePayloads.shift(),
            path = _this2$updatePayloads.path,
            value = _this2$updatePayloads.value;
          if (path.endsWith("cn" /* Shortcuts.Childnodes */)) {
            resetPaths.add(path);
          }
          data[path] = value;
        }
        var _loop = function _loop(_path) {
          resetPaths.forEach(function (p) {
            // 已经重置了数组，就不需要分别再设置了
            if (_path.includes(p) && _path !== p) {
              delete data[_path];
            }
          });
          var value = data[_path];
          if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(value)) {
            data[_path] = value();
          }
        };
        for (var _path in data) {
          _loop(_path);
        }
        // 预渲染
        if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.isFunction)(prerender)) return prerender(data);
        // 正常渲染
        _this2.pendingUpdate = false;
        var normalUpdate = {};
        var customWrapperMap = new Map();
        if (initRender) {
          // 初次渲染，使用页面级别的 setData
          normalUpdate = data;
        } else {
          // 更新渲染，区分 CustomWrapper 与页面级别的 setData
          for (var p in data) {
            var dataPathArr = p.split('.');
            var found = findCustomWrapper(_this2, dataPathArr);
            if (found) {
              // 此项数据使用 CustomWrapper 去更新
              var customWrapper = found.customWrapper,
                splitedPath = found.splitedPath;
              // 合并同一个 customWrapper 的相关更新到一次 setData 中
              customWrapperMap.set(customWrapper, Object.assign(Object.assign({}, customWrapperMap.get(customWrapper) || {}), (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_9__["default"])({}, "i.".concat(splitedPath), data[p])));
            } else {
              // 此项数据使用页面去更新
              normalUpdate[p] = data[p];
            }
          }
        }
        var customWrapperCount = customWrapperMap.size;
        var isNeedNormalUpdate = Object.keys(normalUpdate).length > 0;
        var updateArrLen = customWrapperCount + (isNeedNormalUpdate ? 1 : 0);
        var executeTime = 0;
        var cb = function cb() {
          if (++executeTime === updateArrLen) {
            _perf_js__WEBPACK_IMPORTED_MODULE_8__.perf.stop(setDataMark);
            _this2.flushUpdateCallback();
            initRender && _perf_js__WEBPACK_IMPORTED_MODULE_8__.perf.stop(_constants_index_js__WEBPACK_IMPORTED_MODULE_2__.PAGE_INIT);
          }
        };
        // custom-wrapper setData
        if (customWrapperCount) {
          customWrapperMap.forEach(function (data, ctx) {
            if ( true && _options_js__WEBPACK_IMPORTED_MODULE_10__.options.debug) {
              // eslint-disable-next-line no-console
              console.log('custom wrapper setData: ', data);
            }
            ctx.setData(data, cb);
          });
        }
        // page setData
        if (isNeedNormalUpdate) {
          if ( true && _options_js__WEBPACK_IMPORTED_MODULE_10__.options.debug) {
            // eslint-disable-next-line no-console
            console.log('page setData:', normalUpdate);
          }
          ctx.setData(normalUpdate, cb);
        }
      });
    }
  }, {
    key: "enqueueUpdateCallback",
    value: function enqueueUpdateCallback(cb, ctx) {
      this.updateCallbacks.push(function () {
        ctx ? cb.call(ctx) : cb();
      });
    }
  }, {
    key: "flushUpdateCallback",
    value: function flushUpdateCallback() {
      var updateCallbacks = this.updateCallbacks;
      if (!updateCallbacks.length) return;
      var copies = updateCallbacks.slice(0);
      this.updateCallbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }
  }]);
}(_element_js__WEBPACK_IMPORTED_MODULE_11__.TaroElement);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/style.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/style.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Style: function() { return /* binding */ Style; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toArray_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toArray.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-external/mutation-observer/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/index.js");
/* harmony import */ var _style_properties_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style_properties.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/style_properties.js");







function recordCss(obj) {
  _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_0__.MutationObserver.record({
    type: "attributes" /* MutationRecordType.ATTRIBUTES */,
    target: obj._element,
    attributeName: 'style',
    oldValue: obj.cssText
  });
}
function enqueueUpdate(obj) {
  var element = obj._element;
  if (element._root) {
    element.enqueueUpdate({
      path: "".concat(element._path, ".", "st" /* Shortcuts.Style */),
      value: obj.cssText
    });
  }
}
function setStyle(newVal, styleKey) {
   true && (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.warn)((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(newVal) && newVal.length > _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.PROPERTY_THRESHOLD, "Style \u5C5E\u6027 ".concat(styleKey, " \u7684\u503C\u6570\u636E\u91CF\u8FC7\u5927\uFF0C\u53EF\u80FD\u4F1A\u5F71\u54CD\u6E32\u67D3\u6027\u80FD\uFF0C\u8003\u8651\u4F7F\u7528 CSS \u7C7B\u6216\u5176\u5B83\u65B9\u6848\u66FF\u4EE3\u3002"));
  var old = this[styleKey];
  if (old === newVal) return;
  !this._pending && recordCss(this);
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isNull)(newVal) || (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(newVal) || newVal === '') {
    this._usedStyleProp.delete(styleKey);
    delete this._value[styleKey];
  } else {
    this._usedStyleProp.add(styleKey);
    this._value[styleKey] = newVal;
  }
  !this._pending && enqueueUpdate(this);
}
function initStyle(ctor, styleProperties) {
  var properties = {};
  var _loop = function _loop() {
      var styleKey = styleProperties[i];
      if (ctor[styleKey]) return {
        v: void 0
      };
      properties[styleKey] = {
        get: function get() {
          var val = this._value[styleKey];
          return (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isNull)(val) || (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(val) ? '' : val;
        },
        set: function set(newVal) {
          setStyle.call(this, newVal, styleKey);
        }
      };
    },
    _ret;
  for (var i = 0; i < styleProperties.length; i++) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
  Object.defineProperties(ctor.prototype, properties);
}
function isCssVariable(propertyName) {
  return /^--/.test(propertyName);
}
var Style = /*#__PURE__*/function () {
  function Style(element) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this, Style);
    this._element = element;
    this._usedStyleProp = new Set();
    this._value = {};
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_5__["default"])(Style, [{
    key: "setCssVariables",
    value: function setCssVariables(styleKey) {
      var _this = this;
      this.hasOwnProperty(styleKey) || Object.defineProperty(this, styleKey, {
        enumerable: true,
        configurable: true,
        get: function get() {
          return _this._value[styleKey] || '';
        },
        set: function set(newVal) {
          setStyle.call(_this, newVal, styleKey);
        }
      });
    }
  }, {
    key: "cssText",
    get: function get() {
      var _this2 = this;
      if (!this._usedStyleProp.size) return '';
      var texts = [];
      this._usedStyleProp.forEach(function (key) {
        var val = _this2[key];
        if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isNull)(val) || (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(val)) return;
        var styleName = isCssVariable(key) ? key : (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.toDashed)(key);
        if (styleName.indexOf('webkit') === 0 || styleName.indexOf('Webkit') === 0) {
          styleName = "-".concat(styleName);
        }
        texts.push("".concat(styleName, ": ").concat(val, ";"));
      });
      return texts.join(' ');
    },
    set: function set(str) {
      var _this3 = this;
      this._pending = true;
      recordCss(this);
      this._usedStyleProp.forEach(function (prop) {
        _this3.removeProperty(prop);
      });
      if (str === '' || (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(str) || (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isNull)(str)) {
        this._pending = false;
        enqueueUpdate(this);
        return;
      }
      var rules = str.split(';');
      for (var i = 0; i < rules.length; i++) {
        var rule = rules[i].trim();
        if (rule === '') {
          continue;
        }
        // 可能存在 'background: url(http:x/y/z)' 的情况
        var _rule$split = rule.split(':'),
          _rule$split2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toArray_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_rule$split),
          propName = _rule$split2[0],
          valList = _rule$split2.slice(1);
        var val = valList.join(':');
        if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(val)) {
          continue;
        }
        this.setProperty(propName.trim(), val.trim());
      }
      this._pending = false;
      enqueueUpdate(this);
    }
  }, {
    key: "setProperty",
    value: function setProperty(propertyName, value) {
      if (propertyName[0] === '-') {
        // 支持 webkit 属性或 css 变量
        this.setCssVariables(propertyName);
      } else {
        propertyName = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.toCamelCase)(propertyName);
      }
      if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isNull)(value) || (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(value)) {
        this.removeProperty(propertyName);
      } else {
        this[propertyName] = value;
      }
    }
  }, {
    key: "removeProperty",
    value: function removeProperty(propertyName) {
      propertyName = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.toCamelCase)(propertyName);
      if (!this._usedStyleProp.has(propertyName)) {
        return '';
      }
      var value = this[propertyName];
      this[propertyName] = undefined;
      return value;
    }
  }, {
    key: "getPropertyValue",
    value: function getPropertyValue(propertyName) {
      propertyName = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.toCamelCase)(propertyName);
      var value = this[propertyName];
      if (!value) {
        return '';
      }
      return value;
    }
  }]);
}();
initStyle(Style, _style_properties_js__WEBPACK_IMPORTED_MODULE_7__.styleProperties);
_tarojs_shared__WEBPACK_IMPORTED_MODULE_8__.hooks.tap('injectNewStyleProperties', function (newStyleProperties) {
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(newStyleProperties)) {
    initStyle(Style, newStyleProperties);
  } else {
    if (typeof newStyleProperties !== 'string') return;
    initStyle(Style, [newStyleProperties]);
  }
});


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/style_properties.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/style_properties.js ***!
  \************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   styleProperties: function() { return /* binding */ styleProperties; }
/* harmony export */ });
/*
 *
 * https://www.w3.org/Style/CSS/all-properties.en.html
 */
var WEBKIT = 'webkit';
var styleProperties = ['all', 'appearance', 'blockOverflow', 'blockSize', 'bottom', 'clear', 'contain', 'content', 'continue', 'cursor', 'direction', 'display', 'filter', 'float', 'gap', 'height', 'inset', 'isolation', 'left', 'letterSpacing', 'lightingColor', 'markerSide', 'mixBlendMode', 'opacity', 'order', 'position', 'quotes', 'resize', 'right', 'rowGap', 'tabSize', 'tableLayout', 'top', 'userSelect', 'verticalAlign', 'visibility', 'voiceFamily', 'volume', 'whiteSpace', 'widows', 'width', 'zIndex', 'pointerEvents', 'aspectRatio'
/** 非常用 style */
// 'azimuth',
// 'backfaceVisibility',
// 'baselineShift',
// 'captionSide',
// 'chains',
// 'dominantBaseline',
// 'elevation',
// 'emptyCells',
// 'forcedColorAdjust',
// 'glyphOrientationVertical',
// 'hangingPunctuation',
// 'hyphenateCharacter',
// 'hyphens',
// 'imageOrientation',
// 'imageResolution',
// 'orphans',
// 'playDuring',
// 'pointerEvents',
// 'regionFragment',
// 'richness',
// 'running',
// 'scrollBehavior',
// 'speechRate',
// 'stress',
// 'stringSet',
// 'unicodeBidi',
// 'willChange',
// 'writingMode',
];
// 减少文件体积
function combine(prefix, list, excludeSelf) {
  !excludeSelf && styleProperties.push(prefix);
  list.forEach(function (item) {
    styleProperties.push(prefix + item);
    if (prefix === WEBKIT) {
      styleProperties.push('Webkit' + item);
    }
  });
}
var color = 'Color';
var style = 'Style';
var width = 'Width';
var image = 'Image';
var size = 'Size';
var color_style_width = [color, style, width];
var fitlength_fitwidth_image = ['FitLength', 'FitWidth', image];
var fitlength_fitwidth_image_radius = [].concat(fitlength_fitwidth_image, ['Radius']);
var color_style_width_fitlength_fitwidth_image = [].concat(color_style_width, fitlength_fitwidth_image);
var endRadius_startRadius = ['EndRadius', 'StartRadius'];
var bottom_left_right_top = ['Bottom', 'Left', 'Right', 'Top'];
var end_start = ['End', 'Start'];
var content_items_self = ['Content', 'Items', 'Self'];
var blockSize_height_inlineSize_width = ['BlockSize', 'Height', 'InlineSize', width];
var after_before = ['After', 'Before'];
combine('borderBlock', color_style_width);
combine('borderBlockEnd', color_style_width);
combine('borderBlockStart', color_style_width);
combine('outline', [].concat(color_style_width, ['Offset']));
combine('border', [].concat(color_style_width, ['Boundary', 'Break', 'Collapse', 'Radius', 'Spacing']));
combine('borderFit', ['Length', width]);
combine('borderInline', color_style_width);
combine('borderInlineEnd', color_style_width);
combine('borderInlineStart', color_style_width);
combine('borderLeft', color_style_width_fitlength_fitwidth_image);
combine('borderRight', color_style_width_fitlength_fitwidth_image);
combine('borderTop', color_style_width_fitlength_fitwidth_image);
combine('borderBottom', color_style_width_fitlength_fitwidth_image);
combine('textDecoration', [color, style, 'Line']);
combine('textEmphasis', [color, style, 'Position']);
combine('scrollMargin', bottom_left_right_top);
combine('scrollPadding', bottom_left_right_top);
combine('padding', bottom_left_right_top);
combine('margin', [].concat(bottom_left_right_top, ['Trim']));
combine('scrollMarginBlock', end_start);
combine('scrollMarginInline', end_start);
combine('scrollPaddingBlock', end_start);
combine('scrollPaddingInline', end_start);
combine('gridColumn', end_start);
combine('gridRow', end_start);
combine('insetBlock', end_start);
combine('insetInline', end_start);
combine('marginBlock', end_start);
combine('marginInline', end_start);
combine('paddingBlock', end_start);
combine('paddingInline', end_start);
combine('pause', after_before);
combine('cue', after_before);
combine('mask', ['Clip', 'Composite', image, 'Mode', 'Origin', 'Position', 'Repeat', size, 'Type']);
combine('borderImage', ['Outset', 'Repeat', 'Slice', 'Source', 'Transform', width]);
combine('maskBorder', ['Mode', 'Outset', 'Repeat', 'Slice', 'Source', width]);
combine('font', ['Family', 'FeatureSettings', 'Kerning', 'LanguageOverride', 'MaxSize', 'MinSize', 'OpticalSizing', 'Palette', size, 'SizeAdjust', 'Stretch', style, 'Weight', 'VariationSettings']);
combine('transform', ['Box', 'Origin', style]);
combine('background', [color, image, 'Attachment', 'BlendMode', 'Clip', 'Origin', 'Position', 'Repeat', size]);
combine('listStyle', [image, 'Position', 'Type']);
combine('scrollSnap', ['Align', 'Stop', 'Type']);
combine('grid', ['Area', 'AutoColumns', 'AutoFlow', 'AutoRows']);
combine('gridTemplate', ['Areas', 'Columns', 'Rows']);
combine('overflow', ['Block', 'Inline', 'Wrap', 'X', 'Y']);
combine('transition', ['Delay', 'Duration', 'Property', 'TimingFunction']);
combine('color', ['Adjust', 'InterpolationFilters', 'Scheme']);
combine('textAlign', ['All', 'Last']);
combine('page', ['BreakAfter', 'BreakBefore', 'BreakInside']);
combine('animation', ['Delay', 'Direction', 'Duration', 'FillMode', 'IterationCount', 'Name', 'PlayState', 'TimingFunction']);
combine('flex', ['Basis', 'Direction', 'Flow', 'Grow', 'Shrink', 'Wrap']);
combine('offset', [].concat(after_before, end_start, ['Anchor', 'Distance', 'Path', 'Position', 'Rotate']));
combine('perspective', ['Origin']);
combine('clip', ['Path', 'Rule']);
combine('flow', ['From', 'Into']);
combine('align', ['Content', 'Items', 'Self'], true);
combine('alignment', ['Adjust', 'Baseline'], true);
combine('borderStart', endRadius_startRadius, true);
combine('borderEnd', endRadius_startRadius, true);
combine('borderCorner', ['Fit', image, 'ImageTransform'], true);
combine('borderTopLeft', fitlength_fitwidth_image_radius, true);
combine('borderTopRight', fitlength_fitwidth_image_radius, true);
combine('borderBottomLeft', fitlength_fitwidth_image_radius, true);
combine('borderBottomRight', fitlength_fitwidth_image_radius, true);
combine('column', ['s', 'Count', 'Fill', 'Gap', 'Rule', 'RuleColor', 'RuleStyle', 'RuleWidth', 'Span', width], true);
combine('break', [].concat(after_before, ['Inside']), true);
combine('wrap', [].concat(after_before, ['Flow', 'Inside', 'Through']), true);
combine('justify', content_items_self, true);
combine('place', content_items_self, true);
combine('max', [].concat(blockSize_height_inlineSize_width, ['Lines']), true);
combine('min', blockSize_height_inlineSize_width, true);
combine('line', ['Break', 'Clamp', 'Grid', 'Height', 'Padding', 'Snap'], true);
combine('inline', ['BoxAlign', size, 'Sizing'], true);
combine('text', ['CombineUpright', 'GroupAlign', 'Height', 'Indent', 'Justify', 'Orientation', 'Overflow', 'Shadow', 'SpaceCollapse', 'SpaceTrim', 'Spacing', 'Transform', 'UnderlinePosition', 'Wrap'], true);
combine('shape', ['ImageThreshold', 'Inside', 'Margin', 'Outside'], true);
combine('word', ['Break', 'Spacing', 'Wrap'], true);
combine('object', ['Fit', 'Position'], true);
combine('box', ['DecorationBreak', 'Shadow', 'Sizing', 'Snap'], true);
combine(WEBKIT, ['LineClamp', 'BoxOrient', 'TextFillColor', 'TextStroke', 'TextStrokeColor', 'TextStrokeWidth'], true);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/svg.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/svg.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SVGElement: function() { return /* binding */ SVGElement; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js");






// for Vue3
var SVGElement = /*#__PURE__*/function (_TaroElement) {
  function SVGElement() {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, SVGElement);
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, SVGElement, arguments);
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__["default"])(SVGElement, _TaroElement);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__["default"])(SVGElement);
}(_element_js__WEBPACK_IMPORTED_MODULE_4__.TaroElement);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/text.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/text.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaroText: function() { return /* binding */ TaroText; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-external/mutation-observer/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/index.js");
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/node.js");






var TaroText = /*#__PURE__*/function (_TaroNode) {
  function TaroText(value) {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroText);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroText);
    _this.nodeType = 3 /* NodeType.TEXT_NODE */;
    _this.nodeName = '#text';
    _this._value = value;
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__["default"])(TaroText, _TaroNode);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__["default"])(TaroText, [{
    key: "textContent",
    get: function get() {
      return this._value;
    },
    set: function set(text) {
      _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_4__.MutationObserver.record({
        target: this,
        type: "characterData" /* MutationRecordType.CHARACTER_DATA */,
        oldValue: this._value
      });
      this._value = text;
      this.enqueueUpdate({
        path: "".concat(this._path, ".", "v" /* Shortcuts.Text */),
        value: text
      });
    }
  }, {
    key: "nodeValue",
    get: function get() {
      return this._value;
    },
    set: function set(text) {
      this.textContent = text;
    }
  }, {
    key: "data",
    get: function get() {
      return this._value;
    },
    set: function set(text) {
      this.textContent = text;
    }
  }]);
}(_node_js__WEBPACK_IMPORTED_MODULE_5__.TaroNode);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/transfer.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/transfer.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TransferElement: function() { return /* binding */ TransferElement; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js");





var TransferElement = /*#__PURE__*/function (_TaroElement) {
  function TransferElement(dataName) {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TransferElement);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TransferElement);
    _this.dataName = dataName;
    _this.isTransferElement = true;
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_2__["default"])(TransferElement, _TaroElement);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_3__["default"])(TransferElement, [{
    key: "_path",
    get: function get() {
      return this.dataName;
    }
  }]);
}(_element_js__WEBPACK_IMPORTED_MODULE_4__.TaroElement);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/tree.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/tree.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   treeToArray: function() { return /* binding */ treeToArray; }
/* harmony export */ });
function returnTrue() {
  return true;
}
function treeToArray(root, predict) {
  var array = [];
  var filter = predict !== null && predict !== void 0 ? predict : returnTrue;
  var object = root;
  while (object) {
    if (object.nodeType === 1 /* NodeType.ELEMENT_NODE */ && filter(object)) {
      array.push(object);
    }
    object = following(object, root);
  }
  return array;
}
function following(el, root) {
  var firstChild = el.firstChild;
  var isElmentTypeValid = el.nodeType === 1 /* NodeType.ELEMENT_NODE */ || el.nodeType === 9 /* NodeType.DOCUMENT_NODE */;
  // 如果当前 el 不是 element 或 document 元素，则可以直接不递归他的子元素了
  if (firstChild && isElmentTypeValid) {
    return firstChild;
  }
  var current = el;
  do {
    if (current === root) {
      return null;
    }
    var nextSibling = current.nextSibling;
    if (nextSibling) {
      return nextSibling;
    }
    current = current.parentElement;
  } while (current);
  return null;
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createComponentConfig: function() { return /* binding */ createComponentConfig; },
/* harmony export */   createPageConfig: function() { return /* binding */ createPageConfig; },
/* harmony export */   createRecursiveComponentConfig: function() { return /* binding */ createRecursiveComponentConfig; },
/* harmony export */   getOnHideEventKey: function() { return /* binding */ getOnHideEventKey; },
/* harmony export */   getOnReadyEventKey: function() { return /* binding */ getOnReadyEventKey; },
/* harmony export */   getOnShowEventKey: function() { return /* binding */ getOnShowEventKey; },
/* harmony export */   getPageInstance: function() { return /* binding */ getPageInstance; },
/* harmony export */   getPath: function() { return /* binding */ getPath; },
/* harmony export */   injectPageInstance: function() { return /* binding */ injectPageInstance; },
/* harmony export */   removePageInstance: function() { return /* binding */ removePageInstance; },
/* harmony export */   safeExecute: function() { return /* binding */ safeExecute; },
/* harmony export */   stringify: function() { return /* binding */ stringify; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/components.js");
/* harmony import */ var _bom_raf_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../bom/raf.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/raf.js");
/* harmony import */ var _bom_window_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../bom/window.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/window.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _current_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../current.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js");
/* harmony import */ var _dom_event_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../dom/event.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event.js");
/* harmony import */ var _emitter_emitter_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../emitter/emitter.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/emitter/emitter.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");
/* harmony import */ var _perf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../perf.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/perf.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");
/* harmony import */ var _utils_router_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/router.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/router.js");















/* eslint-disable dot-notation */
var instances = new Map();
var pageId = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.incrementId)();
function injectPageInstance(inst, id) {
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('mergePageInstance', instances.get(id), inst);
  instances.set(id, inst);
}
function getPageInstance(id) {
  return instances.get(id);
}
function removePageInstance(id) {
  instances.delete(id);
}
function safeExecute(path, lifecycle) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  var instance = instances.get(path);
  if (instance == null) {
    return;
  }
  var func = _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('getLifecycle', instance, lifecycle);
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isArray)(func)) {
    var res = func.map(function (fn) {
      return fn.apply(instance, args);
    });
    return res[0];
  }
  if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(func)) {
    return;
  }
  return func.apply(instance, args);
}
function stringify(obj) {
  if (obj == null) {
    return '';
  }
  var path = Object.keys(obj).map(function (key) {
    return key + '=' + obj[key];
  }).join('&');
  return path === '' ? path : '?' + path;
}
function getPath(id, options) {
  var idx = id.indexOf('?');
  if (false) {} else {
    return "".concat(idx > -1 ? id.substring(0, idx) : id).concat(stringify(options));
  }
}
function getOnReadyEventKey(path) {
  return path + '.' + _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_READY;
}
function getOnShowEventKey(path) {
  return path + '.' + _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_SHOW;
}
function getOnHideEventKey(path) {
  return path + '.' + _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_HIDE;
}
function createPageConfig(component, pageName, data, pageConfig) {
  // 小程序 Page 构造器是一个傲娇小公主，不能把复杂的对象挂载到参数上
  var id = pageName !== null && pageName !== void 0 ? pageName : "taro_page_".concat(pageId());
  var _hooks$call$page = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('getMiniLifecycleImpl').page, 7),
    ONLOAD = _hooks$call$page[0],
    ONUNLOAD = _hooks$call$page[1],
    ONREADY = _hooks$call$page[2],
    ONSHOW = _hooks$call$page[3],
    ONHIDE = _hooks$call$page[4],
    LIFECYCLES = _hooks$call$page[5],
    SIDE_EFFECT_LIFECYCLES = _hooks$call$page[6];
  var pageElement = null;
  var unmounting = false;
  var prepareMountList = [];
  function setCurrentRouter(page) {
    var router =  false ? 0 : page.route || page.__route__ || page.$taroPath;
    _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.router = {
      params: page.$taroParams,
      path: (0,_utils_router_js__WEBPACK_IMPORTED_MODULE_6__.addLeadingSlash)(router),
      $taroPath: page.$taroPath,
      onReady: getOnReadyEventKey(id),
      onShow: getOnShowEventKey(id),
      onHide: getOnHideEventKey(id)
    };
    if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(page.exitState)) {
      _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.router.exitState = page.exitState;
    }
  }
  var loadResolver;
  var hasLoaded;
  var config = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])({}, ONLOAD, function () {
    var _this = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cb = arguments.length > 1 ? arguments[1] : undefined;
    hasLoaded = new Promise(function (resolve) {
      loadResolver = resolve;
    });
    _perf_js__WEBPACK_IMPORTED_MODULE_8__.perf.start(_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.PAGE_INIT);
    _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.page = this;
    this.config = pageConfig || {};
    // this.$taroPath 是页面唯一标识
    var uniqueOptions = Object.assign({}, options, {
      $taroTimestamp: Date.now()
    });
    var $taroPath = this.$taroPath = getPath(id, uniqueOptions);
    if (false) {}
    // this.$taroParams 作为暴露给开发者的页面参数对象，可以被随意修改
    if (this.$taroParams == null) {
      this.$taroParams = uniqueOptions;
    }
    setCurrentRouter(this);
    // 初始化当前页面的上下文信息
    if (true) {
      _bom_window_js__WEBPACK_IMPORTED_MODULE_9__.taroWindowProvider.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CONTEXT_ACTIONS.INIT, $taroPath);
    }
    var mount = function mount() {
      _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.app.mount(component, $taroPath, function () {
        pageElement = _env_js__WEBPACK_IMPORTED_MODULE_10__["default"].document.getElementById($taroPath);
        (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_11__.ensure)(pageElement !== null, '没有找到页面实例。');
        safeExecute($taroPath, _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_LOAD, _this.$taroParams);
        loadResolver();
        if (true) {
          pageElement.ctx = _this;
          pageElement.performUpdate(true, cb);
        } else {}
      });
    };
    if (unmounting) {
      prepareMountList.push(mount);
    } else {
      mount();
    }
  }), ONUNLOAD, function () {
    var $taroPath = this.$taroPath;
    // 销毁当前页面的上下文信息
    if (true) {
      _bom_window_js__WEBPACK_IMPORTED_MODULE_9__.taroWindowProvider.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CONTEXT_ACTIONS.DESTORY, $taroPath);
    }
    // 触发onUnload生命周期
    safeExecute($taroPath, ONUNLOAD);
    unmounting = true;
    _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.app.unmount($taroPath, function () {
      unmounting = false;
      instances.delete($taroPath);
      if (pageElement) {
        pageElement.ctx = null;
        pageElement = null;
      }
      if (prepareMountList.length) {
        prepareMountList.forEach(function (fn) {
          return fn();
        });
        prepareMountList = [];
      }
    });
  }), ONREADY, function () {
    var _this2 = this;
    hasLoaded.then(function () {
      // 触发生命周期
      safeExecute(_this2.$taroPath, _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_READY);
      // 通过事件触发子组件的生命周期
      (0,_bom_raf_js__WEBPACK_IMPORTED_MODULE_12__.raf)(function () {
        return _emitter_emitter_js__WEBPACK_IMPORTED_MODULE_13__.eventCenter.trigger(getOnReadyEventKey(id));
      });
      _this2.onReady.called = true;
    });
  }), ONSHOW, function () {
    var _this3 = this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    hasLoaded.then(function () {
      // 设置 Current 的 page 和 router
      _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.page = _this3;
      setCurrentRouter(_this3);
      // 恢复上下文信息
      if (true) {
        _bom_window_js__WEBPACK_IMPORTED_MODULE_9__.taroWindowProvider.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CONTEXT_ACTIONS.RECOVER, _this3.$taroPath);
      }
      // 触发生命周期
      safeExecute(_this3.$taroPath, _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_SHOW, options);
      // 通过事件触发子组件的生命周期
      (0,_bom_raf_js__WEBPACK_IMPORTED_MODULE_12__.raf)(function () {
        return _emitter_emitter_js__WEBPACK_IMPORTED_MODULE_13__.eventCenter.trigger(getOnShowEventKey(id));
      });
    });
  }), ONHIDE, function () {
    // 缓存当前页面上下文信息
    if (true) {
      _bom_window_js__WEBPACK_IMPORTED_MODULE_9__.taroWindowProvider.trigger(_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CONTEXT_ACTIONS.RESTORE, this.$taroPath);
    }
    // 设置 Current 的 page 和 router
    if (_current_js__WEBPACK_IMPORTED_MODULE_5__.Current.page === this) {
      _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.page = null;
      _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.router = null;
    }
    // 触发生命周期
    safeExecute(this.$taroPath, _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_HIDE);
    // 通过事件触发子组件的生命周期
    _emitter_emitter_js__WEBPACK_IMPORTED_MODULE_13__.eventCenter.trigger(getOnHideEventKey(id));
  });
  if (false) {}
  LIFECYCLES.forEach(function (lifecycle) {
    var isDefer = false;
    lifecycle = lifecycle.replace(/^defer:/, function () {
      isDefer = true;
      return '';
    });
    config[lifecycle] = function () {
      var _arguments = arguments,
        _this4 = this;
      var exec = function exec() {
        return safeExecute.apply(void 0, [_this4.$taroPath, lifecycle].concat((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_arguments)));
      };
      if (isDefer) {
        hasLoaded.then(exec);
      } else {
        return exec();
      }
    };
  });
  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  SIDE_EFFECT_LIFECYCLES.forEach(function (lifecycle) {
    var _a;
    if (component[lifecycle] || ((_a = component.prototype) === null || _a === void 0 ? void 0 : _a[lifecycle]) || component[lifecycle.replace(/^on/, 'enable')] || (pageConfig === null || pageConfig === void 0 ? void 0 : pageConfig[lifecycle.replace(/^on/, 'enable')])) {
      config[lifecycle] = function () {
        var _a;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        var target = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.target;
        if (target === null || target === void 0 ? void 0 : target.id) {
          var _id = target.id;
          var element = _env_js__WEBPACK_IMPORTED_MODULE_10__["default"].document.getElementById(_id);
          if (element) {
            target.dataset = element.dataset;
          }
        }
        return safeExecute.apply(void 0, [this.$taroPath, lifecycle].concat(args));
      };
    }
  });
  config.eh = _dom_event_js__WEBPACK_IMPORTED_MODULE_15__.eventHandler;
  if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(data)) {
    config.data = data;
  }
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('modifyPageObject', config);
  return config;
}
function createComponentConfig(component, componentName, data) {
  var id = componentName !== null && componentName !== void 0 ? componentName : "taro_component_".concat(pageId());
  var componentElement = null;
  var _hooks$call$component = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('getMiniLifecycleImpl').component, 2),
    ATTACHED = _hooks$call$component[0],
    DETACHED = _hooks$call$component[1];
  var config = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])({}, ATTACHED, function () {
    var _this5 = this;
    var _a;
    _perf_js__WEBPACK_IMPORTED_MODULE_8__.perf.start(_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.PAGE_INIT);
    this.pageIdCache = ((_a = this.getPageId) === null || _a === void 0 ? void 0 : _a.call(this)) || pageId();
    var path = getPath(id, {
      id: this.pageIdCache
    });
    _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.app.mount(component, path, function () {
      componentElement = _env_js__WEBPACK_IMPORTED_MODULE_10__["default"].document.getElementById(path);
      (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_11__.ensure)(componentElement !== null, '没有找到组件实例。');
      _this5.$taroInstances = instances.get(path);
      safeExecute(path, _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ON_LOAD);
      if (true) {
        componentElement.ctx = _this5;
        componentElement.performUpdate(true);
      }
    });
  }), DETACHED, function () {
    var path = getPath(id, {
      id: this.pageIdCache
    });
    _current_js__WEBPACK_IMPORTED_MODULE_5__.Current.app.unmount(path, function () {
      instances.delete(path);
      if (componentElement) {
        componentElement.ctx = null;
      }
    });
  }), "methods", {
    eh: _dom_event_js__WEBPACK_IMPORTED_MODULE_15__.eventHandler
  });
  if (!(0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isUndefined)(data)) {
    config.data = data;
  }
  [_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.OPTIONS, _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.EXTERNAL_CLASSES, _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.BEHAVIORS].forEach(function (key) {
    var _a;
    config[key] = (_a = component[key]) !== null && _a !== void 0 ? _a : _tarojs_shared__WEBPACK_IMPORTED_MODULE_11__.EMPTY_OBJ;
  });
  return config;
}
function createRecursiveComponentConfig(componentName) {
  var isCustomWrapper = componentName === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CUSTOM_WRAPPER;
  var _hooks$call$component2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('getMiniLifecycleImpl').component, 2),
    ATTACHED = _hooks$call$component2[0],
    DETACHED = _hooks$call$component2[1];
  var lifeCycles = isCustomWrapper ? (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])({}, ATTACHED, function () {
    var _a, _b;
    var componentId = ((_a = this.data.i) === null || _a === void 0 ? void 0 : _a.sid) || ((_b = this.props.i) === null || _b === void 0 ? void 0 : _b.sid);
    if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(componentId)) {
      _utils_index_js__WEBPACK_IMPORTED_MODULE_0__.customWrapperCache.set(componentId, this);
      var el = _env_js__WEBPACK_IMPORTED_MODULE_10__["default"].document.getElementById(componentId);
      if (el) {
        el.ctx = this;
      }
    }
  }), DETACHED, function () {
    var _a, _b;
    var componentId = ((_a = this.data.i) === null || _a === void 0 ? void 0 : _a.sid) || ((_b = this.props.i) === null || _b === void 0 ? void 0 : _b.sid);
    if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isString)(componentId)) {
      _utils_index_js__WEBPACK_IMPORTED_MODULE_0__.customWrapperCache.delete(componentId);
      var el = _env_js__WEBPACK_IMPORTED_MODULE_10__["default"].document.getElementById(componentId);
      if (el) {
        el.ctx = null;
      }
    }
  }) : _tarojs_shared__WEBPACK_IMPORTED_MODULE_11__.EMPTY_OBJ;
  return _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('modifyRecursiveComponentConfig', Object.assign({
    properties: {
      i: {
        type: Object,
        value: (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])({}, "nn" /* Shortcuts.NodeName */, (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_11__.getComponentsAlias)(_tarojs_shared__WEBPACK_IMPORTED_MODULE_16__.internalComponents)[_constants_index_js__WEBPACK_IMPORTED_MODULE_3__.VIEW]._num)
      },
      l: {
        type: String,
        value: ''
      }
    },
    options: {
      virtualHost: !isCustomWrapper
    },
    methods: {
      eh: _dom_event_js__WEBPACK_IMPORTED_MODULE_15__.eventHandler
    }
  }, lifeCycles), {
    isCustomWrapper: isCustomWrapper
  });
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/emitter/emitter.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/emitter/emitter.js ***!
  \*******************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   eventCenter: function() { return /* binding */ eventCenter; }
/* harmony export */ });
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");


var eventCenter = _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.hooks.call('getEventCenter', _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.Events);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ env; }
/* harmony export */ });
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");

var env = {
  window:  false ? 0 : _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.EMPTY_OBJ,
  document:  false ? 0 : _tarojs_shared__WEBPACK_IMPORTED_MODULE_0__.EMPTY_OBJ
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/hydrate.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/hydrate.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hydrate: function() { return /* binding */ hydrate; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");




var SPECIAL_NODES;
var componentsAlias;
/**
 * React also has a fancy function's name for this: `hydrate()`.
 * You may have been heard `hydrate` as a SSR-related function,
 * actually, `hydrate` basicly do the `render()` thing, but ignore some properties,
 * it's a vnode traverser and modifier: that's exactly what Taro's doing in here.
 */
function hydrate(node) {
  var _a;
  // 初始化 componentsAlias
  componentsAlias || (componentsAlias = (0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.getComponentsAlias)());
  // 初始化 SPECIAL_NODES
  SPECIAL_NODES || (SPECIAL_NODES = _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('getSpecialNodes'));
  var nodeName = node.nodeName;
  var compileModeName = null;
  if ((0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.isText)(node)) {
    return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
      sid: node.sid
    }, "v" /* Shortcuts.Text */, node.nodeValue), "nn" /* Shortcuts.NodeName */, ((_a = componentsAlias[nodeName]) === null || _a === void 0 ? void 0 : _a._num) || '8');
  }
  var data = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_2__["default"])({}, "nn" /* Shortcuts.NodeName */, nodeName), "sid", node.sid);
  if (node.uid !== node.sid) {
    data.uid = node.uid;
  }
  if (SPECIAL_NODES.indexOf(nodeName) > -1) {
    if (!node.isAnyEventBinded()) {
      data["nn" /* Shortcuts.NodeName */] = "static-".concat(nodeName);
      if (nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.VIEW && !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.isHasExtractProp)(node)) {
        data["nn" /* Shortcuts.NodeName */] = _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.PURE_VIEW;
      }
    }
    if (nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.VIEW && node.isOnlyClickBinded()) {
      data["nn" /* Shortcuts.NodeName */] = _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CLICK_VIEW;
    }
  }
  var props = node.props;
  for (var prop in props) {
    var propInCamelCase = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.toCamelCase)(prop);
    if (!prop.startsWith('data-') &&
    // 在 node.dataset 的数据
    prop !== _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CLASS && prop !== _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.STYLE && prop !== _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.ID && propInCamelCase !== _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CATCHMOVE && propInCamelCase !== _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.COMPILE_MODE) {
      data[propInCamelCase] = props[prop];
    }
    if ( true && nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.VIEW && propInCamelCase === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CATCHMOVE && props[prop] !== false) {
      data["nn" /* Shortcuts.NodeName */] = _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.CATCH_VIEW;
    }
    if (propInCamelCase === _constants_index_js__WEBPACK_IMPORTED_MODULE_3__.COMPILE_MODE) {
      compileModeName = props[prop];
    }
  }
  // Children
  data["cn" /* Shortcuts.Childnodes */] = node.childNodes.filter(function (node) {
    return !(0,_utils_index_js__WEBPACK_IMPORTED_MODULE_0__.isComment)(node);
  }).map(hydrate);
  if (node.className !== '') {
    data["cl" /* Shortcuts.Class */] = node.className;
  }
  var cssText = node.cssText;
  if (cssText !== '' && nodeName !== 'swiper-item') {
    data["st" /* Shortcuts.Style */] = cssText;
  }
  _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('modifyHydrateData', data, node);
  var nn = data["nn" /* Shortcuts.NodeName */];
  var componentAlias = componentsAlias[nn];
  if (componentAlias) {
    data["nn" /* Shortcuts.NodeName */] = componentAlias._num;
    for (var _prop in data) {
      if (_prop in componentAlias) {
        data[componentAlias[_prop]] = data[_prop];
        delete data[_prop];
      }
    }
  }
  if (compileModeName !== null) {
    data["nn" /* Shortcuts.NodeName */] = compileModeName;
  }
  var resData = _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.hooks.call('transferHydrateData', data, node, componentAlias);
  return resData || data;
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/index.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/index.js ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.A; },
/* harmony export */   APP: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.APP; },
/* harmony export */   BEHAVIORS: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.BEHAVIORS; },
/* harmony export */   BODY: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.BODY; },
/* harmony export */   CATCHMOVE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CATCHMOVE; },
/* harmony export */   CATCH_VIEW: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CATCH_VIEW; },
/* harmony export */   CHANGE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CHANGE; },
/* harmony export */   CLASS: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CLASS; },
/* harmony export */   CLICK_VIEW: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CLICK_VIEW; },
/* harmony export */   COMMENT: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.COMMENT; },
/* harmony export */   COMPILE_MODE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.COMPILE_MODE; },
/* harmony export */   CONFIRM: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CONFIRM; },
/* harmony export */   CONTAINER: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CONTAINER; },
/* harmony export */   CONTEXT_ACTIONS: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CONTEXT_ACTIONS; },
/* harmony export */   CURRENT_TARGET: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CURRENT_TARGET; },
/* harmony export */   CUSTOM_WRAPPER: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.CUSTOM_WRAPPER; },
/* harmony export */   Current: function() { return /* reexport safe */ _current_js__WEBPACK_IMPORTED_MODULE_22__.Current; },
/* harmony export */   DATASET: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.DATASET; },
/* harmony export */   DATE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.DATE; },
/* harmony export */   DOCUMENT_ELEMENT_NAME: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.DOCUMENT_ELEMENT_NAME; },
/* harmony export */   DOCUMENT_FRAGMENT: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.DOCUMENT_FRAGMENT; },
/* harmony export */   EVENT_CALLBACK_RESULT: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.EVENT_CALLBACK_RESULT; },
/* harmony export */   EXTERNAL_CLASSES: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.EXTERNAL_CLASSES; },
/* harmony export */   Events: function() { return /* reexport safe */ _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__.Events; },
/* harmony export */   FOCUS: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.FOCUS; },
/* harmony export */   FormElement: function() { return /* reexport safe */ _dom_form_js__WEBPACK_IMPORTED_MODULE_14__.FormElement; },
/* harmony export */   HEAD: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.HEAD; },
/* harmony export */   HOOKS_APP_ID: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.HOOKS_APP_ID; },
/* harmony export */   HTML: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.HTML; },
/* harmony export */   History: function() { return /* reexport safe */ _bom_history_js__WEBPACK_IMPORTED_MODULE_5__.History; },
/* harmony export */   ID: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.ID; },
/* harmony export */   INPUT: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.INPUT; },
/* harmony export */   KEY_CODE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.KEY_CODE; },
/* harmony export */   Location: function() { return /* reexport safe */ _bom_location_js__WEBPACK_IMPORTED_MODULE_6__.Location; },
/* harmony export */   MutationObserver: function() { return /* reexport safe */ _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_20__.MutationObserver; },
/* harmony export */   OBJECT: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.OBJECT; },
/* harmony export */   ON_HIDE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.ON_HIDE; },
/* harmony export */   ON_LOAD: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.ON_LOAD; },
/* harmony export */   ON_READY: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.ON_READY; },
/* harmony export */   ON_SHOW: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.ON_SHOW; },
/* harmony export */   OPTIONS: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.OPTIONS; },
/* harmony export */   PAGE_INIT: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.PAGE_INIT; },
/* harmony export */   PROPERTY_THRESHOLD: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.PROPERTY_THRESHOLD; },
/* harmony export */   PROPS: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.PROPS; },
/* harmony export */   PURE_VIEW: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.PURE_VIEW; },
/* harmony export */   ROOT_STR: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.ROOT_STR; },
/* harmony export */   SET_DATA: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.SET_DATA; },
/* harmony export */   SET_TIMEOUT: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.SET_TIMEOUT; },
/* harmony export */   STATIC_VIEW: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.STATIC_VIEW; },
/* harmony export */   STYLE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.STYLE; },
/* harmony export */   SVGElement: function() { return /* reexport safe */ _dom_svg_js__WEBPACK_IMPORTED_MODULE_18__.SVGElement; },
/* harmony export */   Style: function() { return /* reexport safe */ _dom_style_js__WEBPACK_IMPORTED_MODULE_17__.Style; },
/* harmony export */   TARGET: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.TARGET; },
/* harmony export */   TARO_RUNTIME: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.TARO_RUNTIME; },
/* harmony export */   TIME_STAMP: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.TIME_STAMP; },
/* harmony export */   TOUCHMOVE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.TOUCHMOVE; },
/* harmony export */   TYPE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.TYPE; },
/* harmony export */   TaroElement: function() { return /* reexport safe */ _dom_element_js__WEBPACK_IMPORTED_MODULE_12__.TaroElement; },
/* harmony export */   TaroEvent: function() { return /* reexport safe */ _dom_event_js__WEBPACK_IMPORTED_MODULE_13__.TaroEvent; },
/* harmony export */   TaroNode: function() { return /* reexport safe */ _dom_node_js__WEBPACK_IMPORTED_MODULE_15__.TaroNode; },
/* harmony export */   TaroRootElement: function() { return /* reexport safe */ _dom_root_js__WEBPACK_IMPORTED_MODULE_16__.TaroRootElement; },
/* harmony export */   TaroText: function() { return /* reexport safe */ _dom_text_js__WEBPACK_IMPORTED_MODULE_19__.TaroText; },
/* harmony export */   UID: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.UID; },
/* harmony export */   URL: function() { return /* reexport safe */ _bom_URL_js__WEBPACK_IMPORTED_MODULE_9__.TaroURLProvider; },
/* harmony export */   URLSearchParams: function() { return /* reexport safe */ _bom_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_10__.URLSearchParams; },
/* harmony export */   VALUE: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.VALUE; },
/* harmony export */   VIEW: function() { return /* reexport safe */ _constants_index_js__WEBPACK_IMPORTED_MODULE_21__.VIEW; },
/* harmony export */   addLeadingSlash: function() { return /* reexport safe */ _utils_router_js__WEBPACK_IMPORTED_MODULE_33__.addLeadingSlash; },
/* harmony export */   cancelAnimationFrame: function() { return /* reexport safe */ _bom_raf_js__WEBPACK_IMPORTED_MODULE_8__.caf; },
/* harmony export */   convertNumber2PX: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.convertNumber2PX; },
/* harmony export */   createComponentConfig: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.createComponentConfig; },
/* harmony export */   createEvent: function() { return /* reexport safe */ _dom_event_js__WEBPACK_IMPORTED_MODULE_13__.createEvent; },
/* harmony export */   createPageConfig: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.createPageConfig; },
/* harmony export */   createRecursiveComponentConfig: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.createRecursiveComponentConfig; },
/* harmony export */   customWrapperCache: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.customWrapperCache; },
/* harmony export */   debounce: function() { return /* reexport safe */ _utils_lodash_js__WEBPACK_IMPORTED_MODULE_32__.debounce; },
/* harmony export */   document: function() { return /* reexport safe */ _bom_document_js__WEBPACK_IMPORTED_MODULE_3__.taroDocumentProvider; },
/* harmony export */   env: function() { return /* reexport safe */ _env_js__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   eventCenter: function() { return /* reexport safe */ _emitter_emitter_js__WEBPACK_IMPORTED_MODULE_25__.eventCenter; },
/* harmony export */   eventHandler: function() { return /* reexport safe */ _dom_event_js__WEBPACK_IMPORTED_MODULE_13__.eventHandler; },
/* harmony export */   eventSource: function() { return /* reexport safe */ _dom_event_source_js__WEBPACK_IMPORTED_MODULE_23__.eventSource; },
/* harmony export */   extend: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.extend; },
/* harmony export */   getComponentsAlias: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.getComponentsAlias; },
/* harmony export */   getComputedStyle: function() { return /* reexport safe */ _bom_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__.taroGetComputedStyleProvider; },
/* harmony export */   getCurrentInstance: function() { return /* reexport safe */ _current_js__WEBPACK_IMPORTED_MODULE_22__.getCurrentInstance; },
/* harmony export */   getCurrentPage: function() { return /* reexport safe */ _utils_router_js__WEBPACK_IMPORTED_MODULE_33__.getCurrentPage; },
/* harmony export */   getHomePage: function() { return /* reexport safe */ _utils_router_js__WEBPACK_IMPORTED_MODULE_33__.getHomePage; },
/* harmony export */   getOnHideEventKey: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.getOnHideEventKey; },
/* harmony export */   getOnReadyEventKey: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.getOnReadyEventKey; },
/* harmony export */   getOnShowEventKey: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.getOnShowEventKey; },
/* harmony export */   getPageInstance: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.getPageInstance; },
/* harmony export */   getPath: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.getPath; },
/* harmony export */   handlePolyfill: function() { return /* reexport safe */ _polyfill_index_js__WEBPACK_IMPORTED_MODULE_31__.handlePolyfill; },
/* harmony export */   hasBasename: function() { return /* reexport safe */ _utils_router_js__WEBPACK_IMPORTED_MODULE_33__.hasBasename; },
/* harmony export */   history: function() { return /* reexport safe */ _bom_window_js__WEBPACK_IMPORTED_MODULE_11__.taroHistoryProvider; },
/* harmony export */   hooks: function() { return /* reexport safe */ _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.hooks; },
/* harmony export */   hydrate: function() { return /* reexport safe */ _hydrate_js__WEBPACK_IMPORTED_MODULE_26__.hydrate; },
/* harmony export */   incrementId: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.incrementId; },
/* harmony export */   injectPageInstance: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.injectPageInstance; },
/* harmony export */   isComment: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.isComment; },
/* harmony export */   isElement: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.isElement; },
/* harmony export */   isHasExtractProp: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.isHasExtractProp; },
/* harmony export */   isParentBinded: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.isParentBinded; },
/* harmony export */   isText: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.isText; },
/* harmony export */   location: function() { return /* reexport safe */ _bom_window_js__WEBPACK_IMPORTED_MODULE_11__.taroLocationProvider; },
/* harmony export */   navigator: function() { return /* reexport safe */ _bom_navigator_js__WEBPACK_IMPORTED_MODULE_7__.nav; },
/* harmony export */   nextTick: function() { return /* reexport safe */ _next_tick_js__WEBPACK_IMPORTED_MODULE_27__.nextTick; },
/* harmony export */   now: function() { return /* reexport safe */ _bom_raf_js__WEBPACK_IMPORTED_MODULE_8__.now; },
/* harmony export */   options: function() { return /* reexport safe */ _options_js__WEBPACK_IMPORTED_MODULE_28__.options; },
/* harmony export */   parseUrl: function() { return /* reexport safe */ _bom_URL_js__WEBPACK_IMPORTED_MODULE_9__.parseUrl; },
/* harmony export */   perf: function() { return /* reexport safe */ _perf_js__WEBPACK_IMPORTED_MODULE_29__.perf; },
/* harmony export */   removePageInstance: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.removePageInstance; },
/* harmony export */   requestAnimationFrame: function() { return /* reexport safe */ _bom_raf_js__WEBPACK_IMPORTED_MODULE_8__.raf; },
/* harmony export */   safeExecute: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.safeExecute; },
/* harmony export */   shortcutAttr: function() { return /* reexport safe */ _utils_index_js__WEBPACK_IMPORTED_MODULE_30__.shortcutAttr; },
/* harmony export */   stringify: function() { return /* reexport safe */ _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__.stringify; },
/* harmony export */   stripBasename: function() { return /* reexport safe */ _utils_router_js__WEBPACK_IMPORTED_MODULE_33__.stripBasename; },
/* harmony export */   stripSuffix: function() { return /* reexport safe */ _utils_router_js__WEBPACK_IMPORTED_MODULE_33__.stripSuffix; },
/* harmony export */   stripTrailing: function() { return /* reexport safe */ _utils_router_js__WEBPACK_IMPORTED_MODULE_33__.stripTrailing; },
/* harmony export */   throttle: function() { return /* reexport safe */ _utils_lodash_js__WEBPACK_IMPORTED_MODULE_32__.throttle; },
/* harmony export */   window: function() { return /* reexport safe */ _bom_window_js__WEBPACK_IMPORTED_MODULE_11__.taroWindowProvider; }
/* harmony export */ });
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");
/* harmony import */ var _bom_document_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./bom/document.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/document.js");
/* harmony import */ var _bom_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./bom/getComputedStyle.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/getComputedStyle.js");
/* harmony import */ var _bom_history_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./bom/history.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/history.js");
/* harmony import */ var _bom_location_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./bom/location.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/location.js");
/* harmony import */ var _bom_navigator_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./bom/navigator.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/navigator.js");
/* harmony import */ var _bom_raf_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./bom/raf.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/raf.js");
/* harmony import */ var _bom_URL_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./bom/URL.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URL.js");
/* harmony import */ var _bom_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./bom/URLSearchParams.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/URLSearchParams.js");
/* harmony import */ var _bom_window_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./bom/window.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/window.js");
/* harmony import */ var _dom_element_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./dom/element.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/element.js");
/* harmony import */ var _dom_event_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./dom/event.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event.js");
/* harmony import */ var _dom_form_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./dom/form.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/form.js");
/* harmony import */ var _dom_node_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./dom/node.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/node.js");
/* harmony import */ var _dom_root_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./dom/root.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/root.js");
/* harmony import */ var _dom_style_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./dom/style.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/style.js");
/* harmony import */ var _dom_svg_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./dom/svg.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/svg.js");
/* harmony import */ var _dom_text_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./dom/text.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/text.js");
/* harmony import */ var _dom_external_mutation_observer_index_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./dom-external/mutation-observer/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom-external/mutation-observer/index.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");
/* harmony import */ var _current_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./current.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js");
/* harmony import */ var _dom_event_source_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./dom/event-source.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dom/event-source.js");
/* harmony import */ var _dsl_common_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./dsl/common.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _emitter_emitter_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./emitter/emitter.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/emitter/emitter.js");
/* harmony import */ var _hydrate_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./hydrate.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/hydrate.js");
/* harmony import */ var _next_tick_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./next-tick.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/next-tick.js");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./options.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/options.js");
/* harmony import */ var _perf_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./perf.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/perf.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./utils/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js");
/* harmony import */ var _polyfill_index_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./polyfill/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/polyfill/index.js");
/* harmony import */ var _utils_lodash_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./utils/lodash.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/lodash.js");
/* harmony import */ var _utils_router_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./utils/router.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/router.js");



































/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/next-tick.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/next-tick.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nextTick: function() { return /* binding */ nextTick; }
/* harmony export */ });
/* harmony import */ var _current_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./current.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/current.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./env.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/env.js");


var TIMEOUT = 100;
var nextTick = function nextTick(cb, ctx) {
  var beginTime = Date.now();
  var router = _current_js__WEBPACK_IMPORTED_MODULE_0__.Current.router;
  var timerFunc = function timerFunc() {
    setTimeout(function () {
      ctx ? cb.call(ctx) : cb();
    }, 1);
  };
  if (router === null) return timerFunc();
  var path = router.$taroPath;
  /**
   * 三种情况
   *   1. 调用 nextTick 时，pendingUpdate 已经从 true 变为 false（即已更新完成），那么需要光等 100ms
   *   2. 调用 nextTick 时，pendingUpdate 为 true，那么刚好可以搭上便车
   *   3. 调用 nextTick 时，pendingUpdate 还是 false，框架仍未启动更新逻辑，这时最多轮询 100ms，等待 pendingUpdate 变为 true。
   */
  function next() {
    var _a, _b, _c;
    var pageElement = _env_js__WEBPACK_IMPORTED_MODULE_1__["default"].document.getElementById(path);
    if (pageElement === null || pageElement === void 0 ? void 0 : pageElement.pendingUpdate) {
      if (false) {} else {
        pageElement.enqueueUpdateCallback(cb, ctx);
      }
    } else if (Date.now() - beginTime > TIMEOUT) {
      timerFunc();
    } else {
      setTimeout(function () {
        return next();
      }, 20);
    }
  }
  next();
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/options.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/options.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   options: function() { return /* binding */ options; }
/* harmony export */ });
var options = {
  prerender: true,
  debug: false
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/perf.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/perf.js ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   perf: function() { return /* binding */ perf; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ "./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _options_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./options.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/options.js");
/* harmony import */ var _utils_lodash_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/lodash.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/lodash.js");








var _Performance_instances, _Performance_parseTime;
var Performance = /*#__PURE__*/function () {
  function Performance() {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Performance);
    _Performance_instances.add(this);
    this.recorder = new Map();
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Performance, [{
    key: "start",
    value: function start(id) {
      if (!_options_js__WEBPACK_IMPORTED_MODULE_2__.options.debug) {
        return;
      }
      this.recorder.set(id, Date.now());
    }
  }, {
    key: "stop",
    value: function stop(id) {
      var now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
      if (!_options_js__WEBPACK_IMPORTED_MODULE_2__.options.debug) {
        return;
      }
      var prev = this.recorder.get(id);
      if (!(prev >= 0)) return;
      this.recorder.delete(id);
      var time = now - prev;
      // eslint-disable-next-line no-console
      console.log("".concat(id, " \u65F6\u957F\uFF1A ").concat(time, "ms \u5F00\u59CB\u65F6\u95F4\uFF1A").concat((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _Performance_instances, "m", _Performance_parseTime).call(this, prev), " \u7ED3\u675F\u65F6\u95F4\uFF1A").concat((0,tslib__WEBPACK_IMPORTED_MODULE_3__.__classPrivateFieldGet)(this, _Performance_instances, "m", _Performance_parseTime).call(this, now)));
    }
  }, {
    key: "delayStop",
    value: function delayStop(id) {
      var _this = this;
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      if (!_options_js__WEBPACK_IMPORTED_MODULE_2__.options.debug) {
        return;
      }
      return (0,_utils_lodash_js__WEBPACK_IMPORTED_MODULE_4__.debounce)(function () {
        var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now();
        var cb = arguments.length > 1 ? arguments[1] : undefined;
        _this.stop(id, now);
        cb === null || cb === void 0 ? void 0 : cb();
      }, delay);
    }
  }]);
}();
_Performance_instances = new WeakSet(), _Performance_parseTime = function _Performance_parseTime(time) {
  var d = new Date(time);
  return "".concat(d.getHours(), ":").concat(d.getMinutes(), ":").concat(d.getSeconds(), ".").concat("".concat(d.getMilliseconds()).padStart(3, '0'));
};
var perf = new Performance();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/polyfill/index.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/polyfill/index.js ***!
  \******************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handlePolyfill: function() { return /* binding */ handlePolyfill; }
/* harmony export */ });




function handlePolyfill() {
  if (false) {}
  if (false) {}
  if (false) {}
  if (false) {}
  if (false) {}
  // Exit early if we're not running in a browser.
  if (false) {}
}
if (false) {}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/cache.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/cache.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RuntimeCache: function() { return /* binding */ RuntimeCache; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");


/**
 * 一个小型缓存池，用于在切换页面时，存储一些上下文信息
 */
var RuntimeCache = /*#__PURE__*/function () {
  function RuntimeCache(name) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, RuntimeCache);
    this.cache = new Map();
    this.name = name;
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(RuntimeCache, [{
    key: "has",
    value: function has(identifier) {
      return this.cache.has(identifier);
    }
  }, {
    key: "set",
    value: function set(identifier, ctx) {
      if (identifier && ctx) {
        this.cache.set(identifier, ctx);
      }
    }
  }, {
    key: "get",
    value: function get(identifier) {
      if (this.has(identifier)) return this.cache.get(identifier);
    }
  }, {
    key: "delete",
    value: function _delete(identifier) {
      this.cache.delete(identifier);
    }
  }]);
}();


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/index.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertNumber2PX: function() { return /* binding */ convertNumber2PX; },
/* harmony export */   customWrapperCache: function() { return /* binding */ customWrapperCache; },
/* harmony export */   extend: function() { return /* binding */ extend; },
/* harmony export */   getComponentsAlias: function() { return /* binding */ getComponentsAlias; },
/* harmony export */   incrementId: function() { return /* binding */ incrementId; },
/* harmony export */   isComment: function() { return /* binding */ isComment; },
/* harmony export */   isElement: function() { return /* binding */ isElement; },
/* harmony export */   isHasExtractProp: function() { return /* binding */ isHasExtractProp; },
/* harmony export */   isParentBinded: function() { return /* binding */ isParentBinded; },
/* harmony export */   isText: function() { return /* binding */ isText; },
/* harmony export */   shortcutAttr: function() { return /* binding */ shortcutAttr; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");
/* harmony import */ var _tarojs_shared__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tarojs/shared */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/components.js");
/* harmony import */ var _constants_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/index.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/constants/index.js");




var incrementId = function incrementId() {
  var chatCodes = [];
  // A-Z
  for (var i = 65; i <= 90; i++) {
    chatCodes.push(i);
  }
  // a-z
  for (var _i = 97; _i <= 122; _i++) {
    chatCodes.push(_i);
  }
  var chatCodesLen = chatCodes.length - 1;
  var list = [0, 0];
  return function () {
    var target = list.map(function (item) {
      return chatCodes[item];
    });
    var res = String.fromCharCode.apply(String, (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(target));
    var tailIdx = list.length - 1;
    list[tailIdx]++;
    while (list[tailIdx] > chatCodesLen) {
      list[tailIdx] = 0;
      tailIdx = tailIdx - 1;
      if (tailIdx < 0) {
        list.push(0);
        break;
      }
      list[tailIdx]++;
    }
    return res;
  };
};
function isElement(node) {
  return node.nodeType === 1 /* NodeType.ELEMENT_NODE */;
}
function isText(node) {
  return node.nodeType === 3 /* NodeType.TEXT_NODE */;
}
function isComment(node) {
  return node.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_1__.COMMENT;
}
function isHasExtractProp(el) {
  var res = Object.keys(el.props).find(function (prop) {
    return !(/^(class|style|id)$/.test(prop) || prop.startsWith('data-'));
  });
  return Boolean(res);
}
/**
 * 往上寻找组件树直到 root，寻找是否有祖先组件绑定了同类型的事件
 * @param node 当前组件
 * @param type 事件类型
 */
function isParentBinded(node, type) {
  var _a;
  while (node = (node === null || node === void 0 ? void 0 : node.parentElement) || null) {
    if (!node || node.nodeName === _constants_index_js__WEBPACK_IMPORTED_MODULE_1__.ROOT_STR || node.nodeName === 'root-portal') {
      return false;
    } else if ((_a = node.__handlers[type]) === null || _a === void 0 ? void 0 : _a.length) {
      return true;
    }
  }
  return false;
}
function shortcutAttr(key) {
  switch (key) {
    case _constants_index_js__WEBPACK_IMPORTED_MODULE_1__.STYLE:
      return "st" /* Shortcuts.Style */;
    case _constants_index_js__WEBPACK_IMPORTED_MODULE_1__.ID:
      return _constants_index_js__WEBPACK_IMPORTED_MODULE_1__.UID;
    case _constants_index_js__WEBPACK_IMPORTED_MODULE_1__.CLASS:
      return "cl" /* Shortcuts.Class */;
    default:
      return key;
  }
}
var customWrapperCache = new Map();
function extend(ctor, methodName, options) {
  if ((0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_2__.isFunction)(options)) {
    options = {
      value: options
    };
  }
  Object.defineProperty(ctor.prototype, methodName, Object.assign({
    configurable: true,
    enumerable: true
  }, options));
}
var componentsAlias;
function getComponentsAlias() {
  if (!componentsAlias) {
    componentsAlias = (0,_tarojs_shared__WEBPACK_IMPORTED_MODULE_3__.getComponentsAlias)(_tarojs_shared__WEBPACK_IMPORTED_MODULE_4__.internalComponents);
  }
  return componentsAlias;
}
function convertNumber2PX(value) {
  return value + 'px';
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/lodash.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/lodash.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   debounce: function() { return /* binding */ debounce; },
/* harmony export */   throttle: function() { return /* binding */ throttle; }
/* harmony export */ });
function throttle(fn) {
  var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  var scope = arguments.length > 2 ? arguments[2] : undefined;
  var lastTime = 0;
  var deferTimer;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var context = scope || this;
    var now = Date.now();
    if (now - lastTime > threshold) {
      fn.apply(this, args);
      lastTime = now;
    } else {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        lastTime = now;
        fn.apply(context, args);
      }, threshold);
    }
  };
}
function debounce(fn) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 250;
  var scope = arguments.length > 2 ? arguments[2] : undefined;
  var timer;
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var context = scope || this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, ms);
  };
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/router.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/utils/router.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addLeadingSlash: function() { return /* binding */ addLeadingSlash; },
/* harmony export */   getCurrentPage: function() { return /* binding */ getCurrentPage; },
/* harmony export */   getHomePage: function() { return /* binding */ getHomePage; },
/* harmony export */   hasBasename: function() { return /* binding */ hasBasename; },
/* harmony export */   stripBasename: function() { return /* binding */ stripBasename; },
/* harmony export */   stripSuffix: function() { return /* binding */ stripSuffix; },
/* harmony export */   stripTrailing: function() { return /* binding */ stripTrailing; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _bom_window_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../bom/window.js */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/bom/window.js");



// export const removeLeadingSlash = (str = '') => str.replace(/^\.?\//, '')
// export const removeTrailingSearch = (str = '') => str.replace(/\?[\s\S]*$/, '')
var addLeadingSlash = function addLeadingSlash() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return url.charAt(0) === '/' ? url : '/' + url;
};
var hasBasename = function hasBasename() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path) || path === prefix;
};
var stripBasename = function stripBasename() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return hasBasename(path, prefix) ? path.substring(prefix.length) : path;
};
var stripTrailing = function stripTrailing() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return str.replace(/[?#][\s\S]*$/, '');
};
var stripSuffix = function stripSuffix() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var suffix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  return path.includes(suffix) ? path.substring(0, path.length - suffix.length) : path;
};
var getHomePage = function getHomePage() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var basename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var customRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var entryPagePath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var _a;
  var routePath = addLeadingSlash(stripBasename(path, basename));
  var alias = ((_a = Object.entries(customRoutes).find(function (_ref) {
    var _ref2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref, 1),
      key = _ref2[0];
    return key === routePath;
  })) === null || _a === void 0 ? void 0 : _a[1]) || routePath;
  return entryPagePath || (typeof alias === 'string' ? alias : alias[0]) || basename;
};
var getCurrentPage = function getCurrentPage() {
  var routerMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'hash';
  var basename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  var pagePath = routerMode === 'hash' ? _bom_window_js__WEBPACK_IMPORTED_MODULE_1__.taroLocationProvider.hash.slice(1).split('?')[0] : _bom_window_js__WEBPACK_IMPORTED_MODULE_1__.taroLocationProvider.pathname;
  return addLeadingSlash(stripBasename(pagePath, basename));
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/components.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/components.js ***!
  \************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   controlledComponent: function() { return /* binding */ controlledComponent; },
/* harmony export */   internalComponents: function() { return /* binding */ internalComponents; }
/* harmony export */ });
/* unused harmony exports animation, focusComponents, nestElements, singleQuote, touchEvents, voidElements */
var DEFAULT_EMPTY_ARRAY = '[]';
var NO_DEFAULT_VALUE = '';
var DEFAULT_TRUE = '!0';
var DEFAULT_FALSE = '!1';
var touchEvents = {
  bindTouchStart: NO_DEFAULT_VALUE,
  bindTouchMove: NO_DEFAULT_VALUE,
  bindTouchEnd: NO_DEFAULT_VALUE,
  bindTouchCancel: NO_DEFAULT_VALUE,
  bindLongTap: NO_DEFAULT_VALUE
};
var animation = {
  animation: NO_DEFAULT_VALUE,
  bindAnimationStart: NO_DEFAULT_VALUE,
  bindAnimationIteration: NO_DEFAULT_VALUE,
  bindAnimationEnd: NO_DEFAULT_VALUE,
  bindTransitionEnd: NO_DEFAULT_VALUE
};
function singleQuote(s) {
  return "'".concat(s, "'");
}
var View = Object.assign(Object.assign({
  'hover-class': singleQuote('none'),
  'hover-stop-propagation': DEFAULT_FALSE,
  'hover-start-time': '50',
  'hover-stay-time': '400'
}, touchEvents), animation);
var Icon = {
  type: NO_DEFAULT_VALUE,
  size: '23',
  color: NO_DEFAULT_VALUE
};
var MapComp = Object.assign({
  longitude: NO_DEFAULT_VALUE,
  latitude: NO_DEFAULT_VALUE,
  scale: '16',
  markers: DEFAULT_EMPTY_ARRAY,
  covers: NO_DEFAULT_VALUE,
  polyline: DEFAULT_EMPTY_ARRAY,
  circles: DEFAULT_EMPTY_ARRAY,
  controls: DEFAULT_EMPTY_ARRAY,
  'include-points': DEFAULT_EMPTY_ARRAY,
  'show-location': NO_DEFAULT_VALUE,
  'layer-style': '1',
  bindMarkerTap: NO_DEFAULT_VALUE,
  bindControlTap: NO_DEFAULT_VALUE,
  bindCalloutTap: NO_DEFAULT_VALUE,
  bindUpdated: NO_DEFAULT_VALUE
}, touchEvents);
var Progress = {
  percent: NO_DEFAULT_VALUE,
  'stroke-width': '6',
  color: singleQuote('#09BB07'),
  activeColor: singleQuote('#09BB07'),
  backgroundColor: singleQuote('#EBEBEB'),
  active: DEFAULT_FALSE,
  'active-mode': singleQuote('backwards'),
  'show-info': DEFAULT_FALSE
};
var RichText = {
  nodes: DEFAULT_EMPTY_ARRAY
};
var Text = Object.assign({
  selectable: DEFAULT_FALSE,
  space: NO_DEFAULT_VALUE,
  decode: DEFAULT_FALSE
}, touchEvents);
var Button = Object.assign({
  size: singleQuote('default'),
  type: NO_DEFAULT_VALUE,
  plain: DEFAULT_FALSE,
  disabled: NO_DEFAULT_VALUE,
  loading: DEFAULT_FALSE,
  'form-type': NO_DEFAULT_VALUE,
  'open-type': NO_DEFAULT_VALUE,
  'hover-class': singleQuote('button-hover'),
  'hover-stop-propagation': DEFAULT_FALSE,
  'hover-start-time': '20',
  'hover-stay-time': '70',
  name: NO_DEFAULT_VALUE,
  bindagreeprivacyauthorization: NO_DEFAULT_VALUE
}, touchEvents);
var Checkbox = {
  value: NO_DEFAULT_VALUE,
  disabled: NO_DEFAULT_VALUE,
  checked: DEFAULT_FALSE,
  color: singleQuote('#09BB07'),
  name: NO_DEFAULT_VALUE
};
var CheckboxGroup = {
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var Form = {
  'report-submit': DEFAULT_FALSE,
  bindSubmit: NO_DEFAULT_VALUE,
  bindReset: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var Input = {
  value: NO_DEFAULT_VALUE,
  type: singleQuote(NO_DEFAULT_VALUE),
  password: DEFAULT_FALSE,
  placeholder: NO_DEFAULT_VALUE,
  'placeholder-style': NO_DEFAULT_VALUE,
  'placeholder-class': singleQuote('input-placeholder'),
  disabled: NO_DEFAULT_VALUE,
  maxlength: '140',
  'cursor-spacing': '0',
  focus: DEFAULT_FALSE,
  'confirm-type': singleQuote('done'),
  'confirm-hold': DEFAULT_FALSE,
  cursor: '-1',
  'selection-start': '-1',
  'selection-end': '-1',
  bindInput: NO_DEFAULT_VALUE,
  bindFocus: NO_DEFAULT_VALUE,
  bindBlur: NO_DEFAULT_VALUE,
  bindConfirm: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var Label = Object.assign({
  for: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
}, touchEvents);
var Picker = {
  mode: singleQuote('selector'),
  disabled: NO_DEFAULT_VALUE,
  range: NO_DEFAULT_VALUE,
  'range-key': NO_DEFAULT_VALUE,
  value: NO_DEFAULT_VALUE,
  start: NO_DEFAULT_VALUE,
  end: NO_DEFAULT_VALUE,
  fields: singleQuote('day'),
  'custom-item': NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE,
  bindCancel: NO_DEFAULT_VALUE,
  bindChange: NO_DEFAULT_VALUE,
  bindColumnChange: NO_DEFAULT_VALUE
};
var PickerView = {
  value: NO_DEFAULT_VALUE,
  'indicator-style': NO_DEFAULT_VALUE,
  'indicator-class': NO_DEFAULT_VALUE,
  'mask-style': NO_DEFAULT_VALUE,
  'mask-class': NO_DEFAULT_VALUE,
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var PickerViewColumn = {
  name: NO_DEFAULT_VALUE
};
var Radio = {
  value: NO_DEFAULT_VALUE,
  checked: DEFAULT_FALSE,
  disabled: NO_DEFAULT_VALUE,
  color: singleQuote('#09BB07'),
  name: NO_DEFAULT_VALUE
};
var RadioGroup = {
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var Slider = {
  min: '0',
  max: '100',
  step: '1',
  disabled: NO_DEFAULT_VALUE,
  value: '0',
  activeColor: singleQuote('#1aad19'),
  backgroundColor: singleQuote('#e9e9e9'),
  'block-size': '28',
  'block-color': singleQuote('#ffffff'),
  'show-value': DEFAULT_FALSE,
  bindChange: NO_DEFAULT_VALUE,
  bindChanging: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var Switch = {
  checked: DEFAULT_FALSE,
  disabled: NO_DEFAULT_VALUE,
  type: singleQuote('switch'),
  color: singleQuote('#04BE02'),
  bindChange: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var Textarea = {
  value: NO_DEFAULT_VALUE,
  placeholder: NO_DEFAULT_VALUE,
  'placeholder-style': NO_DEFAULT_VALUE,
  'placeholder-class': singleQuote('textarea-placeholder'),
  disabled: NO_DEFAULT_VALUE,
  maxlength: '140',
  'auto-focus': DEFAULT_FALSE,
  focus: DEFAULT_FALSE,
  'auto-height': DEFAULT_FALSE,
  fixed: DEFAULT_FALSE,
  'cursor-spacing': '0',
  cursor: '-1',
  'selection-start': '-1',
  'selection-end': '-1',
  bindFocus: NO_DEFAULT_VALUE,
  bindBlur: NO_DEFAULT_VALUE,
  bindLineChange: NO_DEFAULT_VALUE,
  bindInput: NO_DEFAULT_VALUE,
  bindConfirm: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE
};
var CoverImage = {
  src: NO_DEFAULT_VALUE,
  bindLoad: 'eh',
  bindError: 'eh'
};
var CoverView = Object.assign({
  'scroll-top': DEFAULT_FALSE
}, touchEvents);
var MovableArea = {
  'scale-area': DEFAULT_FALSE
};
var MovableView = Object.assign(Object.assign({
  direction: 'none',
  inertia: DEFAULT_FALSE,
  'out-of-bounds': DEFAULT_FALSE,
  x: NO_DEFAULT_VALUE,
  y: NO_DEFAULT_VALUE,
  damping: '20',
  friction: '2',
  disabled: NO_DEFAULT_VALUE,
  scale: DEFAULT_FALSE,
  'scale-min': '0.5',
  'scale-max': '10',
  'scale-value': '1',
  bindChange: NO_DEFAULT_VALUE,
  bindScale: NO_DEFAULT_VALUE,
  bindHTouchMove: NO_DEFAULT_VALUE,
  bindVTouchMove: NO_DEFAULT_VALUE,
  width: singleQuote('10px'),
  height: singleQuote('10px')
}, touchEvents), animation);
var ScrollView = Object.assign(Object.assign({
  'scroll-x': DEFAULT_FALSE,
  'scroll-y': DEFAULT_FALSE,
  'upper-threshold': '50',
  'lower-threshold': '50',
  'scroll-top': NO_DEFAULT_VALUE,
  'scroll-left': NO_DEFAULT_VALUE,
  'scroll-into-view': NO_DEFAULT_VALUE,
  'scroll-with-animation': DEFAULT_FALSE,
  'enable-back-to-top': DEFAULT_FALSE,
  bindScrollToUpper: NO_DEFAULT_VALUE,
  bindScrollToLower: NO_DEFAULT_VALUE,
  bindScroll: NO_DEFAULT_VALUE
}, touchEvents), animation);
var Swiper = Object.assign({
  'indicator-dots': DEFAULT_FALSE,
  'indicator-color': singleQuote('rgba(0, 0, 0, .3)'),
  'indicator-active-color': singleQuote('#000000'),
  autoplay: DEFAULT_FALSE,
  current: '0',
  interval: '5000',
  duration: '500',
  circular: DEFAULT_FALSE,
  vertical: DEFAULT_FALSE,
  'previous-margin': singleQuote('0px'),
  'next-margin': singleQuote('0px'),
  'display-multiple-items': '1',
  bindChange: NO_DEFAULT_VALUE,
  bindTransition: NO_DEFAULT_VALUE,
  bindAnimationFinish: NO_DEFAULT_VALUE
}, touchEvents);
var SwiperItem = {
  'item-id': NO_DEFAULT_VALUE
};
var Navigator = {
  url: NO_DEFAULT_VALUE,
  'open-type': singleQuote('navigate'),
  delta: '1',
  'hover-class': singleQuote('navigator-hover'),
  'hover-stop-propagation': DEFAULT_FALSE,
  'hover-start-time': '50',
  'hover-stay-time': '600',
  bindSuccess: NO_DEFAULT_VALUE,
  bindFail: NO_DEFAULT_VALUE,
  bindComplete: NO_DEFAULT_VALUE
};
var Audio = {
  id: NO_DEFAULT_VALUE,
  src: NO_DEFAULT_VALUE,
  loop: DEFAULT_FALSE,
  controls: DEFAULT_FALSE,
  poster: NO_DEFAULT_VALUE,
  name: NO_DEFAULT_VALUE,
  author: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE,
  bindPlay: NO_DEFAULT_VALUE,
  bindPause: NO_DEFAULT_VALUE,
  bindTimeUpdate: NO_DEFAULT_VALUE,
  bindEnded: NO_DEFAULT_VALUE
};
var Camera = {
  'device-position': singleQuote('back'),
  flash: singleQuote('auto'),
  bindStop: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE
};
var Image = Object.assign({
  src: NO_DEFAULT_VALUE,
  mode: singleQuote('scaleToFill'),
  'lazy-load': DEFAULT_FALSE,
  bindError: NO_DEFAULT_VALUE,
  bindLoad: NO_DEFAULT_VALUE
}, touchEvents);
var LivePlayer = Object.assign({
  src: NO_DEFAULT_VALUE,
  autoplay: DEFAULT_FALSE,
  muted: DEFAULT_FALSE,
  orientation: singleQuote('vertical'),
  'object-fit': singleQuote('contain'),
  'background-mute': DEFAULT_FALSE,
  'min-cache': '1',
  'max-cache': '3',
  bindStateChange: NO_DEFAULT_VALUE,
  bindFullScreenChange: NO_DEFAULT_VALUE,
  bindNetStatus: NO_DEFAULT_VALUE
}, animation);
var Video = Object.assign({
  src: NO_DEFAULT_VALUE,
  duration: NO_DEFAULT_VALUE,
  controls: DEFAULT_TRUE,
  'danmu-list': NO_DEFAULT_VALUE,
  'danmu-btn': NO_DEFAULT_VALUE,
  'enable-danmu': NO_DEFAULT_VALUE,
  autoplay: DEFAULT_FALSE,
  loop: DEFAULT_FALSE,
  muted: DEFAULT_FALSE,
  'initial-time': '0',
  'page-gesture': DEFAULT_FALSE,
  direction: NO_DEFAULT_VALUE,
  'show-progress': DEFAULT_TRUE,
  'show-fullscreen-btn': DEFAULT_TRUE,
  'show-play-btn': DEFAULT_TRUE,
  'show-center-play-btn': DEFAULT_TRUE,
  'enable-progress-gesture': DEFAULT_TRUE,
  'object-fit': singleQuote('contain'),
  poster: NO_DEFAULT_VALUE,
  'show-mute-btn': DEFAULT_FALSE,
  bindPlay: NO_DEFAULT_VALUE,
  bindPause: NO_DEFAULT_VALUE,
  bindEnded: NO_DEFAULT_VALUE,
  bindTimeUpdate: NO_DEFAULT_VALUE,
  bindFullScreenChange: NO_DEFAULT_VALUE,
  bindWaiting: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE
}, animation);
var Canvas = Object.assign({
  'canvas-id': NO_DEFAULT_VALUE,
  'disable-scroll': DEFAULT_FALSE,
  bindError: NO_DEFAULT_VALUE
}, touchEvents);
var Ad = {
  'unit-id': NO_DEFAULT_VALUE,
  'ad-intervals': NO_DEFAULT_VALUE,
  bindLoad: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE,
  bindClose: NO_DEFAULT_VALUE
};
var WebView = {
  src: NO_DEFAULT_VALUE,
  bindMessage: NO_DEFAULT_VALUE,
  bindLoad: NO_DEFAULT_VALUE,
  bindError: NO_DEFAULT_VALUE
};
var Block = {};
// For Vue，因为 slot 标签被 vue 占用了
var SlotView = {
  name: NO_DEFAULT_VALUE
};
// For React
// Slot 和 SlotView 最终都会编译成 <view slot={{ i.name }} />
// 因为 <slot name="{{ i.name }}" /> 适用性没有前者高（无法添加类和样式）
// 不给 View 直接加 slot 属性的原因是性能损耗
var Slot = {
  name: NO_DEFAULT_VALUE
};
var NativeSlot = {
  name: NO_DEFAULT_VALUE
};
var Script = {};
var internalComponents = {
  View: View,
  Icon: Icon,
  Progress: Progress,
  RichText: RichText,
  Text: Text,
  Button: Button,
  Checkbox: Checkbox,
  CheckboxGroup: CheckboxGroup,
  Form: Form,
  Input: Input,
  Label: Label,
  Picker: Picker,
  PickerView: PickerView,
  PickerViewColumn: PickerViewColumn,
  Radio: Radio,
  RadioGroup: RadioGroup,
  Slider: Slider,
  Switch: Switch,
  CoverImage: CoverImage,
  Textarea: Textarea,
  CoverView: CoverView,
  MovableArea: MovableArea,
  MovableView: MovableView,
  ScrollView: ScrollView,
  Swiper: Swiper,
  SwiperItem: SwiperItem,
  Navigator: Navigator,
  Audio: Audio,
  Camera: Camera,
  Image: Image,
  LivePlayer: LivePlayer,
  Video: Video,
  Canvas: Canvas,
  Ad: Ad,
  WebView: WebView,
  Block: Block,
  Map: MapComp,
  Slot: Slot,
  SlotView: SlotView,
  NativeSlot: NativeSlot,
  Script: Script
};
var controlledComponent = new Set(['input', 'checkbox', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea']);
var focusComponents = new Set(['input', 'textarea']);
var voidElements = new Set(['progress', 'icon', 'rich-text', 'input', 'textarea', 'slider', 'switch', 'audio', 'ad', 'official-account', 'open-data', 'navigation-bar']);
var nestElements = new Map([['view', -1], ['catch-view', -1], ['cover-view', -1], ['static-view', -1], ['pure-view', -1], ['click-view', -1], ['block', -1], ['text', -1], ['static-text', 6], ['slot', 8], ['slot-view', 8], ['label', 6], ['form', 4], ['scroll-view', 4], ['swiper', 4], ['swiper-item', 4]]);


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/constants.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/constants.js ***!
  \***********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PLATFORM_CONFIG_MAP: function() { return /* binding */ PLATFORM_CONFIG_MAP; },
/* harmony export */   PLATFORM_TYPE: function() { return /* binding */ PLATFORM_TYPE; }
/* harmony export */ });
/* unused harmony exports COMPILE_MODE_IDENTIFIER_PREFIX, COMPILE_MODE_SUB_RENDER_FN */
var PLATFORM_TYPE;
(function (PLATFORM_TYPE) {
  PLATFORM_TYPE["MINI"] = "mini";
  PLATFORM_TYPE["WEB"] = "web";
  PLATFORM_TYPE["RN"] = "rn";
  PLATFORM_TYPE["HARMONY"] = "harmony";
  PLATFORM_TYPE["QUICK"] = "quickapp";
})(PLATFORM_TYPE || (PLATFORM_TYPE = {}));
var COMPILE_MODE_IDENTIFIER_PREFIX = 'f';
var COMPILE_MODE_SUB_RENDER_FN = 'subRenderFn';
var PLATFORM_CONFIG_MAP = {
  h5: {
    type: PLATFORM_TYPE.WEB
  },
  harmony: {
    type: PLATFORM_TYPE.HARMONY
  },
  mini: {
    type: PLATFORM_TYPE.MINI
  },
  rn: {
    type: PLATFORM_TYPE.RN
  },
  quickapp: {
    type: PLATFORM_TYPE.QUICK
  }
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Events: function() { return /* binding */ Events; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/typeof.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");



var Events = /*#__PURE__*/function () {
  function Events(opts) {
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, Events);
    var _a;
    this.callbacks = (_a = opts === null || opts === void 0 ? void 0 : opts.callbacks) !== null && _a !== void 0 ? _a : {};
  }
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Events, [{
    key: "on",
    value: function on(eventName, callback, context) {
      var event, tail, _eventName;
      if (!callback) {
        return this;
      }
      if ((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__["default"])(eventName) === 'symbol') {
        _eventName = [eventName];
      } else {
        _eventName = eventName.split(Events.eventSplitter);
      }
      this.callbacks || (this.callbacks = {});
      var calls = this.callbacks;
      while (event = _eventName.shift()) {
        var list = calls[event];
        var node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {
          tail: tail,
          next: list ? list.next : node
        };
      }
      return this;
    }
  }, {
    key: "once",
    value: function once(events, callback, context) {
      var _this = this;
      var _wrapper = function wrapper() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(_this, args);
        _this.off(events, _wrapper, context);
      };
      this.on(events, _wrapper, context);
      return this;
    }
  }, {
    key: "off",
    value: function off(events, callback, context) {
      var event, calls, _events;
      if (!(calls = this.callbacks)) {
        return this;
      }
      if (!(events || callback || context)) {
        delete this.callbacks;
        return this;
      }
      if ((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__["default"])(events) === 'symbol') {
        _events = [events];
      } else {
        _events = events ? events.split(Events.eventSplitter) : Object.keys(calls);
      }
      while (event = _events.shift()) {
        var node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) {
          continue;
        }
        var tail = node.tail;
        while ((node = node.next) !== tail) {
          var cb = node.callback;
          var ctx = node.context;
          if (callback && cb !== callback || context && ctx !== context) {
            this.on(event, cb, ctx);
          }
        }
      }
      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(events) {
      var event, node, calls, _events;
      if (!(calls = this.callbacks)) {
        return this;
      }
      if ((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__["default"])(events) === 'symbol') {
        _events = [events];
      } else {
        _events = events.split(Events.eventSplitter);
      }
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      while (event = _events.shift()) {
        if (node = calls[event]) {
          var tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }
      return this;
    }
  }]);
}();
Events.eventSplitter = ','; // Note: Harmony ACE API 8 开发板不支持使用正则 split 字符串 /\s+/



/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js ***!
  \****************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isArray: function() { return /* binding */ isArray; },
/* harmony export */   isBoolean: function() { return /* binding */ isBoolean; },
/* harmony export */   isFunction: function() { return /* binding */ isFunction; },
/* harmony export */   isNull: function() { return /* binding */ isNull; },
/* harmony export */   isNumber: function() { return /* binding */ isNumber; },
/* harmony export */   isObject: function() { return /* binding */ isObject; },
/* harmony export */   isString: function() { return /* binding */ isString; },
/* harmony export */   isUndefined: function() { return /* binding */ isUndefined; }
/* harmony export */ });
/* unused harmony exports isBooleanStringLiteral, isObjectStringLiteral, isWebPlatform */
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/typeof.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/typeof.js");

function isString(o) {
  return typeof o === 'string';
}
function isUndefined(o) {
  return typeof o === 'undefined';
}
function isNull(o) {
  return o === null;
}
function isObject(o) {
  return o !== null && (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o) === 'object';
}
function isBoolean(o) {
  return o === true || o === false;
}
function isFunction(o) {
  return typeof o === 'function';
}
function isNumber(o) {
  if (Number.isFinite) return Number.isFinite(o);
  return typeof o === 'number';
}
function isBooleanStringLiteral(o) {
  return o === 'true' || o === 'false';
}
function isObjectStringLiteral(o) {
  return o === '{}';
}
var isArray = Array.isArray;
var isWebPlatform = function isWebPlatform() {
  return  false || "mini" === 'web';
};


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/native-apis.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/native-apis.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   processApis: function() { return /* binding */ processApis; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is.js */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js");



var needPromiseApis = new Set(['addPhoneContact', 'authorize', 'canvasGetImageData', 'canvasPutImageData', 'canvasToTempFilePath', 'checkSession', 'chooseAddress', 'chooseImage', 'chooseInvoiceTitle', 'chooseLocation', 'chooseVideo', 'clearStorage', 'closeBLEConnection', 'closeBluetoothAdapter', 'closeSocket', 'compressImage', 'connectSocket', 'createBLEConnection', 'downloadFile', 'exitMiniProgram', 'getAvailableAudioSources', 'getBLEDeviceCharacteristics', 'getBLEDeviceServices', 'getBatteryInfo', 'getBeacons', 'getBluetoothAdapterState', 'getBluetoothDevices', 'getClipboardData', 'getConnectedBluetoothDevices', 'getConnectedWifi', 'getExtConfig', 'getFileInfo', 'getImageInfo', 'getLocation', 'getNetworkType', 'getSavedFileInfo', 'getSavedFileList', 'getScreenBrightness', 'getSetting', 'getStorage', 'getStorageInfo', 'getSystemInfo', 'getUserInfo', 'getWifiList', 'hideHomeButton', 'hideShareMenu', 'hideTabBar', 'hideTabBarRedDot', 'loadFontFace', 'login', 'makePhoneCall', 'navigateBack', 'navigateBackMiniProgram', 'navigateTo', 'navigateToBookshelf', 'navigateToMiniProgram', 'notifyBLECharacteristicValueChange', 'hideKeyboard', 'hideLoading', 'hideNavigationBarLoading', 'hideToast', 'openBluetoothAdapter', 'openDocument', 'openLocation', 'openSetting', 'pageScrollTo', 'previewImage', 'queryBookshelf', 'reLaunch', 'readBLECharacteristicValue', 'redirectTo', 'removeSavedFile', 'removeStorage', 'removeTabBarBadge', 'requestSubscribeMessage', 'saveFile', 'saveImageToPhotosAlbum', 'saveVideoToPhotosAlbum', 'scanCode', 'sendSocketMessage', 'setBackgroundColor', 'setBackgroundTextStyle', 'setClipboardData', 'setEnableDebug', 'setInnerAudioOption', 'setKeepScreenOn', 'setNavigationBarColor', 'setNavigationBarTitle', 'setScreenBrightness', 'setStorage', 'setTabBarBadge', 'setTabBarItem', 'setTabBarStyle', 'showActionSheet', 'showFavoriteGuide', 'showLoading', 'showModal', 'showShareMenu', 'showTabBar', 'showTabBarRedDot', 'showToast', 'startBeaconDiscovery', 'startBluetoothDevicesDiscovery', 'startDeviceMotionListening', 'startPullDownRefresh', 'stopBeaconDiscovery', 'stopBluetoothDevicesDiscovery', 'stopCompass', 'startCompass', 'startAccelerometer', 'stopAccelerometer', 'showNavigationBarLoading', 'stopDeviceMotionListening', 'stopPullDownRefresh', 'switchTab', 'uploadFile', 'vibrateLong', 'vibrateShort', 'writeBLECharacteristicValue']);
function getCanIUseWebp(taro) {
  return function () {
    var _a;
    var res = (_a = taro.getSystemInfoSync) === null || _a === void 0 ? void 0 : _a.call(taro);
    if (!res) {
      if (true) {
        console.error('不支持 API canIUseWebp');
      }
      return false;
    }
    var platform = res.platform;
    var platformLower = platform.toLowerCase();
    if (platformLower === 'android' || platformLower === 'devtools') {
      return true;
    }
    return false;
  };
}
function getNormalRequest(global) {
  return function request(options) {
    options = options ? (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isString)(options) ? {
      url: options
    } : options : {};
    var originSuccess = options.success;
    var originFail = options.fail;
    var originComplete = options.complete;
    var requestTask;
    var p = new Promise(function (resolve, reject) {
      options.success = function (res) {
        originSuccess && originSuccess(res);
        resolve(res);
      };
      options.fail = function (res) {
        originFail && originFail(res);
        reject(res);
      };
      options.complete = function (res) {
        originComplete && originComplete(res);
      };
      requestTask = global.request(options);
    });
    equipTaskMethodsIntoPromise(requestTask, p);
    p.abort = function (cb) {
      cb && cb();
      if (requestTask) {
        requestTask.abort();
      }
      return p;
    };
    return p;
  };
}
function processApis(taro, global) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var patchNeedPromiseApis = config.needPromiseApis || [];
  var _needPromiseApis = new Set([].concat((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(patchNeedPromiseApis), (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_toConsumableArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(needPromiseApis)));
  var preserved = ['getEnv', 'interceptors', 'Current', 'getCurrentInstance', 'options', 'nextTick', 'eventCenter', 'Events', 'preload', 'webpackJsonp'];
  var apis = new Set(!config.isOnlyPromisify ? Object.keys(global).filter(function (api) {
    return preserved.indexOf(api) === -1;
  }) : patchNeedPromiseApis);
  if (config.modifyApis) {
    config.modifyApis(apis);
  }
  apis.forEach(function (key) {
    if (_needPromiseApis.has(key)) {
      var originKey = key;
      taro[originKey] = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var key = originKey;
        // 第一个参数 options 为字符串，单独处理
        if (typeof options === 'string') {
          if (args.length) {
            return global[key].apply(global, [options].concat(args));
          }
          return global[key](options);
        }
        // 改变 key 或 option 字段，如需要把支付宝标准的字段对齐微信标准的字段
        if (config.transformMeta) {
          var transformResult = config.transformMeta(key, options);
          key = transformResult.key;
          options = transformResult.options;
          // 新 key 可能不存在
          if (!global.hasOwnProperty(key)) {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.nonsupport)(key)();
          }
        }
        var task = null;
        var obj = Object.assign({}, options);
        // 为页面跳转相关的 API 设置一个随机数作为路由参数。为了给 runtime 区分页面。
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.setUniqueKeyToRoute)(key, options);
        // Promise 化
        var p = new Promise(function (resolve, reject) {
          obj.success = function (res) {
            var _a, _b;
            (_a = config.modifyAsyncResult) === null || _a === void 0 ? void 0 : _a.call(config, key, res);
            (_b = options.success) === null || _b === void 0 ? void 0 : _b.call(options, res);
            if (key === 'connectSocket') {
              resolve(Promise.resolve().then(function () {
                return task ? Object.assign(task, res) : res;
              }));
            } else {
              resolve(res);
            }
          };
          obj.fail = function (res) {
            var _a;
            (_a = options.fail) === null || _a === void 0 ? void 0 : _a.call(options, res);
            reject(res);
          };
          obj.complete = function (res) {
            var _a;
            (_a = options.complete) === null || _a === void 0 ? void 0 : _a.call(options, res);
          };
          if (args.length) {
            task = global[key].apply(global, [obj].concat(args));
          } else {
            task = global[key](obj);
          }
        });
        // 给 promise 对象挂载属性
        if (['uploadFile', 'downloadFile'].includes(key)) {
          equipTaskMethodsIntoPromise(task, p);
          p.progress = function (cb) {
            task === null || task === void 0 ? void 0 : task.onProgressUpdate(cb);
            return p;
          };
          p.abort = function (cb) {
            cb === null || cb === void 0 ? void 0 : cb();
            task === null || task === void 0 ? void 0 : task.abort();
            return p;
          };
        }
        return p;
      };
    } else {
      var platformKey = key;
      // 改变 key 或 option 字段，如需要把支付宝标准的字段对齐微信标准的字段
      if (config.transformMeta) {
        platformKey = config.transformMeta(key, {}).key;
      }
      // API 不存在
      if (!global.hasOwnProperty(platformKey)) {
        taro[key] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.nonsupport)(key);
        return;
      }
      if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(global[key])) {
        taro[key] = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          if (config.handleSyncApis) {
            return config.handleSyncApis(key, global, args);
          } else {
            return global[platformKey].apply(global, args);
          }
        };
      } else {
        taro[key] = global[platformKey];
      }
    }
  });
  !config.isOnlyPromisify && equipCommonApis(taro, global, config);
}
/**
 * 挂载常用 API
 * @param taro Taro 对象
 * @param global 小程序全局对象，如微信的 wx，支付宝的 my
 */
function equipCommonApis(taro, global) {
  var apis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  taro.canIUseWebp = getCanIUseWebp(taro);
  taro.getCurrentPages = getCurrentPages || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.nonsupport)('getCurrentPages');
  taro.getApp = getApp || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.nonsupport)('getApp');
  taro.env = global.env || {};
  try {
    taro.requirePlugin = requirePlugin || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.nonsupport)('requirePlugin');
  } catch (error) {
    taro.requirePlugin = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.nonsupport)('requirePlugin');
  }
  // request & interceptors
  var request = apis.request || getNormalRequest(global);
  function taroInterceptor(chain) {
    return request(chain.requestParams);
  }
  var link = new taro.Link(taroInterceptor);
  taro.request = link.request.bind(link);
  taro.addInterceptor = link.addInterceptor.bind(link);
  taro.cleanInterceptors = link.cleanInterceptors.bind(link);
  taro.miniGlobal = taro.options.miniGlobal = global;
  taro.getAppInfo = function () {
    return {
      platform: "mini" || 0,
      taroVersion: "4.0.8" || 0,
      designWidth: taro.config.designWidth
    };
  };
  taro.createSelectorQuery = delayRef(taro, global, 'createSelectorQuery', 'exec');
  taro.createIntersectionObserver = delayRef(taro, global, 'createIntersectionObserver', 'observe');
}
/**
 * 将Task对象中的方法挂载到promise对象中，适配小程序api原生返回结果
 * @param task Task对象 {RequestTask | DownloadTask | UploadTask}
 * @param promise Promise
 */
function equipTaskMethodsIntoPromise(task, promise) {
  if (!task || !promise) return;
  var taskMethods = ['abort', 'onHeadersReceived', 'offHeadersReceived', 'onProgressUpdate', 'offProgressUpdate', 'onChunkReceived', 'offChunkReceived'];
  task && taskMethods.forEach(function (method) {
    if (method in task) {
      promise[method] = task[method].bind(task);
    }
  });
}
function delayRef(taro, global, name, method) {
  return function () {
    var res = global[name].apply(global, arguments);
    var raw = res[method].bind(res);
    res[method] = function () {
      for (var _len3 = arguments.length, methodArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        methodArgs[_key3] = arguments[_key3];
      }
      taro.nextTick(function () {
        return raw.apply(void 0, methodArgs);
      });
    };
    return res;
  };
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js ***!
  \***************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hooks: function() { return /* binding */ hooks; }
/* harmony export */ });
/* unused harmony exports HOOK_TYPE, TaroHook, TaroHooks */
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _event_emitter_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./event-emitter.js */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/event-emitter.js");
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./is.js */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/is.js");






var HOOK_TYPE;
(function (HOOK_TYPE) {
  HOOK_TYPE[HOOK_TYPE["SINGLE"] = 0] = "SINGLE";
  HOOK_TYPE[HOOK_TYPE["MULTI"] = 1] = "MULTI";
  HOOK_TYPE[HOOK_TYPE["WATERFALL"] = 2] = "WATERFALL";
})(HOOK_TYPE || (HOOK_TYPE = {}));
var defaultMiniLifecycle = {
  app: ['onLaunch', 'onShow', 'onHide'],
  page: ['onLoad', 'onUnload', 'onReady', 'onShow', 'onHide', ['onPullDownRefresh', 'onReachBottom', 'onPageScroll', 'onResize', 'defer:onTabItemTap',
  // defer: 需要等页面组件挂载后再调用
  'onTitleClick', 'onOptionMenuClick', 'onPopMenuClick', 'onPullIntercept', 'onAddToFavorites'], ['onShareAppMessage', 'onShareTimeline']],
  component: ['attached', 'detached']
};
function TaroHook(type, initial) {
  return {
    type: type,
    initial: initial || null
  };
}
var TaroHooks = /*#__PURE__*/function (_Events) {
  function TaroHooks(hooks, opts) {
    var _this;
    (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, TaroHooks);
    _this = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, TaroHooks, [opts]);
    _this.hooks = hooks;
    for (var hookName in hooks) {
      var initial = hooks[hookName].initial;
      if ((0,_is_js__WEBPACK_IMPORTED_MODULE_2__.isFunction)(initial)) {
        _this.on(hookName, initial);
      }
    }
    return _this;
  }
  (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_3__["default"])(TaroHooks, _Events);
  return (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_4__["default"])(TaroHooks, [{
    key: "tapOneOrMany",
    value: function tapOneOrMany(hookName, callback) {
      var _this2 = this;
      var list = (0,_is_js__WEBPACK_IMPORTED_MODULE_2__.isFunction)(callback) ? [callback] : callback;
      list.forEach(function (cb) {
        return _this2.on(hookName, cb);
      });
    }
  }, {
    key: "tap",
    value: function tap(hookName, callback) {
      var hooks = this.hooks;
      var _hooks$hookName = hooks[hookName],
        type = _hooks$hookName.type,
        initial = _hooks$hookName.initial;
      if (type === HOOK_TYPE.SINGLE) {
        this.off(hookName);
        this.on(hookName, (0,_is_js__WEBPACK_IMPORTED_MODULE_2__.isFunction)(callback) ? callback : callback[callback.length - 1]);
      } else {
        initial && this.off(hookName, initial);
        this.tapOneOrMany(hookName, callback);
      }
    }
  }, {
    key: "call",
    value: function call(hookName) {
      var _a;
      var hook = this.hooks[hookName];
      if (!hook) return;
      var type = hook.type;
      var calls = this.callbacks;
      if (!calls) return;
      var list = calls[hookName];
      if (list) {
        var tail = list.tail;
        var node = list.next;
        for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }
        var args = rest;
        var res;
        while (node !== tail) {
          res = (_a = node.callback) === null || _a === void 0 ? void 0 : _a.apply(node.context || this, args);
          if (type === HOOK_TYPE.WATERFALL) {
            var params = [res];
            args = params;
          }
          node = node.next;
        }
        return res;
      }
    }
  }, {
    key: "isExist",
    value: function isExist(hookName) {
      var _a;
      return Boolean((_a = this.callbacks) === null || _a === void 0 ? void 0 : _a[hookName]);
    }
  }]);
}(_event_emitter_js__WEBPACK_IMPORTED_MODULE_5__.Events);
var hooks = new TaroHooks({
  getMiniLifecycle: TaroHook(HOOK_TYPE.SINGLE, function (defaultConfig) {
    return defaultConfig;
  }),
  getMiniLifecycleImpl: TaroHook(HOOK_TYPE.SINGLE, function () {
    return this.call('getMiniLifecycle', defaultMiniLifecycle);
  }),
  getLifecycle: TaroHook(HOOK_TYPE.SINGLE, function (instance, lifecycle) {
    return instance[lifecycle];
  }),
  modifyRecursiveComponentConfig: TaroHook(HOOK_TYPE.SINGLE, function (defaultConfig) {
    return defaultConfig;
  }),
  getPathIndex: TaroHook(HOOK_TYPE.SINGLE, function (indexOfNode) {
    return "[".concat(indexOfNode, "]");
  }),
  getEventCenter: TaroHook(HOOK_TYPE.SINGLE, function (Events) {
    return new Events();
  }),
  isBubbleEvents: TaroHook(HOOK_TYPE.SINGLE, function (eventName) {
    /**
     * 支持冒泡的事件, 除 支付宝小程序外，其余的可冒泡事件都和微信保持一致
     * 详见 见 https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/event.html
     */
    var BUBBLE_EVENTS = new Set(['touchstart', 'touchmove', 'touchcancel', 'touchend', 'touchforcechange', 'tap', 'longpress', 'longtap', 'transitionend', 'animationstart', 'animationiteration', 'animationend']);
    return BUBBLE_EVENTS.has(eventName);
  }),
  getSpecialNodes: TaroHook(HOOK_TYPE.SINGLE, function () {
    return ['view', 'text', 'image'];
  }),
  onRemoveAttribute: TaroHook(HOOK_TYPE.SINGLE),
  batchedEventUpdates: TaroHook(HOOK_TYPE.SINGLE),
  mergePageInstance: TaroHook(HOOK_TYPE.SINGLE),
  modifyPageObject: TaroHook(HOOK_TYPE.SINGLE),
  createPullDownComponent: TaroHook(HOOK_TYPE.SINGLE),
  getDOMNode: TaroHook(HOOK_TYPE.SINGLE),
  modifyHydrateData: TaroHook(HOOK_TYPE.SINGLE),
  transferHydrateData: TaroHook(HOOK_TYPE.SINGLE),
  modifySetAttrPayload: TaroHook(HOOK_TYPE.SINGLE),
  modifyRmAttrPayload: TaroHook(HOOK_TYPE.SINGLE),
  onAddEvent: TaroHook(HOOK_TYPE.SINGLE),
  proxyToRaw: TaroHook(HOOK_TYPE.SINGLE, function (proxyObj) {
    return proxyObj;
  }),
  modifyMpEvent: TaroHook(HOOK_TYPE.MULTI),
  modifyMpEventImpl: TaroHook(HOOK_TYPE.SINGLE, function (e) {
    try {
      // 有些小程序的事件对象的某些属性只读
      this.call('modifyMpEvent', e);
    } catch (error) {
      console.warn('[Taro modifyMpEvent hook Error]: ' + (error === null || error === void 0 ? void 0 : error.message));
    }
  }),
  injectNewStyleProperties: TaroHook(HOOK_TYPE.SINGLE),
  modifyTaroEvent: TaroHook(HOOK_TYPE.MULTI),
  dispatchTaroEvent: TaroHook(HOOK_TYPE.SINGLE, function (e, node) {
    node.dispatchEvent(e);
  }),
  dispatchTaroEventFinish: TaroHook(HOOK_TYPE.MULTI),
  modifyTaroEventReturn: TaroHook(HOOK_TYPE.SINGLE, function () {
    return undefined;
  }),
  modifyDispatchEvent: TaroHook(HOOK_TYPE.MULTI),
  initNativeApi: TaroHook(HOOK_TYPE.MULTI),
  patchElement: TaroHook(HOOK_TYPE.MULTI),
  modifyAddEventListener: TaroHook(HOOK_TYPE.SINGLE),
  modifyRemoveEventListener: TaroHook(HOOK_TYPE.SINGLE),
  getMemoryLevel: TaroHook(HOOK_TYPE.SINGLE)
});


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/utils.js ***!
  \*******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_OBJ: function() { return /* binding */ EMPTY_OBJ; },
/* harmony export */   capitalize: function() { return /* binding */ capitalize; },
/* harmony export */   ensure: function() { return /* binding */ ensure; },
/* harmony export */   getComponentsAlias: function() { return /* binding */ getComponentsAlias; },
/* harmony export */   mergeInternalComponents: function() { return /* binding */ mergeInternalComponents; },
/* harmony export */   mergeReconciler: function() { return /* binding */ mergeReconciler; },
/* harmony export */   nonsupport: function() { return /* binding */ nonsupport; },
/* harmony export */   noop: function() { return /* binding */ noop; },
/* harmony export */   setUniqueKeyToRoute: function() { return /* binding */ setUniqueKeyToRoute; },
/* harmony export */   toCamelCase: function() { return /* binding */ toCamelCase; },
/* harmony export */   toDashed: function() { return /* binding */ toDashed; },
/* harmony export */   warn: function() { return /* binding */ warn; }
/* harmony export */ });
/* unused harmony exports EMPTY_ARR, box, cacheDataGet, cacheDataHas, cacheDataSet, getPlatformType, getUniqueKey, hasOwn, indent, queryToJson, toKebabCase, unbox */
/* harmony import */ var _components_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components.js */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/components.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/constants.js");
/* harmony import */ var _runtime_hooks_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./runtime-hooks.js */ "./node_modules/.pnpm/@tarojs+shared@4.0.8/node_modules/@tarojs/shared/dist/runtime-hooks.js");



var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var noop = function noop() {};
/**
 * box creates a boxed value.
 *
 * @typeparam T Value type.
 * @param v Value.
 * @returns Boxed value.
 */
var box = function box(v) {
  return {
    v: v
  };
};
/**
 * box creates a boxed value.
 *
 * @typeparam T Value type.
 * @param b Boxed value.
 * @returns Value.
 */
var unbox = function unbox(b) {
  return b.v;
};
function toDashed(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
function toCamelCase(s) {
  var camel = '';
  var nextCap = false;
  for (var i = 0; i < s.length; i++) {
    if (s[i] !== '-') {
      camel += nextCap ? s[i].toUpperCase() : s[i];
      nextCap = false;
    } else {
      nextCap = true;
    }
  }
  return camel;
}
var toKebabCase = function toKebabCase(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key);
};
/**
 * ensure takes a condition and throw a error if the condition fails,
 * like failure::ensure: https://docs.rs/failure/0.1.1/failure/macro.ensure.html
 * @param condition condition.
 * @param msg error message.
 */
function ensure(condition, msg) {
  if (!condition) {
    if (true) {
      var reportIssue = '\n如有疑问，请提交 issue 至：https://github.com/nervjs/taro/issues';
      throw new Error(msg + reportIssue);
    } else {}
  }
}
function warn(condition, msg) {
  if (true) {
    if (condition) {
      console.warn("[taro warn] ".concat(msg));
    }
  }
}
function queryToJson(str) {
  var dec = decodeURIComponent;
  var qp = str.split('&');
  var ret = {};
  var name;
  var val;
  for (var i = 0, l = qp.length, item; i < l; ++i) {
    item = qp[i];
    if (item.length) {
      var s = item.indexOf('=');
      if (s < 0) {
        name = dec(item);
        val = '';
      } else {
        name = dec(item.slice(0, s));
        val = dec(item.slice(s + 1));
      }
      if (typeof ret[name] === 'string') {
        // inline'd type check
        ret[name] = [ret[name]];
      }
      if (Array.isArray(ret[name])) {
        ret[name].push(val);
      } else {
        ret[name] = val;
      }
    }
  }
  return ret; // Object
}
var _uniqueId = 1;
var _loadTime = new Date().getTime().toString();
function getUniqueKey() {
  return _loadTime + _uniqueId++;
}
var cacheData = {};
function cacheDataSet(key, val) {
  cacheData[key] = val;
}
function cacheDataGet(key, delelteAfterGet) {
  var temp = cacheData[key];
  delelteAfterGet && delete cacheData[key];
  return temp;
}
function cacheDataHas(key) {
  return key in cacheData;
}
function mergeInternalComponents(components) {
  Object.keys(components).forEach(function (name) {
    if (name in _components_js__WEBPACK_IMPORTED_MODULE_0__.internalComponents) {
      Object.assign(_components_js__WEBPACK_IMPORTED_MODULE_0__.internalComponents[name], components[name]);
    } else {
      _components_js__WEBPACK_IMPORTED_MODULE_0__.internalComponents[name] = components[name];
    }
  });
  return _components_js__WEBPACK_IMPORTED_MODULE_0__.internalComponents;
}
function getComponentsAlias(origin) {
  var mapping = {};
  var viewAttrs = origin.View;
  var extraList = {
    '#text': {},
    StaticView: viewAttrs,
    StaticImage: origin.Image,
    StaticText: origin.Text,
    PureView: viewAttrs,
    CatchView: viewAttrs,
    ClickView: viewAttrs
  };
  origin = Object.assign(Object.assign({}, origin), extraList);
  Object.keys(origin).sort(function (a, b) {
    var reg = /^(Static|Pure|Catch|Click)*(View|Image|Text)$/;
    var isACommonly = reg.test(a);
    var isBCommonly = reg.test(b);
    if (isACommonly && isBCommonly) {
      return a > b ? 1 : -1;
    } else if (isACommonly) {
      return -1;
    } else if (isBCommonly) {
      return 1;
    } else {
      return a >= b ? 1 : -1;
    }
  }).forEach(function (key, num) {
    var obj = {
      _num: String(num)
    };
    Object.keys(origin[key]).filter(function (attr) {
      return !/^bind/.test(attr) && !['focus', 'blur'].includes(attr);
    }).sort().forEach(function (attr, index) {
      obj[toCamelCase(attr)] = 'p' + index;
    });
    mapping[toDashed(key)] = obj;
  });
  return mapping;
}
function getPlatformType() {
  var platform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'weapp';
  var configNameOrType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _constants_js__WEBPACK_IMPORTED_MODULE_1__.PLATFORM_TYPE.MINI;
  if (Object.keys(_constants_js__WEBPACK_IMPORTED_MODULE_1__.PLATFORM_CONFIG_MAP).includes(platform)) {
    configNameOrType = platform;
  }
  var param = _constants_js__WEBPACK_IMPORTED_MODULE_1__.PLATFORM_CONFIG_MAP[configNameOrType] || {};
  return param.type || configNameOrType;
}
function mergeReconciler(hostConfig, hooksForTest) {
  var obj = hooksForTest || _runtime_hooks_js__WEBPACK_IMPORTED_MODULE_2__.hooks;
  var keys = Object.keys(hostConfig);
  keys.forEach(function (key) {
    obj.tap(key, hostConfig[key]);
  });
}
function nonsupport(api) {
  return function () {
    console.warn("\u5C0F\u7A0B\u5E8F\u6682\u4E0D\u652F\u6301 ".concat(api));
  };
}
function setUniqueKeyToRoute(key, obj) {
  var routerParamsPrivateKey = '__key_';
  var useDataCacheApis = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
  if (useDataCacheApis.indexOf(key) > -1) {
    var url = obj.url = obj.url || '';
    var hasMark = url.indexOf('?') > -1;
    var cacheKey = getUniqueKey();
    obj.url += (hasMark ? '&' : '?') + "".concat(routerParamsPrivateKey, "=").concat(cacheKey);
  }
}
function indent(str, size) {
  return str.split('\n').map(function (line, index) {
    var indent = index === 0 ? '' : Array(size).fill(' ').join('');
    return indent + line;
  }).join('\n');
}


/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+taro@4.0.8_@tarojs+components@4.0.8_@tarojs+helper@4.0.8_@swc+helpers@0.5.15__@_28b4aa939e10f4882a0917541e7336fe/node_modules/@tarojs/taro/index.js":
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+taro@4.0.8_@tarojs+components@4.0.8_@tarojs+helper@4.0.8_@swc+helpers@0.5.15__@_28b4aa939e10f4882a0917541e7336fe/node_modules/@tarojs/taro/index.js ***!
  \****************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _require = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/index.js"),
  hooks = _require.hooks;
var taro = (__webpack_require__(/*! @tarojs/api */ "./node_modules/.pnpm/@tarojs+api@4.0.8_@tarojs+runtime@4.0.8_@tarojs+shared@4.0.8/node_modules/@tarojs/api/dist/index.js")["default"]);
if (hooks.isExist('initNativeApi')) {
  hooks.call('initNativeApi', taro);
}
module.exports = taro;
module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+webpack5-runner@4.0.8_@babel+core@7.26.9_@rspack+core@1.2.3_@swc+helpers@0.5.15_1416e50b14411a253e779a25ecdcc52c/node_modules/@tarojs/webpack5-runner/dist/template/comp.js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+webpack5-runner@4.0.8_@babel+core@7.26.9_@rspack+core@1.2.3_@swc+helpers@0.5.15_1416e50b14411a253e779a25ecdcc52c/node_modules/@tarojs/webpack5-runner/dist/template/comp.js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* eslint-disable no-undef */

// @ts-ignore
Component((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createRecursiveComponentConfig)());

/***/ }),

/***/ "./node_modules/.pnpm/@tarojs+webpack5-runner@4.0.8_@babel+core@7.26.9_@rspack+core@1.2.3_@swc+helpers@0.5.15_1416e50b14411a253e779a25ecdcc52c/node_modules/@tarojs/webpack5-runner/dist/template/custom-wrapper.js":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+webpack5-runner@4.0.8_@babel+core@7.26.9_@rspack+core@1.2.3_@swc+helpers@0.5.15_1416e50b14411a253e779a25ecdcc52c/node_modules/@tarojs/webpack5-runner/dist/template/custom-wrapper.js ***!
  \**************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* eslint-disable no-undef */

// @ts-ignore
Component((0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_0__.createRecursiveComponentConfig)('custom-wrapper'));

/***/ })

}]);
//# sourceMappingURL=taro.js.map