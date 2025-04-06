import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();
const submitPost = async (
  user,
  fetchUserData,
  fetchPostsData,
  messageApi,
  content,
  postImg,
  setContent,
  socket
) => {
  const data = { content, postImg };
  messageApi.open({
    key: 1,
    content: "posting your question ...",
    type: "loading",
    duration: 8,
  });
  const host = window?.location?.hostname;
  axios
    .post(
      `http://${host}:5000/submit/post`,
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
        content: "thank you for your question ❤",
        type: "success",
        duration: 2,
      });
      setContent("");
      socket?.emit("send_post", {
        user_id: user?.user_id,
        post_img: postImg,
        img_url: user?.img_url,
        nick_name: user?.nick_name,
        content,
        issued_time: new Date(new Date().getTime() + 2 * 60 * 1000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        num_comments: 0,
        angry: 0,
        dislike: 0,
        like_emoji: 0,
        post_id: res?.data?.data?.post_id,
      });
      fetchPostsData(null, true);
    })
    .catch((err) => {
      console.log(err);
      if (err?.response?.status == 401) {
        fetchUserData(true, cookies.get("accessToken"));
      } else
        messageApi.open({
          key: 1,
          content: "there's some issues cannot submit your question now",
          type: "error",
          duration: 2,
        });
    });
};

export default submitPost;
