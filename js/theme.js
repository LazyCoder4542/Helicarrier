// when toggle button is clicked
document.querySelector('.toggle-theme').addEventListener('click', function() {
var currentTheme = document.documentElement.dataset.theme || 'dark';
var newTheme = currentTheme === 'light' ? 'dark' : 'light';
document.documentElement.dataset.theme = newTheme;
localStorage.setItem('theme', newTheme);
})

// if the user has a default theme
if (window.matchMedia) {
    var match = window.matchMedia('(prefers-color-scheme: dark)')

    match.addEventListener('change', e => {
        toggleDarkMode(match.matches);
    })

    function toggleDarkMode(state) {
        if (match.matches) {
            document.documentElement.dataset.theme = 'dark';
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.documentElement.dataset.theme = 'light';
            localStorage.setItem('theme', 'light');
        }
    }
}

// if the user already chose a theme for the page
// this will make the selected theme remain, even after reloading the page
var savedTheme = localStorage.getItem('theme');
console.log(savedTheme)
if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
    localStorage.setItem('theme', savedTheme);
}
else {toggleDarkMode(match.matches);}
console.log(savedTheme)