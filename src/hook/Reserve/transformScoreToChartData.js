export default function transformScoreToChartData(ratingRatio) {
    if (!ratingRatio || !Array.isArray(ratingRatio)) return [];

    const scoreMap = {
        "5Stars": 0,
        "4Stars": 0,
        "3Stars": 0,
        "2Stars": 0,
        "1Star": 0,
    };

    // ratingRatio = [[5, 1], [4, 2], ...] 이런 형태
    ratingRatio.forEach(([star, count]) => {
        if (star === 5) scoreMap["5Stars"] = count;
        else if (star === 4) scoreMap["4Stars"] = count;
        else if (star === 3) scoreMap["3Stars"] = count;
        else if (star === 2) scoreMap["2Stars"] = count;
        else if (star === 1) scoreMap["1Star"] = count;
    });

    const total = Object.values(scoreMap).reduce((sum, cur) => sum + cur, 0);

    return [
        {
            name: "★5",
            value: scoreMap["5Stars"],
            percentage: total ? Math.round((scoreMap["5Stars"] / total) * 100) : 0,
        },
        {
            name: "★4",
            value: scoreMap["4Stars"],
            percentage: total ? Math.round((scoreMap["4Stars"] / total) * 100) : 0,
        },
        {
            name: "★3",
            value: scoreMap["3Stars"],
            percentage: total ? Math.round((scoreMap["3Stars"] / total) * 100) : 0,
        },
        {
            name: "★2",
            value: scoreMap["2Stars"],
            percentage: total ? Math.round((scoreMap["2Stars"] / total) * 100) : 0,
        },
        { name: "★1", value: scoreMap["1Star"], percentage: total ? Math.round((scoreMap["1Star"] / total) * 100) : 0 },
    ];
}
