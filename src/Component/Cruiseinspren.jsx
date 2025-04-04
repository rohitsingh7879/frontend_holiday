import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import '../assets/css/cruisren.css';
import endpoints from "../utils/endpoints";
const Cruiseinspren = () => {
 const [category, setCategories] = useState([]);
   const [visibleCount, setVisibleCount] = useState(6);
  
    const handleSeeMore = (event) => {
      event.preventDefault();
  
      if (visibleCount === 6) {
        setVisibleCount(filters.length);
      } else {
        setVisibleCount(6);
      }
    };
  
    const fetchAllCategory = async () => {
      fetch(`${import.meta.env.VITE_API_URL + endpoints?.newCategory}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          return response.json();
        })
        .then((data) => {
          setCategories(data.data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    };
  
    useEffect(() => {
      fetchAllCategory();
    }, []);
 
    const filters = category.map((cat) => ({
      value: cat?.categoryName,
      label: cat?.categoryName,
      image:cat?.categoryImage,
    }));
  return (
    <>
    <section className="cruise_inspiration">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h2>Cruise Inspiration</h2>
          </div>
          <div className="col-lg-6 text-end">
            <a href="#" className="see_all">See all</a>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3">
            <div className="row">
              <div className="col-lg-12">
                <div className="cruise_list">
                <Link to={`/cruisecollection?categories=${filters[0]?.value}`}>
                    <img src={filters[0]?.image} className="img-fluid" alt="2025 Cruises" />
                    <div className="cruises_name">{filters[0]?.value}</div>
                  </Link>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="cruise_list">
                <Link to={`/cruisecollection?categories=${filters[1]?.value}`}>
                
                    <img src={filters[1]?.image} className="img-fluid" alt="2026 Luxury Cruises" />
                    <div className="cruises_name">{filters[1]?.value} Luxury <span>Cruises</span></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="row">
              <div className="col-lg-12">
                <div className="cruise_list2">
                <Link to={`/cruisecollection?categories=${filters[2]?.value}`}>
                
                    <img src={filters[2]?.image} className="img-fluid" alt="Beach Cruises" />
                    <div className="cruises_name">{filters[2]?.value}<span>Cruises</span></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="row">
              <div className="col-lg-12">
                <div className="cruise_list">
                <Link to={`/cruisecollection?categories=${filters[3]?.value}`}>
                
                    <img src={filters[3]?.image} className="img-fluid" alt="Caribbean Cruises" />
                    <div className="cruises_name">{filters[3]?.value} <span>Cruises</span></div>
                  </Link>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-5">
                    <div className="cruise_list">
                    <Link to={`/cruisecollection?categories=${filters[4]?.value}`}>
                 
                        <img src={filters[4]?.image} className="img-fluid" alt="Luxury European Cruises" />
                        <div className="cruises_name">{filters[4]?.value} <span>Cruises</span></div>
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="cruise_list">
                    <Link to={`/cruisecollection?categories=${filters[5]?.value}`}>
                
              
                        <img src={filters[5]?.image} className="img-fluid" alt="Luxury Baltic Cruises" />
                        <div className="cruises_name">{filters[5]?.value} <span>Cruises</span></div>
                        </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    
    </>
  )
}

export default Cruiseinspren