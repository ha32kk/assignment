import * as superagent from "superagent"

const API_URL = "https://bad-api-assignment.reaktor.com/v2/"
const CATEGORIES = ["beanies", "facemasks", "gloves"]

// Contains the most recently fetched product listing for the category
export let categories = new Map<string, Product[]>()
export let last_update = -1

interface Product {
	id: string
	type: string
	name: string
	color: string[]
	price: number
	manufacturer: string
	stock?: string
}

const manufacturers_queried = new Map<string, Promise<void>>() // Manufacturer name - Resolves when manufacturer stock info has been refreshed
const manufacturer_stock = new Map<string, Map<string, string>>() // Manufacturer name - product id - stock availability

const refresh_manufacturer = async(manufacturer: string): Promise<void> => {
	try {
		const response = await superagent.get(API_URL + "availability/" + manufacturer)
		if(response.body.response == "[]") {
			// We assume that this is a bug in legacy API that occasionally happens, and stock is actually available, and just use the last stock info retrieved
			return
		}
		const availability = new Map<string, string>()
		for(let entry of response.body.response) {
			const in_stock = entry.DATAPAYLOAD.substring(entry.DATAPAYLOAD.indexOf("<INSTOCKVALUE>") + 14,
				entry.DATAPAYLOAD.indexOf("</INSTOCKVALUE>"))
			availability.set(entry.id.toLowerCase(), in_stock)
		}
		manufacturer_stock.set(manufacturer, availability)
	} catch(e) {
		console.error("Error while querying a manufacturer ", e)
	}
}

const refresh_category = async(category: string): Promise<Product[]> => {
	const response = await superagent.get(API_URL + "products/" + category)
	for(let product of response.body) {
		if(!manufacturers_queried.has(product.manufacturer)) {
			manufacturers_queried.set(product.manufacturer, refresh_manufacturer(product.manufacturer))
		}
	}
	for(let product of response.body) {
		await manufacturers_queried.get(product.manufacturer)
		if(manufacturer_stock.has(product.manufacturer))
			product.stock = manufacturer_stock.get(product.manufacturer)!.get(product.id)
	}
	return response.body
}

/**
 * Refresh all data from the legacy API after previous refresh completes or after interval, whichever happens latter
 * @param interval Time to wait in milliseconds
 */
const refresh_data = async(interval: number): Promise<void> => {
	const start = new Date().getTime()

	const new_categories = new Map<string, Product[]>()
	manufacturers_queried.clear()
	await Promise.all(CATEGORIES.map(category => refresh_category(category)
		.then(products => new_categories.set(category, products))
		.catch(e => console.error("Error while fetching a category ", category, e))))

	// Delete manufacturers that no longer exist in any product
	for(let manufacturer in manufacturer_stock.keys())
		if(!manufacturers_queried.has(manufacturer))
			manufacturer_stock.delete(manufacturer)

	categories = new_categories
	last_update = start
	setTimeout(() => refresh_data(interval), Math.max(0, start + interval - new Date().getTime()))
}

refresh_data(5 * 60 * 1000)
