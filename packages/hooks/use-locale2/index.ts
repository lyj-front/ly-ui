import { computed, inject, isRef, ref, unref } from 'vue'
import get from 'lodash/get'
import English from '@element-plus/locale/lang/en'

import type { MaybeRef } from '@vueuse/core'
import type { InjectionKey, Ref } from 'vue'
import type { Language } from '@element-plus/locale'

type TranslatorOption = Record<string, string | number>
type Translator = (path: string, option?: TranslatorOption) => string
type LocaleContext = {
  locale: Ref<Language>
  lang: Ref<string>
  t: Translator
}

const buildTranslator =
  (locale: MaybeRef<Language>): Translator =>
  (path, option) =>
    translate(path, option, unref(locale))

const translate = (
  path: string,
  option: undefined | TranslatorOption,
  locale: Language
): string =>
  (get(locale, path, path) as string).replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  )

const buildLocaleContext = (
  locale: MaybeRef<Language>
): LocaleContext => {
  const lang = computed(() => unref(locale).name)
  const localeRef = isRef(locale) ? locale : ref(locale)
  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale),
  }
}

const localeContextKey: InjectionKey<Ref<Language | undefined>> =
  Symbol('localeContextKey')

export const useLocale2 = (localeOverrides?: Ref<Language | undefined>) => {
  const locale = localeOverrides || inject(localeContextKey, ref())!
  return buildLocaleContext(computed(() => locale.value || English))
}
