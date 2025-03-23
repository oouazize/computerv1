#include "computor.hpp"
#include <iostream>
#include <iomanip>

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " \"equation\"" << std::endl;
        return 1;
    }

    try {
        PolynomialSolver solver(argv[1]);
        solver.parseEquation();

        std::cout << "Reduced form: " << solver.getReducedForm() << std::endl;
        std::cout << "Polynomial degree: " << solver.getDegree() << std::endl;

        auto solutions = solver.solve();
        
        if (solutions.empty()) {
            std::cout << "No real solutions exist." << std::endl;
        } else if (solutions.size() == 1 && solver.getDegree() == 0) {
            std::cout << "All real numbers are solutions." << std::endl;
        } else {
            std::cout << "The solution(s) is/are:" << std::endl;
            for (const auto& solution : solutions) {
                std::cout << std::fixed << std::setprecision(6) << solution << std::endl;
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}