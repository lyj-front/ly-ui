export function hasClass(ele, value) {
  const cls = value || ''
  if (cls.replace(/\s/g, '').length === 0) {
    return false
  }
  return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ')
}

/**
 * 查找dom的祖先元素 查看是否包含parentSelector的id或者样式的元素
 * @param el  传入的dom元素
 * @param parentSelector  要查找的祖先元素id名称或者类名
 * @returns boolean|HTMLElement
 * // getParents(document.getElementById('ResTableList'), '#main或者.main');
 */
export function getParents(el, parentSelector) {
  if (!parentSelector || parentSelector === undefined) {
    throw new Error('请传入要搜索的父元素Id名或者类名#id或者.classname')
  }

  // 默认匹配的类型
  let type = 'className'
  let splitF = '.'
  // 如果第一个字符是#那么证明传入的是id
  if (parentSelector.indexOf('#') === 0) {
    type = 'id'
    splitF = '#'
  }

  if (el.nodeType === 3) {
    // nodeText
    return getTextNodeParents(el, parentSelector, type)
  }

  // 根据类型拆分出字符串
  const selector = parentSelector.split(splitF)[1]

  function getP(el) {
    // 获取当前元素的父元素
    const p = el.parentNode
    // 如果元素的父元素是document 那么证明已经到最后一层了 就是没有匹配到这个父元素
    if (p === document) {
      return false
    }
    // 如果父元素的id或者class包含样式类
    if (p[type].indexOf(selector) > -1) {
      // 如果包含 那么返回这个元素
      return p
    } else {
      // 如果不包含那么就递归 这里要return递归函数 否则会没有返回值
      return getP(p)
    }
  }

  const final = getP(el)

  return final
}

// 获取textNode的parents
export function getTextNodeParents(el, selector, type) {
  const parents = []
  let parent = el.parentNode
  while (parent && parent !== document.documentElement) {
    if (type === 'id' && parent.id === selector) {
      parents.push(parent)
      return parents
    } else if (type === 'className' && !parent.classList.contains(selector)) {
      parent = parent.parentNode
      continue
    }
    parents.push(parent)
    parent = parent.parentNode
  }
  return parents
}

/**
 * 原生js实现jq on 函数
 * @param {*} element
 * @param {*} eventName
 * @param {*} selector
 * @param {*} handler
 */
export function on(element, eventName, selector, handler) {
  element.addEventListener(eventName, function (event) {
    const delegatedTarget = event.target.closest(selector)
    if (delegatedTarget && element.contains(delegatedTarget)) {
      handler.call(delegatedTarget, event)
    }
  })
}

/**
 * 原生实现jq off 函数
 * @param {*} element
 * @param {*} eventType
 * @param {*} selector
 * @param {*} handler
 */
export function off(element, eventType, selector, handler) {
  if (arguments.length === 3 && typeof selector === 'function') {
    handler = selector
    selector = null
  }

  element.removeEventListener(eventType, function (e) {
    if (selector === null || e.target.matches(selector)) {
      handler(e)
    }
  })
}
