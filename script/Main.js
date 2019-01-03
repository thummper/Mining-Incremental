//Define inc globally
let inc;
window.addEventListener('load', function () {
	//Make Tab Buttons Work
	let tabButtons = document.getElementsByClassName("tab-button");
	for(let i = 0; i < tabButtons.length; i++){
		let tab = tabButtons[i];
		tab.addEventListener("click", openTab);

	}

	//Initialise..
	inc = new Incremental();
	inc.start();
		//Tab functions
		function openTab() {

			let tabParent = this.parentNode;
			let allTabs = tabParent.children;
			let tabContent = document.getElementsByClassName("tab-content")[0];
	
			for(let i = 0, j = allTabs.length; i < j; i++){
				let tab = allTabs[i];
				if(tab == this){
					console.log("Tab found");
					tab.classList.add('active');
					tabContent.children[i].classList.remove("tab-hidden");
				} else {
					//Not this tab
					tab.classList.remove('active');
					tabContent.children[i].classList.add("tab-hidden");
				}
			}


			inc.money_canvas.resize();
			inc.prospect_canvas.resizeCanvas();
			inc.graphHandler.resizeGraphs();
		}
});


//Helper Functions
function roundNumber(number, decimal) {
	number = parseFloat(number);
	if (decimal) {
		if (number >= 1000000000) {
			return (number / 1000000000).toFixed(4) + ' B';
		} else if (number >= 1000000) {
			return (number / 1000000).toFixed(2) + ' M';
		} else if (number >= 1000) {
			return (number / 1000).toFixed(2) + ' K';
		} else if(number < 1 && number > 0){
			return number.toFixed(3);
		} else {
		return number.toFixed(1);
		}
	} else {
		if (number >= 1000000000) {
			return Math.round(number / 1000000000) + ' B';
		} else if (number >= 1000000) {
			return Math.round(number / 1000000) + ' M';
		} else if (number >= 1000) {
			return Math.round(number / 1000) + ' K';
		}
		return Math.round(number);
	}
}



function randomRange(min, max, signed) {
	let num = Math.random() * (max - min) + min;
	if (signed) {
		num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
	}
	return num;
}



class Incremental {

	constructor() {
		this.moneyManager = new MoneyManager();
		this.oreManager = new OreManager();
		this.money_canvas = new MoneyCanvas(24);
		this.prospect_canvas = new ProspectCanvas();
		this.economy = new Economy(this);

		//Game stuff
		this.clock = 0;
		this.loop;


		//Prospectors
		this.prospectButtons = [];
		this.prospectorsCount = [0, 0, 0];
		this.prospectorsCost = [2000, 6000, 20000];
		this.prospectorsEff = [0.30, 1, 3.4];
		this.prospectorsCoeff = [700, 800, 1200];
		this.prospectAmount = 0;
		this.prospectUpgrades = [];

		this.prospectSalePrice = [500, 1000, 2000, 4000];

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


		//Graph info

		this.ironGraph = document.getElementById('irong');
		this.copperGraph = document.getElementById('copperg');
		this.goldGraph = document.getElementById('goldg');
		this.silverGraph = document.getElementById('silverg');
		this.graphHandler = new GraphHandler([this.ironGraph, this.copperGraph, this.silverGraph, this.goldGraph], this);
		this.graphHandler.makeGraphs();

		


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
	this.prospsellButtons = document.getElementsByClassName('sellinfo-buttons')[0].children;

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


canAfford(cost) {
	return this.moneyManager.money >= cost;
}



canMine(index, amount) {
	return this.oreManager.oreReserves[index] >= amount;
}

canSmelt(index, amount) {
	return this.oreManager.oreUnrefined[index] >= amount;
}

canTransport(index, amount) {
	return this.oreManager.oreRefined[index] >= amount;
}

prospbuyUpgrade(number, parent, button) {
	let upgrade = this.prospectUpgrades[number];
	let cost = upgrade.cost;
	if (this.canAfford(cost)) {
		button.parentNode.removeChild(button);
		this.prospectUpgrades.splice(number, 1);
		this.moneyManager.removeMoney(cost);
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

	for (let i = 0, j = this.prospsellButtons.length; i < j; i++) {
		let button = this.prospsellButtons[i];
		button.addEventListener('click', function (e) {
			this.sellButtonClick(e, 'sellprop');
		}.bind(this));
	}

}

sellButtonClick(event, type) {
	let button = event.currentTarget;
	let buttonParent = button.parentElement;
	let allButtons = buttonParent.children;
	for (let i = 0, j = allButtons.length; i < j; i++) {
		let btn = allButtons[i];
		if (button == btn) {
			this.handleSell(i, type);
		}
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

handleSell(index, type) {
	if (type == 'sellprop') {
		if (this.oreManager.oreReserves[index] >= 1) {
			console.log("Stelling 1t of : ", index);
			this.oreManager.removeReserves(index, 1);
			this.moneyManager.addMoney(this.economy.ingotPrices[index] / 1.5);
		}

	}
	this.updater.update();
}



handleBuy(index, type) {
	console.log("Buying: ", type);
	if (type == 'prospect') {
		let cost = this.prospectorsCost[index];
		if (this.canAfford(cost)) {
			this.moneyManager.removeMoney(cost);
			this.prospectorsCount[index]++;
			let costInc = Math.log(this.prospectorsCount[index] + 1) * this.prospectorsCoeff[index];
			this.prospectorsCost[index] += costInc;
		}
	}
	if (type == 'mining') {
		let cost = this.miningCost[index];
		if (this.canAfford(cost)) {
			this.moneyManager.removeMoney(cost);
			this.miningCount[index]++;
			this.miningSlots += this.miningEff[index];
			let costInc = Math.log(this.miningCount[index] + 1) * this.miningCoeff[index];
			this.miningCost[index] += costInc;
			this.updateSliders(this.miningSlots, this.pSliders, this.pSliderLabels, this.miningVals);
		}
	}
	if (type == 'smelt') {
		let cost = this.smeltingCost[index];
		if (this.canAfford(cost)) {
			this.moneyManager.removeMoney(cost);
			this.smeltingCount[index]++;
			this.smeltSlots += this.smeltingEff[index];
			let costInc = Math.log(this.smeltingCount[index] + 1) * this.smeltingCoeff[index];
			this.smeltingCost[index] += costInc;

			this.updateSliders(this.smeltSlots, this.sSliders, this.sSliderLabels, this.smeltVals);

		}
	}
	if (type == 'logistics') {
		let cost = this.logisticsCost[index];
		if (this.canAfford(cost)) {

			this.moneyManager.removeMoney(cost);
			this.logisticsCount[index]++;
			this.logisticSlots += this.logisticsEff[index];
			let costInc = Math.log(this.logisticsCount[index] + 1) * this.logisticsCoeff[index];
			this.logisticsCost[index] += costInc;
			this.updateSliders(this.logisticSlots, this.logSliders, this.logSliderLabels, this.logisticsVals);
		}
	}
	this.updater.update();
}




genChartData(){
	let newData = []; 
	for(let i = 0; i < this.economy.ingotPrices.length; i++){
		let date = new Date();
		let h = date.getHours();
		let m = date.getMinutes();
		let s = date.getSeconds();

		let label = h + ":" + m + ":" + s;
		let price = this.economy.ingotPrices[i];
		newData.push([label, price]); 
	}
	this.graphHandler.updateGraphs(newData);



}

incLoop() {
	if (this.clock % 2 == 0) {
		//Change prices
		this.economy.changePrices();
		this.genChartData();
		this.updater.updateIngots();
		this.economy.updateMine();
	}
	if (this.clock == 8) {
		//Change economy factors
		this.clock = 0;
		this.economy.changeEconomy();
		this.economy.changePrices();
		this.updater.updateIngots();
	}


	//Check if we have prospected manually.
	for (let i in this.money_canvas.oresProspected) {
		this.oreManager.addReserves(i, this.money_canvas.oresProspected[i]);
	}
	this.money_canvas.oresProspected = [0, 0, 0, 0];



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
			//More ref ore than sell sliders
			if (this.canTransport(i, sellTotal)) {


				this.oreManager.removeRefined(i, sellTotal);
				this.moneyManager.addMoney(sellTotal * this.economy.ingotPrices[i]);
			}
		}
	}
}
smelt() {
	for (let i = 0, j = this.smeltVals.length; i < j; i++) {
		let smelt = this.smeltVals[i];
		let smeltTotal = smelt;
		if (smelt > 0) {
			if (this.canSmelt(i, smeltTotal)) {
				this.oreManager.addRefined(i, smeltTotal);
				this.oreManager.removeUnrefined(i, smeltTotal)
			}
		}
	}
}
mine() {
	for (let i = 0; i < this.miningVals.length; i++) {
		let toMine = this.miningVals[i];
		let mineTotal = toMine;
		if (toMine > 0) {
			if (this.canMine(i, mineTotal)) {
				this.oreManager.removeReserves(i, mineTotal);
				this.oreManager.addUnrefined(i, mineTotal);
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
		this.oreManager.addReserves(i, oreFound[i]);
	}
	this.prospect_canvas.oreFound = [0, 0, 0, 0];
}

}