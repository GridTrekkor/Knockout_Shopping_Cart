$(function() {

    function AppViewModel() {

        var self = this;

        // set initial vars
        self.itemsInCart = ko.observableArray([]);
        self.itemName = ko.observable("");
        self.itemPrice = ko.observable("1.00");
        self.totalPrice = ko.observable("0.00");
        self.itemQuantity = ko.observable(1);
        self.showTable = ko.observable(false);
        self.subTotal = ko.observable("0.00");

        self.nameError = ko.observable(false);
        self.numberError = ko.observable(false);
        self.doNotAdd = ko.observable(false);

        // add new item to array
        self.addItem = function(data) {

            self.newItem = {};
            self.newItem.itemName = data.itemName();
            self.newItem.itemPrice = ko.observable(data.itemPrice());
            self.newItem.itemQuantity = ko.observable(1);

            // check for errors
            var checkIsNan = isNaN(parseFloat(self.newItem.itemPrice()));
            if (!self.newItem.itemName) {
                self.nameError(true);
                self.doNotAdd(true);
            } else if (0 >= parseFloat(self.newItem.itemPrice()) || checkIsNan) {
                self.numberError(true);
                self.doNotAdd(true);
                self.itemPrice("1.00");
            } else { // reset error checkers if OK
                self.nameError(false);
                self.numberError(false);
                self.doNotAdd(false);
            }

            if (!self.doNotAdd()) {
                self.itemsInCart.push(self.newItem);

                self.nameError(false);
                self.numberError(false);
                self.doNotAdd(false);

                // alphabetize item array by itemName
                self.itemsInCart.sort(function (a, b) {
                    if (a.itemName.toLowerCase() > b.itemName.toLowerCase()) {
                        return 1;
                    }
                    if (a.itemName.toLowerCase() < b.itemName.toLowerCase()) {
                        return -1;
                    }
                    return 0;
                });

                // recalculate total price after adding new item
                self.getTotalPrice();

                // show table and reset form
                self.showTable(true);
                self.itemName("");
                self.itemPrice("1.00");

            }

        };

        // calculate total price
        self.getTotalPrice = function() {
            var i = 0;
            var tempTotal = 0;
            while (i < self.itemsInCart().length) {
                tempTotal += self.itemsInCart()[i].itemPrice() * parseInt(self.itemsInCart()[i].itemQuantity());
                i++;
            }
            self.totalPrice(tempTotal.toFixed(2));
        };

        // remove item, recalculate total, hide table if no items
        self.removeItem = function(item) {
            self.itemsInCart.remove(item);
            self.getTotalPrice();
            if (!self.itemsInCart().length) {
                self.showTable(false);
            }
        };

        // update item quantity
        self.updateQuantity = function(data) {
            self.getTotalPrice();
        };



        // force two decimal places in prices
        self.showDecimal = function() {
            var tempPrice = self.itemPrice();
            self.itemPrice(parseFloat(tempPrice).toFixed(2));
        }

    }

    var AVM = new AppViewModel();
    ko.applyBindings(AVM);

});