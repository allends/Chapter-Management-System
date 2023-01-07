import { startCase } from "lodash"

export const genOptionsObj = (option: any) => {
  const obj = {
    'value': option,
    'label': startCase(option.toString().toLowerCase())
  }
  return obj
}
