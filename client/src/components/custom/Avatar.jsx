import noprofile from "../../assets/default.png";
import { useState, useEffect } from "react";

export default function Avatar({ src, size, radius }) {
  const [imgSrc, setImgSrc] = useState(src || noprofile);
  const [hasError, setHasError] = useState(false);

  // Update imgSrc when src prop changes
  useEffect(() => {
    if (src && src !== imgSrc && !hasError) {
      setImgSrc(src);
      setHasError(false);
    } else if (!src) {
      setImgSrc(noprofile);
      setHasError(false);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(noprofile);
    }
  };

  const style = {
    height: size ? `${size}px` : "40px",
    width: size ? `${size}px` : "40px",
    borderRadius: "50%" || radius,
    overflow: "hidden",
  };

  return (
    <div className="avatar" style={style}>
      <img
        src={imgSrc}
        alt="avatar"
        style={{ height: "100%", width: "100%", objectFit: "cover" }}
        onError={handleError}
      />
    </div>
  );
}
