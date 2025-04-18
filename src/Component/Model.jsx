/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import SweetAlert2 from "react-sweetalert2";
import logo from "../assets/images/logo-color.png";
import call from "../assets/images/icons/call.png";
import endpoints from "../utils/endpoints";
import "../assets/css/inner.css";

import { useForm } from "react-hook-form";
function Modal({ isOpen, onClose, cruiseDetail, altDataForModal }) {
  const [value, setValue] = useState(1);
  const [value1, setValue1] = useState(1);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    setLoading(true);
    const payload = {
      name_title: formData.name_title,
      fname: formData.name,
      lname: formData.l_name,
      email: formData.email_ads,
      mobile_no: formData.tel_num,
      best_time_to_call: formData.best_time,
      cabins_rating1: value,
      cabins_rating2: value1,
      cabins_type: formData.cabins_type,
      preferred_departure_airport: formData.preferred_departure_airport,
      comments: formData.any_Comments,
      hear_about_us: formData.hear_about_us,
      cruise_package: altDataForModal?.data?.regions?.[0] || cruiseDetail?.region || "",
      date: cruiseDetail?.general_Start || "",
      operator: cruiseDetail?.operator || "",
      nights:
        altDataForModal?.data?.cruise_nights || cruiseDetail?.cruise_nights,
      ship: cruiseDetail?.ship || "",
      cruise_id: cruiseDetail?.reference || "",
    };

    // console.log("formData---", formData);
    // console.log("payload---", payload);
    axios
      .post(`${import.meta.env.VITE_API_URL + endpoints?.enquiry}`, payload)
      .then((res) => {
        console.log("Data submitted successfully", res);
        setLoading(false);
        if (res?.data?.success) {
          setAlert({
            show: true,
            title: "Success!",
            text: "Thank you for your message. We will get in touch with you shortly!",
            icon: "success",
          });
        } else {
          setAlert({
            show: true,
            title: "Success!",
            text: res?.data?.message,
            icon: "success",
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error submitting data:", err);
        setAlert({
          show: true,
          title: "Error!",
          text: "There was an error submitting the form data.",
          icon: "error",
        });
      });
  };
  const handleDecrement = () => {
    if (value > 1) {
      setValue(value - 1);
    }
  };

  const handleIncrement = () => {
    setValue(value + 1);
  };

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setValue(newValue);
    }
  };
  const handleDecrement1 = () => {
    if (value1 > 1) {
      setValue1(value1 - 1);
    }
  };
  const handleIncrement1 = () => {
    setValue1(value1 + 1);
  };
  const handleChange1 = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setValue(newValue);
    }
  };
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name_title: "",
    name: "",
    l_name: "",
    email_ads: "",
    tel_num: "",
    best_time: "",
    cabins_rating1: "",
    cabins_rating2: "",
    cabins_type: "",
    any_Comments: "",
    hear_about_us: "",
  });

  const submitdata = (e) => {
    e.preventDefault();
    console.log("formData----", formData);
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
    navigate("/cruisecollection");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* SweetAlert2 component */}
      {alert && alert.show && (
        <SweetAlert2
          show={alert.show}
          title={alert.title}
          text={alert.text}
          icon={alert.icon}
          onConfirm={handleAlertClose}
        />
      )}
      <div
        className="modal"
        id="enquiry_now"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-xl ">
          <div className="modal-content">
            {/* Modal Header */}

            <div className="modal-header">
              <img src={logo} className="img-fluid logo_pop" />
              <button
                type="button"
                onClick={onClose}
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>
            {/* Modal body */}
            <div className="modal-body">
              <form name="frm" onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="form_left">
                      <div className="info_form">
                        <img
                          src={cruiseDetail.cruise_image}
                          className="img-fluid pop_img"
                        />
                      </div>
                      <h3>Cruise Information</h3>

                      <div className="info_form">
                        <p>Cruise Package:</p>
                        <span>{cruiseDetail.region}</span>
                      </div>
                      <div className="info_form">
                        <p>DATE:</p>
                        <span>
                          {altDataForModal?.data?.starts_on
                            ? new Date(
                                altDataForModal?.data?.starts_on
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : cruiseDetail?.general_Start
                            ? moment
                                .unix(cruiseDetail?.general_Start)
                                .format("DD MMM YYYY")
                            : ""}
                        </span>
                      </div>
                      <div className="info_form">
                        <p>Nights:</p>
                        <span>
                          <span
                            style={{
                              marginRight: "5px",
                              marginLeft: "5px",
                            }}
                          >
                            {altDataForModal?.data?.cruise_nights ||
                              cruiseDetail?.cruise_nights}
                          </span>
                          Nights
                        </span>
                      </div>
                      <div className="info_form">
                        <p>CRUISE OPERATOR:</p>
                        <span>{cruiseDetail.operator}</span>
                      </div>
                      <div className="info_form">
                        <p>ship:</p>
                        <span>{cruiseDetail.ship}</span>
                      </div>
                      <div className="info_form">
                        <p>cruise id:</p>
                        <span>{cruiseDetail.reference}</span>
                      </div>
                      <div className="info_form">
                        <p>
                          <img src={call} /> CALL US NOW ON:
                        </p>
                        <span>
                          <a href="tel:02038842555">0203 884 2555</a>
                        </span>
                      </div>
                      <div className="info_form">
                        <p>EMAIL US AT:</p>
                        <span>sales@holiday2.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9">
                    <div className="row">
                      <p>Your Details</p>
                      <div className="col-lg-2">
                        <select
                          name="name_title"
                          {...register("name_title", {
                            required: "Title is required",
                          })}
                        >
                          <option value="">Title</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Mis.">Mis.</option>
                          <option value="Mrs.">Mrs.</option>
                        </select>
                        {errors?.name_title && (
                          <p className="text-danger fs-6 ">
                            {errors?.name_title?.message}
                          </p>
                        )}
                      </div>
                      <div className="col-lg-5">
                        <input
                          name="name"
                          type="text"
                          placeholder="First Name"
                          {...register("name", {
                            required: "First name is required",
                          })}
                        />
                        {errors?.name && (
                          <p className="text-danger fs-6 ">
                            {errors?.name?.message}
                          </p>
                        )}
                      </div>
                      <div className="col-lg-5">
                        <input
                          name="l_name"
                          type="text"
                          placeholder="Last Name"
                          {...register("l_name", {
                            required: "Last name is required",
                          })}
                        />
                        {errors?.l_name && (
                          <p className="text-danger fs-6 ">
                            {errors?.l_name?.message}
                          </p>
                        )}
                      </div>
                      <div className="col-lg-4">
                        <input
                          name="email_ads"
                          type="text"
                          placeholder="Email Address"
                          {...register("email_ads", {
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email address",
                            },
                          })}
                        />
                        {errors?.email_ads && (
                          <p className="text-danger fs-6 ">
                            {errors?.email_ads?.message}
                          </p>
                        )}
                      </div>
                      <div className="col-lg-4">
                        <input
                          name="tel_num"
                          type="text"
                          placeholder="Telephone Number"
                          {...register("tel_num", {
                            required: "Telephone number is required",
                            minLength: {
                              value: 7,
                              message: "Telephone number is too short",
                            },
                          })}
                        />
                        {errors?.tel_num && (
                          <p className="text-danger fs-6 ">
                            {errors?.tel_num?.message}
                          </p>
                        )}
                      </div>
                      <div className="col-lg-4">
                        <input
                          name="best_time"
                          type="text"
                          placeholder="Best Time To Call"
                          {...register("best_time", {
                            required: "Best time to call is required",
                          })}
                        />
                        {errors?.best_time && (
                          <p className="text-danger fs-6 ">
                            {errors?.best_time?.message}
                          </p>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <p>Your Cruise Preferences</p>
                        </div>
                      </div>
                      <div className="how_p">
                        <div className="row mb-3 align-items-center">
                          <div className="col-lg-8 dds">
                            How many cabins would you like?
                          </div>
                          <div className="col-lg-4">
                            <div className="number">
                              <span className="minus" onClick={handleDecrement}>
                                -
                              </span>
                              <input
                                value={value}
                                onChange={handleChange}
                                name="cabins_rating1"
                                type="text"
                                {...register("cabins_rating1")}
                              />
                              <span className="plus" onClick={handleIncrement}>
                                +
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                          <div className="col-lg-8 dds">
                            How many cabins would you like?
                          </div>
                          <div className="col-lg-4">
                            <div className="number">
                              <span
                                className="minus"
                                onClick={handleDecrement1}
                              >
                                -
                              </span>
                              <input
                                value={value1}
                                onChange={handleChange1}
                                name="cabins_rating2"
                                type="text"
                                {...register("cabins_rating2")}
                              />
                              <span className="plus" onClick={handleIncrement1}>
                                +
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3">
                          <select
                            name="cabins_type"
                            {...register("cabins_type", {
                              required: "Cabin type is required",
                            })}
                          >
                            <option value="">Cabin type</option>
                            <option value="Cabin type1">Cabin type1</option>
                            <option value="Cabin type2">Cabin type2</option>
                          </select>
                          {errors?.cabins_type && (
                            <p className="text-danger fs-6 ">
                              {errors?.cabins_type?.message}
                            </p>
                          )}
                        </div>
                        <div className="col-lg-9">
                          <input
                            name="preferred"
                            type="text"
                            placeholder="Preferred Departure Airport"
                            {...register("preferred_departure_airport", {
                              required: "Departure airport is required",
                            })}
                          />
                          {errors?.preferred_departure_airport && (
                            <p className="text-danger fs-6 ">
                              {errors?.preferred_departure_airport?.message}
                            </p>
                          )}
                        </div>
                        <div className="col-lg-12">
                          <textarea
                            name="any_Comments"
                            type="text"
                            placeholder="Any Comments (optional)"
                            defaultValue={""}
                            {...register("any_Comments")}
                          />
                        </div>
                        <div className="col-lg-5">
                          <select
                            name="hear_about_us"
                            {...register("hear_about_us", {
                              required: "How did you hear about us is required",
                            })}
                          >
                            <option value="">
                              Where Did you hear about us?
                            </option>
                            <option value="Google">Google</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Others">Others</option>
                          </select>
                          {errors?.hear_about_us && (
                            <p className="text-danger fs-6 ">
                              {errors?.hear_about_us?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <input
                            type="checkbox"
                            defaultValue
                            id="Cruise"
                            {...register("terms_and_condition", {
                              required:
                                "You must agree to our terms and conditions",
                            })}
                          />{" "}
                          Please keep me up to date with the latest deals from
                          holiday2.com. You can unsubscribe at any time.
                        </div>
                        <div className="col-lg-12">
                          {errors?.terms_and_condition && (
                            <p className="text-danger fs-6 ">
                              {errors?.terms_and_condition?.message}
                            </p>
                          )}
                        </div>
                        <div className="col-lg-12">
                          <input
                            type="checkbox"
                            defaultValue
                            {...register("privacy_and_policy", {
                              required:
                                "You must agree to our privacy and policy",
                            })}
                          />{" "}
                          I have read and accept the website’s privacy policy.
                        </div>
                        <div className="col-lg-12">
                          {errors?.privacy_and_policy && (
                            <p className="text-danger fs-6 ">
                              {errors?.privacy_and_policy?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-lg-12 text-end">
                          {loading ? (
                            <button
                              className="search_btn2"
                              type="button"
                              disabled
                            >
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              {""}
                              Submitting...
                            </button>
                          ) : (
                            <input
                              type="submit"
                              value="enquire now"
                              className="search_btn2"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(Modal);
