import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Observable
import { Observable } from 'rxjs/Observable';

import { CountryCache } from './CountryCache';

/*
  Generated class for the CountryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CountryServiceProvider {
    
  countriesUrl: string = "https://restcountries.eu/rest/v2/all";
  countryQueryUrl: string = "https://restcountries.eu/rest/v2/name/";
    
  countries: any = new Array();

  constructor(public http: Http) {
      this.countries = this.loadCountries();
  }
    
    getCountries() {
        this.http.get(this.countriesUrl).map(res => res.json()).subscribe(data => {
            this.saveCountries(data);
            this.countries = this.loadCountries();
        },
        err => {
            this.countries = this.loadCountries();
        });
    }
    
    loadCountries() : any {
        let storedCountriesString = localStorage.getItem("countries");
        let storedCountries = new Array();
        
        if (storedCountriesString === null)
        {
            storedCountries = CountryCache.countries;
            localStorage.setItem("countries", JSON.stringify(storedCountries));
        }
        else 
        {
            storedCountries = JSON.parse(storedCountriesString);
        }
        
        return storedCountries;
    }
    
    saveCountries(countries : any) {
        localStorage.setItem('countries', JSON.stringify(countries));
    }
    
    searchCountries(query : string) : Array<any> {
        let result = new Set<any>();
        
        for (let country of this.countries) 
        {
            if (country.name.toLowerCase().includes(query.toLowerCase())) result.add(country);
            if (country.capital.toLowerCase().includes(query.toLowerCase())) result.add(country);
        }
        
        return Array.from(result);
    }
}
