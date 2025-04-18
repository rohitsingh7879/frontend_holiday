import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo-color.png';
import call from '../assets/images/icons/call.png';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from "react-router-dom";
import endpoints from '../utils/endpoints';
const ModelEx = ({ isOpen, onClose,shipDetails, shipRefData }) => {

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
        console.log("Form Data Submitted: ", formData);
      let  date = shipRefData[0]?.date ?  new Date(shipRefData[0]?.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }) : new Date(shipRefData[0]?.starts_on).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric' }
          )

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
            cruise_package:shipRefData[0]?.shipname || shipRefData[0]?.ship_title || "",
            date : date || "",
            operator :shipRefData[0]?.operator_title || shipRefData[0]?.oprator || "",
            nights : shipRefData[0]?.night || shipRefData[0]?.cruise_nights || "",
            ship : shipDetails?.title || "",
            cruise_id:shipRefData[0]?.ref || "",
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
        navigate('/'); 
    };

    // Use effect to trigger SweetAlert2 based on alert state
    useEffect(() => {
        if (alert && alert.show) {
            Swal.fire({
                title: alert.title,
                text: alert.text,
                icon: alert.icon,
                confirmButtonText: 'OK'
            }).then(() => {
                handleAlertClose();
            });
        }
    }, [alert]);  
    if (!isOpen) return null; 

    return (
        <>
            <div className="modal" id="enquiry_now" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-xl">
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
                                                <img src={shipDetails?.cover_image_href} className="img-fluid pop_img" />
                                            </div>
                                            <h3>Cruise Information</h3>
                                            <div className="info_form">
                                                <p>Cruise Package:</p>
                                                <span>{shipRefData[0]?.shipname}  {shipRefData[0]?.ship_title}</span>
                                            </div>
                                            <div className="info_form">
                                                <p>DATE:</p>
                                                <span>
                                                {shipRefData[0]?.date ?  new Date(shipRefData[0]?.date).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                          }) : new Date(shipRefData[0]?.starts_on).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric' }
                                                          )}

                                                </span>
                                            </div>
                                            <div className="info_form">
                                                <p>Nights:</p>
                                                <span>{shipRefData[0]?.night} {shipRefData[0]?.cruise_nights} nights</span>
                                            </div>
                                            <div className="info_form">
                                                <p>CRUISE OPERATOR:</p>
                                                <span>{shipRefData[0]?.operator_title} {shipRefData[0]?.oprator}</span>
                                            </div>
                                            <div className="info_form">
                                                <p>Ship:</p>
                                                <span>{shipDetails?.title}</span>
                                            </div>
                                            <div className="info_form">
                                                <p>Cruise ID:</p>
                                                <span>{shipRefData[0]?.ref}</span>
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
                                                <input name="name" type="text" placeholder="First Name" value={formData.name} onChange={handleChanged} />
                                            </div>
                                            <div className="col-lg-5">
                                                <input name="l_name" type="text" placeholder="Last Name" value={formData.l_name} onChange={handleChanged} />
                                            </div>
                                            <div className="col-lg-4">
                                                <input name="email_ads" type="email" placeholder="Email Address" value={formData.email_ads} onChange={handleChanged} />
                                            </div>
                                            <div className="col-lg-4">
                                                <input name="tel_num" type="text" placeholder="Telephone Number" value={formData.tel_num} onChange={handleChanged} />
                                            </div>
                                            <div className="col-lg-4">
                                                <input name="best_time" type="text" placeholder="Best Time To Call" value={formData.best_time} onChange={handleChanged} />
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
                                                            <input type="text" value={value} onChange={handleChange} name="cabins_rating1" />
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
                                                    <input name="preferred" type="text" placeholder="Preferred Departure Airport" value={formData.preferred} onChange={handleChanged} />
                                                </div>
                                                <div className="col-lg-12">
                                                    <textarea name="any_Comments" placeholder="Any Comments" value={formData.any_Comments} onChange={handleChanged} />
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
                                                    <input type="submit" value="Enquire Now" className="search_btn2" />
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
};

export default ModelEx;
