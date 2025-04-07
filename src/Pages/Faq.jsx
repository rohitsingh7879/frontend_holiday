import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import contact_us from "../assets/images/contact_us.jpg";
import support from "../assets/images/icons/support.png";
import chat from "../assets/images/icons/chat.png";
import map from "../assets/images/map.png";
import faq from "../assets/images/faq.png";
import DOMPurify from "dompurify";
import '../assets/css/inner.css'

import Customersay from "../Component/Customersay";
import endpoints from "../utils/endpoints";
const Faq = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [faqdata, setFaq] = useState([]);
  const [newFaqData, setNewFaqData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const fetchAllCruiseLineData = async () => {
    fetch(`${import.meta.env.VITE_API_URL + endpoints?.faq}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setFaq(data.data[0]);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };
  const fetchNewFAQs = async () => {
    fetch(`${import.meta.env.VITE_API_URL + endpoints?.newFaq}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setNewFaqData(data?.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    fetchNewFAQs();
    fetchAllCruiseLineData();
  }, []);
  return (
    <>
      <section className="banner_inner">
        <div
          className="banner_photo_area"
          style={{ backgroundImage: `url(${contact_us})` }}
        />
        <div className="container xxin">
          <h1>Frequently Asked questions</h1>
          <span>
            <Link to="/">Home</Link> / Faq
          </span>
        </div>
      </section>
      <section className="content_part">
        <div className="container">
          {console.log("faq", faqdata)}
          <div className="get_in">
            <span>{faqdata?.have_a_ques}</span>
          </div>
          <h2>{faqdata?.freq_ask_ques}</h2>
          <div className="faqs">
            <div className="row">
              <div className="col-lg-4">
                <img src={faqdata?.FAQ_image} className="img-fluid" />
              </div>
              <div className="col-lg-8">
                <div
                  className="faq_inner"
                  style={{
                    maxHeight: "500px",
                    overflowY: "auto",
                  }}
                >
                  <div className="accordion" id="accordionExample">
                    {newFaqData
                      ?.filter((item) => item?.status === "Active")
                      ?.map((faq, index) => (
                        <div
                          className={`accordion-item ${
                            activeIndex === index ? "is-active" : ""
                          }`}
                          key={index}
                        >
                          <h2 className="accordion__header">
                            <button
                              className={`accordion-button ${
                                activeIndex === index ? "" : "collapsed"
                              }`}
                              type="button"
                              onClick={() => handleToggle(index)}
                              aria-expanded={
                                activeIndex === index ? "true" : "false"
                              }
                              aria-controls={`collapse${index}`}
                            >
                              {index + 1}
                              {"."} {faq.heading}
                            </button>
                          </h2>
                          <div
                            id={`collapse${index}`}
                            className={`accordion-collapse collapse ${
                              activeIndex === index ? "show" : ""
                            }`}
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion__body">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(faq?.description),
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="still_need">
            <h3>Still need help</h3>
            <p>
              Quam elementum pulvinar etiam non quam lacus suspendisse.A
              scelerisque purus semper Quam elementum pulvinar etiam non quam
              lacus suspendisse.A scelerisque purus semper{" "}
            </p>
            <div className="row">
              <div className="col-lg-4">
                <div className="contt_in text-center">
                  <img src={support} className="img-fluid" />
                  <h4>Call Support</h4>
                  <p>
                    We analyse your website’s structure,internal architecture
                    &amp; other key
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contt_in text-center">
                  <img src={chat} className="img-fluid" />
                  <h4>Chat with us</h4>
                  <p>
                    We are well known within the industry for our technical
                    capabilities
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contt_in text-center">
                  <img src={map} className="img-fluid" />
                  <h4>Address</h4>
                  <p>4517 Washington Ave. Manchester Kentucky 39495</p>
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

export default Faq;
