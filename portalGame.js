class PortalSequenceGame {
    constructor() {
        this.step = 1;
        this.streak = 0;
        this.maxSteps = 10;

        this.locked = false;
        this.active = true;

        this.portalCount = 0;
        this.correctIndex = 0;
        this.rule = "even";

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

    // 🎮 STEP
    nextStep() {
        if (!this.active) return;

        if (this.step > this.maxSteps) {
            this.finishGame();
            return;
        }

        this.locked = false;

        this.portalCount = this.rand(3, 6);
        this.rule = this.pickRule();

        this.correctIndex = this.computeCorrectIndex();

        this.renderPortals();
        this.updateHUD(); // FIX: always sync UI
    }

    // 🎲 RULES (kept simple but safe)
    pickRule() {
        const rules = ["even", "odd", "lowest", "highest", "random"];
        return rules[this.rand(0, rules.length - 1)];
    }

    computeCorrectIndex() {
        const max = this.portalCount - 1;

        switch (this.rule) {

            case "even":
                return this.rand(0, Math.floor(max / 2)) * 2;

            case "odd":
                return this.rand(0, Math.floor(max / 2)) * 2 + 1;

            case "lowest":
                return 0;

            case "highest":
                return max;

            case "random":
                return this.rand(0, max); // FIX: fallback safe rule
        }

        return 0;
    }

    // 🎨 UI
    renderPortals() {
        this.portalArea.innerHTML = "";

        for (let i = 0; i < this.portalCount; i++) {
            const btn = document.createElement("button");
            btn.className = "portal fade";
            btn.innerText = `Portal ${i + 1}`;

            btn.onclick = () => this.choosePortal(i);

            this.portalArea.appendChild(btn);
        }
    }

    // 🎯 INPUT
    choosePortal(index) {
        if (this.locked || !this.active) return;

        this.locked = true;
        this.disableAll();

        if (index === this.correctIndex) {
            this.handleSuccess();
        } else {
            this.handleFail();
        }
    }

    disableAll() {
        document.querySelectorAll(".portal").forEach(p => p.disabled = true);
    }

    // ✅ SUCCESS
    handleSuccess() {
        this.streak++;
        this.step++;

        this.resultText.innerHTML = "✅ Correct portal!";

        setTimeout(() => this.nextStep(), 500);
    }

    // ❌ FAIL
    handleFail() {
        this.resultText.innerHTML = "❌ Wrong portal! Run failed.";

        this.applyRewards();

        this.endRun(false);
    }

    // 🏁 END RUN (FIXED SAFE FLOW)
    endRun(completed) {
        this.active = false;
        this.locked = true;

        this.disableAll();
        this.updateHUD(); // FIX: force sync

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

        this.resultText.innerHTML = "";

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

    // 💰 REWARDS (safe order)
    applyRewards() {
        const s = this.streak; // FIX: snapshot first

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

    // 📊 HUD
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
