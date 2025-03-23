#include "computor.hpp"
#include <regex>
#include <sstream>
#include <cmath>
#include <iostream>

PolynomialSolver::PolynomialSolver(const std::string& eq) : equation(eq), degree(0) {}

void PolynomialSolver::parseEquation() {
    // Split equation into left and right parts
    size_t equalPos = equation.find('=');
    if (equalPos == std::string::npos) {
        throw std::runtime_error("Invalid equation format: missing '='");
    }

    std::string left = equation.substr(0, equalPos);
    std::string right = equation.substr(equalPos + 1);

    // Parse both sides
    auto leftTerms = parseSide(left);
    auto rightTerms = parseSide(right);

    // Move right side terms to left with negated coefficients
    for (auto& term : rightTerms) {
        term.coefficient = -term.coefficient;
        leftTerms.push_back(term);
    }

    // Combine like terms
    std::map<int, double> combined;
    for (const auto& term : leftTerms) {
        combined[term.exponent] += term.coefficient;
    }

    // Create final terms list and find degree
    terms.clear();
    for (std::map<int, double>::const_iterator it = combined.begin(); it != combined.end(); ++it) {
        int exp = it->first;
        double coef = it->second;
        if (coef != 0) {
            terms.push_back(Term(coef, exp));
            degree = std::max(degree, exp);
        }
    }
}

std::vector<Term> PolynomialSolver::parseSide(const std::string& expression) {
    std::vector<Term> result;
    std::regex termPattern(R"(([+-]?\s*\d*\.?\d*)\s*\*\s*X\^(\d+))");
    
    auto begin = std::sregex_iterator(expression.begin(), expression.end(), termPattern);
    auto end = std::sregex_iterator();

    for (std::sregex_iterator i = begin; i != end; ++i) {
        std::smatch match = *i;
        std::string coefStr = match[1].str();
        
        // Remove all spaces from the coefficient string
        coefStr.erase(remove_if(coefStr.begin(), coefStr.end(), isspace), coefStr.end());
        
        double coef;
        if (coefStr.empty() || coefStr == "+") {
            coef = 1.0;
        } else if (coefStr == "-") {
            coef = -1.0;
        } else {
            try {
                coef = std::stod(coefStr);
            } catch (const std::exception& e) {
                std::cerr << "Failed to parse coefficient: " << coefStr << std::endl;
                throw;
            }
        }
        
        int exp = std::stoi(match[2].str());
        result.push_back(Term(coef, exp));
    }

    return result;
}

std::string PolynomialSolver::getReducedForm() const {
    if (terms.empty()) {
        return "0 = 0";
    }

    std::stringstream ss;
    
    bool first = true;

    for (const auto& term : terms) {
        if (!first && term.coefficient > 0) {
            ss << "+ ";
        }
        if (first && term.coefficient < 0) {
            ss << "- ";
        }
        first = false;

        ss << std::abs(term.coefficient) << " * X^" << term.exponent << " ";
    }
    ss << "= 0";

    return ss.str();
}

std::vector<double> PolynomialSolver::solve() {
    if (degree > 2) {
        throw std::runtime_error("The polynomial degree is strictly greater than 2, I can't solve.");
    }
    
    if (degree == 2) return solveQuadratic();
    if (degree == 1) return solveLinear();
    return solveConstant();
}

std::vector<double> PolynomialSolver::solveQuadratic() {
    double a = 0, b = 0, c = 0;
    
    for (const auto& term : terms) {
        if (term.exponent == 2) a = term.coefficient;
        else if (term.exponent == 1) b = term.coefficient;
        else if (term.exponent == 0) c = term.coefficient;
    }

    double discriminant = b*b - 4*a*c;
    std::vector<double> solutions;

    if (discriminant > 0) {
        solutions.push_back((-b + std::sqrt(discriminant)) / (2*a));
        solutions.push_back((-b - std::sqrt(discriminant)) / (2*a));
    } else if (discriminant == 0) {
        solutions.push_back(-b / (2*a));
    }
    // For discriminant < 0, return empty vector (complex solutions)

    return solutions;
}

std::vector<double> PolynomialSolver::solveLinear() {
    double b = 0, c = 0;
    
    for (const auto& term : terms) {
        if (term.exponent == 1) b = term.coefficient;
        else if (term.exponent == 0) c = term.coefficient;
    }

    return {-c / b};
}

std::vector<double> PolynomialSolver::solveConstant() {
    // If constant term is 0, all numbers are solutions
    // If constant term is not 0, no solutions exist
    if (terms.empty() || (terms.size() == 1 && terms[0].coefficient == 0)) {
        return {0}; // Indicate all numbers are solutions
    }
    return {}; // No solutions
}