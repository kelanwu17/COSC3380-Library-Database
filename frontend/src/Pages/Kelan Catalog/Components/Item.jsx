import {
  Paper,
  styled,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));
function Item({ subData, type }) {
  const [route, setRoute] = useState("");
  const [person, setPerson] = useState("");
  const [title, setTitle] = useState("");
  const [height, setHeight] = useState("250px");
  const [width, setWidth] = useState("");
  const [elevation, setElevation] = useState(3);

  useEffect(() => {
    if (type === "books") {
      setRoute(`/books/${subData.bookId}`);
      setPerson(subData.author);
      setTitle(subData.title);
      setWidth("200px");
    } else if (type === "music") {
      setRoute(`/music/${subData.musicId}`);
      setPerson(subData.artist);
      setTitle(subData.albumName);
      setWidth("250px");
    } else if (type === "tech") {
      setRoute(`/tech/${subData.techId}`);
      setTitle(subData.deviceName);
      setWidth("250px");
    }
  }, [type, subData]);
  return (
    <div>
      <a
        href={route}
        onMouseEnter={() => setElevation(13)} 
        onMouseLeave={() => setElevation(3)} 
      >
        <LightTooltip
          title="View Details"
          placement="top"
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -120],
                  },
                },
              ],
            },
          }}
        >
          <Paper
            sx={{
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center", 
              height: height,
              width: width,
              overflow: "hidden",
              position: "relative",
            }}
            elevation={elevation}
          >
            <img
              src={subData.imgUrl}
              alt={title}
              style={{
                width: width, 
                height: height,
              }}
            />
          </Paper>
          <Typography variant="h6">{title.length > 20 ? title.slice(0,20) + "..." : title}</Typography>
          <Typography variant="button" sx={{}}>
            {person}
          </Typography>
        </LightTooltip>
      </a>
    </div>
  );
}

export default Item;
