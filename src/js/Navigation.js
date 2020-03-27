// TODO: On scroll, once money is off the screen, transform resource info to smaller static bar. 

export default class Navigation {
    constructor(navItems, navExpand) {
        this.items = navItems;
        this.expand = navExpand;
        this.collapsed = false;
    }
    init() {
        this.checkWidth();
        window.addEventListener("resize", this.checkWidth.bind(this));
        console.log(this.expand);
        this.expand.addEventListener("click", function () {
            if(this.collapsed){
                this.showItems();
                this.collapsed = false;
            } else {
                this.hideItems();
                this.collapsed = true;
            }
            console.log("clicked");
        }.bind(this), false);
    }
    
    checkWidth() {
        if (window.innerWidth <= 900 && this.collapsed == false) {
            // We should collapse the navbar 
            this.hideItems();
            this.collapsed = true;
            // Hide all nav items except for first, show the expand icon.
        } else if (window.innerWidth >= 900) {
            this.showItems();
            this.collapsed = false;
        }
    }

    showItems() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].style.display = "flex";
        }
    }

    hideItems() {
        for (let i = 0; i < this.items.length; i++) {
            if (i != 0) {
                this.items[i].style.display = "none";
            }
        }
    }
}