const { performance } = require("perf_hooks");

function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000)
    })
}

(async () => {
    await sleep(1);
    for (i = 0; i < 1_000_000_000_000; i++) {
        if (i % 100_000 == 0) {
            console.log(performance.eventLoopUtilization())
        }
    }
})();