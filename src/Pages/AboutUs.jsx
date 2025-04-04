import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Customersay from "../Component/Customersay";
import banner from "../assets/images/banner1.jpg";
import mountain from "../assets/images/mountain.jpg";
import pe from "../assets/images/pople.jpg";
import about_img from "../assets/images/about_img.png";
import about_img1 from "../assets/images/about_g1.png";
import about_img2 from "../assets/images/about_g2.png";
import about_img3 from "../assets/images/about_g3.png";
import about_img4 from "../assets/images/about_g4.png";
import logo from "../assets/images/logo_big.png";
import Swal from "sweetalert2";

import g from "../assets/images/be1.png";
import axios from "axios";
import endpoints from "../utils/endpoints";
import DOMPurify from "dompurify";
import { useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL;

const AboutUs = () => {
  const [aboutus, setAboutUs] = useState();
  const [aboutusImagesData, setAboutUsImagesData] = useState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const fetchAboutUs = async () => {
    try {
      let response = await axios.get(
        `${API_URL + endpoints?.staticContent}?type=AboutUs`
      );
      console.log(response);
      if (response?.status === 200) {
        const sanitizedContent = DOMPurify.sanitize(
          response?.data?.data?.content
        );

        setAboutUs(sanitizedContent);
      } else {
        console.log(`Error fetching about us data: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAboutUsImagesData = async () => {
    try {
      let response = await axios.get(
        `${API_URL + endpoints?.getImagesData}?type=AboutUs`
        // `http://localhost:4000/holiday/files/get-images-data/?type=AboutUs`
      );
      console.log(response);
      if (response?.status === 200) {
        const result = response?.data?.data?.[0];

        setAboutUsImagesData(result);
      } else {
        console.log(`Error fetching about us data: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      let payload = {
        type:"newsletter",
        subscriberEmail: data?.email,
      };
      let result = await axios.post(
        `${API_URL + endpoints?.subscribe_new_withmail}`,
        payload
      );

      if (result && result?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Subscribe successfully.",
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
    fetchAboutUs();
    fetchAboutUsImagesData();
  }, []);
  return (
    <>
      <section
        className="banner_inner_abs"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="container">
          <div className="posd">
            <img src={logo} className="img-fluid" />
            <span>Where Luxury Begins</span>
          </div>
        </div>
      </section>
      <section className="content_part about_partt">
        <div className="container ">
          <div dangerouslySetInnerHTML={{ __html: aboutus }}></div>
          <div className="row">
            <div className="col-lg-8">
              <div className="our_bespoke">
                <span>Subtitle</span>
                <h4> {aboutusImagesData?.title}</h4>
                <p>{aboutusImagesData?.description}</p>
                <a href="#" className="action_btn ">
                  Meet our cruise connoisseurs
                </a>
                <div className="about_g">
                  <div className="row">
                    {aboutusImagesData &&
                      aboutusImagesData?.files?.map((img, index) => {
                        return (
                          <div className="col-lg-3" key={index}>
                            <img
                              src={img?.url}
                              className="img-fluid"
                              style={{
                                objectFit: "cover",
                                height: "210px",
                                width: "100%",
                                borderRadius: "5px",
                              }}
                            />
                          </div>
                        );
                      })}

                    {/* <div className="col-lg-3">
                      <img src={about_img2} className="img-fluid" />
                    </div>
                    <div className="col-lg-3">
                      <img src={about_img3} className="img-fluid" />
                    </div> */}
                    <div className="col-lg-3">
                      <img src={about_img4} className="img-fluid" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="abu_photo">
                <img src={about_img} className="img-fluid" />
              </div>
            </div>
          </div>
          <hr />
          <div className="our_bespoke mt-3">
            <span>Subtitle</span>
            <h4>Unrivalled financial security</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              pretium porta faucibus. Nulla mattis pretium ullamcorper. Donec
              suscipit risus risus, a lobortis dolor pellentesque eu. Nunc
              fermentum, lacus et semper accumsan, urna est dictum ipsum, vel
              dignissim ligula orci sit amet eros. Aliquam vehicula lectus
              ligula, nec tempus justo lobortis sed. Maecenas a nunc eu enim
              accumsan convallis. Proin convallis vestibulum turpis sed sodales.
              Phasellus pellentesque pulvinar mi nec aliquam.
            </p>
          </div>
        </div>
      </section>
      <section className="ab_gall container-fluid">
        <div className="row ">
          <div className="col-lg-6 p-0">
            <div
              className="we_vw"
              style={{ backgroundImage: `url(${mountain})` }}
            >
              <div className="been_data">
                <h2>We've been on board</h2>
                <a href="#">VIEW MORE</a>
              </div>
            </div>
          </div>
          <div className="col-lg-6 p-0">
            <div className="we_vw" style={{ backgroundImage: `url(${pe})` }}>
              <div className="been_data">
                <h2>Read more about us here</h2>
                <a href="#">VIEW MORE</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery_sls">
        <div className="container">
          <h4>GALLERY</h4>
          <Slider {...settings} className="about_gallery_slider">
            <img src={g} className="img-fluid" alt="Gallery" />
            <img src={g} className="img-fluid" alt="Gallery" />
            <img src={g} className="img-fluid" alt="Gallery" />
            <img src={g} className="img-fluid" alt="Gallery" />
            <img src={g} className="img-fluid" alt="Gallery" />
            <img src={g} className="img-fluid" alt="Gallery" />
            <img src={g} className="img-fluid" alt="Gallery" />
            <img src={g} className="img-fluid" alt="Gallery" />
          </Slider>
        </div>
      </section>
      <section className="new_subscribe">
        <div className="container">
          <h3>Subscribe to the Newsletter</h3>
          <p>Subscribe to our Newsletter for the latest offers and deals!</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="subm d-flex justify-content-center align-items-center">
              <input
                name="email"
                type="text"
                placeholder="Enter Your Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
              />
              <input type="submit" value="Subscribe" className="search_btn2" />
            </div>
            {errors.email && (
              <p
                className="mt-2"
                style={{
                  fontSize: "14px",
                }}
              >
                {errors.email.message}
              </p>
            )}
          </form>
        </div>
      </section>
      {/* <section className="customer_say">
          <div className="container">
            <h2>What our customers have to say</h2>
            <img src="assets/images/review.png" className="img-fluid" />
          </div>
        </section> */}
      <Customersay />
    </>
  );
};

export default AboutUs;