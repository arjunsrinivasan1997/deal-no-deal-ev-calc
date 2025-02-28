"use client"

import {useRef, useState} from "react"
import {Calculator, DollarSign, Percent} from "lucide-react"
import {Button} from "@/components/button"
import {Input} from "@/components/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/card"
import {Alert, AlertDescription} from "@/components/alert"
import {FaArrowDown, FaArrowUp} from "react-icons/fa"
import {motion} from "framer-motion"
import {ThemeToggle} from "@/components/theme-toggle"
import {SpecializedBoardsModal, standardBoard} from "@/components/specialized-boards-modal"


interface CaseValue {
    amount: number
    selected: boolean
}


export default function DealCalculator() {
    const [leftCases, setLeftCases] = useState<CaseValue[]>([{amount: 0.01, selected: false}, {
        amount: 1, selected: false,
    }, {amount: 5, selected: false}, {amount: 10, selected: false}, {amount: 25, selected: false}, {
        amount: 50, selected: false,
    }, {amount: 75, selected: false}, {amount: 100, selected: false}, {amount: 200, selected: false}, {
        amount: 300, selected: false,
    }, {amount: 400, selected: false}, {amount: 500, selected: false}, {amount: 750, selected: false},])

    const [rightCases, setRightCases] = useState<CaseValue[]>([{amount: 1000, selected: false}, {
        amount: 5000, selected: false,
    }, {amount: 10000, selected: false}, {amount: 25000, selected: false}, {
        amount: 50000, selected: false,
    }, {amount: 75000, selected: false}, {amount: 100000, selected: false}, {
        amount: 200000, selected: false,
    }, {amount: 300000, selected: false}, {amount: 400000, selected: false}, {
        amount: 500000, selected: false,
    }, {amount: 750000, selected: false}, {amount: 1000000, selected: false},])

    const maxCasesToOpen = leftCases.length + rightCases.length

    const [casesToOpen, setCasesToOpen] = useState<number>(1)
    const [currentOffer, setCurrentOffer] = useState<number>(0)
    const [volatility, setVolatility] = useState<number>(0)
    const [bestOffer, setBestOffer] = useState<number>(0)
    const [worstOffer, setWorstOffer] = useState<number>(0)
    const [percentIncrease, setPercentIncrease] = useState<number>(0)
    const [percentDecrease, setPercentDecrease] = useState<number>(0)

    const [isDragging, setIsDragging] = useState(false)
    const [dragStartSide, setDragStartSide] = useState<"left" | "right" | null>(null)
    const dragStartIndex = useRef<number | null>(null)

    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const updateLeftCaseAmount = (index: number, value: string) => {
        const newAmount = Number.parseFloat(value.replace(/,/g, ""))
        if (!isNaN(newAmount) && newAmount >= 0) {
            setLeftCases(leftCases.map((c, i) => (i === index ? {...c, amount: newAmount} : c)))
        }
    }

    const updateRightCaseAmount = (index: number, value: string) => {
        const newAmount = Number.parseFloat(value.replace(/,/g, ""))
        if (!isNaN(newAmount) && newAmount >= 0) {
            setRightCases(rightCases.map((c, i) => (i === index ? {...c, amount: newAmount} : c)))
        }
    }

    const formatGridValue = (amount: number): string => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: amount < 1 ? 2 : 0, maximumFractionDigits: 2,
        }).format(amount)
    }
    const calculateMean = (values: number[]) => {
        return values.reduce((sum, val) => sum + val, 0) / values.length
    }

    const getCombinations = (array: number[], size: number) => {
        const result: number[][] = []

        function combine(start: number, combo: number[]) {
            if (combo.length === size) {
                result.push([...combo])
                return
            }
            for (let i = start; i < array.length; i++) {
                combo.push(array[i])
                combine(i + 1, combo)
                combo.pop()
            }
        }

        combine(0, [])
        return result
    }

    const calculateVolatility = (activeValues: number[], casesToOpen: number) => {
        const combinations = getCombinations(activeValues, casesToOpen)
        let sumOfSquares = 0
        let sum = 0
        const totalCombos = combinations.length
        combinations.forEach((combination) => {
            const remainingValues = activeValues.filter((val) => !combination.includes(val))
            const avg = calculateMean(remainingValues)
            sumOfSquares += avg * avg
            sum += avg
        })
        console.log(combinations)
        const meanOfMeans = sum / totalCombos
        const variance = sumOfSquares / totalCombos - meanOfMeans * meanOfMeans
        const stdDev = Math.sqrt(variance)
        return stdDev / meanOfMeans ? stdDev / meanOfMeans : 0
    }

    const calculateStatistics = () => {
        const remainingAmounts = [...leftCases, ...rightCases].filter((c) => !c.selected).map((c) => c.amount)
        if (casesToOpen >= remainingAmounts.length) {
            setErrorMessage(`Error: You can't open ${casesToOpen} cases when only ${remainingAmounts.length} cases remain.`)
            return
        }
        setErrorMessage(null)

        const currentOffer = remainingAmounts.reduce((sum, amount) => sum + amount, 0) / remainingAmounts.length
        setCurrentOffer(currentOffer)

        setVolatility(calculateVolatility(remainingAmounts, casesToOpen))

        if (remainingAmounts.length > 2) {
            const sortedAmounts = [...remainingAmounts].sort((a, b) => a - b)
            const worseCaseOffer = sortedAmounts.slice(0, -casesToOpen).reduce((sum, val) => sum + val, 0) / (remainingAmounts.length - casesToOpen)
            const bestCaseOffer = sortedAmounts.slice(casesToOpen).reduce((sum, val) => sum + val, 0) / (remainingAmounts.length - casesToOpen)
            const percentIncrease = Math.abs(bestCaseOffer - currentOffer) / currentOffer
            const percentDecrease = Math.abs(worseCaseOffer - currentOffer) / currentOffer
            setWorstOffer(worseCaseOffer)
            setBestOffer(bestCaseOffer)
            setPercentIncrease(percentIncrease)
            setPercentDecrease(percentDecrease)
        } else {
            setWorstOffer(0)
            setBestOffer(0)
            setPercentIncrease(0)
            setPercentDecrease(0)
        }

    }

    const toggleCase = (side: "left" | "right", index: number) => {
        if (side === "left") {
            setLeftCases(leftCases.map((c, i) => (i === index ? {...c, selected: !c.selected} : c)))
        } else {
            setRightCases(rightCases.map((c, i) => (i === index ? {...c, selected: !c.selected} : c)))
        }
    }

    const handleMouseDown = (side: "left" | "right", index: number) => {
        setIsDragging(true)
        setDragStartSide(side)
        dragStartIndex.current = index
        toggleCase(side, index)
    }

    const handleMouseEnter = (side: "left" | "right", index: number) => {
        if (isDragging && side === dragStartSide) {
            toggleCase(side, index)
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        setDragStartSide(null)
        dragStartIndex.current = null
    }

    const reset = () => {
        setLeftCases(standardBoard.leftCases.map((amount) => ({amount, selected: false})))
        setRightCases(standardBoard.rightCases.map((amount) => ({amount, selected: false})))
        setCasesToOpen(1)
        setCurrentOffer(0)
        setVolatility(0)
        setBestOffer(0)
        setWorstOffer(0)
    }
    const selectAll = () => {
        setLeftCases(leftCases.map((c) => ({...c, selected: true})))
        setRightCases(rightCases.map((c) => ({...c, selected: true})))
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency", currency: "USD", minimumFractionDigits: amount < 1 ? 2 : 0, maximumFractionDigits: 2,
        }).format(amount)
    }
    const formatPercentage = (percent: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "percent", minimumFractionDigits: percent < 1 ? 2 : 0, maximumFractionDigits: 2,
        }).format(percent)
    }

    // Add this new function for animations
    const fadeInUp = {
        initial: {opacity: 0, y: 20}, animate: {opacity: 1, y: 0}, transition: {duration: 0.5},
    }

    const handleSelectSpecializedBoard = (board: { leftCases: number[]; rightCases: number[] }) => {
        setLeftCases(board.leftCases.map((amount) => ({amount, selected: false})))
        setRightCases(board.rightCases.map((amount) => ({amount, selected: false})))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                    <motion.h1 className="text-4xl font-bold text-primary" {...fadeInUp}>
                        Deal or No Deal Calculator
                    </motion.h1>
                    <ThemeToggle/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div className="lg:col-span-2" {...fadeInUp}>
                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                {errorMessage && (<Alert variant="destructive" className="mb-6">
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>)}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-3">
                                        {leftCases.map((caseValue, index) => (
                                            <div key={`left-${index}`} className="flex items-center">
                                                <Input
                                                    type="text"
                                                    value={formatGridValue(caseValue.amount)}
                                                    onChange={(e) => updateLeftCaseAmount(index, e.target.value)}
                                                    className={`text-center ${caseValue.selected ? "bg-primary/10 text-primary" : ""} transition-colors`}
                                                    onFocus={(e) => e.target.select()}
                                                />
                                                <Button
                                                    variant={caseValue.selected ? "default" : "outline"}
                                                    size="icon"
                                                    className="ml-2 transition-colors"
                                                    onMouseDown={() => handleMouseDown("left", index)}
                                                    onMouseEnter={() => handleMouseEnter("left", index)}
                                                    onMouseUp={handleMouseUp}
                                                >
                                                    {caseValue.selected ? "✓" : "×"}
                                                </Button>
                                            </div>))}
                                    </div>
                                    <div className="space-y-3">
                                        {rightCases.map((caseValue, index) => (
                                            <div key={`right-${index}`} className="flex items-center">
                                                <Input
                                                    type="text"
                                                    value={formatGridValue(caseValue.amount)}
                                                    onChange={(e) => updateRightCaseAmount(index, e.target.value)}
                                                    className={`text-center ${caseValue.selected ? "bg-primary/10 text-primary" : ""} transition-colors`}
                                                    onFocus={(e) => e.target.select()}
                                                />
                                                <Button
                                                    variant={caseValue.selected ? "default" : "outline"}
                                                    size="icon"
                                                    className="ml-2 transition-colors"
                                                    onMouseDown={() => handleMouseDown("right", index)}
                                                    onMouseEnter={() => handleMouseEnter("right", index)}
                                                    onMouseUp={handleMouseUp}
                                                >
                                                    {caseValue.selected ? "✓" : "×"}
                                                </Button>
                                            </div>))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 justify-center items-center">
                                    <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md">
                                        <span className="font-semibold">Cases to open:</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={maxCasesToOpen}
                                            value={casesToOpen}
                                            onChange={(e) => {
                                                const value = Number.parseInt(e.target.value)
                                                if (!isNaN(value)) {
                                                    setCasesToOpen(Math.min(Math.max(1, value), maxCasesToOpen))
                                                }
                                            }}
                                            onKeyDown={(e) => e.preventDefault()}
                                            className="text-center w-20"
                                        />
                                    </div>
                                    <Button onClick={calculateStatistics} className="gap-2">
                                        <Calculator className="w-4 h-4"/>
                                        Calculate
                                    </Button>
                                    <SpecializedBoardsModal onSelectBoardAction={handleSelectSpecializedBoard}/>
                                    <Button variant="outline" onClick={selectAll}>
                                        Select All
                                    </Button>
                                    <Button variant="outline" onClick={reset}>
                                        Reset
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div className="space-y-8" {...fadeInUp}>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3 text-lg">Current Statistics</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md">
                                                <DollarSign className="text-primary"/>
                                                <span className="font-medium">Current fair offer:</span>
                                                <span className="ml-auto">{formatCurrency(currentOffer)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md">
                                                <Percent className="text-primary"/>
                                                <span className="font-medium">Volatility:</span>
                                                <span className="ml-auto">{formatPercentage(volatility)}</span>
                                            </div>
                                            <Alert>
                                                <AlertDescription>
                                                    A high volatility level means your next choice(s) can have a
                                                    significant impact on the next
                                                    offer. A low volatility level means your next choice(s) is less
                                                    likely to have a significant
                                                    impact on the next offer.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-3 text-lg">Next Round Statistics</h3>
                                        <div className="space-y-2">
                                            <div
                                                className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 p-2 rounded-md">
                                                <span className="font-medium">Best case fair offer:</span>
                                                {bestOffer != 0 &&
                                                    <span className="ml-auto">{formatCurrency(bestOffer)}</span>}
                                                {percentIncrease != 0 && (<div
                                                    className="flex items-center text-green-600 dark:text-green-400">
                                                    <span>({formatPercentage(percentIncrease)})</span>
                                                    <FaArrowUp className="ml-1"/>
                                                </div>)}
                                            </div>
                                            <div
                                                className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 p-2 rounded-md">
                                                <span className="font-medium">Worst case fair offer:</span>
                                                {worstOffer != 0 && (<span
                                                    className="ml-auto">{worstOffer != 0 ? formatCurrency(worstOffer) : "N/A"}</span>)}
                                                {percentIncrease != 0 && (
                                                    <div className="flex items-center text-red-600 dark:text-red-400">
                                                        <span>({percentDecrease != 0 ? formatPercentage(percentDecrease) : ""})</span>
                                                        <FaArrowDown className="ml-1"/>
                                                    </div>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Instructions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>• Click or drag to select/deselect multiple cases</p>
                                <p>• Click on any amount to edit its value</p>
                                <p>• Enter the number of cases to be opened in the next round</p>
                                <p>• Click Calculate to see statistics and predictions</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="prose dark:prose-invert">
                                <p>
                                    This calculator helps analyze the popular game show Deal or No Deal by computing the
                                    current expected
                                    value of the board and potential .
                                </p>
                                <br></br>
                                <p>
                                    The fair offer is the statistical mean of your unopened cases. For the first few
                                    rounds of the game,
                                    the offer from the banker is usually below the mean as a way to entice contestants
                                    to keep playing. As
                                    cases are eliminated, and the mean becomes more volatile, the banker&#39;s offer
                                    will typically get
                                    closer to the mean of the board
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>)
}

