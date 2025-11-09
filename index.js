const button = document.getElementById("myRange");

button.addEventListener("change", doSomething);

function doSomething(){
    if(this.value === this.max){
    alert("hello")}
}
