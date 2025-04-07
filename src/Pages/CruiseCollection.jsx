import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import banner from "../assets/images/collection_banner.jpg";
import bannerlogo from "../assets/images/logo-color.png";
import Cruisesearch from "../Component/Cruisesearch";
import iconship from "../assets/images/icons/ship.png";
import date from "../assets/images/icons/date.png";
import moon from "../assets/images/icons/moon.png";
import Customersay from "../Component/Customersay";
import bg1 from "../assets/images/be1.png";
import bg2 from "../assets/images/be2.png";
import Select from "react-select";
import axios from "axios";
import endpoints from "../utils/endpoints";
import generateCruiseDetailsUrl from "../utils/DetailsURL";
import '../assets/css/inner.css'
import '../App.css'

const CruiseCollection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categories = queryParams.get("categories");
  //console.log("Footer yr", year);

  const [category, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [cruiseTypes, setCruiseTypes] = useState([]);
  const [cruiseDate, setCruiseDate] = useState([]);
  const [regions, setRegions] = useState([]);
  const [ships, setShips] = useState([]);
  const [allOperatorDetails, setAllOperatorDetails] = useState([]);
  const [cruiseLines, setCruiseLines] = useState([]);
  const [port, setPort] = useState([]);
  const [cruiseCategory, setCruiseCategory] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState(null);
  const [selectedCruiseDate, setSelectedCruiseDate] = useState(null);
  const [selectedCruiseLine, setSelectedCruiseLine] = useState(null);
  const [selectedShips, setSelectedShips] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const [selectedSortingOption, setSelectedSortingOption] = useState(null);
  const [spinner, setSpinner] = useState(true);

  const sortingOptions = [
    { value: "", label: "Recommended" },
    { value: "low_to_high", label: "Price (Low to High)" },
    { value: "high_to_low", label: "Price (High to Low)" },
    {
      value: "departure_soonest",
      label: "Departure Date (Soonest First)",
    },
    {
      value: "departure_furthest",
      label: "Departure Date (Furthest First)",
    },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAllCruiseLineData = async () => {
    fetch(`${import.meta.env.VITE_API_URL + endpoints?.newpackage}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setSpinner(false);
        setData(data?.data);
        setTotalCount(data.data.length);
        //console.log("Ser", data.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError(error);
        setSpinner(false);
      });
  };
  useEffect(() => {
    if (categories) {
      return;
    }
    fetchAllCruiseLineData();
  }, []);
  
  const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
  const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
  const TOKEN =
    "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";
  const API_SHIP_BASE_URL = "https://www.widgety.co.uk/api/ships.json";
  const API_OPERATOR_BASE_URL = "https://www.widgety.co.uk/api/operators.json";

  const fetchShipAllList = async () => {
    try {
      let result = await axios.get(
        `${API_SHIP_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=100`,
        {
          headers: {
            Accept: "application/json;api_version=2",
          },
        }
      );

      const uniqueShips = [
        ...new Set(result?.data?.ships.map((ship) => ship.title)),
      ];
      setShips(uniqueShips.map((ship) => ({ value: ship, label: ship })));
    } catch (error) {
      console.log("----error ship ----", error);
    }
  };

  const fetchOperatorAllList = async () => {
    try {
      let result = await axios.get(
        `${API_OPERATOR_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=100`,
        {
          headers: {
            Accept: "application/json;api_version=2",
          },
        }
      );

      if (result && result.status == 200) {
        // console.log("--result?.data?.operators--",result?.data?.operators);
        setAllOperatorDetails(result?.data?.operators);
        const uniqueCruiseLines = [
          ...new Set(result?.data?.operators.map((cruise) => cruise.title)),
        ];
        setCruiseLines(
          uniqueCruiseLines.map((line) => ({ value: line, label: line }))
        );
      } else {
        console.log("----error in api----", error);
      }
    } catch (error) {
      console.log("----error ----", error);
    }
  };

  const fetchCruiseTypes = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=400`,
        { headers: { Accept: "application/json;api_version=2" } }
      );
      const result = await response.json();
      // console.log("--- result Azhar-----", result);
      // unique cruise Types
      const uniqueCruiseTypes = [
        ...new Set(result?.cruises?.flatMap((cruise) => cruise.cruise_type)),
      ];
      setCruiseTypes(
        uniqueCruiseTypes?.map((type) => ({ value: type, label: type }))
      );
      // unique Dates
      const uniqueDates = [
        ...new Set(result?.cruises.map((cruise) => cruise.starts_on)),
      ];
      const formattedDates = uniqueDates.map((date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const monthName = dateObj.toLocaleString("default", { month: "long" });
        const year = dateObj.getFullYear();
        return {
          value: `${day} ${monthName} ${year}`,
          label: ` ${monthName} ${year}`,
        };
      });

      setCruiseDate(formattedDates);

      const uniqueRegions = [
        ...new Set(result?.cruises.flatMap((cruise) => cruise.regions)),
      ];
      setRegions(
        uniqueRegions?.map((region) => ({ value: region, label: region }))
      );
      const uniquePort = [
        ...new Set(result?.cruises?.flatMap((cruise) => cruise.starts_at)),
      ];
      setPort(uniquePort?.map((port) => ({ value: port, label: port })));
    } catch (error) {
      console.error("Error fetching cruise types:", error);
    }
  };
  // Fetch cruise types
  useEffect(() => {
    fetchCruiseTypes();
    fetchShipAllList();
    fetchOperatorAllList();
  }, []);

  const handleCheckboxChange = (value) => {
    setCruiseCategory((prevCategories) =>
      prevCategories.includes(value)
        ? prevCategories.filter((item) => item !== value)
        : [...prevCategories, value]
    );
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  //console.log("-- selectedCruiseDate---", selectedCruiseDate);
  const searchSideBarCruises = async () => {
    try {
      const cruiseCategoryQuery = cruiseCategory || [];
      const selectedCruiseDateQuery = selectedCruiseDate?.value || "";
      const cruiseLineQuery = selectedCruiseLine?.value || "";
      const regionQuery = selectedRegions?.value || "";
      const shipQuery = selectedShips?.value || "";
      const portQuery = selectedPort?.value || "";
      const durationQuery = duration || "";
      const priceQuery = price || "";
      const sortingQuery = selectedSortingOption?.value || "";
      let queryParams = new URLSearchParams({
        cruise_category: JSON.stringify(cruiseCategoryQuery),
        departure_month: selectedCruiseDateQuery,
        destination: regionQuery,
        cruise_line: cruiseLineQuery,
        cruise_ship: shipQuery,
        ports: portQuery,
        duration: durationQuery,
        price_range: priceQuery,
        recommended: sortingQuery,
      });

      if (
        !cruiseCategoryQuery &&
        !selectedCruiseDateQuery &&
        !cruiseLineQuery &&
        !regionQuery &&
        !shipQuery &&
        !portQuery &&
        !durationQuery &&
        !priceQuery &&
        !sortingQuery
      ) {
        return;
      }
      // console.log("---stungnff--",queryParams.toString());
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL + endpoints?.newpackage
        }searchFilter?${queryParams.toString()}`
      );
      //console.log("--- response dddd---",response);
      if (response && response.status == 200) {
        setSpinner(false);
        setData(response?.data?.data);
        setTotalCount(response?.data?.data.length);
      } else {
        setSpinner(false);
        console.error("Error searching cruises:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error searching cruises:", error);
    }
  };

  useEffect(() => {
    searchSideBarCruises();
  }, [
    cruiseCategory,
    selectedCruiseDate,
    selectedCruiseLine,
    selectedRegions,
    selectedShips,
    selectedPort,
    duration,
    price,
    selectedSortingOption,
  ]);

  useEffect(() => {
    if (!categories) {
      return;
    }

    setCruiseCategory([categories]);
  }, [categories]);
  //console.log("CruiseCategory" , cruiseCategory)
  const handleReset = async (e) => {
    e.preventDefault();
    setCruiseCategory([]);
    setSelectedRegions("");
    setSelectedCruiseDate("");
    setSelectedCruiseLine("");
    setSelectedShips("");
    setSelectedPort("");
    setDuration("");
    setPrice("");
    setSelectedSortingOption("");
    fetchAllCruiseLineData();
  };

  const [visibleCount, setVisibleCount] = useState(5);

  const handleSeeMore = (event) => {
    event.preventDefault();

    if (visibleCount === 5) {
      setVisibleCount(filters.length);
    } else {
      setVisibleCount(5);
    }
  };

  const fetchAllCategory = async () => {
    fetch(`${import.meta.env.VITE_API_URL + endpoints?.newCategory}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  const filters = category.map((cat) => ({
    value: cat.categoryName,
    label: cat.categoryName,
  }));
  return (
    <>
      <section className="banner banner_c">
        <div
          id="demo"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#demo"
              data-bs-slide-to={0}
              className="active"
            />
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={banner}
                alt="Collection"
                className="d-block"
                style={{ width: "100%" }}
              />
              <div className="bg-overlay22" />
              <div className="carousel-caption">
                <p>
                  <img src={bannerlogo} className="img-fluid logo_d" />
                </p>
                <h3>Hand Picked Cruise Collection</h3>
                <p className="bodk">
                  <span>
                    Discover an exquisite collection of bespoke cruise packages
                  </span>
                </p>
                <small>
                  Showcasing all-inclusive indulgence and exclusive privileges,
                  curated by our product
                  <br /> team with over 50 years of combined expertise in luxury
                  cruise travel.
                </small>
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
              <form className="scroll_form" id="style-1">
                <div className="ship_left_area">
                  <div className="button1">
                    <h4>
                      CRUISE CATEGORY <i className="ri-arrow-down-s-line" />
                    </h4>
                    <div className="mydiv">
                      <ul>
                        {filters.slice(0, visibleCount).map((filter, index) => (
                          <li key={index}>
                            <input
                              type="checkbox"
                              checked={cruiseCategory.includes(filter.value)}
                              onChange={() =>
                                handleCheckboxChange(filter.value)
                              }
                            />{" "}
                            {filter.label}
                          </li>
                        ))}
                      </ul>

                      {filters.length > 5 && (
                        <button
                          className="action_btn_cat"
                          onClick={handleSeeMore}
                        >
                          {visibleCount === 5 ? "See More" : "See Less"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="button1">
                    <h4>
                      DEPARTURE MONTH <i className="ri-arrow-down-s-line" />
                    </h4>
                    <div className="mydiv">
                      {/* <select className="select_area">
                        <option>Departure</option>
                        <option>Departure</option>
                      </select> */}
                      <Select
                        options={cruiseDate}
                        value={selectedCruiseDate}
                        onChange={setSelectedCruiseDate}
                        placeholder="Select Date"
                        className="select_area"
                        classNamePrefix="select_area"
                      />
                    </div>
                  </div>
                  <div className="button1">
                    <h4>
                      Destination <i className="ri-arrow-down-s-line" />
                    </h4>
                    <div className="mydiv">
                      <Select
                        options={regions}
                        value={selectedRegions}
                        onChange={setSelectedRegions}
                        placeholder="Select Destination"
                        className="select_area "
                        classNamePrefix="select_area"
                      />
                    </div>
                  </div>
                  <div className="button1">
                    <h4>
                      Cruise Line <i className="ri-arrow-down-s-line" />
                    </h4>
                    <div className="mydiv">
                      <Select
                        options={cruiseLines}
                        value={selectedCruiseLine}
                        onChange={setSelectedCruiseLine}
                        placeholder="Select Cruise Line"
                      />
                    </div>
                  </div>
                  <div className="button1">
                    <h4>
                      CRUISE SHIP <i className="ri-arrow-down-s-line" />
                    </h4>
                    <div className="mydiv">
                      <Select
                        options={ships}
                        value={selectedShips}
                        onChange={setSelectedShips}
                        placeholder="Select Ship"
                      />
                    </div>
                  </div>
                  <div className="button1 border_none">
                    <h4>
                      ports <i className="ri-arrow-down-s-line" />
                    </h4>
                    <div className="mydiv">
                      <Select
                        options={port}
                        value={selectedPort}
                        onChange={setSelectedPort}
                        placeholder="Select Port"
                      />
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
                          value={duration}
                          onChange={handleDurationChange}
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
                          value={duration}
                          onChange={handleDurationChange}
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
                          value={price}
                          onChange={handlePriceChange}
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
                          value={price}
                          onChange={handlePriceChange}
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
                    <a
                      href="javascript:void(0)"
                      className="action_btn"
                      onClick={(e) => handleReset(e)}
                    >
                      Reset
                    </a>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-9">
              <div className="cruise_info">
                <div className="cruise_result">
                  Showing: {totalCount} Cruises
                </div>
                <div className="cruise_drop">
                  {/* <select>
                    <option>Recommended</option>
                    <option>Price (Low to High)</option>
                    <option>Price (High to Low)</option>
                    <option>Departure Date (Soonest First)</option>
                    <option>Departure Date (Furthest First)</option>
                  </select> */}
                  <Select
                    value={selectedSortingOption}
                    onChange={setSelectedSortingOption}
                    options={sortingOptions}
                    placeholder="Recommended"
                    className="select_rec"
                  />
                </div>
              </div>
              {data?.length > 0 ? (
                data
                  ?.sort((a, b) => {
                    if (
                      selectedSortingOption?.value === "high_to_low" ||
                      selectedSortingOption?.value === "low_to_high"
                    ) {
                      return selectedSortingOption?.value === "high_to_low"
                        ? b?.priceStartFrom - a?.priceStartFrom
                        : a?.priceStartFrom - b?.priceStartFrom;
                    } else if (
                      selectedSortingOption?.value === "departure_soonest" ||
                      selectedSortingOption?.value === "departure_furthest"
                    ) {
                      return selectedSortingOption?.value ===
                        "departure_soonest"
                        ? new Date(a?.itinerary?.[0]?.check_in_date * 1000) -
                            new Date(b?.itinerary?.[0]?.check_in_date * 1000)
                        : new Date(b?.itinerary?.[0]?.check_in_date * 1000) -
                            new Date(a?.itinerary?.[0]?.check_in_date * 1000);
                    }

                    return 0;
                  })
                  .map((item, index) => (
                    <div className="criuse_list" key={index}>
                      <div className="row" key={index}>
                        <div className="col-lg-4">
                          <div className="cri_pic">
                            {/* Dynamic Ship Image */}
                            <img
                              src={item?.cruise_image}
                              className="img-fluid"
                              alt="Ship"
                            />

                            <div className="wish_list">
                              <a>
                                <i className="ri-heart-3-line" />
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-8 p-0">
                          <div className="cri_info">
                            <div className="top_area_ship">
                              <div className="row">
                                <div className="col-lg-3 pright_zeo">
                                  <div className="ship_ssd m20">
                                    <div>
                                      <img
                                        src={iconship}
                                        className="img-fluid"
                                        alt="Ship Icon"
                                      />
                                    </div>
                                    <div>
                                      <p>Ship</p>
                                      <span>
                                        {" "}
                                        {item?.ship ? item?.ship : "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-4 pright_zeo">
                                  <div className="ship_ssd">
                                    <div>
                                      <img
                                        src={date}
                                        className="img-fluid"
                                        alt="Date Icon"
                                      />
                                    </div>
                                    <div>
                                      <p>Date</p>
                                      <span>
                                        {item?.itinerary
                                          ?.slice(0, 1)
                                          .map((itineraryItem, index) => (
                                            <span key={index}>
                                              {itineraryItem.check_in_date
                                                ? moment
                                                    .unix(
                                                      itineraryItem.check_in_date
                                                    )
                                                    .format("DD MMM YYYY")
                                                : ""}
                                            </span>
                                          ))}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-4 pright_zeo">
                                  <div className="ship_ssd">
                                    <div>
                                      <img
                                        src={moon}
                                        className="img-fluid"
                                        alt="Duration Icon"
                                      />
                                    </div>
                                    <div>
                                      <p>Duration</p>
                                      <span>
                                        {" "}
                                        {item?.itinerary
                                          ?.slice(-1)
                                          .map((itineraryItem, index) => (
                                            <span key={index}>
                                              {itineraryItem.day}
                                            </span>
                                          ))}{" "}
                                        Nights
                                      </span>{" "}
                                      {/* Dynamic Duration */}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-4 text-center pright_zeo">
                                  <img
                                    src={item?.mobile_cruise_banner_image}
                                    className="img-fluid ss_logo"
                                    alt="Logo"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="dieds">
                              {item.name
                                ? item?.name.split(" ").slice(0, 14).join(" ") +
                                  (item?.name.split(" ").length > 14
                                    ? "..."
                                    : "")
                                : "N/A"}
                            </div>
                            <div className="dieds line_h15">
                              <span>
                                <img
                                  src={iconship}
                                  className="img-fluid"
                                  alt="ship icon"
                                />{" "}
                                {item.itinerary
                                  .slice(0, 5)
                                  ?.sort((a, b) =>
                                    a?.port?.localeCompare(b?.port)
                                  )
                                  .map((itineraryItem, index) => (
                                    <span key={index}>
                                      {itineraryItem?.port}
                                      {index < 4 ? ", " : ""}
                                    </span>
                                  ))}
                              </span>
                            </div>
                            <div className="curise_des_area">
                              {item?.summary ? (
                                item?.summary
                                  ?.split("•")
                                  .filter((text) => text.trim() !== "")
                                  .map((text, index) => {
                                    const limitedText = text
                                      .trim()
                                      .split(" ")
                                      .slice(0, 30)
                                      .join(" ");
                                    return (
                                      <div
                                        className="dc"
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                          __html: `${limitedText}${
                                            text.trim().split(" ").length > 30
                                              ? "..."
                                              : ""
                                          }`,
                                        }}
                                      />
                                    );
                                  })
                              ) : (
                                <div>N/A</div>
                              )}
                            </div>
                            <div className="row align-items-center mt-3">
                              <div className="col-lg-6">
                                <div className="cck">
                                  <ul>
                                    <li>
                                      <img
                                        src={date}
                                        className="img-fluid"
                                        alt="Date Icon"
                                      />{" "}
                                      <span>
                                        {item?.itinerary
                                          ?.slice(0, 1)
                                          .map((itineraryItem, index) => (
                                            <span key={index}>
                                              {itineraryItem.check_in_date
                                                ? moment
                                                    .unix(
                                                      itineraryItem.check_in_date
                                                    )
                                                    .format("DD MMM YYYY")
                                                : ""}
                                            </span>
                                          ))}
                                      </span>
                                    </li>
                                    <li>
                                      <img
                                        src={date}
                                        className="img-fluid"
                                        alt="Date Icon"
                                      />{" "}
                                      <span>
                                        {item?.itinerary
                                          ?.slice(-1)
                                          .map((itineraryItem, index) => (
                                            <span key={index}>
                                              {itineraryItem.check_in_date
                                                ? moment
                                                    .unix(
                                                      itineraryItem.check_in_date
                                                    )
                                                    .format("DD MMM YYYY")
                                                : ""}
                                            </span>
                                          ))}
                                      </span>
                                    </li>{" "}
                                    {/* Dynamic */}
                                  </ul>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="curise_amount">
                                  <div className="final_price">
                                    £
                                    {item?.priceStartFrom
                                      ? item.priceStartFrom
                                      : 0}
                                    pp
                                  </div>{" "}
                                  {/* Dynamic Price */}
                                  <div>
                                    <Link
                                      // to={`/Newcruisesdetails/${item._id
                                      //   ?.replace(/\s+/g, "-")
                                      //   .toLowerCase()}`}
                                      to={generateCruiseDetailsUrl(
                                        "new-cruise-details",
                                        item
                                      )}
                                      className="action_btn"
                                    >
                                      View Deal
                                    </Link>
                                  </div>{" "}
                                  {/* Static */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : !data?.length && spinner ? (
                <div className="d-flex justify-content-center align-items-center h-25">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : (
                <div className="d-flex text-center">No Data Available</div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="be_inspired">
        <div className="container">
          <h4>Be inspired</h4>
          <div className="row">
            <div className="col-lg-4">
              <div className="beb">
                <img src={bg1} className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="beb">
                <img src={bg2} className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="beb">
                <img src={bg1} className="img-fluid" />
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
      <Customersay />
    </>
  );
};

export default CruiseCollection;
