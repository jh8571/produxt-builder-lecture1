document.addEventListener('DOMContentLoaded', () => {
    // --- Lotto Logic ---
    const numbersContainer = document.getElementById('numbers-container');
    const generateButton = document.getElementById('generate-button');
    
    const lottoColors = [
        { color: '#ff4d4d' }, { color: '#4dff4d' },
        { color: '#4d4dff' }, { color: '#ffff4d' },
        { color: '#ff4dff' }, { color: '#4dffff' }
    ];

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
            const color = lottoColors[index % lottoColors.length];
            ball.style.borderColor = color.color;
            ball.style.backgroundColor = color.color;
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
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href').includes(current)) {
                link.style.color = 'var(--btn-color)';
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
                    row.innerHTML = `<span class="label-name" style="width:70px; font-size:0.6rem;">${p.className}</span>
                                     <div class="bar-container" style="flex-grow:1;"><div class="bar" style="width:${p.probability*100}%"></div></div>`;
                    labelsDiv.appendChild(row);
                });
            }
            predictButton.disabled = false;
        });
    }

    // --- Smart Food Picker Logic ---
    const foodData = {
        happy: [
            { name: "Colorful Poke Bowl", desc: "Fresh fish and vibrant veggies to match your bright mood!" },
            { name: "Grilled Salmon Pasta", desc: "Elegant and delicious for a celebratory day." }
        ],
        stressed: [
            { name: "Extra Spicy Ramen", desc: "Sweat out the stress with some serious heat." },
            { name: "Cheesy Deep Dish Pizza", desc: "Sometimes comfort comes in layers of cheese." }
        ],
        tired: [
            { name: "Warm Chicken Soup", desc: "A hug in a bowl to recharge your energy." },
            { name: "Beef Pho", desc: "Light yet satisfying broth to soothe your soul." }
        ],
        excited: [
            { name: "Taco Party Platter", desc: "Fun, messy, and perfect for an adventurous spirit." },
            { name: "Fusion Sushi Rolls", desc: "Unexpected flavors for an exciting day." }
        ]
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
            foodResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // --- Gourmet Recipe Finder Logic ---
    const recipes = [
        { name: "Creamy Mushroom Risotto", time: "40m", diff: "Medium", ingredients: ["Arborio Rice", "Mushrooms", "Parmesan", "Broth"] },
        { name: "Honey Garlic Glazed Chicken", time: "25m", diff: "Easy", ingredients: ["Chicken Thighs", "Honey", "Garlic", "Soy Sauce"] },
        { name: "Classic Italian Bruschetta", time: "15m", diff: "Easy", ingredients: ["Baguette", "Tomatoes", "Basil", "Olive Oil"] }
    ];

    const recipeList = document.getElementById('recipe-list');
    if (recipeList) {
        recipes.forEach(r => {
            const card = document.createElement('div');
            card.classList.add('recipe-card');
            card.innerHTML = `
                <h4>${r.name}</h4>
                <div class="meta">⏱ ${r.time} | ⚖ ${r.diff}</div>
                <ul>${r.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            `;
            recipeList.appendChild(card);
        });
    }

    // --- AI Nutrition Guide Logic ---
    const supplementData = {
        energy: [
            { name: "Vitamin B-Complex", info: "Converts food into fuel and supports brain function." },
            { name: "CoQ10", info: "Essential for cellular energy production." }
        ],
        sleep: [
            { name: "Magnesium Glycinate", info: "Promotes relaxation and improves sleep quality." },
            { name: "L-Theanine", info: "Reduces stress and supports a calm mind." }
        ],
        skin: [
            { name: "Collagen Peptides", info: "Supports skin elasticity and hydration." },
            { name: "Vitamin C", info: "Vital for collagen synthesis and bright skin." }
        ],
        immunity: [
            { name: "Zinc", info: "Crucial for immune cell development and function." },
            { name: "Vitamin D3", info: "Helps regulate the immune system effectively." }
        ]
    };

    const goalItems = document.querySelectorAll('.goal-item');
    const supplementResult = document.getElementById('supplement-result');
    const supplementList = document.getElementById('supplement-list');

    if (goalItems) {
        goalItems.forEach(item => {
            item.addEventListener('click', () => {
                goalItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const goal = item.getAttribute('data-goal');
                const sups = supplementData[goal];
                supplementList.innerHTML = '';
                sups.forEach(s => {
                    const sItem = document.createElement('div');
                    sItem.classList.add('supplement-item');
                    sItem.innerHTML = `<h4>${s.name}</h4><p>${s.info}</p>`;
                    supplementList.appendChild(sItem);
                });
                supplementResult.style.display = 'block';
                supplementResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }
});
