webpackHotUpdate("main",{

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

/***/ })

})
//# sourceMappingURL=main.39fa9c66ea50751ce805.hot-update.js.map