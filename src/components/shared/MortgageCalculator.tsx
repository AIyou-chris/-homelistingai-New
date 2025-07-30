import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface MortgageCalculatorProps {
  propertyPrice?: number;
  downPayment?: number;
  interestRate?: number;
  loanTerm?: number;
  onCalculate?: (result: MortgageResult) => void;
}

interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  downPaymentAmount: number;
  loanAmount: number;
  monthlyPrincipal: number;
  monthlyInterest: number;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice = 500000,
  downPayment = 20,
  interestRate = 6.5,
  loanTerm = 30,
  onCalculate
}) => {
  const [price, setPrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(downPayment);
  const [rate, setRate] = useState(interestRate);
  const [term, setTerm] = useState(loanTerm);
  const [result, setResult] = useState<MortgageResult | null>(null);

  const calculateMortgage = () => {
    const downPaymentAmount = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPaymentAmount;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    if (monthlyRate === 0) {
      const monthlyPayment = loanAmount / numberOfPayments;
      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = 0;

      const mortgageResult: MortgageResult = {
        monthlyPayment,
        totalPayment,
        totalInterest,
        downPaymentAmount,
        loanAmount,
        monthlyPrincipal: monthlyPayment,
        monthlyInterest: 0
      };

      setResult(mortgageResult);
      onCalculate?.(mortgageResult);
      return;
    }

    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    const monthlyPrincipal = loanAmount / numberOfPayments;
    const monthlyInterest = monthlyPayment - monthlyPrincipal;

    const mortgageResult: MortgageResult = {
      monthlyPayment,
      totalPayment,
      totalInterest,
      downPaymentAmount,
      loanAmount,
      monthlyPrincipal,
      monthlyInterest
    };

    setResult(mortgageResult);
    onCalculate?.(mortgageResult);
  };

  useEffect(() => {
    calculateMortgage();
  }, [price, downPaymentPercent, rate, term]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Property Price
          </Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Enter property price"
            className="text-lg font-semibold"
          />
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Down Payment: {downPaymentPercent}%
          </Label>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={(value) => setDownPaymentPercent(value[0])}
            max={50}
            min={3.5}
            step={0.5}
            className="w-full"
          />
          <div className="text-sm text-gray-600">
            Down Payment: {formatCurrency((price * downPaymentPercent) / 100)}
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Interest Rate: {rate}%
          </Label>
          <Slider
            value={[rate]}
            onValueChange={(value) => setRate(value[0])}
            max={10}
            min={2}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Loan Term: {term} years
          </Label>
          <div className="flex gap-2">
            <Button
              variant={term === 15 ? "default" : "outline"}
              size="sm"
              onClick={() => setTerm(15)}
            >
              15 years
            </Button>
            <Button
              variant={term === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setTerm(30)}
            >
              30 years
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(result.monthlyPayment)}
              </div>
              <div className="text-sm text-gray-600">Monthly Payment</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Loan Amount</div>
                <div className="text-gray-600">{formatCurrency(result.loanAmount)}</div>
              </div>
              <div>
                <div className="font-semibold">Down Payment</div>
                <div className="text-gray-600">{formatCurrency(result.downPaymentAmount)}</div>
              </div>
              <div>
                <div className="font-semibold">Total Interest</div>
                <div className="text-gray-600">{formatCurrency(result.totalInterest)}</div>
              </div>
              <div>
                <div className="font-semibold">Total Payment</div>
                <div className="text-gray-600">{formatCurrency(result.totalPayment)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MortgageCalculator; 