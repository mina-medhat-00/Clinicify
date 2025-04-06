import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();
const submitComment = async (
  user,
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
) => {
  const data = { content, postId, commentId };
  messageApi.open({
    key: 1,
    content: "adding your comment ...",
    type: "loading",
    duration: 8,
  });
  const host = window?.location?.hostname;
  axios
    .post(
      `http://${host}:5000/submit/comment`,
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
      messageApi.open({
        key: 1,
        content: "thank you for your comment ❤",
        type: "success",
        duration: 2,
      });
      fetchCommentsData(
        {
          postId,
          limit: lenViewedComments + 1,
        },
        true
      );
      setLen((val) => val + 1);
      socket.emit("send_comment", {
        //...res?.data?.data,
        reply_on: commentId,
        comment_id: res?.data?.data?.comment_id,
        post_id: postId,
        user_id: user?.user_id,
        content,
        num_replies: 0,
        like_emoji: 0,
        dislike: 0,
        angry: 0,
        img_url: user?.img_url,
        nick_name: user?.nick_name,
        issued_time: new Date(new Date().getTime() + 2 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      });
      setReply(() => false);
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

export default submitComment;
