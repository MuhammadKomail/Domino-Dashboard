import React from "react";
import { PiCellSignalXBold } from "react-icons/pi";

const NoInternet = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center w-full h-full">
            <div className="bg-white w-full max-w-md sm:w-[30%] sm:h-[35%] flex flex-col justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.2)] rounded-2xl p-6 sm:p-8">
                <PiCellSignalXBold size={100} color="black" />
                <h1 className="text-xl sm:text-2xl font-bold text-black mt-4 text-center">
                    No Internet Connection
                </h1>
                <p className="text-black mt-2 text-center text-sm sm:text-base">
                    Please check your internet connection and try again.
                </p>
                <button
                    className="mt-4 text-white py-2 px-4 rounded-md bg-[#01BCCD] border-none cursor-pointer text-sm sm:text-base"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        </div>
    );
};

export default NoInternet;