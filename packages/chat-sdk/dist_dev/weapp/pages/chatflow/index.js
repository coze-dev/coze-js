"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/chatflow/index"],{

/***/ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/chatflow/index!./src/pages/chatflow/index.tsx":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/chatflow/index!./src/pages/chatflow/index.tsx ***!
  \*********************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Index; }
/* harmony export */ });
/* unused harmony exports cnBotInfo, enBotInfo, boeBotInfo */
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.26.9/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _index_module_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.module.less */ "./src/pages/chatflow/index.module.less");
/* harmony import */ var _chatflow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/chatflow */ "./src/chatflow/index.tsx");
/* harmony import */ var _libs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/libs */ "./src/libs/index.ts");
/* harmony import */ var _libs_ui_kit_assets_imgs_coze_logo_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/libs/ui-kit/assets/imgs/coze-logo.png */ "./src/libs/ui-kit/assets/imgs/coze-logo.png");
/* harmony import */ var _libs_services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/libs/services */ "./src/libs/services/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/cjs/react-jsx-runtime.production.min.js");










var cnBotInfo = {
  appId: "7472176199100645402",
  workflowId: "7472209247696551955",
  apiBaseUrl: "https://api.coze.cn",
  conversationName: "Test3",
  tokenType: "external",
  token: "pat_CCit2upKNLH778OtaoAspgyYYh5clTvgYuAqR4rBQgXuzbCwmY4QjQWdFiGBvGlX"
};
var enBotInfo = {
  appId: "7329529575539572743",
  apiBaseUrl: "https://api.coze.com",
  token: "pat_JKnvkrN7bzTvHHf9bYq8bnJPFIH4TFir9M4P7kMCBYhgwtHP8jf4hadNetEXXOU7"
};
var boeBotInfo = {
  appId: "7440555625941631020",
  workflowId: "7441166757690064940",
  apiBaseUrl: "https://api-bot-boe.bytedance.net",
  tokenType: "internal",
  conversationName: "Chatflow3",
  token: "pat_nDifwbBHwz4PSIIvCAtBH9DSmr8RmymxPnhW0cuVrVUlcRwt9wPTnTVyos2bT4NA"
};
var botInfo = cnBotInfo;

// 美东： https://sf16-va.tiktokcdn.com/obj/eden-va2/rkzild_lgvj/ljhwZthlaukjlkulzlp/assets/imgs/chatflow-logo.png
// SG:   https://sf16-sg.tiktokcdn.com/obj/eden-sg/rkzild_lgvj/ljhwZthlaukjlkulzlp/assets/imgs/chatflow-logo.png
// CN:   https://lf3-static.bytednsdoc.com/obj/eden-cn/rkzild_lgvj/ljhwZthlaukjlkulzlp/assets/imgs/chatflow-logo.png
function Index() {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      id: botInfo.workflowId,
      parameters: {}
    }),
    _useState2 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState, 2),
    workflow = _useState2[0],
    setWorkflow = _useState2[1];
  var auth = {
    type: botInfo.tokenType || "internal",
    token: botInfo.token,
    refreshToken: function refreshToken() {
      return botInfo.token;
    }
  };
  var setting = {
    // apiBaseUrl: "https://api.coze.cn",
    apiBaseUrl: botInfo.apiBaseUrl,
    //cdnBaseUrlPath:
    //  "https://sf16-va.tiktokcdn.com/obj/eden-va2/rkzild_lgvj/ljhwZthlaukjlkulzlp",
    logLevel: "debug",
    requestHeader: {
      "x-tt-env": "ppe_chatflow_role",
      "x-use-ppe": "1"
    }
  };
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      // prologue:
      // "[stetsa](https://www.baidu.com)\n\n![45379212846b4c68b4286e5189a22b70.jpeg](https://www.coze.com/s/Zs8AutFQd/)\n\n尊敬的{{user_name}}，你好",
      // prologue: "123123",
      suggestions: ["asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf "]
    }),
    _useState4 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState3, 2),
    onBoarding = _useState4[0],
    setOnBoarding = _useState4[1];
  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      id: "ID1234567890",
      name: "GaoTest",
      avatar: _libs_ui_kit_assets_imgs_coze_logo_png__WEBPACK_IMPORTED_MODULE_4__
      //"https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image",
    }),
    _useState6 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState5, 2),
    userInfo = _useState6[0],
    setUserInfo = _useState6[1];
  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      id: botInfo.appId,
      type: "app",
      conversationName: botInfo.conversationName || "asf",
      name: "https://www.coze.cn/space/7321567613585424403/project-ide/7459982518834446351/workflow/7459756038184026112",
      mode: "draft",
      //mode: "websdk",
      //iconUrl:
      //  "https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image",
      onBoarding: onBoarding
    }),
    _useState8 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState7, 2),
    project = _useState8[0],
    setProject = _useState8[1];
  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
      layout: "pc",
      isDisabled: false,
      isMiniCustomHeader: false,
      clearContext: {
        isNeed: true
      },
      clearMessage: {
        isNeed: true
      },
      uploadBtn: {
        isNeed: true
      },
      header: {
        isNeed: true,
        //icon: "https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image",
        title: "Test",
        renderRightSlot: function renderRightSlot() {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            children: "asdf"
          });
        }
      },
      footer: {
        isNeed: true
        /*expressionText: "Ai Test{{baidu}}",
        linkvars: {
          baidu: {
            text: "Baidu",
            link: "https://www.baidu.com",
          },
        },*/
      },
      renderLoading: function renderLoading() {
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_8__.View, {
          className: _index_module_less__WEBPACK_IMPORTED_MODULE_1__["default"].loading,
          children: "Loading"
        });
      },
      input: {
        placeholder: "请输入你的s问题",
        isNeed: true,
        isNeedTaskMessage: true,
        isNeedAudio: true,
        //defaultText: "Chatflow DefaultText",
        renderChatInputTopSlot: function renderChatInputTopSlot() {
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            children: " Input Top Slot"
          });
        }
      }
      /* bgInfo: {
        imgUrl:
          "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",
         themeColor: "#322725",
      },*/
      //renderLoading: () => <div>Loading</div>,
    }),
    _useState10 = (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_useState9, 2),
    areaUi = _useState10[0],
    setAreaUi = _useState10[1];
  console.log("chatflow props:", {
    workflow: workflow,
    project: project,
    userInfo: userInfo,
    areaUi: areaUi,
    setting: setting,
    auth: auth
  });
  console.log("chatflow test func", {
    setOnBoarding: setOnBoarding,
    setUserInfo: setUserInfo,
    setProject: setProject,
    setAreaUi: setAreaUi,
    setWorkflow: setWorkflow
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_8__.View, {
    className: _index_module_less__WEBPACK_IMPORTED_MODULE_1__["default"].container,
    onTouchStart: function onTouchStart(e) {
      e.stopPropagation(), e.preventDefault();
    },
    onTouchMove: function onTouchMove(e) {
      e.stopPropagation(), e.preventDefault();
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_8__.View, {
      className: _index_module_less__WEBPACK_IMPORTED_MODULE_1__["default"]["chat-container"],
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chatflow__WEBPACK_IMPORTED_MODULE_2__.ChatFlowFramework, {
        workflow: workflow,
        project: (0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_9__["default"])((0,_Users_bytedance_Documents_code_coze_coze_mini_chat_node_modules_pnpm_babel_runtime_7_26_9_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_9__["default"])({}, project), {}, {
          caller: "CANVAS",
          onBoarding: onBoarding
        }),
        userInfo: userInfo,
        areaUi: areaUi,
        setting: setting,
        auth: auth,
        eventCallbacks: {
          onGetChatFlowExecuteId: function onGetChatFlowExecuteId(executeId) {
            console.log("onGetChatFlowExecuteId:", executeId);
          },
          onImageClick: function onImageClick(extra) {
            console.log("onImageClick:", extra);
          },
          onThemeChange: function onThemeChange(type) {
            console.log("onThemeChange", type);
          },
          onInitSuccess: function onInitSuccess() {
            console.log("onInitSuccess。。。。");
          },
          message: {
            afterMessageReceivedFinish: function afterMessageReceivedFinish(ck) {
              console.log("afterMessageReceivedFinish:", ck);
            }
          }
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(ChatFlowNode, {})
      })
    })
  });
}
var ChatFlowNode = function ChatFlowNode() {
  var _useSendMessage = (0,_libs_services__WEBPACK_IMPORTED_MODULE_5__.useSendMessage)(),
    sendMessage = _useSendMessage.sendMessage;
  var _useChatInfoStore = (0,_libs__WEBPACK_IMPORTED_MODULE_3__.useChatInfoStore)(function (store) {
      return {
        isLoading: store.isLoading,
        error: store.error
      };
    }),
    isLoading = _useChatInfoStore.isLoading,
    error = _useChatInfoStore.error;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (isLoading === false && !error) {
      return; /*
              sendMessage({
              type: RawMessageType.TEXT,
              data: "123",
              });*/
    }
  }, [isLoading, error]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_libs__WEBPACK_IMPORTED_MODULE_3__.ChatSlot, {
    className: _index_module_less__WEBPACK_IMPORTED_MODULE_1__["default"].ChatSlot
  });
};

/***/ }),

/***/ "./src/pages/chatflow/index.tsx":
/*!**************************************!*\
  !*** ./src/pages/chatflow/index.tsx ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_chatflow_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/chatflow/index!./index.tsx */ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/chatflow/index!./src/pages/chatflow/index.tsx");


var config = {"navigationBarTitleText":"Coze Chat","enablePullDownRefresh":false,"navigationStyle":"custom","disableScroll":true};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_chatflow_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/chatflow/index', {root:{cn:[]}}, config || {})
if (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_chatflow_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_chatflow_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_chatflow_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_chatflow_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/pages/chatflow/index.module.less":
/*!**********************************************!*\
  !*** ./src/pages/chatflow/index.module.less ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__) {

// extracted by mini-css-extract-plugin
/* harmony default export */ __webpack_exports__["default"] = ({"container":"index-module__container___CAHkZ","chat-container":"index-module__chat-container___NS0A0","chat-slot":"index-module__chat-slot___CB_uP","loading":"index-module__loading___Vv36B"});

/***/ }),

/***/ "./src/libs/ui-kit/assets/imgs/coze-logo.png":
/*!***************************************************!*\
  !*** ./src/libs/ui-kit/assets/imgs/coze-logo.png ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "libs/ui-kit/assets/imgs/coze-logo.png";

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/chatflow/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map