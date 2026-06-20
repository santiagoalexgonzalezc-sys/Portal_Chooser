class PortalSequenceGame {
    constructor() {
        this.step = 1;
        this.streak = 0;
        this.maxSteps = 10;

        this.locked = false;
        this.active = true;

        this.portalCount = 0;
        this.correctIndex = 0;

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

        this.portalCount = this.rand(3, 6);
        this.correctIndex = this.rand(0, this.portalCount - 1);

        this.renderPortals();
        this.updateHUD();

        this.resultText.innerHTML = "";
    }

    renderPortals() {
        this.portalArea.innerHTML = "";

        for (let i = 0; i < this.portalCount; i++) {
            const btn = document.createElement("button");
            btn.className = "portal";
            btn.innerText = `Portal ${i + 1}`;

            btn.onclick = () => this.choosePortal(i);

            this.portalArea.appendChild(btn);
        }
    }

    choosePortal(index) {
        if (this.locked || !this.active) return;

        this.locked = true;
        this.disableAll();

        const buttons = document.querySelectorAll(".portal");

        if (index === this.correctIndex) {
            buttons[index].classList.add("correct");
            this.handleSuccess();
        } else {
            buttons[index].classList.add("wrong");
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

        setTimeout(() => this.nextStep(), 500);
    }

    handleFail() {
        this.resultText.innerHTML = "❌ Wrong portal! Run failed.";

        this.shakeScreen();

        this.applyRewards();
        this.endRun(false);
    }

    endRun(completed) {
        this.active = false;
        this.locked = true;

        this.disableAll();
        this.updateHUD();

        this.resultText.innerHTML = completed
            ? this.rewardText("🎉 Run Complete!")
            : this.rewardText("💥 Run Failed!");

        setTimeout(() => this.resetGame(), 1200);
    }

    finishGame() {
        this.applyRewards();
        this.endRun(true);
    }

    resetGame() {
        this.step = 1;
        this.streak = 0;
        this.active = true;
        this.locked = false;

        this.nextStep();
    }

    rewardText(title) {
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

    shakeScreen() {
        document.body.classList.add("shake");

        setTimeout(() => {
            document.body.classList.remove("shake");
        }, 350);
    }

    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// start
new PortalSequenceGame();
