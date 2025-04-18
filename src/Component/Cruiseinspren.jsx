import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/cruisren.css";
import endpoints from "../utils/endpoints";

const Cruiseinspren = () => {
  const [category, setCategories] = useState([]);
  // const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  // const handleSeeMore = (event) => {
  //   event.preventDefault();

  //   if (visibleCount === 6) {
  //     setVisibleCount(filters.length);
  //   } else {
  //     setVisibleCount(6);
  //   }
  // };

  const fetchAllCategory = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL + endpoints?.newCategory}`
      );
      const data = await response.json();
      setCategories(data?.data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  const filters =
    loading || !category.length
      ? []
      : category
          .filter((item) => item?.status && item?.isShowOnHomePage)
          .map((cat) => ({
            value: cat?.categoryName,
            label: cat?.categoryName,
            image: cat?.categoryImage,
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
              <Link to="/" className="see_all">
                See all
              </Link>
            </div>
          </div>

          <div className="row">
            {filters && filters?.length > 0 ? (
              <>
                <div className="col-lg-3">
                  <div className="row">
                    {filters?.[0] && (
                      <div className="col-lg-12">
                        <div className="cruise_list">
                          <Link
                            to={`/cruisecollection?categories=${filters?.[0]?.value}`}
                          >
                            <img
                              src={filters?.[0]?.image}
                              className="img-fluid"
                              alt="2025 Cruises"
                            />
                            <div className="cruises_name">
                              {filters?.[0]?.value?.split("-")?.join(" ")}
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                    {filters?.[1] && (
                      <div className="col-lg-12">
                        <div className="cruise_list">
                          <Link
                            to={`/cruisecollection?categories=${filters?.[1]?.value}`}
                          >
                            <img
                              src={filters?.[1]?.image}
                              className="img-fluid"
                              alt="2026 Luxury Cruises"
                            />
                            <div className="cruises_name">
                              {filters?.[1]?.value?.split("-")?.join(" ")}{" "}
                              Luxury <span>Cruises</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {filters?.[2] && (
                  <div className="col-lg-4">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="cruise_list2">
                          <Link
                            to={`/cruisecollection?categories=${filters?.[2]?.value}`}
                          >
                            <img
                              src={filters?.[2]?.image}
                              className="img-fluid"
                              alt="Beach Cruises"
                            />
                            <div className="cruises_name">
                              {filters?.[2]?.value?.split("-")?.join(" ")}
                              <span>Cruises</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-lg-5">
                  <div className="row">
                    {filters?.[3] && (
                      <div className="col-lg-12">
                        <div className="cruise_list">
                          <Link
                            to={`/cruisecollection?categories=${filters?.[3]?.value}`}
                          >
                            <img
                              src={filters?.[3]?.image}
                              className="img-fluid"
                              alt="Caribbean Cruises"
                            />
                            <div className="cruises_name">
                              {filters?.[3]?.value?.split("-")?.join(" ")}{" "}
                              <span>Cruises</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="col-lg-12">
                      <div className="row">
                        {filters?.[4] && (
                          <div className="col-lg-5">
                            <div className="cruise_list">
                              <Link
                                to={`/cruisecollection?categories=${filters?.[4]?.value}`}
                              >
                                <img
                                  src={filters?.[4]?.image}
                                  className="img-fluid"
                                  alt="Luxury European Cruises"
                                />
                                <div className="cruises_name">
                                  {filters?.[4]?.value?.split("-")?.join(" ")}{" "}
                                  <span>Cruises</span>
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}

                        {filters?.[5] && (
                          <div className="col-lg-7">
                            <div className="cruise_list">
                              <Link
                                to={`/cruisecollection?categories=${filters?.[5]?.value}`}
                              >
                                <img
                                  src={filters?.[5]?.image}
                                  className="img-fluid"
                                  alt="Luxury Baltic Cruises"
                                />
                                <div className="cruises_name">
                                  {filters?.[5]?.value?.split("-")?.join(" ")}{" "}
                                  <span>Cruises</span>
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : !filters?.length && loading ? (
              <div className="d-flex justify-content-center align-items-center h-25">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>
            ) : !filters?.length ? (
              <div className="d-flex text-center">No Data Available</div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-25">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only"></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cruiseinspren;
