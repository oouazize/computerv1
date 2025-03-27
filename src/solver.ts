import { Equation, Solution } from "./types";
import { equationToString } from "./parser";

// Custom square root function to avoid using Math library
function sqrt(value: number): number {
	if (value < 0) return NaN;
	if (value === 0) return 0;

	let x = value;
	let y = 1;

	const epsilon = 0.00000001;

	while (x - y > epsilon) {
		x = (x + y) / 2;
		y = value / x;
	}

	return x;
}

export function solveEquation(equation: Equation): Solution {
	const { terms, degree } = equation;
	const reducedForm = equationToString(equation);

	// Special case: If there are no terms, all real numbers are solutions
	if (terms.length === 0) {
		return {
			degree,
			reducedForm: "0 = 0",
			solutions: null,
			message: "All real numbers are solutions.",
		};
	}

	// If the highest degree is 0, it's a constant equation
	if (degree === 0) {
		const constantTerm = terms.find((term) => term.exponent === 0);

		if (constantTerm && constantTerm.coefficient !== 0) {
			return {
				degree,
				reducedForm,
				solutions: null,
				message: "There is no solution.",
			};
		} else {
			return {
				degree,
				reducedForm,
				solutions: null,
				message: "All real numbers are solutions.",
			};
		}
	}

	// If the highest degree is 1, it's a linear equation
	if (degree === 1) {
		const a = terms.find((term) => term.exponent === 1)?.coefficient || 0;
		const b = terms.find((term) => term.exponent === 0)?.coefficient || 0;

		if (a === 0) {
			return {
				degree,
				reducedForm,
				solutions: null,
				message:
					b === 0 ? "All real numbers are solutions." : "There is no solution.",
			};
		}

		const solution = (-b / a).toFixed(6).replace(/\.?0+$/, "");
		return {
			degree,
			reducedForm,
			solutions: [solution],
		};
	}

	// If the highest degree is 2, it's a quadratic equation
	if (degree === 2) {
		const a = terms.find((term) => term.exponent === 2)?.coefficient || 0;
		const b = terms.find((term) => term.exponent === 1)?.coefficient || 0;
		const c = terms.find((term) => term.exponent === 0)?.coefficient || 0;

		if (a === 0) {
			// If a is 0, it's actually a linear equation
			return solveEquation({
				terms: terms.filter((term) => term.exponent < 2),
				degree: 1,
			});
		}

		const discriminant = b * b - 4 * a * c;

		if (discriminant < 0) {
			return {
				degree,
				reducedForm,
				solutions: null,
				discriminant,
				message:
					"Discriminant is strictly negative, there are no real solutions.",
			};
		} else if (discriminant === 0) {
			const solution = (-b / (2 * a)).toFixed(6).replace(/\.?0+$/, "");
			return {
				degree,
				reducedForm,
				solutions: [solution],
				discriminant,
				message: "Discriminant is zero, the solution is:",
			};
		} else {
			const sqrtDiscriminant = sqrt(discriminant);
			const solution1 = ((-b + sqrtDiscriminant) / (2 * a))
				.toFixed(6)
				.replace(/\.?0+$/, "");
			const solution2 = ((-b - sqrtDiscriminant) / (2 * a))
				.toFixed(6)
				.replace(/\.?0+$/, "");

			return {
				degree,
				reducedForm,
				solutions: [solution1, solution2],
				discriminant,
				message: "Discriminant is strictly positive, the two solutions are:",
			};
		}
	}

	// If the degree is higher than 2, we can't solve it
	return {
		degree,
		reducedForm,
		solutions: null,
		message: "The polynomial degree is strictly greater than 2, I can't solve.",
	};
}
