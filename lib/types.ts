export type ReviewSource = "Facebook" | "Google";

export interface Testimonial {
  text: string;
  name: string;
  source: ReviewSource;
  rating?: number;
}

export interface Chef {
  id: string;
  name: string;
  title: string;
  image: string;
}
