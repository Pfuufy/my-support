import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SimpleResponse } from 'src/app/shared/models/interfaces';
import { StateService } from './../services/state/state.service';
import { HttpService } from '../services/http/http.service';

import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage implements OnInit, OnDestroy {
    loginForm: FormGroup;
    private subs = new Subscription();

    constructor(private fb: FormBuilder,
                private router: Router,
                private httpService: HttpService,
                private stateService: StateService) { }

    ngOnInit() {
        this.initForm();
    }

    initForm(): void {
        this.loginForm = this.fb.group({
            email: [null, Validators.required],
            password: [null, Validators.required]
        });
    }

    submitForm(form: FormGroup): void {
        this.subs.add(
            this.httpService.post(form.value, 'login').subscribe(this.handleLoginRes.bind(this))
        );
    }

    handleLoginRes(res: SimpleResponse): void {
        if (res.success) {
            const body = res.body;
            this.stateService.user = body.user;
            this.stateService.personSupporting = body.user.personSupporting;
            this.stateService.unclaimedRequests = body.unclaimedRequests;
            this.router.navigate(['/tabs/dashboard']);
        }
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
