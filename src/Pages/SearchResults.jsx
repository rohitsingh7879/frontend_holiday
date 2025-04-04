import React from 'react';
import { useLocation } from 'react-router-dom'; // Hook to access passed state
import four_banner from '../assets/images/collection_banner.jpg';
import moon from '../assets/images/icons/moon.png';
import moon1 from '../assets/images/curise_photo.png';
import moon2 from '../assets/images/icons/ship.png';
import moon3 from '../assets/images/icons/date.png';
import moon4 from '../assets/images/logo-azmara.png';
import '../assets/css/cruisedeals.css';
import { Link } from 'react-router-dom';
import logocolor from '../assets/images/logo-color.png';
const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] }; // Fetch results from state

  // Function to format the date to "17 Sep 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <>
      
        

<section className="banner">
        <div id="demo" className="carousel slide carousel-fade" data-bs-ride="carousel">
          
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={four_banner} alt="Collection" className="d-block" style={{width: '100%'}} />
              <div className="bg-overlay" />
              <div className="carousel-caption">
                <p><img src={logocolor} className="img-fluid logo_d" /></p>
                <h3>Hand Picked Cruise Collection</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container">

        <div class="row">

        <div className="col-lg-3">
              {/* Filter section */}
              <div className="ship_left_area">
                <div className="button1">
                  <h4>CRUISE CATEGORY <i className="ri-arrow-down-s-line"></i></h4>
                  <div className="mydiv">
                    <ul>
                      <li><input type="checkbox" value="" /> 2025</li>
                      <li><input type="checkbox" value="" /> 2026</li>
                      <li><input type="checkbox" value="" /> All Inclusive Cruises</li>
                      <li><input type="checkbox" value="" /> Cruise Deals</li>
                      <li><input type="checkbox" value="" /> Last Minute Deals</li>
                      <li><input type="checkbox" value="" /> Luxury Cruises</li>
                      <li>See More</li>
                    </ul>
                  </div>
                </div>
          
                <div className="button1">
          <h4>DEPARTURE MONTH <i className="ri-arrow-down-s-line" /></h4>
          <div className="mydiv">
            <select className="select_area">
              <option>Departure</option>
              <option>Departure</option>
            </select>
          </div>
        </div>
        <div className="button1">
          <h4>Destination <i className="ri-arrow-down-s-line" /></h4>
          <div className="mydiv">
            <select className="select_area form-select">
              <option>Destination</option>
              <option>Destination</option>
            </select>
          </div>
        </div>
        <div className="button1">
          <h4>Cruise Line <i className="ri-arrow-down-s-line" /></h4>
          <div className="mydiv">
            <select className="select_area">
              <option>Cruise Line</option>
              <option>Cruise line2</option>
            </select>
          </div>
        </div>
        <div className="button1">
          <h4>CRUISE SHIP <i className="ri-arrow-down-s-line" /></h4>
          <div className="mydiv">
            <select className="select_area">
              <option>All Ships</option>
              <option>cruise ship</option>
            </select>
          </div>
        </div>
        <div className="button1 border_none">
          <h4>ports <i className="ri-arrow-down-s-line" /></h4>
          <div className="mydiv">
            <select className="select_area">
              <option>All Ports </option>
              <option>ports2 </option>
            </select>
          </div>
        </div>
        <div className="filter level-filter level-req">
          <div id="rangeSlider" className="range-slider">
            <label>Duration:</label>
            <div className="number-group">
              <input className="number-input" type="number" defaultValue={10} min={0} max={50} /> - 
              <input className="number-input" type="number" defaultValue={50} min={0} max={50} disabled /> Nights
            </div>
            <div className="range-group">
              <input id="range-input" className="range-input" defaultValue={10} min={1} max={50} step={1} type="range" />
            </div>
          </div>
        </div>
        <div className="filter level-filter level-req">
          <div id="rangeSlider1" className="range-slider">
            <label>Price Range:</label>
            <div className="number-group">
              <input className="number-input" type="number" defaultValue={10} min={0} max={50} /> - 
              <input className="number-input" type="number" defaultValue={50} min={0} max={50} disabled />
            </div>
            <div className="range-group">
              <input id="range-input" className="range-input" defaultValue={10} min={1} max={50} step={1} type="range" />
            </div>
          </div>
        </div>
        <div className="text-end"><a href="#" className="action_btn">Reset</a></div>
              </div>
            </div>

        <div class="col-lg-9">

            
        {results.length > 0 ? (
          results.map((cruise, index) => (
            <div className="criuse_list">
            <div className="row" key={index}>
              <div className="col-lg-4">
                <div className="cri_pic">
                  <img src={cruise.image || moon1} className="img-fluid" alt="Cruise" />
                  <div className="wish_list">
                    <a><i className="ri-heart-3-line" /></a>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 p-0">
                <div className="cri_info">
                  <div className="top_area_ship">
                    <div className="row">
                      <div className="col-lg-3 pright_zeo">
                        <div className="ship_ssd">
                          <div><img src={moon2} className="img-fluid" alt="Ship" /></div>
                          <div>
                            <p>Ship</p>
                            <span>{cruise.ship_title || 'Celebrity Equinox'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 pright_zeo">
                        <div className="ship_ssd">
                          <div><img src={moon3} className="img-fluid" alt="Date" /></div>
                          <div>
                            <p>Date</p>
                            <span>{cruise.starts_on ? formatDate(cruise.starts_on) : '17 Sep 2025'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 pright_zeo">
                        <div className="ship_ssd">
                          <div><img src={moon} className="img-fluid" alt="Duration" /></div>
                          <div>
                            <p>Duration</p>
                            <span>{cruise.cruise_nights ? `${cruise.cruise_nights} nights` : '13 nights'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 text-center pright_zeo">
                        <img src={moon4} className="img-fluid" alt="Extra Info" />
                      </div>
                    </div>
                  </div>
                  <div className="dieds">
                    {cruise.title || 'All-Inclusive Mallorca Beaches and Luxury Greek Isles Cruise'}
                  </div>
                  <div className="dieds">
                    <span><img src={moon2} className="img-fluid" alt="Itinerary" /> {cruise.itinerary || 'Mykonos- Kusadasi- Istanbul- Santorini- Katakolon'}</span>
                  </div>
                  <div className="curise_des_area">
                    • Return flights from the UK • All private transfers • 3-night 4* All-Inclusive Hotel Stay in Mallorca • One-way flight from Mallorca to Barcelona • 10-night All-Inclusive cruise on-board Celebrity Equinox • Free upgrade from Ocean View to Balcony • Drinks & Wi-Fi • Taxes & Fees'
                  </div>
                  <div className="row align-items-center mt-3">
                    <div className="col-lg-7">
                      <div className="cck">
                      <ul>
												<li><img src={moon3} class="img-fluid" /> {cruise.cruise_nights ? `${cruise.cruise_nights} nights` : '13 nights'} - {cruise.starts_on ? formatDate(cruise.starts_on) : '17 Sep 2025'}</li>
												<li><img src={moon3} class="img-fluid" /> 16 nights - 28 Nov 2025</li>
												<li><img src={moon3} class="img-fluid" /> 16 nights - 28 Nov 2025</li>
												<li><img src={moon3} class="img-fluid" /> 16 nights - 28 Nov 2025</li>
											</ul>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="curise_amount">
                        <div className="final_price">£{cruise.cruise_only_price || '£2,599pp'}</div>
                        <div>
                        <Link to={`/CruiseDetail/${cruise.ship_title.replace(/\s+/g, '-').toLowerCase()}`} className="dis_more">View Deal</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          ))
        ) : null}

        </div>

        </div>

      </div>


      
    </>
  );
};

export default SearchResults;
