const processTypes = [
  { value: 'factor', label: 'Factor' },
  { value: 'notfactored', label: 'Not Factored' },
  { value: 'quickpay', label: 'Quickpay' }
]

const processTypesNoQuickPay = [
  { value: 'factor', label: 'Factor' },
  { value: 'notfactored', label: 'Not Factored' }
]

const processTypesNoFactor = [
  { value: 'notfactored', label: 'Not Factored' },
  { value: 'quickpay', label: 'Quickpay' }
]

export { processTypes, processTypesNoQuickPay, processTypesNoFactor }
