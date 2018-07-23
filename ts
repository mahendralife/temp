import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup, FormArray, FormArrayName,
  FormGroupDirective, FormBuilder,
  Validators} from '@angular/forms';
  import {config} from 'app/config';
  import { Helpers } from 'app/inner-pages/mortgage/mortgage-calculator/helpers';
  import {RestService} from 'app/rest-service/rest.service';

  @Component({
    selector: 'app-debt-consolidation',
    templateUrl: './debt-consolidation.component.html',
    styleUrls: ['./debt-consolidation.component.css']
  })

  export class DebtConsolidationComponent implements OnInit {

    types = [ 'Credit card',  'Automobile',  'Line of credit',  'Second mortgage', 'Other debt' ];
    form: FormGroup;
    locationId = config.locationId;
    term = 0;

    total = {
      debt_outstanding : 0,
      total_payment : 0
    };

    result = {
      remaining_balance : 0,
      current_value : 0,
      total : 0
    };
    rateType = 'variable';
    refinance_penalty;

    stateList = [];
    activeLocation = <any>{};
    isProcessing = false;
    providers = [];
    currentDate = new Date();
    amortization_period = 0;
    helpers = new Helpers();
    equity_cash = 0;
    totalDebt;

    constructor(private fb: FormBuilder, private HTTP: RestService ) {}
 
    ngOnInit() {
      this.getProviders();
      this.createForm();
      this.activeLocation = window['default_location'];

     // this.form.controls.states.setValue(this.activeLocation.name);
      this.HTTP.updateLocation.subscribe(loc => {
     
      
      this.locationId = Object.keys(loc).length > 0 ? loc : config.locationId;


      let locName = this.locationId.name;
      if(this.locationId.code){
        locName += '(' + this.locationId.code + ')';
      }
      
      this.form.controls.states.setValue(locName);

    });    
     // this.form.controls.states.setValue(this.activeLocation.name);
      this.form.controls.states.valueChanges
      .debounceTime(400)
      .subscribe(searchText => {
        if (searchText) {
          this.isProcessing = true;
          this.HTTP.GET('GetCityList', {city: searchText})
          .subscribe( response =>  {
            this.isProcessing = false;
            this.stateList = response['output'];
          });
        } else {
          this.isProcessing = false;
          this.stateList = [];
        }
      });

      this.form.controls.rateType.valueChanges.debounceTime(400).subscribe(val => this.calculate_penalty());

    }

    getProviders() {
      this.HTTP.GET('ListMortgageProviders', {})
      .subscribe( response =>  {
        this.providers = response['output'];
      });
    }

    selectedLocation() {
      if ( this.form.controls.states.value ) {

        this.activeLocation = {
          _id: this.form.controls.states.value._id,
          name: this.form.controls.states.value.name,
          common_name: this.form.controls.states.value.province.common_name,
          code: this.form.controls.states.value.province.code,
          slug: this.form.controls.states.value.slug,
        };

        this.calculate_penalty();
        this.form.controls.states.setValue(this.form.controls.states.value.name);
      }

    }

    clear(fields) {
      fields.setValue('');
    }

    disabledInput () {
      if (this.form.controls.estimate_checked.value) {
        this.form.controls.mortgage_balance.disable();
      } else {
        this.form.controls.mortgage_balance.enable();
      }
    }

    disabledInputs () {
      if (this.form.controls.mortgage_payment_help.value) {
        this.form.controls.current_mortgage_balance.disable();
      } else {
        this.form.controls.current_mortgage_balance.enable();
      }
    }

    initItemRows() {
      return this.fb.group({
        type: ['Credit card'],
        debt_outstanding: [''],
        annual_interest : [''],
        monthly_payment: ['']
      });
    }

    deleteRow(index: number) {
      const control = <FormArray>this.form.controls['itemRows'];
      control.removeAt(index);
      this.calculate_penalty();
      this.calculate_deb();
    }

    addNewRow() {
      const control = <FormArray>this.form.controls['itemRows'];
      control.push(this.initItemRows());
    }
    createForm() {
      const currencyWithDots = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/;

      this.form = new FormGroup({
        'mortgage_balance'  : new FormControl('', [ Validators.pattern(currencyWithDots) ]),
        'estimate_checked'  : new FormControl(''),
        'providers'  : new FormControl(''),
        'mortgage_payments'  : new FormControl(''),
        'current_mortgage_balance'  : new FormControl(''),
        'original_mortgage_balance'  : new FormControl(''),
        'existing_mortgage_rate'  : new FormControl(''),
        'receive_mortgage_balance'  : new FormControl(''),
        'current_mortgage_payment'  : new FormControl(''),
        'remaining_mortgage_balance'  : new FormControl(''),
        'states'  : new FormControl(''),
        'amortization_period'  : new FormControl(''),
        'rateType'  : new FormControl('variable'),
        'mortgage_payment_help'  : new FormControl(''),
        'frequency'               : new FormControl('monthly'),
        'current_value'           : new FormControl('',   [Validators.pattern(currencyWithDots)]),
        'remaining_balance'       : new FormControl('',   [Validators.pattern(currencyWithDots)]),
        itemRows: this.fb.array([this.initItemRows()])

      });

    }

    calculate_deb() {

      let debt_outstanding = 0;
      let monthly_payment = 0;

      for ( let key in this.form.value.itemRows ) {
        debt_outstanding += parseFloat(this.form.value.itemRows[key].debt_outstanding);
        monthly_payment += parseFloat(this.form.value.itemRows[key].monthly_payment);
      }


        this.total.debt_outstanding = debt_outstanding;
        this.total.total_payment = monthly_payment;


      this.calculate_penalty();
    }


    equity_cash_change(ev)  {
      this.equity_cash= ev.from ;
      this.calculate_penalty();

    }

    calculateResult() {

      let data = this.form.value;
      let percentage = this.helpers.getPercentage(data.current_value, 80);

      this.result.current_value = parseFloat(data.current_value);
      this.result.remaining_balance = parseFloat(data.remaining_balance);
      this.result.total = (percentage - data.remaining_balance) || 0;

      if (this.result.remaining_balance) {
        this.form.controls.mortgage_balance.setValue(this.result.remaining_balance);
      }

      this.calculate_penalty();
    }

    original_term_change(ev) {

      this.term = ev.from;
      this.calculate_penalty();

    }

    calculate_penalty() {

      this.refinance_penalty = this.helpers.calculate_penalty({
        term: this.term,
        old_mortgage_rate: this.form.value.mortgage_old_rate || 0,
        mortgage_balance: (this.form.value.mortgage_balance || this.form.value.original_mortgage_balance) || 0,
        mortgage_rate: this.form.value.existing_mortgage_rate || 0,
        rateType: this.form.value.rateType || null,
        location: this.activeLocation,
        provider: this.form.value.providers
      });
      if (this.refinance_penalty ) {
        this.refinance_penalty = this.refinance_penalty.toFixed(2);
      }

    if (this.form.controls.estimate_checked.value === true) {

      const rates = (this.form.value.mortgage_balance || this.form.value.original_mortgage_balance) || 0;
      const R = this.form.value.existing_mortgage_rate;

      let  emi = this.helpers.EMICalculatorMonthly(rates, R, (this.amortization_period || 5) ) || 0;

      this.form.controls.current_mortgage_balance.setValue(emi || 0);
      this.form.controls.current_mortgage_payment.setValue(emi || 0);

        if ( this.form.value.original_mortgage_balance ) {
          let bal = this.form.value.original_mortgage_balance  - emi ;
          this.form.controls.mortgage_balance.setValue(bal);
        }

      if (this.form.value.original_mortgage_balance) {
        this.form.controls.remaining_mortgage_balance.setValue((this.form.value.original_mortgage_balance - emi));
      }
    }


      this.totalDebt = 0;
  
         this.totalDebt +=  this.total.debt_outstanding ;
  
      // if (this.refinance_penalty ) {
        this.totalDebt += parseFloat(this.refinance_penalty );
      // }

      // if (this.equity_cash ) {
        this.totalDebt += this.equity_cash ;
      // }

      // if (this.result.remaining_balance ) {
        this.totalDebt += this.result.remaining_balance ;
      // }

    }

    changeProvider() {
      this.calculate_penalty();
    }

    amortization_period_change(ev) {

      this.amortization_period = ev.from;
      this.calculate_penalty();
    }

  }
