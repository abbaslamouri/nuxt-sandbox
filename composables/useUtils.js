const iconType = (type) => {
  const mimetypes = {
    'video/mp4': 'IconsVideo',
    'image/jpeg': 'IconsPhotoFill',
    'image/jpg': 'IconsPhotoFill',
    'image/png': 'IconsPhotoFill',
    'image/webp': 'IconsPhotoFill',
    'image/svg+xml': 'IconsPhotoFill',
    'application/pdf': 'IconsPdf',
    'application/zip': 'IconsZip',
    'application/msword': 'IconsDoc',
    'application/vnd.ms-excel': 'IconsExcel',
  }
  return mimetypes[type] ? mimetypes[type] : 'IconsCommon'
}

export default iconType
