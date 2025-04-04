import React, { useEffect, useState } from "react";

const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
const TOKEN = "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";

const Cruisesdty = () => {
    const [cruiseItems, setCruiseItems] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
      const fetchCruiseDetails = async () => {
        try {
          // Fetch cruise data
          const cruiseResponse = await fetch(
            `${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=400`,
            {
              headers: {
                Accept: "application/json; api_version=2",
              },
            }
          );
  
          if (!cruiseResponse.ok) {
            throw new Error("Network response was not ok");
          }
  
          const cruiseResult = await cruiseResponse.json();
          const cruises = cruiseResult.cruises;
  
          // Directly set cruise data without fetching ship data
          setCruiseItems(cruises); // Set the cruise data without ship information
        } catch (error) {
          setError(error.message);
        } 
      };
  
      fetchCruiseDetails();
    }, []);
  
   
  
    return (
      <>
        <div>
          <h1>Cruise Details</h1>

            <ul>
              {cruiseItems.map((item) => (
                <li key={item.ref}>
                  <h6>Name : {item.name}</h6>
                  <p>Starts at: {item.starts_at} on {new Date(item.starts_on).toLocaleDateString()}</p>
                  <p>Ends at: {item.ends_at} on {new Date(item.ends_on).toLocaleDateString()}</p>
                  <p>Travel Type: {item.travel_type}</p>
                  <p>Rating: {item.rating}</p>
                  <p>Cruise Type: {item.cruise_type?.join(", ")}</p>
                  <p>Regions: {item.regions?.join(", ")}</p>
                  <p>Vacation Days: {item.vacation_days}</p>
                  <p>Cruise Nights: {item.cruise_nights}</p>
                  <p>Price: Inside - {item.inside_price}, Outside - {item.outside_price}, Balcony - {item.balcony_price}, Suite - {item.suite_price}</p>

                  {/* Additional Cruise Information */}
                  <p>Official Link: <a href={item.official_link} target="_blank" rel="noopener noreferrer">View Cruise</a></p>
                  <p>Reference: {item.ref}</p>
                  <p>Arrives On: {item.arrives_on ? new Date(item.arrives_on).toLocaleDateString() : "N/A"}</p>

                  {/* Ship and Operator Information */}
                  <p>Ship: {item.ship_title}</p>
                  <a href={item.ship} target="_blank" rel="noopener noreferrer">View Ship Details</a>
                  <p>Operator: {item.operator_title}</p>
                  <a href={item.operator} target="_blank" rel="noopener noreferrer">View Operator</a>
                </li>
              ))}
            </ul>
  
        </div>
      </>
    );
}

export default Cruisesdty;
