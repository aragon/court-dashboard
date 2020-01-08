(this["webpackJsonpbe"] = this["webpackJsonpbe"] || []).push([["main"],{

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _theme_court__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./theme-court */ "./src/theme-court.js");
/* harmony import */ var _MainView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MainView */ "./src/MainView.js");
/* harmony import */ var _ErrorPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ErrorPage */ "./src/ErrorPage.js");
/* harmony import */ var _components_Dashboard_Dashboard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/Dashboard/Dashboard */ "./src/components/Dashboard/Dashboard.js");
/* harmony import */ var _components_Tasks_Tasks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/Tasks/Tasks */ "./src/components/Tasks/Tasks.js");
/* harmony import */ var _components_Disputes_Disputes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/Disputes/Disputes */ "./src/components/Disputes/Disputes.js");
/* harmony import */ var _providers_Web3__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./providers/Web3 */ "./src/providers/Web3.js");
/* harmony import */ var _providers_CourtConfig__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./providers/CourtConfig */ "./src/providers/CourtConfig.js");
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/App.js";












function App() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["BrowserRouter"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Main"], {
    layout: false,
    theme: _theme_court__WEBPACK_IMPORTED_MODULE_3__["default"],
    scrollView: false,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_providers_Web3__WEBPACK_IMPORTED_MODULE_9__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_providers_CourtConfig__WEBPACK_IMPORTED_MODULE_10__["CourtConfigProvider"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_MainView__WEBPACK_IMPORTED_MODULE_4__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Switch"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
    exact: true,
    from: "/",
    to: "/dashboard",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    path: "/dashboard",
    component: _components_Dashboard_Dashboard__WEBPACK_IMPORTED_MODULE_6__["default"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    exact: true,
    path: "/tasks",
    component: _components_Tasks_Tasks__WEBPACK_IMPORTED_MODULE_7__["default"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    exact: true,
    path: "/disputes",
    component: _components_Disputes_Disputes__WEBPACK_IMPORTED_MODULE_8__["default"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
    component: _ErrorPage__WEBPACK_IMPORTED_MODULE_5__["default"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  })))))));
}

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ "./src/ErrorPage.js":
/*!**************************!*\
  !*** ./src/ErrorPage.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/ErrorPage.js";


function ErrorPage() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 4
    },
    __self: this
  }, "Oops! Something went wrong");
}

/* harmony default export */ __webpack_exports__["default"] = (ErrorPage);

/***/ }),

/***/ "./src/Header.js":
/*!***********************!*\
  !*** ./src/Header.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _providers_Web3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./providers/Web3 */ "./src/providers/Web3.js");





var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/Header.js";




var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Header___StyledDiv",
  componentId: "sc-147ncr1-0"
})(["box-shadow:rgba(0,0,0,0.05) 0px 2px 3px;background:rgb(255,255,255);position:relative;z-index:3;"]);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Header___StyledDiv2",
  componentId: "sc-147ncr1-1"
})(["display:flex;align-items:center;justify-content:space-between;"]);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Header___StyledDiv3",
  componentId: "sc-147ncr1-2"
})(["padding:20px;"]);

var _StyledDiv4 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Header___StyledDiv4",
  componentId: "sc-147ncr1-3"
})(["margin-right:12px;"]);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Header___StyledSpan",
  componentId: "sc-147ncr1-4"
})(["background-color:#54c497;color:white;padding:3px 10px;border-radius:5px;"]);

function Header() {
  const _useWeb3Connect = Object(_providers_Web3__WEBPACK_IMPORTED_MODULE_3__["useWeb3Connect"])(),
        account = _useWeb3Connect.account,
        activate = _useWeb3Connect.activate;

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv3, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, "Court Demo")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv4, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, account ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, account) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
    label: "Enable account",
    onClick: () => activate('injected'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }))));
}

/* harmony default export */ __webpack_exports__["default"] = (Header);

/***/ }),

/***/ "./src/MainView.js":
/*!*************************!*\
  !*** ./src/MainView.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _NavBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NavBar */ "./src/NavBar.js");
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Header */ "./src/Header.js");





var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/MainView.js";




const NAV_BAR_WIDTH = 25 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"];

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "MainView___StyledDiv",
  componentId: "k42z58-0"
})(["height:100vh;"]);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "MainView___StyledDiv2",
  componentId: "k42z58-1"
})(["display:flex;height:100%;"]);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "MainView___StyledDiv3",
  componentId: "k42z58-2"
})(["flex-shrink:0;width:", "px;"], NAV_BAR_WIDTH);

var _StyledDiv4 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "MainView___StyledDiv4",
  componentId: "k42z58-3"
})(["flex-grow:1;overflow:auto;"]);

var _StyledDiv5 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "MainView___StyledDiv5",
  componentId: "k42z58-4"
})(["padding-bottom:", "px;"], p => p._css);

function MainView({
  children
}) {
  const _useViewport = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useViewport"])(),
        vw = _useViewport.width;

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Header__WEBPACK_IMPORTED_MODULE_4__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv3, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_NavBar__WEBPACK_IMPORTED_MODULE_3__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv4, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv5, {
    _css: 6 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Layout"], {
    parentWidth: vw - NAV_BAR_WIDTH,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, children)))));
}

/* harmony default export */ __webpack_exports__["default"] = (MainView);

/***/ }),

/***/ "./src/NavBar.js":
/*!***********************!*\
  !*** ./src/NavBar.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/esm/react-router-dom.js");
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _assets_menu_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./assets/menu.svg */ "./src/assets/menu.svg");
/* harmony import */ var _assets_menu_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_menu_svg__WEBPACK_IMPORTED_MODULE_4__);





var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/NavBar.js";





var _StyledNav = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].nav.withConfig({
  displayName: "NavBar___StyledNav",
  componentId: "o1eg5j-0"
})(["display:flex;flex-direction:column;width:100%;height:100%;padding:", "px 0;background:", ";margin-top:2px;box-shadow:rgba(0,0,0,0.05) 2px 0px 3px;"], p => p._css, p => p._css2);

var _StyledH = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].h2.withConfig({
  displayName: "NavBar___StyledH",
  componentId: "o1eg5j-1"
})(["color:", ";margin-bottom:", "px;padding:0 ", "px;", ";"], p => p._css3, p => p._css4, p => p._css5, p => p._css6);

function NavBar() {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledNav, {
    _css: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    _css2: theme.surface,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledH, {
    _css3: theme.surfaceContentSecondary,
    _css4: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    _css5: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    _css6: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('label2'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, "Menu"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(NavItem, {
    to: "/dashboard",
    icon: _assets_menu_svg__WEBPACK_IMPORTED_MODULE_4___default.a,
    label: "Dashboard",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(NavItem, {
    to: "/tasks",
    icon: _assets_menu_svg__WEBPACK_IMPORTED_MODULE_4___default.a,
    label: "Tasks",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(NavItem, {
    to: "/disputes",
    icon: _assets_menu_svg__WEBPACK_IMPORTED_MODULE_4___default.a,
    label: "Disputes",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }));
}

var _StyledButtonBase = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["ButtonBase"]).withConfig({
  displayName: "NavBar___StyledButtonBase",
  componentId: "o1eg5j-2"
})(["display:flex;align-items:center;width:100%;height:", "px;padding:0 ", "px 0 ", "px;border-radius:0;text-align:left;background:", ";&:active{background:", ";}"], p => p._css7, p => p._css8, p => p._css9, p => p._css10, p => p._css11);

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "NavBar___StyledDiv",
  componentId: "o1eg5j-3"
})(["position:absolute;left:0;width:3px;height:100%;background:", ";opacity:", ";transform:translate3d(", ",0,0);transform-position:0 0;transition-property:transform,opacity;transition-duration:150ms;transition-timing-function:ease-in-out;"], p => p._css12, p => p._css13, p => p._css14);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "NavBar___StyledSpan",
  componentId: "o1eg5j-4"
})(["margin-left:", "px;overflow:hidden;text-overflow:ellipsis;", ";font-weight:", ";"], p => p._css15, p => p._css16, p => p._css17);

function NavItem({
  to,
  icon,
  label
}) {
  const history = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["useHistory"])();
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["useTheme"])();
  const active = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["useRouteMatch"])(to) !== null;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledButtonBase, {
    onClick: () => history.push(to),
    _css7: 5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    _css8: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    _css9: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    _css10: active ? theme.surfacePressed : 'transparent',
    _css11: theme.surfacePressed,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    _css12: theme.accent,
    _css13: Number(active),
    _css14: active ? '0%' : '-100%',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("img", {
    src: icon,
    alt: "",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    _css15: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    _css16: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body2'),
    _css17: active ? '600' : '400',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79
    },
    __self: this
  }, label));
}

/* harmony default export */ __webpack_exports__["default"] = (NavBar);

/***/ }),

/***/ "./src/assets/IconCheck.svg":
/*!**********************************!*\
  !*** ./src/assets/IconCheck.svg ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/IconCheck.d773bdc7.svg";

/***/ }),

/***/ "./src/assets/anj.svg":
/*!****************************!*\
  !*** ./src/assets/anj.svg ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/anj.711018b2.svg";

/***/ }),

/***/ "./src/assets/anjBadge.svg":
/*!*********************************!*\
  !*** ./src/assets/anjBadge.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/anjBadge.2a1acc84.svg";

/***/ }),

/***/ "./src/assets/ant.svg":
/*!****************************!*\
  !*** ./src/assets/ant.svg ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/ant.46261769.svg";

/***/ }),

/***/ "./src/assets/courtIcon.svg":
/*!**********************************!*\
  !*** ./src/assets/courtIcon.svg ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/courtIcon.615110a7.svg";

/***/ }),

/***/ "./src/assets/dai.svg":
/*!****************************!*\
  !*** ./src/assets/dai.svg ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/dai.b0065e12.svg";

/***/ }),

/***/ "./src/assets/menu.svg":
/*!*****************************!*\
  !*** ./src/assets/menu.svg ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/menu.31f30434.svg";

/***/ }),

/***/ "./src/assets/profile.png":
/*!********************************!*\
  !*** ./src/assets/profile.png ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ "./src/components/Dashboard/Balance.js":
/*!*********************************************!*\
  !*** ./src/components/Dashboard/Balance.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Balance; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");






var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/Balance.js";



var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Balance___StyledDiv",
  componentId: "sc-1lik3fr-0"
})(["margin-bottom:", "px;"], p => p._css);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Balance___StyledDiv2",
  componentId: "sc-1lik3fr-1"
})(["display:flex;align-items:center;"]);

var _StyledImg = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].img.withConfig({
  displayName: "Balance___StyledImg",
  componentId: "sc-1lik3fr-2"
})(["margin-right:8px;"]);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balance___StyledSpan",
  componentId: "sc-1lik3fr-3"
})(["", " color:", ";"], p => p._css2, p => p._css3);

var _StyledSpan2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balance___StyledSpan2",
  componentId: "sc-1lik3fr-4"
})(["", ""], p => p._css4);

var _StyledSpan3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balance___StyledSpan3",
  componentId: "sc-1lik3fr-5"
})(["", " color:", ";"], p => p._css5, p => p._css6);

function Balance({
  symbol,
  amount,
  value,
  iconSrc
}) {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    _css: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledImg, {
    alt: symbol,
    src: iconSrc,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    _css2: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label1'),
    _css3: theme.contentSecondary,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }, symbol)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan2, {
    _css4: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('title2'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, amount)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan3, {
    _css5: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css6: theme.contentSecondary,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, `$ ${value}`));
}

/***/ }),

/***/ "./src/components/Dashboard/Balances.js":
/*!**********************************************!*\
  !*** ./src/components/Dashboard/Balances.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _Balance__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Balance */ "./src/components/Dashboard/Balance.js");
/* harmony import */ var _mock_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../mock-data */ "./src/mock-data.js");







var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/Balances.js";





var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Balances___StyledDiv",
  componentId: "kiho2j-0"
})(["display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));"]);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balances___StyledSpan",
  componentId: "kiho2j-1"
})(["", " color:", ";display:inline-block;margin-bottom:", "px;"], p => p._css, p => p._css2, p => p._css3);

var _StyledSpan2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balances___StyledSpan2",
  componentId: "kiho2j-2"
})(["", " color:", ";display:inline-block;margin-bottom:", "px;"], p => p._css4, p => p._css5, p => p._css6);

var _StyledSpan3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balances___StyledSpan3",
  componentId: "kiho2j-3"
})(["color:#636971;"]);

var _StyledSpan4 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balances___StyledSpan4",
  componentId: "kiho2j-4"
})(["", " color:", ";display:inline-block;margin-bottom:", "px;"], p => p._css7, p => p._css8, p => p._css9);

var _StyledSpan5 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balances___StyledSpan5",
  componentId: "kiho2j-5"
})(["color:#636971;"]);

var _StyledSpan6 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "Balances___StyledSpan6",
  componentId: "kiho2j-6"
})(["", " color:", ";display:inline-block;margin-bottom:", "px;"], p => p._css10, p => p._css11, p => p._css12);

function Balances() {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    _css: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body3'),
    _css2: theme.contentSecondary,
    _css3: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, "Wallet balance"), _mock_data__WEBPACK_IMPORTED_MODULE_4__["balances"].wallet.map((balance, index) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Balance__WEBPACK_IMPORTED_MODULE_3__["default"], {
    key: index,
    symbol: balance.tokenSymbol,
    amount: balance.amount,
    value: balance.value,
    iconSrc: balance.icon,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan2, {
    _css4: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body3'),
    _css5: theme.contentSecondary,
    _css6: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, "Staked balance"), _mock_data__WEBPACK_IMPORTED_MODULE_4__["balances"].staked.map((balance, index) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Balance__WEBPACK_IMPORTED_MODULE_3__["default"], {
    key: index,
    symbol: balance.tokenSymbol,
    amount: balance.amount,
    value: balance.value,
    iconSrc: balance.icon,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
    color: "#636971",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan3, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: this
  }, "Unstake"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan4, {
    _css7: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body3'),
    _css8: theme.contentSecondary,
    _css9: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }, "Active balance"), _mock_data__WEBPACK_IMPORTED_MODULE_4__["balances"].active.map((balance, index) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Balance__WEBPACK_IMPORTED_MODULE_3__["default"], {
    key: index,
    symbol: balance.tokenSymbol,
    amount: balance.amount,
    value: balance.value,
    iconSrc: balance.icon,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
    color: "#636971",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan5, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91
    },
    __self: this
  }, "Deactivate"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan6, {
    _css10: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body3'),
    _css11: theme.contentSecondary,
    _css12: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 101
    },
    __self: this
  }, "Rewards"), _mock_data__WEBPACK_IMPORTED_MODULE_4__["balances"].rewards.map((balance, index) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Balance__WEBPACK_IMPORTED_MODULE_3__["default"], {
    key: index,
    symbol: balance.tokenSymbol,
    amount: balance.amount,
    value: balance.value,
    iconSrc: balance.icon,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 112
    },
    __self: this
  })))));
}

/* harmony default export */ __webpack_exports__["default"] = (Balances);

/***/ }),

/***/ "./src/components/Dashboard/CourtStats.js":
/*!************************************************!*\
  !*** ./src/components/Dashboard/CourtStats.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/CourtStats.js";



const CourtStats = () => {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Box"], {
    heading: "Court Stats",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Distribution"], {
    heading: "Disputes",
    items: [{
      item: 'New',
      percentage: 37
    }, {
      item: 'Adjudicated',
      percentage: 22
    }, {
      item: 'Appeals',
      percentage: 15
    }, {
      item: 'Executed',
      percentage: 12
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (CourtStats);

/***/ }),

/***/ "./src/components/Dashboard/Dashboard.js":
/*!***********************************************!*\
  !*** ./src/components/Dashboard/Dashboard.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _ProfileHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ProfileHeader */ "./src/components/Dashboard/ProfileHeader.js");
/* harmony import */ var _DashboardStats__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DashboardStats */ "./src/components/Dashboard/DashboardStats.js");
/* harmony import */ var _TaskTable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TaskTable */ "./src/components/Dashboard/TaskTable.js");
/* harmony import */ var _mock_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../mock-data */ "./src/mock-data.js");
/* harmony import */ var _providers_Web3__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../providers/Web3 */ "./src/providers/Web3.js");
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/Dashboard.js";








function Dashboard() {
  // TODO - only for testing we need to use the  connected account
  // const connectedAccount = useConnectedAccount()
  const web3 = Object(_providers_Web3__WEBPACK_IMPORTED_MODULE_6__["useWeb3Connect"])();
  console.log(web3);
  const connectedAccount = '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3';
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Header"], {
    primary: "Dashboard",
    secondary: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      label: "Buy ANJ",
      mode: "strong",
      onClick: () => web3.activate('injected'),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23
      },
      __self: this
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ProfileHeader__WEBPACK_IMPORTED_MODULE_2__["default"], {
    active: true,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Split"], {
    primary: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TaskTable__WEBPACK_IMPORTED_MODULE_4__["default"], {
      tasks: _mock_data__WEBPACK_IMPORTED_MODULE_5__["tasks"],
      connectedAccount: connectedAccount,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 33
      },
      __self: this
    }),
    secondary: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DashboardStats__WEBPACK_IMPORTED_MODULE_3__["default"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35
      },
      __self: this
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }));
}

/* harmony default export */ __webpack_exports__["default"] = (Dashboard);

/***/ }),

/***/ "./src/components/Dashboard/DashboardStats.js":
/*!****************************************************!*\
  !*** ./src/components/Dashboard/DashboardStats.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _LatestActivity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LatestActivity */ "./src/components/Dashboard/LatestActivity.js");
/* harmony import */ var _CourtStats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CourtStats */ "./src/components/Dashboard/CourtStats.js");
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/DashboardStats.js";




const DashboardStats = () => {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_LatestActivity__WEBPACK_IMPORTED_MODULE_1__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: undefined
  }), " ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_CourtStats__WEBPACK_IMPORTED_MODULE_2__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (DashboardStats);

/***/ }),

/***/ "./src/components/Dashboard/LatestActivity.js":
/*!****************************************************!*\
  !*** ./src/components/Dashboard/LatestActivity.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _Stepper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Stepper */ "./src/components/Stepper.js");
/* harmony import */ var _Step__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Step */ "./src/components/Step.js");
/* harmony import */ var _mock_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../mock-data */ "./src/mock-data.js");





var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/LatestActivity.js";






var _StyledStepper = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_Stepper__WEBPACK_IMPORTED_MODULE_3__["default"]).withConfig({
  displayName: "LatestActivity___StyledStepper",
  componentId: "nmi51w-0"
})(["padding:", "px 0;"], p => p._css);

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "LatestActivity___StyledDiv",
  componentId: "nmi51w-1"
})(["border-radius:50%;border:2px solid ", ";padding:", "px;"], p => p._css2, p => p._css3);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "LatestActivity___StyledSpan",
  componentId: "nmi51w-2"
})(["display:block;padding:", "px;background:", ";border-radius:50%;"], p => p._css4, p => p._css5);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "LatestActivity___StyledDiv2",
  componentId: "nmi51w-3"
})(["line-height:2;"]);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "LatestActivity___StyledDiv3",
  componentId: "nmi51w-4"
})(["", ";color:", ";"], p => p._css6, p => p._css7);

function LatestActivity() {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Box"], {
    heading: "latest activity",
    padding: 0,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledStepper, {
    lineColor: theme.accent.alpha(0.2),
    lineExtraHeight: 10,
    lineTop: 15,
    lineWidth: 2,
    _css: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, _mock_data__WEBPACK_IMPORTED_MODULE_5__["latestActivity"].map((activity, index) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Step__WEBPACK_IMPORTED_MODULE_4__["default"], {
    key: index,
    stepPoint: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
      _css2: theme.accent.alpha(0.2),
      _css3: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 27
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
      _css4: 0.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
      _css5: theme.accent,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 34
      },
      __self: this
    })),
    content: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 45
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["IdentityBadge"], {
      entity: activity.account,
      badgeOnly: true,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50
      },
      __self: this
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 51
      },
      __self: this
    }, activity.action, ' ', react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("a", {
      href: activity.target.link,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 53
      },
      __self: this
    }, activity.target.label)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv3, {
      _css6: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body4'),
      _css7: theme.contentSecondary,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 55
      },
      __self: this
    }, activity.date)),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }))));
}

/* harmony default export */ __webpack_exports__["default"] = (LatestActivity);

/***/ }),

/***/ "./src/components/Dashboard/ProfileHeader.js":
/*!***************************************************!*\
  !*** ./src/components/Dashboard/ProfileHeader.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ProfileHeader; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _assets_profile_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../assets/profile.png */ "./src/assets/profile.png");
/* harmony import */ var _assets_profile_png__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_profile_png__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _assets_anjBadge_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/anjBadge.svg */ "./src/assets/anjBadge.svg");
/* harmony import */ var _assets_anjBadge_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_anjBadge_svg__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _assets_IconCheck_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../assets/IconCheck.svg */ "./src/assets/IconCheck.svg");
/* harmony import */ var _assets_IconCheck_svg__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_IconCheck_svg__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Balances__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Balances */ "./src/components/Dashboard/Balances.js");












var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/ProfileHeader.js";







var _StyledBox = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Box"]).withConfig({
  displayName: "ProfileHeader___StyledBox",
  componentId: "n3mdz-0"
})(["border-radius:0;margin-bottom:", "px;"], p => p._css);

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "ProfileHeader___StyledDiv",
  componentId: "n3mdz-1"
})(["margin-bottom:", "px;display:flex;align-items:flex-start;justify-content:space-between;"], p => p._css2);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "ProfileHeader___StyledDiv2",
  componentId: "n3mdz-2"
})(["display:flex;align-items:center;"]);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "ProfileHeader___StyledDiv3",
  componentId: "n3mdz-3"
})(["position:relative;margin-right:", "px;"], p => p._css3);

var _StyledImg = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].img.withConfig({
  displayName: "ProfileHeader___StyledImg",
  componentId: "n3mdz-4"
})(["position:absolute;top:0;right:-5px"]);

var _StyledDiv4 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "ProfileHeader___StyledDiv4",
  componentId: "n3mdz-5"
})(["margin-bottom:", "px;display:flex;align-items:center;"], p => p._css4);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "ProfileHeader___StyledSpan",
  componentId: "n3mdz-6"
})(["", " letter-spacing:1px;margin-right:", "px;"], p => p._css5, p => p._css6);

var _StyledDiv5 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "ProfileHeader___StyledDiv5",
  componentId: "n3mdz-7"
})(["display:flex;align-items:center;"]);

var _StyledImg2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].img.withConfig({
  displayName: "ProfileHeader___StyledImg2",
  componentId: "n3mdz-8"
})(["margin-right:4px;"]);

var _StyledSpan2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "ProfileHeader___StyledSpan2",
  componentId: "n3mdz-9"
})(["", " color:", ";"], p => p._css7, p => p._css8);

var _StyledP = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].p.withConfig({
  displayName: "ProfileHeader___StyledP",
  componentId: "n3mdz-10"
})(["", ""], p => p._css9);

var _StyledSpan3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "ProfileHeader___StyledSpan3",
  componentId: "n3mdz-11"
})(["color:#636971;"]);

function ProfileHeader({
  active
}) {
  const _useViewport = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useViewport"])(),
        below = _useViewport.below;

  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledBox, {
    padding: 40,
    _css: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    _css2: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv3, {
    _css3: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("img", {
    alt: "profile",
    src: _assets_profile_png__WEBPACK_IMPORTED_MODULE_3___default.a,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledImg, {
    alt: "active-juror",
    src: _assets_anjBadge_svg__WEBPACK_IMPORTED_MODULE_4___default.a,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv4, {
    _css4: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    _css5: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('title4'),
    _css6: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, "Eliza Stewart"), active && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv5, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledImg2, {
    alt: "active",
    src: _assets_IconCheck_svg__WEBPACK_IMPORTED_MODULE_5___default.a,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan2, {
    _css7: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css8: theme.contentSecondary,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 81
    },
    __self: this
  }, "ACTIVE JUROR"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledP, {
    _css9: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body3'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93
    },
    __self: this
  }, "You are active and eligible to be drafted starting from the next term, on 14/12/19 at 16:00.")))), !below('medium') && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 105
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 106
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan3, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 107
    },
    __self: this
  }, "View profile")))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Balances__WEBPACK_IMPORTED_MODULE_6__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: this
  }));
}

/***/ }),

/***/ "./src/components/Dashboard/TaskTable.js":
/*!***********************************************!*\
  !*** ./src/components/Dashboard/TaskTable.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Lib/dayjs */ "./src/components/Lib/dayjs.js");
/* harmony import */ var _LocalIdentityBadge_LocalIdentityBadge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../LocalIdentityBadge/LocalIdentityBadge */ "./src/components/LocalIdentityBadge/LocalIdentityBadge.js");
/* harmony import */ var _Lib_web3__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Lib/web3 */ "./src/components/Lib/web3.js");






var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Dashboard/TaskTable.js";





const ENTRIES_PER_PAGE = 5;
const INITIAL_DATE_RANGE = {
  start: null,
  end: null
};

const getFilteredTasks = ({
  tasks,
  connectedAccount,
  selectedDateRange
}) => {
  return tasks.filter(({
    taskName,
    disputeId,
    priority,
    juror,
    dueDate
  }) => (connectedAccount === '' || Object(_Lib_web3__WEBPACK_IMPORTED_MODULE_6__["addressesEqual"])(juror, connectedAccount)) && (!selectedDateRange.start || !selectedDateRange.end || Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dueDate).isBetween(Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(selectedDateRange.start).startOf('day'), Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(selectedDateRange.end).endOf('day'), '[]')));
};

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "TaskTable___StyledDiv",
  componentId: "sc-1awk448-0"
})(["padding-bottom:", "px;display:flex;align-items:center;justify-content:space-between;"], p => p._css);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "TaskTable___StyledDiv2",
  componentId: "sc-1awk448-1"
})(["color:", ";", ";"], p => p._css2, p => p._css3);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "TaskTable___StyledDiv3",
  componentId: "sc-1awk448-2"
})(["text-align:right;"]);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].span.withConfig({
  displayName: "TaskTable___StyledSpan",
  componentId: "sc-1awk448-3"
})(["", ""], p => p._css4);

var _StyledSpan2 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].span.withConfig({
  displayName: "TaskTable___StyledSpan2",
  componentId: "sc-1awk448-4"
})(["", ""], p => p._css5);

const TaskTable = ({
  tasks,
  connectedAccount
}) => {
  const _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(INITIAL_DATE_RANGE),
        _useState2 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
        selectedDateRange = _useState2[0],
        setSelectedDateRange = _useState2[1];

  const _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(0),
        _useState4 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState3, 2),
        page = _useState4[0],
        setPage = _useState4[1];

  const _useViewport = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["useViewport"])(),
        below = _useViewport.below;

  const compactMode = below('medium');

  const handleSelectedDateRangeChange = range => {
    setPage(0);
    setSelectedDateRange(range);
  };

  const filteredTasks = getFilteredTasks({
    tasks,
    connectedAccount,
    selectedDateRange
  });
  const sortedTasks = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => filteredTasks.sort(({
    dueDate: dateLeft
  }, {
    dueDate: dateRight
  }) => // Sort by date ascending
  Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateLeft).isAfter(Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateRight)) ? 1 : Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateLeft).isSame(Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateRight)) ? 0 : -1), [filteredTasks]);
  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["DataView"], {
    page: page,
    entriesPerPage: ENTRIES_PER_PAGE,
    onPageChange: () => {},
    heading: react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv, {
      _css: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 70
      },
      __self: undefined
    }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv2, {
      _css2: _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["theme"].content,
      _css3: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body1'),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 78
      },
      __self: undefined
    }, "Upcoming tasks"), !compactMode && react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv3, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 88
      },
      __self: undefined
    }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["DateRangePicker"], {
      startDate: selectedDateRange.start,
      endDate: selectedDateRange.end,
      onChange: handleSelectedDateRangeChange,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 89
      },
      __self: undefined
    })))),
    fields: ['Task', 'Dispute', 'Priority', 'Assigned to juror', 'Due date'],
    entries: sortedTasks,
    renderEntry: ({
      taskName,
      disputeId,
      priority,
      juror,
      dueDate
    }) => {
      const formattedDate = Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dueDate).format('YYYY-MM-DDTHH:mm:ssZ');
      const hoursAndSec = Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dueDate).format('HH:mm');
      return [react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledSpan, {
        _css4: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body2'),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 105
        },
        __self: undefined
      }, taskName), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["Link"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 112
        },
        __self: undefined
      }, "#", disputeId), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledSpan2, {
        _css5: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body2'),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 113
        },
        __self: undefined
      }, priority), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_LocalIdentityBadge_LocalIdentityBadge__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: 4,
        connectedAccount: true,
        entity: juror,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 120
        },
        __self: undefined
      }), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
        key: 5,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 121
        },
        __self: undefined
      }, `${Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(formattedDate).format('DD/MM/YY')} at ${hoursAndSec}`)];
    },
    renderEntryActions: () => react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["ContextMenu"], {
      zIndex: 1,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 127
      },
      __self: undefined
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: undefined
  });
};

/* harmony default export */ __webpack_exports__["default"] = (TaskTable);

/***/ }),

/***/ "./src/components/Disputes/DisputeCard.js":
/*!************************************************!*\
  !*** ./src/components/Disputes/DisputeCard.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _DisputeText__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DisputeText */ "./src/components/Disputes/DisputeText.js");
/* harmony import */ var _DisputeStatus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DisputeStatus */ "./src/components/Disputes/DisputeStatus.js");




var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeCard.js";






var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeCard___StyledDiv",
  componentId: "sc-1y3jxd5-0"
})(["display:flex;align-items:center;justify-content:space-between;"]);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeCard___StyledDiv2",
  componentId: "sc-1y3jxd5-1"
})(["& > *{margin-bottom:", "px;}"], p => p._css);

var _StyledH = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].h3.withConfig({
  displayName: "DisputeCard___StyledH",
  componentId: "sc-1y3jxd5-2"
})(["", ""], p => p._css2);

var _StyledDisputeText = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_DisputeText__WEBPACK_IMPORTED_MODULE_3__["default"]).withConfig({
  displayName: "DisputeCard___StyledDisputeText",
  componentId: "sc-1y3jxd5-3"
})(["overflow:hidden;", ";color:", ";line-height:", "px;height:", "px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;"], p => p._css3, p => p._css4, p => p._css5, p => p._css6);

function DisputeCard({
  dispute,
  selectDispute
}) {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  const id = dispute.id,
        creator = dispute.creator,
        description = dispute.description,
        rewardAmount = dispute.rewardAmount,
        stakedAmount = dispute.stakedAmount,
        termDate = dispute.termDate;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(CardItem, {
    onClick: () => selectDispute(dispute.id),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_DisputeStatus__WEBPACK_IMPORTED_MODULE_4__["default"], {
    dispute: dispute,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    _css: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledH, {
    _css2: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body1'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "Dispute", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("strong", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, " #", id)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDisputeText, {
    text: description,
    _css3: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body2'),
    _css4: theme.contentSecondary,
    _css5: 27,
    _css6: 27 * 2,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["IdentityBadge"], {
    entity: creator,
    badgeOnly: true,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(DisputeDetails, {
    labelColor: theme.contentSecondary,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  }, "Reward"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, rewardAmount, " DAI")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: this
  }, "Collateral staked"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }, stakedAmount, " ANJ")), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73
    },
    __self: this
  }, "Term Date"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, termDate))));
}

const CardItem = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Card"]).withConfig({
  displayName: "DisputeCard__CardItem",
  componentId: "sc-1y3jxd5-4"
})(["display:grid;grid-template-columns:100%;grid-gap:", "px;padding:", "px;box-shadow:rgba(51,77,117,0.2) 0px 1px 3px;border:0;"], 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"], 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"]);
const DisputeDetails = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeCard__DisputeDetails",
  componentId: "sc-1y3jxd5-5"
})(["line-height:27px;& > div{display:flex;justify-content:space-between;align-items:center;& > span:first-child{", " font-weight:300;color:", ";}}"], Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'), ({
  labelColor
}) => labelColor);
/* harmony default export */ __webpack_exports__["default"] = (DisputeCard);

/***/ }),

/***/ "./src/components/Disputes/DisputeDetail.js":
/*!**************************************************!*\
  !*** ./src/components/Disputes/DisputeDetail.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _DisputeInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DisputeInfo */ "./src/components/Disputes/DisputeInfo.js");
/* harmony import */ var _DisputeEvidences__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DisputeEvidences */ "./src/components/Disputes/DisputeEvidences.js");
/* harmony import */ var _DisputeTimeline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DisputeTimeline */ "./src/components/Disputes/DisputeTimeline.js");
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeDetail.js";






function DisputeDetail({
  dispute,
  onBack
}) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Bar"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["BackButton"], {
    onClick: onBack,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Split"], {
    primary: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 17
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DisputeInfo__WEBPACK_IMPORTED_MODULE_2__["default"], {
      dispute: dispute,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 18
      },
      __self: this
    }), dispute.evidences && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DisputeEvidences__WEBPACK_IMPORTED_MODULE_3__["default"], {
      evidences: dispute.evidences,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      },
      __self: this
    })),
    secondary: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 25
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Box"], {
      heading: "Voting results",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 26
      },
      __self: this
    }, "Results"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Box"], {
      heading: "Dispute timeline",
      padding: 0,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 27
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DisputeTimeline__WEBPACK_IMPORTED_MODULE_4__["default"], {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28
      },
      __self: this
    }))),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }));
}

/* harmony default export */ __webpack_exports__["default"] = (DisputeDetail);

/***/ }),

/***/ "./src/components/Disputes/DisputeEvidences.js":
/*!*****************************************************!*\
  !*** ./src/components/Disputes/DisputeEvidences.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");



var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeEvidences.js";



var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeEvidences___StyledDiv",
  componentId: "sc-1e0ocn7-0"
})(["display:flex;align-items:center;"]);

var _StyledIconFolder = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["IconFolder"]).withConfig({
  displayName: "DisputeEvidences___StyledIconFolder",
  componentId: "sc-1e0ocn7-1"
})(["margin-right:", "px;"], p => p._css);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeEvidences___StyledDiv2",
  componentId: "sc-1e0ocn7-2"
})(["padding:", "px ", "px;"], p => p._css2, p => p._css3);

function DisputeEvidences({
  evidences
}) {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, evidences.map((evidence, index) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Accordion"], {
    key: index,
    items: [[react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 14
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledIconFolder, {
      color: theme.surfaceIcon,
      _css: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      },
      __self: this
    }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 26
      },
      __self: this
    }, "Evidence #", index + 1)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
      _css2: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
      _css3: 8 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 28
      },
      __self: this
    }, evidence)]],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: this
  })));
}

/* harmony default export */ __webpack_exports__["default"] = (DisputeEvidences);

/***/ }),

/***/ "./src/components/Disputes/DisputeInfo.js":
/*!************************************************!*\
  !*** ./src/components/Disputes/DisputeInfo.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _assets_courtIcon_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../assets/courtIcon.svg */ "./src/assets/courtIcon.svg");
/* harmony import */ var _assets_courtIcon_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_courtIcon_svg__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _DisputeStatus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DisputeStatus */ "./src/components/Disputes/DisputeStatus.js");




















var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeInfo.js";





var _StyledSection = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].section.withConfig({
  displayName: "DisputeInfo___StyledSection",
  componentId: "u0onxf-0"
})(["display:grid;grid-template-columns:auto;grid-gap:", "px;align-items:center;"], p => p._css);

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeInfo___StyledDiv",
  componentId: "u0onxf-1"
})(["display:flex;margin-bottom:", "px;justify-content:space-between;"], p => p._css2);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeInfo___StyledDiv2",
  componentId: "u0onxf-2"
})(["display:flex;align-items:center;"]);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeInfo___StyledDiv3",
  componentId: "u0onxf-3"
})(["background:#c8d7ea;border-radius:50%;padding:12px;display:inline-block;"]);

var _StyledDiv4 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeInfo___StyledDiv4",
  componentId: "u0onxf-4"
})(["margin-left:", "px;"], p => p._css3);

var _StyledText = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Text"]).withConfig({
  displayName: "DisputeInfo___StyledText",
  componentId: "u0onxf-5"
})(["display:block;margin-bottom:", "px;", ";"], _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"], p => p._css4);

var _StyledDiv5 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeInfo___StyledDiv5",
  componentId: "u0onxf-6"
})(["display:grid;grid-template-columns:1fr minmax(250px,auto);grid-gap:", "px;margin-bottom:", "px;"], p => p._css5, p => p._css6);

var _StyledH = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].h2.withConfig({
  displayName: "DisputeInfo___StyledH",
  componentId: "u0onxf-7"
})(["", ";color:", ";margin-bottom:", "px;"], p => p._css7, p => p._css8, p => p._css9);

var _StyledText2 = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Text"]).withConfig({
  displayName: "DisputeInfo___StyledText2",
  componentId: "u0onxf-8"
})(["", ";"], p => p._css10);

var _StyledH2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].h2.withConfig({
  displayName: "DisputeInfo___StyledH2",
  componentId: "u0onxf-9"
})(["", ";color:", ";margin-bottom:", "px;"], p => p._css11, p => p._css12, p => p._css13);

var _StyledDiv6 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeInfo___StyledDiv6",
  componentId: "u0onxf-10"
})(["display:flex;align-items:flex-start;"]);

var _StyledDiv7 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeInfo___StyledDiv7",
  componentId: "u0onxf-11"
})(["display:grid;grid-template-columns:repeat(3,1fr) minmax(250px,auto);margin-bottom:", "px;"], p => p._css14);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeInfo___StyledSpan",
  componentId: "u0onxf-12"
})(["", " color:", ";font-weight:200;display:block;margin-bottom:", "px;"], p => p._css15, p => p._css16, p => p._css17);

var _StyledText3 = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Text"]).withConfig({
  displayName: "DisputeInfo___StyledText3",
  componentId: "u0onxf-13"
})(["display:inline-block;", ";"], p => p._css18);

var _StyledSpan2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeInfo___StyledSpan2",
  componentId: "u0onxf-14"
})(["", " color:", ";font-weight:200;display:block;margin-bottom:", "px;"], p => p._css19, p => p._css20, p => p._css21);

var _StyledText4 = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Text"]).withConfig({
  displayName: "DisputeInfo___StyledText4",
  componentId: "u0onxf-15"
})(["display:inline-block;", ";"], p => p._css22);

var _StyledSpan3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeInfo___StyledSpan3",
  componentId: "u0onxf-16"
})(["", " color:", ";font-weight:200;display:block;margin-bottom:", "px;"], p => p._css23, p => p._css24, p => p._css25);

var _StyledText5 = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Text"]).withConfig({
  displayName: "DisputeInfo___StyledText5",
  componentId: "u0onxf-17"
})(["display:inline-block;", ";"], p => p._css26);

var _StyledSpan4 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeInfo___StyledSpan4",
  componentId: "u0onxf-18"
})(["", " color:", ";font-weight:200;display:block;margin-bottom:", "px;"], p => p._css27, p => p._css28, p => p._css29);

var _StyledButton = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Button"]).withConfig({
  displayName: "DisputeInfo___StyledButton",
  componentId: "u0onxf-19"
})(["background:", ";"], p => p._css30);

const DisputeInfo = ({
  dispute
}) => {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  const id = dispute.id,
        description = dispute.description,
        creator = dispute.creator,
        rewardAmount = dispute.rewardAmount,
        stakedAmount = dispute.stakedAmount,
        term = dispute.term;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Box"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSection, {
    _css: 2.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    _css2: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv3, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("img", {
    src: _assets_courtIcon_svg__WEBPACK_IMPORTED_MODULE_3___default.a,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: undefined
  })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv4, {
    _css3: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledText, {
    _css4: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('title3'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: undefined
  }, "Dispute #", id), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["IdentityBadge"], {
    entity: creator,
    badgeOnly: true,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: undefined
  }))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_DisputeStatus__WEBPACK_IMPORTED_MODULE_4__["default"], {
    dispute: dispute,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    },
    __self: undefined
  }))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv5, {
    _css5: 5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    _css6: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledH, {
    _css7: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css8: theme.surfaceContentSecondary,
    _css9: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91
    },
    __self: undefined
  }, "Description"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledText2, {
    _css10: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body2'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: undefined
  }, description)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 108
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledH2, {
    _css11: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css12: theme.surfaceContentSecondary,
    _css13: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109
    },
    __self: undefined
  }, "Organization"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv6, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["IdentityBadge"] // connectedAccount={addressesEqual(creator, connectedAccount)}
  , {
    entity: creator,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 124
    },
    __self: undefined
  })))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv7, {
    _css14: 5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 131
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 138
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    _css15: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css16: theme.contentSecondary,
    _css17: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 139
    },
    __self: undefined
  }, "Rewards"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledText3, {
    _css18: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body2'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 150
    },
    __self: undefined
  }, `${rewardAmount} DAI`)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan2, {
    _css19: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css20: theme.contentSecondary,
    _css21: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 160
    },
    __self: undefined
  }, "Collateral Staked"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledText4, {
    _css22: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body2'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 171
    },
    __self: undefined
  }, `${stakedAmount} ANJ`)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 180
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan3, {
    _css23: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css24: theme.contentSecondary,
    _css25: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 181
    },
    __self: undefined
  }, "Term Number"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledText5, {
    _css26: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body2'),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 192
    },
    __self: undefined
  }, term)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 201
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan4, {
    _css27: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label2'),
    _css28: theme.contentSecondary,
    _css29: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 202
    },
    __self: undefined
  }, "Created by"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["IdentityBadge"] // connectedAccount={addressesEqual(creator, connectedAccount)}
  , {
    entity: creator,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 213
    },
    __self: undefined
  }))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledButton, {
    mode: "strong",
    onClick: () => {},
    wide: true,
    _css30: theme.surfaceContentSecondary,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 219
    },
    __self: undefined
  }, "Vote")));
};

/* harmony default export */ __webpack_exports__["default"] = (DisputeInfo);

/***/ }),

/***/ "./src/components/Disputes/DisputeList.js":
/*!************************************************!*\
  !*** ./src/components/Disputes/DisputeList.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _DisputeCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DisputeCard */ "./src/components/Disputes/DisputeCard.js");


var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeList.js";




var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeList___StyledDiv",
  componentId: "i50u8b-0"
})(["height:", "px;display:grid;grid-template-columns:auto auto 1fr auto;grid-gap:", "px;align-items:center;padding:0 ", "px;"], p => p._css, p => p._css2, p => p._css3);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeList___StyledSpan",
  componentId: "i50u8b-1"
})(["margin-left:", "px;display:inline-flex;align-items:center;justify-content:center;color:", ";", ";"], p => p._css4, p => p._css5, p => p._css6);

function DisputeList({
  disputes,
  selectDispute
}) {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Bar"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    _css: 8 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    _css2: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    _css3: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["DropDown"], {
    header: "Disputes",
    placeholder: "Disputes" // selected={disputeStatusFilter}
    // onChange={handleDisputeStatusFilterChange}
    ,
    items: [// eslint-disable-next-line
    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 38
      },
      __self: this
    }, "All", react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
      _css4: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
      _css5: theme.info,
      _css6: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label3'),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 40
      },
      __self: this
    }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Tag"], {
      limitDigits: 4,
      label: disputes.length,
      size: "small",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 50
      },
      __self: this
    }))), 'Open', 'Appeal', 'Closed'],
    width: "128px",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["DropDown"], {
    header: "Status",
    placeholder: "Status" // selected={disputeStatusFilter}
    // onChange={handleDisputeStatusFilterChange}
    ,
    items: [],
    width: "128px",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["DateRangePicker"] // startDate={disputeDateRangeFilter.start}
  // endDate={disputeDateRangeFilter.end}
  // onChange={handleDisputeDateRangeFilterChange}
  , {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }, "My disputes"))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["CardLayout"], {
    columnWidthMin: 30 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    rowHeight: 307,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 75
    },
    __self: this
  }, disputes.map(dispute => {
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_DisputeCard__WEBPACK_IMPORTED_MODULE_3__["default"], {
      key: dispute.id,
      dispute: dispute,
      selectDispute: selectDispute,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 78
      },
      __self: this
    });
  })));
}

/* harmony default export */ __webpack_exports__["default"] = (DisputeList);

/***/ }),

/***/ "./src/components/Disputes/DisputeStatus.js":
/*!**************************************************!*\
  !*** ./src/components/Disputes/DisputeStatus.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DisputeStatus; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _dispute_status_type__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../dispute-status-type */ "./src/dispute-status-type.js");

var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeStatus.js";




const getStatusAttributes = (dispute, theme) => {
  if (dispute.status === _dispute_status_type__WEBPACK_IMPORTED_MODULE_3__["DISPUTE_STATUS_OPEN"]) {
    return {
      label: 'Open',
      color: theme.positiveSurfaceContent,
      background: theme.green.alpha(0.2)
    };
  }

  if (dispute.status === _dispute_status_type__WEBPACK_IMPORTED_MODULE_3__["DISPUTE_STATUS_APPEAL"]) {
    return {
      label: 'Appeal',
      color: '#564038',
      // TODO: use theme when available (colors.BrownDark)
      background: 'rgba(216, 188, 177, 0.2)' // colors.BrownLight

    };
  }

  if (dispute.status === _dispute_status_type__WEBPACK_IMPORTED_MODULE_3__["DISPUTE_STATUS_CLOSED"]) {
    return {
      label: 'Closed',
      color: theme.content,
      background: 'rgba(200, 215, 234, 0.4)' // TODO: use theme when available

    };
  }
};

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeStatus___StyledSpan",
  componentId: "sc-1hkqoe1-0"
})(["padding:1px 16px;border-radius:100px;background:#d2d2d2;text-transform:uppercase;font-size:12px;color:", ";background:", ";"], p => p._css, p => p._css2);

function DisputeStatus({
  dispute
}) {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();

  const _getStatusAttributes = getStatusAttributes(dispute, theme),
        label = _getStatusAttributes.label,
        color = _getStatusAttributes.color,
        background = _getStatusAttributes.background;

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    _css: color,
    _css2: background,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, label);
}

/***/ }),

/***/ "./src/components/Disputes/DisputeText.js":
/*!************************************************!*\
  !*** ./src/components/Disputes/DisputeText.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);


var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeText.js";

 // Render a text associated to a dispute.

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "DisputeText___StyledDiv",
  componentId: "sc-1t1tw7e-0"
})(["hyphens:auto;overflow-wrap:anywhere;word-break:break-word;"]);

const DisputeText = (_ref) => {
  let text = _ref.text,
      props = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref, ["text"]);

  // If there is no text, the component doesn’t render anything.
  if (!text.trim()) {
    return null;
  }

  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv, Object.assign({}, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: undefined
  }, text));
};

DisputeText.propTypes = {
  text: prop_types__WEBPACK_IMPORTED_MODULE_3___default.a.string
};
DisputeText.defaultProps = {
  text: ''
};
/* harmony default export */ __webpack_exports__["default"] = (DisputeText);

/***/ }),

/***/ "./src/components/Disputes/DisputeTimeline.js":
/*!****************************************************!*\
  !*** ./src/components/Disputes/DisputeTimeline.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _mock_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mock-data */ "./src/mock-data.js");
/* harmony import */ var _Stepper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Stepper */ "./src/components/Stepper.js");
/* harmony import */ var _Step__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Step */ "./src/components/Step.js");





var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/DisputeTimeline.js";






var _StyledStepper = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_Stepper__WEBPACK_IMPORTED_MODULE_4__["default"]).withConfig({
  displayName: "DisputeTimeline___StyledStepper",
  componentId: "sc-19zfium-0"
})(["padding:", "px 0;"], p => p._css);

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "DisputeTimeline___StyledDiv",
  componentId: "sc-19zfium-1"
})(["background:", ";border-radius:80%;padding:10px;position:relative;z-index:2;display:inline-flex;"], p => p._css2);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeTimeline___StyledSpan",
  componentId: "sc-19zfium-2"
})(["", ""], p => p._css3);

var _StyledSpan2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeTimeline___StyledSpan2",
  componentId: "sc-19zfium-3"
})(["color:", ";opacity:0.6;"], p => p._css4);

var _StyledSpan3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "DisputeTimeline___StyledSpan3",
  componentId: "sc-19zfium-4"
})(["", " text-transform:Uppercase;background:rgba(200,215,234,0.4);border-radius:100px;padding:5px 10px;"], p => p._css5);

function DisputeTimeline() {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  const current = 4;
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledStepper, {
    lineColor: theme.surfaceIcon,
    lineTop: 15,
    _css: 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, _mock_data__WEBPACK_IMPORTED_MODULE_3__["timeline"].map(({
    label,
    date,
    Icon
  }, index) => {
    const active = current === index;
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Step__WEBPACK_IMPORTED_MODULE_5__["default"], {
      key: index,
      active: active,
      stepPoint: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
        _css2: active ? theme.surfaceIcon : '#ECEFF4',
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Icon, {
        color: active ? '#fff' : theme.surfaceIcon,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 38
        },
        __self: this
      })),
      content: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
        _css3: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('body1'),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 44
        },
        __self: this
      }, label)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 46
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan2, {
        _css4: theme.contentSecondary,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 47
        },
        __self: this
      }, date)), active && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 57
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan3, {
        _css5: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["textStyle"])('label3'),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 58
        },
        __self: this
      }, "current"))),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 24
      },
      __self: this
    });
  })));
}

/* harmony default export */ __webpack_exports__["default"] = (DisputeTimeline);

/***/ }),

/***/ "./src/components/Disputes/Disputes.js":
/*!*********************************************!*\
  !*** ./src/components/Disputes/Disputes.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _DisputeDetail__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DisputeDetail */ "./src/components/Disputes/DisputeDetail.js");
/* harmony import */ var _DisputeList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DisputeList */ "./src/components/Disputes/DisputeList.js");
/* harmony import */ var _mock_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../mock-data */ "./src/mock-data.js");

var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Disputes/Disputes.js";






function Disputes() {
  const _useSelectedDispute = useSelectedDispute(_mock_data__WEBPACK_IMPORTED_MODULE_5__["disputes"]),
        _useSelectedDispute2 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useSelectedDispute, 2),
        selectedDispute = _useSelectedDispute2[0],
        selectDispute = _useSelectedDispute2[1];

  const handleBack = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(() => {
    selectDispute(-1);
  }, [selectDispute]);
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Header"], {
    primary: "Disputes",
    secondary: !selectedDispute && react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      label: "Buy ANJ",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      },
      __self: this
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }), selectedDispute ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_DisputeDetail__WEBPACK_IMPORTED_MODULE_3__["default"], {
    dispute: selectedDispute,
    onBack: handleBack,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
    },
    __self: this
  }) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_DisputeList__WEBPACK_IMPORTED_MODULE_4__["default"], {
    disputes: _mock_data__WEBPACK_IMPORTED_MODULE_5__["disputes"],
    selectDispute: selectDispute // filteredDisputes={filteredDisputes}
    // disputeStatusFilter={disputeStatusFilter}
    // handleDisputeStatusFilterChange={handleDisputeStatusFilterChange}
    // disputeAppFilter={disputeAppFilter}
    // handleDisputeAppFilterChange={handleDisputeAppFilterChange}
    // handleClearFilters={handleClearFilters}
    // executionTargets={executionTargets}
    ,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }));
}

const useSelectedDispute = disputes => {
  const _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(-1),
        _useState2 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
        selectedDisputeId = _useState2[0],
        setSelectedDisputeId = _useState2[1];

  const selectDispute = disputeId => setSelectedDisputeId(disputeId);

  const selectedDispute = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => disputes.find(dispute => dispute.id === selectedDisputeId) || null, [disputes, selectedDisputeId]);
  return [selectedDispute, selectDispute];
};

/* harmony default export */ __webpack_exports__["default"] = (Disputes);

/***/ }),

/***/ "./src/components/Lib/dayjs.js":
/*!*************************************!*\
  !*** ./src/components/Lib/dayjs.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dayjs_plugin_isBetween__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dayjs/plugin/isBetween */ "./node_modules/dayjs/plugin/isBetween.js");
/* harmony import */ var dayjs_plugin_isBetween__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dayjs_plugin_isBetween__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dayjs */ "./node_modules/dayjs/dayjs.min.js");
/* harmony import */ var dayjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dayjs__WEBPACK_IMPORTED_MODULE_1__);


dayjs__WEBPACK_IMPORTED_MODULE_1___default.a.extend(dayjs_plugin_isBetween__WEBPACK_IMPORTED_MODULE_0___default.a);
/* harmony default export */ __webpack_exports__["default"] = (dayjs__WEBPACK_IMPORTED_MODULE_1___default.a);

/***/ }),

/***/ "./src/components/Lib/web3.js":
/*!************************************!*\
  !*** ./src/components/Lib/web3.js ***!
  \************************************/
/*! exports provided: addressesEqual, addressPattern */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addressesEqual", function() { return addressesEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addressPattern", function() { return addressPattern; });
/* harmony import */ var js_sha3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-sha3 */ "./node_modules/js-sha3/src/sha3.js");
/* harmony import */ var js_sha3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_sha3__WEBPACK_IMPORTED_MODULE_0__);

const keccak256 = js_sha3__WEBPACK_IMPORTED_MODULE_0___default.a.keccak_256;

function toChecksumAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    throw new Error('Given address "' + address + '" is not a valid Ethereum address.');
  }

  address = address.toLowerCase().replace(/^0x/i, '');
  const addressHash = keccak256(address).replace(/^0x/i, '');
  let checksumAddress = '0x';

  for (let i = 0; i < address.length; i++) {
    // If ith character is 9 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }

  return checksumAddress;
} // Check address equality with checksums


function addressesEqual(first, second) {
  first = first && toChecksumAddress(first);
  second = second && toChecksumAddress(second);
  return first === second;
}
const addressPattern = '(0x)?[0-9a-fA-F]{40}';

/***/ }),

/***/ "./src/components/LocalIdentityBadge/LocalIdentityBadge.js":
/*!*****************************************************************!*\
  !*** ./src/components/LocalIdentityBadge/LocalIdentityBadge.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _LocalLabelPopoverTitle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./LocalLabelPopoverTitle */ "./src/components/LocalIdentityBadge/LocalLabelPopoverTitle.js");
/* harmony import */ var _LocalLabelPopoverActionLabel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LocalLabelPopoverActionLabel */ "./src/components/LocalIdentityBadge/LocalLabelPopoverActionLabel.js");


var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/LocalIdentityBadge/LocalIdentityBadge.js";
 // import { useNetwork } from '@aragon/api-react'

 // import { useIdentity } from '../IdentityManager/IdentityManager'




const LocalIdentityBadge = (_ref) => {
  let entity = _ref.entity,
      props = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["entity"]);

  const network = {
    type: 'local'
  };
  const label = ''; // const [label, showLocalIdentityModal] = useIdentity(entity)
  //  const handleClick = () => showLocalIdentityModal(entity)

  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["IdentityBadge"], Object.assign({
    label: label || '',
    entity: entity,
    networkType: network && network.type,
    popoverAction: {
      label: react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_LocalLabelPopoverActionLabel__WEBPACK_IMPORTED_MODULE_5__["default"], {
        hasLabel: Boolean(label),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 19
        },
        __self: undefined
      }),
      onClick: () => {}
    },
    popoverTitle: label ? react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_LocalLabelPopoverTitle__WEBPACK_IMPORTED_MODULE_4__["default"], {
      label: label,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 23
      },
      __self: undefined
    }) : undefined
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: undefined
  }));
};

LocalIdentityBadge.propTypes = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectSpread2__WEBPACK_IMPORTED_MODULE_0__["default"])({}, _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["IdentityBadge"].propTypes);
/* harmony default export */ __webpack_exports__["default"] = (LocalIdentityBadge);

/***/ }),

/***/ "./src/components/LocalIdentityBadge/LocalLabelPopoverActionLabel.js":
/*!***************************************************************************!*\
  !*** ./src/components/LocalIdentityBadge/LocalLabelPopoverActionLabel.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");


var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/LocalIdentityBadge/LocalLabelPopoverActionLabel.js";




var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "LocalLabelPopoverActionLabel___StyledDiv",
  componentId: "sc-65bxwm-0"
})(["display:flex;align-items:center;"]);

var _StyledIconLabel = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["IconLabel"]).withConfig({
  displayName: "LocalLabelPopoverActionLabel___StyledIconLabel",
  componentId: "sc-65bxwm-1"
})(["margin-right:", "px;"], p => p._css);

function LocalLabelPopoverActionLabel({
  hasLabel
}) {
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledIconLabel, {
    _css: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }), hasLabel ? 'Edit' : 'Add', " custom label");
}

LocalLabelPopoverActionLabel.propTypes = {
  hasLabel: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.bool
};
/* harmony default export */ __webpack_exports__["default"] = (LocalLabelPopoverActionLabel);

/***/ }),

/***/ "./src/components/LocalIdentityBadge/LocalLabelPopoverTitle.js":
/*!*********************************************************************!*\
  !*** ./src/components/LocalIdentityBadge/LocalLabelPopoverTitle.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");



var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/LocalIdentityBadge/LocalLabelPopoverTitle.js";




var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "LocalLabelPopoverTitle___StyledDiv",
  componentId: "mvajti-0"
})(["display:grid;align-items:center;grid-template-columns:auto 1fr;"]);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].span.withConfig({
  displayName: "LocalLabelPopoverTitle___StyledSpan",
  componentId: "mvajti-1"
})(["display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"]);

var _StyledTag = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["Tag"]).withConfig({
  displayName: "LocalLabelPopoverTitle___StyledTag",
  componentId: "mvajti-2"
})(["margin-left:", "px;"], p => p._css);

function LocalLabelPopoverTitle({
  label
}) {
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSpan, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, label), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledTag, {
    mode: "identifier",
    _css: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, "Custom label"));
}

LocalLabelPopoverTitle.propTypes = {
  label: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.string.isRequired
};
/* harmony default export */ __webpack_exports__["default"] = (LocalLabelPopoverTitle);

/***/ }),

/***/ "./src/components/Step.js":
/*!********************************!*\
  !*** ./src/components/Step.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Step; });
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");



var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Step.js";



var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Step___StyledDiv",
  componentId: "sc-158uylk-0"
})(["background:", ";"], p => p._css);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Step___StyledDiv2",
  componentId: "sc-158uylk-1"
})(["position:relative;z-index:2;"]);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "Step___StyledDiv3",
  componentId: "sc-158uylk-2"
})(["margin-left:", "px;"], p => p._css2);

function Step({
  stepPoint,
  content,
  active
}) {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    _css: active ? theme.surfaceSelected : '',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, stepPoint), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv3, {
    _css2: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, content));
}

/***/ }),

/***/ "./src/components/Stepper.js":
/*!***********************************!*\
  !*** ./src/components/Stepper.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");


var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Stepper.js";



var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "Stepper___StyledDiv",
  componentId: "sc-81iw7o-0"
})(["& > *{display:flex;align-items:stretch;padding:", "px ", "px;&:first-child{padding-top:0;}&:last-child{padding-bottom:0;}}& >:not(:last-child) >:first-child::after{background:", ";content:'';height:calc(100% + ", "px + ", "px);width:", "px;position:absolute;top:", "px;left:calc(50% - (", "px / 2));z-index:1;}"], p => p._css, p => p._css2, p => p._css3, p => p._css4, p => p._css5, p => p._css6, p => p._css7, p => p._css8);

function Stepper(_ref) {
  let lineColor = _ref.lineColor,
      lineExtraHeight = _ref.lineExtraHeight,
      lineTop = _ref.lineTop,
      lineWidth = _ref.lineWidth,
      children = _ref.children,
      props = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_objectWithoutProperties__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref, ["lineColor", "lineExtraHeight", "lineTop", "lineWidth", "children"]);

  const stepVerticalPadding = 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"];
  const stepHorizontalPadding = 3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"];
  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv, Object.assign({}, props, {
    _css: stepVerticalPadding,
    _css2: stepHorizontalPadding,
    _css3: lineColor,
    _css4: stepVerticalPadding,
    _css5: lineExtraHeight,
    _css6: lineWidth,
    _css7: lineTop,
    _css8: lineWidth,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }), children);
}

Stepper.defaultProps = {
  lineColor: '#000',
  lineExtraHeight: 0,
  // px
  lineTop: 0,
  // px
  lineWidth: 1 // px

};
/* harmony default export */ __webpack_exports__["default"] = (Stepper);

/***/ }),

/***/ "./src/components/Tasks/Tasks.js":
/*!***************************************!*\
  !*** ./src/components/Tasks/Tasks.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _TasksBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TasksBox */ "./src/components/Tasks/TasksBox.js");
/* harmony import */ var _TasksTable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TasksTable */ "./src/components/Tasks/TasksTable.js");
/* harmony import */ var _mock_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../mock-data */ "./src/mock-data.js");
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Tasks/Tasks.js";






const Tasks = () => {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Header"], {
    primary: "Tasks",
    secondary: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      label: "Buy ANJ",
      onClick: () => {},
      __source: {
        fileName: _jsxFileName,
        lineNumber: 13
      },
      __self: undefined
    }),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TasksBox__WEBPACK_IMPORTED_MODULE_2__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TasksTable__WEBPACK_IMPORTED_MODULE_3__["default"], {
    tasks: _mock_data__WEBPACK_IMPORTED_MODULE_4__["tasks"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (Tasks);

/***/ }),

/***/ "./src/components/Tasks/TasksAmounts.js":
/*!**********************************************!*\
  !*** ./src/components/Tasks/TasksAmounts.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");




var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Tasks/TasksAmounts.js";



var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "TasksAmounts___StyledDiv",
  componentId: "sc-1mmc0ju-0"
})(["display:inline-block"]);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "TasksAmounts___StyledDiv2",
  componentId: "sc-1mmc0ju-1"
})(["width:", "px;height:", "px;background:linear-gradient( 35deg,", " -75%,", " 105% );border-radius:50%;"], p => p._css, p => p._css2, p => p._css3, p => p._css4);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "TasksAmounts___StyledDiv3",
  componentId: "sc-1mmc0ju-2"
})(["color:", ";font-style:normal;font-weight:normal;font-size:16px;line-height:25px;margin-top:", "px;"], p => p._css5, p => p._css6);

var _StyledDiv4 = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "TasksAmounts___StyledDiv4",
  componentId: "sc-1mmc0ju-3"
})(["font-style:normal;font-weight:300;font-size:26px;"]);

function TasksAmounts({
  amount,
  status
}) {
  const theme = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useTheme"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv2, {
    _css: 5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    _css2: 5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    _css3: theme.accentStart,
    _css4: theme.accentEnd,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    },
    __self: this
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv3, {
    _css5: theme.surfaceContentSecondary,
    _css6: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, status.toUpperCase()), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv4, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, amount)));
}

/* harmony default export */ __webpack_exports__["default"] = (TasksAmounts);

/***/ }),

/***/ "./src/components/Tasks/TasksBox.js":
/*!******************************************!*\
  !*** ./src/components/Tasks/TasksBox.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _TasksAmounts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TasksAmounts */ "./src/components/Tasks/TasksAmounts.js");



var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Tasks/TasksBox.js";




var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "TasksBox___StyledDiv",
  componentId: "sc-1btyjxk-0"
})(["min-height:112px;transform:translate3d(0,0,0);overflow-x:auto;"]);

var _StyledUl = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].ul.withConfig({
  displayName: "TasksBox___StyledUl",
  componentId: "sc-1btyjxk-1"
})(["list-style:none;display:flex;", ""], p => p._css);

var _StyledLi = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].li.withConfig({
  displayName: "TasksBox___StyledLi",
  componentId: "sc-1btyjxk-2"
})(["display:block;min-width:", "px;", " &:last-of-type{min-width:unset;margin-bottom:0;}"], p => p._css2, p => p._css3);

function TasksBox() {
  const _useViewport = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["useViewport"])(),
        below = _useViewport.below;

  const compactMode = below('medium');
  const tasks = [{
    status: 'active',
    amount: 34
  }, {
    status: 'completed',
    amount: 21
  }, {
    status: 'archived',
    amount: 67
  }];
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["Box"], {
    heading: "Overview",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledUl, {
    _css: compactMode ? `
                  flex-direction: column;
                  padding: ${1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"]}px 0;
                ` : '',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, tasks.map(({
    amount,
    status
  }) => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledLi, {
    key: amount,
    _css2: 20 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    _css3: compactMode ? `margin-bottom: ${3 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"]}px;` : '',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_TasksAmounts__WEBPACK_IMPORTED_MODULE_3__["default"], {
    amount: amount,
    status: status,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }))))));
}

/* harmony default export */ __webpack_exports__["default"] = (TasksBox);

/***/ }),

/***/ "./src/components/Tasks/TasksFilters.js":
/*!**********************************************!*\
  !*** ./src/components/Tasks/TasksFilters.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");


var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Tasks/TasksFilters.js";



var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_0__["default"].div.withConfig({
  displayName: "TasksFilters___StyledDiv",
  componentId: "wu1ib6-0"
})(["margin-bottom:", "px;display:grid;grid-gap:", "px;grid-template-columns:auto auto auto 1fr auto;"], p => p._css, p => p._css2);

var _StyledSearchInput = Object(styled_components__WEBPACK_IMPORTED_MODULE_0__["default"])(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["SearchInput"]).withConfig({
  displayName: "TasksFilters___StyledSearchInput",
  componentId: "wu1ib6-1"
})(["width:", "px;"], p => p._css3);

const TasksFilters = ({
  dateRangeFilter,
  onDateRangeChange
}) => {
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledDiv, {
    _css: 1 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    _css2: 1.5 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["DropDown"], {
    placeholder: "All Tasks",
    header: "All Tasks",
    items: [],
    onChange: () => {},
    width: "128px",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["DropDown"], {
    placeholder: "Status",
    header: "Status",
    items: [],
    onChange: () => {},
    width: "128px",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["DropDown"], {
    placeholder: "Priority",
    header: "Priority",
    items: [],
    onChange: () => {},
    width: "128px",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_2__["DateRangePicker"], {
    startDate: dateRangeFilter.start,
    endDate: dateRangeFilter.end,
    onChange: onDateRangeChange,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_StyledSearchInput, {
    placeholder: "Search",
    value: "",
    onChange: () => {},
    _css3: 32 * _aragon_ui__WEBPACK_IMPORTED_MODULE_2__["GU"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: undefined
  }));
};

/* harmony default export */ __webpack_exports__["default"] = (TasksFilters);

/***/ }),

/***/ "./src/components/Tasks/TasksTable.js":
/*!********************************************!*\
  !*** ./src/components/Tasks/TasksTable.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-components */ "./node_modules/styled-components/dist/styled-components.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Lib/dayjs */ "./src/components/Lib/dayjs.js");
/* harmony import */ var _LocalIdentityBadge_LocalIdentityBadge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../LocalIdentityBadge/LocalIdentityBadge */ "./src/components/LocalIdentityBadge/LocalIdentityBadge.js");
/* harmony import */ var _TasksFilters__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TasksFilters */ "./src/components/Tasks/TasksFilters.js");








var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/components/Tasks/TasksTable.js";





const INITIAL_DATE_RANGE = {
  start: null,
  end: null
};

const getFilteredTasks = ({
  tasks,
  selectedDateRange
}) => {
  return tasks.filter(({
    taskName,
    disputeId,
    priority,
    juror,
    dueDate
  }) => !selectedDateRange.start || !selectedDateRange.end || Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dueDate).isBetween(Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(selectedDateRange.start).startOf('day'), Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(selectedDateRange.end).endOf('day'), '[]'));
};

var _StyledDiv = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "TasksTable___StyledDiv",
  componentId: "sc-1ei9u9r-0"
})(["padding-bottom:", "px;display:flex;align-items:center;justify-content:space-between;"], p => p._css);

var _StyledDiv2 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "TasksTable___StyledDiv2",
  componentId: "sc-1ei9u9r-1"
})(["color:", ";", ";"], p => p._css2, p => p._css3);

var _StyledDiv3 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "TasksTable___StyledDiv3",
  componentId: "sc-1ei9u9r-2"
})(["text-align:right;"]);

var _StyledDiv4 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].div.withConfig({
  displayName: "TasksTable___StyledDiv4",
  componentId: "sc-1ei9u9r-3"
})(["display:flex;"]);

var _StyledSpan = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].span.withConfig({
  displayName: "TasksTable___StyledSpan",
  componentId: "sc-1ei9u9r-4"
})(["", ""], p => p._css4);

var _StyledSpan2 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].span.withConfig({
  displayName: "TasksTable___StyledSpan2",
  componentId: "sc-1ei9u9r-5"
})(["", ""], p => p._css5);

var _StyledSpan3 = styled_components__WEBPACK_IMPORTED_MODULE_1__["default"].span.withConfig({
  displayName: "TasksTable___StyledSpan3",
  componentId: "sc-1ei9u9r-6"
})(["", ""], p => p._css6);

const TaskTable = ({
  tasks
}) => {
  const _useState = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(INITIAL_DATE_RANGE),
        _useState2 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
        selectedDateRange = _useState2[0],
        setSelectedDateRange = _useState2[1];

  const _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(0),
        _useState4 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState3, 2),
        page = _useState4[0],
        setPage = _useState4[1];

  const _useViewport = Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["useViewport"])(),
        below = _useViewport.below;

  const compactMode = below('medium');

  const handleSelectedDateRangeChange = range => {
    setPage(0);
    setSelectedDateRange(range);
  };

  const filteredTasks = getFilteredTasks({
    tasks,
    selectedDateRange
  });
  const sortedTasks = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => filteredTasks.sort(({
    dueDate: dateLeft
  }, {
    dueDate: dateRight
  }) => // Sort by date ascending
  Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateLeft).isAfter(Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateRight)) ? 1 : Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateLeft).isSame(Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dateRight)) ? 0 : -1), [filteredTasks]);
  return react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["DataView"], {
    page: page,
    onPageChange: () => {},
    heading: react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv, {
      _css: 2 * _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["GU"],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 67
      },
      __self: undefined
    }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv2, {
      _css2: _aragon_ui__WEBPACK_IMPORTED_MODULE_3__["theme"].content,
      _css3: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body1'),
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75
      },
      __self: undefined
    }, "Upcoming tasks"), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv3, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 84
      },
      __self: undefined
    }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["DropDown"], {
      placeholder: react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledDiv4, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 87
        },
        __self: undefined
      }, react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["IconApps"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 92
        },
        __self: undefined
      }), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledSpan, {
        _css4: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body2'),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 93
        },
        __self: undefined
      }, "Actions")),
      header: "Actions",
      items: [],
      onChange: () => {},
      width: "162px",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 85
      },
      __self: undefined
    }))), !compactMode && react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_TasksFilters__WEBPACK_IMPORTED_MODULE_6__["default"], {
      dateRangeFilter: selectedDateRange,
      onDateRangeChange: handleSelectedDateRangeChange,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 110
      },
      __self: undefined
    })),
    fields: ['Task', 'Dispute', 'Priority', 'Assigned to juror', 'Due date'],
    entries: sortedTasks,
    renderEntry: ({
      taskName,
      disputeId,
      priority,
      juror,
      dueDate
    }) => {
      const formattedDate = Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dueDate).format('YYYY-MM-DDTHH:mm:ssZ');
      const hoursAndSec = Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(dueDate).format('HH:mm');
      return [react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledSpan2, {
        _css5: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body2'),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 123
        },
        __self: undefined
      }, taskName), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["Link"], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 130
        },
        __self: undefined
      }, "#", disputeId), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_StyledSpan3, {
        _css6: Object(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["textStyle"])('body2'),
        __source: {
          fileName: _jsxFileName,
          lineNumber: 131
        },
        __self: undefined
      }, priority), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_LocalIdentityBadge_LocalIdentityBadge__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: 4,
        connectedAccount: true,
        entity: juror,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 138
        },
        __self: undefined
      }), react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
        key: 5,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 139
        },
        __self: undefined
      }, `${Object(_Lib_dayjs__WEBPACK_IMPORTED_MODULE_4__["default"])(formattedDate).format('DD/MM/YY')} at ${hoursAndSec} - Term `)];
    },
    renderEntryActions: () => react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_aragon_ui__WEBPACK_IMPORTED_MODULE_3__["ContextMenu"], {
      zIndex: 1,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 145
      },
      __self: undefined
    }),
    onSelectEntries: () => {},
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: undefined
  });
};

/* harmony default export */ __webpack_exports__["default"] = (TaskTable);

/***/ }),

/***/ "./src/dispute-status-type.js":
/*!************************************!*\
  !*** ./src/dispute-status-type.js ***!
  \************************************/
/*! exports provided: DISPUTE_STATUS_OPEN, DISPUTE_STATUS_APPEAL, DISPUTE_STATUS_CLOSED */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DISPUTE_STATUS_OPEN", function() { return DISPUTE_STATUS_OPEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DISPUTE_STATUS_APPEAL", function() { return DISPUTE_STATUS_APPEAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DISPUTE_STATUS_CLOSED", function() { return DISPUTE_STATUS_CLOSED; });
const DISPUTE_STATUS_OPEN = Symbol('DISPUTE_STATUS_OPEN');
const DISPUTE_STATUS_APPEAL = Symbol('DISPUTE_STATUS_APPEAL');
const DISPUTE_STATUS_CLOSED = Symbol('DISPUTE_STATUS_CLOSED');

/***/ }),

/***/ "./src/endpoints.js":
/*!**************************!*\
  !*** ./src/endpoints.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return endpoints; });
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment */ "./src/environment.js");
/* harmony import */ var _web3_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./web3-utils */ "./src/web3-utils.js");



const CHAIN_ID = Object(_environment__WEBPACK_IMPORTED_MODULE_1__["default"])('CHAIN_ID'); // The graph endpoints

const GRAPH_API_BASE_HTTP_LOCAL = 'http://127.0.0.1:8000';
const GRAPH_API_BASE_WS_LOCAL = 'ws://127.0.0.1:8001';
const GRAPH_API_BASE_HTTP = 'https://api.thegraph.com';
const GRAPH_API_BASE_WS = 'wss://api.thegraph.com';
const GRAPH_API_PATH = '/subgraphs/name/aragon/aragon-court';

function getAPIBase() {
  return Object(_web3_utils__WEBPACK_IMPORTED_MODULE_2__["isLocalNetwork"])(CHAIN_ID) ? [GRAPH_API_BASE_HTTP_LOCAL, GRAPH_API_BASE_WS_LOCAL] : [GRAPH_API_BASE_HTTP, GRAPH_API_BASE_WS];
}

function endpoints() {
  const _getAPIBase = getAPIBase(),
        _getAPIBase2 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_getAPIBase, 2),
        API_BASE_HTTP = _getAPIBase2[0],
        API_BASE_WS = _getAPIBase2[1];

  const networkName = Object(_web3_utils__WEBPACK_IMPORTED_MODULE_2__["getNetworkName"])(CHAIN_ID);
  const API_PATH = `${GRAPH_API_PATH}-${networkName}`;
  return [`${API_BASE_HTTP}${API_PATH}`, `${API_BASE_WS}${API_PATH}`];
}

/***/ }),

/***/ "./src/environment.js":
/*!****************************!*\
  !*** ./src/environment.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return environment; });
const DEFAULT_CHAIN_ID = 1337; // rpc

const envVars = {
  CHAIN_ID: Object({"NODE_ENV":"development","PUBLIC_URL":""}).CHAIN_ID || DEFAULT_CHAIN_ID
};
function environment(name) {
  const envVar = envVars[name];

  if (!envVar) {
    return null;
  }

  return envVar;
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App */ "./src/App.js");
/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! urql */ "./node_modules/urql/dist/es/urql.js");
/* harmony import */ var subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! subscriptions-transport-ws */ "./node_modules/subscriptions-transport-ws/dist/client.js");
/* harmony import */ var subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _urql_devtools__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @urql/devtools */ "./node_modules/@urql/devtools/dist/urql-devtools-exchange.es.js");
/* harmony import */ var _endpoints__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./endpoints */ "./src/endpoints.js");

var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/index.js";








const _endpoints = Object(_endpoints__WEBPACK_IMPORTED_MODULE_7__["default"])(),
      _endpoints2 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_endpoints, 2),
      GRAPH_API_ENDPOINT_HTTP = _endpoints2[0],
      GRAPH_API_ENDPOINT_WS = _endpoints2[1];

console.log(GRAPH_API_ENDPOINT_HTTP, GRAPH_API_ENDPOINT_WS);
const subscriptionClient = new subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_5__["SubscriptionClient"](GRAPH_API_ENDPOINT_WS, {});
const client = Object(urql__WEBPACK_IMPORTED_MODULE_4__["createClient"])({
  url: GRAPH_API_ENDPOINT_HTTP,
  exchanges: [urql__WEBPACK_IMPORTED_MODULE_4__["debugExchange"], _urql_devtools__WEBPACK_IMPORTED_MODULE_6__["devtoolsExchange"], urql__WEBPACK_IMPORTED_MODULE_4__["cacheExchange"], urql__WEBPACK_IMPORTED_MODULE_4__["fetchExchange"], Object(urql__WEBPACK_IMPORTED_MODULE_4__["subscriptionExchange"])({
    forwardSubscription: operation => subscriptionClient.request(operation)
  })]
});
react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.render(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(urql__WEBPACK_IMPORTED_MODULE_4__["Provider"], {
  value: client,
  __source: {
    fileName: _jsxFileName,
    lineNumber: 36
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_App__WEBPACK_IMPORTED_MODULE_3__["default"], {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 37
  },
  __self: undefined
})), document.getElementById('root'));

/***/ }),

/***/ "./src/mock-data.js":
/*!**************************!*\
  !*** ./src/mock-data.js ***!
  \**************************/
/*! exports provided: balances, latestActivity, disputes, timeline, tasks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "balances", function() { return balances; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "latestActivity", function() { return latestActivity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disputes", function() { return disputes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timeline", function() { return timeline; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tasks", function() { return tasks; });
/* harmony import */ var _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dispute-status-type */ "./src/dispute-status-type.js");
/* harmony import */ var _aragon_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @aragon/ui */ "./node_modules/@aragon/ui/dist/index.esm.js");
/* harmony import */ var _assets_dai_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/dai.svg */ "./src/assets/dai.svg");
/* harmony import */ var _assets_dai_svg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_dai_svg__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _assets_ant_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./assets/ant.svg */ "./src/assets/ant.svg");
/* harmony import */ var _assets_ant_svg__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_ant_svg__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _assets_anj_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./assets/anj.svg */ "./src/assets/anj.svg");
/* harmony import */ var _assets_anj_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_anj_svg__WEBPACK_IMPORTED_MODULE_4__);





const balances = {
  wallet: [{
    amount: '3.304,76',
    tokenSymbol: 'DAI',
    value: '3.300',
    icon: _assets_dai_svg__WEBPACK_IMPORTED_MODULE_2___default.a
  }, {
    amount: '3.304,76',
    tokenSymbol: 'ANT',
    value: '3.300',
    icon: _assets_ant_svg__WEBPACK_IMPORTED_MODULE_3___default.a
  }],
  staked: [{
    amount: '3.304,76',
    tokenSymbol: 'ANJ',
    value: '3.300',
    icon: _assets_anj_svg__WEBPACK_IMPORTED_MODULE_4___default.a
  }],
  active: [{
    amount: '3.304,76',
    tokenSymbol: 'ANJ',
    value: '3.300',
    icon: _assets_anj_svg__WEBPACK_IMPORTED_MODULE_4___default.a
  }],
  rewards: [{
    amount: '3.304,76',
    tokenSymbol: 'DAI',
    value: '3.300',
    icon: _assets_dai_svg__WEBPACK_IMPORTED_MODULE_2___default.a
  }, {
    amount: '3.304,76',
    tokenSymbol: 'ANJ',
    value: '3.300',
    icon: _assets_anj_svg__WEBPACK_IMPORTED_MODULE_4___default.a
  }]
};
const latestActivity = [{
  account: '0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
  action: 'Started',
  target: {
    label: 'review evidence',
    link: 'url'
  },
  date: '26/11/19 AT 16:00'
}, {
  account: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  action: 'Comitted their',
  target: {
    label: 'vote',
    link: 'url'
  },
  date: '26/11/19 AT 16:00'
}, {
  account: '0x49C01b61Aa3e4cD4C4763c78EcFE75888b49ef50',
  action: 'Executed',
  target: {
    label: 'ruling',
    link: 'url'
  },
  date: '26/11/19 AT 16:00'
}];
const disputes = [{
  id: 0,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  status: _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__["DISPUTE_STATUS_OPEN"],
  creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  rewardAmount: 1000,
  stakedAmount: 746,
  term: 1,
  termDate: '15/02/20',
  evidences: ["Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.", "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me."]
}, {
  id: 1,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  status: _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__["DISPUTE_STATUS_CLOSED"],
  creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  rewardAmount: 1080,
  stakedAmount: 865,
  term: 1,
  termDate: '15/02/20',
  evidences: ["Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.", "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me."]
}, {
  id: 2,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  status: _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__["DISPUTE_STATUS_APPEAL"],
  creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  rewardAmount: 870,
  stakedAmount: 500,
  term: 1,
  termDate: '15/02/20',
  evidences: ["Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.", "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me."]
}, {
  id: 3,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  status: _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__["DISPUTE_STATUS_CLOSED"],
  creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  rewardAmount: 908,
  stakedAmount: 1023,
  term: 1,
  termDate: '15/02/20',
  evidences: ["Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.", "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me."]
}, {
  id: 4,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  status: _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__["DISPUTE_STATUS_OPEN"],
  creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  rewardAmount: 385,
  stakedAmount: 985,
  term: 1,
  termDate: '15/02/20',
  evidences: ["Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.", "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me."]
}, {
  id: 5,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  status: _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__["DISPUTE_STATUS_APPEAL"],
  creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  rewardAmount: 930,
  stakedAmount: 495,
  term: 1,
  termDate: '15/02/20',
  evidences: ["Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.", "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me."]
}, {
  id: 6,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  status: _dispute_status_type__WEBPACK_IMPORTED_MODULE_0__["DISPUTE_STATUS_OPEN"],
  creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
  rewardAmount: 1093,
  stakedAmount: 385,
  term: 1,
  termDate: '15/02/20',
  evidences: ["Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me.", "Agreement Text: An IPFS-hosted text document describing the agreement terms/n Alright, I'm ready. Marty, why are you so nervous? yes, Joey just loves being in his playpen. he cries whenever we take him out so we just leave him in there all the time. Well Marty, I hope you like meatloaf. Oh, then I wanna give her a call, I don't want her to worry about you. Excuse me."]
}];
const timeline = [{
  label: 'Open dispute #62',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconFlag"]
}, {
  label: 'Submit evidence',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconFolder"]
}, {
  label: 'Jurors drafted',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconGroup"]
}, {
  label: 'Review evidence',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconSearch"]
}, {
  label: 'Voting period',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconVote"]
}, {
  label: 'Apeal Ruling',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconWrite"]
}, {
  label: 'Claim rewards',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconCoin"]
}, {
  label: 'Milestone',
  date: '20/11/2019',
  Icon: _aragon_ui__WEBPACK_IMPORTED_MODULE_1__["IconFlag"]
}];
const tasks = [{
  taskName: 'Finish reviewing evidence',
  disputeId: 12,
  priority: 'High',
  juror: '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3',
  dueDate: 1575391948390
}, {
  taskName: 'Reveal vote',
  disputeId: 15,
  priority: 'Medium',
  juror: '0x099278297012066d61c9505132b3Aa71F625E414',
  dueDate: 1575592000000
}, {
  taskName: 'Start reviewing evidence',
  disputeId: 20,
  priority: 'Low',
  juror: '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3',
  dueDate: 1576393000000
}, {
  taskName: 'Commit vote',
  disputeId: 14,
  priority: 'Medium',
  juror: '0x099278297012066d61c9505132b3Aa71F625E414',
  dueDate: 1575394000000
}];

/***/ }),

/***/ "./src/networks.js":
/*!*************************!*\
  !*** ./src/networks.js ***!
  \*************************/
/*! exports provided: networks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "networks", function() { return networks; });
const networks = {
  rpc: {
    court: '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550'
  },
  ropsten: {
    court: '0x3b26bc496aebaed5b3E0E81cDE6B582CDe71396e'
  },
  rinkeby: {
    court: '0xb5ffbe75fa785725eea5f931b64fc04e516c9c5d'
  },
  mainnet: {
    court: '0xee4650cBe7a2B23701D416f58b41D8B76b617797'
  }
};

/***/ }),

/***/ "./src/providers/CourtConfig.js":
/*!**************************************!*\
  !*** ./src/providers/CourtConfig.js ***!
  \**************************************/
/*! exports provided: CourtConfigProvider, useCourtConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CourtConfigProvider", function() { return CourtConfigProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useCourtConfig", function() { return useCourtConfig; });
/* harmony import */ var _Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var urql__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! urql */ "./node_modules/urql/dist/es/urql.js");
/* harmony import */ var _queries_courtConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../queries/courtConfig */ "./src/queries/courtConfig.js");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../environment */ "./src/environment.js");
/* harmony import */ var _web3_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../web3-utils */ "./src/web3-utils.js");
/* harmony import */ var _networks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../networks */ "./src/networks.js");

var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/providers/CourtConfig.js";







const CHAIN_ID = Object(_environment__WEBPACK_IMPORTED_MODULE_5__["default"])('CHAIN_ID');
const CourtConfigContext = react__WEBPACK_IMPORTED_MODULE_1___default.a.createContext();

function CourtConfigProvider({
  children
}) {
  const courtAddress = _networks__WEBPACK_IMPORTED_MODULE_7__["networks"][Object(_web3_utils__WEBPACK_IMPORTED_MODULE_6__["getNetworkName"])(CHAIN_ID)].court;
  console.log(courtAddress);

  const _useSubscription = Object(urql__WEBPACK_IMPORTED_MODULE_3__["useSubscription"])({
    query: _queries_courtConfig__WEBPACK_IMPORTED_MODULE_4__["CourtConfig"],
    variables: {
      id: courtAddress.toLocaleLowerCase()
    }
  }),
        _useSubscription2 = Object(_Users_fabri_Documents_work_aragon_dev_court_court_dashboard_node_modules_babel_preset_react_app_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useSubscription, 1),
        result = _useSubscription2[0]; // TODO: handle possible errors


  const courtConfig = result.data && result.data.courtConfig;
  console.log('court config', courtConfig);
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(CourtConfigContext.Provider, {
    value: courtConfig,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, children);
}

CourtConfigProvider.propTypes = {
  children: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.node
};

function useCourtConfig() {
  return Object(react__WEBPACK_IMPORTED_MODULE_1__["useContext"])(CourtConfigContext);
}



/***/ }),

/***/ "./src/providers/Web3.js":
/*!*******************************!*\
  !*** ./src/providers/Web3.js ***!
  \*******************************/
/*! exports provided: useWeb3Connect, useConnectedAccount, Web3ConnectProvider, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useWeb3Connect", function() { return useWeb3Connect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useConnectedAccount", function() { return useConnectedAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Web3ConnectProvider", function() { return Web3ConnectProvider; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _web3_react_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @web3-react/core */ "./node_modules/@web3-react/core/dist/core.esm.js");
/* harmony import */ var _web3_react_injected_connector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @web3-react/injected-connector */ "./node_modules/@web3-react/injected-connector/dist/injected-connector.esm.js");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/dist/ethers.min.js");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _web3_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../web3-utils */ "./src/web3-utils.js");
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../environment */ "./src/environment.js");
var _jsxFileName = "/Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/providers/Web3.js";







const EthersWeb3Provider = ethers__WEBPACK_IMPORTED_MODULE_4__["providers"].Web3Provider;
const CHAIN_ID = Object(_environment__WEBPACK_IMPORTED_MODULE_6__["default"])('CHAIN_ID');
const WEB3_REACT_CONNECTORS = new Map([['injected', new _web3_react_injected_connector__WEBPACK_IMPORTED_MODULE_3__["InjectedConnector"]({
  supportedChainIds: [CHAIN_ID]
})]]);
function useWeb3Connect() {
  const web3ReactContext = Object(_web3_react_core__WEBPACK_IMPORTED_MODULE_2__["useWeb3React"])();
  const activate = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(async type => {
    const connector = WEB3_REACT_CONNECTORS.get(type);
    console.log('connector', connector);

    if (connector) {
      try {
        await web3ReactContext.activate(connector, null, true);
      } catch (err) {
        const log = typeof window !== 'undefined' ? window.alert : console.log;

        if (err instanceof _web3_react_core__WEBPACK_IMPORTED_MODULE_2__["UnsupportedChainIdError"]) {
          log(`Unsupported chain: please connect to the network called ${Object(_web3_utils__WEBPACK_IMPORTED_MODULE_5__["getNetworkName"])(CHAIN_ID)} in your Ethereum Provider.`);
          return;
        }

        log('Unknown error, please try again.');
      }
    }
  }, [web3ReactContext]);
  const chainId = web3ReactContext.chainId,
        account = web3ReactContext.account,
        ethersProvider = web3ReactContext.library,
        deactivate = web3ReactContext.deactivate;
  return {
    account,
    activate,
    deactivate,
    ethersProvider,
    networkName: Object(_web3_utils__WEBPACK_IMPORTED_MODULE_5__["getNetworkName"])(chainId),
    web3ReactContext
  };
}
function useConnectedAccount() {
  const web3ReactContext = Object(_web3_react_core__WEBPACK_IMPORTED_MODULE_2__["useWeb3React"])();
  return web3ReactContext.account;
}
function Web3ConnectProvider({
  children
}) {
  const getLibrary = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(provider => new EthersWeb3Provider(provider), []);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_web3_react_core__WEBPACK_IMPORTED_MODULE_2__["Web3ReactProvider"], {
    getLibrary: getLibrary,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: this
  }, children);
}
Web3ConnectProvider.propTypes = {
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node
};
/* harmony default export */ __webpack_exports__["default"] = (Web3ConnectProvider);

/***/ }),

/***/ "./src/queries/courtConfig.js":
/*!************************************!*\
  !*** ./src/queries/courtConfig.js ***!
  \************************************/
/*! exports provided: CourtConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CourtConfig", function() { return CourtConfig; });
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_0__);

const CourtConfig = graphql_tag__WEBPACK_IMPORTED_MODULE_0___default.a`
  subscription CourtConfig($id: ID!) {
    courtConfig(id: $id) {
      currentTerm
      termDuration
      feeToken {
        name
        symbol
        decimals
      }
      anjToken {
        name
        symbol
        decimals
      }
      jurorFee
      draftFee
      settleFee
      evidenceTerms
      commitTerms
      revealTerms
      appealTerms
      appealConfirmationTerms
      penaltyPct
      finalRoundReduction
      firstRoundJurorsNumber
      appealStepFactor
      maxRegularAppealRounds
      finalRoundLockTerms
      minActiveBalance
    }
  }
`;

/***/ }),

/***/ "./src/theme-court.js":
/*!****************************!*\
  !*** ./src/theme-court.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  _name: 'court',
  _appearance: 'light',
  accent: '#FF9780',
  accentStart: '#FF8888',
  accentEnd: '#FFB36D',
  accentContent: '#FFFFFF',
  selected: '#FF9780',
  selectedContent: '#FFFFFF',
  selectedDisabled: '#C4CDD5'
});

/***/ }),

/***/ "./src/web3-utils.js":
/*!***************************!*\
  !*** ./src/web3-utils.js ***!
  \***************************/
/*! exports provided: getNetworkName, isLocalNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getNetworkName", function() { return getNetworkName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLocalNetwork", function() { return isLocalNetwork; });
const DEFAULT_LOCAL_CHAIN = 'rpc';
function getNetworkName(chainId) {
  chainId = String(chainId);
  if (chainId === '1') return 'mainnet';
  if (chainId === '3') return 'ropsten';
  if (chainId === '4') return 'rinkeby';
  return DEFAULT_LOCAL_CHAIN;
}
function isLocalNetwork(chainId) {
  return getNetworkName(chainId) === DEFAULT_LOCAL_CHAIN;
}

/***/ }),

/***/ 0:
/*!**********************************************************************************!*\
  !*** multi ./node_modules/react-dev-utils/webpackHotDevClient.js ./src/index.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/fabri/Documents/work/aragon/dev/court/court-dashboard/node_modules/react-dev-utils/webpackHotDevClient.js */"./node_modules/react-dev-utils/webpackHotDevClient.js");
module.exports = __webpack_require__(/*! /Users/fabri/Documents/work/aragon/dev/court/court-dashboard/src/index.js */"./src/index.js");


/***/ })

},[[0,"runtime-main",1]]]);
//# sourceMappingURL=main.chunk.js.map