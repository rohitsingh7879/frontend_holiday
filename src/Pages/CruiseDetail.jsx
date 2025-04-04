import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ModelEx from "../Component/ModelEx";
import "../assets/css/cruisedetails.css";
import crt1 from "../assets/images/icons/date.png";
import crt2 from "../assets/images/icons/mobile.png";
import crt3 from "../assets/images/icons/time.png";
import shipicon from "../assets/images/icons/ship.png";

import plan from "../assets/images/icons/plan.png";
import car from "../assets/images/icons/car.png";
import bed from "../assets/images/icons/bed.png";
import t1 from "../assets/images/icons/t_icon1.png";
import t2 from "../assets/images/icons/t_icon2.png";
import t3 from "../assets/images/icons/t_icon3.png";
import t4 from "../assets/images/icons/t_icon4.png";
import t5 from "../assets/images/icons/t_icon5.png";
import t6 from "../assets/images/icons/t_icon6.png";
import t7 from "../assets/images/icons/t_icon7.png";
import t8 from "../assets/images/icons/t_icon8.png";
import c1 from "../assets/images/in1.png";
import c2 from "../assets/images/in2.png";
import c3 from "../assets/images/in3.png";
import c4 from "../assets/images/in4.png";
import ato from "../assets/images/assurance-atol.png";
import ato1 from "../assets/images/CLIA-o-graph.png";

import lg from "../assets/images/icons/icon1.png";
import lg1 from "../assets/images/icons/icon2.png";
import lg2 from "../assets/images/icons/icon3.png";
import lg3 from "../assets/images/icons/icon4.png";
import lg4 from "../assets/images/icons/icon5.png";
import SimilarCruises from "./SimilarCruises";
import axios from "axios";

const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const ALL_POST_API = "https://www.widgety.co.uk/api/ports.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const CruiseDetails = () => {
  const [allPortDetails, setAllPortsDetails] = useState([]);

  const fetchAllPorts = async () => {
    try {
      let resultAllPortData = await axios.get(
        `${ALL_POST_API}?app_id=${APP_ID}&token=${TOKEN}`,
        {
          headers: {
            Accept: "application/json;api_version=2",
          },
        }
      );

      if (resultAllPortData && resultAllPortData.status == 200) {
        setAllPortsDetails(resultAllPortData?.data?.ports);
      }
    } catch (error) {
      console.log("--error---", error);
    }
  };

  useEffect(() => {
    fetchAllPorts();
  }, []);

  const fetchParticularImage = (portName) => {
    const portDetails = allPortDetails?.find(
      (portDetails) => portDetails?.name === portName
    );

    if (portDetails) {
      return portDetails?.images[0]?.href;
    } else {
      //console.log("---No image found for port---", portName);
      return null;
    }
  };

  const { state } = useLocation();
  const shipRefData = state?.shipRefData;

 

  const { shipname ,details} = useParams();
  const detail=details?.split('_');
  const shipName= detail ? detail[1] : '';
  const [cruiseItems, setCruiseItems] = useState([]);
  const [totalCruises, setTotalCruises] = useState(0);
  const [shipDetails, setShipDetails] = useState(null);
  const [portDetail, setPortDetail] = useState([]);
  const [error, setError] = useState(null);
  const [showDeck, setShowdeck] = useState(false);
  const [showDing, setShowding] = useState(false);
  const [showentertainment, setShowEntertainment] = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  //const [showFullList, setShowFullList] = useState(false);
  const [prices, setPrices] = useState({
    outsidePrice: null,
    balconyPrice: null,
    suitePrice: null,
  });
  const [activeTab, setActiveTab] = useState("tab1");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [details]);
  useEffect(() => {
    const fetchCruiseTypes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}`,
          { headers: { Accept: "application/json;api_version=2" } }
        );

        if (!response.ok) {
          throw new Error(`Error fetching cruises: ${response.statusText}`);
        }

        const result = await response.json();

        if (result && result.total) {
          setTotalCruises(result.total);
        }
        if (result && result.cruises) {
          const cruisedata = result.cruises?.map((cruise) => ({
            shipurl: cruise.ship,
            shipname: cruise.ship_title,
            oprator_name: cruise.operator_title,
            ref: cruise.ref,
            price: cruise.cruise_only_price,
            date: cruise.starts_on,
            name: cruise.name,
            starts_at: cruise.starts_at,
            night: cruise.cruise_nights,
            day: cruise.vacation_days,
            airport: cruise.airports,
            suite_price: cruise.suite_price,
            outside_price: cruise.outside_price,
            balcony_price: cruise.balcony_price,
            inside_price: cruise.inside_price,
            travel_type: cruise.travel_type,
          }));

          setCruiseItems((prevData) => [...prevData, ...cruisedata]);
        } else {
          console.error("No cruise data available");
        }
      } catch (error) {
        console.error("Error fetching cruise types:", error);
        setError("Failed to fetch cruise types. Please try again later.");
      }
    };

    fetchCruiseTypes();
  }, []);

  const formatPrice = (price) => {
    if (price === "0.00") {
      return null;
    }
    return `£${parseFloat(price).toFixed(2)}`;
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) {
      return "Invalid Date";
    }

    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    // if (!shipname || cruiseItems?.length === 0) return;

    const fetchShipDetails = async () => {
      try {
        const formattedShipName = shipname || shipName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const shipUrl = `https://www.widgety.co.uk/api/ships/${formattedShipName}.json`;

        const response = await fetch(
          `${shipUrl}?app_id=${APP_ID}&token=${TOKEN}`,
          {
            headers: {
              Accept: "application/json; api_version=2",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ship details: ${response.statusText}`
          );
        }

        const shipData = await response.json();

        setShipDetails(shipData);
      } catch (error) {
        console.error("Error fetching ship details:", error);
        setError("Failed to fetch ship details. Please try again later.");
      }
    };

    fetchShipDetails();
  }, [shipname, cruiseItems]);

  //PORT  ALL GET
  useEffect(() => {
    const fetchPortDetails = async () => {
      try {
        const shipUrl = `https://www.widgety.co.uk/api/cruises/${shipRefData?.[0]?.ref}/port_visits.json`;

        const response = await fetch(
          `${shipUrl}?app_id=${APP_ID}&token=${TOKEN}`,
          {
            headers: {
              Accept: "application/json; api_version=2",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ship details: ${response.statusText}`
          );
        }

        const portdata = await response.json();
        // console.log("Port Data:", portdata);
        setPortDetail(portdata);
      } catch (error) {
        console.error("Error fetching ship details:", error);
        setError("Failed to fetch ship details. Please try again later.");
      }
    };

    fetchPortDetails();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }

  function removeHTMLTags(str) {
    return str?.replace(/<\/?[^>]+(>|$)/g, "");
  }
  if (!shipDetails) {
    return;
  }
  const { dining } = shipDetails;
  const diningIntro = dining ? dining.intro : null;
  const { entertainment } = shipDetails;
  const entertainmentIntro = entertainment ? entertainment.intro : null;
  const { health_and_fitness } = shipDetails;
  const healthfitnessinfo = health_and_fitness
    ? health_and_fitness.intro
    : null;
  const { kid_teen_types } = shipDetails;

  const { kids_and_teens } = shipDetails;
  const kidinfo = kids_and_teens ? kids_and_teens.intro : null;
  const { deckplans } = shipDetails;

  const diningOptions = shipDetails.dining_options || [];
  let dateDisplayed = false;
  const accommodation = shipDetails?.accomodation_types?.[0];
  const images = accommodation?.images || [];
  const gallery = accommodation?.images;

  //  const opid = shipRefData[0]?.opid;

  const itemsToShow = 4;
  const itemsToDining = 2;
  const itemsToEnt = 1;
  const visibleDecks = showDeck ? deckplans : deckplans.slice(0, itemsToShow);
  const visibleOptions = showDing
    ? diningOptions
    : diningOptions.slice(0, itemsToDining);
  const visibleEnt = showentertainment
    ? shipDetails?.entertainment_types
    : shipDetails?.entertainment_types?.slice(0, itemsToEnt);
  const visiHealth = showHealth
    ? shipDetails?.health_fitness_types
    : shipDetails?.health_fitness_types?.slice(0, itemsToEnt);
  return (
    <>
      <section className="banner mt-4 inner_banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="row">
                <div className="col-lg-12">
                  <div className="cruise_list_inner">
                    {/* Rendering the first image */}
                    {images[0] && (
                      <img src={images[0].href} className="img-fluid" />
                    )}
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="row">
                <div className="col-lg-12 mb20 mobile_ss">
                  <div className="cruise_list_inner2 b1">
                    {/* Rendering the second image */}
                    {images[1] && (
                      <img src={images[1].href} className="img-fluid" />
                    )}
                  </div>
                </div>
                <div className="col-lg-12 ">
                  <div className="row">
                    <div className="col-lg-5">
                      <div className="cruise_list_inner2">
                        {/* Rendering the third image */}
                        {images[2] && (
                          <img src={images[2].href} className="img-fluid" />
                        )}
                      </div>
                    </div>

                    <div className="col-lg-7">
                      <div className="cruise_list_inner2 b2">
                        {/* Rendering the fourth image */}
                        {images[3] && (
                          <img src={images[3].href} className="img-fluid" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cruises_photo">
                <a href="#" className="round_btn">
                  See all photos
                </a>
              </div>
          </div>
        </div>
      </section>
      <section className="middle_data">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="left_bar">
                {/* {console.log("Test2", shipRefData)} */}
                <h1>{shipRefData?.[0]?.name}</h1>

                <div className="info_area">
                  <ul>
                    <li>
                      <img src={shipicon} />
                      {shipRefData?.[0]?.shipname}{" "}
                      {shipRefData?.[0]?.ship_title}
                    </li>
                    <li>
                      <img src={crt1} alt="Cruise Image" />
                      {shipRefData?.[0]?.date
                        ? new Date(shipRefData[0]?.date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : new Date(
                            shipRefData?.[0]?.starts_on
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                    </li>
                    <li>
                      <img src={crt2} /> Ref: {shipRefData?.[0]?.ref}{" "}
                    </li>
                    <li>
                      <img src={crt3} /> Duration:{shipRefData?.[0]?.night}{" "}
                      {shipRefData?.[0]?.cruise_nights} Nights
                    </li>
                  </ul>
                </div>

                {/* <a href="#" className="free_btn"><img src={crt5} className="img-fluid" /> FREE Mount Fuji &amp; Bullet Train Tour</a> */}
                <div className="content_area">
                  <p>{removeHTMLTags(shipDetails?.introduction)}</p>
                </div>
                <div className="included">
                  <h4>What’s included</h4>
                  <ul className="bt_add">
                    <li>Full Board Cruise</li>
                    <li>All Taxes and Fees</li>
                    <li>Entertainment</li>
                  </ul>
                </div>
                <section className="explore_tabs_inner">
                  <div
                    className="nav nav-tabs mb-3"
                    id="nav-tab"
                    role="tablist"
                  >
                    <button
                      className="nav-link active"
                      id="nav-home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-home"
                      type="button"
                      role="tab"
                      aria-controls="nav-home"
                      aria-selected="true"
                    >
                      ITINERARY
                    </button>
                    <button
                      className="nav-link"
                      id="nav-profile-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-profile"
                      type="button"
                      role="tab"
                      aria-controls="nav-profile"
                      aria-selected="false"
                    >
                      ADD-ONS
                    </button>
                    <button
                      className="nav-link"
                      id="nav-contact-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-contact"
                      type="button"
                      role="tab"
                      aria-controls="nav-contact"
                      aria-selected="false"
                    >
                      ALTERNATE DATES
                    </button>
                    <button
                      className="nav-link"
                      id="nav-yacht-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-yacht"
                      type="button"
                      role="tab"
                      aria-controls="nav-yacht"
                      aria-selected="false"
                    >
                      SHIP INFO
                    </button>
                    <button
                      className="nav-link"
                      id="nav-bigship-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-bigship"
                      type="button"
                      role="tab"
                      aria-controls="nav-bigship"
                      aria-selected="false"
                    >
                      MAP{" "}
                    </button>
                  </div>
                  <div className="tab-content mt-4" id="nav-tabContent">
                    <div
                      className="tab-pane fade active show"
                      id="nav-home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                    >
                      <div className="tab_info">
                        <h4>Your Itinerary</h4>
                        <div className="faq_area">
                          <div className="accordion" id="accordionExample">
                            {portDetail?.map((item, index) => {
                              //console.log("---item---",item);
                              const formattedDate = formatDate(
                                item?.arrives_on
                              );
                              let portImage = null;
                              if (
                                (item && item?.images?.length == 0) ||
                                !item.images
                              ) {
                                portImage = fetchParticularImage(
                                  item?.port?.name
                                );
                              } else {
                                portImage = item.images[0].href;
                              }

                              return (
                                <div className="accordion-item" key={item.id}>
                                  <h2 className="accordion-header">
                                    <button
                                      className="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapse${index}`}
                                      aria-expanded="false"
                                      aria-controls={`collapse${index}`}
                                    >
                                      <b>
                                        Day {item?.day}: {formattedDate}
                                      </b>{" "}
                                      - {item?.port?.name}
                                    </button>
                                  </h2>
                                  <div
                                    id={`collapse${index}`}
                                    className="accordion-collapse collapse"
                                    data-bs-parent="#accordionExample"
                                  >
                                    <div className="accordion-body">
                                      <p className="overview">
                                        {removeHTMLTags(item?.port?.summary)}
                                      </p>

                                      <section className="be_inspired promotions">
                                        <div className="promotions_slider_port">
                                          <img
                                            src={portImage}
                                            className="img-fluid mt-4"
                                          />
                                        </div>
                                      </section>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* <a href="#" className="action_btn mt-4">
                            VIEW MORE
                          </a> */}
                        </div>
                        {/* <div className="top_hightligh">
                          <h4>TOUR HIGHLIGHTS</h4>

                          <div className="row">
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t1} className="img-fluid" />
                                <p>Majestic Mount Fuji Views</p>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t2} className="img-fluid" />
                                <p>Scenic Lake Ashi Cruise</p>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t3} className="img-fluid" />
                                <p>Majestic Mount Fuji Views</p>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t4} className="img-fluid" />
                                <p>Ride the Famous Bullet Train</p>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t5} className="img-fluid" />
                                <p>Explore Hakone’s Natural Beauty</p>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t6} className="img-fluid" />
                                <p>Majestic Mount Fuji Views</p>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t7} className="img-fluid" />
                                <p>Complimentary Guided Tour</p>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="high_c">
                                <img src={t8} className="img-fluid" />
                                <p>Majestic Mount Fuji Views</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr /> */}
                      </div>
                      <br />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-profile"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                    >
                      <div className="tab_info cardo">
                        <h4 />
                        <div className="adons">
                          <ul>
                            <li>
                              <img src={plan} />
                              Return UK Flights
                            </li>
                            <li>
                              <img src={car} />
                              Pre-Cruise Hotel Stays
                            </li>
                            <li>
                              <img src={bed} />
                              Post-Cruise Hotel Stay
                            </li>
                          </ul>
                        </div>
                      </div>
                      <section className="be_inspired mt-5">
                        <div className="container p-0">
                          <h4>Ship Gallery</h4>
                          <div className="row">
                            {gallery &&
                              gallery?.length > 0 &&
                              gallery?.map((item, index) => (
                                <div className="col-lg-6 col-6" key={index}>
                                  <div className="beb mb-4">
                                    <img
                                      src={item.href}
                                      className="img-fluid"
                                      alt={item.name}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </section>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-contact"
                      role="tabpanel"
                      aria-labelledby="nav-contact-tab"
                    >
                      <div className="tab_info alternat_data">
                        <h4>ALTERNATE DATES</h4>
                        <table className="table">
                          {cruiseItems?.map((item) => (
                            <tr key={item?.ref}>
                              <th>{formatDate(item?.date)}</th>
                              <td>From {formatPrice(item?.price)}</td>
                              <td>{item?.night} Nights</td>
                              <th>
                                <button
                                  onClick={openModal}
                                  className="enquiry_btn"
                                >
                                  ENQUIRE NOW
                                </button>
                              </th>
                            </tr>
                          ))}
                        </table>
                      </div>
                      <div className="top_hightligh">
                        <h4>TOUR HIGHLIGHTS</h4>
                        <div className="row">
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t1} className="img-fluid" />
                              <p>Majestic Mount Fuji Views</p>
                            </div>
                          </div>
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t2} className="img-fluid" />
                              <p>Scenic Lake Ashi Cruise</p>
                            </div>
                          </div>
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t3} className="img-fluid" />
                              <p>Majestic Mount Fuji Views</p>
                            </div>
                          </div>
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t4} className="img-fluid" />
                              <p>Ride the Famous Bullet Train</p>
                            </div>
                          </div>
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t5} className="img-fluid" />
                              <p>Explore Hakone’s Natural Beauty</p>
                            </div>
                          </div>
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t6} className="img-fluid" />
                              <p>Majestic Mount Fuji Views</p>
                            </div>
                          </div>
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t7} className="img-fluid" />
                              <p>Complimentary Guided Tour</p>
                            </div>
                          </div>
                          <div className="col-lg-3  col-6">
                            <div className="high_c">
                              <img src={t8} className="img-fluid" />
                              <p>Majestic Mount Fuji Views</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-yacht"
                      role="tabpanel"
                      aria-labelledby="nav-yacht-tab"
                    >
                      <div className="tab_info">
                        <ul
                          className="nav nav-pills mb-3  border-2 other_tabs"
                          id="pills-tab"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link active"
                              id="pills-home-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-home"
                              type="button"
                              role="tab"
                              aria-controls="pills-home"
                              aria-selected="true"
                            >
                              Overview
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link "
                              id="pills-decks-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-decks"
                              type="button"
                              role="tab"
                              aria-controls="pills-decks"
                              aria-selected="false"
                            >
                              Decks
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link"
                              id="pills-profile-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-profile"
                              type="button"
                              role="tab"
                              aria-controls="pills-profile"
                              aria-selected="false"
                            >
                              Dining
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link "
                              id="pills-contact-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-contact"
                              type="button"
                              role="tab"
                              aria-controls="pills-contact"
                              aria-selected="false"
                            >
                              entertainment
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link "
                              id="pills-health-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-health"
                              type="button"
                              role="tab"
                              aria-controls="pills-health"
                              aria-selected="false"
                            >
                              health &amp; fitness
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link "
                              id="pills-kids-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-kids"
                              type="button"
                              role="tab"
                              aria-controls="pills-kids"
                              aria-selected="false"
                            >
                              kids &amp; teens
                            </button>
                          </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                          <div
                            className="tab-pane fade show active cardo"
                            id="pills-home"
                            role="tabpanel"
                            aria-labelledby="pills-home-tab"
                          >
                            <p className="overview">
                              {removeHTMLTags(shipDetails?.teaser)}
                            </p>
                            <p className="overview">
                              {removeHTMLTags(shipDetails?.introduction)}
                            </p>
                            <h4>Unique Feature</h4>
                            <p>{shipDetails.unique_feature}</p>
                            <section className="be_inspired mt-5">
                              <div className="container p-0">
                                <h4>Ship Gallery</h4>
                                <div className="row">
                                  {gallery &&
                                    gallery?.length > 0 &&
                                    gallery?.map((item, index) => (
                                      <div className="col-lg-6 col-6" key={index}>
                                        <div className="beb mb-4">
                                          <img
                                            src={item?.href}
                                            className="img-fluid"
                                            alt={item?.name}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </section>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-decks"
                            role="tabpanel"
                            aria-labelledby="pills-decks-tab"
                          >
                            <div className="deck_info">
                              {visibleDecks &&
                                visibleDecks.map((deck, index) => (
                                  <div key={index}>
                                    <h6>{deck.name}</h6>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: deck.description,
                                      }}
                                    />
                                    <div className="row align-items-center">
                                      <div className="col-lg-4">
                                        <div className="deck_data">
                                          <ul>
                                            {deck?.description
                                              .match(/<li>(.*?)<\/li>/g)
                                              ?.map((item, i) => {
                                                const itemText = item?.replace(
                                                  /<\/?li>/g,
                                                  ""
                                                );
                                                return (
                                                  <li key={i}>{itemText}</li>
                                                );
                                              })}
                                          </ul>
                                        </div>
                                      </div>
                                      <div className="col-lg-8">
                                        <div className="deck_layout">
                                          {deck?.images &&
                                            deck?.images?.length > 0 &&
                                            deck?.images?.map(
                                              (image, imgIndex) => (
                                                <img
                                                  key={imgIndex}
                                                  src={image.href}
                                                  alt={image.name}
                                                  className="img-fluid"
                                                />
                                              )
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              {deckplans.length > itemsToShow && (
                                <div className="text-center mt-3">
                                  <button
                                    className="enquiry_btn"
                                    onClick={() => setShowdeck(!showDeck)}
                                  >
                                    {showDeck ? "Show Less" : "Show More"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-contact"
                            role="tabpanel"
                            aria-labelledby="pills-contact-tab"
                          >
                            <h4>Entertainment</h4>
                            <p className="overview">
                              {removeHTMLTags(entertainmentIntro)}
                            </p>

                            {shipDetails?.entertainment_types &&
                            shipDetails.entertainment_types.length > 0 ? (
                              visibleEnt.map((option, index) => (
                                <div className="dining-option" key={index}>
                                  <b className="overview">{option?.name}</b>
                                  <p
                                    className="overview"
                                    dangerouslySetInnerHTML={{
                                      __html: option.description,
                                    }}
                                  ></p>

                                  {/* Image Gallery */}
                                  {option?.images &&
                                    option.images.length > 0 && (
                                      <div className="accordion-body">
                                        {option.images.map((img, imgIndex) => (
                                          <img
                                            key={imgIndex}
                                            src={img.href}
                                            alt={img.name}
                                            className="img-fluid mb-3"
                                          />
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))
                            ) : (
                              <p>No entertainment options available.</p>
                            )}

                            {/* Show More / Show Less Button */}
                            {shipDetails?.entertainment_types?.length >
                              itemsToShow && (
                              <div className="text-center mt-3">
                                <button
                                  className="enquiry_btn"
                                  onClick={() =>
                                    setShowEntertainment(!showentertainment)
                                  }
                                >
                                  {showentertainment
                                    ? "Show Less"
                                    : "Show More"}
                                </button>
                              </div>
                            )}
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-health"
                            role="tabpanel"
                            aria-labelledby="pills-health-tab"
                          >
                            <h4>Health &amp; fitness</h4>
                            <p className="overview">
                              {removeHTMLTags(healthfitnessinfo)}
                            </p>

                            {shipDetails?.health_fitness_types &&
                            shipDetails.health_fitness_types.length > 0 ? (
                              visiHealth.map((option, index) => (
                                <div className="dining-option" key={index}>
                                  <p className="overview">{option?.name}</p>
                                  <p
                                    className="overview"
                                    dangerouslySetInnerHTML={{
                                      __html: option.description,
                                    }}
                                  ></p>

                                  {/* Image Gallery */}
                                  {option?.images &&
                                    option.images.length > 0 && (
                                      <div className="accordion-body">
                                        {option.images.map((img, imgIndex) => (
                                          <img
                                            key={imgIndex}
                                            src={img.href}
                                            alt={img.name}
                                            className="img-fluid mb-3"
                                          />
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))
                            ) : (
                              <p className="overview">
                                No health & fitness options available.
                              </p>
                            )}

                            {shipDetails?.health_fitness_types?.length >
                              itemsToShow && (
                              <div className="text-center mt-3">
                                <button
                                  className="enquiry_btn"
                                  onClick={() => setShowHealth(!showHealth)}
                                >
                                  {showHealth ? "Show Less" : "Show More"}
                                </button>
                              </div>
                            )}
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-kids"
                            role="tabpanel"
                            aria-labelledby="pills-kids-tab"
                          >
                            <h4>Kids &amp; Fitness</h4>
                            <p className="overview">
                              {removeHTMLTags(kidinfo)}
                            </p>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-profile"
                            role="tabpanel"
                            aria-labelledby="pills-profile-tab"
                          >
                            {visibleOptions.length > 0 &&
                              visibleOptions.map((option, index) => (
                                <div className="dining-option" key={index}>
                                  <b>{option.name}</b>
                                  <p className="overview">
                                    {option.experience}
                                  </p>
                                  <b className="overview">{option.food}</b>
                                  <p
                                    className="overview"
                                    dangerouslySetInnerHTML={{
                                      __html: option.description,
                                    }}
                                  ></p>

                                  {option.images &&
                                    option.images.length > 0 && (
                                      <div className="accordion-body">
                                        {option.images.map((img, imgIndex) => (
                                          <img
                                            key={imgIndex}
                                            src={img.href}
                                            alt={img.name}
                                            className="img-fluid mb-3"
                                          />
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))}

                            {/* Show More / Show Less Button */}
                            {diningOptions.length > itemsToShow && (
                              <div className="text-center mt-3">
                                <button
                                  className="enquiry_btn"
                                  onClick={() => setShowding(!showDing)}
                                >
                                  {showDing ? "Show Less" : "Show More"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-bigship"
                      role="tabpanel"
                      aria-labelledby="nav-bigship-tab"
                    >
                      <div className="tab_info" />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="right_area">
                <div className="text-center">
                  <img
                    src={shipDetails.profile_image_href}
                    className="img-fluid single_img"
                  />
                </div>

                <div className="solo">
                  <div className="pre_person">
                    <button
                      className={`person_active ${
                        activeTab === "tab1" ? "solo_active" : ""
                      }`}
                      onClick={() => setActiveTab("tab1")}
                    >
                      PER PERSON
                    </button>
                    <button
                      className={` ${
                        activeTab === "tab2" ? "solo_active" : ""
                      }`}
                      onClick={() => setActiveTab("tab2")}
                    >
                      SOLO
                    </button>
                  </div>

                  <div className="inside_list">
                    {activeTab === "tab1" ? (
                      <div className="person1">
                        <div className="isd">
                          <div>
                            <img src={c1} className="img-fluid" />
                          </div>
                          <div>
                            <p>INSIDE</p>
                            <p>CALL US</p>
                          </div>
                        </div>
                        <div className="isd">
                          <div>
                            <img src={c2} className="img-fluid" />
                          </div>
                          <div>
                            <p>OUTSIDE</p>
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(shipRefData?.[0]?.outside_price) ? (
                              <p>CALL US</p>
                            ) : (
                              <>
                                <del>WAS £19209pp</del>{" "}
                                <b>
                                  NOW £ {shipRefData?.[0]?.outside_price} PP
                                </b>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="isd">
                          <div>
                            <img src={c3} className="img-fluid" />
                          </div>
                          <div>
                            <p>BALCONY</p>
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(shipRefData?.[0]?.balcony_price) ? (
                              <p>CALL US</p>
                            ) : (
                              <>
                                <del>WAS £19209pp</del>{" "}
                                <b>
                                  NOW £ {shipRefData?.[0]?.balcony_price} PP
                                </b>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="isd">
                          <div>
                            <img src={c4} className="img-fluid" />
                          </div>
                          <div>
                            <p>SUITE</p>
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(shipRefData?.[0]?.suite_price) ? (
                              <p>CALL US</p>
                            ) : (
                              <>
                                <del>WAS £19209pp</del>{" "}
                                <b>NOW £ {shipRefData?.[0]?.suite_price} PP</b>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="personasdsadsad">
                        <div className="isd">
                          <div>
                            <img src={c1} className="img-fluid" />
                          </div>
                          <div>
                            <p>INSIDE</p>
                            <p>CALL US</p>
                          </div>
                        </div>
                        <div className="isd">
                          <div>
                            <img src={c2} className="img-fluid" />
                          </div>
                          <div>
                            <p>OUTSIDE </p>
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(shipRefData?.[0]?.outside_price) ? (
                              <p>CALL US</p>
                            ) : (
                              <>
                                <del>WAS £19209pp</del>{" "}
                                <b>
                                  NOW £ {shipRefData?.[0]?.outside_price} PP
                                </b>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="isd">
                          <div>
                            <img src={c3} className="img-fluid" />
                          </div>
                          <div>
                            <p>BALCONY </p>
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(shipRefData?.[0]?.balcony_price) ? (
                              <p>CALL US</p>
                            ) : (
                              <>
                                <del>WAS £19209pp</del>{" "}
                                <b>
                                  NOW £ {shipRefData?.[0]?.balcony_price} PP
                                </b>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="isd">
                          <div>
                            <img src={c4} className="img-fluid" />
                          </div>
                          <div>
                            <p>SUITE</p>
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(shipRefData?.[0]?.suite_price) ? (
                              <p>CALL US</p>
                            ) : (
                              <>
                                <del>WAS £19209pp</del>{" "}
                                <b>NOW £ {shipRefData?.[0]?.suite_price} PP</b>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="book_c">
                    <h4>Book With Confidence</h4>
                    <img
                      src={ato}
                      className="img-fluid"
                      style={{ width: "60px" }}
                    />
                    <img src={ato1} className="img-fluid" />
                  </div>
                  <div className="book_c">
                    <h4>CONTACT US</h4>
                    <a href="tel:02038842555">0203 884 2555</a>
                    <button
                      onClick={openModal}
                      className="enquiry_btn"
                      style={{ width: "100%", border: "0px" }}
                    >
                      ENQUIRE NOW
                    </button>
                  </div>
                </div>
                <section className="why_inner">
                  <div className="container">
                    <div className="text-center">
                      <h2>Why Book with Holiday2?</h2>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="why_block">
                          <img src={lg} className="img-fluid" />
                          <h3>
                            Exclusive Offers Masterfully Curated by Our
                            Prestigious Product Team
                          </h3>
                          <p>
                            Enjoy privileged access to bespoke deals,
                            thoughtfully designed by our exceptionally
                            experienced travel artisans.
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="why_block">
                          <img src={lg1} className="img-fluid" />
                          <h3>Esteemed UK-Based Sales Consultants</h3>
                          <p>
                            Entrust your voyage to our elite team of seasoned
                            experts, dedicated to tailoring every aspect of your
                            journey.
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="why_block">
                          <img src={lg2} className="img-fluid" />
                          <h3>
                            Unrivalled Financial Security with ATOL Protection
                          </h3>
                          <p>
                            Embark with absolute confidence, assured that your
                            investment is impeccably safeguarded.
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="why_block">
                          <img src={lg3} className="img-fluid" />
                          <h3>
                            Proud Members of CLIA – The Epitome of Cruise
                            Expertise
                          </h3>
                          <p>
                            Benefit from the guidance of certified cruise
                            specialists, recognised for their unparalleled
                            industry insight.
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="why_block">
                          <img src={lg4} className="img-fluid" />
                          <h3>White-Glove CustomeR Care</h3>
                          <p>
                            Delight in seamless, attentive support that ensures
                            an effortless experience from your first inquiry to
                            your final destination.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                {/* <section className="our_expert_con">
                  <h4 className="mb-5">Our Expert Concierge</h4>
                  <div className="exp_con">
                    <div className="exp_phphp">
                      <a href="#">
                        <img src={exp_user} className="img-fluid" />
                      </a>
                    </div>
                    <div className="alx">
                      <div>
                        <h5>Alexandra Beaumont</h5>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. consectetur adipiscing elit.
                        </p>
                      </div>
                      <div>
                        <a href="#">
                          <i className="ri-arrow-right-s-line" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="exp_con">
                    <div className="exp_phphp">
                      <a href="#">
                        <img src={exp_user} className="img-fluid" />
                      </a>
                    </div>
                    <div className="alx">
                      <div>
                        <h5>Alexandra Beaumont</h5>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. consectetur adipiscing elit.
                        </p>
                      </div>
                      <div>
                        <a href="#">
                          <i className="ri-arrow-right-s-line" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="exp_con">
                    <div className="exp_phphp">
                      <a href="#">
                        <img src={exp_user} className="img-fluid" />
                      </a>
                    </div>
                    <div className="alx">
                      <div>
                        <h5>Alexandra Beaumont</h5>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. consectetur adipiscing elit.
                        </p>
                      </div>
                      <div>
                        <a href="#">
                          <i className="ri-arrow-right-s-line" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="exp_con">
                    <div className="exp_phphp">
                      <a href="#">
                        <img src={exp_user} className="img-fluid" />
                      </a>
                    </div>
                    <div className="alx">
                      <div>
                        <h5>Alexandra Beaumont</h5>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. consectetur adipiscing elit.
                        </p>
                      </div>
                      <div>
                        <a href="#">
                          <i className="ri-arrow-right-s-line" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="exp_con">
                    <div className="exp_phphp">
                      <a href="#">
                        <img src={exp_user} className="img-fluid" />
                      </a>
                    </div>
                    <div className="alx">
                      <div>
                        <h5>Alexandra Beaumont</h5>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. consectetur adipiscing elit.
                        </p>
                      </div>
                      <div>
                        <a href="#">
                          <i className="ri-arrow-right-s-line" />
                        </a>
                      </div>
                    </div>
                  </div>
                </section> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="similar_cruises">
        <SimilarCruises  cname={shipRefData?.ship || shipName || shipname}/>
      </section>
      <section className="be_inspired">
        <div className="container">
          <h4>Be inspired</h4>
          <div className="row">
            <div className="col-lg-4 ">
              <div className="beb">
                {images[0] && (
                  <img src={images?.[0]?.href} className="img-fluid" />
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="beb">
                {images[0] && (
                  <img src={images?.[1]?.href} className="img-fluid" />
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="beb">
                {images[0] && (
                  <img src={images?.[2]?.href} className="img-fluid" />
                )}
              </div>
            </div>
          </div>
          <a href="#" className="action_btn mt-3">
            View more
          </a>
        </div>
      </section>
      <section className="new_subscribe">
        <div className="container">
          <h3>Subscribe to the Newsletter</h3>
          <p>Subscribe to our Newsletter for the latest offers and deals!</p>
          <div className="subm">
            <input type="text" name="search" placeholder="Your email address" />
            <input
              type="submit"
              defaultValue="Subscribe"
              className="search_btn2"
            />
          </div>
        </div>
      </section>
      <section className="customer_say">
        <div className="container">
          <h2>What our customers have to say</h2>
          <img src="assets/images/review.png" className="img-fluid" />
        </div>
      </section>
      <ModelEx
        isOpen={isModalOpen}
        onClose={closeModal}
        cruiseItems={cruiseItems}
        shipRefData={shipRefData}
        shipDetails={shipDetails}
      />
    </>
  );
};

export default CruiseDetails;
