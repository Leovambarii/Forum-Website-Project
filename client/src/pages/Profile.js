import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
    let { id } = useParams();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) =>{
            setUsername(response.data.username);
        });
        axios.get(`http://localhost:3001/posts/userId/${id}`).then((response) => {
            setListOfPosts(response.data);
        });
    }, []);

    return (
        <div className="profilePageContainer">
            <div className="user">
                <h1>{username}'s posts</h1>
            </div>
            <div className="listOfPosts">
            {listOfPosts.map((value, key) => {
                return (
                    <div key={key} className="post">
                        <div className="title"> {value.title} </div>
                        <div className="body" onClick={() => {navigate(`/post/${value.id}`);}}>{value.postText}</div>
                        <div className="footer">
                            <div className="username">{value.username}</div>
                            <div className="buttons"><label>{value.Likes.length}</label></div>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
    ) 
};

export default Profile;