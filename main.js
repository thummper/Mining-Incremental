//Define inc globally
let inc;
window.addEventListener('load', function () {
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
		this.money = 10000;
		this.moneyChange = [0];

		//Prospectors
		this.prospectButtons = [];
		this.prospectorsCount = [0, 0, 0];
		this.prospectorsCost = [2000, 6000, 20000];
		this.prospectorsEff = [0.30, 1, 3.4];
		this.prospectorsCoeff = [700, 800, 1200];
		this.prospectAmount = 0;
		this.prospectUpgrades = [];

		//Mining Equipment
		this.miningButton;
		this.miningSlots = 0;
		this.miningCount = [0, 0, 0, 0];
		this.miningCost = [1000, 800, 1000, 50000];
		this.miningEff = [1, 5, 9, 17];
		this.miningCoeff = [700, 900, 1200, 1500];

		//Smelting
		this.smeltSlots = 0;
		this.smeltingButtons = [];
		this.smeltingCount = [0, 0, 0];
		this.smeltingCost = [10000, 72000, 500000];
		this.smeltingEff = [10, 50, 100];
		this.smeltAmount = 1;
		this.smeltingCoeff = [800, 900, 2000];

		//Logistics
		this.logisticSlots = 0;
		this.logisticsButtons = [];
		this.logisticsCount = [0, 0, 0];
		this.logisticsCost = [2000, 50000, 125000];
		this.logisticsEff = [10, 50, 80];
		this.logisticsCoeff = [800, 900, 1200];
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
		this.ingotPrices = [60, 600, 10000, 18000];
		this.ingotsSold = [0, 0, 0, 0];
		this.ingotDemands = [1000, 800, 600, 400];
		this.ingotPriceFactors = [10, 10, 10, 10];
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

				this.updateSliders(this.miningSlots, this.pSliders, this.pSliderLabels, this.miningVals);

			}.bind(this);
		}
		for (let i = 0, j = this.sSliders.length; i < j; i++) {
			let slider = this.sSliders[i];
			slider.oninput = function (e) {

				this.updateSliders(this.smeltSlots, this.sSliders, this.sSliderLabels, this.smeltVals);

			}.bind(this);
		}
		for (let i = 0, j = this.logSliders.length; i < j; i++) {
			let slider = this.logSliders[i];
			slider.oninput = function (e) {

				this.updateSliders(this.logisticSlots, this.logSliders, this.logSliderLabels, this.logisticsVals);

			}.bind(this);
		}
		this.updateSliders(this.miningSlots, this.pSliders, this.pSliderLabels, this.miningVals);
		this.updateSliders(this.smeltSlots, this.sSliders, this.sSliderLabels, this.smeltVals);
		this.updateSliders(this.logisticSlots, this.logSliders, this.logSliderLabels, this.logisticsVals);
	}

	updateSliders(max, sliders, lbls, values) {
		console.log("Max: " + max);
		let used = 0;
		for (let i = 0, j = sliders.length; i < j; i++) {
			let slider = sliders[i];
			let value = parseInt(slider.value);
			used += value;
		}
		let slidersLeft = max - used;
		console.log("Sliders left: ", slidersLeft);
		for (let i = 0, j = sliders.length; i < j; i++) {
			let slider = sliders[i];
			let value = parseInt(slider.value);
			slider.max = slidersLeft + value;
			let labels = lbls[i].getElementsByTagName('span');
			labels[0].innerHTML = value;
			labels[1].innerHTML = slider.max;
			values[i] = value;
		}
	}

	start() {
		//Start
		//Set up event listeners 
		this.miningButtons = document.getElementsByClassName('mining-buttons')[0].children;
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
		for (let i = 0, j = this.miningButtons.length; i < j; i++) {
			let button = this.miningButtons[i];
			button.addEventListener('click', function (e) {
				this.buttonClick(e, 'mining');
			}.bind(this));
		}

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
			let cost = this.miningCost[index];
			if (this.money >= cost) {
				this.money -= cost;
				this.moneyChange.push(-cost);
				this.miningCount[index]++;
				this.miningSlots += this.miningEff[index];
				let costInc = Math.log(this.miningCount[index] + 1) * this.miningCoeff[index];
				this.miningCost[index] += costInc;

				this.updateSliders(this.miningSlots, this.pSliders, this.pSliderLabels, this.miningVals);

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

				this.updateSliders(this.smeltSlots, this.sSliders, this.sSliderLabels, this.smeltVals);

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

				this.updateSliders(this.logisticSlots, this.logSliders, this.logSliderLabels, this.logisticsVals);
			}
		}
		this.updater.update();
	}

	ingotChange() {
		
		console.log("Should change ingots");
		for(let i = 0; i < this.ingotPrices.length; i++){
			
			let price       = this.ingotPrices[i];
			let priceFactor = this.ingotPriceFactors[i];
			let percent     = 0;
			
			if(priceFactor < 3){
				percent = (getRandomInc(1, 6) * -1) / 100;
				let change = percent * this.ingotPrices[i];
				this.ingotPriceChange[i] = change;
				this.ingotPrices[i] += change;
				
			} else if(priceFactor < 5){
				percent = (getRandomInc(1, 4) * -1) / 100;
				let change = percent * this.ingotPrices[i]; 
				this.ingotPriceChange[i] = change;
				this.ingotPrices[i] += change;
				
			} else if(priceFactor < 8){
				percent = (getRandomInc(1, 4)) / 100;
				let change = percent * this.ingotPrices[i]; 
				this.ingotPriceChange[i] = change;
				this.ingotPrices[i] += change;
				
			} else {
				percent = (getRandomInc(1, 6)) / 100;
				let change = percent * this.ingotPrices[i];
				this.ingotPriceChange[i] = change;
				this.ingotPrices[i] += change;
			}
		}
		
		
		this.updater.updateIngots();
		this.updateIngotFactors();
		
		
	}
	
	updateIngotFactors(){
		
		for(let i = 0; i < this.ingotPriceChange.length; i++){
			let change = this.ingotPriceChange[i];
			if(change < 0){
				
				this.ingotPriceFactors[i] += 2;
				
			} else {
				
				this.ingotPriceFactors[i] -= 2;
				
			}
			
		}
	}


	changeEconomy() {
		for(let i = 0; i < this.ingotsSold.length; i++){
			let sold = this.ingotsSold[i];
			let demand = this.ingotDemands[i];
			if(sold < demand){
				//Price should increase.
				this.ingotPriceFactors[i] = 10;
				
			} else {
				//Price should decrease.
				this.ingotPriceFactors[i] = 3;
			}
			
			//Demand should generally increase (simple right now.. )
			
			let percent = getRandomInc(1, 3) / 100;
			this.ingotDemand[i] += Math.round(this.ingotDemands[i] * percent);
			
		}
		
	}

incLoop() {
	if (this.clock % 2 == 0) {
		//Change prices
		this.ingotChange();
		
	}
	if (this.clock == 24) {
		this.clock = 0;
		this.changeEconomy();
		this.ingotChange();
	}


	this.money += this.money_canvas.moneyGen;
	this.moneyChange.push(this.money_canvas.moneyGen);
	this.money_canvas.moneyGen = 0;
	this.transport();
	this.smelt();
	this.mine();
	this.prospect();

	this.clock++;
	this.updater.update();
}

transport() {
	for (let i = 0, j = this.logisticsVals.length; i < j; i++) {
		let toSell = this.logisticsVals[i];
		let sellTotal = toSell;
		if (toSell > 0) {
			if (this.refOre[i] >= sellTotal) {
				this.refOre[i] -= sellTotal;
				this.refOreChange[i].push(-sellTotal);
				let moneyGain = Math.round(sellTotal * this.ingotPrices[i]);
				this.money += moneyGain;
				this.moneyChange.push(moneyGain);
			}
		}
	}
}

smelt() {
	for (let i = 0, j = this.smeltVals.length; i < j; i++) {
		let smelt = this.smeltVals[i];
		let smeltTotal = smelt;
		if (smelt > 0) {
			if (this.unrefOre[i] >= smeltTotal) {
				this.refOre[i] += smeltTotal;
				this.refOreChange[i].push(smeltTotal);
				this.unrefOre[i] -= smeltTotal;
				this.unrefOreChange[i].push(-smeltTotal);
			}
		}
	}
}

mine() {
	for (let i = 0; i < this.miningVals.length; i++) {
		let toMine = this.miningVals[i];
		let mineTotal = toMine;
		if (toMine > 0) {
			if (this.oreReserves[i] >= mineTotal) {
				this.oreReserves[i] -= mineTotal;
				this.oreResChange[i].push(-mineTotal);
				this.unrefOre[i] += mineTotal;
				this.unrefOreChange[i].push(mineTotal);
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
