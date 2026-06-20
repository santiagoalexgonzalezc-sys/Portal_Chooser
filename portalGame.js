class PortalSequenceGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        this.step = 1;
        this.streak = 0;
        this.maxSteps = 10;

        this.portals = [];
        this.correctIndex = 0;

        this.reward = {
            ore: 0,
            rarity: "none",
            petEggChance: false
        };

        this.initUI();
        this.nextStep();
    }

    initUI() {
        this.container.innerHTML = `
            <div id="portalHUD">
                <h2>🌀 Portal Challenge</h2>
                <p>Step: <span id="stepText"></span></p>
                <p>Streak: <span id="streakText"></span></p>
            </div>
            <div id="portalArea"></div>
            <div id="result"></div>
        `;

        this.portalArea = this.container.querySelector("#portalArea");
        this.stepText = this.container.querySelector("#stepText");
        this.streakText = this.container.querySelector("#streakText");
        this.resultText = this.container.querySelector("#result");
    }

    nextStep() {
        if (this.step > this.maxSteps) {
            this.finishGame();
            return;
        }

        this.resultText.innerHTML = "";

        const portalCount = this.rand(3, 6);
        this.correctIndex = this.rand(0, portalCount - 1);

        this.renderPortals(portalCount);

        this.stepText.textContent = this.step;
        this.streakText.textContent = this.streak;
    }

    renderPortals(count) {
        this.portalArea.innerHTML = "";
        this.portals = [];

        for (let i = 0; i < count; i++) {
            const portal = document.createElement("button");
            portal.className = "portal";
            portal.innerText = `Portal ${i + 1}`;

            portal.onclick = () => this.choosePortal(i);

            this.portalArea.appendChild(portal);
            this.portals.push(portal);
        }
    }

    choosePortal(index) {
        if (index === this.correctIndex) {
            this.handleSuccess();
        } else {
            this.handleFail();
        }
    }

    handleSuccess() {
        this.streak++;
        this.step++;

        this.resultText.innerHTML = "✅ Correct portal! Moving forward...";

        setTimeout(() => this.nextStep(), 800);
    }

    handleFail() {
        this.resultText.innerHTML = "❌ Wrong portal! Streak reset.";

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
            🎉 Completed Portal Run!<br>
            🪙 Ore: ${this.reward.ore}<br>
            ⭐ Rarity: ${this.reward.rarity}<br>
            🥚 Pet Egg Chance: ${this.reward.petEggChance ? "YES" : "NO"}
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

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
