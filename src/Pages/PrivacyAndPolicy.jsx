import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import contact_us from "../assets/images/contact_us.jpg";
import DOMPurify from "dompurify";
import Customersay from "../Component/Customersay";
import endpoints from "../utils/endpoints";
import NewaLetterByEmail from "../Component/NewsLetterByEmail";
import axios from "axios";

const PrivacyAndPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [content, setContent] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const fetchContentData = async () => {
    try {
      let result = await axios.get(
        `${import.meta.env.VITE_API_URL + endpoints?.staticContent}?type=PrivacyAndPolicy`
      );
      console.log(result)
      if (result && result?.status == 200) {
        setContent(result?.data?.data);
      } else {
        console.log("Something went wrong...");
      }
    } catch (error) {
      console.log("Something went wrong...", error);
    }
  };

  useEffect(() => {
    fetchContentData();
  }, []);

 
  return (
    <>
      <section className="banner_inner">
        <div
          className="banner_photo_area"
          style={{ backgroundImage: `url(${contact_us})` }}
        />
        <div className="container xxin">
          <h1>Privacy And policy</h1>
          <span>
            <Link to="/">Home</Link> / Privacy and Policy
          </span>
        </div>
      </section>

      <section className="content_part">
        <div className="container">
          <div className="get_in">
            <span>Holiday2.com</span>
          </div>
          <h2>Privacy And policy</h2>

          <div className="faqs">
            <div className="row">
             
              <div className="col-lg-12">
                <div
                  className="faq_inner"
                 
                >
                  <div className="accordion" id="accordionExample">
                    {content
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
          
        </div>
      </section>
      <NewaLetterByEmail />
      <Customersay />
    </>
  );
};

export default PrivacyAndPolicy;
