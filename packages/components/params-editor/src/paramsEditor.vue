<template>
  <div
    class="params-editor-container"
    style="position: relative; height: 160px; z-index: 99px"
  >
    <div
      :id="id"
      ref="paramsEditorRef"
      style="position: absolute; top: 40px"
      class="notice-content-editor"
      contenteditable="true"
      :placeholder="placeholder"
      @blur="handleNoticeContentBlur"
    ></div>
    <span class="num-limit"
      ><span class="num">{{ num }}</span
      >/{{ limitNum }}</span
    >
  </div>
</template>

<script>
import {
  ref,
  watch,
  defineComponent,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from 'vue'
import { on, off as domOff, hasClass, getParents } from '../dom-opt'
export default defineComponent({
  name: 'ParamsEditor',
  props: {
    id: {
      type: String,
      default: 'paramsEditor',
    },
    data: {
      type: String,
      default: '',
    },
    limitNum: {
      type: Number,
      default: 100,
    },
    placeholder: {
      type: String,
      default: '请输入自定义内容，需要用到参数请插入参数。',
    },
  },
  setup(props, { emit }) {
    const ranges = ref()
    const fullContent = ref()
    const content = ref({})
    const num = ref(0)
    const paramsEditorRef = ref(null)

    watch(
      () => props.data,
      (n) => {
        if (n) {
          initNoticeContent(n)
        }
      },
      { immediate: true }
    )

    /**
     * 回填内容
     */
    function initNoticeContent(n) {
      if (!paramsEditorRef.value) return
      content.value = n
      paramsEditorRef.value.innerHTML = content.value
      setTimeout(() => {
        num.value = calcLimitNum()
      }, 300)
    }

    /**
     * 插入参数
     */
    function insertHtmlAtCaret(html) {
      const sel = window.getSelection()
      let range = ranges.value
      if (sel) {
        // IE9 and non-IE
        if (
          !(
            range &&
            range.endContainer &&
            !hasClass(range.endContainer, 'blue') &&
            getParents(range.endContainer, '.blue').length == 0 &&
            ((range.endContainer.nodeType !== 3 &&
              range.endContainer.getAttribute('id') == props.id) ||
              getParents(range.endContainer, '#' + props.id).length)
          )
        ) {
          keepLastIndex(paramsEditorRef.value)
          range = ranges.value = sel.getRangeAt(0)
          const node =
            paramsEditorRef.value.childNodes[
              paramsEditorRef.value.childNodes.length - 1
            ]
          if (node) {
            lastFocus(paramsEditorRef.value)
          }
        }
        const el = document.createElement('div')
        el.innerHTML = html
        const frag = document.createDocumentFragment()
        let node, lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }
        range.insertNode(frag)
        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange()
          range.setStartAfter(lastNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
          focusNode(paramsEditorRef.value.childNodes)
        }
      } else if (document.selection && document.selection.type != 'Control') {
        // IE < 9
        document.selection.createRange().pasteHTML(html)
      }
      fullContent.value = paramsEditorRef.value.innerHTML
    }

    /**
     * 获取文本框内容和所插入的参数
     */
    function getCustomContent() {
      const contentList = []
      contentList.push({
        contentModel: paramsEditorRef.value.innerHTML,
        contentParams: [],
      })
      try {
        Array.from(paramsEditorRef.value.querySelectorAll('span.blue')).forEach(
          (item) => {
            let field = item.innerText.replace('【', '').replace('】', '')
            field = field.replace(/\r\n/g, '').replace('\n', '')
            contentList[0].contentParams.push(field)
          }
        )
      } catch (error) {}
      return contentList
    }

    /**
     * 光标聚集到最后
     * @param obj
     */
    function keepLastIndex(obj) {
      let selection
      if (window.getSelection) {
        //ie11 10 9 ff safari
        selection = window.getSelection()
        obj.tabIndex = -1
        obj.focus()
        selection.collapse(obj, obj.childNodes.length)
      }
    }

    function lastFocus(node) {
      if (!node || !ranges.value) return
      if (
        (node.nodeName === 'SPAN' && node.classList.contains('blue')) ||
        node.nodeType === 3 ||
        node.nodeName === 'BR'
      ) {
        if (typeof ranges.value.setStartAfter === 'function') {
          ranges.value.setStartAfter(node)
        }
        if (node.nodeName === 'BR' && node.parentNode) {
          node.parentNode.removeChild(node)
        }
      } else if (node.childNodes && node.childNodes.length) {
        lastFocus(node.childNodes[node.childNodes.length - 1])
      }
    }

    function focusNode(nodes) {
      const sel = window.getSelection()
      if (!nodes || !sel) return
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (
          node.nodeName === 'SPAN' &&
          node.classList.contains('focus')
        ) {
          node.className = 'blue'
          if (node.parentNode) {
            sel.collapse(node.parentNode, i + 1)
          }
          return
        }
        if (node.childNodes && node.childNodes.length) {
          focusNode(node.childNodes)
        }
      }
    }

    function handleNoticeContentBlur(e) {
      getcursorIndex()
      validateNoticeContent(e.target)
    }

    function validateNoticeContent(obj) {
      let valid = true

      if (obj.innerText.trim() === '') {
        obj.innerText = ''
        valid = false
      } else if (calcLimitNum() > props.limitNum) {
        valid = false
      } else {
        let htmlStr = obj.innerHTML
        const tagStartStr = '<span class="blue" contenteditable="false">'
        const tagEndStr = '</span>'
        const tagEndLen = tagEndStr.length
        let tagStartIdx = htmlStr.indexOf(tagStartStr)
        let tagEndIdx = -1
        while (tagStartIdx != -1) {
          tagEndIdx = htmlStr.indexOf(tagEndStr)
          const fullTag = htmlStr.slice(tagStartIdx, tagEndIdx + tagEndLen)
          htmlStr = htmlStr.replace(fullTag, '')
          tagStartIdx = htmlStr.indexOf(tagStartStr)
        }
        htmlStr = htmlStr.replaceAll('&nbsp;', '')
        htmlStr = htmlStr.replace(/<\/?.+?>/g, '')
        htmlStr = htmlDecode(htmlStr)
      }
      const params = getCustomContent()
      emit('data-update', { ...params[0] })
      return valid
    }

    function calcLimitNum() {
      let htmlStr = paramsEditorRef.value.innerHTML
      const tagStartStr = '<span class="blue" contenteditable="false">'
      const tagEndStr = '</span>'
      const tagEndLen = tagEndStr.length
      let tagStartIdx = htmlStr.indexOf(tagStartStr)
      let tagEndIdx = -1
      while (tagStartIdx != -1) {
        tagEndIdx = htmlStr.indexOf(tagEndStr)
        const fullTag = htmlStr.slice(tagStartIdx, tagEndIdx + tagEndLen)
        htmlStr = htmlStr.replace(fullTag, 1)
        tagStartIdx = htmlStr.indexOf(tagStartStr)
      }
      htmlStr = htmlStr.replace(/<\/?.+?>/g, '')
      htmlStr = htmlDecode(htmlStr)
      return htmlStr.length
    }

    /*2.用浏览器内部转换器实现html解码*/
    function htmlDecode(text) {
      //1.首先动态创建一个容器标签元素，如DIV
      let temp = document.createElement('div')
      //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
      temp.innerHTML = text
      //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
      const output = temp.innerText || temp.textContent
      temp = null
      return output
    }

    /**
     * 获取光标位置
     * @param obj
     */
    function getcursorIndex() {
      try {
        ranges.value = window.getSelection().getRangeAt(0).cloneRange()
      } catch (e) {
        ranges.value = null
      }
    }

    function handleNCInput(event) {
      const len = calcLimitNum()
      if (len <= props.limitNum) {
        fullContent.value = event.target.innerHTML
      } else {
        event.target.innerHTML = fullContent.value
        getSelection().removeAllRanges()
      }
      num.value = calcLimitNum()
    }

    function handleNCKeydown(event) {
      if (event.key == 'Enter') {
        setTimeout(() => {
          wrapDiv()
        }, 100)
      }
      limitContent(event)
    }

    function handleNCPaste(e) {
      e.stopPropagation()
      e.preventDefault()
      let text = ''
      const event = e.originalEvent || e
      let content = e.target.innerText
      if (content.length >= props.limitNum) {
        content = content.slice(0, props.limitNum)
        e.target.innerText = content
        return false
      }
      if (event.clipboardData && event.clipboardData.getData) {
        text = event.clipboardData.getData('text/plain')
      } else if (window.clipboardData && window.clipboardData.getData) {
        text = window.clipboardData.getData('Text')
      }
      if (content.length + text.length > props.limitNum) {
        text = text.slice(0, props.limitNum - content.length)
      }
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text)
      } else {
        document.execCommand('paste', false, text)
      }
    }

    function handleClick(e) {
      if (
        !hasClass(e.target, '.notice-content-editor') &&
        !getParents(e.target, '.notice-content-editor').length &&
        !hasClass(e.target, 'el-select-dropdown') &&
        !getParents(e.target, '.el-select-dropdown').length &&
        !hasClass(e.target, 'params-select') &&
        !getParents(e.target, '.params-select').length
      ) {
        ranges.value = null
      }
    }

    function wrapDiv() {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return

      const range = sel.getRangeAt(0)
      const focusEl = range.startContainer
      if (!focusEl || !focusEl.parentNode) return

      let prev = focusEl.previousSibling
      const frag = document.createElement('div')
      let firstChild = null
      if (prev && prev.nodeName !== 'DIV') {
        while (prev && prev.nodeName !== 'DIV') {
          const prev_ = prev.previousSibling
          if (firstChild) {
            frag.insertBefore(prev, firstChild)
          } else {
            frag.appendChild(prev)
          }
          firstChild = prev
          prev = prev_
        }
        if (focusEl.parentNode) {
          focusEl.parentNode.insertBefore(frag, focusEl)
        }
      }
    }

    function limitContent(event) {
      const num = calcLimitNum()
      if (num >= props.limitNum && event.keyCode != 8) {
        return false
      } else if (event.keyCode == 8) {
        let range, node
        if (window.getSelection && window.getSelection().getRangeAt) {
          range = window.getSelection().getRangeAt(0)
        } else if (document.selection && document.selection.createRange) {
          range = document.selection.createRange()
        }

        if (range) {
          node = range.endContainer
          if (!node) return
          if (
            node.nodeType == 3 &&
            node.parentNode.nodeName == 'SPAN' &&
            node.parentNode.classList.contains('blue')
          ) {
            node.parentNode.parentElement.removeChild(node.parentNode)
          }
          if (node.nodeName == 'SPAN' && node.classList.contains('blue')) {
            event.target.removeChild(node)
            event.preventDefault()
          } else {
            for (let i = 0; i < node.childNodes.length; i++) {
              const child = node.childNodes[i]
              if (child.nodeType == 3 && child.nodeValue == '') {
                node.removeChild(node.childNodes[i--])
              }
            }
            const lastChild = node.lastChild
            if (
              lastChild &&
              lastChild.nodeName == 'SPAN' &&
              lastChild.classList.contains('blue')
            ) {
              node.removeChild(node.lastChild)
              event.preventDefault()
            }
          }
        }
      }
    }

    function initNoticeContentEvents() {
      on(document.body, 'compositionend', '#' + props.id, handleNCKeydown)
      on(
        document.body,
        'keydown propertychange',
        '#' + props.id,
        handleNCKeydown
      )
      on(document.body, 'input', '#' + props.id, handleNCInput)
      on(document.body, 'paste', '#' + props.id, handleNCPaste)
      document.body.addEventListener('click', handleClick)
    }

    const off = (...args) => {
      if (typeof domOff === 'function') {
        domOff(...args)
      }
    }

    function unBindNoticeContentEvents() {
      document.body.removeEventListener('click', handleClick)
      off(document.body, 'compositionend', '#' + props.id, handleNCKeydown)
      off(
        document.body,
        'keydown propertychange',
        '#' + props.id,
        handleNCKeydown
      )
      off(document.body, 'input', '#' + props.id, handleNCInput)
      off(document.body, 'paste', '#' + props.id, handleNCPaste)
    }

    function insertField(e) {
      if (num.value >= props.limitNum) {
        return false
      }
      insertHtmlAtCaret(
        '<span class="blue focus" contenteditable="false">【' + e + '】</span>'
      )
      setTimeout(() => {
        num.value = calcLimitNum()
      }, 100)
    }

    onBeforeUnmount(() => {
      unBindNoticeContentEvents()
    })

    onMounted(() => {
      initNoticeContentEvents()
      initNoticeContent(props.data)
    })

    onBeforeMount(() => {
      String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, 'gm'), s2)
      }
    })

    return {
      num,
      paramsEditorRef,
      handleNoticeContentBlur,
      insertField,
    }
  },
})
</script>
