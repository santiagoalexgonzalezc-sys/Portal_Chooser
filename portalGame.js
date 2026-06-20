class PortalSequenceGame {
    constructor() {
        this.step = 1;
        this.streak = 0;
        this.maxSteps = 10;

        this.correctIndex = 0;
        this.locked = false;
        this.active = true;

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
        if (!this.active) return;

        if (this.step > this.maxSteps) {
            this.finishGame();
            return;
        }

        this.locked = false;
        this.updateHUD();

        this.resultText.innerHTML = "";

        const portalCount = this.rand(3, 6);
        this.correctIndex = this.rand(0, portalCount - 1);

        this.renderPortals(portalCount);
    }

    renderPortals(count) {
        this.portalArea.innerHTML = "";

        for (let i = 0; i < count; i++) {
            const btn = document.createElement("button");
            btn.className = "portal fade";
            btn.innerText = `Portal ${i + 1}`;

            btn.onclick = () => this.choosePortal(i);

            this.portalArea.appendChild(btn);
        }
    }

    choosePortal(index) {
        if (this.locked || !this.active) return;

        this.locked = true;
        this.disableAll();

        if (index === this.correctIndex) {
            this.handleSuccess();
        } else {
            this.handleFail(index);
        }
    }

    disableAll() {
        document.querySelectorAll(".portal").forEach(p => p.disabled = true);
    }

    handleSuccess() {
        this.streak++;
        this.step++;

        this.resultText.innerHTML = "✅ Correct portal!";

        setTimeout(() => this.nextStep(), 600);
    }

    handleFail(index) {
        this.resultText.innerHTML = "❌ Wrong portal! Run failed.";

        // apply BEFORE reset (safe)
        this.applyRewards();

        this.endRun(false);
    }

    finishGame() {
        this.applyRewards();
        this.endRun(true);
    }

    endRun(completed) {
        this.active = false;
        this.locked = true;

        this.disableAll();

        this.resultText.innerHTML = completed
            ? this.getRewardText("🎉 Run Complete!")
            : this.getRewardText("💥 Run Failed!");

        // reset AFTER showing result (safe delay)
        setTimeout(() => {
            this.resetGame();
        }, 1500);
    }

    resetGame() {
        this.step = 1;
        this.streak = 0;
        this.active = true;
        this.locked = false;

        this.nextStep();
    }

    getRewardText(title) {
        return `
            ${title}<br><br>
            🪙 Ore: <b>${this.reward.ore}</b><br>
            ⭐ Rarity: <b>${this.reward.rarity}</b><br>
            🥚 Pet Egg Chance: <b>${this.reward.petEggChance ? "YES" : "NO"}</b>
        `;
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
