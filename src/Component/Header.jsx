import React from 'react';
import '../assets/css/header.css';
import Trustpilot from '../assets/images/Trustpilot_Logo.png';
import Menu from './Menu';
const Header = () => {
  return (
    <>
      {/* Top Area: Social Media & Contact Info */}
      <div className="top_area">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* Social Media Links */}
            <div className="col-sm-6">
              <div className="social_m">
                <ul>
                  <li><a href="#"><i className="ri-facebook-fill"></i></a></li>
                  <li><a href="#"><i className="ri-google-fill"></i></a></li>
                  <li><a href="#"><i className="ri-twitter-fill"></i></a></li>
                  <li><a href="#"><i className="ri-instagram-fill"></i></a></li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-sm-6">
              <div className="right_part">
                {/* <div>
                  <img src={Trustpilot} alt="Trustpilot Logo" className="img-fluid" />
                </div> */}
                <div className="cnum">
                  <b>0203 884 2555</b><br/>
                  <span>Opening times: Mon - Sat 8am - 8pm, Sun 9am - 6pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <Menu />
    </>
  );
};

export default Header;
