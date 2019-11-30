export default class Service {
    getRandomWords() {
        setTimeout(() => {
            cb([
                "apple", "dictionary", "man", "human"
            ]);
        }, 0);
    }

    checkRestoreAvailability(cb) {
        setTimeout(() => {
            cb(false);
        }, 0);
    }

    getContinuationData(cb) {
        setTimeout(() => {
            cb({});
        }, 0);
    }
}
