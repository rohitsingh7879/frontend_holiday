import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import generateCruiseDetailsUrl from "../utils/DetailsURL";

// API URL
const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const SimilarCruises = ({ cname }) => {
  const { shipname, details } = useParams();
  const detail = details?.split("_");
  let shipName = detail ? detail[1] : "";
  shipName=shipName?.replace("-"," ")

  const formattedShipName =
    cname ||
    shipname 
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const [cruiseData, setCruiseData] = useState([]);
  const [shipItems, setShipItems] = useState([]);
  const [shipDetails, setShipDetails] = useState([]);
  const [shipRefData, setshipRefData] = useState([]);
  // Slider settings
  const settings = {
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
      { breakpoint: 520, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchCruiseTypes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&ship_name=${formattedShipName || shipName}`,
          {
            headers: {
              Accept: "application/json; api_version=2",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const cruiseResult = await response.json();
        setCruiseData(cruiseResult?.cruises || []);

        const items =
          cruiseResult?.cruises?.map((ship) => ({
            id: ship.id || Math.random(),
            shipname: ship.ship_title,
            shipurl: ship.ship,
            price: ship.cruise_only_price,
            region: ship.regions,
            name: ship.name,
            night: ship.cruise_nights,
            start: ship.starts_on,
            ref: ship.ref,
          })) || [];

        setShipItems(items);

        items.forEach((cruise) => {
          fetchShipData(cruise.shipurl, cruise.shipname);
        });
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchCruiseTypes();
  }, [formattedShipName]);

  const fetchShipData = async (shipurl, shipname) => {
    try {
      const response = await fetch(
        `${shipurl}?app_id=${APP_ID}&token=${TOKEN}`,
        {
          headers: { Accept: "application/json; api_version=2" },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching ship details");
      }

      const shipDetail = await response.json();
      const coverImage = shipDetail.cover_image_href;
      const profileImage = shipDetail.profile_image_href;

      setShipDetails((prevDetails) => [
        ...prevDetails,
        { shipname, profileImage, coverImage },
      ]);
    } catch (error) {
      console.error("Error fetching ship details:", error);
    }
  };

  const navigate = useNavigate();

  const handleRefClick = (ref, ship) => {
    const resultRefData = cruiseData?.filter((item) => item.ref == ref);
    setshipRefData(resultRefData);
    console.log("--ship-", ship);

    const url = generateCruiseDetailsUrl("cruise-details", ship);
    navigate(url, {
      state: { shipRefData: resultRefData },
    });
  };
  return (
    <section className="collections">
      <div className="container">
        <h2>Similar Cruises</h2>
        <div className="slider-wrapper" style={{ position: "relative" }}>
          <Slider {...settings}>
            {shipItems.map((item, index) => {
              const cruise = cruiseData.find(
                (cruise) => cruise.ship_title === item.shipname
              );
              const shipDetail = shipDetails.find(
                (detail) => detail.shipname === item.shipname
              );

              return (
                <div className="coll_box" key={index}>
                  <img
                    src={shipDetail?.coverImage || "default-image.jpg"}
                    className="img-fluid"
                    alt={item.shipname}
                  />
                  <div className="c_data">
                    <span>{item.shipname}</span>
                    <p>
                      {item?.name} | {item?.region}
                    </p>
                    <div className="c_datec">
                      <div>
                        <span>
                          <i className="ri-calendar-todo-fill"></i> {item.night}{" "}
                          nights - {moment(item.start).format("DD MMM YYYY")}
                        </span>
                      </div>
                      <div>
                        <img
                          src={shipDetail?.profileImage || "default-logo.jpg"}
                          className="sm_logo"
                          alt="Profile"
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="pricee">
                      Cruises from <b>£ {item.price} PP</b>
                    </div>
                    <Link
                      // to={`/CruiseDetail/${item.shipname
                      //   .replace(/\s+/g, "-")
                      //   .toLowerCase()}`}
                      className="dis_more"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRefClick(item?.ref, cruise);
                      }}
                    >
                      DISCOVER MORE
                    </Link>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default SimilarCruises;
