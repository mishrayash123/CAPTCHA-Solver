import CaptchaBox from "../components/HomeContent/captchaBox/CaptchaBox";
import CustomButton from "../components/HomeContent/customButton/Button";

function Home() {
  

    return (
        <div className="App flex justify-center items-center bg-gray-50 min-h-screen py-8 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
          <div className="flex flex-col items-center">
            <CaptchaBox />
          </div>
  
          <div className="mt-4 flex justify-center">
            <CustomButton text="Refer & Earn" className="  text-sm shadow-md" />
          </div>
  
          <div className="text-gray-600 text-sm mt-6 flex justify-center">
            <ul className="list-none list-inside space-y-1 text-gray-400">
              <li>*All words are case sensitive.</li>
              <li>*Calculative Captchas must be solved.</li>
              <li>*Length of Captcha will be between 6 to 12 characters.</li>
              <li>*There result also be negative number eg.(5-8=-3)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  export default Home;
  