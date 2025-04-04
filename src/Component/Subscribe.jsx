import React from "react";
import Blog from "./Blog";
import axios from "axios";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import endpoints from "../utils/endpoints";
const API_URL = import.meta.env.VITE_API_URL;
const Subscribe = () => {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data)
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
      reset()
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
      <section className="subscribe">
        <div className="container">
          <div className="subscribe_box">
            <div className="padd80">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-lg-5">
                    <div className="sub_title">
                      <h2>
                        Subscribe to our Newsletter for the latest offers and
                        deals!
                      </h2>
                    </div>
                  </div>

                  <div className="col-lg-7">
                    <div className="sub_form">
                      <div className="row">
                        <div className="col-lg-6">
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
                          {errors.first_name && (
                            <p>{errors.first_name.message}</p>
                          )}
                        </div>
                        <div className="col-lg-6">
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
                          {errors.last_name && (
                            <p>{errors.last_name.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-12">
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
                          {errors.email && <p>{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-12">
                          <input
                            type="submit"
                            value="SUBSCRIBE NOW!"
                            className="search_btn"
                            style={{ border: "0px", padding: "15px 30px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Blog />
    </>
  );
};

export default Subscribe;