import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { VariablesContext } from "../context/VariablesContext";

const useStyles = makeStyles({

  buttonRemove: {
    padding: "1px 3px 1px 3px",
    height:"fit-content",
        marginBottom: "5px",
        marginRight: 20,
        fontSize: 15,
        fontWeight: "bold",
        borderRadius: 100,
        backgroundColor: "red",
        color:"white"
  }
});

const RemoveComment = (props) => {
      const classes = useStyles();
    const [data, setData] = useState([])
     let  { countComment,setCountComment } = useContext(VariablesContext);
     let userId = localStorage.getItem("userId")
    let userCommentId = props.userID
    let commentId = props.commentId
    let petId = props.petID

  

    
    let removeCountComment = () => {
        setCountComment(countComment -=1)
    }


        const deleteComment = ()=>{
        fetch(`http://localhost:5000/pets/deleteComment/${petId}/${commentId}`,{
            method:"delete",
           
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
             const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData) 
        }).catch(err=>console.log(err))
    }
  
    
    let fetchAndRemove = () => {
        deleteComment();
        removeCountComment()

    }
    return (<div>
        {userId === userCommentId && <button  className={classes.buttonRemove} onClick={fetchAndRemove}>C</button>
            }
        
    </div>)
}

export default RemoveComment
