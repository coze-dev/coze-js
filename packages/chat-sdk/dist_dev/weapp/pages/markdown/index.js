"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/markdown/index"],{

/***/ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/markdown/index!./src/pages/markdown/index.tsx":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/markdown/index!./src/pages/markdown/index.tsx ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Index; }
/* harmony export */ });
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _exports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/exports */ "./src/exports/index.ts");
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./const */ "./src/pages/markdown/const.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/cjs/react-jsx-runtime.production.min.js");






var streamOutput = function streamOutput(onChange) {
  var index = 10;
  var timer = setInterval(function () {
    var content = _const__WEBPACK_IMPORTED_MODULE_3__.markdown.slice(0, index);
    index += 10;
    onChange(content);
    if (content.length >= _const__WEBPACK_IMPORTED_MODULE_3__.markdown.length) {
      clearInterval(timer);
    }
  }, 150);
};
function Index() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(""),
    _useState2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(_useState, 2),
    content = _useState2[0],
    setContent = _useState2[1];
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    streamOutput(setContent);
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_5__.View, {
    className: "light",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_exports__WEBPACK_IMPORTED_MODULE_0__.MdStream, {
      isSmooth: true,
      isFinish: content.length === _const__WEBPACK_IMPORTED_MODULE_3__.markdown.length,
      enableCodeBy4Space: false,
      markdown: content,
      enableHtmlTags: true
    })
  });
}

/***/ }),

/***/ "./src/exports/index.ts":
/*!******************************!*\
  !*** ./src/exports/index.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MdStream: function() { return /* reexport safe */ _libs__WEBPACK_IMPORTED_MODULE_1__.MdStream; }
/* harmony export */ });
/* harmony import */ var _chatflow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../chatflow */ "./src/chatflow/index.tsx");
/* harmony import */ var _libs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libs */ "./src/libs/index.ts");
/* harmony import */ var _libs_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/libs/types */ "./src/libs/types/index.ts");


/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  MdStream: _libs__WEBPACK_IMPORTED_MODULE_1__.MdStream,
  ChatFlowFramework: _chatflow__WEBPACK_IMPORTED_MODULE_0__.ChatFlowFramework,
  ChatFramework: _libs__WEBPACK_IMPORTED_MODULE_1__.ChatFramework,
  ChatSlot: _libs__WEBPACK_IMPORTED_MODULE_1__.ChatSlot,
  useChatInfoStore: _libs__WEBPACK_IMPORTED_MODULE_1__.useChatInfoStore,
  ChatService: _libs__WEBPACK_IMPORTED_MODULE_1__.ChatService,
  Logger: _libs__WEBPACK_IMPORTED_MODULE_1__.Logger,
  Language: _libs__WEBPACK_IMPORTED_MODULE_1__.Language,
  ChatType: _libs__WEBPACK_IMPORTED_MODULE_1__.ChatType,
  RawMessageType: _libs__WEBPACK_IMPORTED_MODULE_1__.RawMessageType,
  useInitSuccess: _libs__WEBPACK_IMPORTED_MODULE_1__.useInitSuccess,
  useSendMessage: _libs__WEBPACK_IMPORTED_MODULE_1__.useSendMessage
});



/***/ }),

/***/ "./src/pages/markdown/const.ts":
/*!*************************************!*\
  !*** ./src/pages/markdown/const.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   markdown: function() { return /* binding */ markdown; }
/* harmony export */ });
var markdown = "\n# Code\n    sadf\n    as\n    what's\n     asdf\n\nas\n```javascript\n$(document).ready(function () {\n    alert('RUNOOB');\n});\n```\n\n\n![\u8FD9\u662F\u56FE\u7247](/assets/img/philly-magic-garden.jpg \"Magic Gardens\")\n\nas s `node`\n## Html\n\n<div>\n <strong>asdfasdf</strong>\n  <video controls=\"\" width=\"250\">\n    <source src=\"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm\" type=\"video/webm\">\n    <source src=\"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4\" type=\"video/mp4\">\n  </video>\n</div>\n\n## Tables\n\n| Name  | Age | City     |\n|-------|-----|----------|\n| Alice | 30  | New York |\n| Bob   | 25  | London   |\n\n## Task Lists\n\nYou can create task lists in Markdown by using brackets. For example:\n\n- [x] Write example document\n- [ ] Publish document\n- [ ] Share document with friends\n\n- [x] \u4EFB\u52A11\n- [x] \u4EFB\u52A12\n- [ ] \u4EFB\u52A13\n  - [ ] \u5B50\u4EFB\u52A11\n  - [ ] \u5B50\u4EFB\u52A12\n  - [ ] \u5B50\u4EFB\u52A13\n- [ ] \u4EFB\u52A14\n  - [ ] \u5B50\u4EFB\u52A11\n  - [ ] \u5B50\u4EFB\u52A12\n\n### Unordered List\n\n- Item 1\n- Item 2\n- Item 3\n\n### Ordered List\n\n1. Item 1\n2. Item 2\n3. Item 3\n\n\n";

/***/ }),

/***/ "./src/pages/markdown/index.tsx":
/*!**************************************!*\
  !*** ./src/pages/markdown/index.tsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_markdown_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/markdown/index!./index.tsx */ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/markdown/index!./src/pages/markdown/index.tsx");


var config = {"navigationBarTitleText":"Coze Chat"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_markdown_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/markdown/index', {root:{cn:[]}}, config || {})
if (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_markdown_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_markdown_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_markdown_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_markdown_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/markdown/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map