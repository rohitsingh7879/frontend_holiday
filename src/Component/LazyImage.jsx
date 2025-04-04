import React, { useState, useEffect, useRef } from "react";

const LazyImage = ({ src, alt, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true); 
          observer.disconnect(); 
        }
      },
      {
        threshold: 0.1, // Load when 10% of the image is in the viewport
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={imageRef}
      className={`d-flex justify-content-center align-items-center `}
    >
      {isVisible ? (
        <img src={src} alt={alt} className={className} />
      ) : (
        <div className={className}>
          <div
            role="status"
            className={`spinner-grow ${className}`}
            style={{
              // position: "absolute",
              textAlign: "center",
              // top: "48%",
              // left: "48%",
              // transform: "translate(-50%, -50%)",
              width: "1rem",
              height: "1rem",
            }}
          >
            <span className="sr-only"></span>
          </div>
        </div>
        // Placeholder while loading
      )}
    </div>
  );
};

export default LazyImage;
// const MyComponent = () => {
//   return (
//     <div>
//       <LazyImage src="path-to-your-image.jpg" alt="Lazy loaded image" />
//     </div>
//   );
// };
