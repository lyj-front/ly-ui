<template>
  <div ref="formItemRef" class="el-form-item" :class="formItemClass">
    <LabelWrap
      :is-auto-width="labelStyle.width === 'auto'"
      :update-all="elForm.labelWidth === 'auto'"
    >
      <label
        v-if="label || $slots.label"
        :for="labelFor"
        class="el-form-item__label"
        :style="labelStyle"
      >
        <slot name="label" :label="label + elForm.labelSuffix">
          {{ label + elForm.labelSuffix }}
        </slot>
      </label>
    </LabelWrap>
    <div class="el-form-item__content" :style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <slot v-if="shouldShowError" name="error" :error="validateMessage">
          <div
            class="el-form-item__error"
            :class="{
              'el-form-item__error--inline':
                typeof inlineMessage === 'boolean'
                  ? inlineMessage
                  : elForm.inlineMessage || false,
            }"
          >
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import AsyncValidator from 'async-validator'
import mitt from 'mitt'
import { NOOP } from '@vue/shared'
import {
  addUnit,
  getPropByPath,
  useGlobalConfig,
} from '@element-plus/utils/util'
import { isValidComponentSize } from '@element-plus/utils/validators'
import LabelWrap from './label-wrap'
import { elFormEvents, elFormItemKey, elFormKey } from '@element-plus/tokens'

import type { PropType, CSSProperties } from 'vue'
import type { ComponentSize } from '@element-plus/utils/types'
import type { LyFormContext, ValidateFieldCallback } from '@element-plus/tokens'
import type { FormItemRule } from './form.type'

export default defineComponent({
  name: 'LyFormItem',
  componentName: 'LyFormItem',
  components: {
    LabelWrap,
  },
  props: {
    label: String,
    labelWidth: {
      type: [String, Number],
      default: '',
    },
    prop: String,
    required: {
      type: Boolean,
      default: undefined,
    },
    rules: [Object, Array] as PropType<FormItemRule | FormItemRule[]>,
    error: String,
    validateStatus: String,
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: '',
    },
    showMessage: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String as PropType<ComponentSize>,
      validator: isValidComponentSize,
    },
    noHeight:{
      type: Boolean,
      default: false,
    }
  },
  setup(props, { slots }) {
    const formItemMitt = mitt()
    const $ELEMENT = useGlobalConfig()

    const elForm = inject(elFormKey, {} as LyFormContext)
    const validateState = ref('')
    const validateMessage = ref('')
    const validateDisabled = ref(false)

    const computedLabelWidth = ref('')

    const formItemRef = ref<HTMLDivElement>()

    const vm = getCurrentInstance()
    const isNested = computed(() => {
      let parent = vm.parent
      while (parent && parent.type.name !== 'LyForm') {
        if (parent.type.name === 'LyFormItem') {
          return true
        }
        parent = parent.parent
      }
      return false
    })

    let initialValue = undefined

    watch(
      () => props.error,
      (val) => {
        validateMessage.value = val
        validateState.value = val ? 'error' : ''
      },
      {
        immediate: true,
      }
    )
    watch(
      () => props.validateStatus,
      (val) => {
        validateState.value = val
      }
    )

    const labelFor = computed(() => props.for || props.prop)
    const labelStyle = computed(() => {
      const ret: CSSProperties = {}
      if (elForm.labelPosition === 'top') return ret
      const labelWidth = addUnit(props.labelWidth) || addUnit(elForm.labelWidth)
      if (labelWidth) {
        ret.width = labelWidth
      }
      return ret
    })
    const contentStyle = computed(() => {
      const ret: CSSProperties = {}
      if (elForm.labelPosition === 'top' || elForm.inline) {
        return ret
      }
      if (!props.label && !props.labelWidth && isNested.value) {
        return ret
      }
      const labelWidth = addUnit(props.labelWidth) || addUnit(elForm.labelWidth)
      if (!props.label && !slots.label) {
        ret.marginLeft = labelWidth
      }
      return ret
    })
    const fieldValue = computed(() => {
      const model = elForm.model
      if (!model || !props.prop) {
        return
      }

      let path = props.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      return getPropByPath(model, path, true).v
    })
    const isRequired = computed(() => {
      const rules = getRules()
      let required = false

      if (rules && rules.length) {
        rules.every((rule) => {
          if (rule.required) {
            required = true
            return false
          }
          return true
        })
      }
      return required
    })
    const elFormItemSize = computed(() => props.size || elForm.size)
    const sizeClass = computed<ComponentSize>(() => {
      return elFormItemSize.value || $ELEMENT.size
    })

    const validateIdCard = (idCard)=>{
        //15位和18位身份证号码的正则表达式   
        let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        //如果通过该验证，说明身份证格式正确，但准确性还需计算   
        if (regIdCard.test(idCard)) {
            if (idCard.length == 18) {
                let idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里   
                let idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组   
                let idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和   
                for (let i = 0; i < 17; i++) {
                    idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
                }
                let idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置   
                let idCardLast = idCard.substring(17);//得到最后一位身份证号码   
                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X   
                if (idCardMod == 2) {
                    if (idCardLast == "X" || idCardLast == "x") {
                        return true;
                    } else {
                        return false; 
                    }
                } else {
                    if (idCardLast == idCardY[idCardMod]) { 
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return false;
        }
    }

    const luhnCheck = (cardNumber)=> {
        let cardReg = /^[1-9]\d{15,18}$/
        if(!cardReg.test(cardNumber)){
          return false
        }
        let sum = 0;
        let shouldDouble = false;
        // 从右到左遍历银行卡号
        for (let i = cardNumber.length - 1; i >= 0; i--) {
          let digit = parseInt(cardNumber.charAt(i));

          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9; // 将大于9的数字减去9
            }
          }
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        // 如果能被10整除，则验证通过
        return sum % 10 === 0;
    }

    const validate = (
      trigger: string,
      callback: ValidateFieldCallback = NOOP
    ) => {
      validateDisabled.value = false
      const rules = getFilteredRule(trigger)
      if ((!rules || rules.length === 0) && props.required === undefined) {
        callback()
        return
      }
      validateState.value = 'validating'
      const descriptor = {}
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          if(rule.type === 'phone'){
            rule.pattern = /^[1][3-9][0-9]{9}$/
            delete rule.type
          }else if(rule.type === 'idCard'){
            rule.validator = (rule, value, callback)=>{
              if(!validateIdCard(value)){
                callback(new Error(rule.message || '请输入正确的证件号码'))
              }else{
                callback()
              }
            }
            delete rule.type
          }else if(rule.type === 'bankCard'){
            rule.validator = (rule, value, callback)=>{
              if(!luhnCheck(value)){
                callback(new Error(rule.message || '请输入正确的银行卡号码'))
              }else{
                callback()
              }
            }
            delete rule.type
          }else if(rule.type === 'Integer'){
            rule.pattern = /^\d+$/
            delete rule.type
          }else if(rule.type === 'eightTwo'){
            rule.pattern = /^\d{1,8}(\.\d{1,2})?$/
            delete rule.type
          }
          delete rule.trigger
        })
      }
      descriptor[props.prop] = rules
      const validator = new AsyncValidator(descriptor)
      const model = {}
      model[props.prop] = fieldValue.value
      validator.validate(
        model,
        { firstFields: true },
        (errors, invalidFields) => {
          validateState.value = !errors ? 'success' : 'error'
          validateMessage.value = errors
            ? errors[0].message || `${props.prop} is required`
            : ''
          callback(validateMessage.value, invalidFields)
          elForm.emit?.(
            'validate',
            props.prop,
            !errors,
            validateMessage.value || null
          )
        }
      )
    }

    const clearValidate = () => {
      validateState.value = ''
      validateMessage.value = ''
      validateDisabled.value = false
    }
    const resetField = () => {
      validateState.value = ''
      validateMessage.value = ''
      const model = elForm.model
      const value = fieldValue.value
      let path = props.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }
      const prop = getPropByPath(model, path, true)
      validateDisabled.value = true
      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(initialValue)
      } else {
        prop.o[prop.k] = initialValue
      }
      // reset validateDisabled after onFieldChange triggered
      nextTick(() => {
        validateDisabled.value = false
      })
    }

    const getRules = () => {
      const formRules = elForm.rules
      const selfRules = props.rules
      const requiredRule =
        props.required !== undefined ? { required: !!props.required } : []

      const prop = getPropByPath(formRules, props.prop || '', false)
      const normalizedRule = formRules ? prop.o[props.prop || ''] || prop.v : []

      return [].concat(selfRules || normalizedRule || []).concat(requiredRule)
    }
    const getFilteredRule = (trigger) => {
      const rules = getRules()

      return rules
        .filter((rule) => {
          if (!rule.trigger || trigger === '') return true
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1
          } else {
            return rule.trigger === trigger
          }
        })
        .map((rule) => ({ ...rule }))
    }

    const onFieldBlur = () => {
      validate('blur')
    }

    const onFieldChange = () => {
      if (validateDisabled.value) {
        validateDisabled.value = false
        return
      }

      validate('change')
    }
    const updateComputedLabelWidth = (width: string | number) => {
      computedLabelWidth.value = width ? `${width}px` : ''
    }

    const addValidateEvents = () => {
      const rules = getRules()

      if (rules.length || props.required !== undefined) {
        formItemMitt.on('el.form.blur', onFieldBlur)
        formItemMitt.on('el.form.change', onFieldChange)
      }
    }
    const removeValidateEvents = () => {
      formItemMitt.off('el.form.blur', onFieldBlur)
      formItemMitt.off('el.form.change', onFieldChange)
    }

    const elFormItem = reactive({
      ...toRefs(props),
      size: sizeClass,
      validateState,
      $el: formItemRef,
      formItemMitt,
      removeValidateEvents,
      addValidateEvents,
      resetField,
      clearValidate,
      validate,
      updateComputedLabelWidth,
    })

    onMounted(() => {
      if (props.prop) {
        elForm.formMitt?.emit(elFormEvents.addField, elFormItem)

        const value = fieldValue.value
        initialValue = Array.isArray(value) ? [...value] : value

        addValidateEvents()
      }
    })
    onBeforeUnmount(() => {
      elForm.formMitt?.emit(elFormEvents.removeField, elFormItem)
    })

    provide(elFormItemKey, elFormItem)

    const formItemClass = computed(() => [
      {
        'el-form-item--feedback': elForm.statusIcon,
        'is-error': validateState.value === 'error',
        'is-validating': validateState.value === 'validating',
        'is-success': validateState.value === 'success',
        'is-required': isRequired.value || props.required,
        'is-no-asterisk': elForm.hideRequiredAsterisk,
        'is-no-height':props.noHeight,
      },
      sizeClass.value ? 'el-form-item--' + sizeClass.value : '',
    ])

    const shouldShowError = computed(() => {
      return (
        validateState.value === 'error' &&
        props.showMessage &&
        elForm.showMessage
      )
    })

    return {
      formItemRef,
      formItemClass,
      shouldShowError,
      elForm,
      labelStyle,
      contentStyle,
      validateMessage,
      labelFor,
      resetField,
      clearValidate,
    }
  },
})
</script>
