"use client"

import {useState} from "react"
import {Button} from "@/components/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/dialog"
import {Input} from "@/components/input"
import {Label} from "@/components/label"

const BackButton = ({onClick}: { onClick: () => void }) => (
    <Button variant="outline" onClick={onClick} className="text-sm px-2 py-1">
        ← Back
    </Button>)

interface SpecializedBoard {
    name: string
    leftCases: number[]
    rightCases: number[]
    description?: string
}

export const standardBoard: SpecializedBoard = {
    name: "Standard Board",
    leftCases: [0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750],
    rightCases: [1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000],
    description: "The Standard US deal or no deal board, with amounts ranging from $0.01-$1,000,000",
}

const seasonOnePremierWeekBoards: SpecializedBoard[] = [{
    name: "$1,500,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 11), 1000000, 1500000],
}, {
    name: "$2,000,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 11), 1000000, 2000000],
}, {
    name: "$2,500,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 11), 1000000, 2500000],
}, {
    name: "$3,000,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 11), 1000000, 3000000],
},]
const seasonTwoPremierWeekBoards: SpecializedBoard[] = [{
    name: "$2,000,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 11), 1000000, 2000000],
}, {
    name: "$3,000,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 11), 1000000, 3000000],
}, {
    name: "$4,000,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 10), 100000, 2000000, 4000000],
}, {
    name: "$5,000,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 10), 100000, 2500000, 5000000],
}, {
    name: "$6,000,000",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 10), 100000, 3000000, 6000000],
},]

const specializedBoards: SpecializedBoard[] = [{
    name: "Standard US Board",
    leftCases: standardBoard.leftCases,
    rightCases: standardBoard.rightCases,
    description: standardBoard.description,
}, {
    name: "Million Dollar Mission",
    leftCases: standardBoard.leftCases,
    rightCases: [1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 300000, 1000000, 1000000, 1000000, 1000000],
    description: "Special board with multiple $1,000,000 cases",
}, {
    name: "Premiere Week (Season 1)",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 12), 1500000],
    description: "These boards all have a single amount greater than $1,000,000 on them in addition to the $1,000,000 prize",
}, {
    name: "Premiere Week (Season 2)",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 12), 1500000],
    description: "These boards all have at least 1 amount great than $1,000,000 on them in addtion to the $1,000,000 prize",
}, {
    name: "Season 1 Finale",
    leftCases: standardBoard.leftCases,
    rightCases: [...standardBoard.rightCases.slice(0, 10), standardBoard.rightCases[12], 2500000, 5000000],
    description: "Contains a $5,000,000 and $2,500,000 dolar prize in addition to the $1,000,000 prizee",
},

    {
        name: "Double Deal",
        leftCases: standardBoard.leftCases.map((x) => x * 2),
        rightCases: standardBoard.rightCases.map((x) => x * 2),
        description: "Doubles all the values from the standard board",
    },

    {
        name: "$2,000,000 Month",
        leftCases: standardBoard.leftCases,
        rightCases: [...standardBoard.rightCases.slice(0, 11), 1000000, 2000000],
        description: "A board used during the month of November 2008 where $2,000,000 becomes the top prize",
    }, {
        name: "Syndicated Version",
        leftCases: [0.01, 1, 5, 10, 25, 50, 100, 200, 300, 400, 500],
        rightCases: [1000, 2500, 5000, 7500, 10000, 25000, 50000, 75000, 100000, 250000, 500000],
        description: "Used for the syndicated version of the show, this board only had 22 cases and a max prize of $500,000",
    },]

interface SpecializedBoardsModalProps {
    onSelectBoardAction: (board: SpecializedBoard) => void
}

export function SpecialBoardModal({onSelectBoardAction}: SpecializedBoardsModalProps) {
    const [open, setOpen] = useState(false)
    const [millionDollarDialogOpen, setMillionDollarDialogOpen] = useState(false)
    const [millionDollarCases, setMillionDollarCases] = useState(4) // Default is 4 cases
    const [premiereWeekSeason1DialogOpen, setPremiereWeekSeason1DialogOpen] = useState(false)
    const [premiereWeekSeason2DialogOpen, setPremiereWeekSeason2DialogOpen] = useState(false)
    const [activeTooltip, setActiveTooltip] = useState<number | null>(null)

    const handleSelectBoard = (board: SpecializedBoard) => {
        if (board.name === "Million Dollar Mission") {
            setMillionDollarDialogOpen(true)
        } else if (board.name === "Premiere Week (Season 1)") {
            setPremiereWeekSeason1DialogOpen(true)
        } else if (board.name === "Premiere Week (Season 2)") {
            setPremiereWeekSeason2DialogOpen(true)
        } else {
            onSelectBoardAction(board)
            setOpen(false)
        }
    }

    const handleSeasonOnePremiereWeekConfirm = (board: SpecializedBoard) => {
        onSelectBoardAction(board)
        setPremiereWeekSeason1DialogOpen(false)
        setOpen(false)
    }

    const handleSeasonTwoPremiereWeekConfirm = (board: SpecializedBoard) => {
        onSelectBoardAction(board)
        setPremiereWeekSeason2DialogOpen(false)
        setOpen(false)
    }

    const handleMillionDollarConfirm = () => {
        // Create a copy of the base board
        const customBoard: SpecializedBoard = {
            name: `Million Dollar Mission (${millionDollarCases} cases)`,
            leftCases: standardBoard.leftCases,
            rightCases: standardBoard.rightCases, // Start with standard board values
            description: `Special board with ${millionDollarCases} cases containing $1,000,000`,
        }

        // Replace the last n cases with $1,000,000
        for (let i = customBoard.rightCases.length - 1; i >= customBoard.rightCases.length - millionDollarCases; i--) {
            customBoard.rightCases[i] = 1000000
        }

        onSelectBoardAction(customBoard)
        setMillionDollarDialogOpen(false)
        setOpen(false)
    }

    return (<>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Load Special Board</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] text-center">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-center">Select a Specialized Board</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Specialized boards sourced from{" "}
                            <a
                                href="https://deal.fandom.com/wiki/Deal_or_No_Deal_(USA)/Game_Board"
                                target="_blank"
                                className="text-blue-500"
                                rel="noreferrer"
                            >
                                here
                            </a>
                        </p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {specializedBoards.map((board, index) => (<div key={index} className="relative">
                                <Button
                                    onClick={() => handleSelectBoard(board)}
                                    onMouseEnter={() => setActiveTooltip(index)}
                                    onMouseLeave={() => setActiveTooltip(null)}
                                    className="w-full"
                                >
                                    {board.name}
                                </Button>
                                {board.description && activeTooltip === index && (<div
                                        className="absolute z-50 p-2 text-sm bg-secondary text-secondary-foreground rounded shadow-md bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64">
                                        {board.description}
                                    </div>)}
                            </div>))}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={millionDollarDialogOpen} onOpenChange={setMillionDollarDialogOpen}>
                <DialogContent className="sm:max-w-[425px] text-center">
                    <DialogHeader className="text-center">
                        <DialogTitle>Million Dollar Mission</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="millionCases" className="text-center block">
                                How many cases with $1,000,000?
                            </Label>
                            <Input
                                id="millionCases"
                                type="number"
                                min={1}
                                max={13}
                                value={millionDollarCases}
                                onChange={(e) => setMillionDollarCases(Math.min(13, Math.max(1, Number.parseInt(e.target.value) || 1)))}
                                className="col-span-3 mx-auto max-w-[200px] text-center"
                            />
                            <p className="text-sm text-muted-foreground">Select between 1 and 13 cases</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <BackButton
                                onClick={() => {
                                    setMillionDollarDialogOpen(false)
                                    setOpen(true)
                                }}
                            />
                            <Button onClick={handleMillionDollarConfirm}>Confirm</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={premiereWeekSeason1DialogOpen} onOpenChange={setPremiereWeekSeason1DialogOpen}>
                <DialogContent className="sm:max-w-[425px] text-center">
                    <DialogHeader className="text-center">
                        <DialogTitle>Premiere Week (Season 1)</DialogTitle>
                        <p>These boards have an increased maximum prize value and retain the 1 million dollar prize</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {seasonOnePremierWeekBoards.map((board, index) => (
                            <Button key={index} onClick={() => handleSeasonOnePremiereWeekConfirm(board)}
                                    className="w-full">
                                {board.name}
                            </Button>))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <BackButton
                            onClick={() => {
                                setPremiereWeekSeason1DialogOpen(false)
                                setOpen(true)
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={premiereWeekSeason2DialogOpen} onOpenChange={setPremiereWeekSeason2DialogOpen}>
                <DialogContent className="sm:max-w-[425px] text-center">
                    <DialogHeader className="text-center">
                        <DialogTitle>Premiere Week (Season 2)</DialogTitle>
                        <p>These boards have an increased maximum prize value and retain the 1 million dollar prize</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {seasonTwoPremierWeekBoards.map((board, index) => (
                            <Button key={index} onClick={() => handleSeasonTwoPremiereWeekConfirm(board)}
                                    className="w-full">
                                {board.name}
                            </Button>))}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <BackButton
                            onClick={() => {
                                setPremiereWeekSeason2DialogOpen(false)
                                setOpen(true)
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>)
}

