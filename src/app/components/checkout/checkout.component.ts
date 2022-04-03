import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { County } from 'src/app/common/county';
import { CartFormService } from 'src/app/services/cart-form.service';
import { WebshopValidators } from 'src/app/validators/webshop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] =[];
  creditCardMonths: number[] = []
  countries: Country[] = [];
  shippingAddressCounties: County[] = [];
  billingAddressCounties: County[] = [];

  constructor(private formBuilder: FormBuilder,
              private cartFormService: CartFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2),
                                  WebshopValidators.whitespaceValidator]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2),
                                  WebshopValidators.whitespaceValidator]),
        email: new FormControl('', [Validators.required, 
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                WebshopValidators.whitespaceValidator]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                              WebshopValidators.whitespaceValidator]),
        county: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                WebshopValidators.whitespaceValidator])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                WebshopValidators.whitespaceValidator]),
        county: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                              WebshopValidators.whitespaceValidator]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                WebshopValidators.whitespaceValidator])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.minLength(2),
                              WebshopValidators.whitespaceValidator]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    
    const startMonth: number = new Date().getMonth() + 1;
    this.cartFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    this.cartFormService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    this.cartFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

  }

  onSubmit() {
    console.log(this.checkoutFormGroup.get('customer')?.value);
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
  }

  //not working properly
  copyShippingToBilling(event) {
    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressCounties = this.shippingAddressCounties;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressCounties = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;
    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
      this.cartFormService.getCreditCardMonths(startMonth).subscribe(
        data => {
          this.creditCardMonths = data;
        }
      );
    }
  }

  getCounties(FormGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(FormGroupName);
    const countryCode = formGroup?.value.country.code;

    this.cartFormService.getCounties(countryCode).subscribe(
      data => {
        if(FormGroupName === 'shippingAddress'){
          this.shippingAddressCounties = data
        }
        else {
          this.billingAddressCounties = data;
        }

        formGroup?.get('county')?.setValue(data[0]);
      }
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingCounty() {
    return this.checkoutFormGroup.get('shippingAddress.county');
  }
  get shippingCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get shippingZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get billingStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingCounty() {
    return this.checkoutFormGroup.get('billingAddress.county');
  }
  get billingCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get cardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get cardName() {
    return this.checkoutFormGroup.get('creditCard.name');
  }
  get cardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get cardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

}
