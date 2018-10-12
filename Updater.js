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
		
		this.smeltTitle = document.getElementsByClassName('process-titles')[0].children;
		
	}

	getMoneyAverage(moneyChange) {
		let average = 0;
		for (let i = 0; i < moneyChange.length; i++) {
			average += moneyChange[i];
		}
		average = this.roundSolid(average / moneyChange.length);
		if (moneyChange.length > 4) {
			let diff = moneyChange.length - 4;
			moneyChange.splice(0, diff);
		}
		return average;
	}

	getOreAverage(array, index) {
		let average = 0;
		for (let i = 0; i < array.length; i++) {
			average += array[i];
		}
		return this.roundSolid(average / array.length);

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
		
		this.moneyDisplay.innerHTML = '$ ' + this.roundMoney(this.inc.money) + ' (' + moneyAverage + ')';
		this.resetOreAverage(this.inc.oreResChange);
		this.resetOreAverage(this.inc.unrefOreChange);
		this.resetOreAverage(this.inc.refOreChange);
		
	}
	
	updateProcessing(){
		let processButtons = this.inc.smeltingButtons;
		
		for(let i = 0, j = processButtons.length; i < j; i++){
			let button = processButtons[i];
			button.innerHTML = '$ ' + this.roundMoney(this.inc.smeltingCost[i]);
		}
		
		for(let i = 0, j = this.smeltTitle.length; i < j; i++){
			let title = this.smeltTitle[i];
			title.getElementsByTagName('span')[0].innerHTML = ' ' + Math.round(this.inc.smeltingCount[i]);
		}
		
		for(let i = 0, j = this.refinedRow.length; i < j; i++){
			let item = this.refinedRow[i];
			let amount = this.inc.refOre[i];
			let avg = this.getOreAverage(this.inc.refOreChange[i]);
			item.innerHTML = this.roundSolid(amount) + 't' + ' (' + avg + ')';
		}
	}


	updateMining() {
		this.inc.miningButton.innerHTML = '$ ' + this.roundMoney(this.inc.miningCost);
		document.getElementsByClassName('mining-titles')[0].children[0].getElementsByTagName('span')[0].innerHTML = this.roundSolid(this.inc.miningCount);
		for (let i = 0, j = this.unrefinedRow.length; i < j; i++) {
			let item = this.unrefinedRow[i];
			let amount = this.inc.unrefOre[i];
			let avg = this.getOreAverage(this.inc.unrefOreChange[i]);
			item.innerHTML = this.roundSolid(amount) + 't' + ' (' + avg + ')';
		}
	}

	updateProspect() {
		this.prospectAmount.innerHTML = this.roundMoney(this.inc.prospectAmount);
		let pButtons = this.inc.prospectButtons;
		//Update Prices
		for (let i = 0; i < pButtons.length; i++) {
			let button = pButtons[i];
			button.innerHTML = '$ ' + this.roundMoney(this.inc.prospectorsCost[i]);
		}
		//Update Ore
		for (let i = 0; i < this.prospectRow.length; i++) {
			let item = this.prospectRow[i];
			let amount = this.inc.oreReserves[i];
			let avg = this.getOreAverage(this.inc.oreResChange[i]);
			item.innerHTML = this.roundSolid(amount) + 't' + ' (' + avg + ')';
		}
		//Update Titles 
		for (let i = 0, j = this.prospectTitles.length; i < j; i++) {
			let title = this.prospectTitles[i];
			title.getElementsByTagName('span')[0].innerHTML = this.roundSolid(this.inc.prospectorsCount[i]);
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
		upgradeCost.innerHTML = '$ ' + this.roundMoney(upgrade.cost);
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

	roundMoney(money) {
		if (money >= 1000000) {
			return (money / 1000000).toFixed(2) + ' M';
		} else if (money >= 1000) {
			return (money / 1000).toFixed(1) + ' K';
		} else if (money < 1000) {
			return money.toFixed(2);
		}
		return Math.round(money);
	}
	//Doesnt round toFixed 2 for small numbers 
	roundSolid(number) {
		if (number >= 1000000) {
			return (number / 1000000).toFixed(2) + ' M';
		} else if (number >= 1000) {
			return (number / 1000).toFixed(1) + ' K';
		}
		return number.toFixed(1);
	}
}
