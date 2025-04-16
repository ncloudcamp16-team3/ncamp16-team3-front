import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton } from "@mui/material";
import { produce } from "immer";

const LikeBtn = ({ liked, setLiked, setPostData }) => {
    const likeBtnClick = () => {
        if (liked) {
            setPostData(
                produce((draft) => {
                    draft.likeCount -= 1;
                })
            );
        } else {
            setPostData(
                produce((draft) => {
                    draft.likeCount += 1;
                })
            );
        }
        setLiked(!liked);
    };

    return (
        <IconButton
            onClick={likeBtnClick}
            sx={{
                transition: "transform 0.2s ease-in-out",
                "&:active": {
                    transform: "scale(1.2)",
                },
            }}
        >
            {liked ? (
                <FavoriteIcon sx={{ color: "red", fontSize: "35px" }} />
            ) : (
                <FavoriteBorderIcon sx={{ color: "gray", fontSize: "35px" }} />
            )}
        </IconButton>
    );
};

export default LikeBtn;
