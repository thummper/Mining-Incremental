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
		this.money = 50000;
		//Prospectors
		this.prospectButtons = [];
		this.prospectorsCount = [0, 0, 0];
		this.prospectorsCost = [3000, 25000, 1000000];
		this.prospectorsEff = [0.35, 0.80, 1.6];
		this.prospectorsCoeff = [300, 490, 800];
		this.prospectAmount = 0;
		this.prospectUpgrades = [];

		//Mining Equipment
		this.miningButton; 
		this.miningCount = 0;
		this.miningCost = 500;
		this.miningEff = 1;
		this.miningCoeff = 100;
		
		//Ore 
		this.oreReserves = [0, 0, 0, 0];
		this.unrefOre = [0, 0, 0, 0];
		this.refOre = [0, 0, 0, 0];
		//Start by updating
		this.updater = new Updater(this);
		
		//Sliders
		this.miningVals = [0, 0, 0, 0];
		this.sliderContainer = document.getElementById('mining-sliders');
		this.sliderLabels = this.sliderContainer.getElementsByTagName('label');
		this.sliders = this.sliderContainer.getElementsByTagName('input');
		this.setupSliders();
		
	}
	
	setupSliders(){
		for(let i = 0, j = this.sliders.length; i < j; i++){
			let slider = this.sliders[i];
			slider.oninput = function(e){
				this.updateSliders();
			}.bind(this);
		}
	}
	updateSliders(){
		//Set max of all sliders.
		console.log("Max slider: ", this.miningCount);
		let maxsliders = this.miningCount;
		let currentUsed = 0; 
		
		//Work out the current used slots of input.
		for(let i = 0, j = this.sliders.length; i < j; i++){
			let slider = this.sliders[i];
			let val = parseInt(slider.value);
			currentUsed += val;
		}
		
		let slidersLeft = maxsliders - currentUsed;
		console.log("Current Sliders: ", currentUsed);
		console.log("Sliders left: ", slidersLeft);
		//Set slider max
		for(let i = 0, j = this.sliders.length; i < j; i++){
			let slider = this.sliders[i];
			slider.max = slidersLeft + parseInt(slider.value);
			let lbls = this.sliderLabels[i].getElementsByTagName('span');
			console.log(lbls)
			lbls[0].innerHTML = slider.value;
			this.miningVals[i] = parseInt(slider.value);
			lbls[1].innerHTML = slider.max;
			//Also set tooltip in label?
		}
		
		console.log(this.miningVals);
		
	}
	

	start() {
		//Start
		//Set up event listeners 
		this.miningButton = document.getElementById('mineButton');
		this.prospectButtons = document.getElementsByClassName('prospect-buttons')[0].children;
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
			button.addEventListener('click', function(e){
				this.buttonClick(e, 'prospect');
			}.bind(this));
		}
		this.miningButton.addEventListener('click', function(e){
			this.buttonClick(e, 'mining');
		}.bind(this));
	}
	
	buttonClick(event, type){
		let button = event.currentTarget;
		let buttonParent = button.parentElement;
		let allButtons = buttonParent.children;
		for(let i = 0, j = allButtons.length; i < j; i++){
			let btn = allButtons[i];
			if(button == btn){
				console.log("Button ", i, " clicked");	
				this.handleBuy(i, type);
			}
		}	
	}
	handleBuy(index, type){
		
		console.log("Buying: ", type);
		if(type == 'prospect'){
			let cost = this.prospectorsCost[index];
			if(this.money >= cost){
				this.money -= cost; 
				this.prospectorsCount[index]++;
				let costInc = Math.log(this.prospectorsCount[index] + 1) * this.prospectorsCoeff[index];
				this.prospectorsCost[index] += costInc;
			}	
		}
		if(type == 'mining'){
			let cost = this.miningCost;
			if(this.money >= cost){
				this.money -= cost;
				this.miningCount++;
				let costInc = Math.log(this.miningCount + 1) * this.miningCoeff;
				this.miningCost += costInc;
				this.updateSliders();
			}
		}
		this.updater.update();
		
	}
	incLoop() {
		this.money += this.money_canvas.moneyGen;
		this.money_canvas.moneyGen = 0;
		this.prospect();
		this.mine();
		this.updater.update();
	}
	mine(){
		for(let i = 0; i < this.miningVals.length; i++){
			let toMine = this.miningVals[i];
			let mineTotal = toMine * this.miningEff;
			if(this.oreReserves[i] > 0){
				if(this.oreReserves[i] > mineTotal){
					this.oreReserves[i] -= mineTotal;	
					this.unrefOre[i] += mineTotal;
				} else {
					this.unrefOre[i] += this.oreReserves[i];
					this.oreReserves[i] = 0;
				}
			}	
		}
	}

	prospect() {
		this.prospectAmount = 0;
		for(let i = 0, j = this.prospectorsCount.length; i < j; i++){
			this.prospectAmount += (this.prospectorsCount[i] * this.prospectorsEff[i]);
		}
		let oreFound = this.prospect_canvas.prospect(this.prospectAmount);
		for(let i = 0, j = oreFound.length; i < j; i++){
			this.oreReserves[i] += oreFound[i];
		}
		this.prospect_canvas.oreFound = [0, 0, 0, 0];
	}

}
