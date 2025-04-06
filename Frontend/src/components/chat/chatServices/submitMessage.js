import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();
const submitMessage = async (
  fetchUserData,
  fetchMessagesData,
  messageApi,
  content,
  message_to,
  isFirst,
  socket,
  setContent,
  user_id,
  setIsLoading,
  fetchChatData
) => {
  const data = { content, message_to, isFirst };
  const host = window?.location?.hostname;
  setIsLoading(true);
  axios
    .post(
      `http://${host}:5000/submit/message`,
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
      setContent("");
      if (isFirst) {
        socket.emit("add_chat", message_to);
      }
      socket.emit("send_message", {
        message_id: res?.data?.data?.message_id,
        content,
        chatId: `${message_to > user_id ? message_to : user_id},${
          user_id > message_to ? message_to : user_id
        }`,
        message_to,
        message_from: user_id,
        issued_date: res?.data?.data?.issued_date,
        issued_time: res?.data?.data?.issued_time,
      });
      fetchMessagesData(
        cookies?.get("accessToken"),
        {
          message_to,
        },
        true
      );
      setIsLoading(false);
      //   socket.emit("send_message", {
      //     ...res?.data?.data,
      //     issued_time: new Date().toLocaleString(),
      //   });
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
      if (err?.response?.status == 401) {
        fetchUserData(true, cookies.get("accessToken"));
      } else if (err?.response?.status == 403) {
        fetchChatData(
          true,
          cookies.get("accessToken"),
          {
            chat_to: message_to,
          },
          true
        );
        messageApi.open({
          key: 1,
          content: "we're sorry but your chat is closed now",
          type: "warning",
          duration: 2,
        });
      } else
        messageApi.open({
          key: 1,
          content: "there's some issues cannot submit your comment now",
          type: "error",
          duration: 2,
        });
    });
};

export default submitMessage;
