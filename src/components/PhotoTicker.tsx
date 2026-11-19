import Image from "next/image";
import { PHOTOS } from "@/lib/content";
import Ticker from "./Ticker";

/** Scroll-velocity photo strip of past Foundation Day and ADMIRE events. */
export default function PhotoTicker() {
  return (
    <Ticker variant="photos" speed={-2.2}>
      {PHOTOS.map((p) => (
        <figure className={`ph ${p.wide ? "wide" : ""}`} key={p.src}>
          <Image src={`/images/${p.src}`} alt={p.caption} fill sizes="(max-width: 700px) 300px, 520px" draggable={false} style={{ objectFit: "cover" }} />
          <figcaption>{p.caption}</figcaption>
        </figure>
      ))}
    </Ticker>
  );
}
