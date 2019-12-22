import App from "./game/App";
import Service from "./game/Service";

window.addEventListener("load", () => {
    const app = new App(new Service());
    const lettersContainer = document.querySelector("#letters");
    const answerContainer = document.querySelector("#answer");
    const currentQuestionContainer = document.querySelector("#current_question");
    const totalQuestionsContainer = document.querySelector("#total_questions");
    let isFirstTask = true;

    const findBtnByContent = function(content) {
        return [].find.call(lettersContainer.children, elem => elem.textContent.trim() === content.trim())
    };

    const checkAnswer = function(answer, elem = null) {
        const btn = elem || findBtnByContent(answer);
        if (app.checkAnswer(answer)) {
            answerContainer.appendChild(btn);
            setTimeout(() => {  btn.classList.add("btn-success"); }, 100);
        } else {
            btn.classList.add("btn-danger");
            setTimeout(() => {  btn.classList.remove("btn-danger"); }, 250);
        }
    };

    app.on("task:changed", function() {
        const delay = isFirstTask ? 0 : 300;
        setTimeout(() => {
            if (!this.task) return;
            isFirstTask = false;
            let task = this.task.getContent();
            answerContainer.innerHTML = "";
            currentQuestionContainer.textContent = app.taskNumber.toString();
            task.data.question.forEach((item) => {
                const btn = document.createElement("BUTTON");
                btn.className = "btn btn-primary mr-2 js-letter";
                btn.textContent = item;
                lettersContainer.appendChild(btn);
            });
        }, delay);
    });

    app.on("completed", function() {
        setTimeout(() => alert("Game Over"), 100);
    });

    app.on("ready", function() {
        currentQuestionContainer.textContent = app.taskNumber.toString();
        totalQuestionsContainer.textContent = app.totalTasks.toString();

        document.body.addEventListener("keypress", function(e) {
            let letters = app.task.getContent();
            if (letters.data.question.includes(e.key.toLowerCase())) {
                checkAnswer(e.key.toLowerCase());
            }
        });

        window.onbeforeunload = function() {
            if (app.taskNumber > 1 && app.taskNumber < app.totalTasks) {
                app.save();
            }
        };

        lettersContainer.addEventListener("click", (ev) => {
            if (ev.target.classList.contains("js-letter")) {
                checkAnswer(ev.target.textContent, ev.target)
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

});
