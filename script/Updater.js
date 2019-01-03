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
		this.prospectSellButtons = document.getElementsByClassName('sellinfo-buttons')[0].children;


		//Company directory
		this.companyDirectory = document.getElementsByClassName('company-directory')[0];
		this.economyOutlook = document.getElementById('economy-outlook');


		//Price targets
		this.ironTarget = document.getElementById("iron-target");
		this.copperTarget = document.getElementById("copper-target");
		this.silverTarget = document.getElementById("silver-target");
		this.goldTarget = document.getElementById("gold-target");
		//Sidebar prices TODO: PRICE ELEMENTS SHOULD BE STANDARD AND ALL UPDATED AT THE SAME TIME
		this.ironPrice = document.getElementById("iron-price");
		this.copperPrice = document.getElementById("copper-price");
		this.silverPrice = document.getElementById("silver-price");
		this.goldPrice = document.getElementById("gold-price");

		this.ingotsSold = document.getElementsByClassName('ingot-sold');
		this.ingotDemand = document.getElementsByClassName("ingot-demand");



	}

	getMoneyAverage(moneyChange) {
		let average = 0;
		for (let i = 0; i < moneyChange.length; i++) {
			average += moneyChange[i];
		}
		average = this.roundNumber((average / moneyChange.length), false);
		return average;
	}

	getOreAverage(array) {
		//Is passed an index, should return index and trim.
		let average = 0;
		for (let i = 0; i < array.length; i++) {
			average += array[i];
		}
		average = this.roundNumber((average / array.length), false);
		return average;
	}



	update() {

		this.inc.moneyManager.tickMoney();
		this.inc.oreManager.tickOre();
		let moneyAverage = this.getMoneyAverage(this.inc.moneyManager.moneyChange);

		this.updateMining();
		this.updateProspect();
		this.updateProcessing();
		this.updateLogistics();
		this.updateSellButtons();
		this.updateCompetition();
		this.moneyDisplay.innerHTML = '$ ' + this.roundNumber(this.inc.moneyManager.money, true) + ' (' + moneyAverage + ')';


	}

	updateTargets() {
		this.ironTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[0], 0);
		this.copperTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[1], 0);
		this.silverTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[2], 0);
		this.goldTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[3], 0);

		this.ironPrice.innerHTML = "£" + roundNumber(this.inc.economy.ingotPrices[0], 1);
		this.copperPrice.innerHTML = "£" + roundNumber(this.inc.economy.ingotPrices[1], 1);
		this.silverPrice.innerHTML = "£" + roundNumber(this.inc.economy.ingotPrices[2], 1);
		this.goldPrice.innerHTML = "£" + roundNumber(this.inc.economy.ingotPrices[3], 1);



		for (let i = 0; i < this.ingotsSold.length; i++) {
			this.ingotsSold[i].innerHTML = roundNumber(this.inc.economy.soldIngots[i], 0);
		}

		for (let i = 0; i < this.ingotDemand.length; i++) {
			this.ingotDemand[i].innerHTML = roundNumber(this.inc.economy.ingotDemands[i], 0);
		}

	}

	updateCompetition() {
		//Generate HMTL displays for all fake companies, if they exist, update them.
		let outlook = this.inc.economy.outlook;
		if (outlook) {
			this.economyOutlook.innerHTML = roundNumber(outlook, 1);
		} else {
			this.economyOutlook.innerHTML = roundNumber(0, 1);
		}



		let companies = this.inc.economy.companies;
		let displayedCompanies = this.companyDirectory.children;


		for (let i = 0; i < companies.length; i++) {

			//This will be bad. 
			let company = companies[i];
			//If company is being displayed already, update it
			let id = company.id;

			let updated = false;
			for (let j = 0; j < displayedCompanies.length; j++) {
				let display = displayedCompanies[j];
				let displayID = display.getElementsByClassName('company-id')[0];

				if (parseFloat(displayID.innerHTML) == id) {
					updated = true;
					this.updateCompany(display, company);
				}

			}


			if (!updated) {
				//Cound not find company in list
				let companyDisplay = this.generateCompany(company);
				this.companyDirectory.appendChild(companyDisplay);
			}
		}



	}

	updateCompany(html, company) {


		let resets = html.getElementsByClassName('company-resets')[0];
		let cash = html.getElementsByClassName('company-cash')[0];
		let operating = html.getElementsByClassName('company-operating')[0];
		let profit = html.getElementsByClassName('company-profit')[0];
		let expenses = html.getElementsByClassName('company-expenses')[0];
		let iron = html.getElementsByClassName('ironP')[0];
		let copper = html.getElementsByClassName('copperP')[0];
		let silver = html.getElementsByClassName('silverP')[0];
		let gold = html.getElementsByClassName('goldP')[0];

		resets.innerHTML = company.resets;
		cash.innerHTML = "£" + roundNumber(company.cash, 1);
		operating.innerHTML = "£" + roundNumber((company.lastProfit - company.expenses), 1);
		profit.innerHTML = "£" + roundNumber(company.lastProfit, 1);
		expenses.innerHTML = "-£" + roundNumber(company.expenses, 1);
		let mined = company.lastMine;
		iron.innerHTML = roundNumber(mined[0], 0) + "t";
		copper.innerHTML = roundNumber(mined[1], 0) + "t";
		silver.innerHTML = roundNumber(mined[2], 0) + "t";
		gold.innerHTML = roundNumber(mined[3], 0) + "t";
	}

	createItem(type, classes) {
		let item = document.createElement(type);

		if (classes) {
			let classString = "";
			for (let i in classes) {
				classString += classes[i] + " ";
			}
			item.setAttribute("class", classString);
		}
		return item;
	}

	generateCompany(company) {

		let wrapper = this.createItem('div', ['company-wrapper']);
		let id = this.createItem('div', ['company-id ']);
		id.innerHTML = company.id;
		wrapper.appendChild(id);


		let top = this.createItem('div', ['company-top']);
		let name = this.createItem('div', ['company-name']);
		let resets = this.createItem('div', ['company-resets']);
		let money = this.createItem('div', ['company-money']);
		let cash = this.createItem('div', ['company-cash']);
		let operating = this.createItem('div', ['company-operating']);
		let income = this.createItem('div', ['company-income']);
		let profit = this.createItem('div', ['company-profit']);
		let expenses = this.createItem('div', ['company-expenses']);
		let production = this.createItem('div', ['company-production']);
		let iron = this.createItem('div', ['ironP']);
		let copper = this.createItem('div', ['copperP']);
		let silver = this.createItem('div', ['silverP']);
		let gold = this.createItem('div', ['goldP']);


		name.innerHTML = company.name;
		resets.innerHTML = company.resets;

		top.appendChild(name);
		top.appendChild(resets);
		wrapper.appendChild(top);

		cash.innerHTML = "£" + roundNumber(company.cash, 1);
		operating.innerHTML = "£" + roundNumber((company.lastProfit - company.expenses), 1);

		money.appendChild(cash);
		money.appendChild(operating);
		wrapper.appendChild(money);

		profit.innerHTML = "£" + roundNumber(company.lastProfit, 1);
		expenses.innerHTML = "-£" + roundNumber(company.expenses, 1);

		income.appendChild(profit);
		income.appendChild(expenses);
		wrapper.appendChild(income);

		let mined = company.lastMine;
		iron.innerHTML = roundNumber(mined[0], 0) + "t";
		copper.innerHTML = roundNumber(mined[1], 0) + "t";
		silver.innerHTML = roundNumber(mined[2], 0) + "t";
		gold.innerHTML = roundNumber(mined[3], 0) + "t";

		production.appendChild(iron);
		production.appendChild(copper);
		production.appendChild(silver);
		production.appendChild(gold);
		wrapper.appendChild(production);

		return wrapper;
	}

	updateSellButtons() {
		for (let i = 0; i < this.prospectSellButtons.length; i++) {
			let button = this.prospectSellButtons[i];
			button.innerHTML = "£ " + this.roundNumber(this.inc.economy.ingotPrices[i] / 1.5);


		}
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
			cell.innerHTML = '$ ' + this.roundNumber(this.inc.economy.ingotPrices[i], true);
		}



		for (let i = 0; i < this.changeRow.length; i++) {
			let cell = this.changeRow[i];
			cell.innerHTML = '$' + this.roundNumber(this.inc.economy.ingotPriceChange[i][0], false) + " (" + this.roundNumber(this.inc.economy.ingotPriceChange[i][1]) + "%)";
		}

		// for (let i = 0; i < this.demandsRow.length; i++) {
		// 	let cell = this.demandsRow[i];
		// 	let demand = this.inc.ingotPriceFactors[i].toFixed(2);

		// 	let demandString;
		// 	if (demand < 3) {
		// 		demandString = "Strong Decline";
		// 	} else if (demand < 5) {
		// 		demandString  = "Weak Decline";
		// 	} else if (demand <= 8) {
		// 		demandString = "Weak Increase";
		// 	} else {
		// 		demandString = "Strong Increase";
		// 	}

		// 	cell.innerHTML = demandString;
		// }
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
			let amount = this.inc.oreManager.oreRefined[i];
			let avg = this.getOreAverage(this.inc.oreManager.refinedChange[i]);
			item.innerHTML = this.roundNumber(amount, false) + 't' + ' (' + avg + ')';
		}
	}


	updateMining() {
		let miningButtons = this.inc.miningButtons;
		for (let i = 0, j = miningButtons.length; i < j; i++) {
			let button = miningButtons[i];
			button.innerHTML = '$ ' + this.roundNumber(this.inc.miningCost[i], true);
		}

		let titles = this.miningTitles;
		for (let i = 0, j = titles.length; i < j; i++) {
			let display = titles[i].getElementsByTagName('span')[0].innerHTML = this.roundNumber(this.inc.miningCount[i], false);
		}

		for (let i = 0, j = this.unrefinedRow.length; i < j; i++) {
			let item = this.unrefinedRow[i];
			let amount = this.inc.oreManager.oreUnrefined[i];
			let avg = this.getOreAverage(this.inc.oreManager.unrefinedChange[i]);
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
			let amount = this.inc.oreManager.oreReserves[i];
			let avg = this.getOreAverage(this.inc.oreManager.reservesChange[i]);
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
				return (number / 1000).toFixed(2) + ' K';
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