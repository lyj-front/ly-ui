import { computed, ComputedRef, inject } from 'vue'

import type { ComponentInternalInstance } from 'vue'
import type { RootMenuProvider } from './menu.type'

export default function useMenu(
  instance: ComponentInternalInstance,
  currentIndex: ComputedRef<string>
) {
  const rootMenu = inject<RootMenuProvider>('rootMenu')

  const indexPath = computed(() => {
    let parent = instance.parent
    const path = [currentIndex.value]
    while (parent.type.name !== 'LyMenu') {
      if (parent.props.index) {
        path.unshift(parent.props.index as string)
      }
      parent = parent.parent
    }
    return path
  })

  const parentMenu = computed(() => {
    let parent = instance.parent
    while (parent && ['LyMenu', 'LySubMenu'].indexOf(parent.type.name) === -1) {
      parent = parent.parent
    }
    return parent
  })
  const paddingStyle = computed(() => {
    let parent = instance.parent
    if (rootMenu.props.mode !== 'vertical') return {}

    let padding = 20

    if (rootMenu.props.collapse) {
      padding = 20
    } else {
      while (parent && parent.type.name !== 'LyMenu') {
        if (parent.type.name === 'LySubMenu') {
          padding += 20
        }
        parent = parent.parent
      }
    }
    return { paddingLeft: padding + 'px' }
  })
  return { parentMenu, paddingStyle, indexPath }
}
