const elem = ['.hero', 'h2', '.card', '.text'];
elem.forEach(element => {
    let subElements = document.querySelectorAll(element, 'h3');
    subElements.forEach(element => {
        if (element.classList.contains('hero')) {
            element.classList.add("fade")
        }
        else if (element.classList.contains('card') || element.classList.contains('text')) {
            element.classList.add("slideUp")
        }
        else if (element.tagName == 'H2') {
            element.classList.add("slideRight")
        }
        element.classList.add('animate');
    });
});
const obj = document.querySelectorAll('.animate');
obj.forEach(element => {
    element.style.opacity = '0'
    if (element.classList.contains('fade')) {}
});
function scrollAnimation() {
    var H = window.innerHeight;
    obj.forEach(element => {
        var y = element.getBoundingClientRect().y
        if (y < H) {
            element.style.animationName = element.classList[element.classList.length - 2]
        }
        /*else if (y > H) {
            element.style.animationName = null
        }*/
    });
}
window.addEventListener('scroll', scrollAnimation)
scrollAnimation()
