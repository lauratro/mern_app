import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { VariablesContext } from "../context/VariablesContext";
import { AuthContext } from "../context/AuthContext";
const useStyles = makeStyles({
  commentBtn: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 4,
    marginLeft: 7,
    fontStyle: "italic",
  },
});
const serverURL = require("../config.js").serverURL;
const Comment = (props) => {
  const classes = useStyles();
  let { countComment, setCountComment, onePet, setOnePet } =
    useContext(VariablesContext);
    const {  userId, setUserId } =
    useContext(AuthContext);
  const [text, setText] = useState("");

  const loggedIn = localStorage.getItem("loggedIn");

  const avatar = localStorage.getItem("userAvatar");
  //  console.log("avatarCommForm", avatar)
  const username = localStorage.getItem("usernameStorage");
 // const userId = localStorage.getItem("userId");
  // console.log("nameCommForm", username)
  let petId = props.petId;
  let addToCount = () => {
    setCountComment((countComment += 1));
  };

  let commentFetch = () => {
    fetch(serverURL + "/pets/comments", {
      method: "put",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        petId,
        text,
        avatar,
        username,
        userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("commentdata", data);
        setCountComment((countComment += 1));
        setOnePet(data);
      });
  };
  let fetchAndCount = () => {
    commentFetch();
    //  addToCount();
  };

  return (
    <div style={{ marginBottom: "12vh" }}>
      {loggedIn ? (
        <div>
          <input
            style={{
              marginTop: 10,
              marginBottom: 15,
              width: "60%",
              padding: 7,
            }}
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className={classes.commentBtn} onClick={commentFetch}>
            Send
          </button>
        </div>
      ) : (
        <p>Please Log in to write a comment</p>
      )}
    </div>
  );
};
export default Comment;

/* const commentFetch = (text,postId)=>{
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
              console.log(result)
              const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
             })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    } */
