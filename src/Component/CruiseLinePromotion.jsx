import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/css/cruiseline.css";
import { cruise_in1 } from "../assets/images";
const cruiseship =
  "https://www.widgety.co.uk/api/ships.json?token=44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44&app_id=9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";

const CruiseLinePromotion = () => {
  const [cruiseitem, setCruiseItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const headers = {
          Accept: "application/json; api_version=2",
          "Content-Type": "application/json",
        };
        const response = await fetch(cruiseship, { headers });

        if (!response.ok) throw new Error("Network response was not ok");

        const cruiseshipdata = await response.json();

        const items = cruiseshipdata.ships.map((ship) => {
          return {
            shipname: ship?.title,
            id: ship?.id,
            shiptype: ship?.ship_type,
            shipclass: ship?.ship_class,
            profileImage: ship?.profile_image_href,
            coverImage: ship?.cover_image_href,
            video: ship?.video_url,
          };
        });

        setCruiseItems(items);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);



  return (
    <section className="cruise_line">
      <div className="container">
        <h2>Cruise Line Promotions</h2>
        {cruiseitem && cruiseitem?.length > 0 ? (
          <Slider {...settings} className="collection_slider">
            {cruiseitem.map((item) => (
              <div className="line_promotions" key={item?.id}>
                <div>
                  <Link
                    to={`/CruiseDetail/${item?.shipname}`}
                    aria-label={`Details of ${item?.shipname}`}
                  >
                    <img
                      src={item?.coverImage || cruise_in1}
                      alt={`Cruise ship named ${item?.shipname}`}
                      className="img-fluid cover-image"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        ) : !cruiseitem?.length && loading ? (
          <div className="d-flex justify-content-center align-items-center h-25">
            <div className="spinner-border text-secondary" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : !cruiseitem?.length ? (
          <div className="d-flex text-center">No Data Available</div>
        ) : (
          <div className="d-flex justify-content-center align-items-center h-25">
            <div className="spinner-border text-secondary" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CruiseLinePromotion;
