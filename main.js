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
		this.clock = 0;
		this.loop;
		this.money = 100000;
		this.moneyChange = [0];

		//Prospectors
		this.prospectButtons = [];
		this.prospectorsCount = [1, 0, 0];
		this.prospectorsCost = [3000, 25000, 1000000];
		this.prospectorsEff = [0.35, 0.80, 1.6];
		this.prospectorsCoeff = [300, 490, 800];
		this.prospectAmount = 0;
		this.prospectUpgrades = [];

		//Mining Equipment
		this.miningButton;
		this.miningCount = 1;
		this.miningCost = 500;
		this.miningEff = 1;
		this.miningCoeff = 100;

		//Smelting
		this.smeltSlots = 1;
		this.smeltingButtons = [];
		this.smeltingCount = [1, 0, 0];
		this.smeltingCost = [6000, 60000, 1000000];
		this.smeltingEff = [1, 10, 100];
		this.smeltAmount = 1;
		this.smeltingCoeff = [300, 490, 800];

		//Logistics
		this.logisticSlots = 0;
		this.logisticsButtons = [];
		this.logisticsCount = [0, 0, 0];
		this.logisticsCost = [100, 15000, 50000];
		this.logisticsEff = [1, 10, 100];
		this.logisticsCoeff = [300, 500, 800];
		this.logisticsVals = [0, 0, 0];
		this.sellAmount = 0.3;

		//Ore 
		this.oreResChange = [[0], [0], [0], [0]];
		this.oreReserves = [0, 0, 0, 0];
		this.unrefOreChange = [[0], [0], [0], [0]];
		this.unrefOre = [0, 0, 0, 0];
		this.refOreChange = [[0], [0], [0], [0]];
		this.refOre = [0, 0, 0, 0];

		//Economy Stuff
		this.ingotPrices = [500, 700, 1000, 3000];
		this.ingotsSold = [0, 0, 0, 0];
		this.ingotDemands = [10000, 12000, 13000, 14000];
		this.ingotPriceFactors = [1, 1, 1, 1];
		this.ingotPriceChange = [0, 0, 0, 0];

		//Start by updating
		this.updater = new Updater(this);
		//Sliders
		this.miningVals = [0, 0, 0, 0];
		this.smeltVals = [0, 0, 0, 0];

		this.pSliderContainer = document.getElementById('mining-sliders');
		this.pSliderLabels = this.pSliderContainer.getElementsByTagName('label');
		this.pSliders = this.pSliderContainer.getElementsByTagName('input');

		this.sSliderContainer = document.getElementById('smelters-sliders');
		this.sSliderLabels = this.sSliderContainer.getElementsByTagName('label');
		this.sSliders = this.sSliderContainer.getElementsByTagName('input');

		this.logSliderContainer = document.getElementById('logistics-sliders');
		this.logSliderLabels = this.logSliderContainer.getElementsByTagName('label');
		this.logSliders = this.logSliderContainer.getElementsByTagName('input');

		this.setupSliders();
	}

	setupSliders() {
		for (let i = 0, j = this.pSliders.length; i < j; i++) {
			let slider = this.pSliders[i];
			slider.oninput = function (e) {
				this.updatePSliders();
			}.bind(this);
		}
		for (let i = 0, j = this.sSliders.length; i < j; i++) {
			let slider = this.sSliders[i];
			slider.oninput = function (e) {
				this.updateSSliders();
			}.bind(this);
		}
		for (let i = 0, j = this.logSliders.length; i < j; i++) {
			let slider = this.logSliders[i];
			slider.oninput = function (e) {
				this.updateLogSliders();
			}.bind(this);
		}
		this.updateLogSliders();
		this.updatePSliders();
		this.updateSSliders();
	}

	updateLogSliders() {
		let maxsliders = this.logisticSlots;
		let currentUsed = 0;
		for (let i = 0; i < this.logSliders.length; i++) {
			let slider = this.logSliders[i];
			let val = parseInt(slider.value);
			currentUsed += val;
		}
		let slidersLeft = maxsliders - currentUsed;
		for (let i = 0; i < this.logSliders.length; i++) {
			let slider = this.logSliders[i];
			slider.max = slidersLeft + parseInt(slider.value);
			let lbs = this.logSliderLabels[i].getElementsByTagName('span');
			lbs[0].innerHTML = slider.value;
			lbs[1].innerHTML = slider.max;
			this.logisticsVals[i] = parseInt(slider.value);
		}
	}


	updateSSliders() {
		let maxsliders = this.smeltSlots;
		let currentUsed = 0;
		for (let i = 0, j = this.sSliders.length; i < j; i++) {
			let slider = this.sSliders[i];
			let val = parseInt(slider.value);
			currentUsed += val;
		}
		let slidersLeft = maxsliders - currentUsed;
		for (let i = 0, j = this.sSliders.length; i < j; i++) {
			let slider = this.sSliders[i];
			slider.max = slidersLeft + parseInt(slider.value);
			let lbls = this.sSliderLabels[i].getElementsByTagName('span');
			lbls[0].innerHTML = slider.value;
			this.smeltVals[i] = parseInt(slider.value);
			lbls[1].innerHTML = slider.max;
		}

	}

	updatePSliders() {
		//Set max of all sliders.
		let maxsliders = this.miningCount;
		let currentUsed = 0;
		//Work out the current used slots of input.
		for (let i = 0, j = this.pSliders.length; i < j; i++) {
			let slider = this.pSliders[i];
			let val = parseInt(slider.value);
			currentUsed += val;
		}

		let slidersLeft = maxsliders - currentUsed;
		//Set slider max
		for (let i = 0, j = this.pSliders.length; i < j; i++) {
			let slider = this.pSliders[i];
			slider.max = slidersLeft + parseInt(slider.value);
			let lbls = this.pSliderLabels[i].getElementsByTagName('span');
			lbls[0].innerHTML = slider.value;
			this.miningVals[i] = parseInt(slider.value);
			lbls[1].innerHTML = slider.max;
		}
	}


	start() {
		//Start
		//Set up event listeners 
		this.miningButton = document.getElementById('mineButton');
		this.prospectButtons = document.getElementsByClassName('prospect-buttons')[0].children;
		this.smeltingButtons = document.getElementsByClassName('process-buttons')[0].children;
		this.logisticsButtons = document.getElementsByClassName('logistics-buttons')[0].children;
		this.makeUpgrades();
		this.addEvents();
		this.updater.update();
		this.loop = window.setInterval(this.incLoop.bind(this), 1000);
	}

	makeUpgrades() {
		while (this.prospectUpgrades.length < 3) {
			let pup = new ProspectUpgrade(this);
			pup = pup.initUpgrade();
			this.prospectUpgrades.push(pup);
		}
	}

	closeProspUpgrade(event) {
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
			this.moneyChange.push(-cost);
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
			button.addEventListener('click', function (e) {
				this.buttonClick(e, 'prospect');
			}.bind(this));
		}

		for (let i = 0, j = this.smeltingButtons.length; i < j; i++) {
			let button = this.smeltingButtons[i];
			button.addEventListener('click', function (e) {
				this.buttonClick(e, 'smelt');
			}.bind(this));

		}

		for (let i = 0, j = this.logisticsButtons.length; i < j; i++) {
			let button = this.logisticsButtons[i];
			button.addEventListener('click', function (e) {
				this.buttonClick(e, 'logistics');
			}.bind(this));
		}

		this.miningButton.addEventListener('click', function (e) {
			this.buttonClick(e, 'mining');
		}.bind(this));
	}

	buttonClick(event, type) {
		let button = event.currentTarget;
		let buttonParent = button.parentElement;
		let allButtons = buttonParent.children;
		for (let i = 0, j = allButtons.length; i < j; i++) {
			let btn = allButtons[i];
			if (button == btn) {
				this.handleBuy(i, type);
			}
		}
	}
	handleBuy(index, type) {
		console.log("Buying: ", type);
		if (type == 'prospect') {
			let cost = this.prospectorsCost[index];
			if (this.money >= cost) {
				this.money -= cost;
				this.moneyChange.push(-cost);
				this.prospectorsCount[index]++;
				let costInc = Math.log(this.prospectorsCount[index] + 1) * this.prospectorsCoeff[index];
				this.prospectorsCost[index] += costInc;
			}
		}
		if (type == 'mining') {
			let cost = this.miningCost;
			if (this.money >= cost) {
				this.money -= cost;
				this.moneyChange.push(-cost);
				this.miningCount++;
				let costInc = Math.log(this.miningCount + 1) * this.miningCoeff;
				this.miningCost += costInc;
				this.updatePSliders();
			}
		}
		if (type == 'smelt') {
			let cost = this.smeltingCost[index];
			if (this.money >= cost) {
				this.money -= cost;
				this.moneyChange.push(-cost);
				this.smeltingCount[index]++;
				this.smeltSlots += this.smeltingEff[index];
				let costInc = Math.log(this.smeltingCount[index] + 1) * this.smeltingCoeff[index];
				this.smeltingCost[index] += costInc;
				this.updateSSliders();
			}
		}
		if (type == 'logistics') {
			let cost = this.logisticsCost[index];
			if (this.money >= cost) {
				this.money -= cost;
				this.moneyChange.push(-cost);

				this.logisticsCount[index]++;
				this.logisticSlots += this.logisticsEff[index];

				let costInc = Math.log(this.logisticsCount[index] + 1) * this.logisticsCoeff[index];
				this.logisticsCost[index] += costInc;
				this.updateLogSliders();
			}

		}
		this.updater.update();
	}

	ingotChange() {
		//Given price factors, change prices 
		let prices = this.ingotPrices;
		let factors = this.ingotPriceFactors;
		for (let i in prices) {
			this.ingotPriceChange[i] = 0;
			let price = prices[i];
			let factor = factors[i];
			if (factor <= 0.3) {
				//Strong decline
				//Decline from 0.5% to 6%
				let percent = getRandomInc(0.5, 6);
				let change = (price / 100) * percent;
				if (price > change) {
					this.ingotPrices[i] -= change;
				}
				this.ingotPriceChange[i] = -change;
			} else if (factor <= 0.5) {
				//Weak decline
				//Decline from 0% to 3%;
				let percent = getRandomInc(0, 3);
				let change = (price / 100) * percent;
				if (price > change) {
					this.ingotPrices[i] -= change;
				}
				this.ingotPriceChange[i] = -change;
			} else if (factor <= 0.7) {
				//Weak growth
				//Grow from 0% to 3%
				let percent = getRandomInc(0, 3);
				let change = (price / 100) * percent;
				this.ingotPrices[i] += change;
				this.ingotPriceChange[i] = change;
			} else if (factor <= 1) {
				//Strong growth
				//Grow from 0.5% to 6%.
				let percent = getRandomInc(0.5, 6);
				let change = (price / 100) * percent;
				this.ingotPrices[i] += change;
				this.ingotPriceChange[i] = change;
			}
		}
	}

	changeEconomy() {
		//Check what we have sold.
		for (let i = 0; i < this.ingotsSold.length; i++) {
			let sold = this.ingotsSold[i];
			let demand = this.ingotDemands[i];
			if (sold < demand) {
				//Increase
				if (this.ingotPriceFactors[i] < 1) {
					this.ingotPriceFactors[i] += 0.15;
				}
			} else if (sold > demand) {
				//Decrease
				if (this.ingotPriceFactors[i] > 0) {
					this.ingotPriceFactors[i] -= 0.15;
				}
			}
		}

		//Change overall demand of ingots
		for (let i = 0; i < this.ingotDemands.length; i++) {
			//Get a random percent
			let percent = getRandomInc(0, 3);
			let number = getRandomInc(0, 100);
			let negative;

			if (number < 10) {
				negative = true;
			} else {
				negative = false;
			}
			let amountChange = Math.round(this.ingotDemands[i] * (percent / 100));
			if (negative) {
				amountChange = -amountChange;
			}
			this.ingotDemands[i] += amountChange;
		}
	}



	incLoop() {
		if (this.clock % 10 == 0) {
			//Change prices
			this.ingotChange();
		}
		if (this.clock == 20) {
			//Change demands
			this.clock = 0;
			this.changeEconomy();
		}


		this.money += this.money_canvas.moneyGen;
		this.moneyChange.push(this.money_canvas.moneyGen);
		this.money_canvas.moneyGen = 0;
		this.prospect();
		this.mine();
		this.smelt();
		this.transport();
		this.clock++;
		this.updater.update();
	}

	transport() {
		for (let i = 0, j = this.logisticsVals.length; i < j; i++) {
			let toSell = this.logisticsVals[i];
			let sellTotal = toSell * this.sellAmount;

			if (this.refOre[i] > 0) {
				if (this.refOre[i] > sellTotal) {

					this.refOre[i] -= sellTotal;
					this.refOreChange[i].push(-sellTotal);
					let moneyGain = Math.round(sellTotal * this.ingotPrices[i]);
					this.money += moneyGain;
					this.moneyChange.push(moneyGain);

				} else {

					let moneyGain = Math.round(this.refOre[i] * this.ingotPrices[i]);
					this.moneyChange.push(moneyGain);
					this.refOreChange[i].push(-this.refOre[i]);
					this.refOre[i] = 0;

				}
			}

		}
	}
	smelt() {
		for (let i = 0, j = this.smeltVals.length; i < j; i++) {
			let toSmelt = this.smeltVals[i];
			let smeltTotal = toSmelt * this.smeltAmount;
			if (this.unrefOre[i] > 0) {
				if (this.unrefOre[i] > smeltTotal) {
					this.unrefOre[i] -= smeltTotal;
					this.unrefOreChange[i].push(-smeltTotal);

					this.refOre[i] += smeltTotal;

					this.ingotsSold[i] += smeltTotal;
					this.refOreChange[i].push(smeltTotal);

				} else {
					this.refOre[i] += this.unrefOre[i];
					this.refOreChange[i].push(this.unrefOre[i]);
					this.ingotsSold[i] += this.unrefOre[i];
					this.unrefOreChange[i].push(-this.unrefOre[i]);
					this.unrefOre[i] = 0;
				}
			}

		}
	}

	mine() {
		for (let i = 0; i < this.miningVals.length; i++) {
			let toMine = this.miningVals[i];
			let mineTotal = toMine * this.miningEff;
			if (this.oreReserves[i] > 0) {
				if (this.oreReserves[i] > mineTotal) {

					this.oreReserves[i] -= mineTotal;
					this.oreResChange[i].push(-mineTotal);
					this.unrefOre[i] += mineTotal;
					this.unrefOreChange[i].push(mineTotal);

				} else {

					this.oreResChange[i].push(-this.oreReserves[i]);
					this.unrefOre[i] += this.oreReserves[i];
					this.unrefOreChange[i].push(this.oreReserves[i]);
					this.oreReserves[i] = 0;

				}
			}
		}
	}

	prospect() {
		this.prospectAmount = 0;
		for (let i = 0, j = this.prospectorsCount.length; i < j; i++) {
			this.prospectAmount += (this.prospectorsCount[i] * this.prospectorsEff[i]);
		}
		let oreFound = this.prospect_canvas.prospect(this.prospectAmount);
		for (let i = 0, j = oreFound.length; i < j; i++) {
			this.oreResChange[i].push(oreFound[i]);
			this.oreReserves[i] += oreFound[i];
		}
		this.prospect_canvas.oreFound = [0, 0, 0, 0];
	}

}
