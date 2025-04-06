import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();
const submitLike = async (
  user,
  fetchUserData,
  fetchCommentsData,
  messageApi,
  likeType,
  postId,
  commentId,
  isPost,
  lenViewedComments,
  getLike,
  setLikeData,
  socket,
  setPosts,
  setComments
) => {
  const data = { postId, commentId: commentId || null, likeType, isPost };
  const host = window?.location?.hostname;
  axios
    .post(
      `http://${host}:5000/submit/like`,
      {
        data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies?.get("accessToken")}`,
        },
      }
    )
    .then((res) => {
      // getLike(setLikeData, postId, commentId);
      setLikeData(res?.data?.data);
      const { like_emoji, dislike, angry } = res?.data?.data;
      if (!isPost) {
        // fetchCommentsData(
        //   {
        //     postId,
        //     limit: lenViewedComments,
        //   },
        //   true
        // );
        socket?.emit("send_comment", {
          post_id: postId,
          comment_id: commentId,
          like_emoji,
          dislike,
          angry,
          updateEmoji: true,
        });
        setComments((comments) =>
          comments?.map((c) =>
            c?.comment_id == commentId
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
        socket?.emit("send_post", {
          post_id: postId,
          like_emoji,
          dislike,
          angry,
          updateEmoji: true,
        });
        setPosts((posts) =>
          posts?.map((post) =>
            post?.post_id == postId
              ? {
                  ...post,
                  like_emoji: like_emoji || 0,
                  dislike: dislike || 0,
                  angry: angry || 0,
                }
              : post
          )
        );
      }
    })
    .catch((err) => {
      console.log(err);
      if (err?.response?.status == 401) {
        fetchUserData(true, cookies.get("accessToken"));
      } else
        messageApi.open({
          key: 1,
          content: "there's some issues cannot submit your comment now",
          type: "error",
          duration: 2,
        });
    });
};

export default submitLike;
