import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Box } from "@mui/material";
import RepoCardModal from "../RepoCardModal/RepoCardModal";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

export default function SavedRepoCard({ repo }) {
const [open, setOpen] = useState(false);
const handleClose = () => setOpen(false);

return (
    <>
    <RepoCardModal open={open} handleClose={handleClose} repo={repo} />
    <Card
       sx={{
          margin: 1,
          width: 300,
          height:130,
          borderRadius: 2,
          border: "1px solid #292629ff",
          // Force override MUI's default background
          backgroundColor: "#1c1b1e",
          backgroundImage: "none",
          color: "white",
          boxShadow: "0 0 6px rgba(255, 255, 255, 0.3)",
          // Override the Paper component's CSS variables
          "--Paper-shadow": "0 4px 12px rgba(100, 83, 83, 0.04)",
          "--Paper-overlay": "none",
          "&:hover": {
            boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
            transform: "scale(1.01)",
            backgroundColor: "#2a292dff",
          },
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          // Additional overrides for nested components
          "& .MuiCardContent-root": {
            backgroundColor: "transparent",
          },
          "& .MuiCardActionArea-root": {
            backgroundColor: "transparent",
          },
        }}
        onClick={() => setOpen(true)}
    >
        <CardActionArea sx = {{height:"100%"}}>
        <Box sx = {{display:"flex", height:"100%"}}>
        <CardContent
            sx = {{
                flex:1,
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                marginLeft:"-10px",
                padding:2,
                "&:last-child":{paddingBottom:2}
            }}
        > 
        <Box sx = {{textAlign: "left", maxWidth:"190px", paddingLeft:"5px"}}>
            <Typography
            gutterBottom
            variant="h7"
            component="div"
            sx={{ fontWeight: 500, marginBottom:1, lineHeight:1.2 }}
            >
            {repo.name}
            </Typography>
            <Typography
            variant="body2"
            sx={{ fontFamily: "Inter, sans-serif", fontSize:"12px", color: "#b3aaaaff", mb: 1, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", lineHeight:1.3, fontWeight:300
            }}
            >
            {repo.description || "No description available"}
            </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: "auto", paddingLeft:"7px" }}>
                <StarBorderIcon sx={{ fontSize: "14px", mr: 0.3, color: "#e37106" }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#b3aaaaff",
                    fontSize: "11px",
                    fontWeight: 400,
                    position:"relative",
                    top:".8px"
                  }}
                >
                  {repo.stars ?? "N/A"}
                </Typography>
        </Box>
        </CardContent>
        <Box sx={{ 
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: "100%",
            }}>
        <CardMedia
            component="img"
            sx={{
            width: 80,
            padding: "5px",
            marginRight:"8px",
            mt:"8px",
            objectFit: "contain",
            }}
            src={`LangImages/${repo.languages[0]}.png`}
            alt={repo.name ? `Image of ${repo.name}` : "Repository image"}
            onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://avatars.githubusercontent.com/u/31138227?v=4';
            }}
        />
        <TrendingFlatIcon sx = {{color:"#a4a2a2ff", fontSize:"30px", marginRight:"15px", mb:"9px", "&:hover":{color:"white"}}}/>
        </Box>
        </Box>
        </CardActionArea>
    </Card>
    </>
);
}
