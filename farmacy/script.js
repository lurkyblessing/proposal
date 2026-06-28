document.addEventListener('DOMContentLoaded', () => {
    // --- Slider Hero Logic ---
    const sliderHandle = document.getElementById('slider-handle');
    const naturePanel = document.getElementById('nature-panel');
    let isDragging = false;

    if (sliderHandle && naturePanel) {
        sliderHandle.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const container = sliderHandle.parentElement;
            const rect = container.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            let percentage = (x / rect.width) * 100;
            naturePanel.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        });
    }

    // --- Game Logic ---
    const farmGrid = document.getElementById('farm-grid');
    const inventoryEl = document.getElementById('inventory');
    const labSlot1 = document.getElementById('lab-slot-1');
    const labSlot2 = document.getElementById('lab-slot-2');
    const craftBtn = document.getElementById('craft-btn');
    const craftModal = document.getElementById('craft-modal');
    const closeModal = document.getElementById('close-modal');

    let inventory = {
        'moringa': 0,
        'papaya': 0
    };

    let labContents = [];

    // Initialize Farm Plots
    if (farmGrid) {
        const plots = 9;
        for (let i = 0; i < plots; i++) {
            const plot = document.createElement('div');
            plot.className = 'plot empty';
            plot.innerHTML = '<span class="seed-hint">Click to Plant</span>';
            plot.addEventListener('click', () => handlePlotClick(plot));
            farmGrid.appendChild(plot);
        }
    }

    function handlePlotClick(plot) {
        if (plot.classList.contains('empty')) {
            // Plant a seed
            plot.className = 'plot growing';
            plot.innerHTML = `
                <div class="progress-bar"><div class="progress-fill"></div></div>
                <span class="seed-icon">🌱</span>
            `;
            
            // Pick random plant type
            const type = Math.random() > 0.5 ? 'moringa' : 'papaya';
            
            // Grow over 3 seconds
            setTimeout(() => {
                plot.className = `plot grown ${type}`;
                plot.innerHTML = ''; 
                plot.dataset.type = type;
                plot.dataset.emoji = type === 'moringa' ? '🌿' : '🥭';
            }, 3000);
        } else if (plot.classList.contains('grown')) {
            // Harvest
            const type = plot.dataset.type;
            inventory[type]++;
            updateInventory();
            
            // Reset plot
            plot.className = 'plot empty';
            plot.innerHTML = '<span class="seed-hint">Click to Plant</span>';
            delete plot.dataset.type;
            delete plot.dataset.emoji;
        }
    }

    function updateInventory() {
        if(!inventoryEl) return;
        inventoryEl.innerHTML = '';
        
        // Add Moringa
        for (let i = 0; i < inventory['moringa']; i++) {
            const item = document.createElement('div');
            item.className = 'inventory-item';
            item.innerText = '🌿';
            item.title = "Moringa";
            item.addEventListener('click', () => addToLab('moringa', item));
            inventoryEl.appendChild(item);
        }
        
        // Add Papaya
        for (let i = 0; i < inventory['papaya']; i++) {
            const item = document.createElement('div');
            item.className = 'inventory-item';
            item.innerText = '🥭';
            item.title = "Papaya";
            item.addEventListener('click', () => addToLab('papaya', item));
            inventoryEl.appendChild(item);
        }
    }

    function addToLab(type, element) {
        if (labContents.length >= 2) return; // Lab full
        
        // We only need 1 of each for the recipe (Moringa + Papaya)
        if (labContents.includes(type)) return; 
        
        inventory[type]--;
        labContents.push(type);
        
        updateInventory();
        updateLab();
    }

    function updateLab() {
        if(!labSlot1 || !labSlot2) return;
        labSlot1.innerHTML = labContents[0] ? (labContents[0] === 'moringa' ? '🌿' : '🥭') : '';
        labSlot2.innerHTML = labContents[1] ? (labContents[1] === 'moringa' ? '🌿' : '🥭') : '';
        
        // If we have exactly one moringa and one papaya
        if (labContents.includes('moringa') && labContents.includes('papaya')) {
            craftBtn.disabled = false;
            craftBtn.classList.add('ready');
        } else {
            craftBtn.disabled = true;
            craftBtn.classList.remove('ready');
        }
    }

    if (craftBtn) {
        craftBtn.addEventListener('click', () => {
            // Craft!
            labContents = [];
            updateLab();
            craftModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            craftModal.style.display = 'none';
        });
    }
});
