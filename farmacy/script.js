document.addEventListener('DOMContentLoaded', () => {
    // --- Blender Campaign Scrollytelling Logic ---
    const blenderCampaign = document.querySelector('.blender-campaign');
    if (blenderCampaign) {
        window.addEventListener('scroll', () => {
            const rect = blenderCampaign.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate progress (0 to 1) while the stage is sticky
            const scrollDistance = rect.height - windowHeight;
            let progress = -rect.top / scrollDistance;
            progress = Math.max(0, Math.min(1, progress));

            // Pitch Cards
            const cardConcept = document.getElementById('pitch-concept');
            const cardGoals = document.getElementById('pitch-goals');
            const cardSetup = document.getElementById('pitch-setup');

            // Visuals
            const moringa = document.getElementById('drop-moringa');
            const papaya = document.getElementById('drop-papaya');
            const sunflower = document.getElementById('drop-sunflower');
            const blenderMachine = document.getElementById('blender-machine');
            const blenderLiquid = document.getElementById('blender-liquid');
            const finalProduct = document.getElementById('final-product-jar');

            // Phase 1: Ingredients Drop (0 to 0.3)
            if (progress > 0.05 && progress <= 0.35) cardConcept.classList.add('active'); 
            else cardConcept.classList.remove('active');
            
            // Drop animation (transform translateY)
            let dropY = Math.min(1, progress / 0.25) * 250; // drops 250px
            moringa.style.transform = `translateY(${dropY}px)`;
            papaya.style.transform = `translateX(-50%) translateY(${Math.max(0, dropY - 20)}px)`;
            sunflower.style.transform = `translateX(-100%) translateY(${Math.max(0, dropY - 40)}px)`;
            moringa.style.opacity = progress > 0.01 && progress < 0.3 ? 1 : 0;
            papaya.style.opacity = progress > 0.05 && progress < 0.3 ? 1 : 0;
            sunflower.style.opacity = progress > 0.1 && progress < 0.3 ? 1 : 0;

            // Phase 2: Blending (0.3 to 0.6)
            if (progress > 0.35 && progress <= 0.65) cardGoals.classList.add('active'); 
            else cardGoals.classList.remove('active');
            
            if (progress >= 0.3 && progress < 0.6) {
                // Shake blender
                let shake = (Math.random() * 4 - 2) + "px";
                blenderMachine.style.transform = `translate(${shake}, ${shake})`;
                
                // Fill liquid
                let fill = ((progress - 0.3) / 0.3) * 100;
                blenderLiquid.style.height = `${fill}%`;
            } else {
                blenderMachine.style.transform = 'translate(0, 0)';
                if (progress < 0.3) blenderLiquid.style.height = '0%';
            }

            // Phase 3: The Reveal (0.6 to 1)
            if (progress > 0.65) cardSetup.classList.add('active'); 
            else cardSetup.classList.remove('active');

            if (progress >= 0.6) {
                blenderMachine.style.opacity = 0;
                finalProduct.style.opacity = 1;
                
                // Pop up animation
                let pop = Math.min(1, (progress - 0.6) / 0.2);
                finalProduct.style.transform = `scale(${0.5 + (0.5 * pop)}) translateY(${100 - (100 * pop)}px)`;
            } else {
                blenderMachine.style.opacity = 1;
                finalProduct.style.opacity = 0;
                finalProduct.style.transform = `scale(0.5) translateY(100px)`;
            }
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
       let isSwiping = false;

    // Track mouse state globally for swiping mechanics
    document.addEventListener('mousedown', () => isSwiping = true);
    document.addEventListener('mouseup', () => isSwiping = false);
    document.body.addEventListener('mouseleave', () => isSwiping = false);

    function animateFlyingCrop(plot, emoji) {
        // Create flying element
        const flying = document.createElement('div');
        flying.className = 'flying-crop';
        flying.textContent = emoji;
        document.body.appendChild(flying);
        
        // Get start coordinates (the plot)
        const plotRect = plot.getBoundingClientRect();
        flying.style.left = `${plotRect.left + plotRect.width/2 - 20}px`;
        flying.style.top = `${plotRect.top - 20}px`;
        
        // Force reflow
        flying.getBoundingClientRect();
        
        // Get target coordinates (the inventory panel)
        const inventoryEl = document.getElementById('inventory');
        const targetRect = inventoryEl.getBoundingClientRect();
        
        // Move to target
        flying.style.left = `${targetRect.left + targetRect.width/2}px`;
        flying.style.top = `${targetRect.top + targetRect.height/2}px`;
        flying.style.transform = 'scale(0.5)';
        flying.style.opacity = '0';
        
        // Cleanup after animation finishes
        setTimeout(() => {
            if (document.body.contains(flying)) {
                document.body.removeChild(flying);
            }
        }, 500);
    }

    function handlePlotInteraction(plot) {
        if (plot.classList.contains('empty')) {
            // Plant
            plot.className = 'plot growing';
            plot.innerHTML = `
                <span class="seed-hint">Growing...</span>
                <span class="seed-icon">🌱</span>
                <div class="progress-bar"><div class="progress-fill"></div></div>
            `;
            
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
            const emoji = plot.dataset.emoji;
            
            // Trigger visual feedback
            animateFlyingCrop(plot, emoji);
            
            inventory[type]++;
            updateInventory();
            
            // Reset plot
            plot.className = 'plot empty';
            plot.innerHTML = '';
            delete plot.dataset.type;
            delete plot.dataset.emoji;
        }
    }

    // Initialize farm grid
    for (let i = 0; i < 9; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot empty';
        plot.innerHTML = '';
        
        // Desktop mouse support
        plot.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent text selection while dragging
            handlePlotInteraction(plot);
        });
        
        plot.addEventListener('mouseenter', () => {
            plot.classList.add('hover-target');
            if (isSwiping) {
                handlePlotInteraction(plot);
            }
        });

        plot.addEventListener('mouseleave', () => {
            plot.classList.remove('hover-target');
        });
        
        farmGrid.appendChild(plot);
    }
    
    // Mobile Touch Support for swiping across plots
    farmGrid.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent page scrolling while swiping
        const touch = e.touches[0];
        // Find element under finger
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.closest('.plot')) {
            const plot = target.closest('.plot');
            plot.classList.add('hover-target');
            // If the plot hasn't been recently interacted with during this swipe
            if (!plot.dataset.swipeLocked) {
                handlePlotInteraction(plot);
                plot.dataset.swipeLocked = "true";
                // Unlock after swipe ends
                setTimeout(() => delete plot.dataset.swipeLocked, 500);
            }
        }
    }, { passive: false });
    
    farmGrid.addEventListener('touchend', () => {
        document.querySelectorAll('.plot').forEach(p => p.classList.remove('hover-target'));
    });
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

    const labOverlay = document.getElementById('overlay-lab');
    const labMenuModal = document.getElementById('lab-menu-modal');
    const closeLabBtn = document.getElementById('close-lab-btn');

    if (labOverlay) {
        labOverlay.addEventListener('click', () => {
            labMenuModal.style.display = 'flex';
        });
    }

    if (closeLabBtn) {
        closeLabBtn.addEventListener('click', () => {
            labMenuModal.style.display = 'none';
        });
    }

    if (craftBtn) {
        craftBtn.addEventListener('click', () => {
            // Craft!
            labContents = [];
            updateLab();
            labMenuModal.style.display = 'none';
            craftModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            craftModal.style.display = 'none';
        });
    }
});
