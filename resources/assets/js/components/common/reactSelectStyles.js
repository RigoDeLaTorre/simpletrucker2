const customStyles = {
  // container: (base, state) => ({
  //   ...base,
  //   opacity: state.isDisabled ? '.5' : '1',
  //   backgroundColor: 'transparent',
  //   zIndex: '10005'
  // }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted #7f64e3',
    color: 'black'

    // color: state.isSelected ? 'red' : 'blue',
  }),

  control: (provided, state) => ({
    ...provided,
    height: 50,
    color: 'yellow',
    // background: 'white',
    background: 'transparent',
    border: state.isFocused ? 0 : 0,
    borderBottom: '1px solid #9e9e9e',
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 0,
    '&:hover': {
      border: state.isFocused ? 0 : 0,
      borderBottom: '1px solid #7f64e3'
    }
  }),
  input: base => ({
    ...base,
    color: 'white'
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = 'opacity 300ms'
    const color = 'white'
    const textTransform = 'capitalize'

    return { ...provided, opacity, transition, color, textTransform }
  },
  valueContainer: base => ({
    ...base,
    padding: 0
  }),
  menuList: base => ({
    ...base,
    maxHeight: '15rem'
  })
  // menuPortal: base => ({ ...base, zIndex: 9999 })
}
export { customStyles }