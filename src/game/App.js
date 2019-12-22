import Task from "./Task";

const eventTypes = ["ready", "task:changed", "completed", "await-restore"];

export default class App {
    constructor(service) {
        this._service = service;
        this._tasks = [];
        this._currentTaskNumber = 0;
        this._listeners = new Map();
        this._prepareApp().catch(console.error);
    }

    get task() {
        return this._tasks[this._currentTaskNumber];
    }

    get taskNumber() {
        return this._currentTaskNumber + 1;
    }

    get totalTasks() {
        return this._tasks.length;
    }

    on(event, handler) {
        if (eventTypes.includes(event)) {
            if (typeof handler === "function") {
                this._listeners.set(event, handler);
            } else {
                throw new TypeError("Обработчик события должен быть функцией");
            }
        } else {
            throw new Error(`Тип событий ${event} не допустим`);
        }
    }

    checkAnswer(answer) {
        const result = this.task.check(answer);
        if (result === "success") {
            return true;
        }
        if (result === "completed") {
            this._currentTaskNumber++;
            if (this._currentTaskNumber < this.totalTasks) {
                this._notify("task:changed");
            } else {
                this._notify("completed");
            }
            return true;
        }
        return false;
    }

    getStats() {

    }

    save() {
        this._service.saveRestoreData( {
            currentTask: this._currentTaskNumber,
            tasks: this._tasks.map(task => task.getAnswer()),
        });
    }

    restore() {
        let data = this._service.getRestoreData();
        if (data) {
            this._currentTaskNumber = parseFloat(data.currentTask);
            this._start(data.tasks).catch(console.error);
        } else {
            throw new Error("Невозможно продолжить процесс");
        }
    }

    restart() {
        this._service.clearRestoreData();
        this._prepareApp().catch(console.error);
    }

    _notify(event) {
        if (this._listeners.has(event)) {
            const handler = this._listeners.get(event);
            // вызов обработчика событий в контексте этого объекта
            handler.call(this);
        }
    }

    async _prepareApp() {
        return new Promise((res) => {
            setTimeout(async () => {
                if (this._service.hasRestoreData()) {
                    this._notify("await-restore");
                } else {
                    // получить данные для начала игры
                    const data = await this._service.getTasksData({});
                    await this._start(data);
                }
               res();
            }, 0);
        });
    }

    async _start(tasks) {
        this._tasks = tasks.map(item => new Task({ content: item }));
        this._notify("ready");
        this._notify("task:changed");
    }
}
