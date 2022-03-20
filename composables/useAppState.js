const useAppState = () => {
  // const errorMsg = useState('errorMsg', () => '')
  // const message = useState('message', () => '')
  // const galleryMedia = useState('galleryMedia', () => [])
  // const mediaReference = useState('mediaReference', () => [])
  // const showMediaSelector = useState('showMediaSelector', () => false)
  const errorMsg = useState('errorMsg', () => '')
  const message = useState('message', () => '')
  const showCartSlideout = useState('showCartSlideout', () => false)
  const showMediaSelector = useState('showMediaSelector', () => false)

  const alert = useState('alert', () => {
    return {
      show: false,
      heading: '',
      paragraph: '',
      action: '',
      showCancelBtn: true,
      // showAttributesSlideout: false,
    }
  })

  // const alert = useState('alert', () => {
  //   return {
  //     show: false,
  //     heading: '',
  //     paragraph: '',
  //     action: '',
  //     showCancelBtn: true,
  //   }
  // })

  return {
    errorMsg,
    message,
    // galleryMedia,
    // mediaReference,
    showMediaSelector,
    showCartSlideout,
    alert,
    // fetchAll,
    // saveDoc,
    // saveDocs,
    // fetchBySlug,
    // deleteById,
    // deleteMany,
  }
}

export default useAppState
