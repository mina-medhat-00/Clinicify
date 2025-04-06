import React from "react";
import { Typography, Space } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const { Title } = Typography;
const Footer = ({ isMobile }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`footer border ${
        isMobile ? "!bg-blue-800/80" : "!bg-blue-600/80"
      }`}
      style={{ backgroundColor: "rgb(8, 14, 20)" }}
    >
      <Title level={4} className="!text-white">
        {t("Online Clinic")} &reg;
      </Title>
      <Space wrap={true} className="!justify-center">
        <Link to="/" className="font-medium text-white underline">
          {t("Home")}
        </Link>
        <Link to="/ratings" className="font-medium text-white underline">
          {t("Ratings")}
        </Link>
        <Link to="/feedbacks" className="font-medium text-white underline">
          {t("Feedbacks")}
        </Link>
        <Link to="/doctors" className="font-medium text-white underline">
          {t("Doctors")}
        </Link>
      </Space>
    </div>
  );
};

export default Footer;
