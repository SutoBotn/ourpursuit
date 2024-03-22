import React from "react";

const SignInOverlay = ({ toggleOverlay, setToggleOverlay }) => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-cream mb-4">
        Already have an account?
      </h1>

      <h5 className="text-lg md:text-xl text-cream">Welcome back! Log in to reconnect with your community.</h5>
      <div className="mt-10">
        <button
          className="py-2 md:py-3 px-6 bg-cream rounded-full text-center text-orange font-bold uppercase active:scale-110 transition-transform ease-in"
          onClick={() => {
            setToggleOverlay(!toggleOverlay);
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignInOverlay;
