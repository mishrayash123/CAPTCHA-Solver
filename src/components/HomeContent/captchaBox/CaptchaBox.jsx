import React, { useState ,useEffect} from "react";
import CustomButton from "../customButton/Button";
import { FaDollarSign, FaPaypal } from "react-icons/fa";
import axios from "axios";

const CaptchaBox = () => {
  const [timeLeft, setTimeLeft] = useState(20); 
  const [captcha, setCaptcha] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [cashAmount, setCashAmount] = useState(0);
  const [email, setemail] = useState(localStorage.getItem("email"));
  const [captchaVisible, setCaptchaVisible] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer); 
    } else {
      fetchCaptcha()
    }
  }, [timeLeft]);

  const fetchCaptcha = async () => {
    console.log("Name sent for captcha:", email);
    if (!email) {
      setMessage("Please enter your name to get the captcha.");
      return;
    }

    try {
      const response = await axios.post(
        "https://backendofcaptchasolver.onrender.com/api/captcha/getCaptcha",
        {
          email: email,
        }
      );

      if (response.data.captcha) {
        setCaptcha(response.data.captcha);
        if (response.data.Amount === 0) {
          setCashAmount(0);
        }
        setTimeLeft(20)
        setCashAmount(response.data.Amount);
        setCaptchaVisible(true);
        setMessage("");
      } else {
        console.error("Error fetching captcha:", response.data.message);
        setMessage("Failed to fetch captcha. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching captcha:", error);
      setMessage("Error fetching captcha. Please try again.");
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const verifyCaptcha = async () => {
    try {
      const response = await axios.post(
        "https://backendofcaptchasolver.onrender.com/api/captcha/verifyCaptcha",
        {
          email: email,
          inputValue,
        }
      );

      if (response.data.success) {
        setMessage("Captcha verified successfully!");
        setCashAmount(response.data.Amount);
        setCaptcha(response.data.captcha);
        setInputValue("");
        setTimeLeft(20)
      } else {
        setMessage("Invalid captcha. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error verifying captcha:",
        error.response ? error.response.data : error.message
      );
      setMessage("Error verifying captcha. Please try again.");
    }
  };
  
  const handlePayout = async () => {
    try {
      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK not loaded. Please refresh and try again.");
        return;
      }
 
      alert("Your amount deducted if there transaction will be failed so we will refund it");

      const response = await axios.post(
        "https://backendofcaptchasolver.onrender.com/api/razorpay/payout",
        { email: email }
      );

      if (response.data.success) {
        const { order } = response.data;

        const options = {
          key: "rzp_test_SBdFgpMYIOHJt1",
          amount: order.amount,
          currency: order.currency,
          name: "Captcha Game",
          description: "Claim your winnings",
          order_id: order.id,
          handler: (response) => {
            alert("Payment successful!");
            setCashAmount(0);
          },
          prefill: {
            name: "xyz",
            email:email,
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Payout error:", error);
      alert("Error processing payout. Please try again.");
    }
  };

  return (
    <>
      {captchaVisible && (
        <p className="text-lg font-mono font-bold text-gray-800 m-2">
          User: {email}
        </p>
      )}
      {!captchaVisible && (
        <div className="mt-4 flex justify-center" onClick={fetchCaptcha}>
          <CustomButton
            text="Get Captcha"
            
            className="w-full bg-indigo-700 text-white rounded-full px-6 py-2 text-sm shadow-2xl"
          />
        </div>
      )}

      {captchaVisible && (
        <>
          <div className="flex justify-center items-center w-64 h-28 bg-white rounded-md border border-gray-300 text-3xl shadow-2xl">
            <span className="text-2xl  font-bold text-gray-800">
              {captcha}
            </span>
          </div>

          <div className="relative mt-4 flex justify-center space-x-8">
          <p className="mt-2 text-sm font-medium text-red-700">Special Alpha Numeric Case Sensitive*</p>
            <CustomButton
              text={timeLeft}
              className="w-full bg-indigo-700 text-white rounded-full px-6 py-2 text-sm shadow-md"
            />
          </div>

          <div className="relative mt-4 flex justify-center space-x-4">
            <input
              type="text"
              placeholder="Enter Captcha"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-20 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <CustomButton
            onClick={fetchCaptcha}
              text="Skip"
              className="w-full bg-indigo-700 text-white rounded-full px-6 py-2 text-sm shadow-md"
            />
          </div>

          <div className="mt-4 flex justify-center" onClick={verifyCaptcha}>
            <CustomButton
              text="Submit"
              className="w-full bg-indigo-700 text-white rounded-full px-6 py-2 text-sm shadow-md"
            />
          </div>
        </>
      )}

      {message && (
        <p className="mt-2 text-sm font-medium text-gray-700">{message}</p>
      )}
      <div className="flex items-center justify-center mt-6">
        <button className="bg-gray-100 text-blue-500 m-4 px-4 py-2 text-sm shadow-md">
          <FaDollarSign />
          {cashAmount}
        </button>
        {captchaVisible && (
          <button
            onClick={handlePayout}
            className="bg-gray-100 text-blue-500 m-4 px-4 py-2 text-sm shadow-md"
          >
            <FaPaypal />
            Razorpay
          </button>
        )}
      </div>
    </>
  );
};

export default CaptchaBox;
