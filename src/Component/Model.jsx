import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import SweetAlert2 from 'react-sweetalert2';
import logo from '../assets/images/logo-color.png';
import call from '../assets/images/icons/call.png'
import endpoints from '../utils/endpoints';
function Modal({ isOpen, onClose, cruiseDetail}) {
  if (!isOpen) return null; 
  const [value, setValue] = useState(1); 
  const [value1, setValue1] = useState(1); 

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
         name_title: '',
         name: '',
         l_name: '',
         email_ads: '',
         tel_num: '',
         best_time: '',
         cabins_rating1: '',
         cabins_rating2: '',
         cabins_type: '',
         any_Comments: '',
         hear_about_us: '',
     });

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitdata = (e) => {
    e.preventDefault();
    
    let night = cruiseDetail?.general_Start && cruiseDetail?.general_end  ? Math.max(0,Math.ceil((new Date(cruiseDetail.general_end) - new Date(cruiseDetail.general_Start)) / (1000 * 60 * 60 * 24))) : "";
    axios.post(`${import.meta.env.VITE_API_URL + endpoints?.enquiry}`, {
      name_title: formData.name_title,
      fname: formData.name,
      lname: formData.l_name,
      email: formData.email_ads,
      mobile_no: formData.tel_num,
      best_time_to_call: formData.best_time,  
      cabins_rating1: value, 
      cabins_rating2: value1, 
      cabins_type: formData.cabins_type,
      preferred_departure_airport: formData.preferred,  
      comments: formData.any_Comments, 
      hear_about_us: formData.hear_about_us,
      cruise_package: cruiseDetail?.regions || "",
      date : cruiseDetail?.general_Start || "",
      operator :cruiseDetail?.operator || "",
      nights :  night,
      ship : cruiseDetail?.ship || "",
      cruise_id:cruiseDetail?.reference || "",
  })
      .then((res) => {
        console.log('Data submitted successfully', res);
        setAlert({
          show: true,
          title: "Success!",
          text: "Thank you for your message. We will get in touch with you shortly!",
          icon: "success",
        });
      })
      .catch((err) => {
        console.error('Error submitting data:', err);
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
      name: '',
      l_name: '',
      email_ads: '',
      tel_num: '',
      any_Comment: ''
    });
    setAlert(null);  
    navigate('/cruisecollection'); 
  };
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
      <div className="modal" id="enquiry_now" data-bs-backdrop="static" data-bs-keyboard="false" >
        <div className="modal-dialog modal-xl ">
          <div className="modal-content">
            {/* Modal Header */}
            
            <div className="modal-header">
              <img src={logo} className="img-fluid logo_pop" />
              <button type="button" onClick={onClose} className="btn-close" data-bs-dismiss="modal" />
            </div>
            {/* Modal body */}
            <div className="modal-body">
            <form name="frm" onSubmit={submitdata}>
              <div className="row">
                <div className="col-lg-3">
                  <div className="form_left">
                    <div className="info_form">
                      <img src={cruiseDetail.cruise_image} className="img-fluid pop_img" />
                    </div>
                    <h3>Cruise Information</h3>
                   
                 
                    <div className="info_form">
                      <p>Cruise Package:</p>
                      <span>{cruiseDetail.region}</span>
                    </div>
                    <div className="info_form">
                      <p>DATE:</p>
                      <span> 
                         {cruiseDetail.general_Start ? moment.unix(cruiseDetail.general_Start)
                                                          .format("DD MMM YYYY")
                                                      : " "}
                       </span>
                    </div>
                    <div className="info_form">
                      <p>Nights:</p>
                      <span>
                      {cruiseDetail?.itinerary
                        ?.slice(-1)
                        .map((itineraryItem, index) => (
                          <span key={index} style={{ marginRight: '5px',marginLeft: '5px' }}>{itineraryItem.day}</span>
                        ))} 
                        
                         Nights</span>
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
                      <p><img src={call} /> CALL US NOW ON:</p>
                      <span><a href="tel:02038842555">0203 884 2555</a></span>
                    </div>
                    <div className="info_form">
                      <p>EMAIL US AT:</p>
                      <span>sales@cruise2.com</span>
                    </div>
                  </div>
                </div>
              
                <div className="col-lg-9">
                  <div className="row">
                    <p>Your Details</p>
                    <div className="col-lg-2">
                    <select name="name_title" value={formData.name_title} onChange={handleChanged}>
                                                    <option value = "">Title</option>
                                                    <option value = "Mr.">Mr.</option>
                                                    <option value="Mis.">Mis.</option>
                                                    <option value="Mrs.">Mrs.</option>
                                                </select>
                    </div>
                    <div className="col-lg-5">
                      <input name="name" type="text" placeholder="First Name" />
                    </div>
                    <div className="col-lg-5">
                      <input name="l_name" type="text" placeholder="Last Name" />
                    </div>
                    <div className="col-lg-4">
                      <input name="email_ads" type="text" placeholder="Email Address" />
                    </div>
                    <div className="col-lg-4">
                      <input name="tel_num" type="text" placeholder="Telephone Number" />
                    </div>
                    <div className="col-lg-4">
                      <input name="best_time" type="text" placeholder="Best Time To Call" />
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <p>Your Cruise Preferences</p>
                      </div>
                    </div>
                    <div className="how_p">
                      <div className="row mb-3 align-items-center">
                        <div className="col-lg-8 dds">How many cabins would you like?</div>
                        <div className="col-lg-4">
                        <div className="number">
                         <span className="minus" onClick={handleDecrement}>-</span>
                         <input type="text" value={value} onChange={handleChange} name="cabins_rating1"/>
                               <span className="plus" onClick={handleIncrement}>+</span>
                        </div>
                        </div>
                      </div>
                      <div className="row mb-3 align-items-center">
                        <div className="col-lg-8 dds">How many cabins would you like?</div>
                        <div className="col-lg-4">
                        <div className="number">
                         <span className="minus" onClick={handleDecrement1}>-</span>
                         <input type="text" value={value1} onChange={handleChange1} name="cabins_rating2" />
                               <span className="plus" onClick={handleIncrement1}>+</span>
                        </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3">
                      <select name="cabins_type" value={formData.cabins_type} onChange={handleChanged}>
                                                        <option value="">Cabin type</option>
                                                        <option value="Cabin type1">Cabin type1</option>
                                                        <option value="Cabin type2">Cabin type2</option>
                                                    </select>
                      </div>
                      <div className="col-lg-9">
                        <input name="preferred" type="text" placeholder="Preferred Departure Airport" />
                      </div>
                      <div className="col-lg-12">
                        <textarea name="any_Comments" type="text" placeholder="Any Comments" defaultValue={""} />
                      </div>
                      <div className="col-lg-5">
                      <select name="hear_about_us" value={formData.hear_about_us} onChange={handleChanged}>
                                                        <option value="">Where Did you hear about us?</option>
                                                        <option value="Google">Google</option>
                                                        <option value="Facebook">Facebook</option>
                                                        <option value="Others">Others</option>
                                                    </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12"><input type="checkbox" defaultValue id="Cruise" /> Please keep me up to date with the latest deals from holiday2.com. You can unsubscribe at any time.</div>
                      <div className="col-lg-12"><input type="checkbox" defaultValue /> I have read and accept the website’s privacy policy.</div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-12 text-end">
                        <input type="submit" Value="enquire now" className="search_btn2" /></div>
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

export default Modal;
