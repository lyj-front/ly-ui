<template>
  <div v-html="renderedHtml" ref="content"></div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import LyUi from 'ly-ui'
import { createApp, defineComponent,defineAsyncComponent } from 'vue';
import * as Vue from 'vue';
import * as monaco from 'monaco-editor';

let editors = []
export default {
  props: {
    markdown: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      // 编辑器列表
      // editors: []
    }
  },
  computed: {
    renderedHtml() {
      if(!this.markdown?.trim().length) return "";
      const md = new MarkdownIt();
      md.use(markdownItContainer, 'demo', {
        validate(params) {
          return params.trim().match(/^demo\s*(.*)$/)
        },
        render(tokens, idx) {
          const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)

          if (tokens[idx].nesting === 1) {
            const description = m && m.length > 1 ? m[1] : ''
            const content =
              tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
            const elId = Math.random().toString(36).substr(2, 8);
            return `
              <div class="view-demo-block" data-id="${elId}">
                ${description ? `<div>${md.render(description)}</div>` : ''}
                <div class="view-demo-content" data-content="${encodeURIComponent(content)}"></div>
              </div>

              <div class="raw-demo-block coder-editor" data-id="${elId}">
                <div class="raw-context " data-content="${encodeURIComponent(content)}"></div>
              </div>`;
          }
          return `</div>`
        },
      })

      md.use(markdownItContainer, 'tip')
      md.use(markdownItContainer, 'warning')
      const render = md.render(this.markdown);
      return render;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.registerDemoBlocks();
      this.registerEditDemoBlocks();
    });
  },
  watch:{
    renderedHtml(newVal){
      this.$nextTick(() => {
        this.registerDemoBlocks();
        this.registerEditDemoBlocks();
      });
    }
  },
  methods:{
    /**
     * 处理mk文档中的组件
     */
    registerDemoBlocks() {
      const demoBlocks = this.$refs.content.querySelectorAll('.view-demo-block');
      demoBlocks.forEach((block) => {
        const content = decodeURIComponent(block.querySelector('.view-demo-content')?.dataset.content || '');
        block.querySelector('.view-demo-content').remove(); // Remove the demo-content div

        this.registerApp(block,content);
      });
    },
    /**
     * 渲染编辑器
     */
    registerEditDemoBlocks(){
      const rawDemoBlocks = this.$refs.content.querySelectorAll('.raw-demo-block');
      console.log("rawDemoBlocks",rawDemoBlocks)
      this.editors = [];
      rawDemoBlocks.forEach((block,index) => {
        // 删除旁边的pre元素
        if(block.nextSibling.nodeName=="PRE"){
          block.nextSibling.remove()
        }

        const content = decodeURIComponent(block.querySelector('.raw-context')?.dataset.content || '');
        block.querySelector('.raw-context').remove(); // Remove the demo-content div
        console.log("content",content)
        const editor = monaco.editor.create(block, {
          value: content,
          language: 'html',
          automaticLayout: true, // 自动布局
          theme: 'vs-dark', // 官方自带三种主题vs, hc-black, or vs-dark
          // minimap: { // 关闭小地图
          //   enabled: false,
          // },
          lineNumbers: 'on', // 隐藏控制行号
        });
        // Bind Ctrl+S to run the code
        editor.addAction({
          id: 'run-code',
          label: '重新运行',
          keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
          ],
          contextMenuGroupId: 'navigation',
          contextMenuOrder: 1.5,
          run: ()=>this.runCode(block,index,editor)
        });
        editors.push(editor)
      })
    },
    /**
     * 渲染组件
     * @param el
     * @param content
     */
    registerApp(el,content){
      try {
        const options = {
          moduleCache: {
            vue: Vue,
            'ly-ui': LyUi
          },

          getFile: () => content,
          addStyle(textContent) {
            const style = Object.assign(document.createElement('style'), {textContent});
            const ref = document.head.getElementsByTagName('style')[0] || null;
            document.head.insertBefore(style, ref);
          },
        }
        const {loadModule} = window["vue3-sfc-loader"];
        const app = createApp(defineAsyncComponent(() => loadModule('file.vue', options)));
        app.use(LyUi)
        // app.component("demo-block",demoBlock)
        app.mount(el);
      } catch (error) {
        console.error('Failed to compile and render component:', error);
      }
    },
    runCode(block,index,editor){
      const demoBlocks = this.$refs.content.querySelectorAll('.view-demo-block');
      console.log("更新代码",demoBlocks[index],editor.getValue())
      this.registerApp(demoBlocks[index],editor.getValue());
    },
    // 获取编辑器
    getEditors(){
      return this.editors;
    },
    getAllCode(){
      let code = "";
      for(let editor of editors){
        code += editor.getValue() + "\n";
      }
      return code;
    },
  }
}
</script>

<style scoped>
.element-container {
  /* Add any specific styling here */
}
</style>

<style>
.coder-editor{
  //width: 100%;
  height: 450px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.view-demo-block{
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
