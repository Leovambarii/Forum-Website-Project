import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/Id/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new title: ");
      axios.put("http://localhost:3001/posts/title", {newTitle: newTitle, id: id},
        {headers: {accessToken: localStorage.getItem("accessToken")}});
      setPostObject({...postObject, title: newTitle});
    } else {
      let newPostText = prompt("Enter new text: ");
      axios.put("http://localhost:3001/posts/postText", {newText: newPostText, id: id},
        {headers: {accessToken: localStorage.getItem("accessToken")}});
      setPostObject({...postObject, postText: newPostText});
    }
  };

  return (
    <div className="postPage">
      <div className="specificPost">
        <div className="post">
          <div className="title" onClick={() => {
            if (authState.username === postObject.username) {
              editPost("title");
            }}}> {postObject.title} </div>
          <div className="body" onClick={() => {
            if (authState.username === postObject.username) {
              editPost("body");
            }}}>{postObject.postText}</div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              <button onClick={() => {deletePost(postObject.id)}}>Delete post</button>
            )}
          </div>
        </div>
      </div>
      <div className="comments">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <div>
                  {comment.commentBody}
                </div>
                <div>
                  <label> From: {comment.username}</label>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
