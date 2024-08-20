import React, { useEffect, useState } from 'react'
import { show } from '@ebay/nice-modal-react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import './App.css'
import { useCustomHook } from './components/useCustomHook'
import StartBet from './components/StartBet'
import CustomModal from './components/BalanceModal'
import ResultModal from './components/ResultModal'

function App() {
    const betPrice = localStorage.getItem('bet_price')
    const resultInProcess = localStorage.getItem('result_in_process')
    const balance = localStorage.getItem('balance')
    const { startTimer, timeLeft, finishBet } = useCustomHook()
    const [currentPairPrice, setCurrentPairPrice] = useState<string>('')
    const [shouldReconnect, setShouldReconnect] = useState(false)

    const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
        useWebSocket('wss://stream.binance.com:443/ws', {
            shouldReconnect: (closeEvent) => shouldReconnect,
            reconnectAttempts: 10,
        })

    const websocket = getWebSocket()

    const handleAddBalance = () => {
        show(CustomModal)
    }

    useEffect(() => {
        if (readyState === ReadyState.OPEN || finishBet) {
            sendJsonMessage({
                method: 'SUBSCRIBE',
                params: ['btcusdt@aggTrade'],
            })
        }
    }, [readyState, resultInProcess, finishBet])

    useEffect(() => {
        if (websocket && resultInProcess === 'true') {
            websocket.close()
            localStorage.setItem('fixed_price', currentPairPrice)
        }
    }, [resultInProcess])

    useEffect(() => {
        const price = +JSON.parse(JSON.stringify(lastJsonMessage))?.p
        price && setCurrentPairPrice(price.toFixed(2))
    }, [lastJsonMessage])

    useEffect(() => {
        setShouldReconnect(true)
        resultInProcess === 'false' &&
            show(ResultModal, {
                currentPairPrice,
                resultInProcess,
            })
    }, [resultInProcess])

    useEffect(() => {
        return () => websocket?.close()
    }, [])

    useEffect(() => {
        if (!balance) {
            show(CustomModal)
        }
    }, [])

    return (
        <div className="App">
            <div>
                <button onClick={handleAddBalance}>Add balance</button>
            </div>
            <h2>Your current balance: {balance}</h2>
            <h2>Current pair price: {currentPairPrice}</h2>

            {resultInProcess && betPrice ? (
                resultInProcess === 'true' && (
                    <h2 className="timer">{timeLeft}</h2>
                )
            ) : (
                <StartBet startTimer={startTimer} />
            )}
        </div>
    )
}

export default App
