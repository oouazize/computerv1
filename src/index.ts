import { parseEquation } from "./parser";
import { solveEquation } from "./solver";

function main() {
	// Get the input from command line arguments
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error("Error: No equation provided");
		console.error('Usage: make run "5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0"');
		process.exit(1);
	}

	try {
		// Parse the equation
		const equation = parseEquation(args[0]);

		// Solve the equation
		const solution = solveEquation(equation);

		// Display the results
		console.log(`Reduced form: ${solution.reducedForm}`);
		console.log(`Polynomial degree: ${solution.degree}`);

		if (solution.message) {
			console.log(solution.message);
		}

		if (solution.solutions) {
			if (solution.solutions.length === 1) {
				console.log(`The solution is:\n${solution.solutions[0]}`);
			} else if (solution.solutions.length > 1) {
				// Check if we have complex solutions
				if (solution.discriminant !== undefined && solution.discriminant < 0) {
					console.log(
						`The solutions are:\n${solution.solutions[0]}\n${solution.solutions[1]}`
					);
				} else {
					console.log(solution.solutions.join("\n"));
				}
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		} else {
			console.error("An unknown error occurred");
		}
		process.exit(1);
	}
}

main();

export function maxValue(values: number[]): number {
	if (values.length === 0) return 0;

	let max = values[0];
	for (let i = 1; i < values.length; i++) {
		if (values[i] > max) {
			max = values[i];
		}
	}
	return max;
}

export function absValue(value: number): number {
	return value < 0 ? -value : value;
}

export function sqrt(value: number): number {
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
