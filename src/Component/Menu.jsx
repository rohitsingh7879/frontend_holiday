import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/megamenu.css";
import logo from "../assets/images/holiday.png";
import endpoints from "../utils/endpoints";
import { useMediaQuery } from "@mui/material";
import { debounce } from "lodash";

const API_OPRATOR = "https://www.widgety.co.uk/api/operators.json";
const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const Menu = () => {
  const [isSidebarOpen, setisSidebarOpen] = useState(false);
  const [isSubMenuOpen, setisSubMenuOpen] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedOprator, setSelectedOprator] = useState("");
  const [regions, setRegions] = useState([]);
  const [oprators, setOperator] = useState([]);
  const [newoprators, setOperatornew] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [cat, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:768px)");

  const fetchOprator = async () => {
    try {
      const response = await fetch(
        `${API_OPRATOR}?app_id=${APP_ID}&token=${TOKEN}&limit=35`,
        { headers: { Accept: "application/json;api_version=2" } }
      );
      const getoprator = await response.json();

      if (getoprator && getoprator.operators) {
        const operatorData = getoprator.operators.map((operator) => ({
          oprator_id: operator.id,
        }));

        setOperatornew(operatorData);
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };

  useEffect(() => {
    fetchOprator();
  }, []);

  const debounceSearchAPI = debounce((search_text) => {
    navigate(`/cruisecollection?search_text=${search_text}`);
    setIsSearchActive(false)
  }, 1000);

  const handleOpratorSelect = (opratorValue) => {
    setSelectedOprator(opratorValue);
    setisSidebarOpen(false);
    navigate(`/oprator?oprator=${opratorValue}`);
  };

  const fetchRegions = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=500`,
        { headers: { Accept: "application/json;api_version=2" } }
      );
      const getregions = await response.json();

      if (getregions && getregions.cruises) {
        const uniqueRegions = [
          ...new Set(getregions.cruises.flatMap((cruise) => cruise.regions)),
        ];

        setRegions(
          uniqueRegions.map((region) => ({ value: region, label: region }))
        );
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setisSidebarOpen(false);
    navigate(`/regions?region=${region}`);
  };

  const fetchcateData = async () => {
    fetch(`${import.meta.env.VITE_API_URL + endpoints?.newCategory}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        console.log("menucate", data.data);
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError(error);
      });
  };
  
  useEffect(() => {
    fetchcateData();
  }, []);

  return (
    <div className="menu_area">
      {isMobile ? (
        <div className="container-fluid">
          <div className="row align-items-center">
            {!isSearchActive && (
              <>
                <div className="col-lg-2">
                  <Link to="/">
                    <img
                      src={logo}
                      alt="Company Logo"
                      className="img-fluid logo"
                    />
                  </Link>
                </div>

                <div className="col-lg-10">
                  <div
                    id="toggle"
                    className={`${isSidebarOpen ? "on" : ""}`}
                    onClick={() => setisSidebarOpen(!isSidebarOpen)}
                  >
                    <div className="one"></div>
                    <div className="two"></div>
                    <div className="three"></div>
                  </div>

                  <div
                    className="sidebar-navigation"
                    style={{
                      display: isSidebarOpen ? "block" : "",
                    }}
                  >
                    <ul>
                      <li
                        className={`mega ${
                          isSubMenuOpen === 1 ? "selected" : ""
                        }`}
                        onClick={() =>
                          setisSubMenuOpen((prev) => (prev != 1 ? 1 : 0))
                        }
                      >
                        <a href="#">
                          Destinations{" "}
                          <em className="mdi ri-arrow-down-s-line"></em>
                        </a>
                        <ul
                          className="subMenuColor1"
                          style={{
                            display: isSubMenuOpen === 1 ? "block" : "",
                          }}
                        >
                          <div className="container">
                            <div className="row m-0">
                              {regions.map((region, index) => (
                                <li key={index}>
                                  <Link
                                    to={`/regions?region=${region.value}`}
                                    onClick={() =>
                                      handleRegionSelect(region.value)
                                    }
                                  >
                                    {region.label}
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </div>
                        </ul>
                      </li>

                      <li
                        className={`mega ${
                          isSubMenuOpen === 2 ? "selected" : ""
                        }`}
                        onClick={() =>
                          setisSubMenuOpen((prev) => (prev != 2 ? 2 : 0))
                        }
                      >
                        <a href="#">
                          Cruise Lines{" "}
                          <em className="mdi ri-arrow-down-s-line" />
                        </a>
                        <ul
                          className="subMenuColor1"
                          style={{
                            display: isSubMenuOpen === 2 ? "block" : "",
                          }}
                        >
                          {newoprators.map((oprator, index) => (
                            <li key={index}>
                              <Link
                                to={`/oprator?oprator=${oprator.oprator_id}`}
                                onClick={() =>
                                  handleOpratorSelect(oprator.oprator_id)
                                }
                              >
                                {oprator.oprator_id.charAt(0).toUpperCase() +
                                  oprator.oprator_id.slice(1)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <Link to="/cruisecollection">Cruise Collection</Link>
                      </li>
                      {cat &&
                        cat
                          .filter((item) => item?.categoryType === "Header")
                          .map((item) => {
                            return (
                              // eslint-disable-next-line react/jsx-key
                              <li>
                                {" "}
                                <Link
                                  to={`/cruisecollection?categories=${item?.categoryName}`}
                                >
                                  {item?.categoryName}
                                </Link>
                              </li>
                            );
                          })}

                      <li>
                        <Link
                          to="javascript:void(0)"
                          className="search_arr"
                          onClick={() => setIsSearchActive(true)}
                        >
                          {" "}
                          Search here
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            {/* Search Bar */}
            {isSearchActive && (
              <div className="col-12  position-relative">
                <input
                  type="text"
                  className="search-input w-100 search-input-box"
                  placeholder="Search..."
                  onChange={(e) => {
                    debounceSearchAPI(e.target.value);
                  }}
                />
                <span
                  className="position-absolute end-0 me-5 search-input-box-cross"
                  onClick={() => setIsSearchActive(false)}
                >
                  &times;
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row align-items-center">
            {!isSearchActive && (
              <>
                <div className="col-lg-2">
                  <Link to="/">
                    <img src={logo} alt="Company" className="img-fluid logo" />
                  </Link>
                </div>

                <div className="col-lg-10">
                  <div id="toggle">
                    <div className="one"></div>
                    <div className="two"></div>
                    <div className="three"></div>
                  </div>

                  <div className="sidebar-navigation">
                    <ul>
                      <li className="mega">
                        <a href="#">
                          Destinations{" "}
                          <em className="mdi ri-arrow-down-s-line"></em>
                        </a>
                        <ul className="subMenuColor1">
                          <div className="container">
                            <div className="row m-0">
                              {regions.map((region, index) => (
                                <li key={index}>
                                  <Link
                                    to={`/regions?region=${region.value}`}
                                    onClick={() =>
                                      handleRegionSelect(region.value)
                                    }
                                  >
                                    {region.label}
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </div>
                        </ul>
                      </li>

                      <li className="mega">
                        <a href="#">
                          Cruise Lines{" "}
                          <em className="mdi ri-arrow-down-s-line" />
                        </a>
                        <ul className="subMenuColor1">
                          {newoprators.map((oprator, index) => (
                            <li key={index}>
                              <Link
                                to={`/oprator?oprator=${oprator.oprator_id}`}
                                onClick={() =>
                                  handleOpratorSelect(oprator.oprator_id)
                                }
                              >
                                {oprator.oprator_id.charAt(0).toUpperCase() +
                                  oprator.oprator_id.slice(1)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <Link to="/cruisecollection">Cruise Collection</Link>
                      </li>
                      {cat &&
                        cat
                          .filter((item) => item?.categoryType === "Header")
                          .map((item, index) => {
                            return (
                              <li key={index}>
                                {" "}
                                <Link
                                  to={`/cruisecollection?categories=${item?.categoryName}`}
                                >
                                  {item?.categoryName}
                                </Link>
                              </li>
                            );
                          })}

                      {/* <li><Link to="/cruisecollection?categories=2025">2025</Link></li>
              <li><Link to="/cruisecollection?categories=2026">2026</Link></li>
              <li><Link to="/cruisecollection?categories=2027">2027</Link></li> */}
                      <li>
                        <Link
                          to="javascript:void(0)"
                          className="search_arr"
                          onClick={() => setIsSearchActive(true)}
                        >
                          {" "}
                          Search here
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}
            {/* Search Bar */}
            {isSearchActive && (
              <div className="col-12  position-relative">
                <input
                  type="text"
                  className="search-input w-100 search-input-box"
                  placeholder="Search..."
                  onChange={(e) => {
                    debounceSearchAPI(e.target.value);
                  }}
                />
                <span
                  className="position-absolute end-0 me-5 search-input-box-cross"
                  onClick={() => setIsSearchActive(false)}
                >
                  &times;
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
