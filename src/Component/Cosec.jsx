import React from 'react'
import icon1 from '../assets/images/icons/icon1.png';
import icon2 from '../assets/images/icons/icon2.png';
import icon3 from '../assets/images/icons/icon3.png';
import icon4 from '../assets/images/icons/icon4.png';
import icon5 from '../assets/images/icons/icon5.png';
const Cosec = () => {
  return (
    <>
       <section className="why mt50">
            <div className="container">
              <div className="text-center"><h2>Why Book with Holiday2?</h2></div>
              <div className="row justify-content-center">
                <div className="col-lg-4">
                  <div className="why_block">
                    <img src={icon1} className="img-fluid" />
                    <h3>Exclusive Offers Masterfully Curated by Our Prestigious Product Team</h3>
                    <p>Enjoy privileged access to bespoke deals, thoughtfully designed by our exceptionally experienced travel artisans.</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="why_block">
                    <img src={icon2} className="img-fluid" />
                    <h3>Esteemed UK-Based Sales Consultants</h3>
                    <p>Entrust your voyage to our elite team of seasoned experts, dedicated to tailoring every aspect of your journey.</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="why_block">
                    <img src={icon3} className="img-fluid" />
                    <h3>Unrivalled Financial Security with ATOL Protection</h3>
                    <p>Embark with absolute confidence, assured that your investment is impeccably safeguarded.</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="why_block">
                    <img src={icon4} className="img-fluid" />
                    <h3>Proud Members of CLIA – The Epitome of Cruise Expertise</h3>
                    <p>Benefit from the guidance of certified cruise specialists, recognised for their unparalleled industry insight.</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="why_block">
                    <img src={icon5} className="img-fluid" />
                    <h3>White-Glove CustomeR Care</h3>
                    <p>Delight in seamless, attentive support that ensures an effortless experience from your first inquiry to your final destination.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
    </>
  )
}

export default Cosec