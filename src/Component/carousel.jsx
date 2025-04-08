import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import generateCruiseDetailsUrl from '../utils/DetailsURL';

const CruiseCarousel = ({ cruiseDataFromDB, type }) => {
  const [chunkSize, setChunkSize] = useState(3); // Default to 3 cards per slide (Desktop)

  // Function to chunk the array into dynamic size based on screen size
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Effect to handle screen resize and adjust chunk size dynamically
  useEffect(() => {
    const updateChunkSize = () => {
      const width = window.innerWidth;
      if (width >= 992) {
        setChunkSize(3); // 3 cards per slide on Desktop
      } else if (width >= 576) {
        setChunkSize(2); // 2 cards per slide on Tablet
      } else {
        setChunkSize(1); // 1 card per slide on Mobile
      }
    };

    // Call the function initially to set the chunk size based on current screen width
    updateChunkSize();

    // Add resize event listener to adjust chunk size when the window is resized
    window.addEventListener('resize', updateChunkSize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', updateChunkSize);
    };
  }, []); // Empty dependency array to run only once on mount

  // Create a set of carousel items (slides) in dynamic chunks
  const cruiseChunks = chunkArray(
    cruiseDataFromDB.filter((ship) => ship.general_type === type.value).slice(0, 10),
    chunkSize
  );

  return (
    <div
      id="carouselExampleSlidesOnly"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="5000" // 5 seconds auto-scroll
    >
      <div className="carousel-inner">
        {cruiseChunks.map((chunk, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div className="row">
              {chunk.map((ship, shipIndex) => (
                <div key={shipIndex} className="col-12 col-md-6 col-lg-4">
                  <div className="coll_box">
                    <img
                      src={ship?.cruise_image}
                      className="img-fluid"
                      alt={`Cruise ${shipIndex + 1}`}
                    />
                    <div className="c_data">
                      <span>
                        {ship.name} | {ship.regions}
                      </span>
                      <p>{ship.name}</p>
                      <div className="c_datec">
                        <span>
                          <i className="ri-calendar-todo-fill"></i> {ship.cruise_nights} nights -{' '}
                          {ship?.general_Start
                            ? moment.unix(ship?.general_Start).format('DD MMM YYYY')
                            : 'N/A'}
                        </span>
                        <div>
                          <img
                            src={ship?.mobile_cruise_banner_image}
                            className="sm_logo"
                            alt="Cruise Banner"
                          />
                        </div>
                      </div>

                      <hr />
                      <div className="pricee">
                        Cruises from <b> £{ship?.priceStartFrom}</b> PP
                      </div>

                      <Link
                        className="dis_more"
                        to={generateCruiseDetailsUrl('new-cruise-details', ship)}
                      >
                        DISCOVER MORE
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Move the indicators below the content */}
      <ol className="carousel-indicators position-relative" style={{bottom:"0px"}}>
        {cruiseChunks.map((_, index) => (
          <li
            key={index}
            data-bs-target="#carouselExampleSlidesOnly"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''} // Set first indicator as active
          ></li>
        ))}
      </ol>
    </div>
  );
};

export default CruiseCarousel;
