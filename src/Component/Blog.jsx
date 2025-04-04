import React from 'react'
import blog1 from '../assets/images/blog1.png';
import blog2 from '../assets/images/blog2.png';
import blog3 from '../assets/images/blog3.png';
import Customersay from './Customersay';
const Blog = () => {
  return (
    <>
    {/* <section className="blogs">
  <div className="container">
    <div className="row">
      <div className="col-lg-6"><h2>Blog | Our Expert Concierge</h2></div>
      <div className="col-lg-6 text-end">
        <a href="#" className="see_all">See all</a>
      </div>
    </div>

    <div className="row">
      <div className="col-lg-4">
        <div className="bg_post">
          <a href="#"><img src={blog1} className="img-fluid" alt="Blog 1" /></a>
          <div className="dis_content">
            <span>April 06 2023 | By Holly S</span>
            <h3><a href="#">Kenya vs Tanzania Safari: The Better African Safari Experience</a></h3>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="bg_post">
          <a href="#"><img src={blog2} className="img-fluid" alt="Blog 2" /></a>
          <div className="dis_content">
            <span>April 06 2023 | By Holly S</span>
            <h3><a href="#">Kenya vs Tanzania Safari: The Better African Safari Experience</a></h3>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="bg_post">
          <a href="#"><img src={blog3} className="img-fluid" alt="Blog 3" /></a>
          <div className="dis_content">
            <span>April 06 2023 | By Holly S</span>
            <h3><a href="#">Kenya vs Tanzania Safari: The Better African Safari Experience</a></h3>
          </div>
        </div>
      </div>

    </div>

  </div>
</section> */}
<Customersay />
    </>
  )
}

export default Blog