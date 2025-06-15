const openBtn = document.getElementById("openModel")
const closeBtn = document.getElementById("closeModel")
const model = document.getElementById("model")

openBtn.addEventListener("click", () => {
    model.classList.add("open");
})

closeBtn.addEventListener("click", () => {
    model.classList.remove("open");
})