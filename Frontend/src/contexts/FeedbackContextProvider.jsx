import axios from "axios";
import { createContext, useState, useContext, useLayoutEffect } from "react";
const handleQuery = (obj) =>
  !obj
    ? ""
    : Object.entries(obj)
        .filter(([_, val]) => val || val === 0)
        .map(([name, val], i) =>
          i == 0 ? `?${name}=${val}` : `${name}=${val}`
        )
        .join("&");
const FeedbackData = createContext(null);
const FeedbackContextProvider = ({
  children,
  noDirectFetch,
  noLoading,
  contextQuery,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const host = window?.location?.hostname;
  const fetchFeedbackData = async (query, notWaiting) => {
    if (!noLoading) setIsLoading(true);
    try {
      const { data } = await axios.request(
        `http://${host}:5000/get/feedback${handleQuery(query || contextQuery)}`,
        { timeout: 8000 }
      );
      setFeedbackData(data?.data);
      setIsLoading(false);
      setIsError(false);
      return data;
    } catch (err) {
      console.log(err);
      //setFeedbackData(null);
      setIsError(true);
      setIsLoading(false);
    }
  };
  useLayoutEffect(() => {
    if (!noDirectFetch) fetchFeedbackData();
  }, []);
  return (
    <FeedbackData.Provider
      value={{ isLoading, feedbackData, fetchFeedbackData, isError }}
    >
      {children}
    </FeedbackData.Provider>
  );
};

export default FeedbackContextProvider;

export const useFeedbackContext = () => useContext(FeedbackData);
