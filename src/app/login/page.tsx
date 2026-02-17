"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCookie, getCookie, hasCookie } from "cookies-next";
import Link from "next/link";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { logInUser } from "@/redux/action/authAction/authAction";
import { Dots } from "react-activity";
import { assetPaths } from "@/paths/path";
import styles from "./login.module.css";
import messages from "@/utils/messages/messages";
import { useTranslation } from 'react-i18next';
import leftImage from "@/assets/images/login-side.png";

interface FormStates {
  username: string;
  password: string;
  loader: boolean;
  showPassword: boolean;
  showToast: boolean;
  message: string;
  messageStatus: string;
  rememberMe: boolean;
}

const LogIn: React.FC = () => {

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language; // 'en' or 'ar'

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, user, loading } = useAppSelector((state) => state.authStates);

  const [formStates, setFormStates] = useState<FormStates>({
    username: "",
    password: "",
    loader: false,
    showPassword: false,
    showToast: false,
    message: "",
    messageStatus: "",
    rememberMe: false,
  });

  // Load saved credentials from cookies on component mount
  useEffect(() => {
    if (hasCookie("rememberedUsername") && hasCookie("rememberedPassword")) {
      setFormStates((prevState) => ({
        ...prevState,
        username: getCookie("rememberedUsername") as string,
        password: getCookie("rememberedPassword") as string,
        rememberMe: true,
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormStates((prevState) => ({
      ...prevState,
      [id]: value.trimStart(),
    }));
  };

  const handleClickShowPassword = () =>
    setFormStates({ ...formStates, showPassword: !formStates.showPassword });

  const handleRememberMeChange = () => {
    setFormStates((prevState) => ({
      ...prevState,
      rememberMe: !prevState.rememberMe,
    }));
  };

  const clearStates = () => {
    setFormStates({
      username: "",
      password: "",
      loader: false,
      showPassword: false,
      showToast: false,
      message: "",
      messageStatus: "",
      rememberMe: false,
    });
  };

  const closeShowMessage = () => {
    setFormStates({
      ...formStates,
      showToast: false,
      message: "",
      messageStatus: "",
    });
  };

  const resHandler = (res: any) => {
    // If we received a plain string message (e.g., from thunk rejection), show it directly
    if (res && typeof res?.message === 'string' && !res?.status) {
      setFormStates({
        ...formStates,
        loader: false,
        showToast: true,
        message: res.message,
        messageStatus: messages.error,
      });
      return;
    }
    if (res && res?.message === "Network Error") {
      setFormStates({
        ...formStates,
        loader: false,
        showToast: true,
        message: "Server is not working, Please try again later!",
        messageStatus: messages.error,
      });
    } else if (res && res?.message === "Internal Server Error") {
      setFormStates({
        ...formStates,
        loader: false,
        showToast: true,
        message: res?.data?.message,
        messageStatus: messages.error,
      });
    } else if (res && !res?.status?.toString().startsWith("2")) {
      setFormStates({
        ...formStates,
        loader: false,
        showToast: true,
        message: res?.data?.message,
        messageStatus: messages.error,
      });
    } else {
      toast.success("You have logged in successfully");
      setFormStates({
        ...formStates,
        showToast: true,
        message: "You have logged in successfully",
        messageStatus: messages.success,
      });

      // Save credentials to cookies if "Remember Me" is checked
      if (formStates.rememberMe) {
        setCookie("rememberedUsername", formStates.username, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
        setCookie("rememberedPassword", formStates.password, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
      }

      setCookie("AuthToken", res?.data?.token, { maxAge: 60 * 60 * 24 * 7 });
      setCookie("user_object", JSON.stringify(res?.data), { maxAge: 60 * 60 * 24 * 7 });
      setCookie("UserAuthenticated", true, { maxAge: 60 * 60 * 24 * 7 });
      clearStates();
      router.replace("/dashboard");
    }
  };

  const logInHandler = () => {
    const username = formStates.username.trim();
    const password = formStates.password.trim();

    let hasError = false;

    if (!username) {
      toast.error("Username is required");
      hasError = true;
    }

    if (!password) {
      toast.error("Password is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setFormStates((prevState) => ({
      ...prevState,
      loader: true,
    }));

    const formDataClone = { username, password };

    dispatch(logInUser(formDataClone))
      .unwrap()
      .then((res) => {
        resHandler({ status: 200, data: res });
      })
      .catch((err) => {
        resHandler({ message: err });
      });
  };

  return (
    <div className={styles.authMainContainer}>
      <div className="min-h-screen md:flex bg-white">
        <div className="hidden md:block relative md:min-h-screen md:basis-1/2 overflow-hidden rounded-r-[24px]">
          <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaw8fgl0rN0BFngV_e_FuHkakKIjhimwmzKQ&s" alt="left-image" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-left-top" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#E92137]/35 via-transparent to-[#1976d2]/25 pointer-events-none" />
        </div>
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 bg-white md:rounded-r-[3px] shadow-xl">
          <div className="w-full max-w-lg">
            {/* <div className={styles.mainXourceLogo}>
              <Image
                className={`d-block ${styles.XourceIcon}`}
                src={assetPaths.XourceIcon}
                alt="xource-logo"
                width={70}
              />
            </div> */}
            <h2 className="text-2xl sm:text-4xl font-semibold mb-2 text-black text-left">
              Welcome Back! 
              <br />
              Sign In to see latest updates.
            </h2>
            <p className="text-gray mb-8 text-left">
              Access your pump insights and operational data securely.
            </p>
            <div className="space-y-4">
              <div className="space-y-2 pb-2">
                <Label htmlFor="username" className="text-sm text-black font-bold">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={formStates.username}
                  onChange={handleInputChange}
                  className="text-sm text-gray p-5"
                />
              </div>
              <div className="relative space-y-2 pb-2">
                <Label htmlFor="password" className="text-sm text-black font-bold">
                  Password
                </Label>
                <Input
                  id="password"
                  type={formStates.showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formStates.password}
                  onChange={handleInputChange}
                  className={`text-sm text-gray p-5 ${currentLang === 'ar' ? 'pr-3 pl-10' : 'pl-3 pr-10'}`}
                  style={{ direction: currentLang === 'ar' ? 'rtl' : 'ltr' }}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 top-3 flex items-center text-xs sm:text-sm leading-5 text-[#1976d2] hover:text-[#115293] ${currentLang === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'}`}
                  onClick={handleClickShowPassword}
                  aria-label={formStates.showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {formStates.showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" checked={formStates.rememberMe} onCheckedChange={handleRememberMeChange} />
                  <label htmlFor="remember" className="text-sm text-black">Remember me</label>
                </div>
                <Link href="/forgot-password" className="text-sm text-[#1976d2] hover:text-[#115293]">Recover password</Link>
              </div>
              {formStates.loader ? (
                <Dots className="text-center bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-sm sm:text-base py-3 sm:py-3 rounded-md text-white" />
              ) : (
                <Button
                  className="w-full text-center bg-gradient-to-r from-[#E92137] to-[#1976d2] hover:from-[#C81D30] hover:to-[#115293] text-sm sm:text-base py-3 sm:py-3 rounded-md text-white"
                  onClick={logInHandler}
                  type="submit"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;