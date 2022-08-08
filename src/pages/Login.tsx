import { useMediaQuery } from "react-responsive";

import LoginForm from "../containers/LoginForm";
import LoginContainer from "../components/LoginContainer";
import LoginHeaderSection from "../components/LoginHeaderSection";
import LoginFormContainer from "../components/LoginFormContainer";

const Login: React.FC = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 880px)" });
  return (
    <LoginContainer>
      {!isSmallScreen && <LoginHeaderSection />}

      <LoginFormContainer>
        <LoginForm />
      </LoginFormContainer>
    </LoginContainer>
  );
};

export default Login;
