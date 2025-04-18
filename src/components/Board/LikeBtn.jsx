import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton } from "@mui/material";

const LikeBtn = ({ liked, likeBtnClick, fontSize }) => {
    return (
        <IconButton
            onClick={() => likeBtnClick()}
            sx={{
                transition: "transform 0.2s ease-in-out",
                "&:active": {
                    transform: "scale(1.2)",
                },
            }}
        >
            {liked ? (
                <FavoriteIcon sx={{ color: "red", fontSize: fontSize }} />
            ) : (
                <FavoriteBorderIcon sx={{ color: "gray", fontSize: fontSize }} />
            )}
        </IconButton>
    );
};

export default LikeBtn;
