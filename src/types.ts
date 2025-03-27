export interface Term {
  coefficient: number;
  exponent: number;
}

export interface Equation {
  terms: Term[];
  degree: number;
}

export type Solution = {
  degree: number;
  reducedForm: string;
  solutions: string[] | null;
  discriminant?: number;
  message?: string;
} 