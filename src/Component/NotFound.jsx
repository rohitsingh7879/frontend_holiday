import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/notFound.css";
import { image_404 } from "../assets/images";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <img src={image_404} alt="404 Not Found" className="notfound-image" />
      <h1 className="notfound-title">Oops! Page not found.</h1>
      <p className="notfound-text">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="notfound-btn">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
