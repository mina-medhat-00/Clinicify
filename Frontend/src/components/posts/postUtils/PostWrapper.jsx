import React, { useEffect, useState } from "react";
import PopUp from "../../utils/PopUp";
import Post from "./Post";

const PostWrapper = ({
  setPosts,
  showPost,
  setShowPost,
  socket,
  order,
  userid,
  nickname,
  postImg,
  numAngry,
  numLike,
  numDisLike,
  numComments,
  userType,
  content,
  issuedTime,
  postId,
  imgUrl,
}) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [len, setLen] = useState(numComments || 0);
  const [makeComment, setMakeComment] = useState(null);
  useEffect(() => {
    if (!showPost) setTimeout(() => setShowPopUp(false), 400);
    else setShowPopUp(showPost);
  }, [showPost]);
  useEffect(() => {
    setLen(numComments);
  }, [numComments]);
  return showPopUp == postId ? (
    <PopUp
      customWidth={"w-full bottom-2 md:w-3/4"}
      mt={"10px"}
      show={showPost}
      handleClose={() => setShowPost(null)}
    >
      {
        <Post
          showPopUp={showPopUp}
          setMakeComment={setMakeComment}
          setLen={setLen}
          makeComment={makeComment}
          setPosts={setPosts}
          showPost={showPost}
          setShowPost={setShowPost}
          socket={socket}
          order={order}
          userid={userid}
          nickname={nickname}
          postImg={postImg}
          numAngry={numAngry}
          numLike={numLike}
          numDisLike={numDisLike}
          numComments={len}
          userType={userType}
          content={content}
          issuedTime={issuedTime}
          postId={postId}
          imgUrl={imgUrl}
        />
      }
    </PopUp>
  ) : (
    <Post
      showPopUp={showPopUp}
      setMakeComment={setMakeComment}
      setLen={setLen}
      makeComment={makeComment}
      setPosts={setPosts}
      showPost={showPost}
      setShowPost={setShowPost}
      socket={socket}
      order={order}
      userid={userid}
      nickname={nickname}
      postImg={postImg}
      numAngry={numAngry}
      numLike={numLike}
      numDisLike={numDisLike}
      numComments={len}
      userType={userType}
      content={content}
      issuedTime={issuedTime}
      postId={postId}
      imgUrl={imgUrl}
    />
  );
};

export default PostWrapper;
