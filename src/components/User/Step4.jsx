import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Step4 = ({ formData, prevStep }) => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="90%"
            mx="auto"
            gap={2}
        >
            <Typography variant="h6" fontWeight="bold" textAlign="center">
                입력한 정보를 확인하세요
            </Typography>

            <Box textAlign="left" width="100%">
                <Typography>닉네임: {formData.nickname}</Typography>
                <Typography>반려동물 이름: {formData.petName}</Typography>
                <Typography>등록번호: {formData.petRegistration}</Typography>
                <Typography>성별: {formData.petGender}</Typography>
                <Typography>
                    생일: {dayjs(formData.petBirthday).format("YYYY-MM-DD")}
                </Typography>
                <Typography>몸무게: {formData.petWeight}</Typography>
                <Typography>체형: {formData.petBodyType}</Typography>
                <Typography>소개: {formData.petIntroduction}</Typography>
                <Typography>중성화 여부: {formData.petNeutered}</Typography>
                <Typography>좋아하는 것: {formData.petFavorite}</Typography>
            </Box>

            <Button
                variant="contained"
                onClick={prevStep}
                sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
            >
                뒤로
            </Button>

            <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
            >
                제출
            </Button>
        </Box>
    );
};

export default Step4;
// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import axios from "axios";
//
// const Step4 = ({ formData, prevStep }) => {
//     const navigate = useNavigate();
//
//     const handleSubmit = async () => {
//         try {
//             const response = await axios.post(
//                 "https://67ee396ac11d5ff4bf78c71f.mockapi.io/pets/pets",
//                 {
//                     nickname: formData.nickname,
//                     petName: formData.petName,
//                     petRegistration: formData.petRegistration,
//                     petGender: formData.petGender,
//                     petBirthday: dayjs(formData.petBirthday).format(
//                         "YYYY-MM-DD"
//                     ),
//                     petWeight: formData.petWeight,
//                     petBodyType: formData.petBodyType,
//                     petIntroduction: formData.petIntroduction,
//                     petNeutered: formData.petNeutered,
//                     petFavorite: formData.petFavorite,
//                 }
//             );
//
//             console.log("응답 데이터:", response.data);
//             navigate("/"); // 성공 시 메인 페이지로 이동
//         } catch (error) {
//             console.error("데이터 전송 오류:", error);
//         }
//     };
//
//     return (
//         <Box
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             width="90%"
//             mx="auto"
//             gap={2}
//         >
//             <Typography variant="h6" fontWeight="bold" textAlign="center">
//                 입력한 정보를 확인하세요
//             </Typography>
//
//             <Box textAlign="left" width="100%">
//                 <Typography>닉네임: {formData.nickname}</Typography>
//                 <Typography>반려동물 이름: {formData.petName}</Typography>
//                 <Typography>등록번호: {formData.petRegistration}</Typography>
//                 <Typography>성별: {formData.petGender}</Typography>
//                 <Typography>
//                     생일: {dayjs(formData.petBirthday).format("YYYY-MM-DD")}
//                 </Typography>
//                 <Typography>몸무게: {formData.petWeight}</Typography>
//                 <Typography>체형: {formData.petBodyType}</Typography>
//                 <Typography>소개: {formData.petIntroduction}</Typography>
//                 <Typography>중성화 여부: {formData.petNeutered}</Typography>
//                 <Typography>좋아하는 것: {formData.petFavorite}</Typography>
//             </Box>
//
//             <Button
//                 variant="contained"
//                 onClick={prevStep}
//                 sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
//             >
//                 뒤로
//             </Button>
//
//             <Button
//                 variant="contained"
//                 onClick={handleSubmit}
//                 sx={{ mt: 3, width: "100%", backgroundColor: "#E9A260" }}
//             >
//                 제출
//             </Button>
//         </Box>
//     );
// };
//
// export default Step4;
