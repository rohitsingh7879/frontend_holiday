import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/css/client.css"; // Ensure you have the right styles

// API Details (if needed)
const API_BASE_URL = "https://www.widgety.co.uk/api/operators.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const Ourclient = () => {
  // State to store the fetched data
  const [cruiseData, setCruiseData] = useState({ ships: [] });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,

        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false,
          autoplay: true,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchCruiseTypes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}`,
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
        let profileArray = cruiseResult?.operators.map(
          (cruiseItem, index) => cruiseItem.profile_image_href
        );
        setCruiseData(profileArray);

        // Map the fetched ships data
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchCruiseTypes();
  }, []);
  //console.log("op", cruiseData);
  return (
    <>
      <section className="partner">
        <div className="container">
          <Slider {...settings}>
            {cruiseData?.length > 0 &&
              cruiseData?.map((item, index) => (
                <div key={index}>
                  <img
                    src={item}
                    className="img-fluid"
                    alt={`Partner Logo ${index + 1}`}
                  />
                </div>
              ))}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Ourclient;
