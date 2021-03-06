const pTry = (fn, ...arguments_) => new Promise(resolve => {
	resolve(fn(...arguments_))
})


const _pLimit = concurrency => {
	if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up')
	}

	const queue: any[] = []
	let activeCount = 0

	const next = () => {
		activeCount--

		if (queue.length > 0) {
			queue.shift()()
		}
	}

	const run = async (fn, resolve, ...args) => {
		activeCount++

		// TODO: Get rid of `pTry`. It's not needed anymore.
		const result = pTry(fn, ...args)

		resolve(result)

		try {
			await result
		} catch {}

		next()
	}

	const enqueue = (fn, resolve, ...args) => {
		queue.push(run.bind(null, fn, resolve, ...args));

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve()

			if (activeCount < concurrency && queue.length > 0) {
				queue.shift()()
			}
		})()
	}

	const generator = (fn, ...args) => new Promise(resolve => enqueue(fn, resolve, ...args))
	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount
		},
		pendingCount: {
			get: () => queue.length
		},
		clearQueue: {
			value: () => {
				queue.length = 0
			}
		}
	})

	return generator
}



function pLimit(pArray: Promise<any>[], plimit: number = 10): Promise<any[]>{
  return new Promise<number[]>((resolve, reject)=>{
    let limit = _pLimit(plimit)
    let input:any = []

    if(pArray.length === 0){
      throw new Error('`pLimit参数有误，不能为空数组`')
    }

    for(let i = 0; i < pArray.length; i++){
      input.push(limit(() => pArray[i]))
    }

    Promise.all(input).then((res: any) => {
      resolve(res)
    }, (err: any) => {
      reject(err)
    })

  })
}


export default pLimit