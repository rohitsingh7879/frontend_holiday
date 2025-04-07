import { useEffect, useState } from "react";
import "../assets/css/home.css";
import Cruisesection from "../Component/Cruisesection";
import endpoints from "../utils/endpoints";
import Cruisesearch from "../Component/Cruisesearch";
const Home = () => {
  const [cruiseDetail, setCruiseDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleImageError = () => {
    setLoading(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };
  
  useEffect(() => {
    const fetchCruiseDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL + endpoints?.newbanner}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cruise details");
        }

        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setCruiseDetail(data.data);
        } else {
          console.log("No data found");
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchCruiseDetails();
  }, []);

  return (
    <>
      <section className="banner">
        <div id="demo" className="carousel slide" data-bs-ride="carousel">
          {loading && (
            <div
              className="spinner-grow"
              role="status"
              style={{
                position: "absolute",
                top: "48%",
                left: "48%",
                transform: "translate(-50%, -50%)",
                width: "3rem",
                height: "3rem",
              }}
            >
              <span className="visually-hidden"></span>
            </div>
          )}
          <div className="carousel-indicators">
            {cruiseDetail
              ?.filter((slide) => slide.bannerStatus)
              .map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#demo"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
          </div>

          {/* Carousel Items */}
          <div className="carousel-inner">
            {cruiseDetail
              ?.filter((slide) => slide.bannerStatus)
              .map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={slide.bannerImage}
                    alt={`Banner ${index + 1}`}
                    className={`img-fluid d-block w-100 ${
                      loading ? "invisible" : "visible"
                    }`}
                    loading="lazy" // Enable native lazy loading for images
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />

                  <div className="carousel-caption">
                    {!loading && (
                      <>
                        <h3>{slide.bannerHeading}</h3>
                        <p>{slide.bannerDescription}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Cruisesearch />

      {/* Cruisesection Component */}
      <Cruisesection />
    </>
  );
};

export default Home;
