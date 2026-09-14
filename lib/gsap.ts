import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(
  CustomEase,
  DrawSVGPlugin,
  MotionPathPlugin,
  ScrollTrigger,
  SplitText,
);

CustomEase.create("ember-out", "0.23,1,0.32,1");
CustomEase.create("ember-in-out", "0.77,0,0.175,1");

export {
  CustomEase,
  DrawSVGPlugin,
  gsap,
  MotionPathPlugin,
  ScrollTrigger,
  SplitText,
};
