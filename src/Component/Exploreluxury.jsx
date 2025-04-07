import React, { useState, useEffect } from "react";
import C1 from "../assets/images/c1.png";
import Subscribe from "./Subscribe";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import endpoints from "../utils/endpoints";
import moment from "moment";
import generateCruiseDetailsUrl from "../utils/DetailsURL";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const Exploreluxury = () => {
  const [cruiseTypes, setCruiseTypes] = useState([]);
  const [shipItems, setShipItems] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [shipDetails, setShipDetails] = useState([]);
  const [shipRefData, setShipRefData] = useState([]);

  const [suCategoryAllData, setSubCategoryAllData] = useState([]);

  const [cruiseDataFromDB, setCruiseDataFromDB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  //   const fetchAllSubCategoryData = async (id) => {
  //     try {
  //       let result = await axios.get(
  //         `${API_URL + endpoints?.getSubCategoryByCatId}/${id}`
  //       );
  //       if (result && result?.status == 200) {
  //         setSubCategoryAllData(result?.data?.data);
  //       } else {
  //         console.log("Something went wrong...");
  //       }
  //     } catch (error) {
  //       console.log("Something went wrong...", error);
  //     }
  //   };

  //   const fetchAllCategoryData = async () => {
  //     console.log(`${API_URL + endpoints?.newCategory}`);
  //     try {
  //       let result = await axios.get(`${API_URL + endpoints?.newCategory}`);
  //       if (result && result?.status == 200) {
  //         const data = result?.data?.data;
  //         const luxuryData = data.filter(
  //           (item) => item.categoryName === "luxury-cruise-line"
  //         );
  //         console.log('lux----',luxuryData)
  //         const categoryId = luxuryData?.[0]?._id;
  //         if(categoryId){
  //             fetchAllSubCategoryData(categoryId)
  //         }
  //       } else {
  //         console.log("Something went wrong...");
  //       }
  //     } catch (error) {
  //       console.log("Something went wrong...", error);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchAllCategoryData();
  //   }, []);

  const fetchCruiseData = async () => {
    try {
      setLoading2(true);
      const response = await fetch(
        `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=400`,
        { headers: { Accept: "application/json;api_version=2" } }
      );
      const result = await response.json();

      const shipurl = result.cruises.map((cruise) => ({
        shipurl: cruise.ship,
        shipname: cruise.ship_title,
        starts_at: cruise.starts_at,
        ref: cruise.ref,
        price: cruise.cruise_only_price,
        date: cruise.starts_on,
        night: cruise.cruise_nights,
        dec: cruise.description,
        oprator: cruise.operator_title,
        day: cruise.vacation_days,
        airport: cruise.airports,
        suite_price: cruise.suite_price,
        outside_price: cruise.outside_price,
        balcony_price: cruise.balcony_price,
        inside_price: cruise.inside_price,
        travel_type: cruise.travel_type,
      }));

      const combinedCruiseData = result.cruises.map((cruise, index) => ({
        ...cruise,
        shipurl: shipurl[index].shipurl,
      }));

     
      setShipItems(combinedCruiseData);

      const shipDetailsPromises = shipurl.map((cruise) => {
        fetchShipData(cruise.shipurl, cruise.shipname);
      });

      await Promise.all([...shipDetailsPromises]);

      const uniqueCruiseTypes = [
        ...new Set(result.cruises.flatMap((cruise) => cruise.cruise_type)),
      ];

      // Filter out "River"
      const filteredCruiseTypes = uniqueCruiseTypes.filter(
        (type) => type !== "River"
      );

      setCruiseTypes(
        filteredCruiseTypes.map((type) => ({ value: type, label: type }))
      );

      if (filteredCruiseTypes.length > 0) {
        setActiveTab(filteredCruiseTypes[0]);
        setLoading2(false);
      }
    } catch (error) {
      console.error("Error fetching cruise data:", error);
    }
  };

  const fetchShipData = async (shipurl, shipname) => {
    try {
      const response = await fetch(
        `${shipurl}?app_id=${APP_ID}&token=${TOKEN}`,
        { headers: { Accept: "application/json;api_version=2" } }
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch ship details for",
          shipname,
          "Status:",
          response.status
        );
        return;
      }

      const shipDetail = await response.json();
      setShipDetails((prevDetails) => [...prevDetails, shipDetail]);
    } catch (error) {
      console.error("Error fetching ship details:", error);
    }
  };

  useEffect(() => {
    fetchCruiseData();
  }, []);

  const handleRefClick = (ref, ship) => {
    const resultRefData = shipItems?.filter((item) => item.ref === ref);
    setShipRefData(resultRefData);
    navigate(
      `/CruiseDetail/${ship.ship_title.replace(/\s+/g, "-").toLowerCase()}`,
      {
        state: { shipRefData: resultRefData },
      }
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
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
          dots: false,
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

  const fetchShipdataFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL + endpoints?.newpackage}`, {
        headers: {
          Accept: "application/json;api_version=2",
        },
      });
      const shipDetail = await response.json();

      const filterResult = shipDetail?.data;
      if (shipDetail?.status === 200) {
        setLoading(false);
      }
      // console.log(filterResult, shipDetail);
      if (filterResult?.length) {
        setCruiseDataFromDB([...filterResult]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching ship details:", error);
    }
  };

  useEffect(() => {
    fetchShipdataFromDB();
  }, []);

  return (
    <>
      <section className="explore_tabs">
        <div className="container">
          <h2>Explore our Luxury Cruise Lines</h2>

          {[...cruiseDataFromDB, ...shipItems]?.length > 0 &&
          cruiseTypes?.length > 0 ? (
            <>
              <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                {cruiseTypes.map((type) => (
                  <button
                    key={type.value}
                    className={`nav-link ${
                      activeTab === type.value ? "active" : ""
                    }`}
                    onClick={() => handleTabChange(type.value)}
                    id={`${type.value}-tab`}
                    data-bs-toggle="tab"
                    data-bs-target={`#${type.value}`}
                    type="button"
                    role="tab"
                    aria-controls={type.value}
                    aria-selected={activeTab === type.value}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="tab-content p-3" id="nav-tabContent">
                {cruiseTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`tab-pane fade ${
                      activeTab === type.value ? "active show" : ""
                    }`}
                    id={type.value}
                    role="tabpanel"
                    aria-labelledby={`${type.value}-tab`}
                  >
                    <Slider {...sliderSettings}>
                      {cruiseDataFromDB
                        .filter((ship) => ship.general_type === type.value)
                        .slice(
                          0,10
                        )
                        .map((ship, index) => {
                          return (
                            <div key={index} className="col-lg-4">
                              <div className="coll_box">
                                <img
                                  src={ship?.cruise_image}
                                  className="img-fluid"
                                  alt={`Cruise ${index + 1}`}
                                />
                                <div className="c_data">
                                  <span>
                                    {ship.name} | {ship.regions}
                                  </span>
                                  <p>{ship.name}</p>
                                  <div className="c_datec">
                                    <span>
                                      <i className="ri-calendar-todo-fill"></i>{" "}
                                      {ship.cruise_nights} nights -
                                      {ship?.general_Start
                                        ? moment
                                            .unix(ship?.general_Start)
                                            .format("DD MMM YYYY")
                                        : "N/A"}
                                    </span>
                                    <div>
                                      <img
                                        src={ship?.mobile_cruise_banner_image}
                                        className="sm_logo"
                                      />
                                    </div>
                                  </div>

                                  <hr />
                                  <div className="pricee">
                                    Cruises from <b> £{ship?.priceStartFrom}</b>
                                    PP
                                  </div>

                                  <Link
                                    className="dis_more"
                                    to={generateCruiseDetailsUrl(
                                      "new-cruise-details",
                                      ship
                                    )}
                                  >
                                    DISCOVER MORE
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      {shipItems
                        .filter((ship) => ship.cruise_type.includes(type.value))
                        .slice(0, 20)
                        .map((ship, index) => {
                          const shipcruise = shipDetails.find(
                            (details) => details.title === ship.ship_title
                          );

                          return (
                            <div key={index} className="col-lg-4">
                              <div className="coll_box">
                                <img
                                  src={shipcruise?.cover_image_href}
                                  className="img-fluid"
                                  alt={`Cruise ${index + 1}`}
                                />
                                <div className="c_data">
                                  <span>
                                    {ship.name} | {ship.regions}
                                  </span>
                                  <p>{ship.name}</p>
                                  <div className="c_datec">
                                    <span>
                                      <i className="ri-calendar-todo-fill"></i>{" "}
                                      {ship.cruise_nights} nights -
                                      {ship.starts_on
                                        ? new Date(
                                            ship.starts_on
                                          ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                          })
                                        : "N/A"}
                                    </span>
                                    <div>
                                      <img
                                        src={shipcruise?.profile_image_href}
                                        className="sm_logo"
                                      />
                                    </div>
                                  </div>

                                  <hr />
                                  <div className="pricee">
                                    Cruises from{" "}
                                    <b> £{ship.cruise_only_price}</b>PP
                                  </div>

                                  <Link
                                    to={`/CruiseDetail/${ship.ship_title
                                      .replace(/\s+/g, "-")
                                      .toLowerCase()}`}
                                    className="dis_more"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRefClick(ship.ref, ship);
                                    }}
                                  >
                                    DISCOVER MORE
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </Slider>
                  </div>
                ))}
              </div>
            </>
          ) : ![...cruiseDataFromDB, ...shipItems]?.length &&
            !cruiseTypes?.length &&
            loading &&
            loading2 ? (
            <div className="d-flex justify-content-center align-items-center h-25">
              <div className="spinner-border text-secondary" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          ) : ![...cruiseDataFromDB, ...shipItems]?.length &&
            !cruiseTypes?.length ? (
            <div className="d-flex text-center">
              No Data Available{loading - loading2}
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-25">
              <div className="spinner-border text-secondary" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          )}
        </div>
      </section>

      <Subscribe />
    </>
  );
};

export default Exploreluxury;
