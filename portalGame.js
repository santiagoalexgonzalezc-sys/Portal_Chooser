class PortalSequenceGame {
    constructor() {
        this.step = 1;
        this.streak = 0;
        this.maxSteps = 10;

        this.correctIndex = 0;
        this.locked = false; // 🚫 prevents spam clicks

        this.reward = {
            ore: 0,
            rarity: "none",
            petEggChance: false
        };

        this.portalArea = document.getElementById("portalArea");
        this.stepText = document.getElementById("stepText");
        this.streakText = document.getElementById("streakText");
        this.resultText = document.getElementById("result");

        this.nextStep();
    }

    nextStep() {
        if (this.step > this.maxSteps) {
            this.finishGame();
            return;
        }

        this.locked = false;

        this.resultText.innerHTML = "";

        const portalCount = this.rand(3, 6);
        this.correctIndex = this.rand(0, portalCount - 1);

        this.renderPortals(portalCount);

        this.updateHUD();
    }

    renderPortals(count) {
        this.portalArea.innerHTML = "";

        for (let i = 0; i < count; i++) {
            const btn = document.createElement("button");
            btn.className = "portal fade";
            btn.innerText = `Portal ${i + 1}`;

            btn.onclick = () => this.choosePortal(i, btn);

            this.portalArea.appendChild(btn);
        }
    }

    choosePortal(index, btn) {
        if (this.locked) return; // 🚫 bug fix: prevents double clicks

        this.locked = true;

        this.disableAll();

        if (index === this.correctIndex) {
            btn.style.background = "linear-gradient(145deg, #00c853, #007e33)";
            this.handleSuccess();
        } else {
            btn.style.background = "linear-gradient(145deg, #d50000, #7f0000)";
            this.handleFail();
        }
    }

    disableAll() {
        document.querySelectorAll(".portal").forEach(p => p.disabled = true);
    }

    handleSuccess() {
        this.streak++;
        this.step++;

        this.resultText.innerHTML = "✅ Correct portal!";
        this.resultText.classList.add("fade");

        setTimeout(() => this.nextStep(), 700);
    }

    handleFail() {
        this.resultText.innerHTML = "❌ Wrong portal! Run failed.";

        this.applyRewards();
        this.resetGame();
    }

    resetGame() {
        this.step = 1;
        this.streak = 0;

        setTimeout(() => this.nextStep(), 1200);
    }

    finishGame() {
        this.applyRewards();

        this.resultText.innerHTML = `
            🎉 Run Complete!<br><br>
            🪙 Ore: <b>${this.reward.ore}</b><br>
            ⭐ Rarity: <b>${this.reward.rarity}</b><br>
            🥚 Pet Egg Chance: <b>${this.reward.petEggChance ? "YES" : "NO"}</b>
        `;

        this.step = 1;
        this.streak = 0;
    }

    applyRewards() {
        const s = this.streak;

        if (s <= 2) {
            this.reward.ore += 10;
            this.reward.rarity = "common";
        } 
        else if (s <= 5) {
            this.reward.ore += 25;
            this.reward.rarity = "uncommon";
        } 
        else if (s <= 8) {
            this.reward.ore += 50;
            this.reward.rarity = "rare";
        } 
        else {
            this.reward.ore += 100;
            this.reward.rarity = "epic+";
            this.reward.petEggChance = Math.random() < 0.3;
        }
    }

    updateHUD() {
        this.stepText.textContent = this.step;
        this.streakText.textContent = this.streak;
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// start
new PortalSequenceGame();
