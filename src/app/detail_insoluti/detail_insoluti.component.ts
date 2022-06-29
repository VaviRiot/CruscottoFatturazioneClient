import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WizardFormComponent } from 'app/wizardform/wizard-form.component';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-detail_insoluti',
  templateUrl: './detail_insoluti.component.html',
  styleUrls: ['./detail_insoluti.component.css'],
  animations: [
    trigger('pictureChange', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown => hidden', animate('100ms')),
      transition('hidden => shown', animate('3000ms')),
    ])
  ]
})
export class DetailInsolutiComponent implements OnInit {
  public profileForm: FormGroup;
  public wizardPictureUrl = 'assets/img/default-avatar.png';
  public wizardPictureUrlState = 'shown';

  public profileTypeOptions: any = [{
    'class': 'col-sm-6',
    value: 'Person',
    label: 'Personal',
    icon: 'person',
  }, {
    'class': 'col-sm-6',
    value: 'Business',
    label: 'Business',
    icon: 'business',
  }];

  public legalRepresentatives: any = [
    'Juan Rodriguez',
    'Pedro Garcia',
    'Rodrigo Gutierrez'
  ];

  constructor(private fb: FormBuilder) {
     this.createForm();
  }

  ngOnInit(): void {
  
  }

  ///Istanzia la form
  private createForm() {
    this.profileForm = this.fb.group({
      type: this.fb.group({
        type: [''],
      }),
      aboutPerson: this.fb.group({
        profilePicture: '',
        name: [''],
        lastName: [''],
        email: [''],
      }),
      aboutBusiness: this.fb.group({
        name: [''],
        legalRepresentative: [''],
      }),
      aboutDummy: null, // Dummy step to maintain an about title visible
      // before select a type of profile
      address: this.fb.group({
        street: [''],
        number: [''],
        extension: '',
        city: ['']
      })
    });
  }

  public displayBootstrapClass(field: string) {
    return WizardFormComponent.displayBootstrapClass(this.profileForm, field);
  }

  public profilePictureRead(event, imgElement) {
    const uploadPromise = WizardFormComponent.updatePicturePreview(event, imgElement);
    uploadPromise.then((file) => {
      // file will contain the event.target.files[0] data
      // Here you can post the file to the server or whatever you need to do
      // with it
      console.log('build-profile.component, file "uploaded"', file);
    }).catch(() => {
      console.log('build-profile.component, file "upload" FAIL');
    });
  }

  public onSubmit(evt) {
    console.log(evt);
  }

}