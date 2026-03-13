import { capitalize as toCapitalize } from '@vue/shared'
export {
  camelize,
  hyphenate,
  hyphenate as kebabCase, // alias
} from '@vue/shared'

/**
 * fork from {@link https://github.com/sindresorhus/escape-string-regexp}
 */
// NOTE: improve capitalize types. Restore previous code after the [PR](https://github.com/vuejs/core/pull/6212) merge
export const capitalize = <T extends string>(str: T) =>
  toCapitalize(str) as Capitalize<T>
