import 'dotenv/config'
import app from './app'
import {
  cancelGiftTradeWait,
  cancelTradeWait,
  delWaitPay,
  confirmTrade,
  confirmGiftPicked,
  refundGift,
  cancelTradeWaitGroup,
  delWaitPayGroup,
} from './schedule/trade';
import {onProductCache} from './schedule/cache'

const PORT = parseInt(process.env.SERVER_PROT || '3030')


app.listen(PORT,() => {
  console.log(`
                      ██████          
                    ██▓▓▓▓▓▓██        
                  ██▓▓▓▓▒▒▒██
                ██▓▓▓▓▒▒▒▒██
                ██▓▓▒▒▒▒▒▒██
              ██▓▓▓▓▒▒▒▒▒▒██
              ████▒▒████▒▒██
              ██▓▓▒▒▒▒▒▒▒▒██
            ██    ▒▒    ▒▒██
            ████  ▒▒██  ▒▒██          
            ██    ▒▒    ▒▒██
            ██▒▒▒▒▒▒▒▒▒▒▒▒██
            ████████████▒▒▒▒██
          ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
        ██▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒██
      ██▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒██
    ██▓▓▓▓▓▓▒▒▒▒  ${PORT}  ▒▒▒▒▒▓▓▒▒▒▒██
  ██▓▓▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒██
  ██▓▓▒▒▓▓▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒██
  ██▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓██
    ████▐▌▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▐▌▐▌████
      ██▐▌▐▌▌▌▌▌▌▌▌▌▐▌▐▌▐▌▐▌▌▌▐▌██
      ██▌▌▐▌▐▌▌▌▐▌▌▌▌▌▐▌▌▌▌▌▌▌▌▌██
        ██▌▌▐▌▐▌▐▌▐▌▐▌▐▌▐▌▌▌▌▌██
        ██▐▌▐▌▐▌████████▐▌▌▌▌▌██
          ██▒▒██        ██▒▒██
          ██████        ██████
  `)
  //定时任务函数
  cancelGiftTradeWait()
  cancelTradeWait()
  delWaitPay()
  confirmTrade()
  confirmGiftPicked()
  refundGift()
  onProductCache()
  cancelTradeWaitGroup()
  delWaitPayGroup()
})
