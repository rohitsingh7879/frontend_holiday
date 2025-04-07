import React, { useEffect } from "react";
import contact_us from "../assets/images/contact_us.jpg";
import supt from "../assets/images/icons/support.png";
import chat from "../assets/images/icons/chat.png";
import booking from "../assets/images/icons/booking.png";
import Cosec from "../assets/images/icons/icon4.png";
import icon5 from "../assets/images/icons/icon5.png";
import '../assets/css/inner.css'
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import endpoints from "../utils/endpoints";
const API_URL = import.meta.env.VITE_API_URL;

const Newsletter = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      let payload = {
        subscriberFirstName: data?.first_name,
        subscriberSurName: data?.last_name,
        subscriberEmail: data?.email,
      };
      let result = await axios.post(
        `${API_URL + endpoints?.subscribe_new}`,
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <section className="banner_inner">
        <div
          className="banner_photo_area"
          style={{ backgroundImage: `url(${contact_us})` }}
        />
        <div className="container xxin">
          <h1>Indulge in Our Exclusive, Unmissable Offers</h1>
          <span>
            <a href="index.php">Home</a> / SUBSCRIBE TO OUR NEWSLETTER
          </span>
        </div>
      </section>
      <section className="content_part">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="contact_form">
                <h2>Subscribe</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-lg-6">
                      <span>FIRST NAME</span>
                      <input
                        name="name"
                        type="text"
                        placeholder="First Name*"
                        {...register("first_name", {
                          required: "First name is required",
                          pattern: {
                            value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                            message: "First name is invalid",
                          },
                        })}
                      />
                      {errors?.first_name && <p className="text-danger">{errors?.first_name.message}</p>}
                    </div>
                    <div className="col-lg-6">
                      <span>Last NAME</span>
                      <input
                        name="surname"
                        type="text"
                        placeholder="Surname*"
                        {...register("last_name", {
                          required: "Last name is required",
                          pattern: {
                            value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                            message: "First name is invalid",
                          },
                        })}
                      />
                      {errors?.last_name && <p className="text-danger">{errors?.last_name.message}</p>}
                    </div>
                    <div className="col-lg-12">
                      <span>Email Address</span>
                      <input
                        name="email"
                        type="text"
                        placeholder="Email Address*"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email format",
                          },
                        })}
                      />
                      {errors?.email && <p className="text-danger">{errors?.email.message}</p>}
                    </div>
                    <div className="col-lg-3">
                      <input
                        type="submit"
                        defaultValue="Subscribe"
                        className="search_btn2"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="contact_right">
                <h4>Why Sign Up?</h4>
                <div className="why_up">
                  <ul>
                    <li> Exclusive deals</li>
                    <li> Last minute sale</li>
                    <li> special singles offers</li>
                    <li> Exclusive deals</li>
                    <li> Last minute sale</li>
                    <li> special singles offers</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="why mt50">
        <div className="container">
          <div className="text-center">
            <h2>Why Book with Holiday2?</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <div className="why_block">
                <img src={supt} className="img-fluid" />
                <h3>
                  Exclusive Offers Masterfully Curated by Our Prestigious
                  Product Team
                </h3>
                <p>
                  Enjoy privileged access to bespoke deals, thoughtfully
                  designed by our exceptionally experienced travel artisans.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="why_block">
                <img src={chat} className="img-fluid" />
                <h3>Esteemed UK-Based Sales Consultants</h3>
                <p>
                  Entrust your voyage to our elite team of seasoned experts,
                  dedicated to tailoring every aspect of your journey.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="why_block">
                <img src={booking} className="img-fluid" />
                <h3>Unrivalled Financial Security with ATOL Protection</h3>
                <p>
                  Embark with absolute confidence, assured that your investment
                  is impeccably safeguarded.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="why_block">
                <img src={Cosec} className="img-fluid" />
                <h3>Proud Members of CLIA – The Epitome of Cruise Expertise</h3>
                <p>
                  Benefit from the guidance of certified cruise specialists,
                  recognised for their unparalleled industry insight.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="why_block">
                <img src={icon5} className="img-fluid" />
                <h3>White-Glove CustomeR Care</h3>
                <p>
                  Delight in seamless, attentive support that ensures an
                  effortless experience from your first inquiry to your final
                  destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Newsletter;
