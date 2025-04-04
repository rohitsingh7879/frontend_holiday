import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
import DOMPurify from "dompurify";

import ship_banner from "../assets/images/ship_banner-new.jpg";
import logo from "../assets/images/c_logo2.png";
import iconship from "../assets/images/icons/ship.png";
import date from "../assets/images/icons/date.png";
import moon from "../assets/images/icons/moon.png";
import Customersay from "../Component/Customersay";
import bg1 from "../assets/images/be1.png";
import bg2 from "../assets/images/be2.png";
import Slider from "react-slick";
import Select from "react-select";
import endpoints from "../utils/endpoints";
import axios from "axios";
import { debounce } from "lodash";
import generateCruiseDetailsUrl from "../utils/DetailsURL";
import formatString from "../utils/formatingString";

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const API_SHIP_BASE_URL = "https://www.widgety.co.uk/api/ships.json";
const API_OPERATOR_BASE_URL = "https://www.widgety.co.uk/api/operators.json";

const Oprator = () => {
  const [selectedOprator, setSelectOprator] = useState("");
  const [cruiseData, setCruiseData] = useState([]);
  const [opratordata, setOpratorData] = useState();
  const [shipDetails, setShipDetails] = useState([]);
  const [sortOption, setSortOption] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCruises, setTotalCruises] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [shipRefData, setshipRefData] = useState([]);
  const [shipDetailsFromDB, setShipDetailsFromDB] = useState([]);
  const [cruiseDataFromDB, setCruiseDataFromDB] = useState([]);

  const [cruiseCategory, setCruiseCategory] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [category, setCategories] = useState([]);

  const [regions, setRegions] = useState([]);
  const [cruiseTypes, setCruiseTypes] = useState([]);
  const [ships, setShips] = useState([]);
  const [cruiseDate, setCruiseDate] = useState([]);
  const [cruiseLines, setCruiseLines] = useState([]);
  const [port, setPort] = useState([]);
  const [allOperatorDetails, setAllOperatorDetails] = useState([]);

  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  const [selectedRegions, setSelectedRegions] = useState(null);
  const [selectedCruiseDate, setSelectedCruiseDate] = useState(null);
  const [selectedCruiseLine, setSelectedCruiseLine] = useState(null);
  const [selectedShips, setSelectedShips] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const regionFromURL = queryParams.get("oprator");
  const navigate = useNavigate();

  const handleSeeMore = (event) => {
    event.preventDefault();

    if (visibleCount === 5) {
      setVisibleCount(category?.length);
    } else {
      setVisibleCount(5);
    }
  };

  const handleImageLoad = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleImageError = () => {
    setLoading(false);
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
        let categoryData = data?.data;
        const filters = categoryData?.map((cat) => ({
          value: cat.categoryName,
          label: cat.categoryName,
        }));
        setCategories(filters);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  // useEffect(() => {
  //   if (regionFromURL) {
  //     setSelectOprator(regionFromURL);
  //   }
  // }, [regionFromURL]);

  useEffect(() => {
    if (regionFromURL) {
      setCruiseData([]);
      setShipDetails([]);
      fetchOpratordata();
      fetchopCurrent();
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

  const fetchOpratordata = async (para1, para2, para3) => {
    try {
      setIsLoading(true);
      const selectedCruiseDateQuery = selectedCruiseDate?.value || "";
      const catQuery = para3 || [];
      const regionQuery = selectedRegions?.value || "";
      const cruiseLineQuery = regionFromURL || "";
      const shipQuery = selectedShips?.value || "";
      const portQuery = selectedPort?.value || "";
      const durationQuery = para2 || "";
      const priceQuery = para1 || "";
      let queryParams = new URLSearchParams({
        categories: catQuery,
        dates: [selectedCruiseDateQuery],
        operators: [cruiseLineQuery],
        regions: [regionQuery],
        ships: [shipQuery],
        ports: [portQuery],
        maxDuration: durationQuery,
        maxPrice: priceQuery,
      });
      const response = await fetch(
        `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&operator=${regionFromURL}&page=${currentPage}&limit=${itemsPerPage}&${queryParams?.toString()}`,
        { headers: { Accept: "application/json;api_version=2" } }
      );
      const getoprator = await response.json();

      if (getoprator && getoprator.total) {
        setTotalCruises(getoprator.total);
      }
      if (getoprator && getoprator.cruises) {
        const cruisedataResult = getoprator?.cruises?.map((cruise) => ({
          shipname: cruise.ship_title,
          name: cruise.name,
          price: cruise.cruise_only_price,
          ref: cruise.ref,
          date: cruise.starts_on,
          portname: cruise.starts_at,
          night: cruise.cruise_nights,
          description: cruise.description,
          operator: cruise.operator_title,
          day: cruise.vacation_days,
          end: cruise.ends_on,
          airport: cruise.airports,
          suite_price: cruise.suite_price,
          outside_price: cruise.outside_price,
          balcony_price: cruise.balcony_price,
          inside_price: cruise.inside_price,
          travel_type: cruise.travel_type,
          shipurl: cruise.ship,
        }));

        if (currentPage > 1) {
          setCruiseData((prevData) => [...prevData, ...cruisedataResult]);
        } else {
          setCruiseData([...cruisedataResult]);
        }

        const shipPromises = cruisedataResult.map((cruise) =>
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
      } else {
        console.log("No cruises found for this operator.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching operator data:", error);
    }
  };

  const fetchShipdata = async (shipurl, shipname, para3, ref, date) => {
    try {
      if (!shipurl) {
        console.error("Ship URL is missing for ship:", shipname);
        return;
      }

      const response = await fetch(
        `${shipurl}?app_id=${APP_ID}&token=${TOKEN}`,
        { headers: { Accept: "application/json;api_version=2" } }
      );

      if (!response.ok) {
        console.error("Failed to fetch ship details. Status:", response.status);
        return;
      }

      const shipDetail = await response.json();

      if (!shipDetail || Object.keys(shipDetail).length === 0) {
        console.error("Empty or malformed response for ship:", shipname);
        return;
      }

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
            ship?.ref === ref
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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const fetchShipdataFromDB = async () => {
    try {
      const response = await fetch(
        `${API_URL + endpoints?.newpackage}?operator=${
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
      console.error("Error fetching ship details:", error);
    }
  };

  // useEffect(() => {
  //   fetchOpratordata();
  //   fetchopCurrent();
  // }, [currentPage]);

  const handleRefClick = (ref, ship, cruise) => {
    const resultRefData = cruiseData?.filter((item) => item.ref == ref);
    setshipRefData(resultRefData);

    const url = generateCruiseDetailsUrl("cruise-details", cruise, ship);
    navigate(url, {
      state: { shipRefData: resultRefData },
    });
  };

  const fetchopCurrent = async () => {
    try {
     
      if (!regionFromURL) {
        console.error("No operator selected.");
        return;
      }

      const url = `https://www.widgety.co.uk/api/operators/${regionFromURL}.json?app_id=${APP_ID}&token=${TOKEN}`;

      const response = await fetch(url, {
        headers: { Accept: "application/json;api_version=2" },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const currentop = await response.json();

      setOpratorData(currentop);
    } catch (error) {
      console.error("Error fetching operator data:", error);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 2000,
    arrows: false,
    dots: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 200,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const settings1 = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    infinite: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  // const stripHTML = (html) => {
  //   return html?.replace(/<\/?[^>]+(>|$)/g, "");
  // };

  const searchSideBarCruises = async (para1, para2, para3) => {
    try {
      setLoading(true);
      const cruiseCategoryQuery = para3 || [];
      const selectedCruiseDateQuery = selectedCruiseDate?.value || "";
      const regionQuery = selectedRegions?.value || "";
      const cruiseLineQuery = regionFromURL || "";
      const shipQuery = selectedShips?.value || "";
      const portQuery = selectedPort?.value || "";
      const durationQuery = para2 || "";
      const priceQuery = para1 || "";
      // const sortingQuery = sortOption || "";
      let queryParams = new URLSearchParams({
        cruise_category: JSON.stringify(cruiseCategoryQuery),
        departure_month: selectedCruiseDateQuery,
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
        !selectedCruiseDateQuery &&
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

  const debounceApiCall = debounce((price, duration, cat) => {
    searchSideBarCruises(price, duration, cat);
  }, 1000);

  const debounceApiCallForOperator = debounce((price, duration, cat) => {
    fetchOpratordata(price, duration, cat);
  }, 1000);

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
    debounceApiCall(price, event.target.value, cruiseCategory);
    debounceApiCallForOperator(price, event.target.value, cruiseCategory);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    debounceApiCall(event.target.value, duration, cruiseCategory);
    debounceApiCallForOperator(event.target.value, duration, cruiseCategory);
  };

  const handleCheckboxChange = (value) => {
    const updatedCruiseCategory = cruiseCategory.includes(value)
      ? cruiseCategory.filter((item) => item !== value)
      : [...cruiseCategory, value];

    setCruiseCategory(updatedCruiseCategory);
    debounceApiCall(price, duration, updatedCruiseCategory);
    debounceApiCallForOperator(price, duration, updatedCruiseCategory);
  };

  useEffect(() => {
    fetchOpratordata();

    const selectedCruiseDateQuery = selectedCruiseDate?.value || "";
    const catQuery = cruiseCategory || [];
    const regionQuery = selectedRegions?.value || "";
    const shipQuery = selectedShips?.value || "";
    const portQuery = selectedPort?.value || "";
    const durationQuery = duration || "";
    const priceQuery = price || "";

    if (
      selectedCruiseDateQuery ||
      regionQuery ||
      shipQuery ||
      portQuery ||
      durationQuery ||
      priceQuery ||
      catQuery.length > 0
    ) {
      searchSideBarCruises();
    } else {
      fetchShipdataFromDB();
    }
  }, [
    currentPage,
    selectedCruiseDate,
    selectedRegions,
    selectedShips,
    selectedPort,
    regionFromURL
  ]);

  const handleReset = async (e) => {
    e.preventDefault();

    setCruiseData([]);
    setCruiseDataFromDB([]);
    setShipDetails([]);
    setShipDetailsFromDB([]);

    setCruiseCategory([]);
    setSelectedCruiseDate("");
    setSelectedCruiseLine("");
    setSelectedShips("");
    setSelectedPort("");
    setDuration("");
    setPrice("");

    setCurrentPage(1);
    // fetchOpratordata();
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
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={ship_banner}
                alt="Collection"
                className="d-block"
                style={{ width: "100%" }}
              />
              <div className="bg-overlay_1" />
              <div className="carousel-caption">
                {/* <p>
                  <img src={logo} className="img-fluid logo_d" />
                </p> */}
                <h3>{formatString(selectedOprator || regionFromURL)}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="explore_tabs_inner" style={{ marginTop: "0px" }}>
        <div className="container">
          <div
            className="nav nav-tabs mb-3 regent_dells"
            id="nav-tab"
            role="tablist"
          >
            <button
              className="nav-link active"
              id="nav-regent-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-regent"
              type="button"
              role="tab"
              aria-controls="nav-regent"
              aria-selected="true"
            >
              Deals
            </button>
            <button
              className="nav-link"
              id="nav-intro-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-intro"
              type="button"
              role="tab"
              aria-controls="nav-intro"
              aria-selected="false"
            >
              Intro
            </button>
            <button
              className="nav-link"
              id="nav-reasons-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-reasons"
              type="button"
              role="tab"
              aria-controls="nav-reasons"
              aria-selected="false"
            >
              Reasons to Book
            </button>
            <button
              className="nav-link"
              id="nav-brochures-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-brochures"
              type="button"
              role="tab"
              aria-controls="nav-brochures"
              aria-selected="false"
            >
              Brochures
            </button>
            <button
              className="nav-link"
              id="nav-members-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-members"
              type="button"
              role="tab"
              aria-controls="nav-members"
              aria-selected="false"
            >
              Members club{" "}
            </button>
          </div>

          <div className="tab-content mt-4" id="nav-tabContent">
            <div
              className="tab-pane fade active show"
              id="nav-regent"
              role="tabpanel"
              aria-labelledby="nav-regent-tab"
            >
              <div className="tab_info">
                <section className="cruise_dest1">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-3">
                        <div className="ship_left_area">
                          <div className="button1">
                            <h4>
                              CRUISE CATEGORY{" "}
                              <i className="ri-arrow-down-s-line" />
                            </h4>
                            <div className="mydiv">
                              <ul>
                                {category
                                  ?.slice(0, visibleCount)
                                  .map((filter, index) => (
                                    <li key={index}>
                                      <input
                                        type="checkbox"
                                        checked={cruiseCategory.includes(
                                          filter.value
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(filter.value)
                                        }
                                      />{" "}
                                      {filter.label}
                                    </li>
                                  ))}
                              </ul>

                              {category?.length > 5 && (
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
                              DEPARTURE MONTH{" "}
                              <i className="ri-arrow-down-s-line" />
                            </h4>
                            <div className="mydiv">
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
                              <option value={regionFromURL}>
                                {regionFromURL}
                              </option>
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
                          {cruiseCategory?.length ||
                          selectedCruiseDate?.value ||
                          selectedRegions?.value ||
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
                      </div>
                      <div className="col-lg-9">
                        <div className="cruise_info">
                          <div className="cruise_result">
                            Showing: {totalCruises} Cruises
                          </div>
                          <div className="cruise_drop">
                            <select
                              value={sortOption}
                              onChange={handleSortChange}
                            >
                              <option value={"recommended"}>Recommended</option>
                              <option value={"low_to_high"}>
                                Price (Low to High)
                              </option>
                              <option value={"high_to_low"}>
                                Price (High to Low)
                              </option>
                              <option value={"departure_soonest"}>
                                Departure Date (Soonest First)
                              </option>
                              <option value={"departure_furthest"}>
                                Departure Date (Furthest First)
                              </option>
                            </select>
                          </div>
                        </div>
                        {[...shipDetailsFromDB, ...shipDetails]?.length ? (
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
                                    ? new Date(a?.date * 1000) -
                                        new Date(b?.date * 1000)
                                    : new Date(b?.date * 1000) -
                                        new Date(a?.date * 1000);
                                }

                                return null;
                              })
                              ?.map((ship, index) => {
                                const cruise = [
                                  ...cruiseDataFromDB,
                                  ...cruiseData,
                                ].find(
                                  (cruiseItem) =>
                                    cruiseItem?._id === ship?.id ||
                                    cruiseItem?.ref === ship?.id
                                );

                                return (
                                  <div className="criuse_list" key={index}>
                                    <div className="row">
                                      <div className="col-lg-4 padd_none">
                                        <div
                                          className="cri_pic"
                                          style={{
                                            position: "relative",
                                          }}
                                        >
                                          {loading && (
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
                                              loading ? "invisible" : "visible"
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
                                                    <span>
                                                      {ship?.shipname}
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
                                                    />
                                                  </div>
                                                  <div>
                                                    <p>Date</p>
                                                    <span>
                                                      {cruise?.general_Start
                                                        ? moment
                                                            .unix(
                                                              cruise?.general_Start
                                                            )
                                                            .format(
                                                              "DD MMM YYYY"
                                                            )
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
                                          <div className="dieds">
                                            {cruise?.name}
                                          </div>
                                          <div className="dieds line_h15">
                                            <span className="d-flex justify-content-left gap-3 align-items-center">
                                              <img
                                                src={iconship}
                                                className="img-fluid"
                                              />{" "}
                                              {cruise?.itinerary &&
                                                cruise?.itinerary?.length >
                                                  0 && (
                                                  <div className="d-flex flex-wrap gap-2">
                                                    {cruise?.itinerary
                                                      ?.slice(0, 5)
                                                      ?.sort((a, b) =>
                                                        a?.port?.localeCompare(
                                                          b?.port
                                                        )
                                                      )
                                                      ?.map(
                                                        (port, portIndex) => (
                                                          <div
                                                            key={portIndex}
                                                            className=""
                                                          >
                                                            <div className="">
                                                              {`${
                                                                port?.port +
                                                                " | "
                                                              }` || "N/A"}
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                  </div>
                                                )}
                                            </span>
                                          </div>
                                          <div className="curise_des_area">
                                            {" "}
                                            {cruise?.summary ? (
                                              cruise?.summary
                                                ?.split("•")
                                                .filter(
                                                  (text) => text.trim() !== ""
                                                )
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
                                                          text.trim().split(" ")
                                                            .length > 30
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
                                            <div className="final_price">
                                              £
                                              {cruise?.price ||
                                                cruise?.priceStartFrom}
                                              pp
                                            </div>
                                            <div>
                                              <Link
                                                // to={`/Newcruisesdetails/${ship.id
                                                //   ?.replace(/\s+/g, "-")
                                                //   .toLowerCase()}`}
                                                to={generateCruiseDetailsUrl(
                                                  "new-cruise-details",
                                                  cruise,
                                                  ship
                                                )}
                                                className="action_btn"
                                                // onClick={(e) => {
                                                //   e.preventDefault();
                                                //   handleRefClick(cruise?.ref, ship);
                                                // }}
                                              >
                                                View Deal
                                              </Link>
                                            </div>
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
                                  } else if (
                                    sortOption === "departure_furthest"
                                  ) {
                                    return bDate - aDate;
                                  }
                                }

                                return 0;
                              })
                              ?.map((ship, index) => {
                                const cruise = [
                                  ...cruiseDataFromDB,
                                  ...cruiseData,
                                ].find(
                                  (cruiseItem) =>
                                    cruiseItem?.id === ship?.id ||
                                    cruiseItem?.ref === ship?.id
                                );

                                return (
                                  <div className="criuse_list" key={index}>
                                    <div className="row">
                                      <div className="col-lg-4 padd_none">
                                        <div
                                          className="cri_pic"
                                          style={{
                                            position: "relative",
                                          }}
                                        >
                                          {loading && (
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
                                              loading ? "invisible" : "visible"
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
                                                    <span>
                                                      {ship?.shipname}
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
                                                    />
                                                  </div>
                                                  <div>
                                                    <p>Date</p>
                                                    <span>
                                                      {cruise?.date
                                                        ? new Date(
                                                            cruise?.date
                                                          ).toLocaleDateString(
                                                            "en-GB",
                                                            {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                            }
                                                          )
                                                        : cruise?.general_Start
                                                        ? moment
                                                            .unix(
                                                              cruise?.general_Start
                                                            )
                                                            .format(
                                                              "DD MMM YYYY"
                                                            )
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
                                          <div className="dieds">
                                            {cruise?.name}
                                          </div>
                                          <div className="dieds line_h15">
                                            <span className="d-flex justify-content-left gap-3 align-items-center">
                                              <img
                                                src={iconship}
                                                className="img-fluid"
                                              />{" "}
                                              {cruise?.portData &&
                                                cruise?.portData?.length >
                                                  0 && (
                                                  <div className="d-flex flex-wrap gap-2">
                                                    {cruise?.portData
                                                      ?.slice(0, 5)
                                                      ?.sort((a, b) =>
                                                        a?.port?.name?.localeCompare(
                                                          b?.port?.name
                                                        )
                                                      )
                                                      ?.map(
                                                        (port, portIndex) => (
                                                          <div
                                                            key={portIndex}
                                                            className=""
                                                          >
                                                            <div className="">
                                                              {`${
                                                                port?.port
                                                                  ?.name + " | "
                                                              }` || "N/A"}
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                  </div>
                                                )}
                                            </span>
                                          </div>
                                          <div className="curise_des_area">
                                            {" "}
                                            {cruise?.summary ? (
                                              cruise?.summary
                                                ?.split("•")
                                                .filter(
                                                  (text) => text.trim() !== ""
                                                )
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
                                                          text.trim().split(" ")
                                                            .length > 30
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
                                            <div className="final_price">
                                              £
                                              {cruise?.price ||
                                                cruise?.priceStartFrom}
                                              pp
                                            </div>
                                            <div>
                                              <Link
                                                // to={`/CruiseDetail/${ship?.shipname
                                                //   ?.replace(/\s+/g, "-")
                                                //   ?.toLowerCase()}`}
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
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </>
                        ) : (
                          <div className="d-flex justify-content-center align-items-center h-25">
                            <div
                              className="spinner-border text-secondary"
                              role="status"
                            >
                              <span className="sr-only"></span>
                            </div>
                          </div>
                        )}

                        {/* Load More Button */}
                        {[...shipDetailsFromDB, ...shipDetails]?.length &&
                        [...shipDetailsFromDB, ...shipDetails]?.length <
                          totalCruises &&
                        !loading ? (
                          <div className="load_more_area my-4">
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

                        {/* <section className="be_inspired promotions">
                          <div className="container">
                            <h4>Regent Seven Seas Promotions</h4>
                            <div className="promotions_slider">
                              <Slider {...settings}>
                                <div className="beb">
                                  <img
                                    src={bg1}
                                    className="img-fluid"
                                    alt="Promotion 1"
                                  />
                                </div>
                                <div className="beb">
                                  <img
                                    src={bg2}
                                    className="img-fluid"
                                    alt="Promotion 2"
                                  />
                                </div>
                                <div className="beb">
                                  <img
                                    src={bg2}
                                    className="img-fluid"
                                    alt="Promotion 3"
                                  />
                                </div>
                                <div className="beb">
                                  <img
                                    src={bg2}
                                    className="img-fluid"
                                    alt="Promotion 4"
                                  />
                                </div>
                              </Slider>
                            </div>
                          </div>
                        </section> */}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="nav-intro"
              role="tabpanel"
              aria-labelledby="nav-intro-tab"
            >
              <div className="tab_info cardo">
                <section className="cruise_dest1">
                  <div className="container">
                    <div className="row">
                      {/* <div className="col-lg-3">
                        <div className="ship_left_area">
                          <div className="button1">
                            <h4>
                              CRUISE CATEGORY{" "}
                              <i className="ri-arrow-down-s-line" />
                            </h4>
                            <div className="mydiv">
                              <ul>
                                {category
                                  ?.slice(0, visibleCount)
                                  .map((filter, index) => (
                                    <li key={index}>
                                      <input
                                        type="checkbox"
                                        checked={cruiseCategory.includes(
                                          filter.value
                                        )}
                                        onChange={() =>
                                          handleCheckboxChange(filter.value)
                                        }
                                      />{" "}
                                      {filter.label}
                                    </li>
                                  ))}
                              </ul>

                              {category?.length > 5 && (
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
                              DEPARTURE MONTH{" "}
                              <i className="ri-arrow-down-s-line" />
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
                      </div> */}

                      <div className="col-lg-12">
                        <div className="about_partt">
                          <div className="get_in mb-3">
                            <span>{selectedOprator || regionFromURL}</span>
                          </div>
                          <h2 className="mb-4">
                            The Epitome of All-Inclusive Luxury
                          </h2>
                          <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              opratordata?.description
                            ),
                          }}
                        ></div>
                          {/* <p>{stripHTML(opratordata?.description)}</p> */}
                          <hr />
                          {/* <div className="get_in mb-3">
                            <span>All-Inclusive Luxury Redefined</span>
                          </div>
                          <p>
                            Regent Seven Seas Cruises offers one of the most
                            comprehensive all-inclusive packages in the
                            industry. From unlimited shore excursions to
                            exquisite dining experiences and luxurious
                            accommodations, every detail is included in the
                            upfront fare. Guests enjoy:
                          </p>
                          <ul>
                            <li>
                              Unlimited Shore Excursions: Explore destinations
                              deeply with a variety of guided tours and cultural
                              experiences at no additional cost.
                            </li>
                            <li>
                              Fine Dining: Indulge in gourmet meals prepared by
                              world-class chefs, paired with premium wines and
                              spirits, available throughout the day.
                            </li>
                            <li>
                              Spacious Suites: Relax in elegantly appointed
                              suites, each featuring a private balcony,
                              marble-clad bathrooms, and personalized service
                              from attentive staff.
                            </li>
                            <li>
                              Gratuities and Wi-Fi: All gratuities are included,
                              along with unlimited high-speed internet, ensuring
                              a hassle-free experience.
                            </li>
                          </ul>
                          <hr />
                          <div className="get_in mb-3">
                            <span>The Regent Fleet</span>
                          </div>
                          <p>
                            Each ship in Regent’s fleet is designed to offer an
                            intimate yet luxurious environment, with a focus on
                            comfort, space, and personalized attention. Here are
                            the current Regent Seven Seas ships:
                          </p> */}
                          <div className="explore_cruise_slider2 mb-5">
                            <div className="explore_list">
                              <Slider {...settings1}>
                                {opratordata?.ships?.map((item, index) => (
                                  <div className="explore_list_c" key={index}>
                                    <b>{item?.name}</b>
                                    <a href={item.link}>
                                      <img
                                        src={item?.cover_image_href}
                                        className="img-fluid"
                                        alt={item?.name}
                                      />
                                    </a>
                                    <div className="cs">
                                      <a href={item?.link}>
                                        <i className="ri-arrow-right-line" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </Slider>
                            </div>
                          </div>
                          {/* <div className="get_in mt-5 mb-3">
                            <span>World-Class Itineraries</span>
                          </div>
                          <p>
                            Regent Seven Seas Cruises offers itineraries that
                            span every corner of the globe, from the sun-soaked
                            beaches of the Caribbean to the ancient wonders of
                            the Mediterranean and the exotic landscapes of Asia
                            and Africa. Highlights include:
                          </p>
                          <ul>
                            <li>
                              Grand Voyages: Extended cruises that explore
                              multiple regions in a single journey, perfect for
                              seasoned travelers seeking in-depth experiences.
                            </li>
                            <li>
                              Alaskan Adventures: Immerse yourself in the
                              natural beauty of Alaska with guided excursions to
                              glaciers, wildlife reserves, and charming frontier
                              towns.
                            </li>
                            <li>
                              World Cruises: Embark on the ultimate travel
                              experience with Regent’s all-inclusive world
                              cruises, visiting iconic landmarks and hidden gems
                              over several months.
                            </li>
                          </ul> */}
                          <div className="ship_video">
                            <h3>Ship Video</h3>
                            <iframe
                              width="100%"
                              height={350}
                              src={`https://www.youtube.com/embed/${
                                opratordata?.video_url?.split("v=")[1]
                              }?si=8kc20yMoDUX-nQHu`}
                              title="YouTube video player"
                              frameBorder={0}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        </div>
                        {/* <section className="be_inspired promotions">
                          <div className="container">
                            <h4>Regent Seven Seas Promotions</h4>
                            <Slider {...settings}>
                              <div className="beb">
                                <img
                                  src={bg1}
                                  className="img-fluid"
                                  alt="Promotion 1"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 2"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 3"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 4"
                                />
                              </div>
                            </Slider>
                          </div>
                        </section> */}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="nav-reasons"
              role="tabpanel"
              aria-labelledby="nav-reasons-tab"
            >
              <div className="tab_info">
                <section className="cruise_dest1">
                  <div className="container">
                    <div className="row">
                      {/* <div className="col-lg-3">
                        <div className="ship_left_area">
                          <div className="button1">
                            <h4>
                              CRUISE CATEGORY{" "}
                              <i className="ri-arrow-down-s-line" />
                            </h4>
                            <div className="mydiv">
                              <ul>
                                <li>
                                  <input type="checkbox" defaultValue /> 2025
                                </li>
                                <li>
                                  <input type="checkbox" defaultValue /> 2026
                                </li>
                                <li>
                                  <input type="checkbox" defaultValue /> All
                                  Inclusive Cruises
                                </li>
                                <li>
                                  <input type="checkbox" defaultValue /> Cruise
                                  Deals
                                </li>
                                <li>
                                  <input type="checkbox" defaultValue /> Last
                                  Minute Deals
                                </li>
                                <li>
                                  <input type="checkbox" defaultValue /> Luxury
                                  Cruises
                                </li>
                                <li>See More</li>
                              </ul>
                            </div>
                          </div>
                          <div className="button1">
                            <h4>
                              DEPARTURE MONTH{" "}
                              <i className="ri-arrow-down-s-line" />
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
                      </div> */}
                      <div className="col-lg-12">
                        <div className="about_partt">
                          <div className="get_in mb-3">
                            <span>reasons to book</span>
                          </div>
                          <h2 className="mb-4">
                            Why Choose{" "}
                            {formatString(selectedOprator || regionFromURL)}{" "}
                            Cruises for Your Next Adventure
                          </h2>
                          <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              opratordata?.reasons_to_book
                            ),
                          }}
                        ></div>
                          {/* <p>{stripHTML(opratordata?.reasons_to_book)}</p> */}
                          <hr />
                          <div className="get_in mb-3">
                            <span>All-Inclusive Luxury</span>
                          </div>
                          <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              opratordata?.unique_text
                            ),
                          }}
                        ></div>
                          {/* <p>{stripHTML(opratordata?.unique_text)}</p> */}
                          {/* <div className="reasons_book_slider">
                            <Slider {...settings}>
                              <div className="beb">
                                <img
                                  src={bg1}
                                  className="img-fluid"
                                  alt="Promotion 1"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 2"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 3"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 4"
                                />
                              </div>
                            </Slider>
                          </div>
                          <hr /> */}
                          {/* <div className="get_in mb-3">
                            <span>Spacious and Luxurious Accommodations</span>
                          </div>
                          <p>
                            Regent Seven Seas Cruises redefines the concept of
                            "all-inclusive." From unlimited shore excursions to
                            fine dining, premium beverages, gratuities, and even
                            Wi-Fi, every detail is covered. With no hidden
                            costs, you can relax and enjoy your vacation to the
                            fullest.
                          </p> */}
                          {/* <div className="reasons_book_slider">
                            <Slider {...settings}>
                              <div className="beb">
                                <img
                                  src={bg1}
                                  className="img-fluid"
                                  alt="Promotion 1"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 2"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 3"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 4"
                                />
                              </div>
                            </Slider>
                          </div>
                          <hr /> */}
                          {/* <div className="get_in mb-3">
                            <span>Exquisite Dining Experiences</span>
                          </div>
                          <p>
                            Regent Seven Seas Cruises offers a world-class
                            culinary journey. With specialty restaurants,
                            open-seating dining, and menus crafted by expert
                            chefs, every meal is a celebration of flavors. Plus,
                            with no extra charges for specialty dining, you can
                            savor every bite stress-free.
                          </p> */}
                          {/* <div className="reasons_book_slider">
                            <Slider {...settings}>
                              <div className="beb">
                                <img
                                  src={bg1}
                                  className="img-fluid"
                                  alt="Promotion 1"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 2"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 3"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 4"
                                />
                              </div>
                            </Slider>
                          </div> */}
                          {/* <hr /> */}
                          {/* <div className="get_in mb-3">
                            <span>Immersive Shore Excursions</span>
                          </div>
                          <p>
                            Discover the world like never before with an
                            extensive selection of complimentary, expertly
                            guided shore excursions. Whether you’re exploring
                            ancient ruins, snorkeling in crystal-clear waters,
                            or sampling local cuisine, Regent’s excursions are
                            designed to immerse you in the culture and beauty of
                            each destination.
                          </p> */}
                          {/* <div className="reasons_book_slider">
                            <Slider {...settings}>
                              <div className="beb">
                                <img
                                  src={bg1}
                                  className="img-fluid"
                                  alt="Promotion 1"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 2"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 3"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 4"
                                />
                              </div>
                            </Slider>
                          </div> */}
                          {/* <hr /> */}
                          {/* <div className="get_in mb-3">
                            <span>Intimate Ships and Personalized Service</span>
                          </div>
                          <p>
                            With a limited number of guests onboard, Regent
                            Seven Seas Cruises ensures an intimate and uncrowded
                            atmosphere. The highly trained staff-to-guest ratio
                            means attentive and personalized service, making you
                            feel like royalty throughout your journey.
                          </p> */}
                          {/* <div className="reasons_book_slider">
                            <Slider {...settings}>
                              <div className="beb">
                                <img
                                  src={bg1}
                                  className="img-fluid"
                                  alt="Promotion 1"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 2"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 3"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 4"
                                />
                              </div>
                            </Slider>
                          </div> */}
                          {/* <hr /> */}
                          {/* <div className="get_in mb-3">
                            <span>
                              Access to Iconic and Remote Destinations
                            </span>
                          </div>
                          <p>
                            Regent’s carefully curated itineraries cover over
                            450 ports worldwide, from bucket-list landmarks to
                            hidden gems. With smaller ships, Regent can access
                            secluded destinations that larger vessels cannot,
                            offering unique and exclusive experiences.
                          </p> */}
                          {/* <div className="reasons_book_slider">
                            <Slider {...settings}>
                              <div className="beb">
                                <img
                                  src={bg1}
                                  className="img-fluid"
                                  alt="Promotion 1"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 2"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 3"
                                />
                              </div>
                              <div className="beb">
                                <img
                                  src={bg2}
                                  className="img-fluid"
                                  alt="Promotion 4"
                                />
                              </div>
                            </Slider>
                          </div> */}
                          {/* <hr /> */}
                        </div>
                        {/* <section className="be_inspired promotions">
                          <div className="container">
                            <h4>Regent Seven Seas Promotions</h4>
                            <div className="promotions_slider">
                              <Slider {...settings}>
                                <div className="beb">
                                  <img
                                    src={bg1}
                                    className="img-fluid"
                                    alt="Promotion 1"
                                  />
                                </div>
                                <div className="beb">
                                  <img
                                    src={bg2}
                                    className="img-fluid"
                                    alt="Promotion 2"
                                  />
                                </div>
                                <div className="beb">
                                  <img
                                    src={bg2}
                                    className="img-fluid"
                                    alt="Promotion 3"
                                  />
                                </div>
                                <div className="beb">
                                  <img
                                    src={bg2}
                                    className="img-fluid"
                                    alt="Promotion 4"
                                  />
                                </div>
                              </Slider>
                            </div>
                          </div>
                        </section> */}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="nav-brochures"
              role="tabpanel"
              aria-labelledby="nav-brochures-tab"
            >
              <div className="tab_info">
                <div className="explore_cruise_slider2 mb-5">
                  <div className="explore_list">
                    <div className="row">
                      {opratordata?.brochures?.map((item, index) => (
                        <div className="col-lg-3 " key={index}>
                          <div className="explore_list_c broo_img">
                            <a href={item.href} target="_blank">
                              <img
                                src={item?.thumbnail}
                                className="img-fluid"
                                alt={item?.name}
                              />
                            </a>
                            <b className="itt_namee">{item?.name}</b>
                            <div className="cs">
                              <a href={item?.href}>
                                <i className="ri-arrow-right-line" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="nav-members"
              role="tabpanel"
              aria-labelledby="nav-members-tab"
            >
              <div className="tab_info">
                <div className="explore_cruise_slider2 mb-5">
                  <div className="explore_list">
                    <div className="row">
                      <div className="col-lg-12">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              opratordata?.members_club
                            ),
                          }}
                        ></div>

                        {/* {stripHTML(opratordata?.members_club)} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default Oprator;
