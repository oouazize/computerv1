#ifndef COMPUTOR_HPP
#define COMPUTOR_HPP

#include <string>
#include <vector>
#include <map>

struct Term {
    double coefficient;
    int exponent;
    
    Term(double coef = 0, int exp = 0) : coefficient(coef), exponent(exp) {}
};

class PolynomialSolver {
private:
    std::string equation;
    std::vector<Term> terms;
    int degree;

    std::vector<Term> parseSide(const std::string& expression);
    std::vector<double> solveQuadratic();
    std::vector<double> solveLinear();
    std::vector<double> solveConstant();

public:
    PolynomialSolver(const std::string& eq);
    void parseEquation();
    std::vector<double> solve();
    std::string getReducedForm() const;
    int getDegree() const { return degree; }
};

#endif