import React, { useState, useEffect } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../assets/css/luxury.css';
import { Link } from 'react-router-dom';
import Exploreluxury from './Exploreluxury';

const API_BASE_URL = "https://www.widgety.co.uk/api/ships.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN = "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const Luxurycruise = () => {

    const [cruiseData, setCruiseData] = useState({ ships: [] });
    const [shipItems, setShipItems] = useState([]);
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
          slidesToShow: 2, 
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, 
          slidesToScroll: 1,
          dots: false,
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
          throw new Error('Network response was not ok');
        }

        const cruiseResult = await response.json();
        setCruiseData(cruiseResult);

    
        const items = cruiseResult.ships.map(ship => ({
          shipname: ship.title,  
          id: ship.id,
          currency: ship.currency,  
          shiptype: ship.ship_type,
          profileImage: ship.profile_image_href,  
          coverImage: ship.cover_image_href,    

        }));

        setShipItems(items);

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchCruiseTypes();
  }, []);
  return (
    <>
 <section className="explore_cruise_line">
      <div className="container">
        <h2>Explore our Luxury Cruise Lines</h2>

        {/* Slider Component */}
        <Slider {...settings} className="explore_cruise_slider">
          {
            shipItems.map((item) => (
              <div className="explore_list_c" key={item.id}>
                <img src={item.profileImage || 'default-image.jpg'} className="list_logo" alt={item.shipname} />
                <Link href="#">
                  <img src={item.coverImage || 'default-cover-image.jpg'} className="img-fluid" alt={item.shipname} />
                </Link>
                <div className="cs">
				    	<Link href="#"><i className="ri-arrow-right-line"></i></Link>
				      </div>
              </div>
            ))
          }
        </Slider>
      </div>
    </section>
    <Exploreluxury />
    </>
  );
};

export default Luxurycruise;
