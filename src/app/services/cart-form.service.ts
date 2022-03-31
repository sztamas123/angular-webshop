import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { County } from '../common/county';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartFormService {
  private countriesUrl = 'http://localhost:8080/api/countries';
  private countiesUrl = 'http://localhost:8080/api/counties';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getCounties(theCountryCode: string): Observable<County[]> {
    const searchCountiesUrl = `${this.countiesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseCounties>(searchCountiesUrl).pipe(
      map(response => response._embedded.counties)
    );
  }

  //using observable cause angular components will subscribe to this method
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 15;

    for(let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
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