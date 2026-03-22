document.addEventListener('DOMContentLoaded', () => {
    const numbersContainer = document.getElementById('numbers-container');
    const generateButton = document.getElementById('generate-button');
    const themeButton = document.getElementById('theme-button');
    const body = document.body;

    // Theme logic
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    }

    themeButton.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    const colors = [
        { color: '#ff4d4d', shadow: '#ff4d4d' }, // Red
        { color: '#4dff4d', shadow: '#4dff4d' }, // Green
        { color: '#4d4dff', shadow: '#4d4dff' }, // Blue
        { color: '#ffff4d', shadow: '#ffff4d' }, // Yellow
        { color: '#ff4dff', shadow: '#ff4dff' }, // Magenta
        { color: '#4dffff', shadow: '#4dffff' }  // Cyan
    ];

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayNumbers(numbers) {
        numbersContainer.innerHTML = '';
        numbers.forEach((number, index) => {
            const ball = document.createElement('div');
            ball.classList.add('number-ball');
            ball.textContent = number;

            const color = colors[index % colors.length];
            ball.style.borderColor = color.color;
            ball.style.boxShadow = `0 0 10px ${color.shadow}, inset 0 0 5px ${color.shadow}`;
            ball.style.textShadow = `0 0 5px ${color.shadow}`;

            // Staggered animation delay
            ball.style.animationDelay = `${index * 0.2}s`;

            numbersContainer.appendChild(ball);
        });
    }

    generateButton.addEventListener('click', () => {
        const lottoNumbers = generateLottoNumbers();
        displayNumbers(lottoNumbers);
    });

    // Initial generation
    displayNumbers(generateLottoNumbers());
});
