/**
 * 선택된 마릿수 문자열을 백엔드 API가 요구하는 enum 값으로 변환
 * @param {string} petCountStr 마릿수 문자열
 * @returns {string} 백엔드 API enum 값
 */
export const getPetCountEnum = (petCountStr) => {
    switch (petCountStr) {
        case "1마리":
            return "ONE";
        case "2마리":
            return "TWO";
        case "3마리 이상":
            return "THREE_PLUS";
        default:
            return "ONE"; // 기본값
    }
};

/**
 * 선택된 반려동물 종류를 백엔드 API가 요구하는 ID 값으로 변환
 * @param {string} petTypeStr 반려동물 종류 문자열
 * @returns {number|null} 백엔드 API ID 값
 */
export const getPetTypeId = (petTypeStr) => {
    if (!petTypeStr) return null;

    switch (petTypeStr) {
        case "강아지":
            return 1;
        case "고양이":
            return 2;
        case "앵무새":
            return 3;
        case "햄스터":
            return 4;
        case "기타":
            return 5;
        default:
            return null; // 선택된 값이 없는 경우
    }
};

/**
 * API 요청용 펫시터 데이터 객체 생성
 * @param {Object} formData 폼 데이터 객체
 * @returns {Object} API 요청용 데이터 객체
 */
export const createPetSitterRequestData = (formData) => {
    const { selectedAges, hasPet, petTypes, petCount, sitterExperience, houseType, commentText } = formData;

    return {
        // 필수 필드
        userId: null, // 토큰에서 추출될 값
        age: Object.keys(selectedAges).find((key) => selectedAges[key]) || "20대",
        houseType: Object.keys(houseType).find((key) => houseType[key]) || "아파트",
        comment: commentText || "제 가족이라는 마음으로 돌봐드려요 ♥",
        grown: hasPet["네, 키우고 있습니다"] ? true : false,

        // 백엔드 enum 값으로 변환
        petCount: getPetCountEnum(Object.keys(petCount).find((key) => petCount[key])),

        // 경험 boolean 값
        sitterExp: sitterExperience["네, 해본적 있습니다"] ? true : false,

        // 반려동물 유형 ID
        petTypeId: getPetTypeId(Object.keys(petTypes).find((key) => petTypes[key])),
    };
};

/**
 * FormData 객체를 생성하여 API 요청에 필요한 데이터를 설정
 * @param {Object} petSitterData 펫시터 데이터 객체
 * @param {Blob|null} imageBlob 이미지 Blob 객체
 * @returns {FormData} API 요청에 사용할 FormData 객체
 */
export const createFormData = (petSitterData, imageBlob) => {
    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    formData.append("data", new Blob([JSON.stringify(petSitterData)], { type: "application/json" }));

    // 이미지가 있으면 추가
    if (imageBlob) {
        formData.append("image", imageBlob, "profile.jpg");
    }

    return formData;
};
