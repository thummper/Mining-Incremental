//Define inc globally
let inc;
window.addEventListener('load', function () {

	console.log("Main loaded");
	//Initialise..
	inc = new Incremental();
	//Function here to check and load data?
	inc.start();

});
//Tab functions
function openTab(tab) {
	let tabsHolder = tab.parentNode;
	let tabContent = document.getElementsByClassName("tab-content")[0];
	for (let i = 0, j = tabsHolder.children.length; i < j; i++) {
		let tb = tabsHolder.children[i];
		if (tb == tab) {
			//Make this one visible.
			for (let k = 0, l = tabContent.children.length; k < l; k++) {
				let tabc = tabContent.children[k];
				if (k != i) {
					//Make invisible
					tabc.classList.add('tab-hidden');
				} else {
					tabc.classList.remove('tab-hidden');
				}
			}
		}
	}
}





class Incremental {

	constructor() {
		this.money_canvas = new MoneyCanvas();
		this.prospect_canvas = new ProspectCanvas();
		//Game stuff 
		this.loop;
		this.money = 10000;
		//Prospectors
		this.prospectButtons = [];
		this.prospectorsCount = [0, 0, 0];
		this.prospectorsCost = [3000, 25000, 1000000];
		this.prospectorsEff = [0.35, 0.80, 1.6];
		this.prospectorsCoeff = [300, 490, 800];
		this.prospectAmount = 0;
		this.prospectUpgrades = [];
		//Ore 
		this.oreReserves = [0, 0, 0, 0];
		this.unrefOre = [0, 0, 0, 0];
		this.refOre = [0, 0, 0, 0];
		//Start by updating
		this.updater = new Updater(this);
	}

	start() {
		//Start
		//Set up event listeners 
		this.prospectButtons = document.getElementsByClassName('prospector');
		this.makeUpgrades();
		this.addEvents();
		this.updater.update();
		this.loop = window.setInterval(this.incLoop.bind(this), 1000);
	}

	makeUpgrades() {
		while(this.prospectUpgrades.length < 3){
			let pup = new ProspectUpgrade(this);
			pup = pup.initUpgrade();
			this.prospectUpgrades.push(pup);
		}
	}
	
	closeProspUpgrade(event){
		let upgrade = event.currentTarget;
		let mainUpgrade = upgrade.parentNode;
		let number = mainUpgrade.dataset.upgn;
		this.prospectUpgrades.splice(number, 1);
		mainUpgrade.parentNode.removeChild(mainUpgrade);
		this.makeUpgrades();
		
		
	}

	prospupgradeClick(event) {
		let button = event.currentTarget;
		let parent = button.parentElement;
		let number = button.dataset.upgn;
		this.prospbuyUpgrade(number, parent, button);
	}

	prospbuyUpgrade(number, parent, button) {
		let upgrade = this.prospectUpgrades[number];
		let cost = upgrade.cost;
		if (this.money >= cost) {
			button.parentNode.removeChild(button);
			this.prospectUpgrades.splice(number, 1);
			this.money -= cost;
			let effects = upgrade.upgrade.effects;
			for (let i = 0; i < effects.length; i++) {
				let effect = effects[i];
				let upValue = effect.array[effect.type];
				let action = effect.action;
				let coeff = effect.value;
				if (action == 'mult') {
					if (coeff.length == 1) {
						effect.array[effect.type] += coeff[0] * upValue;

					} else {
						let min = coeff[0];
						let max = coeff[1];
						let rng = getRandomInc(min, max);
						effect.array[effect.type] += coeff[0] * upValue;
					}
				}
			}
			this.makeUpgrades();
		}
	}

	addEvents() {
		//Get elements in start, make the events here.
		for (let i = 0, j = this.prospectButtons.length; i < j; i++) {
			let button = this.prospectButtons[i];
			button.addEventListener('click', this.prospectClick.bind(this));
		}

	}

	prospectClick(event) {
		//Figure out which button was clicked and buy one.
		let button = event.currentTarget;
		for (let i = 0; i < this.prospectButtons.length; i++) {
			let testButton = this.prospectButtons[i];
			if (button == testButton) {
				this.prospectBuy(i);
				return;
			}
		}
	}

	prospectBuy(number) {
		let cost = this.prospectorsCost[number];
		if (this.money >= cost) {
			this.money -= cost;
			this.prospectorsCount[number]++;
			let costAdd = Math.log(this.prospectorsCount[number] + 1) * this.prospectorsCoeff[number];
			this.prospectorsCost[number] += costAdd;
		}
		this.updater.update();
	}

	incLoop() {
		this.money += this.money_canvas.moneyGen;
		this.prospect();
		this.money_canvas.moneyGen = 0;
		this.updater.update();
	}

	prospect() {
		this.prospectAmount = 0;
		for (let i = 0; i < this.prospectorsCount.length; i++) {
			this.prospectAmount += (this.prospectorsCount[i] * this.prospectorsEff[i]);
		}
		this.updater.update();
		this.prospect_canvas.prospect(this.prospectAmount);
		let oreFound = this.prospect_canvas.oreFound;
		for (let i = 0; i < oreFound.length; i++) {
			this.oreReserves[i] += oreFound[i];
		}
		oreFound = [0, 0, 0, 0];
	}

}
