import React from "react";
import bstudy from "../../images/bstudy.png"
import Image from "next/image";

function HomeMeetings() {
  return (
    <div>
      <div className="meetings-container">
        <h1>Meetings and Classes</h1>
        <div className="meeting-wrapper">
          <div className="meeting-item">
            <h3>Worship Service</h3>
            <h4>Sunday</h4>
            <p>10:00am - 11:30am</p>
          </div>
          <div className="meeting-item">
            <h3>Bible Study</h3>
            <h4>Thursday</h4>
            <p>6:00pm</p>
          </div>
          <div className="meeting-item">
            <h3>Bible Study</h3>
            <h4>Saturday</h4>
            <p>9:30am</p>
          </div>
          {/* <div className="meeting-item">
            <h3>Christian Art Camp</h3>
            <h4>Sunday</h4>
            <p>12-1:30pm</p>
          </div> */}
          <div className="meeting-item">
            <h3>Christian Womans Connection</h3>
            <h4>Last Monday of the month</h4>
            <p>1:00pm</p>
          </div>
        </div>
      </div>
      <div className="bstudy-container">
        <Image className="bstudy-img" src={bstudy} width={650} alt="" />
      </div>
    </div>
  );
}

export default HomeMeetings;
