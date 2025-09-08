import React from "react";
import style from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={style.notfound}>
      <h1 className={style.title}>404</h1>
      <p className={style.subtitle}>Oops! Page not found</p>
      <a href="/" className={style.homeLink}>
        Go Back Home
      </a>
    </div>
  );
}
