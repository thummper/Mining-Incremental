//Responsible for updating everything
class Updater {
	constructor(inc) {
		this.inc = inc;
		//Probs just a big list of elements
		this.moneyDisplay = document.getElementById('money');
		this.prospectAmount = document.getElementById('prospectAmount');
		this.prospectRow = document.getElementById('prospectOre').getElementsByClassName('item');
		this.prospectTitles = document.getElementsByClassName('prospect-titles')[0].children;
		this.prospectUpgrades = document.getElementsByClassName('prosp-upgrades')[0];
		this.unrefinedRow = document.getElementById('unrefinedOre').getElementsByClassName('item');
		this.refinedRow = document.getElementById('refinedOre').getElementsByClassName('item');

		this.logisticsRow = document.getElementById('logisticsButtons');
		this.logisiticsTitle = document.getElementsByClassName('logistics-titles')[0].children;

		this.smeltTitle = document.getElementsByClassName('process-titles')[0].children;
		
		this.miningTitles = document.getElementsByClassName('mining-titles')[0].children;

		this.priceRow = document.getElementById('ingotPrice').children;
		this.changeRow = document.getElementById('ingotChange').children;
		this.demandsRow = document.getElementById('ingotDemand').children;
	}

	getMoneyAverage(moneyChange) {
		let average = 0;
		for (let i = 0; i < moneyChange.length; i++) {
			average += moneyChange[i];
		}
		average = this.roundNumber((average / moneyChange.length), false);
		if (moneyChange.length > 4) {
			let diff = moneyChange.length - 4;
			moneyChange.splice(-1, diff);
		}
		return average;
	}

	getOreAverage(array, index) {
		let average = 0;
		for (let i = 0; i < array.length; i++) {
			average += array[i];
		}
		return this.roundNumber( (average / array.length), false);

	}
	resetOreAverage(array) {
		//Array is an array of arrays
		for (let i = 0; i < array.length; i++) {
			let changeArray = array[i];
			if (changeArray.length > 4) {
				let diff = changeArray.length - 4;
				changeArray.splice(0, diff);
			}
		}
	}


	update() {

		let moneyAverage = this.getMoneyAverage(this.inc.moneyChange);
		this.updateMining();
		this.updateProspect();
		this.updateProcessing();
		this.updateLogistics();
		
		this.moneyDisplay.innerHTML = '$ ' + this.roundNumber(this.inc.money, true) + ' (' + moneyAverage + ')';
		this.resetOreAverage(this.inc.oreResChange);
		this.resetOreAverage(this.inc.unrefOreChange);
		this.resetOreAverage(this.inc.refOreChange);

	}

	updateLogistics() {
		for (let i = 0; i < this.inc.logisticsButtons.length; i++) {
			let button = this.inc.logisticsButtons[i];
			button.innerHTML = "$ " + this.roundNumber(this.inc.logisticsCost[i], true);
		}
		for (let i = 0; i < this.logisiticsTitle.length; i++) {
			let title = this.logisiticsTitle[i];
			title.getElementsByTagName('span')[0].innerHTML = this.inc.logisticsCount[i];
		}

	}

	updateIngots() {
		//Update economy stuff
		for (let i = 0; i < this.priceRow.length; i++) {
			let cell = this.priceRow[i];
			cell.innerHTML = '$ ' + this.roundNumber(this.inc.ingotPrices[i], true);
		}
		for (let i = 0; i < this.changeRow.length; i++) {
			let cell = this.changeRow[i];
			cell.innerHTML = '$ ' + this.roundNumber(this.inc.ingotPriceChange[i], true);
		}
		console.log("ingot factors on update, ", this.inc.ingotPriceFactors);
		for (let i = 0; i < this.demandsRow.length; i++) {
			let cell = this.demandsRow[i];
			let demand = this.inc.ingotPriceFactors[i].toFixed(2);
			
			console.log("Factor: ", demand, " Change: ", this.inc.ingotPriceChange[i]);
			
			let demandString;
			if (demand < 3) {
				demandString = "Strong Decline";
			} else if (demand < 5) {
				demandString  = "Weak Decline";
			} else if (demand <= 8) {
				demandString = "Weak Increase";
			} else {
				demandString = "Strong Increase";
			}
			console.log("Demand, ", demand, " String, " , demandString);
			cell.innerHTML = demandString;
		}
	}

	updateProcessing() {
		let processButtons = this.inc.smeltingButtons;

		for (let i = 0, j = processButtons.length; i < j; i++) {
			let button = processButtons[i];
			button.innerHTML = '$ ' + this.roundNumber(this.inc.smeltingCost[i], true);
		}

		for (let i = 0, j = this.smeltTitle.length; i < j; i++) {
			let title = this.smeltTitle[i];
			title.getElementsByTagName('span')[0].innerHTML = ' ' + Math.round(this.inc.smeltingCount[i]);
		}

		for (let i = 0, j = this.refinedRow.length; i < j; i++) {
			let item = this.refinedRow[i];
			let amount = this.inc.refOre[i];
			let avg = this.getOreAverage(this.inc.refOreChange[i]);
			item.innerHTML = this.roundNumber(amount, false) + 't' + ' (' + avg + ')';
		}
	}


	updateMining() {
		let miningButtons = this.inc.miningButtons;
		for(let i = 0, j = miningButtons.length; i < j; i++){
			let button = miningButtons[i];
			button.innerHTML = '$ ' + this.roundNumber(this.inc.miningCost[i], true);
		}
		
		let titles = this.miningTitles;
		for(let i = 0, j = titles.length; i < j; i++){
			let display = titles[i].getElementsByTagName('span')[0].innerHTML = this.roundNumber(this.inc.miningCount[i], false);
		}
		
		for (let i = 0, j = this.unrefinedRow.length; i < j; i++) {
			let item = this.unrefinedRow[i];
			let amount = this.inc.unrefOre[i];
			let avg = this.getOreAverage(this.inc.unrefOreChange[i]);
			item.innerHTML = this.roundNumber(amount, false) + 't' + ' (' + avg + ')';
		}
	}

	updateProspect() {
		this.prospectAmount.innerHTML = this.roundNumber(this.inc.prospectAmount, true);
		let pButtons = this.inc.prospectButtons;
		//Update Prices
		for (let i = 0; i < pButtons.length; i++) {
			let button = pButtons[i];
			button.innerHTML = '$ ' + this.roundNumber(this.inc.prospectorsCost[i], true);
		}
		//Update Ore
		for (let i = 0; i < this.prospectRow.length; i++) {
			let item = this.prospectRow[i];
			let amount = this.inc.oreReserves[i];
			let avg = this.getOreAverage(this.inc.oreResChange[i]);
			item.innerHTML = this.roundNumber(amount, false) + 't' + ' (' + avg + ')';
		}
		//Update Titles 
		for (let i = 0, j = this.prospectTitles.length; i < j; i++) {
			let title = this.prospectTitles[i];
			title.getElementsByTagName('span')[0].innerHTML = this.roundNumber(this.inc.prospectorsCount[i], false);
		}
		//Update Upgrades 
		let upgrades = this.inc.prospectUpgrades;
		for (let i = 0; i < upgrades.length; i++) {
			let upg = upgrades[i];
			if (upg.drawn == false) {
				this.drawUpgrade(this.prospectUpgrades, upg, i);
				upg.drawn = true;
			}
		}
	}

	drawUpgrade(container, upgrade, num) {
		let upgradeItem = this.makeElement('div', [{
			attr: 'class',
			value: 'upgItem'
		}, {
			attr: 'data-upgn',
			value: num
		}]);
		upgradeItem.addEventListener('click', this.inc.prospupgradeClick.bind(this.inc));
		let upgradeClose = this.makeElement('div', [{
			attr: 'class',
			value: 'upgClose'
		}]);
		upgradeClose.addEventListener('click', this.inc.closeProspUpgrade.bind(this.inc));
		upgradeClose.innerHTML = "&times;";
		upgradeItem.appendChild(upgradeClose);
		let updateTitle = this.makeElement('div', [{
			attr: 'class',
			value: 'upgTitle'
		}]);
		updateTitle.innerHTML = upgrade.name;
		upgradeItem.appendChild(updateTitle);
		let upgradeDescription = this.makeElement('div', [{
			attr: 'class',
			value: 'upgDesc'
		}]);
		upgradeDescription.innerHTML = upgrade.description;
		upgradeItem.appendChild(upgradeDescription);
		let upgradeCost = this.makeElement('div', [{
			attr: 'class',
			value: 'upgCost'
		}]);
		upgradeCost.innerHTML = '$ ' + this.roundNumber(upgrade.cost, true);
		upgradeItem.appendChild(upgradeCost);
		container.appendChild(upgradeItem);
	}

	makeElement(type, attrs) {
		let elm = document.createElement(type);
		for (let i in attrs) {
			let att = attrs[i];
			elm.setAttribute(att.attr, att.value);
		}
		return elm;
	}


	roundNumber(number, decimal) {
		if (decimal) {
			if (number >= 1000000000) {
				return (number / 1000000000).toFixed(4) + ' B';
			} else if (number >= 1000000) {
				return (number / 1000000).toFixed(2) + ' M';
			} else if (number >= 1000) {
				return (number / 1000).toFixed(1) + ' K';
			}
			return number.toFixed(1);
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
}