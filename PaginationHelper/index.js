/** @format */

function PaginationHelper(collection, itemsPerPage) {
	(this.collection = collection), (this.itemsPerPage = itemsPerPage);
}

PaginationHelper.prototype.itemCount = function () {
	return this.collection.length;
};

PaginationHelper.prototype.pageCount = function () {
	return Math.ceil(this.collection.length / this.itemsPerPage);
};

PaginationHelper.prototype.pageItemCount = function (pageIndex) {
	return pageIndex < this.pageCount()
		? Math.min(
				this.itemsPerPage,
				this.collection.length - pageIndex * this.itemsPerPage
		  )
		: -1;
};

PaginationHelper.prototype.pageIndex = function (itemIndex) {
	return itemIndex < this.collection.length && itemIndex >= 0
		? Math.floor(itemIndex / this.itemsPerPage)
		: -1;
};

// class PaginationHelper {
// 	constructor(collection, itemsPerPage) {
// 		this.collection = collection;
// 		this.itemsPerPage = itemsPerPage;
// 		this.pages = Math.ceil(collection.length / itemsPerPage);
// 	}

// 	itemCount() {
// 		return this.collection.length;
// 	}

// 	pageCount() {
// 		return this.pages;
// 	}

// 	pageItemCount(pageIndex) {
// 		if (pageIndex >= this.pages || pageIndex < 0) {
// 			return -1;
// 		} else if (pageIndex === this.pages - 1) {
// 			return this.collection.length % this.itemsPerPage;
// 		} else {
// 			return this.itemsPerPage;
// 		}
// 	}

// 	pageIndex(itemIndex) {
// 		if (itemIndex >= 0 && itemIndex < this.collection.length) {
// 			return Math.max(Math.ceil(itemIndex / this.itemsPerPage) - 1, 0);
// 		} else {
// 			return -1;
// 		}
// 	}
// }
