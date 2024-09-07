import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from 'react-social-login-buttons'
import './App.css';

function App() {
  return (
    <div className="App">
      <LoginSocialFacebook
        appId="877293800547196"
        onResolve={(response) => {
          console.log(response);
        }}
        onReject={(error) => {
          console.log("Login Error: ", error);
        }}
      >
        <FacebookLoginButton />
      </LoginSocialFacebook>
    </div>
  );
}

export default App;
