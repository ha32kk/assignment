import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ProductsService} from "../products.service";

@Component({
	selector: 'app-category-table',
	templateUrl: './category-table.component.html',
	styleUrls: ['./category-table.component.css']
})
export class CategoryTableComponent implements OnInit {

	@Input() category: string

	errorMessage = undefined
	data = undefined
	lastUpdated

	constructor(public products: ProductsService) {

	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if(changes.category) {
			this.data = undefined
			this.errorMessage = undefined
			this.products.getProducts(this.category).then((res) => {
				this.data = res.categories
				this.lastUpdated = res.updated
			}).catch(err => {
				this.errorMessage = "Fetching category failed"
				console.error(err)
			});
		}
	}


}
