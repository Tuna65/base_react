import { useTranslation } from "react-i18next";

const useAuthService = () => {
  const { t } = useTranslation();

  const rulesForm = {
    username: [
      {
        required: true,
        message: t("Tên đăng nhập không được để trống"),
      },
      {
        pattern: /^[a-z0-9._]+$/,
        message: 'Username chỉ chứa chữ thường và ký tự đặc biệt là "." hoặc "_"',
      },
    ],
    email: [
      {
        required: true,
        message: t("Email không được để trống"),
      },
    ],
    password: [
      {
        required: true,
        message: t("Mật khẩu không được để trống"),
      },
    ],
  };




  return { rulesForm };
};

export default useAuthService;
