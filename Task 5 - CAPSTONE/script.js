// Optimized Capstone State & Storage Management
const capstoneInput = document.getElementById('capstoneInput');
const addCapstoneBtn = document.getElementById('addCapstoneBtn');
const capstoneList = document.getElementById('capstoneList');

let goals = JSON.parse(localStorage.getItem('capstone_goals')) || [];

function renderGoals() {
    capstoneList.innerHTML = '';
    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.textContent = goal;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Remove';
        deleteBtn.addEventListener('click', () => {
            goals.splice(index, 1);
            localStorage.setItem('capstone_goals', JSON.stringify(goals));
            renderGoals();
        });

        li.appendChild(deleteBtn);
        capstoneList.appendChild(li);
    });
}

addCapstoneBtn.addEventListener('click', () => {
    const text = capstoneInput.value.trim();
    if (text === '') return;
    goals.push(text);
    localStorage.setItem('capstone_goals', JSON.stringify(goals));
    capstoneInput.value = '';
    renderGoals();
});

renderGoals();