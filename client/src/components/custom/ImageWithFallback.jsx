import { useState, useEffect } from "react";

export default function ImageWithFallback({
    src,
    fallback,
    alt = "image",
    className = "",
    style = {},
    ...props
}) {
    const [imgSrc, setImgSrc] = useState(src || fallback);
    const [hasError, setHasError] = useState(false);

    // Update imgSrc when src prop changes
    useEffect(() => {
        if (src && src !== imgSrc && !hasError) {
            setImgSrc(src);
            setHasError(false);
        } else if (!src) {
            setImgSrc(fallback);
            setHasError(false);
        }
    }, [src, fallback]);

    const handleError = () => {
        if (!hasError && imgSrc !== fallback) {
            setHasError(true);
            setImgSrc(fallback);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            style={style}
            onError={handleError}
            {...props}
        />
    );
}
