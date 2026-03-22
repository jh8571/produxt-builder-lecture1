document.addEventListener('DOMContentLoaded', () => {
    // --- Lotto Logic ---
    const numbersContainer = document.getElementById('numbers-container');
    const generateButton = document.getElementById('generate-button');
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayNumbers(numbers) {
        if (!numbersContainer) return;
        numbersContainer.innerHTML = '';
        numbers.forEach((number, index) => {
            const ball = document.createElement('div');
            ball.classList.add('number-ball');
            ball.textContent = number;
            ball.style.backgroundColor = colors[index % colors.length];
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
            const isDark = body.hasAttribute('data-theme');
            if (isDark) {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- Navigation Highlights ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.style.color = 'var(--accent-color)';
            } else {
                link.style.color = '';
            }
        });
    });

    // --- Animal Face Test Logic ---
    const TM_URL = "https://teachablemachine.withgoogle.com/models/b9dt_EjLG/";
    let tmModel;

    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const predictButton = document.getElementById('predict-button');
    const resultContainer = document.getElementById('result-container');
    const resultMessage = document.getElementById('result-message');
    const labelsDiv = document.getElementById('label-container');
    const spinner = document.getElementById('loading-spinner');

    let uploadedImage = null;

    async function initTMModel() {
        if (tmModel) return;
        spinner.style.display = 'block';
        try {
            tmModel = await tmImage.load(TM_URL + "model.json", TM_URL + "metadata.json");
        } catch (err) { console.error(err); }
        spinner.style.display = 'none';
    }

    if (uploadArea) uploadArea.addEventListener('click', () => imageInput.click());
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
            await initTMModel();
            if (tmModel) {
                const prediction = await tmModel.predict(uploadedImage);
                resultContainer.style.display = 'block';
                labelsDiv.innerHTML = '';
                prediction.sort((a, b) => b.probability - a.probability);
                resultMessage.innerText = `You look like a ${prediction[0].className}!`;
                prediction.forEach(p => {
                    const row = document.createElement('div');
                    row.classList.add('label-row');
                    row.innerHTML = `<span class="label-name" style="width:80px; font-size:0.7rem;">${p.className}</span>
                                     <div class="bar-container" style="flex-grow:1;"><div class="bar" style="width:${p.probability*100}%"></div></div>`;
                    labelsDiv.appendChild(row);
                });
            }
            predictButton.disabled = false;
        });
    }

    // --- Lifestyle Tools Logic ---
    const foodData = {
        happy: [ { name: "Colorful Poke Bowl", desc: "Fresh fish and vibrant veggies for a bright day." }, { name: "Salmon Pasta", desc: "Healthy fats to keep the energy high." } ],
        stressed: [ { name: "Spicy Volcano Ramen", desc: "Sweat out the stress with intense flavor." }, { name: "Dark Chocolate Fondue", desc: "Magnesium and joy in every bite." } ],
        tired: [ { name: "Chicken Ginseng Soup", desc: "Traditional restoration for a weary body." }, { name: "Beef Bone Broth", desc: "Slow-cooked comfort for deep recovery." } ],
        excited: [ { name: "Taco Feast", desc: "Spices and variety for an adventurous spirit." }, { name: "Fusion Dim Sum", desc: "Unexpected delights for an exciting day." } ]
    };

    const pickFoodBtn = document.getElementById('pick-food-button');
    const foodResult = document.getElementById('food-result');
    const foodName = document.getElementById('food-name');
    const foodDesc = document.getElementById('food-desc');

    if (pickFoodBtn) {
        pickFoodBtn.addEventListener('click', () => {
            const mood = document.getElementById('food-mood').value;
            const options = foodData[mood];
            const pick = options[Math.floor(Math.random() * options.length)];
            foodName.innerText = pick.name;
            foodDesc.innerText = pick.desc;
            foodResult.style.display = 'block';
        });
    }

    const supplementData = {
        energy: [ { name: "Vitamin B-Complex", info: "Supports metabolism and energy levels." }, { name: "CoQ10", info: "Essential for heart and cellular energy." } ],
        sleep: [ { name: "Magnesium Glycinate", info: "Calms the nervous system for deep rest." }, { name: "L-Theanine", info: "Promotes relaxation without drowsiness." } ],
        skin: [ { name: "Marine Collagen", info: "Supports elasticity and hydration." }, { name: "Vitamin C", info: "Brightens skin and supports repair." } ],
        immunity: [ { name: "Zinc Picolinate", info: "Crucial for immune cell function." }, { name: "Elderberry", info: "Packed with antioxidants for protection." } ]
    };

    const goalBtns = document.querySelectorAll('.goal-btn');
    const supplementResult = document.getElementById('supplement-result');
    const supplementList = document.getElementById('supplement-list');

    if (goalBtns) {
        goalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                goalBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const goal = btn.getAttribute('data-goal');
                const sups = supplementData[goal];
                supplementList.innerHTML = '';
                sups.forEach(s => {
                    const item = document.createElement('div');
                    item.classList.add('tool-result');
                    item.style.marginBottom = '0.5rem';
                    item.innerHTML = `<h5 style="margin:0;color:var(--accent-color);">${s.name}</h5><p style="margin:0;font-size:0.8rem;">${s.info}</p>`;
                    supplementList.appendChild(item);
                });
                supplementResult.style.display = 'block';
            });
        });
    }
});
