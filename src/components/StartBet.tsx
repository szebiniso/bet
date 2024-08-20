import React, { FC, useState } from 'react'
import styles from './Styles.module.scss'

type TProps = {
    startTimer: () => void
}

const StartBet: FC<TProps> = ({ startTimer }) => {
    const balance = localStorage.getItem('balance') || 0
    const [betRate, setBetRate] = useState<string | null>(null)
    const [betPriceValue, setBetPriceValue] = useState<number>(0)

    const onClickOneOfTheButtons = (val: string) => setBetRate(val)

    const onStartBet = () => {
        if (betRate && betPriceValue <= balance) {
            localStorage.setItem('bet_price', `${betPriceValue}`)
            localStorage.setItem('balance', `${+balance - +betPriceValue}`)
            localStorage.setItem('bet_rate', betRate)
            localStorage.setItem('result_in_process', 'true')
            startTimer()
            setBetRate(null)
            setBetPriceValue(0)
        }
    }

    return (
        <form className={styles.wrapper}>
            <h3>Please set your bet price and choose possible</h3>
            <div className={styles.wrapper__form}>
                <div>
                    <input
                        onChange={(e) => setBetPriceValue(+e.target.value)}
                        type="number"
                        name="bet_price"
                    />
                    <span>
                        {betPriceValue > +balance &&
                            "The bet price can't be more than current balance :("}
                    </span>
                </div>
                <div className={styles.form__buttons}>
                    <button
                        type="button"
                        onClick={() => {
                            onClickOneOfTheButtons('down')
                        }}
                    >
                        -
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onClickOneOfTheButtons('up')
                        }}
                    >
                        +
                    </button>
                </div>
                <button type="button" onClick={onStartBet}>
                    Start
                </button>
            </div>
        </form>
    )
}

export default StartBet
