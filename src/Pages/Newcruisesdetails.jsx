import React, { useEffect, useState, useNavigate } from "react";
import moment from "moment";
import "../assets/css/cruisedetails.css";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "../Component/Model";
import crt1 from "../assets/images/icons/date.png";
import crt2 from "../assets/images/icons/mobile.png";
import crt3 from "../assets/images/icons/time.png";
import shipicon from "../assets/images/icons/ship.png";

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
import endpoints from "../utils/endpoints";
import LocalMapContainer from "../Component/LocalMapContainer";
const ALL_POST_API = "https://www.widgety.co.uk/api/ports.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN =
  "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const Newcruisesdetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPortDetails, setAllPortsDetails] = useState([]);
  const [altdetails, setaltdetails] = useState([]);
  const fetchAllPorts = async () => {
    try {
      let resultAllPortData = await axios.get(
        `${ALL_POST_API}?app_id=${APP_ID}&token=${TOKEN}&limit=6000`,
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
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const { _id, details } = useParams();

  const detail = details?.split("_");
  const id = detail ? detail[detail?.length - 1] : undefined;
  const [cruiseDetail, setCruiseDetail] = useState({});
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("tab1");

  const removeHtmlTags = (str) => {
    return str?.replace(/<[^>]*>/g, "");
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(
      `${import.meta.env.VITE_API_URL + endpoints?.newpackage}?id=${_id || id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cruise details");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const cleanedData = {
            ...data.data[0],
            overview: removeHtmlTags(data.data[0].overview),
          };
          setCruiseDetail(cleanedData);
        } else {
          setError("No data found");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [_id]);

  const cleanHTML = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };

  // const [showFullList, setShowFullList] = useState(false);
  // const itemsToShow = 6;

  const [isExpanded, setIsExpanded] = useState(false);
  const ToShow = 10;

  const allItems = cruiseDetail?.whats_included || [];
  const visibleItems = isExpanded ? allItems : allItems.slice(0, ToShow);

  const firstColumnItems = visibleItems.slice(
    0,
    Math.min(5, visibleItems.length)
  );
  const secondColumnItems = visibleItems.slice(5);

  const handleToggleList = () => {
    setIsExpanded((prev) => !prev);
  };

  // ALTERNATE DATES  Limit Set
  const [showAll, setShowAll] = useState(false);
  const itemsToShow = 10;
  const sortedItems = [...altdetails].sort(
    (a, b) => new Date(a?.data?.starts_on) - new Date(b?.data?.starts_on)
  );
  const ALTItems = showAll ? sortedItems : sortedItems.slice(0, itemsToShow);
  // };

  const [showMore, setShowMore] = useState(false);

  const allImages = cruiseDetail?.accomodation_types?.flatMap(
    (accomodation_image) => accomodation_image?.images || []
  );
  const imagesToShow = showMore ? allImages : allImages?.slice(0, 6);

  const [zoomedIn, setZoomedIn] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);

  const handleImageClick = (imageHref) => {
    setClickedImage(imageHref);
    setZoomedIn(!zoomedIn);
  };

  async function fetchData() {
    try {
      let result = await Promise.all(
        cruiseDetail.cruises.map(async (item) => {
          try {
            if (item?.cruise) {
              let data = await axios.get(
                `${item?.cruise}?app_id=${APP_ID}&token=${TOKEN}`,
                {
                  headers: {
                    Accept: "application/json; api_version=2",
                  },
                }
              );
              return data;
            } else {
              console.warn("Cruise URL is missing for item:", item);
              return null;
            }
          } catch (error) {
            console.error("Error fetching data for item:", item, error);
            return null;
          }
        })
      );
      setaltdetails(result);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  useEffect(() => {
    if (
      cruiseDetail &&
      Array.isArray(cruiseDetail.cruises) &&
      cruiseDetail.cruises.length > 0
    ) {
      fetchData();
    }
  }, [cruiseDetail]);
  // Show only 3 data initially, Dininig show all after clicking Show More
  const [showdining, setDining] = useState(false);

  const visibleOptions = showdining
    ? cruiseDetail?.dining_options
    : cruiseDetail?.dining_options?.slice(0, 2);

  // Show only 2 data initially, show all after clicking Show More
  const [showEntertainment, setShowEntertainment] = useState(false);
  const visibleOption = showEntertainment
    ? cruiseDetail?.entertainment_types
    : cruiseDetail?.entertainment_types?.slice(0, 3);
  // Show only 2 items initially, show all after clicking Show More

  const [showHealthFitness, setShowHealthFitness] = useState(false);
  const visibleOpt = showHealthFitness
    ? cruiseDetail?.health_fitness_types
    : cruiseDetail?.health_fitness_types?.slice(0, 1);
  return (
    <>
      <section className="banner_new">
        <div
          id="demo"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src={cruiseDetail?.cruise_banner_image}
                alt="Collection"
                className="d-block"
                style={{ width: "100%" }}
              />
              <div className="bg-overlay_opcity" />
            </div>
          </div>
        </div>
      </section>

      <section className="middle_data">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="left_bar">
                <h1>{cruiseDetail.name}</h1>
                <div className="info_area">
                  <ul>
                    <li>
                      <img src={shipicon} /> {cruiseDetail?.ship}
                    </li>
                    <li>
                      <img src={crt1} />
                      {cruiseDetail?.itinerary
                        ?.slice(0, 1)
                        .map((itineraryItem, index) => (
                          <span key={index}>
                            {itineraryItem.check_in_date
                              ? moment
                                  .unix(itineraryItem.check_in_date)
                                  .format("DD MMM YYYY")
                              : ""}
                          </span>
                        ))}
                    </li>
                    <li>
                      <img src={crt2} /> Ref: {cruiseDetail?.reference}
                    </li>
                    <li>
                      <img src={crt3} /> Duration:
                      {cruiseDetail?.itinerary
                        ?.slice(-1)
                        .map((itineraryItem, index) => (
                          <span
                            key={index}
                            style={{ marginRight: "5px", marginLeft: "5px" }}
                          >
                            {itineraryItem.day}
                          </span>
                        ))}{" "}
                      Nights
                    </li>
                  </ul>
                </div>

                <div className="content_area">
                  <p className="overview_text">{cruiseDetail?.overview}</p>
                </div>

                <div className="included">
                  <h4>What’s included</h4>
                  <div className="row">
                    <div className="col-lg-7">
                      <ul>
                        {firstColumnItems.map((include, index) => (
                          <li key={index}>
                            <img
                              src={include?.icon}
                              className="img-fluid"
                              alt="icon"
                            />
                            {"   "}
                            {include?.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="col-lg-5">
                      <ul>
                        {firstColumnItems.length >= 5 &&
                          secondColumnItems.map((include, index) => (
                            <li key={index + firstColumnItems.length}>
                              <img
                                src={include?.icon}
                                className="img-fluid"
                                alt="icon"
                              />{" "}
                              {include?.name}
                            </li>
                          ))}

                        {allItems.length > ToShow && (
                          <li>
                            <a
                              href="javascript:void(0)"
                              onClick={handleToggleList}
                            >
                              <b>
                                {isExpanded
                                  ? "Show less"
                                  : `+${allItems.length - ToShow} more`}
                              </b>
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
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
                            {cruiseDetail?.itinerary
                              ?.sort(
                                (a, b) =>
                                  new Date(a.check_in_date) -
                                  new Date(b.check_in_date)
                              )
                              ?.map((itinerary, index) => {
                                let portImage = null;
                                if (itinerary && itinerary.images.length == 0) {
                                  portImage = fetchParticularImage(
                                    itinerary?.port
                                  );
                                } else {
                                  portImage = itinerary.images[0].href;
                                }
                                return (
                                  <div className="accordion-item" key={index}>
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
                                          Day {itinerary?.day}:{" "}
                                          {itinerary.check_in_date
                                            ? moment
                                                .unix(itinerary.check_in_date)
                                                .format("DD MMM YYYY")
                                            : ""}
                                        </b>{" "}
                                        {itinerary?.port}
                                      </button>
                                    </h2>
                                    <div
                                      id={`collapse${index}`}
                                      className="accordion-collapse collapse"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="accordion-body">
                                        {portImage && (
                                          <img
                                            src={portImage}
                                            className="img-fluid mb-3"
                                          />
                                        )}
                                        <p className="itinerary_desc">
                                          {itinerary?.description?.replace(
                                            /<[^>]+>/g,
                                            ""
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>

                          <a
                            href="javascript:void(0)"
                            className="action_btn mt-4"
                          >
                            VIEW MORE
                          </a>
                        </div>
                        <div className="top_hightligh">
                          <h4>TOUR HIGHLIGHTS</h4>
                          <div className="row">
                            {cruiseDetail?.tour?.map((tour, index) => (
                              <div className="col-lg-3" key={index}>
                                <div className="high_c">
                                  <img src={tour?.icon} className="img-fluid" />
                                  <p>{tour?.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <hr />
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
                        <div className="adons included ">
                          <ul>
                            {cruiseDetail?.addOn?.map((addon, index) => (
                              <li key={index}>
                                <img
                                  src={addon?.icon}
                                  class="img-fluid"
                                  alt="icon"
                                />
                                {addon?.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <section className="be_inspired mt-5">
                        <div className="container p-0">
                          <h4>ship gallery</h4>
                          <div className="row">
                            {imagesToShow?.map((image, imageIndex) => (
                              <div className="col-lg-6" key={imageIndex}>
                                <div className="beb mb-4">
                                  <img
                                    src={image.href}
                                    className="img-fluid"
                                    alt="Accommodation"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {allImages?.length > 6 && !showMore && (
                            <button
                              className="action_btn"
                              onClick={() => setShowMore(true)}
                            >
                              View more
                            </button>
                          )}

                          {showMore && allImages?.length > 6 && (
                            <button
                              className="action_btn"
                              onClick={() => setShowMore(false)}
                            >
                              View less
                            </button>
                          )}
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
                          <tbody>
                            {ALTItems?.map((altdate, index) => {
                              const formattedDate = new Date(
                                altdate?.data?.starts_on
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              });

                              return (
                                <tr key={index}>
                                  <th>{formattedDate}</th>
                                  <td>
                                    From £
                                    {altdate?.data?.cruise_only_price || "N/A"}
                                  </td>
                                  <td>{altdate?.data?.cruise_nights} Nights</td>
                                  <td className="btn_mag text-end">
                                    <Link
                                      data-bs-toggle="modal"
                                      data-bs-target="#enquiry_now"
                                      className="enquiry_btn "
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openModal();
                                      }}
                                    >
                                      ENQUIRE NOW
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {altdetails?.length > itemsToShow && (
                          <a
                            onClick={() => setShowAll(!showAll)}
                            className="enquiry_btn custom mt-4"
                          >
                            {showAll ? "Show Less" : "Show More"}
                          </a>
                        )}
                      </div>
                      <div className="top_hightligh">
                        <h4>TOUR HIGHLIGHTS</h4>
                        <div className="row">
                          {cruiseDetail?.tour?.map((tour, index) => (
                            <div className="col-lg-3" key={index}>
                              <div className="high_c">
                                <img src={tour?.icon} className="img-fluid" />
                                <p>{tour.name}</p>
                              </div>
                            </div>
                          ))}
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
                              {cruiseDetail?.teaser?.replace(/<[^>]+>/g, "")}
                            </p>
                            <br />

                            <p className="overview">
                              {cruiseDetail?.unique_feature?.replace(
                                /<[^>]+>/g,
                                ""
                              )}
                            </p>
                            <hr />
                            <section className="be_inspired">
                              <div className="container p-0">
                                <h4>ship gallery</h4>
                                <div className="row">
                                  {imagesToShow?.map((image, imageIndex) => (
                                    <div className="col-lg-6" key={imageIndex}>
                                      <div className="beb mb-4">
                                        <img
                                          src={image.href}
                                          className="img-fluid"
                                          alt="Accommodation"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {allImages?.length > 6 && !showMore && (
                                  <button
                                    className="action_btn"
                                    onClick={() => setShowMore(true)}
                                  >
                                    View more
                                  </button>
                                )}
                                {showMore && allImages?.length > 6 && (
                                  <button
                                    className="action_btn"
                                    onClick={() => setShowMore(false)}
                                  >
                                    View less
                                  </button>
                                )}
                              </div>
                            </section>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-decks"
                            role="tabpanel"
                            aria-labelledby="pills-decks-tab"
                          >
                            {cruiseDetail?.deckplans?.map((deck, index) => (
                              <div className="deck_info" key={index}>
                                <p>{deck.name}</p>

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
                                            return <li key={i}>{itemText}</li>;
                                          })}
                                      </ul>
                                    </div>
                                  </div>

                                  <div className="col-lg-8">
                                    <div className="deck_layout">
                                      {deck?.images &&
                                        deck?.images.length > 0 &&
                                        deck?.images.map((image, imgIndex) => (
                                          <Zoom key={imgIndex}>
                                            <img
                                              src={image.href}
                                              alt={image.name}
                                              className="img-fluid"
                                              style={{ cursor: "pointer" }}
                                            />
                                          </Zoom>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-contact"
                            role="tabpanel"
                            aria-labelledby="pills-contact-tab"
                          >
                            <h4>Entertainment</h4>
                            <p className="overview">
                              {cruiseDetail?.entertainment?.intro?.replace(
                                /<[^>]+>/g,
                                ""
                              )}
                            </p>

                            {/* Entertainment Options */}
                            {visibleOption && visibleOption.length > 0 ? (
                              visibleOption.map((option, index) => (
                                <div className="overview" key={index}>
                                  <p
                                    className="overview"
                                    dangerouslySetInnerHTML={{
                                      __html: option.description,
                                    }}
                                  ></p>

                                  {/* Image Gallery */}
                                  {option?.images &&
                                    option?.images.length > 0 && (
                                      <div className="accordion-body">
                                        {option?.images.map((img, imgIndex) => (
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

                            {/* Show More Button */}
                            {cruiseDetail?.entertainment_types?.length > 2 && (
                              <div className="text-center mt-3">
                                <button
                                  onClick={() =>
                                    setShowEntertainment(!showEntertainment)
                                  }
                                  className="round_btn"
                                >
                                  {showEntertainment
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
                              {cruiseDetail?.health_and_fitness?.intro?.replace(
                                /<[^>]+>/g,
                                ""
                              )}
                            </p>

                            {/* Health and Fitness Options */}
                            {visibleOpt && visibleOpt.length > 0 ? (
                              visibleOpt.map((option, index) => (
                                <div className="dining-option" key={index}>
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
                                        {option?.images.map((img, imgIndex) => (
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
                              <p>No health & fitness options available.</p>
                            )}

                            {/* Show More Button */}
                            {cruiseDetail?.health_fitness_types?.length > 2 && (
                              <div className="text-center mt-3">
                                <button
                                  onClick={() =>
                                    setShowHealthFitness(!showHealthFitness)
                                  }
                                  className="round_btn"
                                >
                                  {showHealthFitness
                                    ? "Show Less"
                                    : "Show More"}
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
                              {cruiseDetail?.kids_and_teens?.intro?.replace(
                                /<[^>]+>/g,
                                ""
                              )}
                            </p>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="pills-profile"
                            role="tabpanel"
                            aria-labelledby="pills-profile-tab"
                          >
                            <h4>Dining</h4>

                            {visibleOptions && visibleOptions.length > 0 ? (
                              visibleOptions.map((option, index) => (
                                <div className="dining-option" key={index}>
                                  <strong className="overview">
                                    {option?.name}
                                  </strong>
                                  <p className="overview">
                                    {option?.experience}
                                  </p>
                                  <p className="overview">{option?.food}</p>
                                  <p
                                    className="overview"
                                    dangerouslySetInnerHTML={{
                                      __html: option.description,
                                    }}
                                  ></p>

                                  {option?.images &&
                                    option?.images.length > 0 && (
                                      <div className="accordion-body">
                                        {option.images.map((img, imgIndex) => (
                                          <img
                                            key={imgIndex}
                                            src={img?.href}
                                            alt={img.name}
                                            className="img-fluid mb-3"
                                          />
                                        ))}
                                      </div>
                                    )}
                                </div>
                              ))
                            ) : (
                              <p>No dining options available.</p>
                            )}

                            {cruiseDetail?.dining_options?.length > 2 && (
                              <div className="text-center mt-3">
                                <button
                                  onClick={() => setDining(!showdining)}
                                  className="action_btn"
                                >
                                  {showdining ? "Show Less" : "Show More"}
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
                      <LocalMapContainer portDetail={cruiseDetail?.itinerary}/>
                      {/* <iframe
                        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d112097.08186541617!2d77.24885328261715!3d28.59876255819789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sgoogle%20map!5e0!3m2!1sen!2sin!4v1741772650189!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: "0" }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map"
                      ></iframe> */}
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="right_area">
                <div className="text-center">
                  <img
                    src={cruiseDetail?.mobile_cruise_banner_image}
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
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(cruiseDetail?.insidePerPersonWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>
                                  WAS £ {cruiseDetail?.insidePerPersonWas} pp
                                </del>{" "}
                                <b>
                                  NOW £ {cruiseDetail?.insidePerPersonNow} PP
                                </b>
                              </>
                            )}
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
                            ].includes(cruiseDetail?.outsidePerPersonWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>
                                  WAS £ {cruiseDetail?.outsidePerPersonWas} pp
                                </del>{" "}
                                <b>
                                  NOW £ {cruiseDetail?.outsidePerPersonNow} PP
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
                            ].includes(cruiseDetail?.balconyPerPersonWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>
                                  WAS £ {cruiseDetail?.balconyPerPersonWas} pp
                                </del>{" "}
                                <b>
                                  NOW £ {cruiseDetail?.balconyPerPersonNow} PP
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
                            ].includes(cruiseDetail?.suitePerPersonWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>
                                  WAS £ {cruiseDetail?.suitePerPersonWas} pp
                                </del>{" "}
                                <b>
                                  NOW £ {cruiseDetail?.suitePerPersonNow} PP
                                </b>
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
                            <p>INSIDE </p>
                            {[
                              "",
                              null,
                              undefined,
                              0,
                              "0",
                              "0.00",
                              "000",
                            ].includes(cruiseDetail?.insideSoloWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>
                                  WAS £ {cruiseDetail?.insideSoloWas} pp
                                </del>{" "}
                                <b>NOW £ {cruiseDetail?.insideSoloNow} PP</b>
                              </>
                            )}
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
                            ].includes(cruiseDetail?.outsideSoloWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>
                                  WAS £ {cruiseDetail?.outsideSoloWas} pp
                                </del>{" "}
                                <b>NOW £ {cruiseDetail?.outsideSoloNow} PP</b>
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
                            ].includes(cruiseDetail?.balconySoloWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>
                                  WAS £ {cruiseDetail?.balconySoloWas} pp
                                </del>{" "}
                                <b>NOW £ {cruiseDetail?.balconySoloNow} PP</b>
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
                            ].includes(cruiseDetail?.SuiteSoloWas) ? (
                              <p>Call Us</p>
                            ) : (
                              <>
                                <del>WAS £ {cruiseDetail?.SuiteSoloWas} pp</del>{" "}
                                <b>NOW £ {cruiseDetail?.SuiteSoloNow} PP</b>
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
                    <a href="tel:02038842555" className="enquiry_btn">
                      0203 884 2555
                    </a>
                    <Link
                      data-bs-toggle="modal"
                      data-bs-target="#enquiry_now"
                      className="enquiry_btn"
                      onClick={(e) => {
                        e.preventDefault();
                        openModal();
                      }}
                    >
                      {" "}
                      ENQUIRE NOW{" "}
                    </Link>
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
        <SimilarCruises cname={cruiseDetail?.ship} />
      </section>
      {isModalOpen && cruiseDetail && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          cruiseDetail={cruiseDetail}
        />
      )}
    </>
  );
};

export default Newcruisesdetails;
