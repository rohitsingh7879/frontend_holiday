import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import four_banner from "../assets/images/collection_banner.jpg";
import moon from "../assets/images/icons/moon.png";
import logocolor from "../assets/images/logo-color.png";
import moon3 from "../assets/images/icons/date.png";

import iconship from "../assets/images/icons/ship.png";
import date from "../assets/images/icons/date.png";
import "../assets/css/cruisedeals.css";
import "../assets/css/inner.css";
// import Cruisesearch from "../Component/Cruisesearch";
import axios from "axios";
import Select from "react-select";
import { debounce } from "lodash";
import generateCruiseDetailsUrl from "../utils/DetailsURL";
import moment from "moment";

const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const API_SHIP_BASE_URL = "https://www.widgety.co.uk/api/ships.json";
const API_OPERATOR_BASE_URL = "https://www.widgety.co.uk/api/operators.json";

const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const CruiseDeals = () => {
  const location = useLocation();
  const searchQueryString = location?.state?.searchQueryParams || {};

  const searchQueryParams = Object.fromEntries(
    new URLSearchParams(searchQueryString)
  );
  console.log("searchQueryParams----", searchQueryParams?.operator);
  const [loading, setLoading] = useState(true);
  const [loadingImg, setLoadingImg] = useState(true);

  const [shipDetails, setShipDetails] = useState([]);
  const [cruiseData, setCruiseData] = useState([]);

  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const [totalCruises, setTotalCruises] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [ships, setShips] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cruiseTypes, setCruiseTypes] = useState([]);
  const [cruiseLines, setCruiseLines] = useState([]);
  const [port, setPort] = useState([]);
  const [selectedSortingOption, setSelectedSortingOption] = useState(null);

  const [selectedCruiseType, setSelectedCruiseType] = useState();
  const [selectedCruiseStartDate, setSelectedCruiseStartDate] = useState();
  const [selectedCruiseEndDate, setSelectedCruiseEndDate] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedCruiseLine, setSelectedCruiseLine] = useState();

  const [selectedShips, setSelectedShips] = useState();
  const [selectedPort, setSelectedPort] = useState(null);

  const navigate = useNavigate();
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

  const handleImageLoad = () => {
    setTimeout(() => {
      setLoadingImg(false);
    }, 1000);
  };

  const handleImageError = () => {
    setLoadingImg(false);
  };

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
        // setAllOperatorDetails(result?.data?.operators);
        let uniqueCruiseLines = [
          ...new Set(result?.data?.operators.map((cruise) => cruise.title)),
        ];
        setCruiseLines(
          uniqueCruiseLines.map((line) => ({ value: line, label: line }))
        );
      } else {
        console.log("----error in api----");
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

  const fetchCruiseDealData = async (para1, para2) => {
    try {
      setLoading(true);

      const sselectedCruiseTypeQuery =
        selectedCruiseType?.value || searchQueryParams?.cruise_type || "";

      const selectedCruiseStartDateQuery =
        selectedCruiseStartDate ||
        searchQueryParams?.start_date_range_beginning ||
        "";

      const selectedCruiseEndDateQuery = selectedCruiseEndDate || "";

      const regionQuery = selectedRegion || searchQueryParams?.region || "";

      const cruiseLineQuery =
        selectedCruiseLine?.value || searchQueryParams?.operator || "";

      const shipQuery =
        selectedShips?.value || searchQueryParams?.ship_name || "";

      const portQuery = selectedPort?.value || "";

      const durationQuery = para2 || "";

      const priceQuery = para1 || "";

      let queryParams = new URLSearchParams();

      if (sselectedCruiseTypeQuery) {
        queryParams.append("cruise_type", sselectedCruiseTypeQuery);
      }
      if (selectedCruiseStartDateQuery) {
        queryParams.append(
          "start_date_range_beginning",
          selectedCruiseStartDateQuery
        );
      }
      if (selectedCruiseEndDateQuery) {
        queryParams.append("start_date_range_end", selectedCruiseEndDate);
      }

      if (cruiseLineQuery) {
        queryParams.append("operator", cruiseLineQuery);
      }

      if (shipQuery) {
        queryParams.append("ship_name", shipQuery);
      }
      if (regionQuery) {
        queryParams.append("region", regionQuery);
      }

      if (portQuery) {
        queryParams.append("start_from", portQuery);
      }

      if (durationQuery) {
        queryParams.append("cruise_nights", durationQuery);
      }

      if (priceQuery) {
        queryParams.append("maxPrice", priceQuery);
      }

      // console.log([regionQuery],'888')
      const response = await fetch(
        `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&page=${currentPage}&limit=${itemsPerPage}&${queryParams?.toString()}`,
        { headers: { Accept: "application/json;api_version=2" } }
      );

      const getregions = await response.json();

      if (getregions && getregions.total > 0) {
        setTotalCruises(getregions.total);
      }

      if (getregions && getregions?.cruises?.length > 0) {
        const cruisedataResult = getregions?.cruises?.map((cruise) => ({
          shipurl: cruise.ship,
          shipname: cruise.ship_title,
          oprator_name: cruise.operator_title,
          opid: cruise.operator,
          name: cruise.name,
          starts_at: cruise.starts_at,
          ref: cruise.ref,
          price: cruise.cruise_only_price,
          date: cruise.starts_on,
          night: cruise.cruise_nights,
          dec: cruise.description,
          day: cruise.vacation_days,
          airport: cruise.airports,
          suite_price: cruise.suite_price,
          outside_price: cruise.outside_price,
          balcony_price: cruise.balcony_price,
          inside_price: cruise.inside_price,
          travel_type: cruise.travel_type,
          region: cruise.region,
        }));

        if (currentPage > 1) {
          setCruiseData((prevData) => [...prevData, ...cruisedataResult]);
        } else {
          setCruiseData(cruisedataResult);
        }

        const shipPromises = cruisedataResult?.map((cruise) =>
          fetchShipdata(
            cruise?.shipurl,
            cruise?.shipname,
            cruise?.price,
            cruise?.ref,
            cruise?.date
          )
        );

        const portPromises = cruisedataResult.map((cruise) =>
          fetchPortDetails(cruise?.ref)
        );

        await Promise.all([...shipPromises, ...portPromises]);

        setLoading(false);
      } else {
        setCruiseData([]);
        setShipDetails([]);
        setTotalCruises(0);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      console.error("Error fetching region data:", error);
    }
  };

  const fetchShipdata = async (shipurl, shipname, para3, ref, date) => {
    try {
      const response = await fetch(
        `${shipurl}?app_id=${APP_ID}&token=${TOKEN}`,
        {
          headers: {
            Accept: "application/json;api_version=2",
          },
        }
      );
      const shipDetail = await response.json();

      const coverImage = shipDetail?.cover_image_href;
      const profileImage = shipDetail?.profile_image_href;
      const price = para3;

      const newDetails = {
        shipname,
        profileImage,
        coverImage,
        price,
        id: ref,
        date,
      };

      setShipDetails((prevDetails) => {
        const isDuplicate = prevDetails?.some(
          (prevItem) => prevItem?.id === newDetails?.id
        );

        return isDuplicate ? prevDetails : [...prevDetails, newDetails];
      });

      // setShipDetails((prevDetails) => [
      //   ...prevDetails,
      //   { shipname, profileImage, coverImage, price },
      // ]);
    } catch (error) {
      console.error("Error fetching ship details:", error);
    }
  };

  const fetchPortDetails = async (ref) => {
    try {
      const shipUrl = `https://www.widgety.co.uk/api/cruises/${ref}/port_visits.json`;

      const response = await fetch(
        `${shipUrl}?app_id=${APP_ID}&token=${TOKEN}`,
        {
          headers: {
            Accept: "application/json; api_version=2",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ship details: ${response.statusText}`);
      }

      const portdata = await response.json();
      // console.log("Port Data:", portdata);
      if (portdata) {
        setCruiseData((prevDetails) =>
          prevDetails.map((ship) =>
            ship.ref === ref
              ? {
                  ...ship,
                  portData: portdata,
                }
              : ship
          )
        );
      }
    } catch (error) {
      console.error("Error fetching ship details:", error);
    }
  };

  useEffect(() => {
    const sselectedCruiseTypeQuery = selectedCruiseType?.value || "";
    const selectedCruiseStartDateQuery = selectedCruiseStartDate || "";
    const selectedCruiseEndDateQuery = selectedCruiseEndDate || "";
    const selectedRegionQuery = selectedRegion?.value || "";
    const cruiseLineQuery = selectedCruiseLine?.value || "";
    const shipQuery = selectedShips?.value || "";
    const portQuery = selectedPort?.value || "";
    const durationQuery = duration || "";
    const priceQuery = price || "";

    if (
      sselectedCruiseTypeQuery ||
      selectedCruiseStartDateQuery ||
      selectedCruiseEndDateQuery ||
      selectedRegionQuery ||
      cruiseLineQuery ||
      shipQuery ||
      portQuery ||
      durationQuery ||
      priceQuery
    ) {
      if (currentPage === 1) {
        setCruiseData([]);
        setShipDetails([]);
      }
    }
    setLoading(true);
    debounceApiCall(price, duration);
  }, [
    currentPage,
    selectedCruiseType,
    selectedCruiseStartDate,
    selectedCruiseEndDate,
    selectedRegion,
    selectedCruiseLine,
    selectedShips,
    selectedPort,
  ]);

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
      (words?.split(" ")?.length === strippedDescription?.split(" ")?.length
        ? ""
        : "...")
    );
  };

  // if (!results || results.length === 0) {
  //   console.error("No cruises found");
  //   return null;
  // }
  const debounceApiCall = debounce((price, duration) => {
    fetchCruiseDealData(price, duration);
  }, 1000);

  const handleDurationChange = (event) => {
    setCurrentPage(1);
    setTotalCruises();
    setShipDetails([]);
    setCruiseData([]);
    setLoading(true);
    setDuration(event.target.value);
    debounceApiCall(price, event.target.value);
  };

  const handlePriceChange = (event) => {
    setCurrentPage(1);
    setTotalCruises();
    setShipDetails([]);
    setCruiseData([]);
    setLoading(true);
    setPrice(event.target.value);
    debounceApiCall(event.target.value, duration);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setShipDetails([]);
    setCruiseData([]);
    setCurrentPage(1);
    setSelectedCruiseType("");
    setSelectedCruiseStartDate("");
    setSelectedCruiseEndDate("");
    setSelectedRegion("");
    setSelectedCruiseLine("");
    setSelectedShips("");
    setSelectedPort("");
    setDuration(0);
    setPrice(0);
    setSelectedSortingOption("");
    // fetchAllCruiseLineData();
  };

  const handleRefClick = (ref, ship, cruise) => {
    const resultRefData = cruiseData?.filter((item) => item.ref == ref);

    const url = generateCruiseDetailsUrl("cruise-details", cruise, ship);
    navigate(url, {
      state: { shipRefData: resultRefData },
    });
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
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

      {/* <Cruisesearch /> */}
      <section className="cruise_dest">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              {/* Filter section */}
              <form action="" className="scroll_form" id="style-1">
                <div className="ship_left_area">
                  <div className="button1">
                    <h4>
                      CRUISE TYPE <i className="ri-arrow-down-s-line" />
                    </h4>
                    <div className="mydiv">
                      <Select
                        options={cruiseTypes}
                        value={selectedCruiseType}
                        onChange={setSelectedCruiseType}
                        placeholder="Select Cruise Line"
                      />
                    </div>
                  </div>
                  <div className="button1">
                    <h4>
                      DEPARTURE START DATE{" "}
                      {/* <i className="ri-arrow-down-s-line" /> */}
                    </h4>
                    <div className="mydiv">
                      {/* <Select
                                  options={cruiseDate}
                                  value={selectedCruiseStartDate}
                                  onChange={setSelectedCruiseStartDate}
                                  placeholder="Select Date"
                                  className="select_area"
                                  classNamePrefix="select_area"
                                /> */}
                      <input
                        type="date"
                        className="form-control"
                        onChange={(e) =>
                          setSelectedCruiseStartDate(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="button1">
                    <h4>
                      DEPARTURE END DATE
                      {/* <i className="ri-arrow-down-s-line" /> */}
                    </h4>
                    <div className="mydiv">
                      <input
                        type="date"
                        className="form-control"
                        min={selectedCruiseStartDate}
                        disabled={!selectedCruiseStartDate}
                        onChange={(e) =>
                          setSelectedCruiseEndDate(e.target.value)
                        }
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
                        value={selectedRegion}
                        onChange={setSelectedRegion}
                        placeholder="Select Cruise Line"
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
                  {selectedCruiseType?.value ||
                  selectedCruiseStartDate ||
                  selectedCruiseEndDate ||
                  selectedRegion?.value ||
                  selectedCruiseLine?.value ||
                  selectedShips?.value ||
                  selectedPort?.value ||
                  duration ||
                  price ? (
                    <div className="text-end">
                      <a
                        href="#"
                        className="action_btn"
                        onClick={(e) => handleReset(e)}
                      >
                        Reset
                      </a>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </form>
            </div>
            <div className="col-lg-9">
              <div className="cruise_info">
                <div className="cruise_result">
                  Showing: {totalCruises} Cruises
                </div>
                <div className="cruise_drop">
                  <Select
                    value={selectedSortingOption}
                    onChange={(selected) => {
                      // setCurrentPage(1);
                      setSelectedSortingOption(selected);
                    }}
                    options={sortingOptions}
                    placeholder="Recommended"
                    className="select_rec"
                  />
                </div>
              </div>
              {shipDetails?.length > 0 ? (
                <>
                  {shipDetails
                    ?.sort((a, b) => {
                      if (
                        selectedSortingOption?.value === "high_to_low" ||
                        selectedSortingOption?.value === "low_to_high"
                      ) {
                        return selectedSortingOption?.value === "high_to_low"
                          ? b?.price - a?.price
                          : a?.price - b?.price;
                      } else if (
                        selectedSortingOption?.value === "departure_soonest" ||
                        selectedSortingOption?.value === "departure_furthest"
                      ) {
                        const aDate = new Date(a?.date);
                        const bDate = new Date(b?.date);
                        if (
                          selectedSortingOption?.value === "departure_soonest"
                        ) {
                          return aDate - bDate;
                        } else if (
                          selectedSortingOption?.value === "departure_furthest"
                        ) {
                          return bDate - aDate;
                        }
                      }
                    })

                    ?.map((ship, index) => {
                      const cruise = cruiseData?.find(
                        (cruiseItem) =>
                          cruiseItem?.id === ship?.id ||
                          cruiseItem?.ref === ship?.id
                      );

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
                                  src={ship?.coverImage}
                                  className={`img-fluid ${
                                    loadingImg ? "invisible" : "visible"
                                  }`}
                                  onLoad={handleImageLoad}
                                  onError={handleImageError}
                                  alt={ship?.shipname}
                                  loading="lazy"
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
                                          />
                                        </div>
                                        <div>
                                          <p>Ship</p>
                                          <span>{ship?.shipname}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-3 col-4 pright_zeo">
                                      <div className="ship_ssd">
                                        <div>
                                          <img
                                            src={date}
                                            className="img-fluid"
                                          />
                                        </div>
                                        <div>
                                          <p>Date</p>
                                          <span>
                                            {cruise?.date
                                              ? new Date(
                                                  cruise?.date
                                                ).toLocaleDateString("en-GB", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                })
                                              : cruise?.general_Start
                                              ? moment
                                                  .unix(cruise?.general_Start)
                                                  .format("DD MMM YYYY")
                                              : "N/A"}
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
                                          />
                                        </div>
                                        <div>
                                          <p>Duration</p>
                                          <span>
                                            {cruise
                                              ? `${
                                                  cruise?.night ||
                                                  cruise?.cruise_nights
                                                } nights`
                                              : "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-lg-3 col-4 text-center pright_zeo">
                                      <img
                                        src={
                                          ship?.profileImage ||
                                          "default-image.jpg"
                                        }
                                        className=" ship_mini_logo"
                                        alt={ship?.shipname}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="dieds">{cruise?.name}</div>
                                <div className="dieds line_h15">
                                  <span className="d-flex justify-content-left gap-3 align-items-center">
                                    <img src={iconship} className="img-fluid" />{" "}
                                    {cruise?.portData &&
                                      cruise?.portData?.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2">
                                          {cruise?.portData
                                            ?.slice(0, 5)
                                            ?.sort((a, b) =>
                                              a?.port?.name?.localeCompare(
                                                b?.port?.name
                                              )
                                            )
                                            ?.map((port, portIndex) => (
                                              <div key={portIndex} className="">
                                                <div className="">
                                                  {`${
                                                    port?.port?.name + " | "
                                                  }` || "N/A"}
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                  </span>
                                </div>
                                <div className="curise_des_area">
                                  {" "}
                                  {cruise?.summary ? (
                                    cruise?.summary
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
                                                text.trim().split(" ").length >
                                                30
                                                  ? "..."
                                                  : ""
                                              }`,
                                            }}
                                          />
                                        );
                                      })
                                  ) : (
                                    // <div>N/A</div>
                                    <></>
                                  )}
                                </div>
                                {cruise?.description && (
                                  <div className="curise_des_area">
                                    {getLimitedDescription(cruise?.description)}
                                  </div>
                                )}
                                <div className="row align-items-center mt-3">
                                  <div className="col-lg-7">
                                    <div className="cck">
                                      <ul>
                                        <li>
                                          <img
                                            src={moon3}
                                            className="img-fluid"
                                          />{" "}
                                          {`${
                                            cruise?.night ||
                                            cruise?.cruise_nights
                                          } nights`}
                                          {"-"}
                                          {cruise?.date &&
                                            formatDate(cruise?.date)}
                                        </li>
                                        {cruise?.vacation_days && (
                                          <li>
                                            <img
                                              src={moon3}
                                              className="img-fluid"
                                            />{" "}
                                            {cruise?.vacation_days
                                              ? `${cruise?.vacation_days} Days`
                                              : ""}{" "}
                                            -{" "}
                                            {cruise?.starts_on
                                              ? formatDate(cruise?.starts_on)
                                              : ""}
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="col-lg-5">
                                    <div className="curise_amount ">
                                      {
                                        <>
                                          <div className="final_price ">
                                            {[
                                              "",
                                              null,
                                              undefined,
                                              0,
                                              "0",
                                              "0.00",
                                              "000",
                                            ].includes(
                                              cruise?.price ||
                                                cruise?.priceStartFrom
                                            ) ? (
                                              <span>CALL US</span>
                                            ) : (
                                              <>
                                                £
                                                {cruise?.price ||
                                                  cruise?.priceStartFrom}
                                                pp
                                              </>
                                            )}
                                          </div>
                                          <div>
                                            <Link
                                              className="action_btn"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleRefClick(
                                                  cruise?.ref,
                                                  ship,
                                                  cruise
                                                );
                                              }}
                                            >
                                              View Deal
                                            </Link>
                                          </div>
                                        </>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </>
              ) : !shipDetails?.length && loading ? (
                <div className="d-flex justify-content-center align-items-center h-25">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : shipDetails?.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center ">
                  No data available
                </div>
              ) : (
                <>
                  {" "}
                  <div
                    className="d-flex justify-content-center align-items-center "
                    style={{
                      minHeight: "70dvh",
                    }}
                  >
                    <div
                      className="spinner-border text-secondary"
                      role="status"
                    >
                      <span className="sr-only"></span>
                    </div>
                  </div>
                </>
              )}

              {shipDetails?.length && shipDetails?.length < totalCruises ? (
                <div className="load_more_area">
                  {!loading ? (
                    <button
                      className="btn text-white"
                      style={{
                        backgroundColor: "#a8783d",
                      }}
                      onClick={() => handleLoadMore()}
                    >
                      Load More
                    </button>
                  ) : (
                    <button
                      style={{
                        backgroundColor: "#a8783d",
                      }}
                      className="btn "
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span className="sr-only">Loading...</span>
                    </button>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CruiseDeals;
