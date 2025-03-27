import { parseEquation } from "./parser";
import { solveEquation } from "./solver";

function main() {
	// Get the input from command line arguments
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.error("Error: No equation provided");
		console.error(
			'Usage: node computor.js "5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0"'
		);
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
				console.log(solution.solutions.join("\n"));
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
