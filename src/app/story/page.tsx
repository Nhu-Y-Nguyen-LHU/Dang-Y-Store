import type { Metadata } from "next";

import StoryClient from "./StoryClient";

export const metadata: Metadata = {
  title: "Story",
  description: "Scrollytelling: parallax + blur-to-clear with GSAP ScrollTrigger.",
};

export default function StoryPage() {
  return <StoryClient />;
}
