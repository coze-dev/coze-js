"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/ui/index"],{

/***/ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/ui/index!./src/pages/ui/index.tsx":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/ui/index!./src/pages/ui/index.tsx ***!
  \*********************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Index; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _index_module_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.module.less */ "./src/pages/ui/index.module.less");
/* harmony import */ var _libs_ui_kit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/libs/ui-kit */ "./src/libs/ui-kit/index.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/cjs/react-jsx-runtime.production.min.js");






function Index() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false),
    _useState2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_useState, 2),
    radioChecked = _useState2[0],
    setRadioChecked = _useState2[1];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_5__.View, {
    className: _index_module_less__WEBPACK_IMPORTED_MODULE_0__["default"].container,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_libs_ui_kit__WEBPACK_IMPORTED_MODULE_1__.Spacing, {
      vertical: true,
      gap: 10,
      verticalCenter: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_libs_ui_kit__WEBPACK_IMPORTED_MODULE_1__.Radio, {
        checked: radioChecked,
        onChange: function onChange(isChecked) {
          setRadioChecked(isChecked);
        }
      })
    })
  });
}

/***/ }),

/***/ "./src/pages/ui/index.tsx":
/*!********************************!*\
  !*** ./src/pages/ui/index.tsx ***!
  \********************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_ui_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/ui/index!./index.tsx */ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/ui/index!./src/pages/ui/index.tsx");


var config = {"navigationBarTitleText":"Coze Chat"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_ui_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/ui/index', {root:{cn:[]}}, config || {})
if (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_ui_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_ui_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_ui_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_ui_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/pages/ui/index.module.less":
/*!****************************************!*\
  !*** ./src/pages/ui/index.module.less ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__) {

// extracted by mini-css-extract-plugin
/* harmony default export */ __webpack_exports__["default"] = ({"container":"index-module__container_____pdC"});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/ui/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map