import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();
const submitMedical = async (
  values,
  messageApi,
  fetchProfileData,
  fetchUserData,
  userName,
  isEdit
) => {
  const data = {
    values,
    isEdit,
  };
  messageApi.open({
    key: 1,
    content: "submitting your informations ...",
    type: "loading",
    duration: 8,
  });
  const host = window?.location?.hostname;
  axios
    .post(
      `http://${host}:5000/submit/medical`,
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
        content: "your information updated",
        type: "success",
        duration: 2,
      });
      setTimeout(
        () => fetchProfileData({ path: "profile", username: userName }, true),
        2000
      );
    })
    .catch((err) => {
      console.log(err);
      if (err?.response?.status == 401) {
        fetchUserData(true, cookies.get("accessToken"));
      } else
        messageApi.open({
          key: 1,
          content: "there's some issues cannot submit your feedback now",
          type: "error",
          duration: 2,
        });
    });
};

export default submitMedical;
