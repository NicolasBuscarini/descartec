﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService } from '../../../domain/services/account.service';
import { AlertService } from '../../../domain/services/alert.service';
import { AddressService, Address } from 'src/app/domain/services/address.service';
import { Alert } from 'src/app/models/alert';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
	form!: FormGroup;
	loading = false;
	submitted = false;
	showAddressFields = false;

	address: Address | null = null;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private accountService: AccountService,
		private alertService: AlertService,
		private addressService: AddressService
	) { }

	ngOnInit() {
		this.form = this.formBuilder.group({});

		this.form = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			username: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(6)]],
			passwordConfirm: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			phoneNumber: ['', Validators.required],
			cep: ['', Validators.required],
			logradouro: ['', Validators.required],
			complemento: [''],
			bairro: ['', Validators.required],
			localidade: ['', Validators.required],
			uf: ['', Validators.required],
			ibge: [''],
			ddd: ['']
		}/*, { validator: this.checkPasswords }*/);

		this.form.get('cep')?.valueChanges.subscribe(value => {
			if (value && value.length === 8 && value.includes('-')) { return console.log(value) }
			if (value && value.length === 8) {
				//this.alertService.info('Buscando endereço...');
				this.addressService.getAddressByCep(value).subscribe( { next: (address) => {

					this.address = address;
					if (!address.logradouro) {
						this.alertService.error('CEP não encontrado.');
						this.showAddressFields = false;
						return;
					}
					this.showAddressFields = true;

					this.form.patchValue({
						logradouro: address.logradouro,
						bairro: address.bairro,
						localidade: address.localidade,
						uf: address.uf,
					});
				},
				error: (error) => {
					this.alertService.error(error);
					this.showAddressFields = false;
				}			
			});
			} else {
				this.showAddressFields = false;
			}
		});
	}

	checkPasswords() {
		const password = this.f['password'].value;
		const passwordConfirm = this.f['passwordConfirm'].value;

		return password === passwordConfirm ? null : { notMatch: true };
	}

	// convenience getter for easy access to form fields
	get f() { return this.form.controls; }

	onSubmit() {
		this.submitted = true;

		// reset alerts on submit
		this.alertService.clear();

		// stop here if form is invalid
		if (this.form.invalid) {
			return;
		}

		this.loading = true;
		this.accountService.register(this.form.value)
			.pipe(first())
			.subscribe({
				next: () => {
					this.alertService.success('Registration successful', { keepAfterRouteChange: true });
					this.router.navigate(['../login'], { relativeTo: this.route });
				},
				error: error => {
					this.alertService.error(error);
					this.loading = false;
				}
			});
	}

	formatarCep(event: any) {
		let cep = event.target.value.replace(/\D/g, '');

		if (cep.length > 8) {
			cep = cep.substr(0, 8);
		}

		if (cep.length === 8) {
			event.target.value = `${cep.substr(0, 5)}-${cep.substr(5, 3)}`;
		} else {
			event.target.value = cep;
		}
	}
}