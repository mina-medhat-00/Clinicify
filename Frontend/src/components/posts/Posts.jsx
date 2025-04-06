import { Alert, Button, Empty, Image, Input, message, Upload } from "antd";
import React, { useEffect, useState } from "react";
import Grid from "../grid/Grid";
import submitPost from "./postServices/submitPost";
import { usePostsContext } from "../../contexts/PostsContextProvider";
import Post from "./postUtils/Post";
import { useUserContext } from "../../contexts/UserContextProvider";
import { CommentsContextProvider } from "../../contexts";
import { PlusOutlined } from "@ant-design/icons";
import { BiImageAdd } from "react-icons/bi";
import { TitleHeader } from "../home/HomePage";
import { BsQuestion } from "react-icons/bs";
import { RiQuestionAnswerFill } from "react-icons/ri";
import ServerError from "../utils/ServerError";
import { useMediaQuery } from "react-responsive";
import Loader from "../Loader";
import PopUp from "../utils/PopUp";
import TransitionContent from "../utils/transition/TransitionContent";
import PostWrapper from "./postUtils/PostWrapper";
import { useUtilsContext } from "../../contexts/UtilsContextProvider";
import TableGrid from "../utils/TableGrid";
import { useTranslation } from "react-i18next";
const getBase64 = (img, setPostImg) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => setPostImg(reader?.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isImg =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png" ||
    file.type === "image/gif" ||
    file.type === "image/webp";
  if (!isImg) {
    message.error("You can only upload images!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isImg && isLt2M;
};
const Posts = ({ home }) => {
  const { t } = useTranslation();
  const { socket, isMobile } = useUtilsContext();
  const {
    fetchUserData,
    userData,
    isLoading: isUserLoading,
    messageApi,
    userData: userAuth,
  } = useUserContext();
  const { postsData, isLoading, isError, fetchPostsData } = usePostsContext();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState(null);
  const [postImg, setPostImg] = useState(null);
  const [showWarn, setShowWarn] = useState(false);
  const [showPost, setShowPost] = useState(false);
  useEffect(() => {
    setPosts(postsData || []);
  }, [postsData]);
  useEffect(() => {
    const addPost = (data) => {
      const isUpdate = data?.updateEmoji;
      if (isUpdate) {
        const { post_id, like_emoji, dislike, angry } = data;
        setPosts((posts) =>
          posts?.map((post) =>
            post?.post_id == post_id
              ? {
                  ...post,
                  like_emoji: like_emoji || 0,
                  dislike: dislike || 0,
                  angry: angry || 0,
                }
              : post
          )
        );
      } else
        setPosts((p) =>
          p?.some(({ post_id }) => post_id == data?.post_id) ? p : [data, ...p]
        );
    };
    socket?.on(`recieve_post`, addPost);
    return () => {
      socket?.off("recieve_post", addPost);
    };
  }, []);
  console.log(posts);
  const allPosts = posts?.map(
    (
      {
        user_id: userid,
        user_type: userType,
        post_img: postImg,
        img_url: imgUrl,
        nick_name: nickname,
        content,
        issued_time: issuedTime,
        num_comments: numComments,
        angry: numAngry,
        dislike: numDisLike,
        like_emoji: numLike,
        post_id: postId,
      },
      i
    ) => ({
      is_img: !!postImg,
      key: postId,
      element: (
        <div className={`grow text-white`} key={postId}>
          <CommentsContextProvider key={postId}>
            <PostWrapper
              order={postsData?.length - i}
              setPosts={setPosts}
              showPost={showPost}
              setShowPost={setShowPost}
              socket={socket}
              userid={userid}
              nickname={nickname}
              postImg={postImg}
              numAngry={numAngry}
              numLike={numLike}
              numDisLike={numDisLike}
              numComments={numComments}
              userType={userType}
              content={content}
              issuedTime={issuedTime}
              postId={postId}
              imgUrl={imgUrl}
            />
          </CommentsContextProvider>
        </div>
      ),
    })
  );
  const userid = userAuth?.user_id;
  return (
    <div className="mt-1 rounded-tr-lg rounded-tl-lg text-white font-medium">
      {/* <div className="mt-2 bg-blue-900/80 border-y py-2 border-white mb-2 text-xl text-white text-center">
        Chating Our Doctors
      </div> */}
      <div className="p-4">
        {/* <div className="mt-2 inline-block p-2 bg-gray-500/80 rounded-md shadow-lg">
          <span className="p-2 bg-gray-300/50 rounded-md text-center inline-block">
            Posts
          </span>
        </div> */}
        <div className="flex p-1 justify-center">
          <div className="border border-gray-150 shadow-md w-full p-4 bg-gray-300/30 rounded-lg sm:w-3/4 xl:w-1/2">
            <Input.TextArea
              placeholder={t(
                "Ask for any question, state your condition or medical issue"
              )}
              className="!rounded-lg !border scroll--v !border-gray-400"
              value={content}
              rows={6}
              style={{ resize: "none" }}
              onChange={(e) => setContent(e?.target?.value)}
            />
            <div className="flex relative flex-wrap justify-between gap-2 items-center p-2">
              <Upload
                name="avatar"
                customRequest={() => true}
                beforeUpload={beforeUpload}
                showUploadList={false}
                onChange={(inf) => {
                  if (inf?.file?.status)
                    getBase64(inf?.file?.originFileObj, setPostImg);
                }}
              >
                {postImg ? (
                  <div className="relative">
                    <Image
                      className=""
                      style={{
                        height: "100px",
                        width: "100%",
                        borderRadius: "10%",
                        userSelect: "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      src={postImg}
                    />
                    <div
                      onClick={(e) => {
                        setPostImg(null);
                        e.stopPropagation();
                      }}
                      style={{ top: 0, left: "calc(100% - 20px)" }}
                      className="text-2xl text-red-400/50 hover:text-red-400 absolute"
                    >
                      X
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <BiImageAdd className="!text-gray-700 text-3xl" />
                  </div>
                )}
              </Upload>
              <Button
                onClick={() => {
                  if (userid && content)
                    submitPost(
                      userData,
                      fetchUserData,
                      fetchPostsData,
                      messageApi,
                      content,
                      postImg,
                      setContent,
                      socket
                    );
                  else setShowWarn(true);
                }}
                className="!rounded-lg !justify-center !font-medium !flex w-1/2 !items-center !border !border-blue-600 !text-white !m-0
            !py-4 !bg-blue-700/80 hover:!bg-blue-700
            "
              >
                {t("Post")}
              </Button>
              {(!userid || !content) && showWarn && (
                <Alert
                  className="!bg-red-500 !rounded-md !top-full !absolute !w-full"
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
        </div>
      </div>
      {/* <div
        className="flex justify-center p-2 border-y
      border-white mb-2 bg-blue-900/80 items-center"
      >
        <span className="text-xl">Latest Questions</span>
      </div> */}
      <TitleHeader
        to={home ? "posts" : ""}
        wrapperBg={"no"}
        icon={
          <RiQuestionAnswerFill className="text-3xl sm:text-5xl xl:text-6xl !m-auto text-white" />
        }
        title={home ? "Latest Questions" : "All Questions"}
      />
      <div className="pr-2">
        {/* <div
          className={`flex flex-wrap gap-2 ${
            home
              ? "overflow-auto trans--post scroll--v scroll--v--chat scroll--h"
              : ""
          } items-start py-2 px-1`}
        > */}
        {/* <Grid defaultCol={2} smCol={2}> */}
        {posts?.length > 0 ? (
          <TransitionContent
            id="posts"
            speed="extraspeed"
            direction="bottomleft"
            customStyle={{
              maxHeight: home ? "548px" : "",
              marginInline: !isMobile ? "30px" : "",
            }}
            parentClassName={`flex flex-wrap gap-2 ${
              home
                ? "overflow-auto trans--post scroll--v scroll--v--chat scroll--h"
                : ""
            } items-start py-2 px-1`}
            // first
          >
            <TableGrid
              noMargin
              noGap
              colKey="post"
              isFull={allPosts?.filter(({ is_img }) => is_img) || []}
              customGrid={`${home ? "bg-white" : "bg-gray-100"}`}
              items={allPosts}
            />
          </TransitionContent>
        ) : isError ? (
          <ServerError errorTitle={"Posts"} />
        ) : isLoading || postsData?.length > 0 ? (
          <Loader />
        ) : (
          <Empty
            className={`${home ? "" : "!mt-20"} !w-full !mb-4 !font-medium`}
            description={
              <span
                className={`${
                  home
                    ? "text-white bg-blue-600/60 p-1 rounded"
                    : "text-gray-500"
                }`}
              >
                {t("there's no posts")}
              </span>
            }
          />
        )}
        {/* </Grid> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Posts;
