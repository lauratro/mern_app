import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  registerButtonDiv: {
    margin: 15,
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: "80%",
  },
  registrButton: {
    backgroundColor: "green",
    color: "white",
    padding: 5,
    borderRadius: 20,
    justifyContent: "flex-end",
    fontWeight: "bold",
  },
  logInRequest: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
});

export default function RegisterPet() {
  const classes = useStyles();
  const loggedIn = localStorage.getItem("loggedIn");
  //const { pets, setPets } = useContext(VariablesContext);
  // const [pets,setPets] = useState([])

  return (
    <div className={classes.registerButtonDiv}>
      {loggedIn ? (
        <Link to="/Form">
          <button className={classes.registrButton}>Register a Pet</button>
        </Link>
      ) : (
        <p className={classes.logInRequest}>Please Log in to register a pet</p>
      )}
    </div>
  );
}
