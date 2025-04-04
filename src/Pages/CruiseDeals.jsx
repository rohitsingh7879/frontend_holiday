import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import four_banner from "../assets/images/collection_banner.jpg";
import moon from "../assets/images/icons/moon.png";
import logocolor from "../assets/images/logo-color.png";
import moon2 from "../assets/images/icons/ship.png";
import moon3 from "../assets/images/icons/date.png";

import "../assets/css/cruisedeals.css";
import Cruisesearch from "../Component/Cruisesearch";

const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const CruiseDeals = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] };

  const [loading, setLoading] = useState(true);
  const [loadingImg, setLoadingImg] = useState(true);

  const [shipDetails, setShipDetails] = useState({});
  const [fetchedShipDetailsCount, setFetchedShipDetailsCount] = useState(0);

  const [sortOption, setSortOption] = useState("Recommended");

 
  const handleImageLoad = () => {
    setTimeout(() => {
      setLoadingImg(false);
    }, 1000);
  };

  const handleImageError = () => {
    setLoadingImg(false);
  };

  const fetchShipDetails = async (shipUrl) => {
    try {
      const response = await fetch(
        `${shipUrl}?app_id=${APP_ID}&token=${TOKEN}`,
        {
          headers: {
            Accept: "application/json;api_version=2",
          },
        }
      );
      const shipDetail = await response.json();

      setShipDetails((prevState) => ({
        ...prevState,
        [shipUrl]: shipDetail,
      }));

      setFetchedShipDetailsCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error fetching ship details:", error);
    }
  };

  const fetchOperatorDetails = async (operatorUrl) => {
    try {
      const response = await fetch(
        `${operatorUrl}?app_id=${APP_ID}&token=${TOKEN}`,
        {
          headers: {
            Accept: "application/json;api_version=2",
          },
        }
      );
      const operatorDetail = await response.json();

      setShipDetails((prevState) => ({
        ...prevState,
        [operatorUrl]: operatorDetail,
      }));

      setFetchedShipDetailsCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error fetching operator details:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (results && results?.length > 0) {
        setLoading(true)
        const shipPromises = [];
        const portPromises = [];

        results.forEach((cruise) => {
          const shipUrl = cruise.ship;
          const operatorUrl = cruise.operator;

          let shipResult;
          let operatorResult;

          if (!shipDetails[shipUrl]) {
            shipResult = fetchShipDetails(shipUrl);
            shipPromises.push(shipResult);
          }

          if (operatorUrl && !shipDetails[operatorUrl]) {
            operatorResult = fetchOperatorDetails(operatorUrl);
            portPromises.push(operatorResult);
          }
        });

        await Promise.all([...shipPromises, ...portPromises]);
        setLoading(false)
      }
    };

    fetchData(); 
    setLoading(false)

  }, [results, shipDetails, fetchedShipDetailsCount]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const getLimitedDescription = (description) => {
    const strippedDescription = description?.replace(/(<([^>]+)>)/gi, "");
    const words = strippedDescription?.split(" ").slice(0, 40).join(" ");

    return (
      words +
      (words.split(" ").length === strippedDescription.split(" ").length
        ? ""
        : "...")
    );
  };
  const sortResults = (option) => {
    const sortedArray = [...results];

    switch (option) {
      case "Price (Low to High)":
        return sortedArray.sort((a, b) => a.price - b.price);
      case "Price (High to Low)":
        return sortedArray.sort((a, b) => b.price - a.price);
      case "Departure Date (Soonest First)":
        return sortedArray.sort(
          (a, b) => new Date(a.starts_on) - new Date(b.starts_on)
        );
      case "Departure Date (Furthest First)":
        return sortedArray.sort(
          (a, b) => new Date(b.starts_on) - new Date(a.starts_on)
        );
      default:
        return sortedArray;
    }
  };
  const sortedResults = sortResults(sortOption);

  // if (!results || results.length === 0) {
  //   console.error("No cruises found");
  //   return null;
  // }

  return (
    <>
      <section className="banner">
        <div
          id="demo"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={four_banner}
                alt="Collection"
                className="d-block"
                style={{ width: "100%" }}
              />
              <div className="bg-overlay" />
              <div className="carousel-caption">
                <p>
                  <img src={logocolor} className="img-fluid logo_d" />
                </p>
                <h3>Hand Picked Cruise Collection</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Cruisesearch />
      <section className="cruise_dest">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              {/* Filter section */}
              <div className="ship_left_area">
                <div className="button1">
                  <h4>
                    CRUISE CATEGORY <i className="ri-arrow-down-s-line"></i>
                  </h4>
                  <div className="mydiv">
                    <ul>
                      <li>
                        <input type="checkbox" value="" /> 2025
                      </li>
                      <li>
                        <input type="checkbox" value="" /> 2026
                      </li>
                      <li>
                        <input type="checkbox" value="" /> All Inclusive Cruises
                      </li>
                      <li>
                        <input type="checkbox" value="" /> Cruise Deals
                      </li>
                      <li>
                        <input type="checkbox" value="" /> Last Minute Deals
                      </li>
                      <li>
                        <input type="checkbox" value="" /> Luxury Cruises
                      </li>
                      <li>See More</li>
                    </ul>
                  </div>
                </div>

                <div className="button1">
                  <h4>
                    DEPARTURE MONTH <i className="ri-arrow-down-s-line" />
                  </h4>
                  <div className="mydiv">
                    <select className="select_area">
                      <option>Departure</option>
                      <option>Departure</option>
                    </select>
                  </div>
                </div>
                <div className="button1">
                  <h4>
                    Destination <i className="ri-arrow-down-s-line" />
                  </h4>
                  <div className="mydiv">
                    <select className="select_area form-select">
                      <option>Destination</option>
                      <option>Destination</option>
                    </select>
                  </div>
                </div>
                <div className="button1">
                  <h4>
                    Cruise Line <i className="ri-arrow-down-s-line" />
                  </h4>
                  <div className="mydiv">
                    <select className="select_area">
                      <option>Cruise Line</option>
                      <option>Cruise line2</option>
                    </select>
                  </div>
                </div>
                <div className="button1">
                  <h4>
                    CRUISE SHIP <i className="ri-arrow-down-s-line" />
                  </h4>
                  <div className="mydiv">
                    <select className="select_area">
                      <option>All Ships</option>
                      <option>cruise ship</option>
                    </select>
                  </div>
                </div>
                <div className="button1 border_none">
                  <h4>
                    ports <i className="ri-arrow-down-s-line" />
                  </h4>
                  <div className="mydiv">
                    <select className="select_area">
                      <option>All Ports </option>
                      <option>ports2 </option>
                    </select>
                  </div>
                </div>
                <div className="filter level-filter level-req">
                  <div id="rangeSlider" className="range-slider">
                    <label>Duration:</label>
                    <div className="number-group">
                      <input
                        className="number-input"
                        type="number"
                        defaultValue={10}
                        min={0}
                        max={50}
                      />{" "}
                      -
                      <input
                        className="number-input"
                        type="number"
                        defaultValue={50}
                        min={0}
                        max={50}
                        disabled
                      />{" "}
                      Nights
                    </div>
                    <div className="range-group">
                      <input
                        id="range-input"
                        className="range-input"
                        defaultValue={10}
                        min={1}
                        max={50}
                        step={1}
                        type="range"
                      />
                    </div>
                  </div>
                </div>
                <div className="filter level-filter level-req">
                  <div id="rangeSlider1" className="range-slider">
                    <label>Price Range:</label>
                    <div className="number-group">
                      <input
                        className="number-input"
                        type="number"
                        defaultValue={10}
                        min={0}
                        max={50}
                      />{" "}
                      -
                      <input
                        className="number-input"
                        type="number"
                        defaultValue={50}
                        min={0}
                        max={50}
                        disabled
                      />
                    </div>
                    <div className="range-group">
                      <input
                        id="range-input"
                        className="range-input"
                        defaultValue={10}
                        min={1}
                        max={50}
                        step={1}
                        type="range"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <a href="#" className="action_btn">
                    Reset
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="cruise_info">
                <div className="cruise_result">
                  Showing: {sortedResults.length} Cruises
                </div>
                <div className="cruise_drop">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option>Recommended</option>
                    <option>Price (Low to High)</option>
                    <option>Price (High to Low)</option>
                    <option>Departure Date (Soonest First)</option>
                    <option>Departure Date (Furthest First)</option>
                  </select>
                </div>
              </div>
              {
              sortedResults?.length > 0 ? (
                sortedResults?.map((cruise, index) => {
                  const shipUrl = cruise.ship;
                  const shipDetail = shipDetails[shipUrl];

                  return (
                    <div className="criuse_list" key={index}>
                      <div className="row">
                        <div className="col-lg-4">
                          <div
                            className="cri_pic"
                            style={{
                              position: "relative",
                            }}
                          >
                            {loadingImg && (
                              <div
                                className="spinner-grow"
                                role="status"
                                style={{
                                  position: "absolute",
                                  top: "40%",
                                  left: "40%",
                                }}
                              >
                                <span className="sr-only"></span>
                              </div>
                            )}
                            <img
                              src={shipDetail?.cover_image_href}
                              className={`img-fluid ${
                                loadingImg ? "invisible" : "visible"
                              }`}
                              onLoad={handleImageLoad}
                              onError={handleImageError}
                              alt={shipDetail?.shipname}
                              loading="lazy"
                            />
                            <div className="wish_list">
                              <a>
                                <i className="ri-heart-3-line" />
                              </a>
                            </div>
                          </div>
                          {/* <div className="cri_pic">

                            <img
                              src={shipDetail?.cover_image_href}
                              className="img-fluid"
                              alt="Ship"
                            />
                            <div className="wish_list">
                              <a>
                                <i className="ri-heart-3-line" />
                              </a>
                            </div>
                          </div> */}
                        </div>
                        <div className="col-lg-8 p-0">
                          <div className="cri_info">
                            <div className="top_area_ship">
                              <div className="row">
                                <div className="col-lg-3 pright_zeo">
                                  <div className="ship_ssd">
                                    <div>
                                      <img
                                        src={moon2}
                                        className="img-fluid"
                                        alt="Ship"
                                      />
                                    </div>
                                    <div>
                                      <p>Ship</p>
                                      <span>{cruise?.ship_title}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 pright_zeo">
                                  <div className="ship_ssd">
                                    <div>
                                      <img
                                        src={moon3}
                                        className="img-fluid"
                                        alt="Date"
                                      />
                                    </div>
                                    <div>
                                      <p>Date</p>
                                      <span>
                                        {cruise?.starts_on
                                          ? formatDate(cruise.starts_on)
                                          : "17 Sep 2025"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 pright_zeo">
                                  <div className="ship_ssd">
                                    <div>
                                      <img
                                        src={moon}
                                        className="img-fluid"
                                        alt="Duration"
                                      />
                                    </div>
                                    <div>
                                      <p>Duration</p>
                                      <span>
                                        {cruise?.cruise_nights
                                          ? `${cruise.cruise_nights} nights`
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dieds">
                              {cruise?.travel_type ||
                                "All-Inclusive Mallorca Beaches and Luxury Greek Isles Cruise"}
                            </div>
                            <div className="dieds">
                              <span>
                                <img src={moon2} className="img-fluid" />{" "}
                                Mykonos- Kusadasi- Istanbul- Santorini-
                                Katakolon
                              </span>
                            </div>
                            <div className="curise_des_area">
                              {getLimitedDescription(cruise?.description)}
                            </div>
                            <div className="row align-items-center mt-3">
                              <div className="col-lg-7">
                                <div className="cck">
                                  <ul>
                                    <li>
                                      <img src={moon3} className="img-fluid" />{" "}
                                      {cruise?.cruise_nights
                                        ? `${cruise.cruise_nights} nights`
                                        : "13 nights"}{" "}
                                      -{" "}
                                      {cruise.starts_on
                                        ? formatDate(cruise.starts_on)
                                        : "17 Sep 2025"}
                                    </li>
                                    <li>
                                      <img src={moon3} className="img-fluid" />{" "}
                                      {cruise?.vacation_days
                                        ? `${cruise.vacation_days} Days`
                                        : ""}{" "}
                                      -{" "}
                                      {cruise.starts_on
                                        ? formatDate(cruise.starts_on)
                                        : ""}
                                    </li>
                                    <li>
                                      <img src={moon3} className="img-fluid" />{" "}
                                      {cruise?.vacation_days
                                        ? `${cruise.vacation_days} Days`
                                        : ""}{" "}
                                      -{" "}
                                      {cruise.starts_on
                                        ? formatDate(cruise.starts_on)
                                        : ""}
                                    </li>
                                    <li>
                                      <img src={moon3} className="img-fluid" />{" "}
                                      16 nights - 28 Nov 2025
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-lg-5">
                                <div className="curise_amount">
                                  <div className="final_price">
                                    £{cruise?.cruise_only_price || "£2,599pp"}
                                  </div>
                                  <div>
                                    <Link
                                      to={`/CruiseDetail/${cruise?.ship_title
                                        .replace(/\s+/g, "-")
                                        .toLowerCase()}`}
                                      className="dis_more"
                                    >
                                      View Deal
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : !sortedResults?.length && loading ? (
                <div className="d-flex justify-content-center align-items-center h-25">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : (
                <div className="d-flex text-center">No Cruises Available</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CruiseDeals;
