import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import Customersay from "../Component/Customersay";
import contact_us from "../assets/images/contact_us.jpg";
import supt from "../assets/images/icons/support.png";
import chat from "../assets/images/icons/chat.png";
import map2 from "../assets/images/icons/map2.png";
import Cosec from "../Component/Cosec";
import DOMPurify from "dompurify";
import endpoints from "../utils/endpoints";
import '../App.css'
import '../assets/css/inner.css'
import SubscribeWithEmail from "../Component/SubscribeWithEmail";

const API_URL = import.meta.env.VITE_API_URL;
const Contact = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const [contactUsData, setContactUsData] = useState();
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    l_name: "",
    email_ads: "",
    tel_num: "",
    any_Comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitdata = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);

    axios
      .post(`${import.meta.env.VITE_API_URL + endpoints?.contactus}`, {
        fname: formData.name,
        lname: formData.l_name,
        email: formData.email_ads,
        phone: formData.tel_num,
        message: formData.any_Comment,
      })
      .then((res) => {
        console.log("Data submitted successfully", res);
        setAlert({
          show: true,
          title: "Success!",
          text: "Thank you for your message. We will get in touch with you shortly!",
          icon: "success",
        });
      })
      .catch((err) => {
        console.error("Error submitting data:", err);
        setAlert({
          show: true,
          title: "Error!",
          text: "There was an error submitting the form data.",
          icon: "error",
        });
      });
  };

  const handleAlertClose = () => {
    setFormData({
      name: "",
      l_name: "",
      email_ads: "",
      tel_num: "",
      any_Comment: "",
    });
    setAlert(null);
    navigate("/contact");
  };

  const fetchContactUsData = async () => {
    try {
      let response = await axios.get(
        `${API_URL + endpoints?.staticContent}?type=ContactUs`
      );
      console.log(response);
      if (response?.status === 200) {
        const sanitizedContent = DOMPurify.sanitize(
          response?.data?.data?.content
        );

        setContactUsData(sanitizedContent);
      } else {
        console.log(`Error fetching about us data: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchContactUsData();
  }, []);
  return (
    <>
   
      {alert && alert.show && (
        <SweetAlert2
          show={alert.show}
          title={alert.title}
          text={alert.text}
          icon={alert.icon}
          onConfirm={handleAlertClose} 
        />
      )}
      <section className="banner_inner">
        <div
          className="banner_photo_area"
          style={{ backgroundImage: `url(${contact_us})` }}
        />
        <div className="container xxin">
          <h1>Contact us</h1>
          <span>
            <a href="index.php">Home</a> / Contact us
          </span>
        </div>
      </section>
      <section className="content_part contact_us">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="contact_form">
                <div className="get_in">
                  <span>Get in Touch</span>
                </div>
                <h2>Send me a message</h2>

                <form name="frm" onSubmit={submitdata}>
                  <div className="row">
                    <div className="col-lg-6">
                      <span>FIRST NAME</span>
                      <input
                        name="name"
                        type="text"
                        placeholder="First Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6">
                      <span>Last NAME</span>
                      <input
                        name="l_name"
                        type="text"
                        placeholder="Last Name"
                        value={formData.l_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6">
                      <span>Email Address</span>
                      <input
                        name="email_ads"
                        type="text"
                        placeholder="Your Email"
                        value={formData.email_ads}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-6">
                      <span>Phone Number</span>
                      <input
                        name="tel_num"
                        type="text"
                        placeholder="Telephone Number"
                        value={formData.tel_num}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-12">
                      <span>Message</span>
                      <textarea
                        className="message"
                        name="any_Comment"
                        value={formData.any_Comment}
                        onChange={handleChange}
                        rows={14}
                        placeholder="Type your message here..."
                      />
                    </div>
                    <div className="col-lg-3">
                      <input
                        type="submit"
                        value="Send Message"
                        className="search_btn2"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="contact_right">
          <div dangerouslySetInnerHTML={{ __html: contactUsData }}></div>

                {/* <h4>Cruise Holiday Enquiries</h4>
                <div className="adds_area">
                  <p>
                    <b>
                      <i className="ri-phone-fill" /> CALL:
                    </b>{" "}
                    0203 884 2555 (Press 1 for Sales)
                  </p>
                  <p>
                    <b>
                      <i className="ri-mail-line" /> Email:
                    </b>{" "}
                    sales@holiday2.com
                  </p>
                </div>
                <div className="adds_area">
                  <b>Opening Hours: </b>
                  <ul>
                    <li>Monday - Friday: 8am - 8pm</li>
                    <li>Saturday - Sunday: 8am - 8pm</li>
                    <li>Bank Holidays: 8am - 6pm</li>
                  </ul>
                </div> */}
              </div>
              <div className="contact_right mt-5">
                {/* <h4>Customer Support</h4>
                <div className="adds_area">
                  <p>
                    <b>
                      <i className="ri-phone-fill" /> CALL:
                    </b>{" "}
                    0203 884 2555 (Press 2 for Customer Service)
                  </p>
                  <p>
                    <b>
                      <i className="ri-mail-line" /> Email:
                    </b>{" "}
                    sales@holiday2.com
                  </p>
                </div>
                <div className="adds_area">
                  <b>Opening Hours: </b>
                  <ul>
                    <li>Monday - Friday: 9:00am to 5:00pm</li>
                    <li>Saturday - Sunday: Closed</li>
                    <li>Bank Holidays: Closed</li>
                  </ul>
                </div> */}
                <div className="emg">
                  <span>
                    Emergency email:{" "}
                    <a href="mailto:emergency@cruise2.com">
                      emergency@cruise2.com
                    </a>
                  </span>
                </div>
                <div className="emg">
                  <span>
                    Press email:{" "}
                    <a href="mailto:media@cruise2.com">media@cruise2.com</a>
                  </span>
                </div>
                {/* <div className="adds_area mt-3">
                  <b>
                    <i className="ri-map-pin-line" /> Location:
                  </b>{" "}
                  Suite 248,Rye House, 161 High Street, Ruislip,Middlesex,HA4
                  8JY
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="still_need text-center still_icon">
            <h3>Still Need Help</h3>
            <p>
              We're here to assist you every step of the way! Whether you have
              questions, need additional support, or just want more information,
              our team is ready to help. Reach out to us via chat, call, or
              visit us in person – whatever works best for you.
            </p>
            <div className="row">
              <div className="col-lg-4">
                <div className="contt_in text-center">
                  <img src={supt} className="icon_img" />
                  <h4>Call Support</h4>
                  <p>
                    Reach us anytime at +44 1234 567890.
                    <br /> We're here to help!
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contt_in text-center">
                  <img src={chat} className="icon_img" />
                  <h4>Chat with us</h4>
                  <p>
                    Got questions? Chat live
                    <br /> with our team now!
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contt_in text-center">
                  <img src={map2} className="icon_img" />
                  <h4>Address</h4>
                  <p>
                    Suite 248, Rye House, 161 High Street,
                    <br />
                    Ruislip, Middlesex, HA4 8JY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Cosec />
       <SubscribeWithEmail/>
      <Customersay />
      </section>
    </>
  );
};

export default Contact;