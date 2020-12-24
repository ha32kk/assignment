import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class ProductsService {

	constructor(private http: HttpClient) {}

	async getProducts(category: string): Promise<any> {
		return await this.http.get("api/category/" + category).toPromise();
	}
}
