// import React, { useState } from "react";
// import "./Homebody.css";
// import helpingHand from "../Assets/helping-hand.jpg";
// import depression from "../Assets/depression.jpg";
// import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";





// const Homebody = () => {
//   const slides = [
//     { id: 1, image: helpingHand },
//     { id: 2, image: depression },
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const goPrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
//   };

//   const goNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
//   };

//   return (
//     <div className="slider-container">
//       <div className="slider">
//         <MdOutlineKeyboardArrowLeft className="arrow left-arrow" onClick={goPrev} />
//         <div className="slide">
//           <img src={slides[currentIndex].image} alt="slide" />
//         </div>
//         <MdOutlineKeyboardArrowRight className="arrow right-arrow" onClick={goNext} />
//       </div>
//     </div>
//   );
// };

// export default Homebody;






import React, { useState } from "react";
import "./Homebody.css";
import helpingHand from "../Assets/helping-hand.jpg";
import depression from "../Assets/depression.jpg";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from 'react-router-dom';

const Homebody = () => {
  const slides = [
    { id: 1, image: depression },
    { id: 2, image: helpingHand },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slider-container">
      <img
        src={slides[currentIndex].image}
        alt={`Slide ${currentIndex}`}
        className="slide-image"
      />



     {slides[currentIndex].image === depression && (
        <div className="overlay-text-left">
            <p>Are you Lonely?</p>
            <p>Distressed?</p>
            <p>Suicidal?</p>
            <h3>You are not alone. FriendlyHelp wants to hear from you!</h3>
            <button className="call-button">Call Us</button>
        </div>
      )}


       {slides[currentIndex].image === helpingHand && (
            <div className="overlay-text right">
            <p>Ready to make a</p>
            <p>Difference</p>
            <h3>Join our Volunteer Team</h3>
            {/* <button className="apply-button">Apply Now</button> */}
             <Link to="/apply-now" className="apply-button">Apply Now</Link>
            </div>
        )}




      <MdOutlineKeyboardArrowLeft
        className="arrow left-arrow"
        onClick={goPrev}
      />
      <MdOutlineKeyboardArrowRight
        className="arrow right-arrow"
        onClick={goNext}
      />
    </div>
  );
};

export default Homebody;
