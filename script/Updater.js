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

		this.ingotsSold  = document.getElementsByClassName('ingot-sold');
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
		average = this.roundNumber( (average / array.length), false);
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
		this.updateTargets();
		
		this.moneyDisplay.innerHTML = '$ ' + this.roundNumber(this.inc.moneyManager.money, true) + ' (' + moneyAverage + ')';


	}

	updateTargets(){
		this.ironTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[0], 0);
		this.copperTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[1], 0);
		this.silverTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[2], 0);
		this.goldTarget.innerHTML = "£" + roundNumber(this.inc.economy.ingotPriceTargets[3], 0);


		for(let i = 0; i < this.ingotsSold.length; i++){
			this.ingotsSold[i].innerHTML = roundNumber(this.inc.economy.soldIngots[i], 0);
		}

		for(let i = 0; i < this.ingotDemand.length; i++){
			this.ingotDemand[i].innerHTML = roundNumber(this.inc.economy.ingotDemands[i], 0);
		}

	}

	updateCompetition(){
		//Generate HMTL displays for all fake companies, if they exist, update them.
		let outlook = this.inc.economy.outlook;
		if(outlook){
			this.economyOutlook.innerHTML = roundNumber(outlook, 1);
		} else {
			this.economyOutlook.innerHTML = roundNumber(0, 1);
		}
		
		let companies = this.inc.economy.companies;
		let displayedCompanies = this.companyDirectory.children;
		for(let i = 0; i < companies.length; i++){

			//This will be bad. 
			let company = companies[i];
			//If company is being displayed already, update it
			let name = company.name;
			let updated = false;
			for(let j = 0; j < displayedCompanies.length; j++){
				let display = displayedCompanies[j];
				if(display.classList.contains(name) && display.classList.contains("company-item")){
					//Found company.
					updated = true; 
					this.updateCompany(display, company);	
				}
			}


			if(!updated){
				//Cound not find company in list
				let companyDisplay = this.generateCompany(company);
				this.companyDirectory.appendChild(companyDisplay);
			}
		}



	}

	updateCompany(html, company){
		let cash = html.getElementsByClassName("company-item-cash")[0];
		let exp  = html.getElementsByClassName('company-item-exp')[0];
		let prod = html.getElementsByClassName('company-item-prod')[0];
		let profit = html.getElementsByClassName('company-item-profit')[0];
		let resets = html.getElementsByClassName('company-item-reset')[0];

		profit.innerHTML = "+ £" + roundNumber(company.lastProfit, 1);
		resets.innerHTML = company.resets;


		if(company.cash){
			cash.innerHTML = "Cash: " + roundNumber(company.cash, 1);
		}
		if(company.expenses){
		exp.innerHTML  = "- £" + roundNumber(company.expenses, 1);
		}

		let prodVals = company.lastMine;
		
		if(prodVals.length > 0){
			let str = "";
			for(let i in prodVals){
				str += roundNumber(prodVals[i], 1) + " ";
			}
			prod.innerHTML = str;
		}

	}

	generateCompany(company){
		let item = document.createElement('div');
		item.setAttribute('class', 'company-item ' + company.name);
		



		let companyTop = document.createElement("div");
		companyTop.setAttribute('class', 'company-item-top company-row');




		let itemName = document.createElement('div');
		itemName.setAttribute('class', 'company-item-name');
		let name = "Company " + roundNumber(company.name, 0);
		itemName.innerHTML = name;

		let resets = document.createElement('div');
		resets.setAttribute("class", "company-item-reset");
		resets.innerHTML = "Resets : " + company.resets;

		companyTop.appendChild(itemName);
		companyTop.appendChild(resets);




		let cash = document.createElement('div');
		cash.setAttribute('class', 'company-item-cash company-row');
		cash.innerHTML = roundNumber(company.cash, 1);




		let companyIncome = document.createElement('div');
		companyIncome.setAttribute('class', 'company-item-income company-row');




		let expense = document.createElement('div');
		expense.setAttribute('class', 'company-item-exp');
		if(company.expenses){
			expense.innerHTML = roundNumber(company.expenses, 1);
		} else{
			expense.innerHTML = roundNumber(0, 0);
		}

		let profit = document.createElement('div');
		profit.setAttribute('class', 'company-item-profit');
		profit.innerHTML = roundNumber(company.lastProfit, 1);

		companyIncome.appendChild(profit);
		companyIncome.appendChild(expense);





		let production = document.createElement('div');
		production.setAttribute('class', 'company-item-prod company-row');

		let compProd = company.lastMine;
		if(compProd.length > 0){
			let str = "";
			for(let i = 0; i < compProd.length; i++){
				str += roundNumber(compProd[i], 1) + " | ";
			}
		}

		



		item.appendChild(companyTop);
		item.appendChild(cash);
		item.appendChild(companyIncome);
		item.appendChild(production);

		return item;
	}

	updateSellButtons(){
		for(let i = 0; i < this.prospectSellButtons.length; i++){
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