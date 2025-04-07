// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Home from "./Pages/Home";
// import SearchResults from "./Pages/SearchResults";
// import CruiseDetail from "./Pages/CruiseDetail";
// import Newcruisesdetails from "./Pages/Newcruisesdetails";
// import CruiseDeals from "./Pages/CruiseDeals";
// import Cruisesearch from "./Component/Cruisesearch";
// import Regions from "./Pages/Regions";
// import Oprator from "./Pages/Oprator";
// import Footer from "./Component/Footer";
// import Header from "./Component/Header";
// import CruiseCollection from "./Pages/CruiseCollection";
// import AboutUs from "./Pages/AboutUs";
// import Contact from "./Pages/Contact";
// import Newsletter from "./Pages/Newsletter";
// import Faq from "./Pages/Faq";
// import Model from "./Component/Model";
// import PrivacyAndPolicy from "./Pages/PrivacyAndPolicy";
// import "./App.css";
// import CareerOportunity from "./Pages/CareerOportunity";
// function App() {
//   return (
//     <>
//       <BrowserRouter basename="/">
//         <Header />
//         <Routes>
//           {/* Home route */}

//           <Route path="/" element={<Home />} />

//           {/* Dynamic CruiseDetail route */}
//           <Route path="/CruiseDetail/:shipname" element={<CruiseDetail />} />
//           <Route path="/cruise-details/:details" element={<CruiseDetail />} />

//           <Route
//             path="/Newcruisesdetails/:_id"
//             element={<Newcruisesdetails />}
//           />
//           <Route
//             path="/new-cruise-details/:details"
//             element={<Newcruisesdetails />}
//           />
//           {/* Cruisesearch route */}
//           <Route path="/Cruisesearch" element={<Cruisesearch />} />
//           <Route path="/Model" element={<Model />} />
//           {/* Search results route */}
//           <Route path="/search-results" element={<SearchResults />} />
//           <Route path="/cruise-deals" element={<CruiseDeals />} />
//           {/* Regions route */}
//           <Route path="/regions" element={<Regions />} />
//           <Route path="/oprator" element={<Oprator />} />
//           <Route path="/aboutus" element={<AboutUs />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/newsletter" element={<Newsletter />} />
//           <Route path="/faq" element={<Faq />} />
//           <Route path="/cruisecollection" element={<CruiseCollection />} />

//           <Route path="/privacy-and-policy" element={<PrivacyAndPolicy />} />
//           <Route path="/career-oportunity" element={<CareerOportunity />} />
//         </Routes>
//         <Footer />
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Pages/Home"));
const SearchResults = lazy(() => import("./Pages/SearchResults"));
const CruiseDetail = lazy(() => import("./Pages/CruiseDetail"));
const Newcruisesdetails = lazy(() => import("./Pages/Newcruisesdetails"));
const CruiseDeals = lazy(() => import("./Pages/CruiseDeals"));
const Cruisesearch = lazy(() => import("./Component/Cruisesearch"));
const Regions = lazy(() => import("./Pages/Regions"));
const Oprator = lazy(() => import("./Pages/Oprator"));
const Footer = lazy(() => import("./Component/Footer"));
const Header = lazy(() => import("./Component/Header"));
const CruiseCollection = lazy(() => import("./Pages/CruiseCollection"));
const AboutUs = lazy(() => import("./Pages/AboutUs"));
const Contact = lazy(() => import("./Pages/Contact"));
const Newsletter = lazy(() => import("./Pages/Newsletter"));
const Faq = lazy(() => import("./Pages/Faq"));
const Model = lazy(() => import("./Component/Model"));
const PrivacyAndPolicy = lazy(() => import("./Pages/PrivacyAndPolicy"));
const CareerOportunity = lazy(() => import("./Pages/CareerOportunity"));

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Suspense
          fallback={
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          }
        >
          <Header />
          <Routes>
            {/* Home route */}
            <Route path="/" element={<Home />} />

            {/* Dynamic CruiseDetail route */}
            <Route path="/CruiseDetail/:shipname" element={<CruiseDetail />} />
            <Route path="/cruise-details/:details" element={<CruiseDetail />} />

            <Route
              path="/Newcruisesdetails/:_id"
              element={<Newcruisesdetails />}
            />
            <Route
              path="/new-cruise-details/:details"
              element={<Newcruisesdetails />}
            />

            {/* Cruisesearch route */}
            <Route path="/Cruisesearch" element={<Cruisesearch />} />
            <Route path="/Model" element={<Model />} />

            {/* Search results route */}
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/cruise-deals" element={<CruiseDeals />} />

            {/* Regions route */}
            <Route path="/regions" element={<Regions />} />
            <Route path="/oprator" element={<Oprator />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/cruisecollection" element={<CruiseCollection />} />

            <Route path="/privacy-and-policy" element={<PrivacyAndPolicy />} />
            <Route path="/career-oportunity" element={<CareerOportunity />} />
          </Routes>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
