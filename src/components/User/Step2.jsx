import React from "react";

const Step2 = ({ nextStep }) => {
    return (
        // <div className="flex flex-col">
        //     두번째페이지
        //     <button className="border border-black" onClick={nextStep}>
        //         다음
        //     </button>
        // </div>
        <div>
            <div className="flex max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden mx-auto">
                <button className="border border-black" onClick={nextStep}>
                    다음
                </button>

                <div className="w-2 bg-gray-800"></div>

                <div className="flex items-center px-2 py-3">
                    <form className="w-full max-w-sm">
                        <div className="flex items-center border-b border-gray-400 py-2">
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                placeholder="Jane Doe"
                                aria-label="Full name"
                            />
                            <button
                                className="flex-shrink-0 bg-green-500 hover:bg-green-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                                type="button"
                            >
                                Sign Up
                            </button>
                            <button
                                className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Step2;
