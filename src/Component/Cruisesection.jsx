import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
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

  const fetchAllCruiseLineData = async () => {
    fetch(`${import.meta.env.VITE_API_URL + endpoints?.newpackage}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setData(data?.data);
        console.log("---8888888888",data?.data)
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
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
            <Slider {...settings}>
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
                        to={generateCruiseDetailsUrl("new-cruise-details", item)}
                        className="dis_more"
                        data-discover="true"
                      >
                        DISCOVER MORE
                      </Link>
                    </div>
                  </div>
                ))}
            </Slider>
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
