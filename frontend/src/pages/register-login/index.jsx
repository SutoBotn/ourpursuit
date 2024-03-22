import React, { useState } from "react";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import SignInOverlay from "./SignInOverlay";
import SignUpOverlay from "./SignUpOverlay";
import Layout from "../../components/layout";

const LoginPage = ({ updateToken }) => {
  const [toggleOverlay, setToggleOverlay] = useState(false);

  return (
    <Layout>
  
    <div className="w-5/6 bg-transparent border-orange border-8 relative overflow-hidden rounded-lg p-56">
      <div
        className={`absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out z-20 ${
          toggleOverlay ? "translate-x-full opacity-0" : ""
        }`}
      >
        <SigninForm updateToken={updateToken} />
      </div>

      <div
        className={`absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out ${
          toggleOverlay
            ? "translate-x-full opacity-100 z-30 animate-show"
            : "opacity-0 z-10"
        }`}
      >
        <div className="h-full w-full flex justify-center items-center">
          <SignupForm updateToken={updateToken} />
        </div>
      </div>

      <div
        className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-40 ${
          toggleOverlay ? "-translate-x-full" : ""
        }`}
      >
        <div
          className={`bg-orange relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${
            toggleOverlay ? "translate-x-1/2" : "translate-x-0"
          }`}
        >
          <div
            className={`w-1/2 h-full absolute flex justify-center items-center top-0 transform -translate-x-[20%] transition-transform duration-700 ease-in-out ${
              toggleOverlay ? "translate-x-0" : "-translate-x-[20%]"
            }`}
          >
            <SignInOverlay
              toggleOverlay={toggleOverlay}
              setToggleOverlay={setToggleOverlay}
            />
          </div>
          <div
            className={`w-1/2 h-full absolute flex justify-center items-center top-0 right-0 transform transition-transform duration-700 ease-in-out ${
              toggleOverlay ? "translate-x-[20%]" : "translate-x-0"
            }`}
          >
            <SignUpOverlay
              toggleOverlay={toggleOverlay}
              setToggleOverlay={setToggleOverlay}
            />
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default LoginPage;
