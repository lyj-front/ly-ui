import { reactive } from 'vue'

export default {
  tableConfigControl: reactive({
    lineHeight: 28,
  }),
  lineHeightConfig: [28, 32, 36],
}

const apiMap = []
export function setViewApi(listIdName, systemIdName, query) {
  apiMap[`${listIdName}+${systemIdName}`] = query
}
export function getTableInfo(listIdName, systemIdName) {
  const query = apiMap[`${listIdName}+${systemIdName}`]
  if (!!query) {
    query()
  }
}
