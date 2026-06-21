import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

const ROOT_PATHS = new Set(["/", "/login", "/register"]);

export default function MobileAppBridge() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const native = Capacitor.isNativePlatform();

    const applyAppClasses = () => {
      const path = window.location.pathname;
      document.documentElement.classList.toggle("cap-native", native);
      document.body.classList.toggle("cap-native", native);
      document.body.classList.toggle("cap-mobile", native || window.innerWidth <= 768);
      document.body.classList.toggle("app-public-home", native && path === "/");
      document.body.classList.toggle("app-public-page", native && !path.startsWith("/dashboard"));
    };

    applyAppClasses();
    window.addEventListener("resize", applyAppClasses);
    window.addEventListener("popstate", applyAppClasses);

    return () => {
      window.removeEventListener("resize", applyAppClasses);
      window.removeEventListener("popstate", applyAppClasses);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    let lastStatusTheme = "";

    const syncNativeChrome = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || localStorage.getItem("theme") || "dark";
      if (currentTheme === lastStatusTheme) return;
      lastStatusTheme = currentTheme;

      const isLight = currentTheme === "light";
      StatusBar.setBackgroundColor({ color: isLight ? "#f8ffff" : "#050b18" }).catch(() => {});
      StatusBar.setStyle({ style: isLight ? Style.Light : Style.Dark }).catch(() => {});
    };

    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    SplashScreen.hide().catch(() => {});
    syncNativeChrome();

    const observer = new MutationObserver(syncNativeChrome);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    let listener;
    const registerBackButton = async () => {
      listener = await CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        const path = window.location.pathname;

        if (path.startsWith("/dashboard/") && path !== "/dashboard/profile") {
          navigate("/dashboard/profile");
          return;
        }

        if (path === "/dashboard") {
          navigate("/");
          return;
        }

        if (canGoBack && !ROOT_PATHS.has(path)) {
          navigate(-1);
          return;
        }

        CapacitorApp.minimizeApp();
      });
    };

    registerBackButton();
    return () => {
      listener?.remove?.();
    };
  }, [location.pathname, navigate]);

  return null;
}