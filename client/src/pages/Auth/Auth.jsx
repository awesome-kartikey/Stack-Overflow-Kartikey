import React, { useState } from "react";
import "./Auth.css";
import icon from "../../Assets/icon.png";
import AboutAuth from "./AboutAuth";


const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);

  const handleSwitch = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div>
      <section className="auth-section">
        {isSignup && <AboutAuth />}
        <div className="aut-container-2">
          {!isSignup && (
            <img src={icon} alt="stack overflow" classname="login-logo" />
          )}
          <form>
              {
                isSignup && (
                    <label htmlFor="">
                      <h4>Enter Name</h4>
                      <input type="text" id='name' name='name'/>
                    </label>
                )
              }


            <label htmlFor="email">
              <h4>Email</h4>
              <input type="email" name="email" id="email" />
            </label>
            <label htmlFor="password">
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <h4>Password</h4>
                {!isSignup && <p style={{color:"#666767", fonSize:"13px"}}>Forgot Password?</p>}
              </div>
              <input type="password" name="password" id="password" />
              {isSignup && <p style={{color:"#666767", fontSize:"13px"}}>Passwords must contain at least eight <br/>characters, including at least 1 letter <br/>and 1 number.</p>}
            </label>
            {
              isSignup && (
                <label htmlFor="check">
                    <input type="checkbox" id="check"/>
                    <p style={{fontSize:"13px"}}>Opt-in to receive occasional product<br/> updates, user research invitations,<br/> company announcements, and digests.</p>
                </label>
              )
            }
            <button type="submit" className="auth-btn">
              {isSignup ? "Sign Up" : "Log in"}{" "}
            </button>
            {
              isSignup && (
                <p style={{color: "#666767", fontSize:"13px"}}>
                  By clicking “Sign up”, you agree to our 
                  <span style={{color: "#007ac6"}}> terms of <br/>services</span> , 
                  <span style={{color: "#007ac6"}}>privacy policy</span> and 
                  <span style={{color: "#007ac6"}}> cookie policy</span>
                </p>
              )
            }
          </form>
          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              type="button"
              className="handle-switch-btn"
              onClick={handleSwitch}
            >
              {isSignup ? "Log in" : "Sign Up"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Auth;