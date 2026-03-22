document.addEventListener('DOMContentLoaded', () => {
    // --- Lotto Logic ---
    const numbersContainer = document.getElementById('numbers-container');
    const generateButton = document.getElementById('generate-button');
    
    const colors = [
        { color: '#ff4d4d', shadow: '#ff4d4d' }, { color: '#4dff4d', shadow: '#4dff4d' },
        { color: '#4d4dff', shadow: '#4d4dff' }, { color: '#ffff4d', shadow: '#ffff4d' },
        { color: '#ff4dff', shadow: '#ff4dff' }, { color: '#4dffff', shadow: '#4dffff' }
    ];

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
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
            ball.style.backgroundColor = color.color; // Solid color for balls in the new UI
            ball.style.boxShadow = `0 4px 10px rgba(0,0,0,0.2)`;
            ball.style.animationDelay = `${index * 0.1}s`;
            numbersContainer.appendChild(ball);
        });
    }

    if (generateButton) {
        generateButton.addEventListener('click', () => displayNumbers(generateLottoNumbers()));
        displayNumbers(generateLottoNumbers());
    }

    // --- Theme Logic ---
    const themeButton = document.getElementById('theme-button');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') body.setAttribute('data-theme', 'dark');

    if (themeButton) {
        themeButton.addEventListener('click', () => {
            if (body.hasAttribute('data-theme')) {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- Navigation Logic ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = ''; // Reset
            if (link.getAttribute('href').includes(current)) {
                link.style.color = 'var(--btn-color)';
            }
        });
    });

    // --- Animal Face Test Logic ---
    const URL = "https://teachablemachine.withgoogle.com/models/b9dt_EjLG/";
    let model, maxPredictions;

    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const predictButton = document.getElementById('predict-button');
    const resultContainer = document.getElementById('result-container');
    const resultMessage = document.getElementById('result-message');
    const labelsDiv = document.getElementById('label-container');
    const spinner = document.getElementById('loading-spinner');

    let uploadedImage = null;

    async function initModel() {
        if (model) return;
        spinner.style.display = 'block';
        try {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
        } catch (err) {
            console.error("Model loading failed:", err);
            alert("Failed to load AI model. Please try again later.");
        }
        spinner.style.display = 'none';
    }

    if (uploadArea) {
        uploadArea.addEventListener('click', () => imageInput.click());
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        imagePreview.innerHTML = '';
                        imagePreview.appendChild(img);
                        uploadedImage = img;
                        predictButton.style.display = 'block';
                        resultContainer.style.display = 'none';
                        predictButton.innerText = "ANALYZE FACE";
                    };
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (predictButton) {
        predictButton.addEventListener('click', async () => {
            if (!uploadedImage) return;
            predictButton.disabled = true;
            spinner.style.display = 'block';
            
            await initModel();
            if (model) {
                const prediction = await model.predict(uploadedImage);
                
                spinner.style.display = 'none';
                resultContainer.style.display = 'block';
                labelsDiv.innerHTML = '';

                prediction.sort((a, b) => b.probability - a.probability);
                const bestMatch = prediction[0];
                resultMessage.innerText = `You look like a ${bestMatch.className}!`;

                prediction.forEach(p => {
                    const row = document.createElement('div');
                    row.classList.add('label-row');
                    
                    const name = document.createElement('span');
                    name.classList.add('label-name');
                    name.style.width = '80px';
                    name.style.fontSize = '0.7rem';
                    name.innerText = p.className;
                    
                    const barContainer = document.createElement('div');
                    barContainer.classList.add('bar-container');
                    barContainer.style.flexGrow = '1';
                    
                    const bar = document.createElement('div');
                    bar.classList.add('bar');
                    
                    row.appendChild(name);
                    row.appendChild(barContainer);
                    barContainer.appendChild(bar);
                    labelsDiv.appendChild(row);
                    
                    setTimeout(() => {
                        bar.style.width = (p.probability * 100) + '%';
                    }, 100);
                });
            }
            
            predictButton.disabled = false;
            predictButton.innerText = "RE-ANALYZE";
        });
    }
});
