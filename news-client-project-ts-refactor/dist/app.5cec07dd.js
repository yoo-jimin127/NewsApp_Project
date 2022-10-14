// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/core/router.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Router =
/** @class */
function () {
  function Router() {
    window.addEventListener('hashchange', this.route.bind(this)); // 등록 시점의 this context 고정

    this.isStart = false;
    this.routeTable = [];
    this.defaultRoute = null;
  }
  /** view update */


  Router.prototype.addRoutePath = function (path, page, params) {
    if (params === void 0) {
      params = null;
    }

    this.routeTable.push({
      path: path,
      page: page,
      params: params
    });

    if (!this.isStart) {
      this.isStart = true; // Execute next tick

      setTimeout(this.route.bind(this), 0);
    }
  };
  /** default page set */


  Router.prototype.setDefaultPage = function (page, params) {
    if (params === void 0) {
      params = null;
    }

    this.defaultRoute = {
      path: '',
      page: page,
      params: params
    };
  };
  /** route execute function */


  Router.prototype.route = function () {
    var routePath = location.hash;

    if (routePath === '' && this.defaultRoute) {
      this.defaultRoute.page.render();
      return;
    }

    for (var _i = 0, _a = this.routeTable; _i < _a.length; _i++) {
      var routeInfo = _a[_i];

      if (routePath.indexOf(routeInfo.path) >= 0) {
        if (routeInfo.params) {
          var parseParams = routePath.match(routeInfo.params);

          if (parseParams) {
            routeInfo.page.render.apply(null, [parseParams[1]]);
          }
        } else {
          routeInfo.page.render();
        }

        return;
      }
    }
  };

  return Router;
}();

exports.default = Router;
},{}],"src/core/view.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** view - 공통 요소 */

var View =
/** @class */
function () {
  function View(containerId, template) {
    var containerElement = document.getElementById(containerId);

    if (!containerElement) {
      throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.';
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  View.prototype.updateView = function () {
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template; // UI 업데이트 작업 후 원본 템플릿으로 복원
  };
  /** html 문자열 추가 함수 */


  View.prototype.addHtml = function (htmlString) {
    this.htmlList.push(htmlString);
  };
  /** 문자열 병합 값 리턴 함수 */


  View.prototype.getHtml = function () {
    var snapshot = this.htmlList.join('');
    this.clearHtmlList(); // html list clear

    return snapshot;
  };
  /** template 내용 대체 함수 */


  View.prototype.setTemplateData = function (key, value) {
    this.renderTemplate = this.renderTemplate.replace("{{__".concat(key, "__}}"), value);
  };
  /** html list clear 함수 */


  View.prototype.clearHtmlList = function () {
    this.htmlList = [];
  };

  return View;
}();

exports.default = View;
},{}],"src/core/api.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewsDetailApi = exports.NewsFeedApi = void 0;

var Api =
/** @class */
function () {
  function Api(url) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  Api.prototype.getRequest = function () {
    this.ajax.open('GET', this.url, false);
    this.ajax.send();
    return JSON.parse(this.ajax.response);
  };

  return Api;
}();

exports.default = Api;

var NewsFeedApi =
/** @class */
function (_super) {
  __extends(NewsFeedApi, _super);

  function NewsFeedApi(url) {
    return _super.call(this, url) || this;
  }

  NewsFeedApi.prototype.getData = function () {
    return this.getRequest();
  };

  return NewsFeedApi;
}(Api);

exports.NewsFeedApi = NewsFeedApi;

var NewsDetailApi =
/** @class */
function (_super) {
  __extends(NewsDetailApi, _super);

  function NewsDetailApi(url) {
    return _super.call(this, url) || this;
  }

  NewsDetailApi.prototype.getData = function () {
    return this.getRequest();
  };

  return NewsDetailApi;
}(Api);

exports.NewsDetailApi = NewsDetailApi; // // mixin
// function applyApiMixins(targetClass: any, baseClasses: any) {
//     baseClasses.forEach(baseClass => {
//         Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
//             const descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);
//             if (descriptor) {
//                 Object.defineProperty(targetClass.prototype, name, descriptor);
//             }
//         });
//     });
// }
// // apply mixin
// interface NewsFeedApi extends Api{};
// interface NewsDetailApi extends Api{};
// applyApiMixins(NewsFeedApi, [Api]);
// applyApiMixins(NewsDetailApi, [Api]);
},{}],"src/config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONTENT_URL = exports.URL_ADDR = void 0;
exports.URL_ADDR = 'https://api.hnpwa.com/v0/news/1.json';
exports.CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'; // 해당 콘텐츠의 url
},{}],"src/page/news-detail-view.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_1 = __importDefault(require("../core/view"));

var api_1 = require("../core/api");

var config_1 = require("../config");

var template = "\n    <div class=\"bg-gray-600 min-h-screen pb-8\">\n        <div class=\"bg-white text-xl\">\n            <div class=\"mx-auto px-4\">\n                <div class=\"flex justify-between tiems-center py-6\">\n                    <div class=\"flex justify-start\">\n                        <h1 class=\"font-extrabold\">Hacker News</h1>\n                    </div>\n                    <div class=\"items-center justify-end\">\n                        <a href=\"#/page/{{__currentPage__}}\" class=\"text-gray-500\">\n                            <i class=\"fa fa-times\"></i>\n                        </a>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"h-full border rounded-xl bg-white m-6 p-4\">\n            <h2>{{__title__}}</h2>\n            <div class=\"text-gray-400 h-20\">\n                {{__content__}}\n            </div>\n            {{__comments__}}\n        </div>\n    </div>\n    ";

var NewsDetailView =
/** @class */
function (_super) {
  __extends(NewsDetailView, _super);

  function NewsDetailView(containerId, store) {
    var _this = _super.call(this, containerId, template) || this;

    _this.render = function (id) {
      console.log(id);
      var api = new api_1.NewsDetailApi(config_1.CONTENT_URL.replace('@id', id));

      var _a = api.getData(),
          title = _a.title,
          content = _a.content,
          comments = _a.comments;

      _this.store.makeRead(Number(id)); // read 처리


      _this.setTemplateData('currentPage', _this.store.currentPage.toString());

      _this.setTemplateData('title', title);

      _this.setTemplateData('content', content);

      _this.setTemplateData('comments', _this.makeComment(comments));

      _this.updateView();
    };

    _this.store = store;
    return _this;
  }
  /** 댓글 및 대댓글 생성 함수 */


  NewsDetailView.prototype.makeComment = function (comments) {
    for (var i = 0; i < comments.length; i++) {
      var comment = comments[i];
      this.addHtml("\n              <div style=\"padding-left: ".concat(comment.level * 40, "px;\" class=\"mt-4\">\n                <div class=\"text-gray-400\">\n                    <i class=\"fa fa-sort-up mr-2\"></i>\n                    <strong>").concat(comment.user, "</strong> ").concat(comment.time_ago, "\n                </div>\n                <p class=\"text-gray-700\">").concat(comment.content, "</p>\n                </div>      \n            ")); // 대댓글 처리

      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }

    return this.getHtml();
  };

  return NewsDetailView;
}(view_1.default);

exports.default = NewsDetailView;
},{"../core/view":"src/core/view.ts","../core/api":"src/core/api.ts","../config":"src/config.ts"}],"src/page/news-feed-view.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var view_1 = __importDefault(require("../core/view"));

var api_1 = require("../core/api");

var config_1 = require("../config");

var template = "\n        <div class=\"bg-gray-600 min-h-screen\">\n            <div class=\"bg-white text-xl\">\n                <div class=\"mx-auto px-4\">\n                    <div class=\"flex justify-between items-center py-6\">\n                        <div class=\"flex justify-start\">\n                            <h1 class=\"font-extrabold\">Hacker News</h1>\n                        </div>\n                        <div class=\"item-center justify-end\">\n                            <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">Previous</a>\n                            <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">Next</a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"p-4 text-2xl text-gray-700\">{{__news_feed__}}</div>\n        </div>\n        ";

var NewsFeedView =
/** @class */
function (_super) {
  __extends(NewsFeedView, _super);

  function NewsFeedView(containerId, store) {
    var _this = _super.call(this, containerId, template) || this;

    _this.store = store;
    _this.api = new api_1.NewsFeedApi(config_1.URL_ADDR); // NewsFeedApi class instance
    // 최초 접근의 경우

    if (!_this.store.hasFeeds) {
      _this.store.setFeeds(_this.api.getData());
    }

    return _this;
  }
  /** 뉴스 목록 호출 함수 */


  NewsFeedView.prototype.render = function () {
    // 디폴트 페이징 예외 처리
    this.store.currentPage = Number(location.hash.substr(7) || 1);

    for (var i = (this.store.currentPage - 1) * 10; i < this.store.currentPage * 10; i++) {
      var _a = this.store.getFeed(i),
          read = _a.read,
          id = _a.id,
          title = _a.title,
          comments_count = _a.comments_count,
          user = _a.user,
          points = _a.points,
          time_ago = _a.time_ago;

      this.addHtml("\n            <div class=\"p-6 ".concat(read ? 'bg-gray-400' : 'bg-white', " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n                <div class=\"flex\">\n                    <div class=\"flex-auto\">\n                        <a href=\"#/show/").concat(id, "\">").concat(title, "</a>\n                    </div>\n                    <div class=\"text-center text-sm\">\n                    <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">\n                            ").concat(comments_count, "\n                        </div>\n                    </div>\n                </div>\n                <div class=\"flex mt-3\">\n                    <div class=\"grid gird-cols-3 text-sm text-gray-500\">\n                        <div><i class=\"fas fa-user mr-1\"></i>").concat(user, "</div>\n                        <div><i class=\"fas fa-heart mr-1\"></i>").concat(points, "</div>\n                        <div><i class=\"far fa-clock mr-1\"></i>").concat(time_ago, "</div>\n                    </div>\n                </div>\n            </div>\n            "));
    }

    this.setTemplateData('news_feed', this.getHtml()); // template replace - news list content

    this.setTemplateData('prev_page', String(this.store.prevPage)); // prev page 

    this.setTemplateData('next_page', String(this.store.nextPage)); // next page

    this.updateView();
  };
  /** 방문 페이지 상태 관리 함수 */


  NewsFeedView.prototype.makeFeeds = function () {
    for (var i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  };

  return NewsFeedView;
}(view_1.default);

exports.default = NewsFeedView;
},{"../core/view":"src/core/view.ts","../core/api":"src/core/api.ts","../config":"src/config.ts"}],"src/page/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewsFeedView = exports.NewsDetailView = void 0;

var news_detail_view_1 = require("./news-detail-view");

Object.defineProperty(exports, "NewsDetailView", {
  enumerable: true,
  get: function get() {
    return __importDefault(news_detail_view_1).default;
  }
});

var news_feed_view_1 = require("./news-feed-view");

Object.defineProperty(exports, "NewsFeedView", {
  enumerable: true,
  get: function get() {
    return __importDefault(news_feed_view_1).default;
  }
});
},{"./news-detail-view":"src/page/news-detail-view.ts","./news-feed-view":"src/page/news-feed-view.ts"}],"src/store.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;

var Store =
/** @class */
function () {
  function Store() {
    this.feeds = [];
    this._currentPage = 1;
  }

  Object.defineProperty(Store.prototype, "currentPage", {
    // getter setter 설정
    get: function get() {
      return this._currentPage;
    },
    set: function set(page) {
      this._currentPage = page;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "nextPage", {
    get: function get() {
      return this._currentPage + 1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "prevPage", {
    get: function get() {
      return this._currentPage > 1 ? this._currentPage - 1 : 1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "numberOfFeed", {
    get: function get() {
      return this.feeds.length;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Store.prototype, "hasFeeds", {
    get: function get() {
      return this.feeds.length > 0;
    },
    enumerable: false,
    configurable: true
  }); // 메소드 정의부

  Store.prototype.getAllFeeds = function () {
    return this.feeds;
  };

  Store.prototype.getFeed = function (position) {
    return this.feeds[position];
  };

  Store.prototype.setFeeds = function (feeds) {
    feeds.map(function (feed) {
      return __assign(__assign({}, feed), {
        read: false
      });
    });
  };

  Store.prototype.makeRead = function (id) {
    var feed = this.feeds.find(function (feed) {
      return feed.id === id;
    });

    if (feed) {
      feed.read = true;
    }
  };

  return Store;
}();

exports.Store = Store;
},{}],"src/app.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var router_1 = __importDefault(require("./core/router"));

var page_1 = require("./page");

var store_1 = require("./store");

var store = new store_1.Store();
var router = new router_1.default();
var newsFeedView = new page_1.NewsFeedView('root', store);
var newsDetailView = new page_1.NewsDetailView('root', store);
router.setDefaultPage(newsFeedView); // default page set

router.addRoutePath('/page/', newsFeedView, /page\/(\d+)/);
router.addRoutePath('/show/', newsDetailView, /show\/(\d+)/); // router.route(); // 실행
},{"./core/router":"src/core/router.ts","./page":"src/page/index.ts","./store":"src/store.ts"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54398" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.ts"], null)
//# sourceMappingURL=/app.5cec07dd.js.map