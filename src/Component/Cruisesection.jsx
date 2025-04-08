import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Cosec from "./Cosec";
import CruiseLinePromotion from "./CruiseLinePromotion";
import Cruiseinspren from "./Cruiseinspren";
import Luxurycruise from "./Luxurycruise";
import "../assets/css/home.css";
import moment from "moment";
import endpoints from "../utils/endpoints";
import generateCruiseDetailsUrl from "../utils/DetailsURL";

const CruiseSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status

  const fetchAllCruiseLineData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(
        `${import.meta.env.VITE_API_URL + endpoints?.newpackage}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setData(data?.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false); // Stop loading after the API call completes
    }
  };

  useEffect(() => {
    fetchAllCruiseLineData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    lazyLoad: "ondemand",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      <section className="collections">
        <div className="container">
          <h2>Picks from Cruise Collections</h2>

          <div className="collection_slider">
            {data && data?.length > 0 ? (
              <Slider {...settings} aria-label="Cruise Collection Slider">
                {data
                  ?.filter((item) => item.statusPickCollection)
                  .map((item, index) => (
                    <div className="coll_box" key={index}>
                      <img
                        src={item?.cruise_image}
                        className="img-fluid"
                        alt="Cruise"
                        loading="lazy"
                      />
                      <div className="c_data">
                        <span>
                          {item?.ship} | {item?.region}
                        </span>
                        <p>{item?.name}</p>
                        <div className="c_datec">
                          <div>
                            <span>
                              <i className="ri-calendar-todo-fill" />{" "}
                              {item?.cruise_nights} nights -{" "}
                              {item?.itinerary?.length > 0 &&
                                moment
                                  .unix(item.itinerary[0].check_in_date)
                                  .format("DD MMM YYYY")}
                            </span>
                          </div>
                          <div>
                            <img
                              src={item?.mobile_cruise_banner_image}
                              className="sm_logo"
                              alt="Logo"
                            />
                          </div>
                        </div>
                        <hr />
                        <div className="pricee">
                          Cruises from{" "}
                          <b>
                            {" "}
                            £{item?.priceStartFrom ? item.priceStartFrom : 0} pp
                          </b>
                        </div>
                        <Link
                          to={generateCruiseDetailsUrl(
                            "new-cruise-details",
                            item
                          )}
                          className="dis_more"
                          data-discover="true"
                        >
                          DISCOVER MORE
                        </Link>
                      </div>
                    </div>
                  ))}
              </Slider>
            ) : !data?.length && loading ? (
              <div className="d-flex justify-content-center align-items-center h-25">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>
            ) : !data?.length ? (
              <div className="d-flex text-center">No Data Available</div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-25">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Cosec />
      <CruiseLinePromotion />
      <Cruiseinspren />
      <Luxurycruise />
    </>
  );
};

export default CruiseSection;
