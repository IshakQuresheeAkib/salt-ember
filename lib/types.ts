export type ReviewSource = "Facebook" | "Google";

export interface Testimonial {
  text: string;
  name: string;
  source: ReviewSource;
  rating?: number;
}
