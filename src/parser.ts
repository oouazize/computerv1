import { absValue, maxValue } from ".";
import { Equation, Term } from "./types";

export function parseEquation(input: string): Equation {
	// Split the equation into left and right parts based on the equals sign
	const parts = input.split("=");
	const leftSide = parts[0].trim();
	const rightSide = parts.length > 1 ? parts[1].trim() : "";

	// Parse both sides of the equation
	const leftTerms = parseTerms(leftSide);
	const rightTerms = parseTerms(rightSide);

	// Move all terms to the left side by negating the coefficients of the right side terms
	const negatedRightTerms = rightTerms.map((term) => ({
		coefficient: -term.coefficient,
		exponent: term.exponent,
	}));

	// Combine all terms
	let allTerms = [...leftTerms, ...negatedRightTerms];

	// Combine like terms (terms with the same exponent)
	const combinedTerms: Term[] = [];

	// Group terms by exponent
	const exponentMap = new Map<number, number>();

	for (const term of allTerms) {
		const currentValue = exponentMap.get(term.exponent) || 0;
		exponentMap.set(term.exponent, currentValue + term.coefficient);
	}

	// Convert the map back to an array of terms
	for (const [exponent, coefficient] of exponentMap) {
		// Only include terms with non-zero coefficients
		if (coefficient !== 0) {
			combinedTerms.push({ coefficient, exponent });
		}
	}

	// Sort terms by exponent in ascending order
	combinedTerms.sort((a, b) => a.exponent - b.exponent);

	// Find the highest exponent (degree of the equation)
	const degree =
		combinedTerms.length > 0
			? maxValue(combinedTerms.map((term) => term.exponent))
			: 0;

	return {
		terms: combinedTerms,
		degree,
	};
}

function parseTerms(expression: string): Term[] {
	if (!expression) return [];

	const terms: Term[] = [];
	let currentIndex = 0;
	let startIndex = 0;

	// Add a + at the beginning if expression doesn't start with a sign
	// This ensures the first term will be processed properly
	let processedExpression = expression.trim();
	if (
		processedExpression.length > 0 &&
		processedExpression[0] !== "+" &&
		processedExpression[0] !== "-"
	) {
		processedExpression = "+" + processedExpression;
	}

	while (currentIndex < processedExpression.length) {
		// Look for the start of the next term (+ or -)
		if (
			processedExpression[currentIndex] === "+" ||
			processedExpression[currentIndex] === "-"
		) {
			// If not the first term, process the previous term
			if (currentIndex > 0) {
				const termString = processedExpression
					.substring(startIndex, currentIndex)
					.trim();
				if (termString) {
					const term = parseTerm(termString);
					terms.push(term);
				}
			}

			startIndex = currentIndex;
		}

		currentIndex++;
	}

	// Process the last term
	const lastTerm = processedExpression.substring(startIndex).trim();
	if (lastTerm) {
		const term = parseTerm(lastTerm);
		terms.push(term);
	}

	return terms;
}

function parseTerm(termString: string): Term {
	termString = termString.trim();

	// Check if the string is valid and contains X^
	if (!termString.includes("*") || !termString.includes("X^")) {
		throw new Error(`Invalid term format: ${termString}`);
	}

	// Get coefficient part (before * X^)
	let sign = 1;
	if (termString.startsWith("-")) {
		sign = -1;
		termString = termString.substring(1).trim();
	} else if (termString.startsWith("+")) {
		termString = termString.substring(1).trim();
	}

	const parts = termString.split("*");
	let coefficientStr = parts[0].trim();

	// Handle implicit coefficient (1)
	let coefficient = coefficientStr === "" ? 1 : parseFloat(coefficientStr);
	coefficient *= sign;

	// Get exponent part (after X^)
	const exponentParts = termString.split("X^");
	if (exponentParts.length < 2) {
		throw new Error(`Invalid term format: ${termString}`);
	}

	const exponentStr = exponentParts[1].trim();
	const exponent = parseInt(exponentStr, 10);

	if (isNaN(exponent)) {
		throw new Error(`Invalid exponent format: ${exponentStr}`);
	}

	return { coefficient, exponent };
}

export function equationToString(equation: Equation): string {
	if (equation.terms.length === 0) {
		return "0 = 0";
	}

	const termStrings = equation.terms.map((term, index) => {
		const coefficient = absValue(term.coefficient);
		const sign = term.coefficient < 0 ? "- " : index > 0 ? "+ " : "";

		return `${sign}${coefficient} * X^${term.exponent}`;
	});

	return `${termStrings.join(" ")} = 0`;
}
