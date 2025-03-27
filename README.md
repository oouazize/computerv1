# ComputorV1

A polynomial equation solver for equations of degree 2 or lower.

## Features

- Solves polynomial equations up to degree 2
- Displays the reduced form of the equation
- Shows the degree of the equation
- Calculates and displays the solutions
- Displays the polarity of the discriminant (for quadratic equations)

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the project:
   ```
   npm run build
   ```

## Usage

```
./computor "equation"
```

Where `equation` is a polynomial equation like:

```
5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0
```

## Examples

```
$ ./computor "5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0"
Reduced form: 4 * X^0 + 4 * X^1 - 9.3 * X^2 = 0
Polynomial degree: 2
Discriminant is strictly positive, the two solutions are:
-0.475131
0.905239
```

```
$ ./computor "5 * X^0 + 4 * X^1 = 4 * X^0"
Reduced form: 1 * X^0 + 4 * X^1 = 0
Polynomial degree: 1
The solution is:
-0.25
```

```
$ ./computor "8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0"
Reduced form: 5 * X^0 - 6 * X^1 - 5.6 * X^3 = 0
Polynomial degree: 3
The polynomial degree is strictly greater than 2, I can't solve.
```

## Special Cases

The program also handles special cases such as equations where all real numbers are solutions:

```
$ ./computor "42 * X^0 = 42 * X^0"
Reduced form: 0 = 0
Polynomial degree: 0
All real numbers are solutions.
``` 