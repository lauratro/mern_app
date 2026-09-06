import React, {  useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Comment from "../components/CommentForm";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { VariablesContext } from "../context/VariablesContext";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import Typography from "@material-ui/core/Typography";
import ConvertedAddress from "../components/ConvertedAddress";
import DisplayComment from "./displayComment";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
const serverURL = require("../config.js").serverURL;
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: "0 auto",
  },
  media: {
    height: 140,
  },
  paperElem: {
    fontSize: 20,
    margin: "15px 5px 15px 5px",
    padding: 7,
  },
  goBackBtn: {
    padding: 5,
    backgroundColor: "orange",
    borderRadius: 5,
  },
});

export default function SinglePet(props) {
  let history = useHistory();

  const {  onePet, setOnePet } =
    useContext(VariablesContext);
  let { id } = useParams();
 
 

  useEffect(() => {
    const singlePetfetch = () => {
      console.log("Fetching:", `${serverURL}/pets/details/${id}`);

      fetch(`${serverURL}/pets/details/${id}`)
        .then((res) => {
          console.log("SinglePet response status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("SinglePet data:", data);
          setOnePet(data);
        })
        .catch((error) => {
          console.error("SinglePet fetch error:", error);
        });
    };

    singlePetfetch();
  }, []);

  const classes = useStyles();

  return (
    onePet !== null && (
      <div style={{ marginTop: 90, width: "100vw", marginBottom: "10vh" }}>
        <Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              style={{ borderRadius: 15 }}
              className={classes.media}
              image={onePet.img}
              title="Pet"
            />
            <CardContent>
              <Typography
                style={{ fontWeight: "bold", backgroundColor: "orange" }}
                gutterBottom
                variant="h5"
                component="h2"
              >
                {onePet.name}
              </Typography>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Paper
                  className={classes.paperElem}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  <span style={{ fontWeight: "bold" }}> Species: </span>
                  {onePet.type}
                </Paper>
                <Paper
                  className={classes.paperElem}
                  variant="body2"
                  color="textSecondary"
                  component="p"
                >
                  <span style={{ fontWeight: "bold" }}>Breed:</span>{" "}
                  {onePet.breed}
                </Paper>
              </div>
              <Typography variant="body2" color="textSecondary" component="p">
                <span
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    fontSize: 20,
                    margin: 5,
                  }}
                >
                  Further Information:
                </span>{" "}
                {onePet.info}
              </Typography>

              <Typography
                style={{ marginTop: 10 }}
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {onePet.markers && (
                  <ConvertedAddress markers={onePet.markers} />
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <button
              className={classes.goBackBtn}
              onClick={() => history.goBack()}
            >
              <KeyboardArrowLeftIcon />
            </button>
          </CardActions>
        </Card>
        <div>
          <DisplayComment petComments={onePet.comments} petId={onePet._id} />

          <Comment petId={id} />
        </div>
      </div>
    )
  );
}
