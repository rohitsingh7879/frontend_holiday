import { useEffect } from "react";

import Swal from "sweetalert2";
import axios from "axios";
import endpoints from "../utils/endpoints";
import { useForm } from "react-hook-form";
const API_URL = import.meta.env.VITE_API_URL;

function NewsLetterByEmail() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm();
    
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
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
  return (
    <div> <section className="new_subscribe">
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
  </section></div>
  )
}

export default NewsLetterByEmail