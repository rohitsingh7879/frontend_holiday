import React from 'react';

export const Page404 = () => {
  return (
    <>
      <div className="error_div">
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-4"><img src="assets/images/404.png" className="img-fluid" /></div>
            </div>
          </div>
        </div>
        <section className="new_subscribe">
          <div className="container">
            <h3>Subscribe to the Newsletter</h3>
            <p>Subscribe to our Newsletter for the latest offers and deals!</p>
            <div className="subm">
              <input type="text" name="search" placeholder="Your email address" />
              <input type="submit" defaultValue="Subscribe" className="search_btn2" />
            </div>	
          </div>
        </section>
        <section className="customer_say">
          <div className="container">
            <h2>What our customers have to say</h2>
            <img src="assets/images/review.png" className="img-fluid" />
          </div>
        </section>
    </>
  )
}
