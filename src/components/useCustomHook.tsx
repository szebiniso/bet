import { useEffect, useState } from 'react'

export const useCustomHook = () => {
    const leftTime = localStorage.getItem('left_time') || 0
    const resultInProcess = localStorage.getItem('result_in_process')
    const [timeLeft, setTimeLeft] = useState<number>(leftTime ? +leftTime : 10)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [finishBet, setFinishBet] = useState<boolean>(!resultInProcess)

    const startTimer = () => {
        if (!isActive) {
            setIsActive(true)
        }
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(10)
        localStorage.setItem('result_in_process', 'false')
        localStorage.removeItem('left_time')
        setFinishBet(true)
    }

    useEffect(() => {
        leftTime <= 0 && resultInProcess && resetTimer()
    }, [leftTime])

    useEffect(() => {
        let interval: any

        if (resultInProcess === 'true' || isActive) {
            interval = setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1)
                localStorage.setItem('left_time', String(timeLeft - 1))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    return { timeLeft, startTimer, isActive, finishBet }
}
