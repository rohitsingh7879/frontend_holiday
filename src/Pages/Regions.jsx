import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

import "../assets/css/inner.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import iconship from "../assets/images/icons/ship.png";
import date from "../assets/images/icons/date.png";
import moon from "../assets/images/icons/moon.png";
import banner1 from "../assets/images/banner1.jpg";
import banner2 from "../assets/images/banner2.jpg";
import banner3 from "../assets/images/banner3.jpg";
import Cruisesearch from "../Component/Cruisesearch";
import Customersay from "../Component/Customersay";
import endpoints from "../utils/endpoints";
import axios from "axios";

import { debounce } from "lodash";
import generateCruiseDetailsUrl from "../utils/DetailsURL";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";
const Regions = () => {
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);
  const [regions, setRegions] = useState([]);
  const [shipDetails, setShipDetails] = useState([]);
  const [shipDetailsFromDB, setShipDetailsFromDB] = useState([]);
  const [totalCruises, setTotalCruises] = useState(0);
  const [cruiseData, setCruiseData] = useState([]);
  const [cruiseDataFromDB, setCruiseDataFromDB] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortOption, setSortOption] = useState("Recommended");
  const [shipRefData, setshipRefData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const regionFromURL = queryParams.get("region");
  const [selectedRegion, setSelectedRegion] = useState(regionFromURL || "");

  const [cruiseTypes, setCruiseTypes] = useState([]);
  const [ships, setShips] = useState([]);
  const [cruiseDate, setCruiseDate] = useState([]);
  const [cruiseLines, setCruiseLines] = useState([]);
  const [port, setPort] = useState([]);
  const [allOperatorDetails, setAllOperatorDetails] = useState([]);
  const [searchBySide, setSearchBySide] = useState(false);

  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  const [selectedCruiseStartDate, setSelectedCruiseStartDate] = useState(null);
  const [selectedCruiseEndDate, setSelectedCruiseEndDate] = useState(null);
  const [selectedCruiseLine, setSelectedCruiseLine] = useState(null);
  const [selectedShips, setSelectedShips] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingImg, setLoadingImg] = useState(true);
  const [sortedData, setSortedData] = useState([]);

  const API_SHIP_BASE_URL = "https://www.widgety.co.uk/api/ships.json";
  const API_OPERATOR_BASE_URL = "https://www.widgety.co.uk/api/operators.json";

  const navigate = useNavigate();

  const handleImageLoad = () => {
    setTimeout(() => {
      setLoadingImg(false);
    }, 1000);
  };

  const handleImageError = () => {
    setLoadingImg(false);
  };

  useEffect(() => {
    if (regionFromURL) {
      setSelectedRegion(regionFromURL);
    }
  }, [regionFromURL]);

  useEffect(() => {
    if (regionFromURL) {
      setShipDetails([]);
      setShipDetailsFromDB([]);
      setCruiseDataFromDB([]);
      setCruiseData([]);
      fetchRegiondata();
      fetchShipdataFromDB();
    }
  }, [regionFromURL]);

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
      // unique Dates
      const uniqueDates = [
        ...new Set(result?.cruises.map((cruise) => cruise.starts_on)),
      ];
      const formattedDates = uniqueDates.map((date) => {
        const dateObj = new Date(date);
        // const day = dateObj.getDate();
        const day = String(dateObj.getDate()).padStart(2, "0");
        const monthName = dateObj.toLocaleString("default", { month: "long" });
        const year = dateObj.getFullYear();
        return {
          value: `${day} ${monthName} ${year}`,
          label: `${day} ${monthName} ${year}`,
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

  const fetchRegiondata = async (para1, para2) => {
    try {
      setIsLoading(true);
      // dates: ["2025-08-01"];
      // operators: ["Princess Cruises"];
      // regions: ["Caribbean"];
      // ships: ["Island Princess"];
      // sortby: "recommended";
      // startingPorts: [];

      const selectedCruiseStartDateQuery = selectedCruiseStartDate || "";
      const selectedCruiseEndDateQuery = selectedCruiseEndDate || "";
      const cruiseLineQuery = selectedCruiseLine?.value || "";
      const regionQuery = regionFromURL || "";
      const shipQuery = selectedShips?.value || "";
      const portQuery = selectedPort?.value || "";
      const durationQuery = para2 || "";
      const priceQuery = para1 || "";

      let queryParams = new URLSearchParams();

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
        `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&region=${
          regionFromURL || selectedRegion
        }&page=${currentPage}&limit=${itemsPerPage}&${queryParams?.toString()}`,
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

        setIsLoading(false);
        setSearchBySide(false);
      } else {
        setCruiseData([]);
        setShipDetails([]);
        setTotalCruises(0);
        setIsLoading(false);
        setSearchBySide(false);
      }
    } catch (error) {
      setIsLoading(false);
      setSearchBySide(false);

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
        const isDuplicate = prevDetails.some(
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

  const fetchShipdataFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL + endpoints?.newpackage}?region=${
          regionFromURL || ""
        }&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Accept: "application/json;api_version=2",
          },
        }
      );
      const shipDetail = await response.json();

      const filterResult = shipDetail?.data;
      if (shipDetail?.status === 200) {
        setLoading(false);
      }
      // console.log(filterResult, shipDetail);
      if (filterResult?.length) {
        if (currentPage > 1) {
          setCruiseDataFromDB((prev) => [...prev, ...filterResult]);
        } else {
          setCruiseDataFromDB([...filterResult]);
        }

        filterResult?.forEach((item) => {
          const coverImage = item?.cruise_image;
          const profileImage = item?.mobile_cruise_banner_image;
          const shipname = item?.ship;
          const price = item?.priceStartFrom;
          const date = item?.general_Start;

          const newDetails = {
            shipname,
            profileImage,
            coverImage,
            price,
            id: item?._id,
            date,
          };

          setShipDetailsFromDB((prevDetails) => {
            const isDuplicate = prevDetails.some(
              (prevItem) => prevItem?.id === newDetails?.id
            );

            return isDuplicate ? prevDetails : [...prevDetails, newDetails];
          });
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching ship details:", error);
    }
  };

  useEffect(() => {
    // if (currentPage === 1) {
    //   setSearchBySide(true);
    //   setCruiseData([]);
    //   setCruiseDataFromDB([]);
    //   setShipDetails([]);
    //   setShipDetailsFromDB([]);
    // }
    const selectedCruiseStartDateQuery = selectedCruiseStartDate || "";
    const selectedCruiseEndDateQuery = selectedCruiseEndDate || "";
    const cruiseLineQuery = selectedCruiseLine?.value || "";
    const shipQuery = selectedShips?.value || "";
    const portQuery = selectedPort?.value || "";
    const durationQuery = duration || "";
    const priceQuery = price || "";

    if (
      selectedCruiseStartDateQuery ||
      selectedCruiseEndDateQuery ||
      cruiseLineQuery ||
      shipQuery ||
      portQuery ||
      durationQuery ||
      priceQuery
    ) {
      if (currentPage === 1) {
        setSearchBySide(true);
      }
      fetchRegiondata();
      searchSideBarCruises();
    } else {
      fetchRegiondata();
      fetchShipdataFromDB();
    }
  }, [
    currentPage,
    selectedCruiseStartDate,
    selectedCruiseEndDate,
    selectedCruiseLine,
    selectedShips,
    selectedPort,
  ]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleRefClick = (ref, ship, cruise) => {
    const resultRefData = cruiseData?.filter((item) => item.ref == ref);
    setshipRefData(resultRefData);
    // console.log("--ship-",ship);
    // console.log("---lisy---",resultRefData)
    // navigate(`/CruiseDetail/${ship.shipname.replace(/\s+/g, '-').toLowerCase()}`);
    const url = generateCruiseDetailsUrl("cruise-details", cruise, ship);
    navigate(url, {
      state: { shipRefData: resultRefData },
    });
  };

  const searchSideBarCruises = async (para1, para2) => {
    try {
      setLoading(true);
      const selectedCruiseStartDateQuery = selectedCruiseStartDate || "";
      const selectedCruiseEndDateQuery = selectedCruiseEndDate || "";
      const cruiseLineQuery = selectedCruiseLine?.value || "";
      const regionQuery = regionFromURL || "";
      const shipQuery = selectedShips?.value || "";
      const portQuery = selectedPort?.value || "";
      const durationQuery = para2 || "";
      const priceQuery = para1 || "";
      // const sortingQuery = sortOption || "";
      let queryParams = new URLSearchParams({
        departure_month_start: selectedCruiseStartDateQuery,
        departure_month_end: selectedCruiseEndDateQuery,
        destination: regionQuery,
        cruise_line: cruiseLineQuery,
        cruise_ship: shipQuery,
        ports: portQuery,
        duration: durationQuery,
        price_range: priceQuery,
        // recommended: sortingQuery,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (
        !selectedCruiseStartDateQuery &&
        !selectedCruiseEndDateQuery &&
        !cruiseLineQuery &&
        !regionQuery &&
        !shipQuery &&
        !portQuery &&
        !durationQuery &&
        !priceQuery
        // !sortingQuery
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
        const filterResult = response?.data?.data;
        if (filterResult?.length) {
          if (currentPage > 1) {
            setCruiseDataFromDB((prev) => [...prev, ...filterResult]);
          } else {
            setCruiseDataFromDB([...filterResult]);
          }
          setLoading(false);

          filterResult?.forEach((item) => {
            const coverImage = item?.cruise_image;
            const profileImage = item?.mobile_cruise_banner_image;
            const shipname = item?.ship;
            const price = item?.priceStartFrom;
            const date = item?.general_Start;

            const newDetails = {
              shipname,
              profileImage,
              coverImage,
              price,
              id: item?._id,
              date,
            };

            setShipDetailsFromDB((prevDetails) => {
              const isDuplicate = prevDetails.some(
                (prevItem) => prevItem?.id === newDetails?.id
              );

              return isDuplicate ? prevDetails : [...prevDetails, newDetails];
            });
          });
        } else {
          setCruiseDataFromDB([]);
          setShipDetailsFromDB([]);
        }
      } else {
        setLoading(false);
        console.error("Error searching cruises:", response?.data?.message);
      }
    } catch (error) {
      console.error("Error searching cruises:", error);
    }
  };

  const debounceApiCall = debounce((price, duration) => {
    searchSideBarCruises(price, duration);
  }, 1000);

  const debounceApiCallForRegion = debounce((price, duration) => {
    fetchRegiondata(price, duration);
  }, 1000);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
    debounceApiCall(price, event.target.value);
    debounceApiCallForRegion(price, event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    debounceApiCall(event.target.value, duration);
    debounceApiCallForRegion(event.target.value, duration);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    setCruiseData([]);
    setCruiseDataFromDB([]);
    setShipDetails([]);
    setShipDetailsFromDB([]);

    setSelectedCruiseStartDate("");
    setSelectedCruiseEndDate("");
    setSelectedCruiseLine("");
    setSelectedShips("");
    setSelectedPort("");
    setDuration("");
    setPrice("");

    setCurrentPage(1);
    // fetchShipdataFromDB();
  };

  return (
    <>
      <section className="banner">
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
            <button type="button" data-bs-target="#demo" data-bs-slide-to={1} />
            <button type="button" data-bs-target="#demo" data-bs-slide-to={2} />
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={banner1}
                alt="Los Angeles"
                className="d-block"
                style={{ width: "100%" }}
              />
              <div className="bg-overlay12" />
              <div className="carousel-caption">
                <h3>{selectedRegion || regionFromURL}</h3>
                <p>Holiday2 Collection</p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src={banner2}
                alt="Los Angeles"
                className="d-block"
                style={{ width: "100%" }}
              />
              <div className="bg-overlay" />
              <div className="carousel-caption">
                <h3>{selectedRegion || regionFromURL}</h3>
                <p>Holiday2 Collection</p>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src={banner3}
                alt="Los Angeles"
                className="d-block"
                style={{ width: "100%" }}
              />
              <div className="bg-overlay" />
              <div className="carousel-caption">
                <h3>{selectedRegion || regionFromURL}</h3>
                <p>Holiday2 Collection</p>
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
              <form action="" className="scroll_form" id="style-1">
                <div className="ship_left_area">
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
                      <select className="select_area form-select">
                        <option value={regionFromURL}>{regionFromURL}</option>
                      </select>
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
                  {selectedCruiseStartDate ||
                  selectedCruiseEndDate ||
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
                  Showing: {[...shipDetails, ...shipDetailsFromDB]?.length}{" "}
                  Cruises Out of:{" "}
                  {[...shipDetailsFromDB]?.length + totalCruises}{" "}
                </div>

                <div className="cruise_drop">
                  <select value={sortOption} onChange={handleSortChange}>
                    <option value={"recommended"}>Recommended</option>
                    <option value={"low_to_high"}>Price (Low to High)</option>
                    <option value={"high_to_low"}>Price (High to Low)</option>
                    <option value={"departure_soonest"}>
                      Departure Date (Soonest First)
                    </option>
                    <option value={"departure_furthest"}>
                      Departure Date (Furthest First)
                    </option>
                  </select>
                </div>
              </div>
              {[...shipDetailsFromDB, ...shipDetails]?.length > 0 &&
              !searchBySide ? (
                <>
                  {/* {console.log("55555555555", shipDetailsFromDB, shipDetails)} */}
                  {shipDetailsFromDB
                    ?.sort((a, b) => {
                      if (
                        sortOption === "high_to_low" ||
                        sortOption === "low_to_high"
                      ) {
                        return sortOption === "high_to_low"
                          ? b?.price - a?.price
                          : a?.price - b?.price;
                      } else if (
                        sortOption === "departure_soonest" ||
                        sortOption === "departure_furthest"
                      ) {
                        return sortOption === "departure_soonest"
                          ? new Date(a?.date * 1000) - new Date(b?.date * 1000)
                          : new Date(b?.date * 1000) - new Date(a?.date * 1000);
                      }

                      return 0;
                    })
                    ?.map((ship, index) => {
                      const cruise = [...cruiseDataFromDB, ...cruiseData].find(
                        (cruiseItem) =>
                          cruiseItem?._id === ship?.id ||
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
                                  src={ship.coverImage}
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
                                            {cruise?.general_Start
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
                                    {cruise?.itinerary &&
                                      cruise?.itinerary?.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2">
                                          {cruise?.itinerary
                                            ?.slice(0, 5)
                                            ?.sort((a, b) =>
                                              a?.port?.localeCompare(b?.port)
                                            )
                                            ?.map((port, portIndex) => (
                                              <div key={portIndex} className="">
                                                <div className="">
                                                  {`${port?.port + " | "}` ||
                                                    "N/A"}
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
                                <div className="curise_amount">
                                  {
                                    <>
                                      <div className="final_price">
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
                                          to={generateCruiseDetailsUrl(
                                            "new-cruise-details",
                                            cruise,
                                            ship
                                          )}
                                          className="action_btn"
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
                      );
                    })}
                  {shipDetails
                    ?.sort((a, b) => {
                      if (
                        sortOption === "high_to_low" ||
                        sortOption === "low_to_high"
                      ) {
                        return sortOption === "high_to_low"
                          ? b?.price - a?.price
                          : a?.price - b?.price;
                      } else if (
                        sortOption === "departure_soonest" ||
                        sortOption === "departure_furthest"
                      ) {
                        const aDate = new Date(a?.date);
                        const bDate = new Date(b?.date);
                        if (sortOption === "departure_soonest") {
                          return aDate - bDate;
                        } else if (sortOption === "departure_furthest") {
                          return bDate - aDate;
                        }
                      }
                    })

                    ?.map((ship, index) => {
                      const cruise = [...cruiseDataFromDB, ...cruiseData].find(
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
                                  src={ship.coverImage}
                                  className={`img-fluid ${
                                    loadingImg ? "invisible" : "visible"
                                  }`}
                                  onLoad={handleImageLoad}
                                  onError={handleImageError}
                                  alt={ship.shipname}
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
                      );
                    })}
                </>
              ) : ![...shipDetailsFromDB, ...shipDetails]?.length &&
                isloading ? (
                <div className="d-flex justify-content-center align-items-center h-25">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only"></span>
                  </div>
                </div>
              ) : [...shipDetailsFromDB, ...shipDetails]?.length === 0 ? (
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

              {[...shipDetailsFromDB, ...shipDetails]?.length &&
              [...shipDetailsFromDB, ...shipDetails]?.length < totalCruises ? (
                <div className="load_more_area">
                  {!isloading ? (
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
      <Customersay />
    </>
  );
};
export default Regions;
