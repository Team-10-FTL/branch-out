import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Box } from "@mui/material";
import RepoCardModal from "../RepoCardModal/RepoCardModal";

export default function SavedRepoCard({ repo }) {
const [open, setOpen] = useState(false);
const handleClose = () => setOpen(false);

return (
    <>
    <RepoCardModal open={open} handleClose={handleClose} repo={repo} />
    <Card
        sx={{
        margin: 2,
        width: 300,
        borderRadius: 2,
        // border: 1,
        // borderColor: "#E34714",
        boxShadow: "0 4px 12px rgba(255,255,255,0.04",
        background: "#111",
        color: "#fff",
        "&:hover": {
            boxShadow: "0 0 20px rgba(232,63,37,0.15)",
            transform: "scale(1.03)",
        },
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        }}
        onClick={() => setOpen(true)}
    >
        <CardActionArea>
        <CardMedia
            component="img"
            height="140"
                    src={`LangImages/${repo.languages[0]}.png`}
                    alt={repo.name ? `Image of ${repo.name}` : "Repository image"}
                    onError={(e) => {
                        e.target.onerror = null; // Prevents infinite loop if fallback also fails
                        e.target.src = 'https://avatars.githubusercontent.com/u/31138227?v=4'; // Default fallback image URL
                    }}
            sx={{
                objectFit: "contain",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            }}
        />
        <CardContent>
            <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ fontWeight: 600 }}
            >
            {repo.name}
            </Typography>
            <Typography
            variant="body2"
            sx={{ color: "#ccc", mb: 1 }}
            noWrap
            >
            {repo.description || "No description available"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
            ⭐ {repo.stars ?? "N/A"}
            </Typography>
        </CardContent>
        </CardActionArea>
    </Card>
    </>
);
}
