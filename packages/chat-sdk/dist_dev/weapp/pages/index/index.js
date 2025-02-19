"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/index/index"],{

/***/ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx":
/*!***************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx ***!
  \***************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Index; }
/* harmony export */ });
/* unused harmony exports cnBotInfo, enBotInfo, boeBotInfo */
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/.pnpm/@tarojs+plugin-platform-weapp@4.0.8_@tarojs+service@4.0.8_@swc+helpers@0.5.15__@tarojs+shared@4.0.8/node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _libs_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/libs/types */ "./src/libs/types/index.ts");
/* harmony import */ var _libs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/libs */ "./src/libs/index.ts");
/* harmony import */ var _index_module_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.module.less */ "./src/pages/index/index.module.less");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _libs_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/libs/utils */ "./src/libs/utils/index.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/.pnpm/react@18.3.1/node_modules/react/cjs/react-jsx-runtime.production.min.js");
/* provided dependency */ var document = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/index.js")["document"];



/*
import {
  ChatFramework
  ChatSlot,
  ChatType,
  Language,
} from "../../../dist/lib-source/src/exports";
 */

var cnBotInfo = {
  appId: "7471201872620371995",
  apiBaseUrl: "https://api.coze.cn",
  token: "pat_CCit2upKNLH778OtaoAspgyYYh5clTvgYuAqR4rBQgXuzbCwmY4QjQWdFiGBvGlX",
  requestHeaders: {
    //  "x-tt-env": "ppe_coze_voice_chat",
    // "x-use-ppe": "1",
  }
};
var enBotInfo = {
  appId: "7329529575539572743",
  apiBaseUrl: "https://api.coze.com",
  token: "pat_JKnvkrN7bzTvHHf9bYq8bnJPFIH4TFir9M4P7kMCBYhgwtHP8jf4hadNetEXXOU7"
};
var boeBotInfo = {
  appId: "7328406676364132396",
  apiBaseUrl: "https://api-bot-boe.bytedance.net",
  token: "pat_5qMu2RQCXh9kYEkLEoa2yUZyW7hSUXxo9zxi789jNajdkz1IfZtspG7vD3yiYx9y"
};
var botInfo = cnBotInfo;
/*
const str = ` <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path
    d="M6.73982 1.45097L3.49992 4.08339V9.91672L6.73982 12.5491C7.31164 13.0137 8.16658 12.6068 8.16658 11.87V2.13007C8.16658 1.39329 7.31164 0.986364 6.73982 1.45097Z"
    fill="currentColor" />
  <path
    d="M1.16659 4.08339C0.844419 4.08339 0.583252 4.34456 0.583252 4.66672V9.33339C0.583252 9.65556 0.844419 9.91672 1.16659 9.91672H2.33325V4.08339H1.16659Z"
    fill="currentColor" />
  <path
    d="M9.54966 4.79661C9.8001 4.59395 10.1674 4.63269 10.3701 4.88313C10.8439 5.46872 11.1481 6.14916 11.1481 7.00008C11.1481 7.851 10.8439 8.53144 10.3701 9.11702C10.1674 9.36746 9.8001 9.4062 9.54966 9.20354C9.29922 9.00088 9.26048 8.63357 9.46314 8.38313C9.79999 7.96685 9.98142 7.53834 9.98142 7.00008C9.98142 6.46182 9.79999 6.0333 9.46314 5.61702C9.26048 5.36658 9.29922 4.99927 9.54966 4.79661Z"
    fill="currentColor" />
  <path
    d="M11.4723 2.65225C11.2322 2.4374 10.8635 2.45783 10.6486 2.69788C10.4337 2.93794 10.4542 3.30672 10.6942 3.52158C11.6499 4.37691 12.2499 5.61805 12.2499 7.0001C12.2499 8.38216 11.6499 9.62329 10.6942 10.4786C10.4542 10.6935 10.4337 11.0623 10.6486 11.3023C10.8635 11.5424 11.2322 11.5628 11.4723 11.348C12.6648 10.2807 13.4166 8.7278 13.4166 7.0001C13.4166 5.27241 12.6648 3.71954 11.4723 2.65225Z"
    fill="currentColor" />
</svg>`;
const encoder = new TextEncoder();
const uint8Array = encoder.encode(str) as Uint8Array;

const bases = Taro.arrayBufferToBase64(uint8Array);
<Image src={`data:image/svg+xml;base64,${bases}`} />
*/





function Index() {
  (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
    if (_libs_utils__WEBPACK_IMPORTED_MODULE_4__.isWeb) {
      var c = document.createElement("script");
      c.src = "http://res.wx.qq.com/open/js/jweixin-1.6.0.js";
      document.body.appendChild(c);
    }
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_6__.View, {
    className: _index_module_less__WEBPACK_IMPORTED_MODULE_2__["default"].container,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_6__.View, {
      className: _index_module_less__WEBPACK_IMPORTED_MODULE_2__["default"]["chat-container"],
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_libs__WEBPACK_IMPORTED_MODULE_1__.ChatFramework, {
        chat: {
          appId: botInfo.appId,
          type: _libs_types__WEBPACK_IMPORTED_MODULE_0__.ChatType.Bot,
          name: "",
          icon_url: "asfsdf",
          voiceInfo: {
            isTextToVoiceEnable: true,
            voiceConfigMap: {
              zh: {
                voice_id: "7426720361733046281",
                name: "7426720361733046281"
              },
              en: {
                voice_id: "7426720361733046281",
                name: "7426720361733046281"
              }
            }
          }
        },
        setting: {
          apiBaseUrl: botInfo.apiBaseUrl,
          language: _libs_types__WEBPACK_IMPORTED_MODULE_0__.Language.EN,
          requestHeader: botInfo.requestHeaders,
          logLevel: "debug"
        },
        auth: {
          token: botInfo.token,
          onRefreshToken: function onRefreshToken(oldToken) {
            console.log("oldToken: ", oldToken);
            return botInfo.token;
          }
        },
        user: {
          id: "213",
          name: "高先生",
          avatar: "https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image"
        },
        ui: {
          layout: "mobile",
          isMiniCustomHeader: false,
          chatSlot: {
            input: {
              isNeedAudio: true,
              renderChatInputTopSlot: function renderChatInputTopSlot(props) {
                return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_6__.View, {
                  children: "asdfasdfasdf asdfasdfasdf"
                });
              }
            },
            message: {
              card: {
                isSupportMessage: function isSupportMessage(item) {
                  return true;
                },
                renderMessage: function renderMessage(props) {
                  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_6__.View, {
                    onClick: function onClick() {
                      alert("123");
                    },
                    children: ["Card Show Click ", props.m]
                  });
                }
              }
            }
          },
          header: {
            isNeed: true,
            title: "Coze",
            icon: "asdfasdf"
          },
          footer: {
            isNeed: true,
            expressionText: "Powered by {{test}}. AI-generated content for reference only.",
            linkvars: {
              test: {
                text: "baidu",
                link: "https://www.baidu.com"
              }
            }
          }
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_libs__WEBPACK_IMPORTED_MODULE_1__.ChatSlot, {
          className: _index_module_less__WEBPACK_IMPORTED_MODULE_2__["default"]["chat-slot"]
        })
      })
    })
  });
}
var mockBgData = {
  pc: {
    imgUrl: "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",
    themeColor: "rgba(32, 27, 25)",
    gradientPosition: {
      left: 0.29,
      right: 0.29
    },
    canvasPosition: {
      width: 194.625,
      height: 346,
      left: 145.6875,
      top: 0
    }
  },
  mobile: {
    imgUrl: "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",
    themeColor: "rgba(32, 27, 25)",
    gradientPosition: {
      left: 0.1,
      right: 0.1
    },
    canvasPosition: {
      width: 194.625,
      height: 346,
      left: 26.6875,
      top: 0
    }
  }
};
var mockBgData2 = {
  pc: {
    imgUrl: "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",
    themeColor: "#322725",
    gradientPosition: {
      left: 0,
      right: 0
    },
    canvasPosition: {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    }
  },
  mobile: {
    imgUrl: "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",
    themeColor: "#322725",
    gradientPosition: {
      left: 0,
      right: 0
    },
    canvasPosition: {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    }
  }
};
/*

const jubenshaMockData = {
  pc: {
    imgUrl:
      "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",

    themeColor: "rgba(32, 27, 25)",
    gradientPosition: {
      left: 0.29,
      right: 0.29,
    },
    canvasPosition: {
      width: 194.625,
      height: 346,
      left: 145.6875,
      top: 0,
    },
  },
  mobile: {
    imgUrl:
      "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/12c18226f4ca4ee2899509a43144f9aa.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798892047&x-signature=C0MJ64WRnlPdD7Yg4UOGpgiKanI%3D",

    themeColor: "rgba(32, 27, 25)",
    gradientPosition: {
      left: 0.1,
      right: 0.1,
    },
    canvasPosition: {
      width: 194.625,
      height: 346,
      left: 26.6875,
      top: 0,
    },
  },
};
const loveMockData = {
  pc: {
    imgUrl:
      "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/3a01db2649bc4f4d971f4031361a070e.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798957460&x-signature=4FJmL4Q6G%2FYOXq6CKpzoCvJOt3c%3D",

    themeColor: "rgba(252, 237, 234)",
    gradientPosition: {
      left: 0,
      right: 0,
    },
    canvasPosition: {
      width: 972,
      height: 972,
      left: -380.0953125,
      top: -626,
    },
  },
  mobile: {
    imgUrl:
      "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/3a01db2649bc4f4d971f4031361a070e.png~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798957460&x-signature=4FJmL4Q6G%2FYOXq6CKpzoCvJOt3c%3D",
    themeColor: "rgba(252, 233, 232)",
    gradientPosition: {
      left: 0,
      right: 0,
    },
    canvasPosition: {
      width: 496,
      height: 496,
      left: -220.034078125,
      top: -150,
    },
  },
};

const mockData = {
  pc: {
    imgUrl:
      "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/068178ec24884485920c82f1de9e5012.jpg~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798957852&x-signature=cdBo8VJzgIuZ7vMBtZYmuN8yrAU%3D",
    themeColor: "rgba(188, 169, 148)",
    gradientPosition: {
      left: 0.15,
      right: 0.13,
    },
    canvasPosition: {
      width: 343.52709237362654,
      height: 612.9601060000002,
      left: 75.11172581318668,
      top: -45.75841150000018,
    },
  },
  mobile: {
    imgUrl:
      "https://p6-bot-sign.byteimg.com/tos-cn-i-v4nquku3lp/068178ec24884485920c82f1de9e5012.jpg~tplv-v4nquku3lp-image.image?rk3s=50ccb0c5&x-expires=1798957852&x-signature=cdBo8VJzgIuZ7vMBtZYmuN8yrAU%3D",

    themeColor: "rgba(189, 169, 148)",
    gradientPosition: {
      left: -0.12,
      right: -0.15,
    },
    canvasPosition: {
      width: 312.2973567032968,
      height: 557.2364600000002,
      left: -27.700008351648414,
      top: -21.317265000000106,
    },
  },
};
*/

/***/ }),

/***/ "./src/pages/index/index.tsx":
/*!***********************************!*\
  !*** ./src/pages/index/index.tsx ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/.pnpm/@tarojs+runtime@4.0.8/node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./index.tsx */ "./node_modules/.pnpm/@tarojs+taro-loader@4.0.8_@swc+helpers@0.5.15_webpack@5.91.0_@swc+core@1.3.96_@swc+helpers@0.5.15__/node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx");


var config = {"navigationBarTitleText":"Coze Chat"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/index/index', {root:{cn:[]}}, config || {})
if (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_pnpm_tarojs_taro_loader_4_0_8_swc_helpers_0_5_15_webpack_5_91_0_swc_core_1_3_96_swc_helpers_0_5_15_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/pages/index/index.module.less":
/*!*******************************************!*\
  !*** ./src/pages/index/index.module.less ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__) {

// extracted by mini-css-extract-plugin
/* harmony default export */ __webpack_exports__["default"] = ({"container":"index-module__container___RUPtv","chat-container":"index-module__chat-container___N3ae4","chat-slot":"index-module__chat-slot___Kw_up","wave":"index-module__wave___kkwGQ","icons-blue":"index-module__icons-blue___ARuqb"});

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/index/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map