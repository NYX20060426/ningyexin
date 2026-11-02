/**
 * 可复用的 Tab 选项卡组件（课堂测试 8）
 * 命名规则：所有 JS 变量均以 nyx_ 开头（姓名首字母：宁烨鑫）
 * 用法：页面中放入带 data-tabs 的容器，内含
 *   - 触发按钮：[data-tab-target="xxx"]
 *   - 对应面板：[data-tab-panel="xxx"]
 * 外部引用本文件后自动初始化所有 [data-tabs] 容器。
 */
(function (nyx_global) {
  'use strict';

  function nyx_initTabs(nyx_root) {
    var nyx_tabs = Array.prototype.slice.call(
      nyx_root.querySelectorAll('[data-tab-target]')
    );
    var nyx_panels = Array.prototype.slice.call(
      nyx_root.querySelectorAll('[data-tab-panel]')
    );

    if (nyx_tabs.length === 0) {
      return null;
    }

    /* 清除所有选项卡的选中状态 */
    function nyx_clearAllSelected() {
      nyx_tabs.forEach(function (nyx_tab) {
        nyx_tab.classList.remove('nyx_active');
        nyx_tab.setAttribute('aria-selected', 'false');
      });

      nyx_panels.forEach(function (nyx_panel) {
        nyx_panel.classList.remove('nyx_active');
        nyx_panel.hidden = true;
      });
    }

    /* 设置当前元素的选中状态 */
    function nyx_setCurrentSelected(nyx_tab) {
      var nyx_target = nyx_tab.getAttribute('data-tab-target');

      nyx_tab.classList.add('nyx_active');
      nyx_tab.setAttribute('aria-selected', 'true');

      nyx_panels.forEach(function (nyx_panel) {
        if (nyx_panel.getAttribute('data-tab-panel') === nyx_target) {
          nyx_panel.classList.add('nyx_active');
          nyx_panel.hidden = false;
        }
      });
    }

    function nyx_activate(nyx_tab) {
      nyx_clearAllSelected();
      nyx_setCurrentSelected(nyx_tab);
    }

    /* 事件监听：点击切换选项卡 */
    nyx_tabs.forEach(function (nyx_tab) {
      nyx_tab.addEventListener('click', function () {
        nyx_activate(nyx_tab);
      });

      /* 键盘左右方向键切换 */
      nyx_tab.addEventListener('keydown', function (nyx_event) {
        if (nyx_event.key !== 'ArrowLeft' && nyx_event.key !== 'ArrowRight') {
          return;
        }

        var nyx_index = nyx_tabs.indexOf(nyx_tab);
        var nyx_nextIndex =
          nyx_event.key === 'ArrowRight'
            ? (nyx_index + 1) % nyx_tabs.length
            : (nyx_index - 1 + nyx_tabs.length) % nyx_tabs.length;

        nyx_event.preventDefault();
        nyx_activate(nyx_tabs[nyx_nextIndex]);
        nyx_tabs[nyx_nextIndex].focus();
      });
    });

    /* 默认选中：优先 data-default 指定项，否则第一项 */
    var nyx_defaultName = nyx_root.getAttribute('data-default');
    var nyx_defaultTab =
      nyx_tabs.filter(function (nyx_tab) {
        return nyx_tab.getAttribute('data-tab-target') === nyx_defaultName;
      })[0] || nyx_tabs[0];

    nyx_activate(nyx_defaultTab);

    return {
      activate: nyx_activate
    };
  }

  /* 初始化页面上所有选项卡容器，可复用 */
  function nyx_initAll(nyx_selector) {
    var nyx_roots = document.querySelectorAll(nyx_selector || '[data-tabs]');
    return Array.prototype.map.call(nyx_roots, nyx_initTabs);
  }

  nyx_global.nyx_Tabs = {
    init: nyx_initTabs,
    initAll: nyx_initAll
  };

  function nyx_autoInit() {
    nyx_initAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', nyx_autoInit);
  } else {
    nyx_autoInit();
  }
})(window);
