import React from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Step3 = () => {
    const navigate = useNavigate();
    return (
        // <div className="flex flex-col">
        //     세번째페이지
        //     <button
        //         className="border border-black"
        //         onClick={() => navigate("/")}
        //     >
        //         제출
        //     </button>
        // </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["MobileDatePicker"]}>
                    <DemoItem label="Mobile variant">
                        <MobileDatePicker defaultValue={dayjs("2022-04-17")} />
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>

            <button
                className="border border-black"
                onClick={() => navigate("/")}
            >
                제출
            </button>
        </div>
    );
};

export default Step3;
