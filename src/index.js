import App from "./game/App";
import Service from "./game/Service";

const app = new App(new Service());

window.addEventListener("load", () => {
    app.on("task:changed", function() {
        let letters = this.task.getData();
        // преобразуем letters в набор кнопочек
        // обновляем номера вопросов
        // this.taskNumber // this.task.number
        // this.tasksCount
    });

    app.on("completed", function() {
        let stats = app.getStats();
        // показываем статистику
    });

    app.on("ready", function() {
        document.body.addEventListener("keypress", function(e) {
            if (e.key) {
                let letter = e.key;
                app.checkAnswer(letter, (isCorrect) => {
                    if (isCorrect) {
                        // отметить кнопку
                    } else {
                        // подсветить кнопку красный цветом
                    }
                });
            }
        });
    });

    app.on("await-restore", function() {
        if (confirm("Вы хотите продолжить игру с того места, где остановились?")) {
            app.restore();
        } else {
            app.restart();
        }
    });

    window.onbeforeunload = function() {
        if (app.status === "active") {
            app.save();
        }
    }

});
