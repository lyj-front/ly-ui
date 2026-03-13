<template>
  <div class="calc-wrapper clearfix">
    <div class="rule-btn">
      <table
        id="tableCalc"
        class="table-box noWrap tableCalc"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        @click="clickCalcBtn"
      >
        <tbody>
          <tr>
            <td class="calcBtn" data-rule="(">(</td>
            <td class="calcBtn" data-rule=")">)</td>
            <td class="calcBtn" data-rule="back"></td>
            <td class="calcBtn eval" data-rule="/">÷</td>
          </tr>
          <tr>
            <td class="calcBtn" data-rule="7">7</td>
            <td class="calcBtn" data-rule="8">8</td>
            <td class="calcBtn" data-rule="9">9</td>
            <td class="calcBtn eval" data-rule="*">×</td>
          </tr>
          <tr>
            <td class="calcBtn" data-rule="4">4</td>
            <td class="calcBtn" data-rule="5">5</td>
            <td class="calcBtn" data-rule="6">6</td>
            <td class="calcBtn eval" data-rule="-">-</td>
          </tr>
          <tr>
            <td class="calcBtn" data-rule="1">1</td>
            <td class="calcBtn" data-rule="2">2</td>
            <td class="calcBtn" data-rule="3">3</td>
            <td class="calcBtn eval" data-rule="+">+</td>
          </tr>
          <tr>
            <td class="calcBtn" data-rule="0">0</td>
            <td class="calcBtn" data-rule=".">.</td>
            <td class="calcBtn" data-rule="reset">C</td>
            <td
              class="calcBtn"
              :class="iscalc && ['disabled']"
              data-rule="submit"
            >
              =(试算)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { inject, defineComponent } from 'vue'
export default defineComponent({
  name: 'Keyboard',
  props: {
    iscalc: { type: Boolean, default: false },
  },
  emits: ['back', 'submit', 'reset', 'add'],
  setup(props, { emit }) {
    const calcErrorInfo = inject('calcErrorInfo')
    function clickCalcBtn(evt) {
      const target = evt.target
      if (
        !target.classList.contains('calcBtn') ||
        target.classList.contains('disabled')
      )
        return
      calcErrorInfo.value = ''
      const ruleContent = target.dataset.rule
      if (ruleContent === 'back') {
        emit('back')
      } else if (ruleContent === 'submit') {
        emit('submit')
        return
      } else if (ruleContent === 'reset') {
        emit('reset')
      } else {
        emit('add', {
          content: ruleContent,
          type: 'calcobj',
          code: ruleContent,
          isEval: target.classList.contains('eval'),
        })
      }
    }

    return {
      clickCalcBtn,
    }
  },
})
</script>
