import { useState, useEffect, } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import '../assets/css/searchcruises.css';
import axios from "axios";
import { format, parse } from "date-fns";
import '../assets/css/home.css';

const Cruisesearch = () => {
  const [cruiseTypes, setCruiseTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [ships, setShips] = useState([]);
  const [cruiseLines, setCruiseLines] = useState([]);
  const [cruiseDate, setCruiseDate] = useState([]);
  const [selectedCruiseTypes, setSelectedCruiseTypes] = useState(null);
  const [selectedRegions, setSelectedRegions] = useState(null);
  const [selectedShips, setSelectedShips] = useState(null);
  const [selectedCruiseLine, setSelectedCruiseLine] = useState(null);
  const [selectedCruiseDate, setSelectedCruiseDate] = useState(null);
  const [allOperatorDetails, setAllOperatorDetails] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const API_BASE_URL = "https://www.widgety.co.uk/api/cruises.json";
  const APP_ID = "9f8ae7c620357e30f59d1cf1e167ddb4f5b6f1ce";
  const TOKEN = "44afd9791417131255f8848f113ce05f05833d11e84c3c75b82c9db4d922ce44";
  const API_SHIP_BASE_URL = "https://www.widgety.co.uk/api/ships.json";
  const API_OPERATOR_BASE_URL = "https://www.widgety.co.uk/api/operators.json";

  const navigate = useNavigate();

  // Fetch Ship List
  const fetchShipAllList = async () => {
    try {
      const result = await axios.get(`${API_SHIP_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=100`, {
        headers: { 'Accept': 'application/json;api_version=2' }
      });
      const uniqueShips = [...new Set(result?.data?.ships.map((ship) => ship.title))];
      setShips(uniqueShips.map((ship) => ({ value: ship, label: ship })));
    } catch (error) {
      console.error("Error fetching ships:", error);
    }
  };

  // Fetch Operator List
  const fetchOperatorAllList = async () => {
    try {
      const result = await axios.get(`${API_OPERATOR_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=100`, {
        headers: { 'Accept': 'application/json;api_version=2' }
      });
      if (result && result.status === 200) {
        setAllOperatorDetails(result?.data?.operators);
        const uniqueCruiseLines = [...new Set(result?.data?.operators.map((cruise) => cruise.title))];
        setCruiseLines(uniqueCruiseLines.map((line) => ({ value: line, label: line })));
      }
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };

  // Fetch Cruise Types and Date Range
  const fetchCruiseTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?app_id=${APP_ID}&token=${TOKEN}&limit=400`, {
        headers: { Accept: "application/json;api_version=2" }
      });
      const result = await response.json();
      const uniqueCruiseTypes = [...new Set(result?.cruises?.flatMap((cruise) => cruise.cruise_type))];
      const filteredCruiseTypes = uniqueCruiseTypes.filter(type => type !== "River");
      setCruiseTypes(filteredCruiseTypes.map((type) => ({ value: type, label: type })));

      const uniqueDates = [...new Set(result?.cruises.map((cruise) => cruise.starts_on))];
      const formattedDates = uniqueDates.map((date) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const monthName = dateObj.toLocaleString("default", { month: "long" });
        const year = dateObj.getFullYear();
        return { value: `${day} ${monthName} ${year}`, label: `${monthName} ${year}` };
      });
      setCruiseDate(formattedDates);

      const uniqueRegions = [...new Set(result?.cruises.flatMap((cruise) => cruise.regions))];
      setRegions(uniqueRegions.map((region) => ({ value: region, label: region })));
    } catch (error) {
      console.error("Error fetching cruise types:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCruiseTypes();
    fetchShipAllList();
    fetchOperatorAllList();
    setLoading(false);
  }, []);

  // Search function with improved validation and better error handling
  const searchCruises = async () => {
    try {
      const cruiseTypeQuery = selectedCruiseTypes?.value || "";
      const regionQuery = selectedRegions?.value || "";
      const shipQuery = selectedShips?.value || "";
      const cruiseLineQuery = selectedCruiseLine?.value || "";
      const selectedCruiseDateString = selectedCruiseDate?.value || "";

      if (!cruiseTypeQuery && !regionQuery && !shipQuery && !cruiseLineQuery && !selectedCruiseDateString) {
        alert("Please input any search field value");
        return;
      }

      let cruiseLineId = "";
      if (cruiseLineQuery) {
        const matchingOperator = allOperatorDetails.find(op => op.title === cruiseLineQuery);
        cruiseLineId = matchingOperator?.id || "";
      }

      let convertFormatCruiseDateString = "";
      if (selectedCruiseDateString) {
        convertFormatCruiseDateString = format(
          parse(selectedCruiseDateString, "d MMMM yyyy", new Date()), 
          "yyyy-MM-dd"
        );
      }

      let queryParams = new URLSearchParams({
        operator: cruiseLineId,
        ship_name: shipQuery,
        start_date_range_beginning: convertFormatCruiseDateString,
        app_id: APP_ID,
        token: TOKEN
      });

      if (cruiseTypeQuery) queryParams.append("cruise_type", cruiseTypeQuery);

      const result = await axios.get(`${API_BASE_URL}?${queryParams.toString()}`, {
        headers: { 'Accept': 'application/json;api_version=2' }
      });

      if (result && result?.status === 200) {
        navigate("/cruise-deals", { state: { results: result?.data?.cruises } });
      } else {
        console.log("Error in searching...");
      }
    } catch (error) {
      console.error("Error searching cruises:", error);
    }
  };

  return (
    <section className="search_area">
      <div className="container search_b">
        <div className="row">
          {loading && (
            <div className="col-12 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && (
            <>
              <div className="col-lg-2">
                <div className="form_c">
                  <span>Cruise CATEGORY</span>
                  <Select
                    options={cruiseTypes}
                    value={selectedCruiseTypes}
                    onChange={setSelectedCruiseTypes}
                    placeholder="Select Cruise Type"
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="form_c">
                  <span><i className="ri-map-pin-fill"></i> LOCATION</span>
                  <Select
                    options={regions}
                    value={selectedRegions}
                    onChange={setSelectedRegions}
                    placeholder="Select Region"
                  />
                </div>
              </div>

              <div className="col-lg-2">
                <div className="form_c">
                  <span><i className="ri-calendar-todo-fill"></i> DATE</span>
                  <Select
                    options={cruiseDate}
                    value={selectedCruiseDate}
                    onChange={setSelectedCruiseDate}
                    placeholder="Select Date"
                  />
                </div>
              </div>

              <div className="col-lg-2">
                <div className="form_c">
                  <span><i className="ri-ship-line"></i> Cruise line</span>
                  <Select
                    options={cruiseLines}
                    value={selectedCruiseLine}
                    onChange={setSelectedCruiseLine}
                    placeholder="Select Cruise Line"
                  />
                </div>
              </div>

              <div className="col-lg-2">
                <div className="form_c">
                  <span><i className="ri-ship-line"></i> Ship name</span>
                  <Select
                    options={ships}
                    value={selectedShips}
                    onChange={setSelectedShips}
                    placeholder="Select Ship"
                  />
                </div>
              </div>

              <div className="col-lg-2">
                <div className="form_c">
                  <button onClick={searchCruises} className="search_btn">
                    Search
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cruisesearch;
