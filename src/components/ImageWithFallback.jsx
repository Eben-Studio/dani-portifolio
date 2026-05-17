import { forwardRef, useEffect, useState } from 'react'

const ImageWithFallback = forwardRef(function ImageWithFallback(
  {
    src,
    alt,
    className,
    fallbackClassName,
    fallbackText = '',
    fallbackSrc = '',
  },
  ref,
) {
  const [failedPrimary, setFailedPrimary] = useState(false)
  const [failedFallback, setFailedFallback] = useState(false)

  useEffect(() => {
    setFailedPrimary(false)
    setFailedFallback(false)
  }, [src, fallbackSrc])

  const resolvedSrc = src || fallbackSrc
  const currentSrc = failedPrimary && fallbackSrc ? fallbackSrc : resolvedSrc

  if (!resolvedSrc || (failedPrimary && (!fallbackSrc || failedFallback))) {
    return <div aria-hidden="true" className={fallbackClassName}>{fallbackText}</div>
  }

  return (
    <img
      ref={ref}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!failedPrimary) {
          setFailedPrimary(true)
          return
        }
        setFailedFallback(true)
      }}
    />
  )
})

export default ImageWithFallback
