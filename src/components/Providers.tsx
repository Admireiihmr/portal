"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import Preloader from "./Preloader";
import SmoothScroll from "./SmoothScroll";

const IntroCtx = createContext(true);
/** True once the intro screen has finished (or was skipped). Hero entrance animations wait for it. */
export const useIntroReady = () => useContext(IntroCtx);
const SetIntroCtx = createContext<(v: boolean) => void>(() => {});
export const useSetIntroReady = () => useContext(SetIntroCtx);

export default function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <IntroCtx.Provider value={ready}>
      <SetIntroCtx.Provider value={setReady}>
        <SmoothScroll />
        <Preloader />
        {children}
      </SetIntroCtx.Provider>
    </IntroCtx.Provider>
  );
}
