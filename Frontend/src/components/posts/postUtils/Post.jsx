import React, { useEffect, useMemo, useState } from "react";
import {
  ClockCircleFilled,
  LikeFilled,
  LinkOutlined,
  LoadingOutlined,
  MessageFilled,
} from "@ant-design/icons";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import {
  BsEmojiAngryFill,
  BsEmojiSmile,
  BsEmojiSmileUpsideDown,
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import { Alert, Avatar, Button, Image, Input } from "antd";
import { MdReply } from "react-icons/md";
import { RiChatDeleteLine } from "react-icons/ri";
import { TfiTime } from "react-icons/tfi";
import { Link } from "react-router-dom";
import submitComment from "../postServices/submitComment";
import { useCommentsContext } from "../../../contexts/CommentsContextProvider";
import { useUserContext } from "../../../contexts/UserContextProvider";
import submitLike from "../postServices/submitLike";
import axios from "axios";
import Cookies from "universal-cookie";
import doctorPhoto from "../../../images/doctorPhoto.png";
import userPhoto from "../../../images/userPhoto.png";
import EmojiPicker from "emoji-picker-react";
import "./post.css";
let timeId;
const getLike = async (setIsLike, postId, commentId) => {
  const host = window.location.hostname;
  const { data } = await axios(
    `http://${host}:5000/get/like?postId=${postId}${
      commentId ? `&commentId=${commentId}` : ""
    }`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${new Cookies()?.get("accessToken")}`,
      },
    }
  );
  setIsLike(data?.data);
};
const CommentActions = ({
  isComment,
  postId,
  commentId,
  fetchCommentsData,
  setComments,
  show,
  setReply,
  order,
  numComments,
  showMore,
  lenViewedComments,
  isLoading,
  socket,
  setShowPost,
  showPost,
  numAngry,
  numDisLike,
  numLike,
  setPosts,
}) => {
  const [likeData, setLikeData] = useState();
  const activeEmoji = likeData?.like_type;
  const { messageApi, fetchUserData, userData } = useUserContext();
  useEffect(() => {
    if (userData?.user_id) getLike(setLikeData, postId, commentId);
  }, [userData]);
  const emojiData = [
    {
      type: "like",
      total: numLike,
      color: "blue",
      icon: (
        <AiFillLike
          onClick={() => {
            if (userData?.user_id)
              submitLike(
                null,
                fetchUserData,
                fetchCommentsData,
                messageApi,
                "like",
                postId,
                commentId,
                !isComment,
                lenViewedComments,
                getLike,
                setLikeData,
                socket,
                setPosts,
                setComments
              );
            else
              messageApi.open({
                key: 1,
                type: "warning",
                content: "you need to login first",
                duration: 3,
              });
          }}
          className={`!flex cursor-pointer rounded-full 
  items-center p-0.5
  ${
    activeEmoji == "like"
      ? "!fill-white bg-blue-800 !shadow-md"
      : "!fill-blue-400/80  hover:!fill-blue-700/80 hover:!shadow-lg"
  } !text-2xl`}
        />
      ),
    },
    {
      type: "dislike",
      total: numDisLike,
      color: " text-yellow-400 ",
      icon: (
        <AiFillDislike
          fill="white"
          color="red"
          onClick={() => {
            if (userData?.user_id)
              submitLike(
                null,
                fetchUserData,
                fetchCommentsData,
                messageApi,
                "dislike",
                postId,
                commentId,
                !isComment,
                lenViewedComments,
                getLike,
                setLikeData,
                socket,
                setPosts,
                setComments
              );
            else
              messageApi.open({
                key: 1,
                type: "warning",
                content: "you need to login first",
                duration: 3,
              });
          }}
          className={`!flex cursor-pointer rounded-full 
    items-center p-0.5
  ${
    activeEmoji == "dislike"
      ? "!fill-white bg-yellow-600 !shadow-md"
      : "!fill-yellow-400/80 hover:!fill-yellow-700/80 hover:!shadow-lg"
  }  !text-2xl`}
        />
      ),
    },
    {
      type: "angry",
      total: numAngry,
      color: "red",
      icon: (
        <BsEmojiAngryFill
          onClick={() => {
            if (userData?.user_id)
              submitLike(
                null,
                fetchUserData,
                fetchCommentsData,
                messageApi,
                "angry",
                postId,
                commentId,
                !isComment,
                lenViewedComments,
                getLike,
                setLikeData,
                socket,
                setPosts,
                setComments
              );
            else
              messageApi.open({
                key: 1,
                type: "warning",
                content: "you need to login first",
                duration: 3,
              });
          }}
          className={`!flex  cursor-pointer rounded-full 
  items-center p-0.5
  ${
    activeEmoji == "angry"
      ? "!fill-red-100 !bg-red-600 !shadow-md"
      : "!fill-red-400/80 hover:!shadow-lg hover:!fill-red-700/80"
  }  !text-2xl`}
        />
      ),
    },
  ];
  return (
    <>
      <div className="p-2">
        <div className="flex flex-wrap gap-1 justify-between items-center">
          {/* <LinkOutlined className="!flex items-center !text-blue-500 !text-xl" /> */}
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-lg shadow-sm">
              {emojiData?.map(({ type, icon, total, color, fill }) => (
                <div
                  key={type}
                  // onMouseEnter={() => {
                  //   setShowNum(type);
                  // }}
                  // onMouseLeave={() => setShowNum(null)}
                  // onTouchStart={() => setShowNum()}
                  // onTouchCancel={() => setShowNum(null)}
                >
                  {icon}
                  {/* {showNum == type ? (
                  ) : null} */}
                  <span
                    className={`text-${color}-400 //absolute //bg-${color}-400 rounded-md p-1 z-20`}
                  >
                    {total}
                  </span>
                </div>
              ))}
              <div className="p-1 flex flex-col  gap-1 items-center shadow bg-blue-500/60 rounded-md">
                <MessageFilled /> {numComments ? numComments : 0}
              </div>
            </div>
          </div>
          {show && showMore && (
            <div
              onClick={() => {
                fetchCommentsData({
                  postId,
                  limit: lenViewedComments + 5,
                });
                if (!isComment) setShowPost(postId);
              }}
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-600 
          bg-gray-500 flex flex-wrap justify-center items-center gap-1"
            >
              {isLoading ? (
                <LoadingOutlined />
              ) : (
                <BsFillArrowDownCircleFill
                  className="!flex hover:shadow-lg cursor-pointer 
                rounded-full hover:!bg-gray-900 items-center 
                !text-gray-100 !text-xl"
                />
              )}
              <span className="hidden sm:inline-block">
                Show {isComment ? "More Comments" : "Comments"}
              </span>
            </div>
          )}
          {!isComment ? (
            <div
              onClick={() => {
                setShowPost(postId);
                if (showPost != postId)
                  setTimeout(
                    () => setReply((val) => (val === postId ? false : postId)),
                    100
                  );
                else setReply((val) => (val === postId ? false : postId));
              }}
              className="cursor-pointer p-2 rounded-lg text-gray-700 hover:bg-gray-100 bg-white"
            >
              Comment
            </div>
          ) : (
            <MdReply
              onClick={() =>
                setReply((val) => (val === commentId ? false : commentId))
              }
              className="!flex hover:shadow-lg cursor-pointer 
            rounded-full hover:!text-blue-700 items-center 
            !text-blue-600 !text-xl"
            />
          )}
        </div>
      </div>
    </>
  );
};
const Reply = ({
  isComment,
  setReply,
  postId,
  commentId,
  fetchCommentsData,
  socket,
  lenViewedComments,
  makeComment,
  setLen,
}) => {
  const { userData, messageApi, fetchUserData } = useUserContext();
  const [emojiOpen, setEmojiOpen] = useState();
  const userid = userData?.user_id;
  const [content, setContent] = useState();
  const [showWarn, setShowWarn] = useState(false);
  return (
    <div
      className={`
      ${makeComment == commentId || makeComment == postId ? "z-20" : ""}
        ${
          isComment ? "pl-5 sm:pl-10 bg-gray-700" : "pl-5 sm:pl-10 bg-white"
        } mr-1 sticky rounded-lg post--reply`}
    >
      <div
        className={`p-2 flex justify-between ${
          isComment ? "text-white" : "text-gray-700"
        } rounded`}
      >
        <div className="flex justify-left items-center gap-1">
          <Avatar
            src={
              userData?.img_url ||
              (userData?.user_type == "doctor" ? doctorPhoto : userPhoto)
            }
          />
          {userData?.nick_name || "user"}
        </div>
        <div className="flex justify-center items-center">
          <RiChatDeleteLine
            onClick={() => setReply(() => false)}
            className={`!flex hover:shadow-lg cursor-pointer 
          rounded-full hover:!text-red-700 items-center 
          ${isComment ? "!text-gray-100" : "!text-gray-700"} !text-3xl`}
          />
        </div>
      </div>
      <div className="p-3 relative">
        <Input.TextArea
          className="!rounded-xl !h-20 sm:!w-1/2"
          value={content}
          onChange={(e) => setContent(e?.target?.value)}
        />
        <div className="p-3 flex justify-between gap-2">
          <Button
            className="!rounded-lg !justify-center !font-medium !flex !items-center !border !border-blue-600 !text-white !m-0
          !py-4 !bg-blue-500/60 hover:!bg-blue-400
        "
            onClick={() => {
              if (userid && content)
                submitComment(
                  userData,
                  fetchUserData,
                  fetchCommentsData,
                  messageApi,
                  content,
                  postId,
                  commentId,
                  setReply,
                  socket,
                  lenViewedComments,
                  setLen
                );
              else setShowWarn(true);
            }}
          >
            send
          </Button>
          <div>
            {emojiOpen ? (
              <BsEmojiSmileUpsideDown
                onClick={() => setEmojiOpen((val) => !val)}
                className={`!flex cursor-pointer !items-center !text-3xl ${
                  emojiOpen ? "!text-blue-700" : "!text-blue-400"
                }`}
              />
            ) : (
              <BsEmojiSmile
                onClick={() => setEmojiOpen((val) => !val)}
                className={`!flex cursor-pointer !items-center !text-3xl ${
                  emojiOpen ? "!text-blue-700" : "!text-blue-400"
                }`}
              />
            )}
          </div>
        </div>
        {/* {emojiOpen && (
          <EmojiPicker
            searchDisabled
            previewConfig={{
              showPreview: false,
            }}
            width={"100%"}
            height={"190px"}
            onEmojiClick={(data) => setContent((m) => (m || "") + data?.emoji)}
          />
        )} */}
        {(!userid || !content) && showWarn && (
          <Alert
            className="!bg-red-400 !mt-2"
            closeText={<span className="text-white text-base">X</span>}
            closable
            onClose={() => setShowWarn(false)}
            description={
              <span className="text-white font-medium">
                {!userid
                  ? "Please Sign up or login to use these features"
                  : "type any comment to submit"}
              </span>
            }
          />
        )}
      </div>
    </div>
  );
};
const CommentTemplate = ({
  postId,
  commentId,
  makeComment,
  isComment,
  show,
  setComments,
  setMakeComment,
  commentid,
  userid,
  order,
  numComments,
  content,
  issuedTime,
  imgUrl,
  nickname,
  numAngry,
  numDisLike,
  numLike,
  fetchCommentsData,
  showMore,
  socket,
  lenViewedComments,
  isLoading,
  setLen,
}) => (
  <div
    className={`rounded-lg
    ${
      commentId === makeComment ? "relative" : ""
    } pl-5 sm:pl-10 bg-white pt-5 pb-2 ${!show && "border-b-2"}`}
  >
    <div
      className={`p-1 flex gap-1 flex-wrap justify-between ${
        isComment ? "mr-1 text-gray-700" : "text-white"
      } rounded`}
    >
      <Link
        to={`/profile/${userid}`}
        className={`flex hover:text-gray-100 justify-left  ${
          isComment ? "!text-gray-700" : "!text-white"
        }  items-center gap-2`}
      >
        <Avatar src={imgUrl} />
        {nickname || "Message 1"}
      </Link>
      <div className="flex justify-left items-center gap-2">
        <span
          className={`text-xs ${
            isComment ? "!text-gray-700" : "!text-gray-300"
          }`}
        >
          {new Date(issuedTime).toLocaleString()}
        </span>
        <ClockCircleFilled
          className={`!flex hover:shadow-lg cursor-pointer 
                   hover:!bg-gray-900 items-center 
                  ${isComment ? "!text-gray-700" : "!text-gray-300"} !text-sm`}
        />
      </div>
    </div>
    <div className={`p-3 text-gray-600`}>{content || "Message 1"}</div>

    {makeComment === commentId && (
      <Reply
        commentId={commentId}
        postId={postId}
        isComment={isComment}
        makeComment={makeComment}
        setReply={setMakeComment}
        fetchCommentsData={fetchCommentsData}
        userid={userid}
        commentid={commentid}
        socket={socket}
        setLen={setLen}
        lenViewedComments={lenViewedComments}
      />
    )}
    <CommentActions
      show={show}
      isComment={isComment}
      setReply={setMakeComment}
      setComments={setComments}
      fetchCommentsData={fetchCommentsData}
      postId={postId}
      numAngry={numAngry}
      numDisLike={numDisLike}
      numLike={numLike}
      commentId={commentId}
      order={order}
      showMore={showMore}
      numComments={numComments}
      lenViewedComments={lenViewedComments}
      isLoading={isLoading}
      socket={socket}
    />
  </div>
);
const PostTemplate = ({
  userid,
  setPosts,
  postId,
  imgUrl,
  nickname,
  numAngry,
  numDisLike,
  numLike,
  numComments,
  showMore,
  content,
  setComments,
  comments,
  issuedTime,
  fetchCommentsData,
  makeComment,
  setMakeComment,
  order,
  show,
  isComment,
  postImg,
  socket,
  lenViewedComments,
  isLoading,
  setShowPost,
  showPost,
  setLen,
}) => {
  const [showPopUp, setShowPopUp] = useState(false);
  useEffect(() => {
    if (showPost == postId) {
      setTimeout(() => setShowPopUp(postId), 400);
    } else setShowPopUp(false);
  }, [showPost]);
  return (
    <div
      className={`rounded-lg ${
        postId === makeComment ? "relative" : ""
      } bg-gray-700 ${
        comments?.length >= 1 && "border-b-2 border-gray-100"
      } top-0 left-0`}
    >
      <div
        className={`p-1 flex gap-1 flex-wrap justify-between text-white rounded`}
      >
        <Link
          to={`/profile/${userid}`}
          className={`flex hover:text-gray-100 justify-left !text-white
        items-center gap-2`}
        >
          <Avatar src={imgUrl} />
          {nickname || "Message 1"}
        </Link>
        <div className="flex justify-left items-center gap-2">
          {/* <TfiTime
          className={`!flex hover:shadow-lg cursor-pointer 
                  rounded-full hover:!bg-gray-900 items-center 
                  ${isComment ? "!text-gray-700" : "!text-gray-100"} !text-sm`}
        /> */}
          <span className="text-xs text-gray-300">
            {new Date(issuedTime).toLocaleString()}
          </span>
          <ClockCircleFilled
            className={`!flex hover:shadow-lg cursor-pointer 
                   hover:!bg-gray-900 items-center 
                  ${isComment ? "!text-gray-700" : "!text-gray-300"} !text-sm`}
          />
        </div>
        {!!comments?.length && (
          <div
            onClick={() => setComments(() => [])}
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-600 
                  bg-gray-500 flex text-white justify-center items-center gap-1"
          >
            <BsFillArrowUpCircleFill
              className="!flex hover:shadow-lg cursor-pointer 
            rounded-full hover:!bg-gray-900 items-center 
            !text-gray-100 !text-xl"
            />
            <span className="hidden sm:inline-block">Hide Comments</span>
          </div>
        )}
      </div>
      <div
        className={`px-3 py-3 text-center text-base sm:text-lg text-gray-300`}
      >
        {!content ? (
          "Message"
        ) : showPopUp == postId ? (
          content
        ) : (
          <>
            {content?.slice(0, 300)}&nbsp;
            {content?.length > 300 ? (
              <>
                ...{" "}
                <div
                  onClick={() => {
                    setShowPost(postId);
                  }}
                  className="inline-block p-2 mt-2 bg-gray-800 hover:bg-gray-700 shadow cursor-pointer
              text-white rounded"
                >
                  Show More
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
      {postImg && (
        <div className="text-center w-full">
          <Image
            className=""
            style={{
              height: "150px",
              borderRadius: "10%",
              userSelect: "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            src={postImg}
          />
        </div>
      )}
      {makeComment === postId && (
        <Reply
          postId={postId}
          isComment={isComment}
          setReply={setMakeComment}
          makeComment={makeComment}
          fetchCommentsData={fetchCommentsData}
          userid={userid}
          socket={socket}
          setLen={setLen}
          lenViewedComments={lenViewedComments}
        />
      )}
      <CommentActions
        setPosts={setPosts}
        show={show}
        showPost={showPost}
        setShowPost={setShowPost}
        isComment={isComment}
        setReply={setMakeComment}
        setComments={setComments}
        numAngry={numAngry}
        numDisLike={numDisLike}
        numLike={numLike}
        fetchCommentsData={fetchCommentsData}
        postId={postId}
        order={order}
        showMore={showMore}
        numComments={numComments}
        lenViewedComments={lenViewedComments}
        isLoading={isLoading}
        socket={socket}
      />
    </div>
  );
};
const Post = ({
  postId,
  imgUrl,
  userType,
  nickname,
  numAngry,
  numLike,
  numDisLike,
  content,
  issuedTime,
  numComments,
  userid,
  order,
  postImg,
  socket,
  setShowPost,
  showPost,
  setPosts,
  setLen,
  setMakeComment,
  makeComment,
  showPopUp,
}) => {
  const { isLoading, fetchCommentsData, commentsData, setCommentsData } =
    useCommentsContext();
  useEffect(() => {
    if (!showPost || showPost !== postId)
      setTimeout(() => {
        setCommentsData([]);
        setMakeComment(null);
      }, 400);
  }, [showPost]);
  useEffect(() => {
    if (postId) {
      const recieve_comment = (data) => {
        const isUpdate = data?.updateEmoji;
        if (isUpdate) {
          const { comment_id, like_emoji, dislike, angry } = data;
          setCommentsData((comments) =>
            comments?.map((c) =>
              c?.comment_id == comment_id
                ? {
                    ...c,
                    like_emoji: like_emoji || 0,
                    dislike: dislike || 0,
                    angry: angry || 0,
                  }
                : c
            )
          );
        } else {
          if (
            !commentsData?.some(
              ({ comment_id }) => comment_id == data?.comment_id
            )
          ) {
            const reply_on = data?.reply_on;
            setCommentsData((c) =>
              c?.length
                ? [
                    data,
                    ...c.map((c1) =>
                      c1.comment_id == reply_on
                        ? { ...c1, num_replies: c1.num_replies + 1 }
                        : c1
                    ),
                  ]
                : [data]
            );
            setLen((val) => val + 1);
          }
        }
      };
      socket.on(`recieve_comment_${postId}`, recieve_comment);
      return () => socket.off(`recieve_comment_${postId}`, recieve_comment);
    }
  }, [commentsData]);
  return (
    <div className="p-2 grow w-full rounded-lg bg-gray-700">
      <div className="flex relative flex-col">
        {/*============================ Comment ===================================*/}
        <PostTemplate
          setPosts={setPosts}
          setShowPost={setShowPost}
          showPost={showPost}
          postImg={postImg}
          userid={userid}
          postId={postId}
          imgUrl={imgUrl || (userType == "doctor" ? doctorPhoto : userPhoto)}
          nickname={nickname}
          numAngry={numAngry}
          setLen={setLen}
          numDisLike={numDisLike}
          numLike={numLike}
          numComments={numComments}
          showMore={numComments ? true : false}
          content={content}
          setComments={setCommentsData}
          issuedTime={issuedTime}
          socket={socket}
          order={"c"}
          fetchCommentsData={fetchCommentsData}
          makeComment={makeComment}
          setMakeComment={setMakeComment}
          show={showPopUp == postId ? !commentsData?.length : true}
          comments={showPopUp == postId ? commentsData : []}
          lenViewedComments={
            showPopUp == postId ? commentsData?.length || 0 : 0
          }
          isLoading={isLoading}
        />
        {/*============================ Comments ===================================*/}
        <div
          style={{
            maxHeight: "500px",
            // zIndex: `${order + 5}`,
          }}
          className={`flex flex-col rounded-lg p-1
          sm:bg-gray-700  transition-all duration-500 ${
            commentsData?.length ? "" : "!max-h-0 p-2"
          } overflow-auto gap-2 top-full w-full scroll--v scroll--v--comment`}
        >
          {(showPopUp == postId ? commentsData : [])?.map(
            (
              {
                comment_id: commentId,
                user_id: userid,
                user_type: userType,
                img_url: imgUrl,
                nick_name: nickname,
                content,
                issued_time: issuedTime,
                is_reply: isReply,
                num_replies: numReplies,
                angry: numAngry,
                dislike: numDisLike,
                like_emoji: numLike,
              },
              i
            ) => (
              <CommentTemplate
                key={commentId}
                socket={socket}
                setLen={setLen}
                userid={userid}
                postId={postId}
                imgUrl={
                  imgUrl || (userType == "doctor" ? doctorPhoto : userPhoto)
                }
                nickname={nickname}
                numAngry={numAngry}
                numLike={numLike}
                numDisLike={numDisLike}
                showMore={numComments > commentsData?.length ? true : false}
                content={content}
                issuedTime={issuedTime}
                order={i + 1}
                numComments={numReplies}
                fetchCommentsData={fetchCommentsData}
                commentId={commentId}
                isComment
                setComments={setCommentsData}
                setMakeComment={setMakeComment}
                makeComment={makeComment}
                show={i == commentsData.length - 1 ? true : false}
                lenViewedComments={commentsData?.length}
                isLoading={isLoading}
              />
            )
          )}
        </div>

        {/*===================================================================== */}
      </div>
    </div>
  );
};

export default Post;
