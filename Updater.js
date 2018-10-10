//Responsible for updating everything
class Updater {
	constructor(inc) {
		this.inc = inc;
		//Probs just a big list of elements
		this.moneyDisplay = document.getElementById('money');
		this.prospectAmount = document.getElementById('prospectAmount');
		this.prospectRow = document.getElementById('prospectOre').getElementsByClassName('item');
		this.prospectUpgrades = document.getElementsByClassName('prosp-upgrades')[0];
		
		this.unrefinedRow = document.getElementById('unrefinedOre').getElementsByClassName('item');
		this.refinedRow = document.getElementById('refinedOre').getElementsByClassName('item');
		
		
		
	}

	update() {
		
		this.moneyDisplay.innerHTML = '$ ' + this.roundMoney(this.inc.money);
		this.updateProspect();
	}

	updateProspect() {
		this.prospectAmount.innerHTML = this.roundMoney(this.inc.prospectAmount);
		let pButtons = this.inc.prospectButtons;
		for (let i = 0; i < pButtons.length; i++) {
			let button = pButtons[i];
			button.innerHTML = '$ ' + this.roundMoney(this.inc.prospectorsCost[i]);
		}
		for(let i = 0; i < this.prospectRow.length; i++){
			let item = this.prospectRow[i];
			let amount = this.inc.oreReserves[i];
			item.innerHTML = this.roundMoney(this.inc.oreReserves[i]) + 't';
		}
		
		
		let upgrades = this.inc.prospectUpgrades;
		for(let i = 0; i < upgrades.length; i++){
			let upg = upgrades[i];
			if(upg.drawn == false){
				this.drawUpgrade(this.prospectUpgrades, upg, i);
				upg.drawn = true;
			}
		}
		

	}
	
	drawUpgrade(container, upgrade, num){
		
		let upgradeItem = this.makeElement('div', [{attr: 'class', value: 'upgItem'}, {attr: 'data-upgn', value: num}]);
		upgradeItem.addEventListener('click', this.inc.prospupgradeClick.bind(this.inc));
		
		let upgradeClose = this.makeElement('div', [{attr: 'class', value: 'upgClose'}]);
		upgradeClose.addEventListener('click', this.inc.closeProspUpgrade.bind(this.inc));
		upgradeClose.innerHTML = "&times;";
		upgradeItem.appendChild(upgradeClose);
		
		let updateTitle = this.makeElement('div', [{attr: 'class', value: 'upgTitle'}]);
		updateTitle.innerHTML = upgrade.name;
		upgradeItem.appendChild(updateTitle);
		let upgradeDescription = this.makeElement('div', [{attr: 'class', value: 'upgDesc'}]);
		upgradeDescription.innerHTML = upgrade.description;
		upgradeItem.appendChild(upgradeDescription);
		let upgradeCost = this.makeElement('div', [{attr: 'class', value: 'upgCost'}]);
		upgradeCost.innerHTML = '$ ' + this.roundMoney(upgrade.cost);
		upgradeItem.appendChild(upgradeCost);
		
		container.appendChild(upgradeItem);
	}
	
	makeElement(type, attrs){
		let elm = document.createElement(type);
		for(let i in attrs){
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
		} else if(money < 1000){
			return money.toFixed(2);
		}
		return Math.round(money);
	}

}
