import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { County } from '../common/county';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartFormService {
  private countriesUrl = environment.webshopApiUrl + '/countries';
  private countiesUrl = environment.webshopApiUrl + '/counties';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getCounties(countryCode: string): Observable<County[]> {
    const searchCountiesUrl = `${this.countiesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseCounties>(searchCountiesUrl).pipe(
      map(response => response._embedded.counties)
    );
  }

  //using observable cause angular components will subscribe to this method
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for(let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 15;

    for(let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseCounties {
  _embedded: {
    counties: County[];
  }
}