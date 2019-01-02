function getRandomInc(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Upgrade {
	constructor(inc) {
		this.name = "UPGRADE SAMPLE";
		this.upgrade = null;
		this.description = "UPGRADE DESCRIPTION SAMPLE";
		this.cost = 0;
		this.inc = inc;
		this.drawn = false;
	}
}
class ProspectUpgrade extends Upgrade {
	//Not sure if i really want to pass /all/ of this information around? 
	constructor(inc) {
		super(inc);
		this.maxCost = (this.inc.moneyManager.money + 20000) / 2 * 1.5; 
		this.upgrades = [
			{
				name: 'Divination Rods',
				description: 'Give human prospectors divination rods, increasing their prospecting efficiency by a random percentage (5% - 20%)',
				effects: [{
					array: this.inc.prospectorsEff,
					type: 0,
					action: 'mult',
					value: [0.02, 0.08]
				}],
			},
			{
				name: 'Metal Detectors',
				description: 'Give human prospectors metal detectors, increasing their efficiency by 30%, also increases the amount of Iron found',
				effects: [
					{
						array: this.inc.prospectorsEff,
						type: 0,
						action: 'mult',
						value: [0.15]
					},
					{
						array: this.inc.prospect_canvas.genCoeffs,
						type: 0,
						action: 'mult',
						value: [0.05]
					}
						 ],
			},
			{
				name: 'Lubricate Robots',
				description: 'Lubricate the wheels of all robototic prospectors, increaing their efficiency',
				effects: [{
					array: this.inc.prospectorsEff,
					type: 1,
					action: 'mult',
					value: [0.15]
				}]
			}
		];
	}
	
	initUpgrade() {
		//Pick a random upgrade and description.
		let index = getRandomInc(0, this.upgrades.length - 1);
		this.upgrade = this.upgrades[index];
		this.name = this.upgrade.name;
		this.description = this.upgrade.description;
		this.cost = getRandomInc(this.maxCost / 3, this.maxCost);
		
		return new ProspectUpgradeSimple(this.cost, this.upgrade, this.inc);
	}
	
}

class ProspectUpgradeSimple{
	constructor(cost, upgrade, inc){
		this.cost = cost; 
		this.upgrade = upgrade;
		this.name = this.upgrade.name;
		this.description = this.upgrade.description;
		this.drawn = false;
		this.inc = inc;
	}
}
