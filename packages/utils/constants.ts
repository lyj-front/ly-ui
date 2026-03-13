export const UPDATE_MODEL_EVENT = 'update:modelValue'

export const CHANGE_EVENT = 'change'
export const INPUT_EVENT = 'input'

export const VALIDATE_STATE_MAP = {
    validating: 'el-icon-loading',
    success: 'el-icon-circle-check',
    error: 'el-icon-circle-close',
}

export const EVENT_CODE = {
    tab: 'Tab',
    enter: 'Enter',
    space: 'Space',
    left: 'ArrowLeft', // 37
    up: 'ArrowUp', // 38
    right: 'ArrowRight', // 39
    down: 'ArrowDown', // 40
    esc: 'Escape',
    delete: 'Delete',
    backspace: 'Backspace',
    numpadEnter: 'NumpadEnter',
    pageUp: 'PageUp',
    pageDown: 'PageDown',
    home: 'Home',
    end: 'End',
}

export const datePickTypes = [
    'year',
    'years',
    'month',
    'months',
    'date',
    'dates',
    'week',
    'datetime',
    'datetimerange',
    'daterange',
    'monthrange',
    'yearrange',
] as const

export const WEEK_DAYS = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
] as const

export type DatePickType = typeof datePickTypes[number]

export const INSTALLED_KEY = Symbol('INSTALLED_KEY')

export const componentSizes = ['', 'default', 'small', 'large'] as const

export type ComponentSize = typeof componentSizes[number]

export const componentSizeMap = {
  large: 40,
  default: 32,
  small: 24,
} as const
