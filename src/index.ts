import { parseEquation } from "./parser";
import { solveEquation } from "./solver";
import * as readline from "readline";

function main() {
	// Get the input from command line arguments
	const args = process.argv.slice(2);

	if (args.length > 1) {
		console.error("Usage: ./computor [equation]");
		process.exit(1);
	}

	if (args.length === 0) {
		// Create readline interface for user input
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		// Prompt user for equation
		rl.question("Enter your equation: ", (input) => {
			rl.close();
			processEquation(input);
		});
	} else {
		// Process equation from command line argument
		processEquation(args[0]);
	}
}

function processEquation(equationStr: string) {
	try {
		// Parse the equation
		const equation = parseEquation(equationStr);

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

main();
