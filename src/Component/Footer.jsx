import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import paymentLogo from "../assets/images/footer_pay_logo.png";
import prodectLogo from "../assets/images/prodect.png";
import cliaLogo from "../assets/images/CLIA_2016.png";
import Ourclient from "./Ourclient";
import "../assets/css/footer.css";

import axios from "axios";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import endpoints from "../utils/endpoints";
const API_URL = import.meta.env.VITE_API_URL;
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    
    try {
      let payload = {
        subscriberEmail: data?.email,
        type: "offers",
      };
      let result = await axios.post(
        `${API_URL + endpoints?.subscribe_new_withmail}`,
        payload
      );

      if (result && result?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Subscribed successfully.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          reset();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Error in subscription",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.response?.data?.message,
        showConfirmButton: false,
        timer: 1500,
      });
      // console.log("Something went wrong...", error);
    }
  };
  return (
    <>
      <Ourclient />
      <footer>
        <div className="footer_part">
          <div className="container">
            <div className="row">
              <div className="col-lg-10">
                <Link to={"/"}>
                <img src={logo} className="img-fluid foot_logo" alt="Logo" style={{
                  cursor:"pointer"
                }}/>
                </Link>

                <div className="row">
                  <div className="col-lg-7">
                    <div className="foot">
                      <h4>Explore</h4>
                      <div className="itms_footer_list">
                        <div>
                          <ul>
                            <li>
                              <Link to="/">Home</Link>
                            </li>
                            <li>
                              <Link to="/AboutUs">About us</Link>
                            </li>
                            <li>
                              <Link to="/contact">Contact Us</Link>
                            </li>
                            <li>
                              <Link to="#">Terms & Conditions</Link>
                            </li>
                            <li>
                              <a href="/privacy-and-policy">Privacy Policy</a>
                            </li>
                            <li>
                              <a href="/career-oportunity">Career Opportunities</a>
                            </li>
                            <li>
                              <Link to="/faq">FAQ</Link>
                            </li>
                            <li>
                              <a href="#">Foreign Travel Advice</a>
                            </li>
                            <li>
                              <Link to="/newsletter">Newsletter Signup</Link>
                            </li>
                            <li>
                              <Link to="/cruisecollection">
                                Cruise Collections
                              </Link>
                              {/* <Link to="/cruisecollection?categories=Cruise-Deals">
                                Cruise Deals
                              </Link> */}
                            </li>
                            <li>
                              <Link to="/cruisecollection?categories=Last-Minute-Deals">
                                Last Minute Deals
                              </Link>
                            </li>
                            <li>
                              <Link to="/cruisecollection?categories=All-Inclusive-Crusises">
                                All Inclusive Deals
                              </Link>
                            </li>
                            <li>
                              <Link to="/cruisecollection?categories=Sail-from-UK">
                                Sail from UK
                              </Link>
                            </li>
                            <li>
                              <Link to="/cruisecollection?categories=Luxury-Cruises">
                                Luxury Cruises
                              </Link>
                            </li>
                            <li>
                              <Link to="/cruisecollection?categories=2025">
                                2025 Cruises
                              </Link>
                            </li>
                            <li>
                              <Link to="/cruisecollection?categories=2026">
                                2026 Cruises
                              </Link>
                            </li>
                            <li>
                              <Link to="/cruisecollection?categories=2027">
                                2027 Cruises
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="foot_sub">
                      <h4>Sign up for exclusive offers</h4>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="subc_form">
                          <input
                            name="email"
                            type="text"
                            placeholder="Enter Your Email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email format",
                              },
                            })}
                          />
                          <input
                            type="submit"
                            value="Subscribe"
                            className="subscc_btn"
                          />
                        </div>
                        {errors.email && <p className="mt-2" style={{
                          fontSize:"14px"
                        }}>{errors.email.message}</p>}

                      </form>

                      <span>Your email is safe with us, we don’t spam.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-2 p-0">
                <div className="foot mspace">
                  <h4>PAYMENT METHODS</h4>
                  <img
                    src={paymentLogo}
                    className="img-fluid"
                    alt="Payment Methods"
                  />
                </div>
                <div className="foot mspace mt-3">
                  <h4>Company Information</h4>
                  <p>
                    Suite 248, Rye House, 161 High Street, Ruislip, Middlesex,
                    HA4 8JY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="protection">
          <div className="container">
            <h4>Your Financial Protection</h4>
            <p>
              Many of the flights and flight-inclusive holidays on this website
              are financially protected by the ATOL scheme, but ATOL protection
              does not apply to the other services offered on this site. Please
              ask us to confirm what protection may apply to your booking. When
              you pay, you will be supplied with an ATOL Certificate. Please ask
              for it and check to ensure that everything you booked (flights,
              cruises, hotels, and other services) is listed on it. Please see
              the tour operator(s)’s booking conditions for further information
              or go to www.atol.org.uk for more information about financial
              protection and the ATOL Certificate.
            </p>
          </div>
        </div>

        <div className="copy_right">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-4">
                <div className="copy_c">© Copyright Holiday2 {currentYear}</div>
              </div>
              <div className="col-lg-8">
                <div className="end_glogo">
                  <div className="foot_social">
                    <h4>Follow us</h4>
                    <ul>
                      <li>
                        <a href="#">
                          <i className="ri-twitter-fill"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ri-instagram-fill"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ri-pinterest-fill"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="ri-youtube-fill"></i>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <img
                    src={prodectLogo}
                    className="img-fluid"
                    alt="Protection Logo"
                  />
                  <img src={cliaLogo} className="img-fluid" alt="CLIA Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;