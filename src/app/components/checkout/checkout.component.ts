import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { County } from 'src/app/common/county';
import { CartFormService } from 'src/app/services/cart-form.service';

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
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        county: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        county: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        name: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
    //populate card months and years dropdown
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
  }

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

  getStates(FormGroupName: string) {
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

}
