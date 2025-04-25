import { debounce } from "lodash";
import "../assets/css/searchNotFound.css";
import { search_not } from "../assets/images";
import { useNavigate } from "react-router-dom";

function SearchNotFound({ search_text }) {
  const navigate = useNavigate();
  const debounceSearchAPI = debounce((search_text) => {
    navigate(`/cruisecollection?search_text=${search_text}`);
  }, 1000);
  return (
    <div className="mb-3">
      <div className="cruise_not_found">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h4>Search Result For ‘{search_text}’</h4>
              <img src={search_not} className="img-fluid" />
              <h1>Oops! Search Not Found</h1>
              <p>
                Nothing matched your search criteria. Please try again with
                different keywords.
              </p>

              <div className="search_areas">
                <input
                  type="text"
                  placeholder="Type keywords..."
                  onChange={(e) => {
                    debounceSearchAPI(e.target.value);
                  }}
                />
                <button>
                  <i className="ri-search-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchNotFound;
