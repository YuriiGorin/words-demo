export default class App {
    constructor(service) {
        this._service = service;
        this._status = "awaiting";
        this._listeners = [];
        this._tasks = [];

        this._service.checkContinuationAvailability((can) => {
            if (can) {
                this._status = "awaiting-continuation";
                this._notify();
            } else {
                this._service.getRandomWords((words) => {
                    this._prepareTasks(words);
                });
            }
        });
    }

    get status() {
        return this._status;
    }

    start() {
        if (this._status === "ready") {

        } else {
            throw new Error("Приложение не готово");
        }
    }

    stateChange(cb) {
        if (typeof cb === "function") {
            this._listeners.push(cb);
        } else {
            throw new TypeError("Обработчик должен быть функцией");
        }
    }

    _notify() {
        this._listeners.forEach(cb => cb.call(this, { status: this.status }));
    }


    _prepareTasks(words) {
        this._tasks = words.map(w => new Task(w));
    }

    continue() {
        this._service.getContinuationData((data) => {
            this._prepareTasks(data.words);
        })
    }
}
