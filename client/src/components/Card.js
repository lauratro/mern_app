import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { VariablesContext } from "../context/VariablesContext";
import BackAtHome from "./BackAtHomeButton";
import RemovePost from "./RemovePostButton";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ConvertedAddress from "./ConvertedAddress";
import ManageFavorite from "./Favorite";
import RemoveFavorite from "./RemoveFavorite";
const serverURL = require("../config.js").serverURL;
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,

    display: "flex",
    flexDirection: "column",

    margin: 5,
    marginBottom: "10vh",
  },
  mask: {
    backgroundColor: "black",
    opacity: 0.7,
    width: 345,

    zIndex: 3,
    height: "100%",

    position: "absolute",
  },
}));

export default function CardPet(props) {
  let pet = props.pet;

  let petFavorite = pet.favorite || [];

  const {
    heart,
    
    userFavoritesArray,
    setUserFavoritesArray,
  } = useContext(VariablesContext);
  const userId = localStorage.getItem("userId");


  const [errorMessage] = useState("");
  const classes = useStyles();


  useEffect(() => {
    let profileFetch = () => {
      fetch(`${serverURL}/users/userProfile/${userId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
        
          setUserFavoritesArray(data[0]?.favorites || []);
        });
    };
    profileFetch();
  }, [heart]);

  return (
    <Card className={classes.root} key={`found ${pet._id}`}>
      <div
        style={{
          display: "flex",
          margin: 10,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex" }}>
          <img
            src={pet.userId?.pic}
            alt="card"
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
          <p
            style={{
              fontSize: 20,
              fontWeight: "bold",
              fontStyle: "italic",
              marginLeft: 5,
            }}
          >
            {pet.userId?.username}
          </p>
        </div>
        {pet.userId?._id === userId && <RemovePost petId={pet._id} />}
      </div>
      <Link style={{ textDecoration: "none" }} to={`/details/${pet.id}`}>
        <CardActionArea>
          {pet.status === "resolved" && (
            <div className={classes.mask}>
              <p
                style={{
                  color: "white",
                  marginTop: 100,
                  fontWeight: "bold",
                  fontSize: 30,
                }}
              >
                Back at Home
              </p>
            </div>
          )}
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="140"
            image={pet.img}
            title="Contemplative Reptile"
          />

          <CardContent style={{ backgroundColor: "rgb(220,220,220)" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              style={{ color: "black", fontStyle: "italic" }}
            >
              {pet.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <span style={{ fontWeight: "bold" }}>Breed:</span> {pet.breed}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <span style={{ fontWeight: "bold" }}>ID:</span> {pet.id}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <span style={{ fontWeight: "bold" }}>Species: </span>{" "}
              {pet.species}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <ConvertedAddress location={pet.location} />
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions style={{ justifyContent: "space-evenly" }}>
        <Button size="small" color="primary">
          <Link
            style={{ textDecoration: "none", color: "orange" }}
            to={`/details/${pet.id}`}
          >
            More information
          </Link>
        </Button>
        {userFavoritesArray !== undefined &&
        userFavoritesArray.filter(function (e) {
          return e._id === pet._id;
        }).length > 0 ? (
          <RemoveFavorite petId={pet._id} petFavorite={petFavorite} />
        ) : (
          <ManageFavorite petId={pet._id} />
        )}
        <p style={{ fontSize: 25 }}>{petFavorite.length}</p>
        <p>{errorMessage}</p>
        <BackAtHome
          userIdOfThePost={pet.userId}
          petId={pet._id}
          status={pet.status}
        />
      </CardActions>
    </Card>
  );
}
