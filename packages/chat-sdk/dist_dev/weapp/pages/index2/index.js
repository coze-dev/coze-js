"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/index2/index"],{

/***/ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index2/index!./src/pages/index2/index.tsx":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index2/index!./src/pages/index2/index.tsx ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Index; }
/* harmony export */ });
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _index_module_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.module.less */ "./src/pages/index2/index.module.less");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/cjs/react-jsx-runtime.production.min.js");
/* provided dependency */ var document = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/index.js")["document"];




function Index() {
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    setTimeout(function () {
      //document.getElementById("frame")?.focus();
      console.log("keydown focus");
      document.addEventListener("keydown", function (e) {
        console.log("keydown on", e);
      });
      console.log("keydown 2344");
    }, 3000);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
    className: _index_module_less__WEBPACK_IMPORTED_MODULE_0__["default"].container,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_3__.View, {
      className: _index_module_less__WEBPACK_IMPORTED_MODULE_0__["default"]["chat-container"]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("iframe", {
      id: "frame",
      src: "https://www.coze.cn/#/pages/chatflow/index",
      width: "100%",
      height: "100%"
    })]
  });
}

/***/ }),

/***/ "./src/pages/index2/index.tsx":
/*!************************************!*\
  !*** ./src/pages/index2/index.tsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index2_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index2/index!./index.tsx */ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index2/index!./src/pages/index2/index.tsx");


var config = {"navigationBarTitleText":"Coze Chat"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index2_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/index2/index', {root:{cn:[]}}, config || {})
if (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index2_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index2_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index2_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index2_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/pages/index2/index.module.less":
/*!********************************************!*\
  !*** ./src/pages/index2/index.module.less ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__) {

// extracted by mini-css-extract-plugin
/* harmony default export */ __webpack_exports__["default"] = ({"container":"index-module__container___zkVcO","chat-container":"index-module__chat-container___yR6T9","chat-slot":"index-module__chat-slot___Ny1zO","wave":"index-module__wave___V84lH","icons-blue":"index-module__icons-blue___Z3uJL"});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors"], function() { return __webpack_exec__("./src/pages/index2/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map